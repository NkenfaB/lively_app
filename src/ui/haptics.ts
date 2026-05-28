/**
 * Haptics — thin wrapper around `expo-haptics` so calls are safe on web,
 * silenced when missing, and tagged by intent (selection, success, error, …).
 *
 * Use sparingly. Haptics should reinforce user-initiated actions
 * (button press, recording start/stop, success, error) — never timer ticks.
 */

import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

const enabled = Platform.OS === 'ios' || Platform.OS === 'android';

export const haptic = {
  /** Light tap for tab/segmented control selection. */
  selection() {
    if (!enabled) return;
    Haptics.selectionAsync().catch(() => {});
  },
  /** Soft tap for primary button press. */
  tap() {
    if (!enabled) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  },
  /** Medium tap for confirmations (e.g. start/stop recording). */
  press() {
    if (!enabled) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
  },
  /** Heavy tap for destructive confirms. */
  heavy() {
    if (!enabled) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {});
  },
  success() {
    if (!enabled) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
  },
  warning() {
    if (!enabled) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
  },
  error() {
    if (!enabled) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
  },
};
