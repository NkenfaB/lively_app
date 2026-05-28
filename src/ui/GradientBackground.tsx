import { PropsWithChildren } from 'react';
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { useNavigationColors } from '@/theme/useNavigationTheme';
import { brandGradient } from '@/theme/tokens';

type Props = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
  variant?: 'brand' | 'subtle';
}>;

/**
 * Linear gradient using the theme's brand colors. `subtle` uses two close
 * surface shades for a barely-there glow (used in card headers).
 */
export function GradientBackground({ style, variant = 'brand', children }: Props) {
  const colors = useNavigationColors();
  const stops =
    variant === 'subtle'
      ? ([colors.surface, colors.surfaceContainer] as const)
      : brandGradient(colors);
  return (
    <LinearGradient
      colors={[...stops] as [string, string]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.fill, style]}>
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  fill: { ...StyleSheet.absoluteFillObject },
});
