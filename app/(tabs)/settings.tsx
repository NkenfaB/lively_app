import React from 'react';
import { Alert as RNAlert, ScrollView, StyleSheet, Switch, View } from 'react-native';
import { Link } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

import { Screen } from '@/ui/Screen';
import { AppText } from '@/ui/AppText';
import { Card } from '@/ui/Card';
import { Button } from '@/ui/Button';
import { Alert } from '@/ui/Alert';
import { Pill } from '@/ui/Pill';
import { Section } from '@/ui/Section';
import { ListItem } from '@/ui/ListItem';
import { SegmentedControl } from '@/ui/SegmentedControl';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  selectSettings,
  setNotificationPref,
  setSaveHistory,
  setShowConfidence,
  setThemeMode,
  type NotificationPrefs,
  type ThemeMode,
} from '@/store/slices/settingsSlice';
import { DEFAULT_COVID_THRESHOLD, DEFAULT_TB_THRESHOLD } from '@/ml/tfliteModel';
import { useNavigationColors } from '@/theme/useNavigationTheme';
import { A, enterDown } from '@/ui/animated';
import { metrics } from '@/ui/metrics';
import { useTabScreenBottomPad } from '@/ui/layoutMetrics';
import { selectAuth, signOut, deleteAccount } from '@/store/slices/authSlice';
import { selectSync, syncNow } from '@/store/slices/syncSlice';
import { useToast } from '@/ui/Toast';
import { haptic } from '@/ui/haptics';
import { ModelStatusCard } from '@/ml/ModelStatusCard';

export default function SettingsScreen() {
  const settings = useAppSelector(selectSettings);
  const dispatch = useAppDispatch();
  const colors = useNavigationColors();
  const auth = useAppSelector(selectAuth);
  const sync = useAppSelector(selectSync);
  const toast = useToast();
  const bottomPad = useTabScreenBottomPad();

  async function doSync() {
    try {
      await dispatch(syncNow()).unwrap();
      toast.success('Sync complete.');
    } catch (e: any) {
      toast.error(e?.message ?? 'Sync failed.');
    }
  }
  async function doSignOut() {
    try {
      await dispatch(signOut()).unwrap();
      toast.info('Signed out.');
    } catch (e: any) {
      toast.error(e?.message ?? 'Sign-out failed.');
    }
  }

  function confirmDeleteAccount() {
    RNAlert.alert(
      'Delete account',
      'This will permanently delete your account and all screening history. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await dispatch(deleteAccount()).unwrap();
              toast.info('Account deleted.');
            } catch (e: any) {
              toast.error(e?.message ?? 'Account deletion failed.');
            }
          },
        },
      ]
    );
  }

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: bottomPad }]}
        showsVerticalScrollIndicator={false}>
        <A.View entering={enterDown(0)}>
          <AppText variant="eyebrow" tone="muted">
            SETTINGS
          </AppText>
          <AppText variant="h1">Preferences</AppText>
          <AppText variant="bodySm" tone="muted" style={{ marginTop: 4 }}>
            Tailor the app, manage your data, and sign in to sync.
          </AppText>
        </A.View>

        {/* Privacy */}
        <A.View entering={enterDown(70)}>
          <Section title="DATA & PRIVACY">
            <Card tone="surface" bordered elev="none" density="none">
              <ToggleRow
                icon="save"
                title="Save history on device"
                subtitle="Recent screenings appear in the History tab."
                value={settings.saveHistory}
                onChange={(v) => dispatch(setSaveHistory(v))}
              />
              <View style={[styles.divider, { backgroundColor: colors.outlineMuted }]} />
              <ToggleRow
                icon="visibility"
                title="Show confidence details"
                subtitle="Display the model's probability score."
                value={settings.showConfidenceDetails}
                onChange={(v) => dispatch(setShowConfidence(v))}
              />
            </Card>
          </Section>
        </A.View>

        {/* Notifications */}
        <A.View entering={enterDown(100)}>
          <Section
            title="NOTIFICATIONS"
            description="Choose when Lively can send you alerts. We never share notification content with anyone.">
            <Card tone="surface" bordered elev="none" density="none">
              <ToggleRow
                icon="sync"
                title="Sync alerts"
                subtitle="Notify me when a sync finishes or fails."
                value={settings.notifications?.syncAlerts ?? true}
                onChange={(v) => dispatch(setNotificationPref({ key: 'syncAlerts', value: v }))}
              />
              <View style={[styles.divider, { backgroundColor: colors.outlineMuted }]} />
              <ToggleRow
                icon="cloud-download"
                title="Model updates"
                subtitle="Tell me when a new on-device model is available."
                value={settings.notifications?.modelUpdates ?? true}
                onChange={(v) => dispatch(setNotificationPref({ key: 'modelUpdates', value: v }))}
              />
              <View style={[styles.divider, { backgroundColor: colors.outlineMuted }]} />
              <ToggleRow
                icon="notifications-active"
                title="Health reminders"
                subtitle="Occasional reminders to record a quick screening."
                value={settings.notifications?.healthReminders ?? false}
                onChange={(v) => dispatch(setNotificationPref({ key: 'healthReminders', value: v }))}
              />
            </Card>
          </Section>
        </A.View>

        {/* Account & sync */}
        <A.View entering={enterDown(140)}>
          <Section title="ACCOUNT & SYNC">
            <Card tone="surface" bordered elev="none" density="comfortable">
              <View style={styles.acctRow}>
                <View style={[styles.avatar, { backgroundColor: colors.primaryMuted }]}>
                  <MaterialIcons
                    name={auth.session ? 'verified-user' : 'person-outline'}
                    size={22}
                    color={colors.primary}
                  />
                </View>
                <View style={styles.acctText}>
                  <AppText variant="bodyStrong">
                    {auth.session ? auth.user?.email ?? 'Signed in' : 'Offline only'}
                  </AppText>
                  <AppText variant="caption" tone="muted">
                    {auth.session ? 'Sync enabled. Updates pulled on demand.' : 'Sign in to back up history & receive model updates.'}
                  </AppText>
                </View>
                <Pill
                  label={auth.session ? 'CONNECTED' : 'OFFLINE'}
                  tone={auth.session ? 'success' : 'neutral'}
                />
              </View>

              {auth.session ? (
                <View style={styles.acctActions}>
                  <Button
                    title={sync.status === 'syncing' ? 'Syncing…' : 'Sync now'}
                    variant="primary"
                    size="md"
                    loading={sync.status === 'syncing'}
                    onPress={doSync}
                  />
                  <Button title="Sign out" variant="ghost" size="md" onPress={doSignOut} />
                  <Button title="Delete account" variant="ghost" size="md" onPress={confirmDeleteAccount} />
                </View>
              ) : (
                <Link href="/auth" asChild>
                  <Button
                    title="Sign in to enable sync"
                    variant="primary"
                    size="md"
                    hapticFeedback="medium"
                    style={{ marginTop: 12 }}
                  />
                </Link>
              )}

              {sync.lastSyncAt ? (
                <AppText variant="caption" tone="muted" style={{ marginTop: 8 }}>
                  Last sync: {new Date(sync.lastSyncAt).toLocaleString()}
                </AppText>
              ) : null}
              {sync.errorMessage ? (
                <Alert intent="danger" message={sync.errorMessage} style={{ marginTop: 8 }} />
              ) : null}
            </Card>
          </Section>
        </A.View>

        {/* Appearance */}
        <A.View entering={enterDown(170)}>
          <Section title="APPEARANCE" description="Choose how Lively looks. System follows your device's mode automatically.">
            <Card tone="surface" bordered elev="none" density="cozy">
              <SegmentedControl<ThemeMode>
                value={settings.themeMode}
                onChange={(v) => {
                  haptic.selection();
                  dispatch(setThemeMode(v));
                }}
                options={[
                  { value: 'system', label: 'System' },
                  { value: 'light', label: 'Light' },
                  { value: 'dark', label: 'Dark' },
                ]}
              />
            </Card>
          </Section>
        </A.View>

        {/* Model — OTA status, version, manual check */}
        <A.View entering={enterDown(220)}>
          <Section
            title="MODEL"
            description="The on-device model used for screening. Updates are pulled silently in the background when you open the app.">
            <ModelStatusCard />
          </Section>
        </A.View>

        {/* Model spec */}
        <A.View entering={enterDown(250)}>
          <Section title="MODEL SPEC">
            <Card tone="container" elev="none" density="cozy">
              <InfoRow label="Input" value="64×64×3 RGB (MobileNetV2)" />
              <InfoRow label="Classes" value="COVID-19 · TB · Healthy" />
              <InfoRow label="Sample rate" value="16 kHz" />
              <InfoRow label="Inference" value="On-device (TensorFlow Lite)" />
            </Card>
          </Section>
        </A.View>

        {/* Detection thresholds — read-only. Calibrated operating points are
            fixed for safety, reproducibility, and consistency; end users are
            not equipped to trade off sensitivity vs. specificity on a
            screening tool. */}
        <A.View entering={enterDown(265)}>
          <Section
            title="DETECTION THRESHOLDS"
            description="The decision points the model uses to flag a signal. These are calibrated for screening and are fixed to keep results safe and consistent.">
            <Card tone="surface" bordered elev="none" density="cozy">
              <ThresholdInfoRow
                label="COVID-19"
                value={DEFAULT_COVID_THRESHOLD}
                summary="Tuned for high sensitivity — catches ≈ 88% of COVID-19 cases."
                detail="A lower decision point is used so the tool errs toward catching cases. In screening, missing a positive is worse than a false alarm, so sensitivity is prioritised over specificity."
                colors={colors}
              />
              <View style={[styles.divider, { backgroundColor: colors.outlineMuted }]} />
              <ThresholdInfoRow
                label="Tuberculosis"
                value={DEFAULT_TB_THRESHOLD}
                summary="Catches ≈ 100% of TB cases at this operating point."
                detail="The model already reaches full TB recall here, so no further adjustment is applied. This value was validated on a held-out test set."
                colors={colors}
              />
              <View style={styles.thresholdNote}>
                <MaterialIcons name="lock-outline" size={14} color={colors.onSurfaceVariant} />
                <AppText variant="micro" tone="muted" style={{ flex: 1 }}>
                  Fixed by design. Thresholds were calibrated during model
                  development and cannot be changed in-app to ensure every
                  screening uses the same validated decision points.
                </AppText>
              </View>
            </Card>
          </Section>
        </A.View>

        <A.View entering={enterDown(280)}>
          <Link href="/about" asChild>
            <ListItem
              title="About Lively"
              subtitle="Project, datasets, credits"
              leading={
                <View style={[styles.listIcon, { backgroundColor: colors.surfaceContainer }]}>
                  <MaterialIcons name="info-outline" size={18} color={colors.onSurfaceVariant} />
                </View>
              }
              showChevron
            />
          </Link>
        </A.View>
      </ScrollView>
    </Screen>
  );
}

/** Read-only presentation of a fixed, calibrated detection threshold. */
function ThresholdInfoRow({
  label,
  value,
  summary,
  detail,
  colors,
}: {
  label: string;
  value: number;
  summary: string;
  detail: string;
  colors: ReturnType<typeof useNavigationColors>;
}) {
  return (
    <View style={styles.thresholdRow}>
      <View style={styles.thresholdLabelRow}>
        <View style={{ flex: 1 }}>
          <AppText variant="bodyStrong">{label}</AppText>
          <AppText variant="caption" tone="muted" style={{ marginTop: 2 }}>{summary}</AppText>
        </View>
        <View style={styles.thresholdBadgeCol}>
          <View style={[styles.thresholdBadge, { backgroundColor: colors.primaryMuted }]}>
            <AppText style={{ fontFamily: 'Manrope_700Bold', color: colors.primary, fontSize: 13 }}>
              {value.toFixed(2)}
            </AppText>
          </View>
          <AppText variant="micro" tone="muted" style={{ textAlign: 'center' }}>
            fixed
          </AppText>
        </View>
      </View>
      <AppText variant="caption" tone="muted" style={{ lineHeight: 18 }}>
        {detail}
      </AppText>
    </View>
  );
}

function ToggleRow({
  icon,
  title,
  subtitle,
  value,
  onChange,
}: {
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
  title: string;
  subtitle: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  const colors = useNavigationColors();
  return (
    <View style={styles.toggleRow}>
      <View style={[styles.listIcon, { backgroundColor: colors.surfaceContainer }]}>
        <MaterialIcons name={icon} size={18} color={colors.onSurfaceVariant} />
      </View>
      <View style={{ flex: 1, gap: 2 }}>
        <AppText variant="bodyStrong">{title}</AppText>
        <AppText variant="caption" tone="muted">
          {subtitle}
        </AppText>
      </View>
      <Switch
        value={value}
        onValueChange={(v) => {
          haptic.selection();
          onChange(v);
        }}
        trackColor={{ true: colors.primary, false: colors.outlineMuted }}
        thumbColor={'#fff'}
      />
    </View>
  );
}

function InfoRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <View style={styles.infoRow}>
      <AppText variant="caption" tone="muted">
        {label}
      </AppText>
      <AppText
        variant="caption"
        style={{ fontFamily: mono ? undefined : 'Inter_600SemiBold', flexShrink: 1 }}
        numberOfLines={1}>
        {value}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: metrics.screenPadding, gap: 18, paddingBottom: 32 },
  divider: { height: 1, marginHorizontal: 12 },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  listIcon: { width: 32, height: 32, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
  acctRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 44, height: 44, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
  acctText: { flex: 1, gap: 2 },
  acctActions: { gap: 10, marginTop: 14 },
  infoRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 6, gap: 8 },
  // Detection thresholds (read-only)
  thresholdRow: { paddingHorizontal: 14, paddingVertical: 14, gap: 8 },
  thresholdLabelRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  thresholdBadgeCol: { alignItems: 'center', gap: 2 },
  thresholdBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  thresholdNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
});
