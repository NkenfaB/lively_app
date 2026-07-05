import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { RootState } from '../store';
import { DEFAULT_COVID_THRESHOLD, DEFAULT_TB_THRESHOLD } from '@/ml/tfliteModel';

export type ThemeMode = 'system' | 'light' | 'dark';

export type NotificationPrefs = {
  /** Notify when sync completes or fails. */
  syncAlerts: boolean;
  /** Notify when a new model is available to download. */
  modelUpdates: boolean;
  /** Daily/weekly health-check reminders to record a screening. */
  healthReminders: boolean;
};

type SettingsState = {
  saveHistory: boolean;
  showConfidenceDetails: boolean;
  themeMode: ThemeMode;
  notifications: NotificationPrefs;
  /** COVID detection threshold [0.10–0.50]. Lower = more sensitive, fewer false negatives. */
  covidThreshold: number;
  /** TB detection threshold [0.30–0.70]. Lower = more sensitive. */
  tbThreshold: number;
};

const initialState: SettingsState = {
  saveHistory: true,
  showConfidenceDetails: true,
  themeMode: 'system',
  notifications: {
    syncAlerts: true,
    modelUpdates: true,
    healthReminders: false,
  },
  covidThreshold: DEFAULT_COVID_THRESHOLD,
  tbThreshold: DEFAULT_TB_THRESHOLD,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setSaveHistory(state, action: PayloadAction<boolean>) {
      state.saveHistory = action.payload;
    },
    setShowConfidence(state, action: PayloadAction<boolean>) {
      state.showConfidenceDetails = action.payload;
    },
    setThemeMode(state, action: PayloadAction<ThemeMode>) {
      state.themeMode = action.payload;
    },
    setNotificationPref(state, action: PayloadAction<{ key: keyof NotificationPrefs; value: boolean }>) {
      // Defensive: older persisted state may not have `notifications`.
      if (!state.notifications) {
        state.notifications = { syncAlerts: true, modelUpdates: true, healthReminders: false };
      }
      state.notifications[action.payload.key] = action.payload.value;
    },
    // Detection thresholds are intentionally fixed at their calibrated,
    // validated values (see DEFAULT_COVID_THRESHOLD / DEFAULT_TB_THRESHOLD).
    // They are not user-adjustable: a lay user has no clinical basis to trade
    // off sensitivity vs. specificity on a screening tool, and every screening
    // must use the same decision points for safety and reproducibility.
  },
});

export const { setSaveHistory, setShowConfidence, setThemeMode, setNotificationPref } = settingsSlice.actions;
export const selectSettings = (state: RootState) => state.settings;

export default settingsSlice.reducer;

