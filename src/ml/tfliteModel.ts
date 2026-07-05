import { Asset } from 'expo-asset';
import { loadTensorflowModel, type TensorflowModel } from 'react-native-fast-tflite';

import { baselineCnnModel, mobilenetv2ScreeningModel, baseline3ClassModel, coughClassifier3ClassModel } from './modelAsset';
import { getActiveModelUri } from './modelManager';

// Threshold tuned on validation set to maximise COVID recall (sensitivity).
const SCREENING_COVID_THRESHOLD = 0.35;

// Default thresholds for the 3-class MobileNetV2 model.
// COVID t=0.25 → 88% recall; TB t=0.50 → 100% recall on validation set.
export const DEFAULT_COVID_THRESHOLD = 0.25;
export const DEFAULT_TB_THRESHOLD = 0.50;

let cachedBaseline: TensorflowModel | null = null;
let cachedScreening: TensorflowModel | null = null;
let cached3Class: TensorflowModel | null = null;

async function loadModel(
  // A bundled `require('…​.tflite')` resolves to a Metro module id (number),
  // which is exactly what `Asset.fromModule` accepts.
  moduleAsset: number,
  cache: TensorflowModel | null,
  /** Optional override (e.g. OTA-downloaded path) tried first. */
  overrideUri?: string | null
): Promise<TensorflowModel> {
  if (cache) return cache;
  if (overrideUri) {
    try {
      return await loadTensorflowModel({ url: overrideUri }, []);
    } catch (e) {
      // If the OTA model fails to load (corrupt / incompatible), fall through
      // to the bundled asset rather than hard-failing inference.
      // eslint-disable-next-line no-console
      console.warn('OTA model failed to load, falling back to bundled:', e);
    }
  }
  // On Android release builds the packager URI is not a valid file path; download first.
  const asset = Asset.fromModule(moduleAsset);
  if (!asset.localUri) {
    await asset.downloadAsync();
  }
  return loadTensorflowModel({ url: asset.localUri ?? asset.uri }, []);
}

export async function getBaselineModel() {
  // Prefer any OTA-downloaded baseline model; fall back to bundled.
  const overrideUri = await getActiveModelUri().catch(() => null);
  cachedBaseline = await loadModel(baselineCnnModel, cachedBaseline, overrideUri);
  return cachedBaseline;
}

export async function getScreeningModel() {
  // Screening model is bundled-only today (OTA targets the baseline).
  cachedScreening = await loadModel(mobilenetv2ScreeningModel, cachedScreening);
  return cachedScreening;
}

export async function get3ClassModel() {
  cached3Class = await loadModel(coughClassifier3ClassModel, cached3Class);
  return cached3Class;
}

/** Force a re-load on next inference (e.g. after installing a new OTA model). */
export function invalidateModelCache() {
  cachedBaseline = null;
  cachedScreening = null;
  cached3Class = null;
}

export type ModelOutput = { covidProb: number; healthyProb: number; covidFlag: boolean };
export type ModelOutput3Class = { covidProb: number; tbProb: number; healthyProb: number; label: 'COVID' | 'TB' | 'HEALTHY' };

async function runModel(model: TensorflowModel, input: Float32Array, covidThreshold: number): Promise<ModelOutput> {
  const expectedShape = model.inputs?.[0]?.shape;
  if (expectedShape && expectedShape.length) {
    const expectedElems = expectedShape.reduce((acc, v) => acc * (v > 0 ? v : 1), 1);
    if (expectedElems !== input.length) {
      throw new Error(`Model input size mismatch: expected ${expectedElems} floats, got ${input.length}.`);
    }
  }
  // Ensure a standalone ArrayBuffer — some platforms provide a SharedArrayBuffer.
  const bytes = new Uint8Array(input.buffer, input.byteOffset, input.byteLength);
  const inputBuffer = bytes.slice().buffer;
  const outputs = await model.run([inputBuffer]);
  const out0 = outputs[0];
  if (!out0) throw new Error('Model returned no outputs.');
  const probs = new Float32Array(out0);
  if (probs.length < 2) throw new Error(`Unexpected output length: ${probs.length}`);
  const covidProb = probs[0]!;
  const healthyProb = probs[1]!;
  return { covidProb, healthyProb, covidFlag: covidProb >= covidThreshold };
}

export async function runBaselineModel(input: Float32Array): Promise<ModelOutput> {
  const model = await getBaselineModel();
  return runModel(model, input, SCREENING_COVID_THRESHOLD);
}

export async function runScreeningModel(input: Float32Array): Promise<ModelOutput> {
  const model = await getScreeningModel();
  return runModel(model, input, SCREENING_COVID_THRESHOLD);
}

/**
 * Resize a 64×256 mel spectrogram (flattened, [0,1] range) to 64×64×3 RGB
 * matching exactly what train_3class_v2.py fed into MobileNetV2:
 *   tf.image.resize(mel_64x256x1, [64,64]) → replicate across 3 channels → normalize [0,1]
 */
function melToRgb64(mel64x256: Float32Array): Float32Array {
  const N_MELS = 64, IN_FRAMES = 256, OUT_SIZE = 64;
  // Bilinear resize along the time axis: 256 → 64
  const rgb = new Float32Array(OUT_SIZE * OUT_SIZE * 3);
  for (let m = 0; m < N_MELS; m++) {
    for (let t = 0; t < OUT_SIZE; t++) {
      // Map output column t to input fractional column
      const srcT = (t + 0.5) * (IN_FRAMES / OUT_SIZE) - 0.5;
      const t0 = Math.max(0, Math.floor(srcT));
      const t1 = Math.min(IN_FRAMES - 1, t0 + 1);
      const frac = srcT - t0;
      const v0 = mel64x256[m * IN_FRAMES + t0] ?? 0;
      const v1 = mel64x256[m * IN_FRAMES + t1] ?? 0;
      const v = v0 + (v1 - v0) * frac;
      // m is the row (height), t is the column (width) — HWC layout
      const base = (m * OUT_SIZE + t) * 3;
      rgb[base] = v;
      rgb[base + 1] = v;
      rgb[base + 2] = v;
    }
  }
  return rgb;
}

export async function run3ClassModel(
  input: Float32Array,
  covidThreshold = DEFAULT_COVID_THRESHOLD,
  tbThreshold = DEFAULT_TB_THRESHOLD,
): Promise<ModelOutput3Class> {
  const model = await get3ClassModel();

  // Convert mel 64×256×1 → RGB 64×64×3 for MobileNetV2
  const rgbInput = melToRgb64(input);

  const expectedShape = model.inputs?.[0]?.shape;
  if (expectedShape && expectedShape.length) {
    const expectedElems = expectedShape.reduce((acc, v) => acc * (v > 0 ? v : 1), 1);
    if (expectedElems !== rgbInput.length) {
      throw new Error(`Model input size mismatch: expected ${expectedElems} floats, got ${rgbInput.length}.`);
    }
  }

  const bytes = new Uint8Array(rgbInput.buffer, rgbInput.byteOffset, rgbInput.byteLength);
  const inputBuffer = bytes.slice().buffer;
  const outputs = await model.run([inputBuffer]);
  const out0 = outputs[0];
  if (!out0) throw new Error('Model returned no outputs.');
  const probs = new Float32Array(out0);
  if (probs.length < 3) throw new Error(`Unexpected 3-class output length: ${probs.length}`);

  const covidProb   = probs[0]!;
  const tbProb      = probs[1]!;
  const healthyProb = probs[2]!;

  // Threshold-based decision: check COVID first (higher clinical priority),
  // then TB, else HEALTHY.
  let label: 'COVID' | 'TB' | 'HEALTHY';
  if (covidProb >= covidThreshold) {
    label = 'COVID';
  } else if (tbProb >= tbThreshold) {
    label = 'TB';
  } else {
    label = 'HEALTHY';
  }

  return { covidProb, tbProb, healthyProb, label };
}
