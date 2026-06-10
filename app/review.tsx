import { Audio } from 'expo-av';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { Screen } from '@/ui/Screen';
import { AppText } from '@/ui/AppText';
import { Card } from '@/ui/Card';
import { Button } from '@/ui/Button';
import { Alert } from '@/ui/Alert';
import { Pill } from '@/ui/Pill';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectRecording, setAnalyzing, setRecordingError } from '@/store/slices/recordingSlice';
import { useNavigationColors } from '@/theme/useNavigationTheme';
import { A, enterDown } from '@/ui/animated';
import { metrics } from '@/ui/metrics';
import { useStackScreenBottomPad } from '@/ui/layoutMetrics';
import { runOfflineBaselineInference } from '@/ml/offlineInference';
import type { RiskLabel } from '@/store/slices/historySlice';
import { useToast } from '@/ui/Toast';
import { haptic } from '@/ui/haptics';

export default function ReviewScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const colors = useNavigationColors();
  const { uri } = useLocalSearchParams<{ uri?: string }>();
  const audioUri = uri ?? '';
  const recording = useAppSelector(selectRecording);
  const soundRef = useRef<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const toast = useToast();
  const bottomPad = useStackScreenBottomPad();

  useEffect(() => {
    return () => {
      soundRef.current?.unloadAsync();
      soundRef.current = null;
    };
  }, []);

  const canPlay = useMemo(() => Boolean(audioUri), [audioUri]);

  async function togglePlay() {
    if (!audioUri) return;
    haptic.selection();
    if (!soundRef.current) {
      const { sound } = await Audio.Sound.createAsync({ uri: audioUri }, { shouldPlay: true });
      soundRef.current = sound;
      setIsPlaying(true);
      sound.setOnPlaybackStatusUpdate((status) => {
        if (!status.isLoaded) return;
        if (status.didJustFinish) setIsPlaying(false);
      });
      return;
    }
    const status = await soundRef.current.getStatusAsync();
    if (status.isLoaded && status.isPlaying) {
      await soundRef.current.pauseAsync();
      setIsPlaying(false);
    } else {
      await soundRef.current.playAsync();
      setIsPlaying(true);
    }
  }

  async function analyze() {
    if (!audioUri) return;
    dispatch(setAnalyzing());
    try {
      const out = await runOfflineBaselineInference(audioUri);
      // 2-class model: COVID (High) vs Healthy (Low)
      const label: RiskLabel = out.covidFlag ? 'High' : 'Low';
      const confidence = out.covidFlag ? out.covidProb : out.healthyProb;
      haptic.success();
      router.replace({
        pathname: '/results',
        params: {
          label,
          confidence:   String(Math.max(0, Math.min(1, confidence))),
          lowFreq:      String(out.signalFeatures.lowFreqEnergy),
          midFreq:      String(out.signalFeatures.midFreqEnergy),
          highFreq:     String(out.signalFeatures.highFreqEnergy),
          bursts:       String(out.signalFeatures.burstCount),
          irregularity: String(out.signalFeatures.temporalIrregularity),
        },
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Offline analysis failed.';
      // eslint-disable-next-line no-console
      console.error('Offline analysis failed:', e);
      dispatch(setRecordingError(msg));
      toast.error(msg, 'Analysis failed');
    }
  }

  return (
    <Screen>
      <View style={[styles.content, { paddingBottom: bottomPad }]}>
        <A.View entering={enterDown(0)}>
          <AppText variant="eyebrow" tone="muted">
            STEP 2 OF 3
          </AppText>
          <AppText variant="h1" style={styles.title}>
            Review your recording
          </AppText>
          <AppText variant="bodySm" tone="muted" style={styles.subtitle}>
            Quickly listen back to make sure the recording captured your cough clearly. Then run the on-device model.
          </AppText>
        </A.View>

        <A.View entering={enterDown(80)}>
          <Card tone="surface" bordered elev="none" density="comfortable" style={styles.playerCard}>
            <View style={styles.playerHead}>
              <View style={[styles.waveIcon, { backgroundColor: colors.primaryMuted }]}>
                <MaterialIcons name="graphic-eq" size={20} color={colors.primary} />
              </View>
              <View style={styles.playerInfo}>
                <AppText variant="bodyStrong">Cough sample</AppText>
                <AppText variant="caption" tone="muted">
                  {canPlay ? 'Tap play to preview' : 'No recording found'}
                </AppText>
              </View>
              <Pill label={canPlay ? 'READY' : 'EMPTY'} tone={canPlay ? 'success' : 'neutral'} />
            </View>

            <Pressable
              onPress={togglePlay}
              disabled={!canPlay}
              style={[
                styles.playButton,
                {
                  backgroundColor: canPlay ? colors.primaryMuted : colors.surfaceContainer,
                  opacity: canPlay ? 1 : 0.6,
                },
              ]}>
              <MaterialIcons
                name={isPlaying ? 'pause' : 'play-arrow'}
                size={28}
                color={canPlay ? colors.primary : colors.outline}
              />
              <AppText
                variant="bodyStrong"
                style={{ color: canPlay ? colors.primary : colors.outline }}>
                {isPlaying ? 'Pause' : 'Play preview'}
              </AppText>
            </Pressable>
          </Card>
        </A.View>

        {recording.status === 'error' && recording.errorMessage ? (
          <A.View entering={enterDown(120)}>
            <Alert intent="danger" title="Couldn't analyze" message={recording.errorMessage} />
          </A.View>
        ) : null}

        <A.View entering={enterDown(160)} style={styles.actions}>
          <Button
            title={recording.status === 'analyzing' ? 'Analyzing…' : 'Run on-device analysis'}
            variant="primary"
            size="lg"
            hapticFeedback="medium"
            loading={recording.status === 'analyzing'}
            disabled={!canPlay || recording.status === 'analyzing'}
            onPress={analyze}
            leftIcon={<MaterialIcons name="auto-awesome" size={18} color={colors.onPrimary} />}
          />
          <Button
            title="Re-record"
            variant="secondary"
            size="md"
            onPress={() => router.replace('/record')}
          />
        </A.View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { padding: metrics.screenPadding, gap: 16, flex: 1 },
  title: { marginTop: 4 },
  subtitle: { marginTop: 4 },
  playerCard: { gap: 14 },
  playerHead: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  waveIcon: { width: 40, height: 40, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
  playerInfo: { flex: 1, gap: 2 },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 56,
    borderRadius: metrics.radius.lg,
  },
  actions: { gap: 10, marginTop: 'auto' },
});
