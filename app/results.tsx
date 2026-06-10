import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
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
    headline: 'No disease detected',
    body: 'The model did not detect cough patterns associated with COVID-19 or pneumonia. If you feel unwell or symptoms persist, consult a clinician.',
    tone: 'success',
    pill: 'HEALTHY',
  },
  Medium: {
    headline: 'Pneumonia signal detected',
    body: 'The model detected cough patterns associated with pneumonia. If symptoms persist or worsen, consider consulting a clinician for further evaluation.',
    tone: 'warning',
    pill: 'PNEUMONIA',
  },
  High: {
    headline: 'COVID-19 signal detected',
    body: 'The model detected cough patterns associated with COVID-19. Consider confirmatory testing and seek medical advice.',
    tone: 'danger',
    pill: 'COVID-19',
  },
};

export default function ResultsScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const settings = useAppSelector(selectSettings);
  const colors = useNavigationColors();
  const toast = useToast();
  const params = useLocalSearchParams<{
    id?: string;
    label?: RiskLabel;
    confidence?: string;
    lowFreq?: string;
    midFreq?: string;
    highFreq?: string;
    bursts?: string;
    irregularity?: string;
  }>();
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

  const signalFeatures = useMemo(() => {
    if (fromHistory) return null; // history items don't carry signal features
    return {
      lowFreq:      Math.max(0, Math.min(1, Number(params.lowFreq)      || 0)),
      midFreq:      Math.max(0, Math.min(1, Number(params.midFreq)      || 0)),
      highFreq:     Math.max(0, Math.min(1, Number(params.highFreq)     || 0)),
      bursts:       Math.max(0, Math.round(Number(params.bursts)        || 0)),
      irregularity: Math.max(0, Math.min(1, Number(params.irregularity) || 0)),
    };
  }, [fromHistory, params.lowFreq, params.midFreq, params.highFreq, params.bursts, params.irregularity]);

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
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: bottomPad }]}
        showsVerticalScrollIndicator={false}
      >
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
                  <ScoreMeter value={confidence} tone={copy.tone} label="Disease likelihood" />
                  <AppText variant="caption" tone="muted" align="center" style={styles.meterHint}>
                    Confidence score for the detected condition. Higher means the model is more certain.
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

        {/* Explainability card */}
        {signalFeatures && (
          <A.View entering={enterDown(180)}>
            <Card tone="surface" elev="none" density="cozy" bordered>
              <View style={styles.guidanceRow}>
                <MaterialIcons name="insights" size={18} color={colors.primary} />
                <AppText variant="bodyStrong">What the model detected</AppText>
              </View>
              <AppText variant="caption" tone="muted" style={{ marginBottom: 10 }}>
                Key acoustic signals from your cough that influenced this result.
              </AppText>
              <SignalRow
                label="Low-frequency energy"
                sublabel="50–500 Hz — vocal tract resonance"
                value={signalFeatures.lowFreq}
                colors={colors}
                highIsBad
              />
              <SignalRow
                label="Mid-frequency energy"
                sublabel="500–2000 Hz — typical cough band"
                value={signalFeatures.midFreq}
                colors={colors}
              />
              <SignalRow
                label="High-frequency energy"
                sublabel="2000–8000 Hz — airflow turbulence"
                value={signalFeatures.highFreq}
                colors={colors}
              />
              <View style={[styles.signalDivider, { backgroundColor: colors.outlineMuted }]} />
              <View style={styles.signalMetaRow}>
                <MaterialIcons
                  name="bubble-chart"
                  size={15}
                  color={signalFeatures.bursts <= 2 ? colors.success : signalFeatures.bursts <= 4 ? colors.warning : colors.danger}
                />
                <AppText variant="caption" tone="muted">
                  <AppText variant="caption" style={{ fontFamily: 'Inter_600SemiBold' }}>
                    {signalFeatures.bursts} cough burst{signalFeatures.bursts !== 1 ? 's' : ''}
                  </AppText>
                  {' detected — '}
                  {signalFeatures.bursts === 0 ? 'no clear cough found' :
                   signalFeatures.bursts <= 2 ? 'good sample' :
                   signalFeatures.bursts <= 4 ? 'typical' : 'many events'}
                </AppText>
              </View>
              <View style={styles.signalMetaRow}>
                <MaterialIcons
                  name="timeline"
                  size={15}
                  color={signalFeatures.irregularity < 0.3 ? colors.success : signalFeatures.irregularity < 0.6 ? colors.warning : colors.danger}
                />
                <AppText variant="caption" tone="muted">
                  <AppText variant="caption" style={{ fontFamily: 'Inter_600SemiBold' }}>
                    {signalFeatures.irregularity < 0.3 ? 'Regular' : signalFeatures.irregularity < 0.6 ? 'Somewhat irregular' : 'Irregular'}
                  </AppText>
                  {' temporal pattern'}
                </AppText>
              </View>
              <AppText variant="caption" tone="muted" style={styles.explainDisclaimer}>
                These signals are for research transparency only — not a medical interpretation.
              </AppText>
            </Card>
          </A.View>
        )}

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
      </ScrollView>
    </Screen>
  );
}

function SignalRow({
  label,
  sublabel,
  value,
  colors,
  highIsBad = false,
}: {
  label: string;
  sublabel: string;
  value: number;
  colors: ReturnType<typeof useNavigationColors>;
  highIsBad?: boolean;
}) {
  const pct = Math.round(value * 100);
  const barColor = highIsBad
    ? value < 0.35 ? colors.success : value < 0.65 ? colors.warning : colors.danger
    : value < 0.35 ? colors.onSurfaceVariant : value < 0.65 ? colors.primary : colors.success;

  return (
    <View style={styles.signalRow}>
      <View style={styles.signalLabelCol}>
        <AppText variant="caption" style={{ fontFamily: 'Inter_600SemiBold' }}>{label}</AppText>
        <AppText variant="caption" tone="muted">{sublabel}</AppText>
      </View>
      <View style={styles.signalBarCol}>
        <View style={[styles.signalBarBg, { backgroundColor: colors.outlineMuted }]}>
          <View style={[styles.signalBarFill, { width: `${pct}%`, backgroundColor: barColor }]} />
        </View>
        <AppText variant="caption" tone="muted" style={{ width: 32, textAlign: 'right' }}>
          {pct}%
        </AppText>
      </View>
    </View>
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
  if (label === 'High') return 'Get a COVID-19 confirmatory test if available. Avoid close contact with others and consult a clinician.';
  if (label === 'Medium') return 'Pneumonia requires medical attention. Rest, stay hydrated, and consult a clinician promptly if symptoms worsen.';
  return 'Continue with normal activities. If you feel unwell later or symptoms persist, consult a clinician.';
}

const styles = StyleSheet.create({
  content: { padding: metrics.screenPadding, gap: 14, flexGrow: 1 },
  heroCard: { padding: 22, gap: 12, overflow: 'hidden' },
  heroInner: { alignItems: 'center', gap: 10 },
  heroTitle: { marginTop: 6 },
  heroBody: { maxWidth: 360 },
  meterWrap: { width: '100%', marginTop: 8, gap: 6 },
  meterHint: { paddingHorizontal: 6 },
  guidanceRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  actions: { gap: 10, marginTop: 8 },
  // Explainability card
  signalRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  signalLabelCol: { flex: 1, gap: 1 },
  signalBarCol: { flexDirection: 'row', alignItems: 'center', gap: 6, width: 120 },
  signalBarBg: { flex: 1, height: 6, borderRadius: 3, overflow: 'hidden' },
  signalBarFill: { height: 6, borderRadius: 3 },
  signalDivider: { height: 1, marginVertical: 8 },
  signalMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  explainDisclaimer: { marginTop: 8, fontStyle: 'italic' },
});
