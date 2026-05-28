/**
 * useBackgroundSync — mounts once at root, runs a silent sync when:
 *   - the user signs in
 *   - the device comes back online
 *   - the app returns to foreground
 *   - history mutates and we've been offline (debounced after change)
 *
 * Failures are silent; user can still tap "Sync now" in Settings to see errors.
 */

import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectAuth } from '@/store/slices/authSlice';
import { selectHistoryItems } from '@/store/slices/historySlice';
import { selectSync, syncNow } from '@/store/slices/syncSlice';

export function BackgroundSync() {
  const dispatch = useAppDispatch();
  const auth = useAppSelector(selectAuth);
  const items = useAppSelector(selectHistoryItems);
  const sync = useAppSelector(selectSync);

  // Track whether we're currently online; default to true so first attempt
  // tries (NetInfo subscription will correct it within a tick).
  const isOnlineRef = useRef(true);
  const lastTriggeredRef = useRef<number>(0);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function triggerSync(reason: string) {
    if (!auth.session) return;
    if (!isOnlineRef.current) return;
    if (sync.status === 'syncing') return;
    // Throttle: at most one sync every 8 seconds.
    const now = Date.now();
    if (now - lastTriggeredRef.current < 8_000) return;
    lastTriggeredRef.current = now;
    // eslint-disable-next-line no-console
    console.log('[sync] triggered by', reason);
    void dispatch(syncNow());
  }

  // NetInfo subscription.
  useEffect(() => {
    const unsub = NetInfo.addEventListener((state) => {
      const wasOnline = isOnlineRef.current;
      isOnlineRef.current = Boolean(state.isConnected && state.isInternetReachable !== false);
      if (!wasOnline && isOnlineRef.current) {
        triggerSync('online');
      }
    });
    return unsub;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.session]);

  // App foreground → sync.
  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') triggerSync('foreground');
    });
    return () => sub.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.session]);

  // Sign-in → sync once.
  useEffect(() => {
    if (auth.session) triggerSync('auth');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.session?.user?.id]);

  // History changed → debounced sync (covers "saved a new screening").
  useEffect(() => {
    if (!auth.session) return;
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => triggerSync('history-change'), 2_000);
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length, auth.session]);

  return null;
}
