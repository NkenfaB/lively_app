import { Asset } from 'expo-asset';
import { loadTensorflowModel, type TensorflowModel } from 'react-native-fast-tflite';

import { baselineCnnModel, mobilenetv2ScreeningModel } from './modelAsset';
import { getActiveModelUri } from './modelManager';

// Threshold tuned on validation set to maximise COVID recall (sensitivity).
const SCREENING_COVID_THRESHOLD = 0.35;

let cachedBaseline: TensorflowModel | null = null;
let cachedScreening: TensorflowModel | null = null;

async function loadModel(
  moduleAsset: unknown,
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

/** Force a re-load on next inference (e.g. after installing a new OTA model). */
export function invalidateModelCache() {
  cachedBaseline = null;
  cachedScreening = null;
}

export type ModelOutput = { covidProb: number; healthyProb: number; covidFlag: boolean };

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
