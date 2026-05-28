import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { RootState } from '../store';

type RecordingState = {
  status: 'idle' | 'recording' | 'recorded' | 'analyzing' | 'error';
  durationMs: number;
  uri: string | null;
  errorMessage: string | null;
};

const initialState: RecordingState = {
  status: 'idle',
  durationMs: 0,
  uri: null,
  errorMessage: null,
};

const recordingSlice = createSlice({
  name: 'recording',
  initialState,
  reducers: {
    startRecording(state) {
      state.status = 'recording';
      state.durationMs = 0;
      state.uri = null;
      state.errorMessage = null;
    },
    setDuration(state, action: PayloadAction<number>) {
      state.durationMs = action.payload;
    },
    finishRecording(state, action: PayloadAction<string>) {
      state.status = 'recorded';
      state.uri = action.payload;
    },
    setRecordingError(state, action: PayloadAction<string>) {
      state.status = 'error';
      state.errorMessage = action.payload;
    },
    resetRecording() {
      return initialState;
    },
    setAnalyzing(state) {
      state.status = 'analyzing';
    },
  },
});

export const {
  startRecording,
  setDuration,
  finishRecording,
  setRecordingError,
  resetRecording,
  setAnalyzing,
} = recordingSlice.actions;

export const selectRecording = (state: RootState) => state.recording;

export default recordingSlice.reducer;

