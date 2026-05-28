/**
 * ScoreMeter — animated horizontal score meter.
 *
 * Trades the typical circular ring for a clinical-feeling horizontal bar
 * with a gradient fill. This avoids extra deps (no react-native-svg) and
 * matches how medical apps usually present screening confidence.
 *
 *   <ScoreMeter value={0.72} tone="warning" label="confidence" />
 */

import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming, Easing } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

import { useNavigationColors } from '@/theme/useNavigationTheme';
import { AppText } from './AppText';
import { metrics } from './metrics';

type Tone = 'primary' | 'success' | 'warning' | 'danger' | 'info';

type Props = {
  value: number; // 0..1
  tone?: Tone;
  height?: number;
  label?: string;
  showPercent?: boolean;
};

export function ScoreMeter({ value, tone = 'primary', height = 14, label, showPercent = true }: Props) {
  const colors = useNavigationColors();
  const clamped = Math.max(0, Math.min(1, value));
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(clamped, { duration: 700, easing: Easing.out(Easing.cubic) });
  }, [clamped, progress]);

  const fillColor =
    tone === 'success'
      ? colors.success
      : tone === 'warning'
      ? colors.warning
      : tone === 'danger'
      ? colors.danger
      : tone === 'info'
      ? colors.info
      : colors.primary;

  const fillStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  // Lighter shade of the fill, used as the gradient start.
  const fillStart = `${fillColor}88`;

  return (
    <View style={styles.wrap}>
      <View
        style={[
          styles.track,
          {
            backgroundColor: colors.surfaceMuted,
            height,
            borderRadius: height / 2,
          },
        ]}>
        <Animated.View style={[styles.fillWrap, fillStyle]}>
          <LinearGradient
            colors={[fillStart, fillColor]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.fill, { borderRadius: height / 2 }]}
          />
        </Animated.View>
      </View>
      {(label || showPercent) && (
        <View style={styles.legend}>
          {label ? (
            <AppText variant="caption" tone="muted">
              {label}
            </AppText>
          ) : null}
          {showPercent ? (
            <AppText variant="caption" style={{ color: fillColor, fontFamily: 'Manrope_700Bold' }}>
              {Math.round(clamped * 100)}%
            </AppText>
          ) : null}
        </View>
      )}
    </View>
  );
}

// Backwards-compat alias.
export const ProgressRing = ScoreMeter;

const styles = StyleSheet.create({
  wrap: { gap: 6 },
  track: { overflow: 'hidden', width: '100%' },
  fillWrap: { height: '100%' },
  fill: { ...StyleSheet.absoluteFillObject },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: metrics.hairline,
  },
});
