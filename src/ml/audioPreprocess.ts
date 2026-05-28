import FFT from 'fft.js';

type PreprocessConfig = {
  sampleRate: number;
  targetSampleRate: number;
  nMels: number;
  nFft: number;
  hopLength: number;
  winLength: number;
  fmin: number;
  fmax: number;
  maxFrames: number;
};

const DEFAULT: PreprocessConfig = {
  sampleRate: 16000,
  targetSampleRate: 16000,
  nMels: 64,
  nFft: 1024,
  hopLength: 256,
  winLength: 512,
  fmin: 50,
  fmax: 8000,
  maxFrames: 256,
};

export function preprocessForBaselineModel(
  pcm: Float32Array,
  sampleRate: number,
  config: Partial<PreprocessConfig> = {}
): Float32Array {
  const cfg: PreprocessConfig = { ...DEFAULT, ...config, sampleRate };

  let audio = pcm;
  if (cfg.sampleRate !== cfg.targetSampleRate) {
    audio = resampleLinear(audio, cfg.sampleRate, cfg.targetSampleRate);
  }

  audio = trimSilence(audio, 25);
  audio = extractLoudestSegment(audio, cfg.targetSampleRate, cfg.nFft, cfg.hopLength, 0.75, 12.0);
  audio = peakNormalize(audio);

  const logMel = computeLogMel(audio, cfg.targetSampleRate, cfg);
  const padded = padOrTruncate(logMel, cfg.maxFrames);
  const scaled = minMaxScale(padded);

  // Flatten (nMels, maxFrames) into row-major Float32Array
  const out = new Float32Array(cfg.nMels * cfg.maxFrames);
  for (let m = 0; m < cfg.nMels; m++) {
    for (let t = 0; t < cfg.maxFrames; t++) {
      out[m * cfg.maxFrames + t] = scaled[m][t];
    }
  }
  return out;
}

function resampleLinear(input: Float32Array, origSr: number, targetSr: number) {
  if (origSr === targetSr) return input;
  const ratio = targetSr / origSr;
  const outLen = Math.max(1, Math.floor(input.length * ratio));
  const out = new Float32Array(outLen);
  for (let i = 0; i < outLen; i++) {
    const x = i / ratio;
    const x0 = Math.floor(x);
    const x1 = Math.min(input.length - 1, x0 + 1);
    const t = x - x0;
    out[i] = (1 - t) * (input[x0] ?? 0) + t * (input[x1] ?? 0);
  }
  return out;
}

function peakNormalize(audio: Float32Array) {
  let peak = 0;
  for (let i = 0; i < audio.length; i++) peak = Math.max(peak, Math.abs(audio[i] ?? 0));
  if (peak < 1e-8) return audio;
  const out = new Float32Array(audio.length);
  for (let i = 0; i < audio.length; i++) out[i] = (audio[i] ?? 0) / peak;
  return out;
}

function trimSilence(audio: Float32Array, topDb: number) {
  if (!audio.length) return audio;
  let peak = 0;
  for (let i = 0; i < audio.length; i++) peak = Math.max(peak, Math.abs(audio[i] ?? 0));
  if (peak < 1e-8) return audio;
  const thr = peak * Math.pow(10, -topDb / 20);
  let start = 0;
  while (start < audio.length && Math.abs(audio[start] ?? 0) < thr) start++;
  let end = audio.length - 1;
  while (end > start && Math.abs(audio[end] ?? 0) < thr) end--;
  return audio.slice(start, end + 1);
}

function extractLoudestSegment(
  audio: Float32Array,
  sampleRate: number,
  frameLength: number,
  hopLength: number,
  energyQuantile: number,
  maxDurationSec: number
) {
  if (!audio.length) return audio;

  const rms = computeRms(audio, frameLength, hopLength);
  if (!rms.length) return audio;
  const thr = quantile(rms, energyQuantile);

  const active = rms.map((v) => v >= thr);
  let bestStart = 0;
  let bestEnd = audio.length;
  let curStart: number | null = null;

  for (let i = 0; i < active.length; i++) {
    if (active[i] && curStart == null) curStart = i;
    if (!active[i] && curStart != null) {
      const start = curStart * hopLength;
      const end = i * hopLength + frameLength;
      if (end - start > bestEnd - bestStart) {
        bestStart = start;
        bestEnd = Math.min(end, audio.length);
      }
      curStart = null;
    }
  }
  if (curStart != null) {
    const start = curStart * hopLength;
    const end = audio.length;
    if (end - start > bestEnd - bestStart) {
      bestStart = start;
      bestEnd = end;
    }
  }

  let segment = audio.slice(bestStart, bestEnd);
  const maxSamples = Math.floor(maxDurationSec * sampleRate);
  if (segment.length > maxSamples) segment = segment.slice(0, maxSamples);
  return segment;
}

function computeRms(audio: Float32Array, frameLength: number, hopLength: number) {
  const frames = Math.max(0, Math.floor((audio.length - frameLength) / hopLength) + 1);
  const out = new Array<number>(frames);
  for (let i = 0; i < frames; i++) {
    const start = i * hopLength;
    let sum = 0;
    for (let j = 0; j < frameLength; j++) {
      const x = audio[start + j] ?? 0;
      sum += x * x;
    }
    out[i] = Math.sqrt(sum / frameLength);
  }
  return out;
}

function quantile(values: number[], q: number) {
  const arr = [...values].sort((a, b) => a - b);
  const idx = Math.max(0, Math.min(arr.length - 1, Math.floor(q * (arr.length - 1))));
  return arr[idx] ?? 0;
}

function computeLogMel(audio: Float32Array, sr: number, cfg: PreprocessConfig) {
  const { nFft, hopLength, winLength, nMels, fmin, fmax } = cfg;
  const window = hann(winLength);
  const fft = new FFT(nFft);
  const out = fft.createComplexArray();
  const input = new Array<number>(nFft).fill(0);

  const numFrames = Math.max(0, Math.floor((audio.length - winLength) / hopLength) + 1);
  const powerSpec: number[][] = [];
  for (let frame = 0; frame < numFrames; frame++) {
    const offset = frame * hopLength;
    for (let i = 0; i < nFft; i++) input[i] = 0;
    for (let i = 0; i < winLength; i++) {
      input[i] = (audio[offset + i] ?? 0) * window[i]!;
    }
    fft.realTransform(out, input);
    fft.completeSpectrum(out);

    const half = Math.floor(nFft / 2) + 1;
    const mags: number[] = new Array(half);
    for (let i = 0; i < half; i++) {
      const re = out[2 * i] ?? 0;
      const im = out[2 * i + 1] ?? 0;
      mags[i] = re * re + im * im; // power
    }
    powerSpec.push(mags);
  }

  const melFb = melFilterbank(sr, nFft, nMels, fmin, fmax);

  // mel[nMels][numFrames]
  const mel: number[][] = Array.from({ length: nMels }, () => new Array<number>(numFrames).fill(0));
  for (let t = 0; t < numFrames; t++) {
    const spec = powerSpec[t]!;
    for (let m = 0; m < nMels; m++) {
      const fb = melFb[m]!;
      let sum = 0;
      for (let k = 0; k < fb.length; k++) sum += (spec[k] ?? 0) * fb[k]!;
      mel[m]![t] = sum;
    }
  }

  // power_to_db(ref=np.max, top_db=80)
  let ref = 0;
  for (let m = 0; m < nMels; m++) for (let t = 0; t < numFrames; t++) ref = Math.max(ref, mel[m]![t] ?? 0);
  ref = Math.max(ref, 1e-10);
  const logMel: number[][] = Array.from({ length: nMels }, () => new Array<number>(numFrames).fill(-80));
  let maxDb = -Infinity;
  for (let m = 0; m < nMels; m++) {
    for (let t = 0; t < numFrames; t++) {
      const v = Math.max(1e-10, mel[m]![t] ?? 0);
      const db = 10 * Math.log10(v) - 10 * Math.log10(ref);
      logMel[m]![t] = db;
      maxDb = Math.max(maxDb, db);
    }
  }
  const floorDb = maxDb - 80;
  for (let m = 0; m < nMels; m++) for (let t = 0; t < numFrames; t++) logMel[m]![t] = Math.max(logMel[m]![t]!, floorDb);
  return logMel;
}

function padOrTruncate(feature: number[][], maxFrames: number) {
  const nMels = feature.length;
  const out: number[][] = Array.from({ length: nMels }, () => new Array<number>(maxFrames).fill(0));
  for (let m = 0; m < nMels; m++) {
    const row = feature[m] ?? [];
    for (let t = 0; t < Math.min(maxFrames, row.length); t++) out[m]![t] = row[t] ?? 0;
  }
  return out;
}

function minMaxScale(feature: number[][]) {
  let min = Infinity;
  let max = -Infinity;
  for (const row of feature) for (const v of row) { min = Math.min(min, v); max = Math.max(max, v); }
  if (max - min < 1e-8) return feature.map((row) => row.map(() => 0));
  return feature.map((row) => row.map((v) => (v - min) / (max - min)));
}

function hann(n: number) {
  const w = new Array<number>(n);
  for (let i = 0; i < n; i++) w[i] = 0.5 - 0.5 * Math.cos((2 * Math.PI * i) / (n - 1));
  return w;
}

function hzToMel(hz: number) {
  return 2595 * Math.log10(1 + hz / 700);
}

function melToHz(m: number) {
  return 700 * (Math.pow(10, m / 2595) - 1);
}

function melFilterbank(sr: number, nFft: number, nMels: number, fmin: number, fmax: number) {
  const half = Math.floor(nFft / 2) + 1;
  const melMin = hzToMel(fmin);
  const melMax = hzToMel(fmax);
  const melPoints: number[] = [];
  for (let i = 0; i < nMels + 2; i++) melPoints.push(melMin + (i / (nMels + 1)) * (melMax - melMin));
  const hzPoints = melPoints.map(melToHz);
  const bin = hzPoints.map((hz) => Math.floor(((nFft + 1) * hz) / sr));

  const fb: number[][] = Array.from({ length: nMels }, () => new Array<number>(half).fill(0));
  for (let m = 1; m <= nMels; m++) {
    const fMMinus = bin[m - 1]!;
    const fM = bin[m]!;
    const fMPlus = bin[m + 1]!;
    for (let k = fMMinus; k < fM; k++) {
      if (k >= 0 && k < half) fb[m - 1]![k] = (k - fMMinus) / Math.max(1, fM - fMMinus);
    }
    for (let k = fM; k < fMPlus; k++) {
      if (k >= 0 && k < half) fb[m - 1]![k] = (fMPlus - k) / Math.max(1, fMPlus - fM);
    }
  }
  return fb;
}

