import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as FileSystem from 'expo-file-system';
import { Paths, Directory } from 'expo-file-system';

import type { RootState } from '../store';
import { ensureSupabaseConfigured, supabase } from '@/backend/supabaseClient';
import { markAllHistorySynced, mergeRemoteHistory } from './historySlice';

type SyncState = {
  status: 'idle' | 'syncing' | 'error';
  lastSyncAt: number | null;
  errorMessage: string | null;
  model: {
    currentPath: string | null;
    lastCheckedAt: number | null;
  };
};

const initialState: SyncState = {
  status: 'idle',
  lastSyncAt: null,
  errorMessage: null,
  model: { currentPath: null, lastCheckedAt: null },
};

// Supabase schema (expected):
// - table: screenings (id text pk, user_id uuid, created_at bigint, label text, confidence real)
// - storage bucket: models (public or signed download), file baseline_cnn.tflite
export const syncNow = createAsyncThunk('sync/syncNow', async (_: void, { getState, dispatch }) => {
  await ensureSupabaseConfigured();
  if (!supabase) throw new Error('Supabase client unavailable.');
  const state = getState() as RootState;
  const session = state.auth.session;
  if (!session?.user) throw new Error('Not signed in.');

  const userId = session.user.id;
  const items = state.history.items;
  const lastSyncAt = state.sync.lastSyncAt ?? 0;

  // Push local items (upsert by id).
  if (items.length) {
    const rows = items.map((it: (typeof items)[number]) => ({
      id: it.id,
      user_id: userId,
      created_at: it.createdAt,
      label: it.label,
      confidence: it.confidence,
    }));
    const { error } = await supabase.from('screenings').upsert(rows, { onConflict: 'id' });
    if (error) throw error;
    dispatch(markAllHistorySynced());
  }

  // Pull remote updates since last sync (client-side filter; simplest).
  const { data: remote, error: remoteErr } = await supabase
    .from('screenings')
    .select('id, created_at, label, confidence')
    .eq('user_id', userId)
    .gte('created_at', lastSyncAt)
    .order('created_at', { ascending: false });
  if (remoteErr) throw remoteErr;

  if (remote && remote.length) {
    dispatch(mergeRemoteHistory(remote));
  }

  return { now: Date.now(), remote: remote ?? [] };
});

export const checkModelUpdate = createAsyncThunk('sync/checkModelUpdate', async () => {
  await ensureSupabaseConfigured();
  if (!supabase) throw new Error('Supabase client unavailable.');
  const bucket = 'models';
  const path = 'baseline_cnn.tflite';

  // Get a signed URL (works even if bucket isn't public).
  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, 60);
  if (error) throw error;

  const modelsDir = `${Paths.document.uri.replace(/\/$/, '')}/models/`;
  const modelDirectory = new Directory(modelsDir);
  if (!modelDirectory.exists) modelDirectory.create();

  const localPath = `${modelsDir}${path}`;
  const dl = await FileSystem.downloadAsync(data.signedUrl, localPath);
  return { downloadedUri: dl.uri, checkedAt: Date.now() };
});

const syncSlice = createSlice({
  name: 'sync',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(syncNow.pending, (state) => {
        state.status = 'syncing';
        state.errorMessage = null;
      })
      .addCase(syncNow.fulfilled, (state, action) => {
        state.status = 'idle';
        state.lastSyncAt = action.payload.now;
        state.errorMessage = null;
      })
      .addCase(syncNow.rejected, (state, action) => {
        state.status = 'error';
        state.errorMessage = action.error.message ?? 'Sync failed.';
      })
      .addCase(checkModelUpdate.fulfilled, (state, action) => {
        state.model.currentPath = action.payload.downloadedUri;
        state.model.lastCheckedAt = action.payload.checkedAt;
      })
      .addCase(checkModelUpdate.rejected, (state, action) => {
        state.status = 'error';
        state.errorMessage = action.error.message ?? 'Model download failed.';
      });
  },
});

export const selectSync = (state: RootState) => state.sync;

export default syncSlice.reducer;
