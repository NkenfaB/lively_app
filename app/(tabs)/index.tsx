import { Link, useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated from 'react-native-reanimated';

import { AppText } from '@/ui/AppText';
import { Screen } from '@/ui/Screen';
import { Card } from '@/ui/Card';
import { Button } from '@/ui/Button';
import { useNavigationColors } from '@/theme/useNavigationTheme';
import { A, enterDown, usePressScale } from '@/ui/animated';
import { metrics } from '@/ui/metrics';
import { useTabScreenBottomPad } from '@/ui/layoutMetrics';
import { brandGradient } from '@/theme/tokens';
import { useAppSelector } from '@/store/hooks';
import { selectHistoryItems } from '@/store/slices/historySlice';
import { selectAuth } from '@/store/slices/authSlice';
import { haptic } from '@/ui/haptics';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// ── View-based illustrations ───────────────────────────────────────────────

/** Waveform bars shown top-right of hero */
function WaveformIcon() {
  const heights = [6, 14, 9, 20, 8, 15, 6];
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2, height: 22 }}>
      {heights.map((h, i) => (
        <View
          key={i}
          style={{
            width: 2.5,
            height: h,
            borderRadius: 1.5,
            backgroundColor: 'rgba(255,255,255,0.6)',
          }}
        />
      ))}
    </View>
  );
}

/** Hero — face + dotted line + phone */
function HeroIllustration() {
  return (
    <View style={illoStyles.heroRoot}>
      {/* Face circle */}
      <View style={illoStyles.heroFaceOuter}>
        <View style={illoStyles.heroFaceInner}>
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 4 }}>
            <View style={illoStyles.eye} />
            <View style={illoStyles.eye} />
          </View>
          <View style={illoStyles.mouth} />
        </View>
      </View>
      {/* Dotted distance line + phone group */}
      <View style={illoStyles.heroRight}>
        <View style={{ alignItems: 'center', gap: 4 }}>
          {/* dots */}
          <View style={{ flexDirection: 'row', gap: 3, marginBottom: 4 }}>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <View key={i} style={illoStyles.dot} />
            ))}
          </View>
          {/* phone */}
          <View style={illoStyles.heroPhone}>
            <MaterialIcons name="mic" size={12} color="rgba(255,255,255,0.7)" />
          </View>
          <AppText style={illoStyles.distLabel}>15–20 cm</AppText>
        </View>
      </View>
    </View>
  );
}

/** Step 1 — phone + distance + person */
function StepPhoneIllo({ colors }: { colors: ReturnType<typeof useNavigationColors> }) {
  return (
    <View style={illoStyles.stepRoot}>
      <View style={[illoStyles.phoneBadge, { borderColor: colors.primary, backgroundColor: `${colors.primary}12` }]}>
        <MaterialIcons name="phone-android" size={26} color={colors.primary} />
      </View>

      <View style={illoStyles.distanceCol}>
        <View style={illoStyles.distanceDots}>
          {[0, 1, 2, 3].map((i) => (
            <View key={i} style={[illoStyles.distDot, { backgroundColor: colors.primary }]} />
          ))}
        </View>
        <View style={[illoStyles.distanceBadge, { backgroundColor: colors.primary }]}>
          <AppText style={illoStyles.distBadgeText}>15-20 cm</AppText>
        </View>
      </View>

      <View style={[illoStyles.guideIconBadge, { backgroundColor: colors.primaryMuted }]}>
        <MaterialIcons name="person" size={30} color={colors.primary} />
      </View>
    </View>
  );
}

/** Step 2 — voice/cough prompt + sound waves + 2-3x badge */
function StepCoughIllo({ colors }: { colors: ReturnType<typeof useNavigationColors> }) {
  return (
    <View style={illoStyles.stepRoot}>
      <View style={[illoStyles.guideIconBadge, { backgroundColor: colors.primaryMuted }]}>
        <MaterialIcons name="record-voice-over" size={30} color={colors.primary} />
      </View>

      <View style={illoStyles.waveGroup}>
        {[14, 22, 30].map((width, i) => (
          <View
            key={width}
            style={[
              illoStyles.soundWave,
              {
                backgroundColor: colors.primary,
                opacity: 0.8 - i * 0.22,
                width,
              },
            ]}
          />
        ))}
      </View>

      <View style={[illoStyles.coughBadge, { backgroundColor: colors.primary }]}>
        <AppText style={illoStyles.coughBadgeText}>2-3x</AppText>
      </View>
    </View>
  );
}

/** Step 3 — phone + wipe hand icon */
function StepCleanIllo({ colors }: { colors: ReturnType<typeof useNavigationColors> }) {
  return (
    <View style={illoStyles.stepRoot}>
      <MaterialIcons name="auto-awesome" size={15} color={colors.primary} style={illoStyles.sparkleLeft} />

      <View style={[illoStyles.phoneBadge, { borderColor: colors.primary, backgroundColor: `${colors.primary}12` }]}>
        <MaterialIcons name="phone-android" size={28} color={colors.primary} />
      </View>

      <View style={[illoStyles.handIcon, { backgroundColor: colors.primaryMuted }]}>
        <MaterialIcons name="clean-hands" size={24} color={colors.primary} />
      </View>

      <MaterialIcons name="auto-awesome" size={13} color={`${colors.primary}99`} style={illoStyles.sparkleRight} />
    </View>
  );
}

const illoStyles = StyleSheet.create({
  // Hero
  heroRoot: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 4 },
  heroFaceOuter: { width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center' },
  heroFaceInner: { width: 34, height: 34, borderRadius: 17, backgroundColor: 'rgba(255,255,255,0.28)', alignItems: 'center', justifyContent: 'center' },
  eye: { width: 4, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.75)' },
  mouth: { width: 12, height: 7, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.5)' },
  heroRight: { flex: 1, alignItems: 'center' },
  dot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: 'rgba(255,255,255,0.5)' },
  heroPhone: { width: 22, height: 38, borderRadius: 5, borderWidth: 2, borderColor: 'rgba(255,255,255,0.7)', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.1)' },
  distLabel: { fontSize: 9, color: 'rgba(255,255,255,0.6)', fontFamily: 'Manrope_500Medium' },

  // Step guide illustrations
  stepRoot: {
    flex: 1,
    height: 90,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    overflow: 'visible',
    position: 'relative',
  },
  guideIconBadge: { width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  distanceCol: { alignItems: 'center', gap: 5, flexShrink: 0, minWidth: 34 },
  distanceDots: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  distDot: { width: 3, height: 3, borderRadius: 1.5, opacity: 0.6 },
  distanceBadge: { paddingHorizontal: 6, paddingVertical: 3, borderRadius: 999 },
  distBadgeText: { color: '#fff', fontSize: 8, fontFamily: 'Manrope_700Bold' },
  phoneBadge: { width: 30, height: 44, borderRadius: 8, borderWidth: 2, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  waveGroup: { alignItems: 'flex-start', justifyContent: 'center', gap: 5, flexShrink: 0 },
  soundWave: { height: 3, borderRadius: 2 },
  coughBadge: { paddingHorizontal: 7, paddingVertical: 4, borderRadius: 999, position: 'absolute', bottom: 4, right: 4 },
  coughBadgeText: { color: '#fff', fontSize: 9, fontFamily: 'Manrope_700Bold' },
  sparkleLeft: { position: 'absolute', left: 4, top: 22 },
  sparkleRight: { position: 'absolute', right: 2, top: 18 },
  handIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginLeft: -12,
    marginTop: 12,
  },
});

// ── Home screen ────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const colors = useNavigationColors();
  const router = useRouter();
  const history = useAppSelector(selectHistoryItems);
  const auth = useAppSelector(selectAuth);
  const lastResult = history[0];
  const bottomPad = useTabScreenBottomPad();

  const lastTone = lastResult
    ? /High/.test(lastResult.label) ? 'danger' : /Medium/.test(lastResult.label) ? 'warning' : 'success'
    : 'success';

  function readableLastLabel(label: string) {
    if (/High/.test(label)) return 'COVID-19 signal detected';
    if (/Medium/.test(label)) return 'TB signal detected';
    return 'Low risk indicator';
  }

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: bottomPad }]}
        showsVerticalScrollIndicator={false}>

        {/* ── Greeting ── */}
        <A.View entering={enterDown(0)}>
          <View style={styles.greetRow}>
            <View style={styles.greetText}>
              <AppText variant="eyebrow" tone="muted">LIVELY</AppText>
              <AppText variant="h1">Hi there.</AppText>
              <AppText variant="bodySm" tone="muted">
                {auth.session ? 'Signed in — sync enabled.' : 'Working offline — your data stays on device.'}
              </AppText>
            </View>
            <Link href="/about" asChild>
              <Pressable
                onPress={() => haptic.selection()}
                style={[styles.iconBtn, { borderColor: colors.outlineMuted }]}
                accessibilityRole="button"
                accessibilityLabel="About">
                <MaterialIcons name="info-outline" size={18} color={colors.onSurface} />
              </Pressable>
            </Link>
          </View>
        </A.View>

        {/* ── Hero CTA ── */}
        <A.View entering={enterDown(60)}>
          <View style={styles.heroCard}>
            <LinearGradient
              colors={[...brandGradient(colors)]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.heroDec} />
            <View style={styles.heroContent}>
              <View style={styles.heroLeft}>
                <View style={styles.heroTopRow}>
                  <View style={styles.heroPill}>
                    <AppText style={styles.heroPillText}>QUICK START</AppText>
                  </View>
                  <WaveformIcon />
                </View>
                <AppText variant="h2" style={styles.heroTitle}>Record a cough sample</AppText>
                <AppText variant="bodySm" style={styles.heroSub}>
                  Hold the phone 15–20 cm from your mouth and cough naturally 2–3 times.{'\n'}Analysis runs on-device.
                </AppText>
                <Button
                  title="Start recording"
                  variant="inverted"
                  size="md"
                  hapticFeedback="medium"
                  onPress={() => router.push('/record')}
                  leftIcon={<MaterialIcons name="mic" size={16} color={colors.primary} />}
                  rightIcon={<MaterialIcons name="arrow-forward" size={16} color={colors.primary} />}
                  style={styles.heroBtn}
                />
              </View>
              <View style={styles.heroRight} pointerEvents="none">
                <HeroIllustration />
              </View>
            </View>
          </View>
        </A.View>

        {/* ── How to record ── */}
        <A.View entering={enterDown(110)}>
          <Card tone="surface" bordered elev="none" density="comfortable">
            {/* Header row with Full guide link */}
            <View style={styles.howHeader}>
              <AppText variant="bodyStrong" style={{ flex: 1 }}>How to record correctly</AppText>
              <Link href="/how-to" asChild>
                <Pressable
                  onPress={() => haptic.selection()}
                  style={styles.fullGuideBtn}
                  accessibilityRole="link">
                  <AppText variant="caption" tone="primary">Full guide</AppText>
                  <MaterialIcons name="arrow-forward" size={13} color={colors.primary} />
                </Pressable>
              </Link>
            </View>
            <View style={styles.steps}>
              <StepCard num="1" title={"Hold 15–20 cm\naway"} illo={<StepPhoneIllo colors={colors} />} colors={colors} />
              <View style={[styles.stepDivider, { backgroundColor: colors.outlineMuted }]} />
              <StepCard num="2" title={"Cough naturally\n2–3 times"} illo={<StepCoughIllo colors={colors} />} colors={colors} />
              <View style={[styles.stepDivider, { backgroundColor: colors.outlineMuted }]} />
              <StepCard num="3" title={"Clean phone\nafter use"} illo={<StepCleanIllo colors={colors} />} colors={colors} />
            </View>
          </Card>
        </A.View>

        {/* ── Quick tiles ── */}
        <A.View entering={enterDown(160)}>
          <View style={styles.tiles}>
            <Tile icon="history" title="History" subtitle={`${history.length} saved`} onPress={() => router.push('/(tabs)/history')} colors={colors} />
            <Tile icon="tune" title="Sensitivity" subtitle={"Adjust screening\nsensitivity"} onPress={() => router.push('/(tabs)/settings')} colors={colors} />
          </View>
        </A.View>

        {/* ── Last result ── */}
        {lastResult ? (
          <A.View entering={enterDown(200)}>
            <Card tone="surface" bordered elev="none" density="comfortable">
              <AppText variant="eyebrow" tone="muted">LAST SCREENING</AppText>
              <View style={styles.lastRow}>
                <View style={styles.lastText}>
                  <View style={styles.lastLabelRow}>
                    <AppText variant="h3">{readableLastLabel(lastResult.label)}</AppText>
                    <View style={[styles.statusDot, {
                      backgroundColor:
                        lastTone === 'danger' ? colors.danger
                        : lastTone === 'warning' ? colors.warning
                        : colors.success,
                    }]} />
                  </View>
                  <AppText variant="caption" tone="muted">
                    {new Date(lastResult.createdAt).toLocaleString()}
                  </AppText>
                </View>
                <View style={[styles.statusBadge, {
                  backgroundColor:
                    lastTone === 'danger' ? `${colors.danger}18`
                    : lastTone === 'warning' ? `${colors.warning}18`
                    : `${colors.success}18`,
                  borderColor:
                    lastTone === 'danger' ? colors.danger
                    : lastTone === 'warning' ? colors.warning
                    : colors.success,
                }]}>
                  <MaterialIcons
                    name={lastTone === 'danger' ? 'coronavirus' : lastTone === 'warning' ? 'warning' : 'check-circle'}
                    size={20}
                    color={lastTone === 'danger' ? colors.danger : lastTone === 'warning' ? colors.warning : colors.success}
                  />
                  <AppText style={[styles.statusBadgeText, {
                    color: lastTone === 'danger' ? colors.danger : lastTone === 'warning' ? colors.warning : colors.success,
                  }]}>
                    {lastTone === 'danger' ? 'Flagged' : lastTone === 'warning' ? 'Signal' : 'Clear'}
                  </AppText>
                </View>
              </View>
              <Pressable
                onPress={() => {
                  haptic.selection();
                  router.push({ pathname: '/results', params: { id: lastResult.id } });
                }}
                style={styles.viewMore}>
                <AppText variant="bodySm" tone="primary">View details</AppText>
                <MaterialIcons name="chevron-right" size={18} color={colors.primary} />
              </Pressable>
            </Card>
          </A.View>
        ) : null}

        {/* ── Safety notice ── */}
        <A.View entering={enterDown(240)}>
          <Card tone="surface" bordered elev="none" density="comfortable">
            <View style={styles.safetyRow}>
              <View style={[styles.safetyIcon, { backgroundColor: colors.surfaceContainer }]}>
                <MaterialIcons name="security" size={18} color={colors.onSurfaceVariant} />
              </View>
              <AppText variant="bodySm" tone="muted" style={styles.safetyText}>
                For research screening only. This app does not provide a medical diagnosis. If you feel unwell, consult a qualified clinician. Clean your phone after use.
              </AppText>
            </View>
          </Card>
        </A.View>

      </ScrollView>
    </Screen>
  );
}

// ── Step card ──────────────────────────────────────────────────────────────

function StepCard({
  num,
  title,
  illo,
  colors,
}: {
  num: string;
  title: string;
  illo: React.ReactNode;
  colors: ReturnType<typeof useNavigationColors>;
}) {
  return (
    <View style={styles.step}>
      <View style={styles.stepHeader}>
        <StepNumberBadge num={num} color={colors.primary} />
        <AppText variant="caption" style={styles.stepTitle}>
          {title}
        </AppText>
      </View>
      <View style={styles.stepIllo}>{illo}</View>
    </View>
  );
}

function StepNumberBadge({ num, color }: { num: string; color: string }) {
  return (
    <View style={[styles.stepNum, { backgroundColor: color }]}>
      <Text allowFontScaling={false} style={styles.stepNumText}>
        {num}
      </Text>
    </View>
  );
}

// ── Tile ──────────────────────────────────────────────────────────────────

function Tile({
  icon,
  title,
  subtitle,
  onPress,
  colors,
}: {
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
  title: string;
  subtitle: string;
  onPress: () => void;
  colors: ReturnType<typeof useNavigationColors>;
}) {
  const press = usePressScale(0.97);
  return (
    <AnimatedPressable
      onPress={() => { haptic.selection(); onPress(); }}
      onPressIn={press.onPressIn}
      onPressOut={press.onPressOut}
      style={[press.style, styles.tile, { backgroundColor: colors.surface, borderColor: colors.outlineMuted }]}>
      <View style={styles.tileLeft}>
        <View style={[styles.tileIcon, { backgroundColor: colors.primaryMuted }]}>
          <MaterialIcons name={icon} size={20} color={colors.primary} />
        </View>
        <View style={styles.tileTitles}>
          <AppText variant="bodyStrong">{title}</AppText>
          <AppText variant="caption" tone="muted">{subtitle}</AppText>
        </View>
      </View>
      <MaterialIcons name="chevron-right" size={18} color={colors.outline} />
    </AnimatedPressable>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  content: { padding: metrics.screenPadding, gap: 14, paddingBottom: 32 },

  greetRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 },
  greetText: { gap: 2, flex: 1 },
  iconBtn: { width: 38, height: 38, borderRadius: 999, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },

  heroCard: {
    borderRadius: metrics.radius.xl,
    overflow: 'hidden',
    paddingTop: 18,
    paddingLeft: 20,
    paddingBottom: 20,
    paddingRight: 0,
    minHeight: 210,
  },
  heroDec: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.06)',
    top: -50,
    right: -30,
  },
  heroContent: { flexDirection: 'row', alignItems: 'center' },
  heroLeft: { flex: 1, gap: 10, paddingRight: 6 },
  heroRight: { width: 120, alignItems: 'center', justifyContent: 'center' },
  heroTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingRight: 10 },
  heroPill: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.18)' },
  heroPillText: { color: '#fff', fontSize: 11, fontFamily: 'Manrope_700Bold', letterSpacing: 1 },
  heroTitle: { color: '#fff', lineHeight: 26 },
  heroSub: { color: 'rgba(255,255,255,0.85)', lineHeight: 18, fontSize: 12 },
  heroBtn: { alignSelf: 'flex-start', paddingHorizontal: 14 },

  howHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  fullGuideBtn: { flexDirection: 'row', alignItems: 'center', gap: 3, paddingVertical: 2 },
  steps: { flexDirection: 'row' },
  step: { flex: 1, alignItems: 'center', gap: 8, position: 'relative', paddingBottom: 4 },
  stepHeader: { minHeight: 34, flexDirection: 'row', alignItems: 'flex-start', gap: 7, width: '100%' },
  stepNum: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    overflow: 'hidden',
  },
  stepNumText: {
    color: '#fff',
    fontFamily: 'System',
    fontSize: 11,
    fontVariant: ['tabular-nums'],
    fontWeight: '700',
    includeFontPadding: false,
    lineHeight: 22,
    textAlign: 'center',
    width: 22,
  },
  stepTitle: { flex: 1, lineHeight: 15, fontSize: 11, paddingRight: 2 },
  stepIllo: { width: '100%', height: 90, alignItems: 'center', justifyContent: 'center' },
  stepBadge: { position: 'absolute', bottom: 0, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999 },
  stepBadgeText: { color: '#fff', fontSize: 10, fontFamily: 'Manrope_700Bold' },
  stepDivider: { width: 1, marginTop: 22, opacity: 0.35 },

  tiles: { flexDirection: 'row', gap: 10 },
  tile: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14, borderRadius: metrics.radius.lg, borderWidth: 1 },
  tileLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  tileIcon: { width: 40, height: 40, borderRadius: 999, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  tileTitles: { gap: 2, flex: 1 },

  lastRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginTop: 6 },
  lastText: { flex: 1, gap: 3 },
  lastLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusBadge: { alignItems: 'center', justifyContent: 'center', gap: 4, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, borderWidth: 1 },
  statusBadgeText: { fontSize: 12, fontFamily: 'Manrope_700Bold' },
  viewMore: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', marginTop: 10, gap: 2 },

  safetyRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  safetyIcon: { width: 36, height: 36, borderRadius: 999, alignItems: 'center', justifyContent: 'center', marginTop: 1 },
  safetyText: { flex: 1, lineHeight: 18 },
});
