import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Session, User } from '@supabase/supabase-js';

import type { RootState } from '../store';
import { ensureSupabaseConfigured, isSupabaseConfigured, supabase } from '@/backend/supabaseClient';

type AuthState = {
  status: 'idle' | 'loading' | 'authenticated' | 'unauthenticated' | 'error';
  user: User | null;
  session: Session | null;
  errorMessage: string | null;
};

const initialState: AuthState = {
  status: 'idle',
  user: null,
  session: null,
  errorMessage: null,
};

export const restoreSession = createAsyncThunk('auth/restoreSession', async () => {
  if (!isSupabaseConfigured() || !supabase) return null;
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session ?? null;
});

export const signInWithPassword = createAsyncThunk(
  'auth/signInWithPassword',
  async (payload: { email: string; password: string }) => {
    await ensureSupabaseConfigured();
    if (!supabase) throw new Error('Supabase client unavailable.');
    const { data, error } = await supabase.auth.signInWithPassword(payload);
    if (error) throw error;
    return data.session;
  }
);

export const signUpWithPassword = createAsyncThunk(
  'auth/signUpWithPassword',
  async (payload: { email: string; password: string }) => {
    await ensureSupabaseConfigured();
    if (!supabase) throw new Error('Supabase client unavailable.');
    const { data, error } = await supabase.auth.signUp(payload);
    if (error) throw error;
    return data.session ?? null;
  }
);

export const signOut = createAsyncThunk('auth/signOut', async () => {
  await ensureSupabaseConfigured();
  if (!supabase) throw new Error('Supabase client unavailable.');
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  return true;
});

export const deleteAccount = createAsyncThunk('auth/deleteAccount', async () => {
  await ensureSupabaseConfigured();
  if (!supabase) throw new Error('Supabase client unavailable.');
  const { error } = await supabase.functions.invoke('delete-account');
  if (error) throw error;
  await supabase.auth.signOut();
  return true;
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setSession(state, action: PayloadAction<Session | null>) {
      state.session = action.payload;
      state.user = action.payload?.user ?? null;
      state.status = action.payload ? 'authenticated' : 'unauthenticated';
      state.errorMessage = null;
    },
    clearAuthError(state) {
      state.errorMessage = null;
      if (state.status === 'error') state.status = state.session ? 'authenticated' : 'unauthenticated';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(restoreSession.pending, (state) => {
        state.status = 'loading';
        state.errorMessage = null;
      })
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.session = action.payload;
        state.user = action.payload?.user ?? null;
        state.status = action.payload ? 'authenticated' : 'unauthenticated';
      })
      .addCase(restoreSession.rejected, (state, action) => {
        state.status = 'error';
        state.errorMessage = action.error.message ?? 'Failed to restore session.';
      })
      .addCase(signInWithPassword.pending, (state) => {
        state.status = 'loading';
        state.errorMessage = null;
      })
      .addCase(signInWithPassword.fulfilled, (state, action) => {
        state.session = action.payload;
        state.user = action.payload?.user ?? null;
        state.status = action.payload ? 'authenticated' : 'unauthenticated';
      })
      .addCase(signInWithPassword.rejected, (state, action) => {
        state.status = 'error';
        state.errorMessage = action.error.message ?? 'Sign-in failed.';
      })
      .addCase(signUpWithPassword.pending, (state) => {
        state.status = 'loading';
        state.errorMessage = null;
      })
      .addCase(signUpWithPassword.fulfilled, (state, action) => {
        state.session = action.payload;
        state.user = action.payload?.user ?? null;
        state.status = action.payload ? 'authenticated' : 'unauthenticated';
      })
      .addCase(signUpWithPassword.rejected, (state, action) => {
        state.status = 'error';
        state.errorMessage = action.error.message ?? 'Sign-up failed.';
      })
      .addCase(signOut.fulfilled, (state) => {
        state.session = null;
        state.user = null;
        state.status = 'unauthenticated';
        state.errorMessage = null;
      })
      .addCase(signOut.rejected, (state, action) => {
        state.status = 'error';
        state.errorMessage = action.error.message ?? 'Sign-out failed.';
      })
      .addCase(deleteAccount.pending, (state) => {
        state.status = 'loading';
        state.errorMessage = null;
      })
      .addCase(deleteAccount.fulfilled, (state) => {
        state.session = null;
        state.user = null;
        state.status = 'unauthenticated';
        state.errorMessage = null;
      })
      .addCase(deleteAccount.rejected, (state, action) => {
        state.status = 'error';
        state.errorMessage = action.error.message ?? 'Account deletion failed.';
      });
  },
});

export const { setSession, clearAuthError } = authSlice.actions;

export const selectAuth = (state: RootState) => state.auth;
export const selectUser = (state: RootState) => state.auth.user;
export const selectSession = (state: RootState) => state.auth.session;
export const selectIsAuthed = (state: RootState) => Boolean(state.auth.session);

export default authSlice.reducer;
