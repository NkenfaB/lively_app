/**
 * Motion primitives. Built on react-native-reanimated.
 *
 * Animations are purposeful, not decorative:
 *   - enter*: gentle stagger on mount (200–400ms)
 *   - press: tiny scale on Pressables (via `usePressScale`)
 *   - spring presets in metrics.spring
 *
 * Everything is also gated by `useReducedMotion` (system accessibility setting).
 */

import { useEffect } from 'react';
import { AccessibilityInfo } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  FadeInUp,
  FadeOut,
  Layout,
  ReduceMotion,
  useReducedMotion,
  useSharedValue,
  withSpring,
  withTiming,
  type WithSpringConfig,
} from 'react-native-reanimated';

import { metrics } from './metrics';

export const A = {
  View: Animated.View,
  Text: Animated.Text,
  ScrollView: Animated.ScrollView,
};

// Re-export so screens can read this once and skip animations conditionally.
export { useReducedMotion };

const cubic = Easing.out(Easing.cubic);

export function enterFade(delayMs = 0) {
  return FadeIn.duration(metrics.duration.slow).easing(cubic).delay(delayMs).reduceMotion(ReduceMotion.System);
}

export function enterUp(delayMs = 0) {
  return FadeInUp.duration(420).easing(cubic).delay(delayMs).reduceMotion(ReduceMotion.System);
}

export function enterDown(delayMs = 0) {
  return FadeInDown.duration(420).easing(cubic).delay(delayMs).reduceMotion(ReduceMotion.System);
}

export function exitFade() {
  return FadeOut.duration(metrics.duration.fast).reduceMotion(ReduceMotion.System);
}

/** Smooth list/row layout transitions (entry, exit, reorder). */
export function smoothLayout() {
  return Layout.springify().damping(20).stiffness(180).mass(0.9).reduceMotion(ReduceMotion.System);
}

/**
 * Hook that returns an animated scale `style` for press feedback.
 * Lets us avoid per-component inline transform logic.
 */
export function usePressScale(scaleTo = 0.97) {
  const scale = useSharedValue(1);
  const reduced = useReducedMotion();
  const onPressIn = () => {
    if (reduced) return;
    scale.value = withSpring(scaleTo, metrics.spring.snappy as WithSpringConfig);
  };
  const onPressOut = () => {
    scale.value = withSpring(1, metrics.spring.snappy as WithSpringConfig);
  };
  return {
    style: { transform: [{ scale }] as const },
    onPressIn,
    onPressOut,
  };
}

/** Tiny helper for cross-fading colors/numbers without writing every config. */
export function useFadeOnMount(durationMs = metrics.duration.normal) {
  const opacity = useSharedValue(0);
  useEffect(() => {
    opacity.value = withTiming(1, { duration: durationMs, easing: cubic });
  }, [durationMs, opacity]);
  return opacity;
}

/** Programmatic check of system reduce-motion (non-hook, e.g. in effects). */
export async function reduceMotionEnabled(): Promise<boolean> {
  try {
    return await AccessibilityInfo.isReduceMotionEnabled();
  } catch {
    return false;
  }
}
