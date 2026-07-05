import { Audio } from 'expo-av';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { Screen } from '@/ui/Screen';
import { AppText } from '@/ui/AppText';
import { Card } from '@/ui/Card';
import { Button } from '@/ui/Button';
import { Alert } from '@/ui/Alert';
import { Pill } from '@/ui/Pill';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectRecording, setAnalyzing, setRecordingError } from '@/store/slices/recordingSlice';
import { selectSettings } from '@/store/slices/settingsSlice';
import { useNavigationColors } from '@/theme/useNavigationTheme';
import { A, enterDown, enterFade } from '@/ui/animated';
import { metrics } from '@/ui/metrics';
import { useStackScreenBottomPad } from '@/ui/layoutMetrics';
import { runOffline3ClassInference } from '@/ml/offlineInference';
import type { RiskLabel } from '@/store/slices/historySlice';
import { useToast } from '@/ui/Toast';
import { haptic } from '@/ui/haptics';

const TIPS = [
  { icon: 'smartphone' as const,   text: 'Hold your phone 15–20 cm from your mouth' },
  { icon: 'volume-up' as const,    text: 'Cough naturally — force it slightly to produce a clear sound' },
  { icon: 'do-not-disturb' as const, text: 'Be in a quiet room — background noise reduces accuracy' },
  { icon: 'clean-hands' as const,  text: 'Wipe your phone after coughing — hygiene first' },
];

export default function ReviewScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const colors = useNavigationColors();
  const { uri } = useLocalSearchParams<{ uri?: string }>();
  const audioUri = uri ?? '';
  const recording = useAppSelector(selectRecording);
  const settings = useAppSelector(selectSettings);
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
      const covidT = settings.covidThreshold ?? 0.25;
      const tbT = settings.tbThreshold ?? 0.50;
      const out = await runOffline3ClassInference(audioUri, covidT, tbT);

      const label: RiskLabel =
        out.predictedLabel === 'COVID' ? 'High' :
        out.predictedLabel === 'TB' ? 'Medium' : 'Low';

      const confidence =
        out.predictedLabel === 'COVID' ? out.covidProb :
        out.predictedLabel === 'TB' ? (out.tbProb ?? 0) : out.healthyProb;

      haptic.success();
      router.replace({
        pathname: '/results',
        params: {
          label,
          confidence:   String(Math.max(0, Math.min(1, confidence))),
          covidProb:    String(out.covidProb),
          tbProb:       String(out.tbProb ?? 0),
          healthyProb:  String(out.healthyProb),
          lowFreq:      String(out.signalFeatures.lowFreqEnergy),
          midFreq:      String(out.signalFeatures.midFreqEnergy),
          highFreq:     String(out.signalFeatures.highFreqEnergy),
          bursts:       String(out.signalFeatures.burstCount),
          irregularity: String(out.signalFeatures.temporalIrregularity),
        },
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Offline analysis failed.';
      console.error('Offline analysis failed:', e);
      dispatch(setRecordingError(msg));
      toast.error(msg, 'Analysis failed');
    }
  }

  const isAnalyzing = recording.status === 'analyzing';

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: bottomPad }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <A.View entering={enterFade(0)}>
          <AppText variant="eyebrow" tone="muted">STEP 2 OF 3</AppText>
          <AppText variant="h1" style={styles.title}>Review &amp; analyse</AppText>
          <AppText variant="bodySm" tone="muted" style={styles.subtitle}>
            Listen back to confirm your cough was captured, then run the on-device model.
          </AppText>
        </A.View>

        {/* Quick tips */}
        <A.View entering={enterDown(40)}>
          <Card tone="container" elev="none" density="cozy" bordered>
            <View style={styles.tipsHeader}>
              <MaterialIcons name="tips-and-updates" size={15} color={colors.primary} />
              <AppText variant="caption" style={{ fontFamily: 'Inter_600SemiBold', color: colors.primary }}>
                Quick tips for a better reading
              </AppText>
            </View>
            {TIPS.map((tip, i) => (
              <View key={i} style={styles.tipRow}>
                <View style={[styles.tipIcon, { backgroundColor: colors.surfaceContainer }]}>
                  <MaterialIcons name={tip.icon} size={14} color={colors.onSurfaceVariant} />
                </View>
                <AppText variant="caption" tone="muted" style={{ flex: 1 }}>{tip.text}</AppText>
              </View>
            ))}
          </Card>
        </A.View>

        {/* Player */}
        <A.View entering={enterDown(80)}>
          <Card tone="surface" bordered elev="none" density="comfortable" style={styles.playerCard}>
            <View style={styles.playerHead}>
              <View style={[styles.waveIcon, { backgroundColor: colors.primaryMuted }]}>
                <MaterialIcons name="graphic-eq" size={20} color={colors.primary} />
              </View>
              <View style={styles.playerInfo}>
                <AppText variant="bodyStrong">Cough recording</AppText>
                <AppText variant="caption" tone="muted">
                  {canPlay ? 'Tap play to preview before analysis' : 'No recording found'}
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
                  opacity: canPlay ? 1 : 0.5,
                },
              ]}>
              <MaterialIcons
                name={isPlaying ? 'pause' : 'play-arrow'}
                size={28}
                color={canPlay ? colors.primary : colors.outline}
              />
              <AppText variant="bodyStrong" style={{ color: canPlay ? colors.primary : colors.outline }}>
                {isPlaying ? 'Pause' : 'Play preview'}
              </AppText>
            </Pressable>
          </Card>
        </A.View>

        {/* Error */}
        {recording.status === 'error' && recording.errorMessage ? (
          <A.View entering={enterDown(100)}>
            <Alert intent="danger" title="Couldn't analyse" message={recording.errorMessage} />
          </A.View>
        ) : null}

        {/* Re-record nudge */}
        {!canPlay && (
          <A.View entering={enterDown(110)}>
            <Alert
              intent="warning"
              title="No audio found"
              message="Go back and record a cough first. Make sure your mic is not muted."
            />
          </A.View>
        )}

        {/* Actions */}
        <A.View entering={enterDown(140)} style={styles.actions}>
          <Button
            title={isAnalyzing ? 'Analysing…' : 'Run on-device analysis'}
            variant="primary"
            size="lg"
            hapticFeedback="medium"
            loading={isAnalyzing}
            disabled={!canPlay || isAnalyzing}
            onPress={analyze}
            leftIcon={<MaterialIcons name="auto-awesome" size={18} color={colors.onPrimary} />}
          />
          <Button
            title="Re-record"
            variant="secondary"
            size="md"
            disabled={isAnalyzing}
            onPress={() => router.replace('/record')}
          />
        </A.View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { padding: metrics.screenPadding, gap: 14, flexGrow: 1 },
  title: { marginTop: 4 },
  subtitle: { marginTop: 4, lineHeight: 21 },

  // Tips
  tipsHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  tipRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 7 },
  tipIcon: { width: 26, height: 26, borderRadius: 8, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },

  // Player
  playerCard: { gap: 14 },
  playerHead: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  waveIcon: { width: 40, height: 40, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
  playerInfo: { flex: 1, gap: 2 },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 52,
    borderRadius: metrics.radius.lg,
  },

  actions: { gap: 10, marginTop: 'auto' },
});
