/**
 * Toast provider — global, themed, animated notification.
 *
 *   const toast = useToast();
 *   toast.show({ intent: 'success', message: 'Saved to history.' });
 *
 * One toast at a time (queues additional). Auto-dismisses after `duration`,
 * pannable to dismiss. Lives above the navigation stack at root level.
 */

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type PropsWithChildren } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeOutUp, Layout } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useNavigationColors } from '@/theme/useNavigationTheme';
import { AppText } from './AppText';
import { metrics, elevation } from './metrics';
import { haptic } from './haptics';

export type ToastIntent = 'info' | 'success' | 'warning' | 'danger';

export type ToastOptions = {
  intent?: ToastIntent;
  title?: string;
  message: string;
  duration?: number; // ms; default 3500
};

type Toast = ToastOptions & { id: number };

type ToastApi = {
  show: (opts: ToastOptions) => void;
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
  warning: (message: string, title?: string) => void;
};

const ToastContext = createContext<ToastApi | null>(null);

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>.');
  return ctx;
}

export function ToastProvider({ children }: PropsWithChildren) {
  const [queue, setQueue] = useState<Toast[]>([]);
  const idRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismiss = useCallback((id: number) => {
    setQueue((q) => q.filter((t) => t.id !== id));
  }, []);

  const show = useCallback(
    (opts: ToastOptions) => {
      const id = ++idRef.current;
      const toast: Toast = { ...opts, id };
      setQueue((q) => [...q, toast]);
      if (opts.intent === 'success') haptic.success();
      else if (opts.intent === 'warning') haptic.warning();
      else if (opts.intent === 'danger') haptic.error();
      else haptic.selection();
    },
    []
  );

  const api = useMemo<ToastApi>(
    () => ({
      show,
      success: (message, title) => show({ intent: 'success', message, title }),
      error: (message, title) => show({ intent: 'danger', message, title }),
      info: (message, title) => show({ intent: 'info', message, title }),
      warning: (message, title) => show({ intent: 'warning', message, title }),
    }),
    [show]
  );

  // Auto-dismiss head of queue.
  const head = queue[0];
  useEffect(() => {
    if (!head) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => dismiss(head.id), head.duration ?? 3500);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [head, dismiss]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <ToastViewport queue={queue} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

function ToastViewport({ queue, onDismiss }: { queue: Toast[]; onDismiss: (id: number) => void }) {
  const insets = useSafeAreaInsets();
  return (
    <View pointerEvents="box-none" style={[styles.viewport, { paddingTop: insets.top + 8 }]}>
      {queue.slice(0, 1).map((t) => (
        <ToastBubble key={t.id} toast={t} onPress={() => onDismiss(t.id)} />
      ))}
    </View>
  );
}

function ToastBubble({ toast, onPress }: { toast: Toast; onPress: () => void }) {
  const colors = useNavigationColors();
  const palette = (() => {
    switch (toast.intent) {
      case 'success':
        return { bg: colors.success, fg: colors.onSuccess, icon: 'check-circle' as const };
      case 'warning':
        return { bg: colors.warning, fg: colors.onWarning, icon: 'warning' as const };
      case 'danger':
        return { bg: colors.danger, fg: colors.onDanger, icon: 'error' as const };
      default:
        return { bg: colors.info, fg: colors.onInfo, icon: 'info' as const };
    }
  })();

  return (
    <Animated.View
      entering={FadeInDown.springify().damping(18).mass(0.9)}
      exiting={FadeOutUp.duration(180)}
      layout={Layout.springify()}
      style={[styles.bubble, { backgroundColor: palette.bg, shadowColor: colors.shadowColor, ...elevation.md }]}>
      <Pressable onPress={onPress} style={styles.pressable} accessibilityRole="alert">
        <MaterialIcons name={palette.icon} color={palette.fg} size={20} />
        <View style={styles.body}>
          {toast.title ? (
            <AppText variant="bodyStrong" style={{ color: palette.fg }}>
              {toast.title}
            </AppText>
          ) : null}
          <AppText variant="bodySm" style={{ color: palette.fg }} numberOfLines={3}>
            {toast.message}
          </AppText>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  viewport: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  bubble: {
    borderRadius: metrics.radius.lg,
    width: '100%',
    maxWidth: 480,
  },
  pressable: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, padding: 14 },
  body: { flex: 1, gap: 2 },
});
