import { Link, useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { AppText } from '@/ui/AppText';
import { Screen } from '@/ui/Screen';
import { Card } from '@/ui/Card';
import { Button } from '@/ui/Button';
import { Pill } from '@/ui/Pill';
import { useNavigationColors } from '@/theme/useNavigationTheme';
import { A, enterDown, usePressScale } from '@/ui/animated';
import { metrics } from '@/ui/metrics';
import { useTabScreenBottomPad } from '@/ui/layoutMetrics';
import { brandGradient } from '@/theme/tokens';
import { useAppSelector } from '@/store/hooks';
import { selectHistoryItems } from '@/store/slices/historySlice';
import { selectAuth } from '@/store/slices/authSlice';
import { haptic } from '@/ui/haptics';
import Animated from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function HomeScreen() {
  const colors = useNavigationColors();
  const router = useRouter();
  const history = useAppSelector(selectHistoryItems);
  const auth = useAppSelector(selectAuth);
  const lastResult = history[0];
  const bottomPad = useTabScreenBottomPad();

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: bottomPad }]}
        showsVerticalScrollIndicator={false}>
        {/* Greeting + status */}
        <A.View entering={enterDown(0)}>
          <View style={styles.greetRow}>
            <View style={styles.greetText}>
              <AppText variant="eyebrow" tone="muted">
                LIVELY
              </AppText>
              <AppText variant="h1">Hi there.</AppText>
              <AppText variant="bodySm" tone="muted">
                {auth.session ? 'Signed in — sync enabled.' : 'Working offline — your data stays on the device.'}
              </AppText>
            </View>
            <Link href="/about" asChild>
              <Pressable
                onPress={() => haptic.selection()}
                style={[styles.iconBtn, { backgroundColor: colors.surfaceContainer }]}
                accessibilityRole="button"
                accessibilityLabel="About">
                <MaterialIcons name="info-outline" size={18} color={colors.onSurface} />
              </Pressable>
            </Link>
          </View>
        </A.View>

        {/* Hero CTA — recording entry point */}
        <A.View entering={enterDown(80)}>
          <View style={styles.heroCard}>
            <LinearGradient
              colors={[...brandGradient(colors)]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.heroInner}>
              <Pill label="QUICK CHECK" tone="primary" style={styles.heroPill} />
              <AppText variant="h2" style={styles.heroTitle}>
                Record a cough sample
              </AppText>
              <AppText variant="bodySm" style={styles.heroSub}>
                Hold the phone 20–30 cm away and cough naturally 2–3 times. It takes under a minute.
              </AppText>
              <Button
                title="Start recording"
                variant="inverted"
                size="md"
                hapticFeedback="medium"
                onPress={() => router.push('/record')}
                rightIcon={<MaterialIcons name="arrow-forward" size={18} color={colors.primary} />}
                style={styles.heroBtn}
              />
            </View>
          </View>
        </A.View>

        {/* Quick actions */}
        <A.View entering={enterDown(140)}>
          <View style={styles.tiles}>
            <Tile
              icon="play-circle-outline"
              title="How to record"
              subtitle="Tips & tricks"
              onPress={() => router.push('/how-to')}
            />
            <Tile
              icon="history"
              title="History"
              subtitle={`${history.length} saved`}
              onPress={() => router.push('/(tabs)/history')}
            />
          </View>
        </A.View>

        {/* Latest result preview */}
        {lastResult ? (
          <A.View entering={enterDown(200)}>
            <Card tone="surface" bordered elev="none" density="comfortable">
              <AppText variant="eyebrow" tone="muted">
                LAST RESULT
              </AppText>
              <View style={styles.lastRow}>
                <View style={styles.lastText}>
                  <AppText variant="h3">{lastResult.label}</AppText>
                  <AppText variant="caption" tone="muted">
                    {new Date(lastResult.createdAt).toLocaleString()}
                  </AppText>
                </View>
                <Pill
                  label={`${Math.round(lastResult.confidence * 100)}%`}
                  tone={
                    /High/.test(lastResult.label)
                      ? 'danger'
                      : /Medium/.test(lastResult.label)
                      ? 'warning'
                      : 'success'
                  }
                />
              </View>
              <Pressable
                onPress={() => router.push({ pathname: '/results', params: { id: lastResult.id } })}
                style={styles.viewMore}>
                <AppText variant="bodySm" tone="primary">
                  View details
                </AppText>
                <MaterialIcons name="chevron-right" size={18} color={colors.primary} />
              </Pressable>
            </Card>
          </A.View>
        ) : null}

        {/* Safety tips */}
        <A.View entering={enterDown(260)}>
          <Card tone="info" elev="none" density="comfortable">
            <View style={styles.tipRow}>
              <MaterialIcons name="health-and-safety" size={20} color={colors.info} />
              <AppText variant="bodyStrong" style={{ color: colors.info }}>
                Stay safe
              </AppText>
            </View>
            <AppText variant="bodySm" style={{ color: colors.info }}>
              This screen is not a diagnosis. If you feel unwell, consult a qualified clinician.
            </AppText>
          </Card>
        </A.View>
      </ScrollView>
    </Screen>
  );
}

function Tile({
  icon,
  title,
  subtitle,
  onPress,
}: {
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
  title: string;
  subtitle: string;
  onPress: () => void;
}) {
  const colors = useNavigationColors();
  const press = usePressScale(0.97);
  return (
    <AnimatedPressable
      onPress={() => {
        haptic.selection();
        onPress();
      }}
      onPressIn={press.onPressIn}
      onPressOut={press.onPressOut}
      style={[
        press.style,
        styles.tile,
        { backgroundColor: colors.surface, borderColor: colors.outlineMuted },
      ]}>
      <View style={[styles.tileIcon, { backgroundColor: colors.primaryMuted }]}>
        <MaterialIcons name={icon} size={20} color={colors.primary} />
      </View>
      <AppText variant="bodyStrong">{title}</AppText>
      <AppText variant="caption" tone="muted">
        {subtitle}
      </AppText>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  content: { padding: metrics.screenPadding, gap: 16, paddingBottom: 32 },
  greetRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 },
  greetText: { gap: 2, flex: 1 },
  iconBtn: { width: 40, height: 40, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
  heroCard: {
    borderRadius: metrics.radius.xl,
    overflow: 'hidden',
    padding: 22,
    minHeight: 200,
  },
  heroInner: { gap: 10 },
  heroPill: { alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.18)' },
  heroTitle: { color: '#fff' },
  heroSub: { color: 'rgba(255,255,255,0.9)' },
  heroBtn: { marginTop: 6, alignSelf: 'flex-start', paddingHorizontal: 18 },
  tiles: { flexDirection: 'row', gap: 12 },
  tile: {
    flex: 1,
    padding: 14,
    borderRadius: metrics.radius.lg,
    gap: 6,
    borderWidth: 1,
  },
  tileIcon: { width: 32, height: 32, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
  lastRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginTop: 4 },
  lastText: { flex: 1, gap: 2 },
  viewMore: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', marginTop: 8, gap: 2 },
  tipRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
});
