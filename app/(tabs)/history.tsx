import { useMemo } from 'react';
import { Link, useRouter } from 'expo-router';
import { Pressable, SectionList, StyleSheet, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Animated from 'react-native-reanimated';

import { Screen } from '@/ui/Screen';
import { AppText } from '@/ui/AppText';
import { Card } from '@/ui/Card';
import { Button } from '@/ui/Button';
import { Pill, type PillTone } from '@/ui/Pill';
import { EmptyState } from '@/ui/EmptyState';
import { useAppSelector } from '@/store/hooks';
import { HistoryItem, selectHistoryItems } from '@/store/slices/historySlice';
import { selectAuth } from '@/store/slices/authSlice';
import { useNavigationColors } from '@/theme/useNavigationTheme';
import { A, enterDown, smoothLayout, usePressScale } from '@/ui/animated';
import { metrics } from '@/ui/metrics';
import { useTabScreenBottomPad } from '@/ui/layoutMetrics';
import { haptic } from '@/ui/haptics';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Section = { title: string; data: HistoryItem[] };

export default function HistoryScreen() {
  const items = useAppSelector(selectHistoryItems);
  const colors = useNavigationColors();
  const bottomPad = useTabScreenBottomPad();

  const sections = useMemo<Section[]>(() => groupByRecency(items), [items]);

  return (
    <Screen>
      {items.length === 0 ? (
        <View style={[styles.emptyWrap, { paddingBottom: bottomPad }]}>
          <A.View entering={enterDown(0)}>
            <AppText variant="eyebrow" tone="muted">
              HISTORY
            </AppText>
            <AppText variant="h1" style={styles.title}>
              No results yet
            </AppText>
            <AppText variant="bodySm" tone="muted" style={styles.subtitle}>
              Run your first cough screening — your saved results will appear here.
            </AppText>
          </A.View>
          <A.View entering={enterDown(100)}>
            <EmptyState
              icon="graphic-eq"
              title="Start a quick check"
              body="Record a cough, save the result, and track changes over time."
              action={
                <Link href="/record" asChild>
                  <Button title="Record a cough" variant="primary" hapticFeedback="medium" />
                </Link>
              }
            />
          </A.View>
        </View>
      ) : (
        <SectionList<HistoryItem, Section>
          contentContainerStyle={[styles.list, { paddingBottom: bottomPad }]}
          sections={sections}
          keyExtractor={(item) => item.id}
          stickySectionHeadersEnabled={false}
          ListHeaderComponent={
            <A.View entering={enterDown(0)} style={styles.headerWrap}>
              <AppText variant="eyebrow" tone="muted">
                HISTORY
              </AppText>
              <AppText variant="h1">{items.length} saved {items.length === 1 ? 'result' : 'results'}</AppText>
              <AppText variant="bodySm" tone="muted">
                Tap a row to view full details.
              </AppText>
            </A.View>
          }
          renderSectionHeader={({ section }) => (
            <View style={styles.section}>
              <AppText variant="eyebrow" tone="muted">
                {section.title}
              </AppText>
            </View>
          )}
          renderItem={({ item }) => <Row item={item} />}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        />
      )}
    </Screen>
  );
}

function Row({ item }: { item: HistoryItem }) {
  const colors = useNavigationColors();
  const router = useRouter();
  const press = usePressScale(0.98);
  const auth = useAppSelector(selectAuth);

  const tone: PillTone = /High/.test(item.label) ? 'danger' : /Medium/.test(item.label) ? 'warning' : 'success';
  const iconColor = tone === 'danger' ? colors.danger : tone === 'warning' ? colors.warning : colors.success;

  // Only show sync state if the user is signed in. Otherwise it's noise — items
  // can't be synced when offline-only, by design.
  const showSyncBadge = Boolean(auth.session);
  const synced = item.synced === true;

  return (
    <AnimatedPressable
      onPress={() => {
        haptic.selection();
        router.push({ pathname: '/results', params: { id: item.id } });
      }}
      onPressIn={press.onPressIn}
      onPressOut={press.onPressOut}
      style={press.style}>
      <Animated.View layout={smoothLayout()}>
        <Card tone="surface" bordered elev="none" density="cozy">
          <View style={styles.row}>
            <View style={[styles.rowIcon, { backgroundColor: `${iconColor}22` }]}>
              <MaterialIcons name="medical-information" size={20} color={iconColor} />
            </View>
            <View style={styles.rowText}>
              <AppText variant="bodyStrong">{item.label}</AppText>
              <View style={styles.rowMetaRow}>
                <AppText variant="caption" tone="muted">
                  {new Date(item.createdAt).toLocaleString()}
                </AppText>
                {showSyncBadge ? (
                  <View style={styles.syncDotRow}>
                    <View
                      style={[
                        styles.syncDot,
                        { backgroundColor: synced ? colors.success : colors.warning },
                      ]}
                    />
                    <AppText
                      variant="micro"
                      style={{ color: synced ? colors.success : colors.warning, fontFamily: 'Manrope_700Bold' }}>
                      {synced ? 'SYNCED' : 'PENDING'}
                    </AppText>
                  </View>
                ) : null}
              </View>
            </View>
            <View style={styles.rowMeta}>
              <Pill label={`${Math.round(item.confidence * 100)}%`} tone={tone} />
              <MaterialIcons name="chevron-right" size={18} color={colors.outline} />
            </View>
          </View>
        </Card>
      </Animated.View>
    </AnimatedPressable>
  );
}

function groupByRecency(items: HistoryItem[]): Section[] {
  const now = Date.now();
  const dayMs = 86_400_000;
  const today: HistoryItem[] = [];
  const week: HistoryItem[] = [];
  const earlier: HistoryItem[] = [];
  for (const it of items) {
    const age = now - it.createdAt;
    if (age < dayMs) today.push(it);
    else if (age < 7 * dayMs) week.push(it);
    else earlier.push(it);
  }
  const out: Section[] = [];
  if (today.length) out.push({ title: 'TODAY', data: today });
  if (week.length) out.push({ title: 'THIS WEEK', data: week });
  if (earlier.length) out.push({ title: 'EARLIER', data: earlier });
  return out;
}

const styles = StyleSheet.create({
  list: { padding: metrics.screenPadding, paddingBottom: 32, gap: 16 },
  headerWrap: { gap: 4, marginBottom: 12 },
  section: { paddingTop: 16, paddingBottom: 6 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  rowIcon: { width: 40, height: 40, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
  rowText: { flex: 1, gap: 2 },
  rowMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  rowMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  syncDotRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  syncDot: { width: 6, height: 6, borderRadius: 3 },
  emptyWrap: { padding: metrics.screenPadding, gap: 16 },
  title: { marginTop: 4 },
  subtitle: { marginTop: 4 },
});
