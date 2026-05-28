/**
 * RecordingPulse — a calm, breathing concentric-ring animation that signals
 * the app is actively listening. Stops cleanly when `active` flips to false.
 *
 *   <RecordingPulse active size={180}>
 *     <AppText variant="display" tone="inverse">00:12</AppText>
 *   </RecordingPulse>
 */

import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withDelay,
  cancelAnimation,
} from 'react-native-reanimated';

import { useNavigationColors } from '@/theme/useNavigationTheme';
import { useReducedMotion } from './animated';

type Props = {
  active: boolean;
  size?: number;
  children?: React.ReactNode;
};

export function RecordingPulse({ active, size = 200, children }: Props) {
  const colors = useNavigationColors();
  const reduced = useReducedMotion();
  const r1 = useSharedValue(0);
  const r2 = useSharedValue(0);

  useEffect(() => {
    if (!active || reduced) {
      cancelAnimation(r1);
      cancelAnimation(r2);
      r1.value = withTiming(0, { duration: 200 });
      r2.value = withTiming(0, { duration: 200 });
      return;
    }
    r1.value = 0;
    r1.value = withRepeat(
      withTiming(1, { duration: 2200, easing: Easing.out(Easing.quad) }),
      -1,
      false
    );
    r2.value = 0;
    r2.value = withDelay(
      1100,
      withRepeat(withTiming(1, { duration: 2200, easing: Easing.out(Easing.quad) }), -1, false)
    );
  }, [active, reduced, r1, r2]);

  const a1 = useAnimatedStyle(() => ({
    transform: [{ scale: 0.85 + r1.value * 0.35 }],
    opacity: 0.55 * (1 - r1.value),
  }));
  const a2 = useAnimatedStyle(() => ({
    transform: [{ scale: 0.85 + r2.value * 0.35 }],
    opacity: 0.55 * (1 - r2.value),
  }));

  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      <Animated.View
        style={[
          styles.ring,
          a1,
          { width: size, height: size, borderRadius: size / 2, borderColor: colors.primary, borderWidth: 2 },
        ]}
      />
      <Animated.View
        style={[
          styles.ring,
          a2,
          { width: size, height: size, borderRadius: size / 2, borderColor: colors.primary, borderWidth: 2 },
        ]}
      />
      <View
        style={[
          styles.core,
          {
            width: size * 0.6,
            height: size * 0.6,
            borderRadius: (size * 0.6) / 2,
            backgroundColor: active ? colors.primary : colors.surfaceMuted,
          },
        ]}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center' },
  ring: { position: 'absolute' },
  core: { alignItems: 'center', justifyContent: 'center' },
});
