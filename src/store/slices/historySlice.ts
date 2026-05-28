import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit';

import type { RootState } from '../store';

export type RiskLabel = 'Low' | 'Medium' | 'High';

export type HistoryItem = {
  id: string;
  createdAt: number;
  label: `COVID likelihood: ${RiskLabel}`;
  confidence: number; // 0..1
  // Supabase sync state (local-only hint; server is upserted by id).
  synced?: boolean;
};

type HistoryState = {
  items: HistoryItem[];
};

const initialState: HistoryState = {
  items: [],
};

const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    addHistoryItem: {
      reducer(state, action: PayloadAction<HistoryItem>) {
        state.items.unshift(action.payload);
      },
      prepare(payload: Omit<HistoryItem, 'id'>) {
        return { payload: { ...payload, id: nanoid(), synced: false } };
      },
    },
    removeHistoryItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    clearHistory(state) {
      state.items = [];
    },
    markAllHistorySynced(state) {
      state.items = state.items.map((it) => ({ ...it, synced: true }));
    },
    mergeRemoteHistory(
      state,
      action: PayloadAction<Array<{ id: string; created_at: number; label: string; confidence: number }>>
    ) {
      const existing = new Map(state.items.map((it) => [it.id, it]));
      for (const r of action.payload) {
        const label = r.label as HistoryItem['label'];
        const incoming: HistoryItem = {
          id: r.id,
          createdAt: r.created_at,
          label,
          confidence: r.confidence,
          synced: true,
        };
        existing.set(r.id, { ...(existing.get(r.id) ?? incoming), ...incoming });
      }
      state.items = Array.from(existing.values()).sort((a, b) => b.createdAt - a.createdAt);
    },
  },
});

export const { addHistoryItem, removeHistoryItem, clearHistory, markAllHistorySynced, mergeRemoteHistory } =
  historySlice.actions;
export const selectHistoryItems = (state: RootState) => state.history.items;
export const selectHistoryItemById = (state: RootState, id: string) =>
  state.history.items.find((item: HistoryItem) => item.id === id);

export default historySlice.reducer;
