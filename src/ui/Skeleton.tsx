import { useEffect } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';

import { useNavigationColors } from '@/theme/useNavigationTheme';
import { useReducedMotion } from './animated';
import { metrics } from './metrics';

type Props = {
  width?: number | `${number}%`;
  height?: number;
  radius?: number;
  style?: ViewStyle;
};

/**
 * Shimmering placeholder block. Replaces "loading…" text everywhere.
 *
 *   <Skeleton width="60%" height={16} />
 */
export function Skeleton({ width = '100%', height = 14, radius = 8, style }: Props) {
  const colors = useNavigationColors();
  const reduced = useReducedMotion();
  const progress = useSharedValue(0);

  useEffect(() => {
    if (reduced) return;
    progress.value = 0;
    progress.value = withRepeat(
      withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.quad) }),
      -1,
      true
    );
  }, [reduced, progress]);

  const animated = useAnimatedStyle(() => ({
    opacity: reduced ? 0.6 : 0.4 + progress.value * 0.5,
  }));

  return (
    <Animated.View
      style={[
        styles.base,
        animated,
        { width: width as any, height, borderRadius: radius, backgroundColor: colors.surfaceMuted },
        style,
      ]}
    />
  );
}

/** Convenience: multi-line skeleton, like a paragraph placeholder. */
export function SkeletonLines({ lines = 3, lineHeight = 12, gap = 8 }: { lines?: number; lineHeight?: number; gap?: number }) {
  return (
    <View style={{ gap }}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} height={lineHeight} width={i === lines - 1 ? ('70%' as const) : ('100%' as const)} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  base: { borderRadius: metrics.radius.sm },
});
