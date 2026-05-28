import { createSlice } from '@reduxjs/toolkit';

import type { RootState } from '../store';

type ConsentState = {
  checked: boolean;
  accepted: boolean;
};

const initialState: ConsentState = {
  checked: false,
  accepted: false,
};

const consentSlice = createSlice({
  name: 'consent',
  initialState,
  reducers: {
    toggleConsentChecked(state) {
      state.checked = !state.checked;
    },
    acceptConsent(state) {
      state.accepted = true;
    },
    resetConsent() {
      return initialState;
    },
  },
});

export const { toggleConsentChecked, acceptConsent, resetConsent } = consentSlice.actions;
export const selectConsentAccepted = (state: RootState) => state.consent.accepted;

export default consentSlice.reducer;

