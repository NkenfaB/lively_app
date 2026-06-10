import { useEffect, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import {
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioRecorderState,
} from 'expo-audio';

import { Screen } from '@/ui/Screen';
import { AppText } from '@/ui/AppText';
import { Button } from '@/ui/Button';
import { Card } from '@/ui/Card';
import { Alert } from '@/ui/Alert';
import { RecordingPulse } from '@/ui/RecordingPulse';
import { Pill } from '@/ui/Pill';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  finishRecording,
  resetRecording,
  selectRecording,
  setDuration,
  setRecordingError,
  startRecording,
} from '@/store/slices/recordingSlice';
import { useNavigationColors } from '@/theme/useNavigationTheme';
import { A, enterDown, enterFade } from '@/ui/animated';
import { metrics } from '@/ui/metrics';
import { useStackScreenBottomPad } from '@/ui/layoutMetrics';
import { useToast } from '@/ui/Toast';
import { haptic } from '@/ui/haptics';

export default function RecordScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const recordingState = useAppSelector(selectRecording);
  const colors = useNavigationColors();
  const recorder = useAudioRecorder(RecordingPresets.LOW_QUALITY);
  const status = useAudioRecorderState(recorder);
  const toast = useToast();
  const bottomPad = useStackScreenBottomPad();

  useEffect(() => {
    dispatch(setDuration(status.durationMillis ?? 0));
  }, [dispatch, status.durationMillis]);

  const isRecording = useMemo(() => status.isRecording, [status.isRecording]);

  async function start() {
    try {
      dispatch(startRecording());
      const perm = await requestRecordingPermissionsAsync();
      if (!perm.granted) {
        const msg = 'Microphone permission denied. Enable it in Settings to record.';
        dispatch(setRecordingError(msg));
        toast.error(msg, 'Permission needed');
        return;
      }
      await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
      // Stop any existing session before preparing a new one
      try { await recorder.stop(); } catch { /* ignore if not recording */ }
      await recorder.prepareToRecordAsync();
      recorder.record();
      haptic.press();
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Recording failed to start.';
      // eslint-disable-next-line no-console
      console.error('Recording failed to start:', e);
      dispatch(setRecordingError(msg));
      toast.error(msg, 'Recording failed');
    }
  }

  async function stop() {
    try {
      await recorder.stop();
      const uri = recorder.uri;
      if (!uri || uri.length === 0) {
        const msg = 'Recording finished but file URI is missing.';
        dispatch(setRecordingError(msg));
        toast.error(msg);
        return;
      }
      dispatch(finishRecording(uri));
      haptic.success();
      router.replace({ pathname: '/review', params: { uri } });
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Recording failed to stop.';
      // eslint-disable-next-line no-console
      console.error('Recording failed to stop:', e);
      dispatch(setRecordingError(msg));
      toast.error(msg, 'Recording failed');
    }
  }

  function cancel() {
    dispatch(resetRecording());
    haptic.selection();
    router.back();
  }

  return (
    <Screen>
      <View style={[styles.content, { paddingBottom: bottomPad }]}>
        <A.View entering={enterDown(0)} style={styles.header}>
          <Pill
            label={isRecording ? 'RECORDING' : 'READY'}
            tone={isRecording ? 'danger' : 'neutral'}
            leading={
              isRecording ? (
                <View style={[styles.liveDot, { backgroundColor: colors.danger }]} />
              ) : null
            }
          />
          <AppText variant="h2" align="center" style={styles.title}>
            {isRecording ? 'Listening…' : 'Ready when you are'}
          </AppText>
          <AppText variant="bodySm" tone="muted" align="center">
            Cough 2–3 times in a single session.
          </AppText>
        </A.View>

        <A.View entering={enterFade(120)} style={styles.center}>
          <RecordingPulse active={isRecording} size={220}>
            <View style={styles.timerWrap}>
              <AppText
                style={[
                  styles.timer,
                  { color: isRecording ? colors.onPrimary : colors.onSurfaceVariant },
                ]}>
                {formatMs(recordingState.durationMs)}
              </AppText>
              <AppText
                variant="caption"
                style={{ color: isRecording ? 'rgba(255,255,255,0.85)' : colors.outline }}>
                {isRecording ? 'tap stop when done' : 'mm:ss'}
              </AppText>
            </View>
          </RecordingPulse>
        </A.View>

        <A.View entering={enterDown(220)} style={styles.tipsBlock}>
          {recordingState.status === 'error' && recordingState.errorMessage ? (
            <Alert
              intent="danger"
              title="Something went wrong"
              message={recordingState.errorMessage}
              onDismiss={() => dispatch(resetRecording())}
            />
          ) : (
            <Card tone="container" elev="none" density="cozy">
              <View style={styles.tipsRow}>
                <MaterialIcons name="tips-and-updates" size={18} color={colors.primary} />
                <AppText variant="bodyStrong">Quick tips</AppText>
              </View>
              <AppText variant="bodySm" tone="muted">
                • Find a quiet place — avoid TV, fans, or strong wind.{'\n'}• Keep the phone steady and don't speak.{'\n'}• Stop if there's loud background noise.
              </AppText>
            </Card>
          )}
        </A.View>

        <A.View entering={enterDown(280)} style={styles.actions}>
          {!isRecording ? (
            <Button
              title="Start recording"
              variant="primary"
              size="lg"
              hapticFeedback="medium"
              onPress={start}
              leftIcon={<MaterialIcons name="fiber-manual-record" size={18} color={colors.onPrimary} />}
            />
          ) : (
            <Button
              title="Stop and analyze"
              variant="danger"
              size="lg"
              hapticFeedback="heavy"
              onPress={stop}
              leftIcon={<MaterialIcons name="stop" size={18} color={colors.onDanger} />}
            />
          )}
          <Button title="Cancel" variant="secondary" size="md" onPress={cancel} />
        </A.View>
      </View>
    </Screen>
  );
}

function formatMs(ms: number) {
  const s = Math.floor(ms / 1000);
  const mm = String(Math.floor(s / 60)).padStart(2, '0');
  const ss = String(s % 60).padStart(2, '0');
  return `${mm}:${ss}`;
}

const styles = StyleSheet.create({
  content: { padding: metrics.screenPadding, gap: 12, flex: 1 },
  header: { alignItems: 'center', gap: 8, paddingTop: 4 },
  title: { marginTop: 6 },
  liveDot: { width: 8, height: 8, borderRadius: 4 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  timerWrap: { alignItems: 'center', gap: 2 },
  timer: { fontFamily: 'Inter_700Bold', fontSize: 44, letterSpacing: -1, lineHeight: 48 },
  tipsBlock: {},
  tipsRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  actions: { gap: 10 },
});
