import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { Screen } from '@/ui/Screen';
import { AppText } from '@/ui/AppText';
import { Card } from '@/ui/Card';
import { Button } from '@/ui/Button';
import { Pill } from '@/ui/Pill';
import { ScoreMeter } from '@/ui/ProgressRing';
import { Alert } from '@/ui/Alert';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addHistoryItem, RiskLabel, selectHistoryItemById } from '@/store/slices/historySlice';
import { selectSettings } from '@/store/slices/settingsSlice';
import { useNavigationColors } from '@/theme/useNavigationTheme';
import { A, enterDown, enterFade } from '@/ui/animated';
import { metrics } from '@/ui/metrics';
import { useStackScreenBottomPad } from '@/ui/layoutMetrics';
import { useToast } from '@/ui/Toast';

type Risk = RiskLabel;

const COPY: Record<Risk, { headline: string; body: string; tone: 'success' | 'warning' | 'danger'; pill: string }> = {
  Low: {
    headline: 'Low signal detected',
    body: 'The model did not detect strong cough patterns associated with concern. If you feel unwell or symptoms persist, consult a clinician.',
    tone: 'success',
    pill: 'LOW',
  },
  Medium: {
    headline: 'Medium signal detected',
    body: 'Some cough characteristics warrant attention. If symptoms persist or worsen, consider consulting a clinician for further evaluation.',
    tone: 'warning',
    pill: 'MEDIUM',
  },
  High: {
    headline: 'High signal detected',
    body: 'The model detected cough patterns associated with concern. Consider confirmatory testing and seek medical advice.',
    tone: 'danger',
    pill: 'HIGH',
  },
};

export default function ResultsScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const settings = useAppSelector(selectSettings);
  const colors = useNavigationColors();
  const toast = useToast();
  const params = useLocalSearchParams<{ id?: string; label?: RiskLabel; confidence?: string }>();
  const bottomPad = useStackScreenBottomPad();

  const fromHistory = useAppSelector((s) => (params.id ? selectHistoryItemById(s, params.id) : undefined));

  const label: Risk | null = useMemo(() => {
    if (fromHistory) return parseRiskLabel(fromHistory.label);
    return params.label ?? null;
  }, [fromHistory, params.label]);

  const confidence = useMemo(() => {
    if (fromHistory) return fromHistory.confidence;
    const c = Number(params.confidence);
    if (!Number.isFinite(c)) return 0;
    return Math.max(0, Math.min(1, c));
  }, [fromHistory, params.confidence]);

  if (!label) {
    return (
      <Screen>
        <View style={[styles.content, { paddingBottom: bottomPad }]}>
          <Alert intent="warning" title="No result" message="No result was found. Please record again." />
          <Button title="New recording" onPress={() => router.replace('/record')} />
        </View>
      </Screen>
    );
  }

  const copy = COPY[label];

  return (
    <Screen>
      <View style={[styles.content, { paddingBottom: bottomPad }]}>
        {/* Score hero */}
        <A.View entering={enterFade(0)}>
          <Card tone="surface" elev="md" density="none" style={styles.heroCard}>
            {/* Soft tinted glow background */}
            <LinearGradient
              colors={[`${colorFor(copy.tone, colors)}22`, 'transparent']}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.heroInner}>
              <Pill label={copy.pill} tone={copy.tone} />
              <AppText variant="h1" align="center" style={styles.heroTitle}>
                {copy.headline}
              </AppText>
              <AppText variant="bodySm" tone="muted" align="center" style={styles.heroBody}>
                {copy.body}
              </AppText>

              {settings.showConfidenceDetails ? (
                <View style={styles.meterWrap}>
                  <ScoreMeter value={confidence} tone={copy.tone} label="COVID likelihood" />
                  <AppText variant="caption" tone="muted" align="center" style={styles.meterHint}>
                    Lower is better. Below 34% is reported as Low, 34–67% as Medium, above 67% as High.
                  </AppText>
                </View>
              ) : (
                <AppText variant="caption" tone="muted" align="center" style={styles.meterWrap}>
                  Confidence details are hidden — enable in Settings to view.
                </AppText>
              )}
            </View>
          </Card>
        </A.View>

        {/* Guidance card */}
        <A.View entering={enterDown(120)}>
          <Card tone={copy.tone} elev="none" density="cozy">
            <View style={styles.guidanceRow}>
              <MaterialIcons name="medical-information" size={18} color={colorFor(copy.tone, colors)} />
              <AppText variant="bodyStrong" style={{ color: colorFor(copy.tone, colors) }}>
                What to do next
              </AppText>
            </View>
            <AppText variant="bodySm" style={{ color: colorFor(copy.tone, colors) }}>
              {nextStep(label)}
            </AppText>
          </Card>
        </A.View>

        {/* Disclaimer */}
        <A.View entering={enterDown(160)}>
          <Card tone="container" elev="none" density="cozy">
            <View style={styles.guidanceRow}>
              <MaterialIcons name="info-outline" size={16} color={colors.onSurfaceVariant} />
              <AppText variant="caption" tone="muted">
                This is a research prototype. Not a medical diagnosis.
              </AppText>
            </View>
          </Card>
        </A.View>

        {/* Actions */}
        <A.View entering={enterDown(200)} style={styles.actions}>
          <Button
            title="Save to history"
            variant="primary"
            hapticFeedback="medium"
            disabled={Boolean(params.id) || !settings.saveHistory}
            onPress={() => {
              dispatch(
                addHistoryItem({
                  createdAt: Date.now(),
                  label: `COVID likelihood: ${label}`,
                  confidence,
                })
              );
              toast.success('Result saved to history.');
              router.replace('/(tabs)/history');
            }}
          />
          <Button title="New recording" variant="secondary" size="md" onPress={() => router.replace('/record')} />
        </A.View>
      </View>
    </Screen>
  );
}

function parseRiskLabel(full: string): Risk {
  if (full.endsWith('High')) return 'High';
  if (full.endsWith('Medium')) return 'Medium';
  return 'Low';
}

function colorFor(tone: 'success' | 'warning' | 'danger', colors: ReturnType<typeof useNavigationColors>) {
  return tone === 'success' ? colors.success : tone === 'warning' ? colors.warning : colors.danger;
}

function nextStep(label: Risk): string {
  if (label === 'High') return 'Get a confirmatory test if available. Avoid close contact with others and consult a clinician.';
  if (label === 'Medium') return 'Monitor your symptoms. Rest, hydrate, and consider a clinician if symptoms persist or worsen.';
  return 'Continue with normal activities. If you feel unwell later or symptoms persist, consult a clinician.';
}

const styles = StyleSheet.create({
  content: { padding: metrics.screenPadding, gap: 14, flex: 1 },
  heroCard: { padding: 22, gap: 12, overflow: 'hidden' },
  heroInner: { alignItems: 'center', gap: 10 },
  heroTitle: { marginTop: 6 },
  heroBody: { maxWidth: 360 },
  meterWrap: { width: '100%', marginTop: 8, gap: 6 },
  meterHint: { paddingHorizontal: 6 },
  guidanceRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  actions: { gap: 10, marginTop: 'auto' },
});
