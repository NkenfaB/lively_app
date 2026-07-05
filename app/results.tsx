import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
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

const COPY: Record<Risk, {
  headline: string;
  body: string;
  tone: 'success' | 'warning' | 'danger';
  pill: string;
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
  scoreLabel: string;
  nextStep: string;
}> = {
  Low: {
    headline: 'No signal detected',
    body: 'Your cough patterns did not match known markers of COVID-19 or TB. This is a screening result — not a medical clearance.',
    tone: 'success',
    pill: 'HEALTHY',
    icon: 'check-circle',
    scoreLabel: 'Healthy confidence',
    nextStep: 'Continue normal activities. If symptoms develop or persist beyond 3 days, see a clinician.',
  },
  Medium: {
    headline: 'TB signal detected',
    body: 'Acoustic patterns in your cough are consistent with tuberculosis. TB is curable — early diagnosis matters.',
    tone: 'warning',
    pill: 'TB SIGNAL',
    icon: 'warning',
    scoreLabel: 'TB signal strength',
    nextStep: 'Visit a clinic for a sputum test or chest X-ray. Avoid prolonged indoor contact with others until cleared by a clinician.',
  },
  High: {
    headline: 'COVID-19 signal detected',
    body: 'Acoustic patterns in your cough are consistent with COVID-19. Confirm with an antigen or PCR test.',
    tone: 'danger',
    pill: 'COVID-19 SIGNAL',
    icon: 'coronavirus',
    scoreLabel: 'COVID signal strength',
    nextStep: 'Get a confirmatory test. Stay home, wear a mask around others, and consult a clinician if symptoms worsen.',
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
    covidProb?: string;
    tbProb?: string;
    healthyProb?: string;
    lowFreq?: string;
    midFreq?: string;
    highFreq?: string;
    bursts?: string;
    irregularity?: string;
  }>();
  const bottomPad = useStackScreenBottomPad();
  const [saved, setSaved] = useState(false);

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

  const probs = useMemo(() => ({
    covid:   Math.max(0, Math.min(1, Number(params.covidProb)   || 0)),
    tb:      Math.max(0, Math.min(1, Number(params.tbProb)      || 0)),
    healthy: Math.max(0, Math.min(1, Number(params.healthyProb) || 0)),
  }), [params.covidProb, params.tbProb, params.healthyProb]);

  const signalFeatures = useMemo(() => {
    if (fromHistory) return null;
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
  const accent = colorFor(copy.tone, colors);

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: bottomPad }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Hero ── */}
        <A.View entering={enterFade(0)}>
          <Card tone="surface" elev="md" density="none" style={styles.heroCard}>
            <LinearGradient
              colors={[`${accent}1A`, 'transparent']}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.heroInner}>
              <View style={[styles.heroIconWrap, { backgroundColor: `${accent}18` }]}>
                <MaterialIcons name={copy.icon} size={36} color={accent} />
              </View>
              <Pill label={copy.pill} tone={copy.tone} size="md" />
              <AppText variant="h1" align="center" style={styles.heroTitle}>
                {copy.headline}
              </AppText>
              <AppText variant="bodySm" tone="muted" align="center" style={styles.heroBody}>
                {copy.body}
              </AppText>
            </View>
          </Card>
        </A.View>

        {/* ── Per-class probability bars ── */}
        <A.View entering={enterDown(60)}>
          <Card tone="surface" elev="none" density="cozy" bordered>
            <View style={styles.probHeader}>
              <MaterialIcons name="bar-chart" size={16} color={colors.primary} />
              <AppText variant="bodyStrong">Model probabilities</AppText>
              <AppText variant="caption" tone="muted" style={styles.probHint}>
                All three scores always sum to 100%
              </AppText>
            </View>

            <ProbBar
              label="COVID-19"
              value={probs.covid || (label === 'High' ? confidence : 0)}
              tone="danger"
              active={label === 'High'}
              colors={colors}
            />
            <ProbBar
              label="Tuberculosis (TB)"
              value={probs.tb || (label === 'Medium' ? confidence : 0)}
              tone="warning"
              active={label === 'Medium'}
              colors={colors}
            />
            <ProbBar
              label="Healthy"
              value={probs.healthy || (label === 'Low' ? confidence : 0)}
              tone="success"
              active={label === 'Low'}
              colors={colors}
            />

            <AppText variant="caption" tone="muted" style={styles.probFooter}>
              A signal is flagged when a score passes the model&apos;s calibrated
              detection threshold (COVID-19 0.25 · TB 0.50).
            </AppText>
          </Card>
        </A.View>

        {/* ── What to do next ── */}
        <A.View entering={enterDown(100)}>
          <Card tone={copy.tone} elev="none" density="cozy">
            <View style={styles.sectionRow}>
              <MaterialIcons name="medical-information" size={18} color={accent} />
              <AppText variant="bodyStrong" style={{ color: accent }}>What to do next</AppText>
            </View>
            <AppText variant="bodySm" style={{ color: accent, lineHeight: 21 }}>
              {copy.nextStep}
            </AppText>
          </Card>
        </A.View>

        {/* ── Sanitize tip ── */}
        <A.View entering={enterDown(130)}>
          <Card tone="container" elev="none" density="cozy">
            <View style={styles.sectionRow}>
              <MaterialIcons name="clean-hands" size={16} color={colors.onSurfaceVariant} />
              <AppText variant="caption" tone="muted" style={{ flex: 1 }}>
                <AppText variant="caption" style={{ fontFamily: 'Inter_600SemiBold' }}>Hygiene tip: </AppText>
                Wipe down your phone screen with an alcohol wipe after coughing near it. Avoid sharing devices.
              </AppText>
            </View>
          </Card>
        </A.View>

        {/* ── Acoustic explainability ── */}
        {signalFeatures && (
          <A.View entering={enterDown(160)}>
            <Card tone="surface" elev="none" density="cozy" bordered>
              <View style={styles.sectionRow}>
                <MaterialIcons name="insights" size={18} color={colors.primary} />
                <AppText variant="bodyStrong">What the model heard</AppText>
              </View>
              <AppText variant="caption" tone="muted" style={{ marginBottom: 12 }}>
                Acoustic features extracted from your cough that most influenced the result.
              </AppText>

              <SignalBar
                label="Low-frequency energy"
                sublabel="50–500 Hz · vocal tract resonance"
                value={signalFeatures.lowFreq}
                highIsBad
                colors={colors}
              />
              <SignalBar
                label="Mid-frequency energy"
                sublabel="500–2 kHz · main cough band"
                value={signalFeatures.midFreq}
                colors={colors}
              />
              <SignalBar
                label="High-frequency energy"
                sublabel="2–8 kHz · airflow turbulence"
                value={signalFeatures.highFreq}
                colors={colors}
              />

              <View style={[styles.divider, { backgroundColor: colors.outlineMuted }]} />

              <View style={styles.metaRow}>
                <MaterialIcons
                  name="bubble-chart"
                  size={15}
                  color={
                    signalFeatures.bursts === 0 ? colors.danger
                    : signalFeatures.bursts <= 3 ? colors.success
                    : colors.warning
                  }
                />
                <AppText variant="caption" tone="muted">
                  <AppText variant="caption" style={{ fontFamily: 'Inter_600SemiBold' }}>
                    {signalFeatures.bursts} cough burst{signalFeatures.bursts !== 1 ? 's' : ''}
                  </AppText>
                  {' — '}
                  {signalFeatures.bursts === 0
                    ? 'no clear cough detected in sample'
                    : signalFeatures.bursts <= 3
                    ? 'clean, usable sample'
                    : 'multiple events — model used the loudest'}
                </AppText>
              </View>

              <View style={styles.metaRow}>
                <MaterialIcons
                  name="timeline"
                  size={15}
                  color={
                    signalFeatures.irregularity < 0.3 ? colors.success
                    : signalFeatures.irregularity < 0.6 ? colors.warning
                    : colors.danger
                  }
                />
                <AppText variant="caption" tone="muted">
                  <AppText variant="caption" style={{ fontFamily: 'Inter_600SemiBold' }}>
                    {signalFeatures.irregularity < 0.3
                      ? 'Regular'
                      : signalFeatures.irregularity < 0.6
                      ? 'Somewhat irregular'
                      : 'Irregular'}
                  </AppText>
                  {' cough pattern'}
                </AppText>
              </View>

              <AppText variant="caption" tone="muted" style={styles.explainNote}>
                For research transparency only. These signals do not constitute a clinical diagnosis.
              </AppText>
            </Card>
          </A.View>
        )}

        {/* ── Disclaimer ── */}
        <A.View entering={enterDown(190)}>
          <Card tone="container" elev="none" density="cozy">
            <View style={styles.sectionRow}>
              <MaterialIcons name="info-outline" size={15} color={colors.onSurfaceVariant} />
              <AppText variant="caption" tone="muted" style={{ flex: 1 }}>
                This is a research prototype. Results must be confirmed by a qualified clinician before any medical decision.
              </AppText>
            </View>
          </Card>
        </A.View>

        {/* ── Actions ── */}
        <A.View entering={enterDown(210)} style={styles.actions}>
          {!settings.saveHistory && !params.id && (
            <View style={[styles.saveDisabledNotice, { backgroundColor: colors.surfaceContainer }]}>
              <MaterialIcons name="info-outline" size={14} color={colors.onSurfaceVariant} />
              <AppText variant="caption" tone="muted" style={{ flex: 1 }}>
                "Save history" is off in Settings — enable it to save this result.
              </AppText>
            </View>
          )}
          <Button
            title={saved ? 'Saved ✓' : 'Save to history'}
            variant="primary"
            hapticFeedback="medium"
            disabled={Boolean(params.id) || !settings.saveHistory || saved}
            onPress={() => {
              const savedLabel =
                label === 'High' ? 'Screening result: High' :
                label === 'Medium' ? 'Screening result: Medium' :
                'Screening result: Low';
              dispatch(addHistoryItem({ createdAt: Date.now(), label: savedLabel, confidence }));
              setSaved(true);
              toast.success('Result saved to history.');
              router.replace('/(tabs)/history');
            }}
          />
          <Button
            title="New recording"
            variant="secondary"
            size="md"
            onPress={() => router.replace('/record')}
          />
        </A.View>
      </ScrollView>
    </Screen>
  );
}

// ── Per-class probability bar ──────────────────────────────────────────────

function ProbBar({
  label,
  value,
  tone,
  active,
  colors,
}: {
  label: string;
  value: number;
  tone: 'success' | 'warning' | 'danger';
  active: boolean;
  colors: ReturnType<typeof useNavigationColors>;
}) {
  const pct = Math.round(value * 100);
  const accent = colorFor(tone, colors);

  return (
    <View style={[styles.probRow, active && { opacity: 1 }, !active && { opacity: 0.55 }]}>
      <View style={styles.probLabelRow}>
        <View style={styles.probLabelLeft}>
          {active && (
            <MaterialIcons name="arrow-right" size={14} color={accent} style={{ marginRight: 2 }} />
          )}
          <AppText
            variant="caption"
            style={{
              fontFamily: active ? 'Inter_600SemiBold' : undefined,
              color: active ? accent : colors.onSurface,
            }}>
            {label}
          </AppText>
        </View>
        <AppText
          variant="caption"
          style={{
            fontFamily: 'Inter_600SemiBold',
            color: active ? accent : colors.onSurfaceVariant,
          }}>
          {pct}%
        </AppText>
      </View>
      <View style={[styles.probTrack, { backgroundColor: colors.outlineMuted }]}>
        <View
          style={[
            styles.probFill,
            { width: `${pct}%`, backgroundColor: active ? accent : `${accent}55` },
          ]}
        />
      </View>
    </View>
  );
}

// ── Acoustic signal bar ────────────────────────────────────────────────────

function SignalBar({
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
        <View style={[styles.signalTrack, { backgroundColor: colors.outlineMuted }]}>
          <View style={[styles.signalFill, { width: `${pct}%`, backgroundColor: barColor }]} />
        </View>
        <AppText variant="caption" tone="muted" style={{ width: 34, textAlign: 'right' }}>
          {pct}%
        </AppText>
      </View>
    </View>
  );
}

// ── Helpers ────────────────────────────────────────────────────────────────

function parseRiskLabel(full: string): Risk {
  if (full.endsWith('High')) return 'High';
  if (full.endsWith('Medium')) return 'Medium';
  return 'Low';
}

function colorFor(tone: 'success' | 'warning' | 'danger', colors: ReturnType<typeof useNavigationColors>) {
  return tone === 'success' ? colors.success : tone === 'warning' ? colors.warning : colors.danger;
}

// ── Styles ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  content: { padding: metrics.screenPadding, gap: 12, flexGrow: 1 },

  // Hero
  heroCard: { padding: 24, gap: 12, overflow: 'hidden' },
  heroInner: { alignItems: 'center', gap: 12 },
  heroIconWrap: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center' },
  heroTitle: { marginTop: 2 },
  heroBody: { maxWidth: 320, lineHeight: 21 },

  // Prob bars
  probHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14, flexWrap: 'wrap' },
  probHint: { marginLeft: 'auto' },
  probRow: { gap: 5, marginBottom: 10 },
  probLabelRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  probLabelLeft: { flexDirection: 'row', alignItems: 'center' },
  probTrack: { height: 8, borderRadius: 4, overflow: 'hidden' },
  probFill: { height: 8, borderRadius: 4 },
  probFooter: { marginTop: 6, fontStyle: 'italic' },

  // Section rows
  sectionRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 6 },
  divider: { height: 1, marginVertical: 10 },
  metaRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 6, marginBottom: 5 },
  explainNote: { marginTop: 10, fontStyle: 'italic' },

  // Signal bars
  signalRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  signalLabelCol: { flex: 1, gap: 1 },
  signalBarCol: { flexDirection: 'row', alignItems: 'center', gap: 6, width: 120 },
  signalTrack: { flex: 1, height: 6, borderRadius: 3, overflow: 'hidden' },
  signalFill: { height: 6, borderRadius: 3 },

  // Actions
  actions: { gap: 10, marginTop: 4 },
  saveDisabledNotice: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, padding: 10, borderRadius: 10 },
});
