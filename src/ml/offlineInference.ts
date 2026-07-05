import { createAudioPlayer, requestRecordingPermissionsAsync } from 'expo-audio';

import { preprocessForBaselineModel } from './audioPreprocess';
import { runBaselineModel, runScreeningModel, run3ClassModel, DEFAULT_COVID_THRESHOLD, DEFAULT_TB_THRESHOLD } from './tfliteModel';

type ExtractOptions = {
  /** Stop collecting audio after this many seconds of playback. */
  maxSeconds?: number;
};

async function extractMonoPcmFromAudioUri(uri: string, options: ExtractOptions = {}) {
  const { maxSeconds = 12 } = options;

  const perm = await requestRecordingPermissionsAsync();
  if (!perm.granted) {
    throw new Error('Microphone permission is required to analyze audio on Android.');
  }

  const player = createAudioPlayer(uri, { updateInterval: 100 });
  player.volume = 0;

  if (!player.isAudioSamplingSupported) {
    player.remove();
    throw new Error('Audio sampling is not supported on this device.');
  }

  const frames: number[] = [];

  let done!: () => void;
  let fail!: (e: unknown) => void;
  const finished = new Promise<void>((resolve, reject) => {
    done = resolve;
    fail = reject;
  });

  const sampleSub = player.addListener('audioSampleUpdate', (sample: any) => {
    const ch0 = sample?.channels?.[0];
    const chunk: number[] | undefined = ch0?.frames;
    if (!chunk?.length) return;
    // Keep memory bounded.
    for (let i = 0; i < chunk.length; i++) frames.push(chunk[i] ?? 0);

    if (player.currentTime >= maxSeconds) done();
  });

  const statusSub = player.addListener('playbackStatusUpdate', (status: any) => {
    if (status?.didJustFinish || status?.isFinished) done();
    if (status?.mediaServicesDidReset) fail(new Error('Audio subsystem reset during analysis.'));
  });

  // Hard timeout: maxSeconds + 4s grace. If nothing resolves by then, use whatever frames we have.
  const timeout = setTimeout(() => {
    if (frames.length > 0) done();
    else fail(new Error('Audio analysis timed out — no audio data received. Check microphone permission.'));
  }, (maxSeconds + 4) * 1000);

  try {
    player.setAudioSamplingEnabled(true);
    player.play();
    await finished;
  } finally {
    clearTimeout(timeout);
    sampleSub.remove();
    statusSub.remove();
    player.setAudioSamplingEnabled(false);
    player.remove();
  }

  return new Float32Array(frames);
}

/** Acoustic signal features extracted during preprocessing — used for in-app explainability. */
export type SignalFeatures = {
  /** Mean energy in low mel bands (bins 0–20), normalised 0–1 */
  lowFreqEnergy: number;
  /** Mean energy in mid mel bands (bins 21–42), normalised 0–1 */
  midFreqEnergy: number;
  /** Mean energy in high mel bands (bins 43–63), normalised 0–1 */
  highFreqEnergy: number;
  /** Number of distinct energy bursts detected (cough events) */
  burstCount: number;
  /** How irregular the temporal pattern is (0=regular, 1=very irregular) */
  temporalIrregularity: number;
};

export type OfflineInferenceResult = {
  covidProb: number;
  healthyProb: number;
  covidFlag: boolean;
  tbProb?: number;
  predictedLabel?: 'COVID' | 'TB' | 'HEALTHY';
  /** Acoustic features for explainability UI — always present */
  signalFeatures: SignalFeatures;
};

/**
 * Extract human-interpretable acoustic features from the mel spectrogram tensor.
 * The input is a flattened (nMels × maxFrames) Float32Array in row-major order.
 */
function extractSignalFeatures(melTensor: Float32Array, nMels = 64, maxFrames = 256): SignalFeatures {
  // Reshape flat array into 2D: mel[m][t]
  const mel: number[][] = Array.from({ length: nMels }, (_, m) =>
    Array.from({ length: maxFrames }, (__, t) => melTensor[m * maxFrames + t] ?? 0)
  );

  // --- Frequency band energies ---
  const bandMean = (startMel: number, endMel: number) => {
    let sum = 0, count = 0;
    for (let m = startMel; m < endMel; m++) {
      for (let t = 0; t < maxFrames; t++) { sum += mel[m]![t]!; count++; }
    }
    return count > 0 ? sum / count : 0;
  };
  const lowFreqEnergy  = bandMean(0,  21);
  const midFreqEnergy  = bandMean(21, 43);
  const highFreqEnergy = bandMean(43, 64);

  // --- Burst detection (count peaks in frame-level RMS) ---
  const frameRms = Array.from({ length: maxFrames }, (_, t) => {
    let sum = 0;
    for (let m = 0; m < nMels; m++) sum += (mel[m]![t]!) ** 2;
    return Math.sqrt(sum / nMels);
  });
  const rmsThreshold = Math.max(...frameRms) * 0.3;
  let burstCount = 0;
  let inBurst = false;
  for (const rms of frameRms) {
    if (rms > rmsThreshold && !inBurst) { burstCount++; inBurst = true; }
    else if (rms <= rmsThreshold) inBurst = false;
  }

  // --- Temporal irregularity (std-dev of inter-burst intervals) ---
  const burstOnsets: number[] = [];
  inBurst = false;
  for (let t = 0; t < frameRms.length; t++) {
    if ((frameRms[t]! > rmsThreshold) && !inBurst) { burstOnsets.push(t); inBurst = true; }
    else if (frameRms[t]! <= rmsThreshold) inBurst = false;
  }
  let temporalIrregularity = 0;
  if (burstOnsets.length >= 2) {
    const intervals = burstOnsets.slice(1).map((t, i) => t - burstOnsets[i]!);
    const mean = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const variance = intervals.reduce((a, b) => a + (b - mean) ** 2, 0) / intervals.length;
    // Normalise by maxFrames so result is 0–1
    temporalIrregularity = Math.min(1, Math.sqrt(variance) / maxFrames);
  }

  return { lowFreqEnergy, midFreqEnergy, highFreqEnergy, burstCount, temporalIrregularity };
}

export async function runOfflineBaselineInference(uri: string): Promise<OfflineInferenceResult> {
  const pcm = await extractMonoPcmFromAudioUri(uri, { maxSeconds: 8 });
  const input = preprocessForBaselineModel(pcm, 44100);
  const signalFeatures = extractSignalFeatures(input);
  const result = await runBaselineModel(input);
  return { ...result, signalFeatures };
}

export async function runOfflineScreeningInference(uri: string): Promise<OfflineInferenceResult> {
  const pcm = await extractMonoPcmFromAudioUri(uri, { maxSeconds: 8 });
  const input = preprocessForBaselineModel(pcm, 44100);
  const signalFeatures = extractSignalFeatures(input);
  const result = await runScreeningModel(input);
  return { ...result, signalFeatures };
}

export async function runOffline3ClassInference(
  uri: string,
  covidThreshold = DEFAULT_COVID_THRESHOLD,
  tbThreshold = DEFAULT_TB_THRESHOLD,
): Promise<OfflineInferenceResult> {
  const pcm = await extractMonoPcmFromAudioUri(uri, { maxSeconds: 8 });
  const input = preprocessForBaselineModel(pcm, 44100);
  const signalFeatures = extractSignalFeatures(input);
  const result = await run3ClassModel(input, covidThreshold, tbThreshold);
  return {
    covidProb: result.covidProb,
    healthyProb: result.healthyProb,
    covidFlag: result.label === 'COVID',
    tbProb: result.tbProb,
    predictedLabel: result.label,
    signalFeatures,
  };
}
