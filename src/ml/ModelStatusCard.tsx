/**
 * ModelStatusCard — live UI for the on-device model.
 *
 *   - Shows current source (bundled vs. OTA), version, display name, install date
 *   - "Check for updates" manual button with loading state
 *   - Toast on result (silent if up-to-date or offline)
 *   - Soft "Reset to bundled" action (dev convenience)
 */

import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { useNavigationColors } from '@/theme/useNavigationTheme';
import { AppText } from '@/ui/AppText';
import { Card } from '@/ui/Card';
import { Button } from '@/ui/Button';
import { Pill } from '@/ui/Pill';
import { useToast } from '@/ui/Toast';

import {
  type ActiveModelInfo,
  checkAndUpdate,
  getActiveModelInfo,
  resetToBundled,
} from './modelManager';
import { invalidateModelCache } from './tfliteModel';

export function ModelStatusCard() {
  const colors = useNavigationColors();
  const toast = useToast();
  const [info, setInfo] = useState<ActiveModelInfo | null>(null);
  const [checking, setChecking] = useState(false);

  const refresh = useCallback(async () => {
    const next = await getActiveModelInfo();
    setInfo(next);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function check() {
    setChecking(true);
    try {
      const result = await checkAndUpdate();
      if (result.kind === 'update-installed') {
        invalidateModelCache();
        toast.success(`Installed ${result.manifest.displayName}.`, 'Model updated');
      } else if (result.kind === 'up-to-date') {
        toast.info(`You're on the latest model (${result.manifest.displayName}).`);
      } else if (result.kind === 'no-network') {
        toast.warning('No connection — try again when you\'re online.');
      } else if (result.kind === 'manifest-missing') {
        toast.error(
          'Server is missing manifest.json. Upload it to the models bucket.',
          'Update unavailable'
        );
      } else {
        toast.error(result.message, 'Update failed');
      }
      await refresh();
    } finally {
      setChecking(false);
    }
  }

  async function reset() {
    await resetToBundled();
    invalidateModelCache();
    toast.info('Reverted to the bundled model.');
    await refresh();
  }

  const isLocal = info?.source === 'local';

  return (
    <Card tone="surface" bordered elev="none" density="comfortable">
      <View style={styles.row}>
        <View
          style={[
            styles.iconWrap,
            { backgroundColor: isLocal ? colors.successMuted : colors.primaryMuted },
          ]}>
          <MaterialIcons
            name={isLocal ? 'cloud-done' : 'inventory'}
            size={22}
            color={isLocal ? colors.success : colors.primary}
          />
        </View>
        <View style={styles.text}>
          <AppText variant="bodyStrong">
            {info?.displayName ?? 'Bundled baseline'}
          </AppText>
          <AppText variant="caption" tone="muted">
            {isLocal
              ? `Downloaded model · version ${info?.version}`
              : 'Shipped with the app · ready for updates'}
          </AppText>
        </View>
        <Pill
          label={isLocal ? 'OTA' : 'BUNDLED'}
          tone={isLocal ? 'success' : 'neutral'}
        />
      </View>

      <View style={styles.actions}>
        <Button
          title={checking ? 'Checking…' : 'Check for updates'}
          variant="primary"
          size="md"
          loading={checking}
          onPress={check}
          leftIcon={<MaterialIcons name="cloud-download" size={18} color={colors.onPrimary} />}
        />
        {isLocal ? (
          <Button title="Reset to bundled" variant="ghost" size="sm" onPress={reset} />
        ) : null}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconWrap: { width: 44, height: 44, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
  text: { flex: 1, gap: 2 },
  actions: { gap: 8, marginTop: 14 },
});
