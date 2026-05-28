import { PropsWithChildren } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { useNavigationColors } from '@/theme/useNavigationTheme';
import { elevation, metrics } from './metrics';

type Tone = 'surface' | 'container' | 'muted' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
type Density = 'comfortable' | 'cozy' | 'tight' | 'none';
type Elev = keyof typeof elevation;

type CardProps = PropsWithChildren<{
  tone?: Tone;
  elev?: Elev;
  bordered?: boolean;
  density?: Density;
  style?: StyleProp<ViewStyle>;
}>;

/**
 * Card — a themed container with elevation, optional hairline border,
 * and a tone palette. Replaces the older single-style Card primitive.
 */
export function Card({ tone = 'surface', elev = 'sm', bordered = false, density = 'comfortable', style, children }: CardProps) {
  const colors = useNavigationColors();
  const bg = (() => {
    switch (tone) {
      case 'container':
        return colors.surfaceContainer;
      case 'muted':
        return colors.surfaceMuted;
      case 'primary':
        return colors.primaryMuted;
      case 'success':
        return colors.successMuted;
      case 'warning':
        return colors.warningMuted;
      case 'danger':
        return colors.dangerMuted;
      case 'info':
        return colors.infoMuted;
      default:
        return colors.surface;
    }
  })();

  const padding = density === 'none' ? 0 : density === 'tight' ? 12 : density === 'cozy' ? 14 : 16;
  const shadow = elevation[elev];

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: bg,
          padding,
          shadowColor: colors.shadowColor,
          borderColor: bordered ? colors.outlineMuted : 'transparent',
          borderWidth: bordered ? StyleSheet.hairlineWidth : 0,
          ...shadow,
        },
        style,
      ]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: metrics.radius.lg },
});
