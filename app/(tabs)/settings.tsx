import { ScrollView, StyleSheet, Switch, View } from 'react-native';
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
import { useNavigationColors } from '@/theme/useNavigationTheme';
import { A, enterDown } from '@/ui/animated';
import { metrics } from '@/ui/metrics';
import { useTabScreenBottomPad } from '@/ui/layoutMetrics';
import { selectAuth, signOut } from '@/store/slices/authSlice';
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
              <InfoRow label="Input" value="64×256×1 mel-spectrogram" />
              <InfoRow label="Sample rate" value="16 kHz" />
              <InfoRow label="Inference" value="On-device (TensorFlow Lite)" />
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
});
