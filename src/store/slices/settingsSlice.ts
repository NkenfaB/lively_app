import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { RootState } from '../store';

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
  },
});

export const { setSaveHistory, setShowConfidence, setThemeMode, setNotificationPref } = settingsSlice.actions;
export const selectSettings = (state: RootState) => state.settings;

export default settingsSlice.reducer;

