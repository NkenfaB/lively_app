import { createAudioPlayer, requestRecordingPermissionsAsync } from 'expo-audio';

import { preprocessForBaselineModel } from './audioPreprocess';
import { runBaselineModel, runScreeningModel } from './tfliteModel';

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
    if (status?.didJustFinish) done();
    if (status?.mediaServicesDidReset) fail(new Error('Audio subsystem reset during analysis.'));
  });

  const timeout = setTimeout(() => fail(new Error('Audio analysis timed out.')), Math.max(3000, maxSeconds * 1200));

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

export type OfflineInferenceResult = {
  covidProb: number;
  healthyProb: number;
  covidFlag: boolean;
};

export async function runOfflineBaselineInference(uri: string): Promise<OfflineInferenceResult> {
  // Keep this short so the UI feels responsive; preprocessing already extracts the loudest segment.
  const pcm = await extractMonoPcmFromAudioUri(uri, { maxSeconds: 8 });
  // expo-audio typically outputs 44.1kHz PCM frames; preprocess() will resample to 16kHz.
  const input = preprocessForBaselineModel(pcm, 44100);
  return await runBaselineModel(input);
}

export async function runOfflineScreeningInference(uri: string): Promise<OfflineInferenceResult> {
  const pcm = await extractMonoPcmFromAudioUri(uri, { maxSeconds: 8 });
  const input = preprocessForBaselineModel(pcm, 44100);
  return await runScreeningModel(input);
}
