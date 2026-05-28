import { Text, type TextProps, type TextStyle, type StyleProp } from 'react-native';

import { useNavigationColors } from '@/theme/useNavigationTheme';
import { text } from './metrics';

type Variant = keyof typeof text;
type Tone = 'default' | 'muted' | 'subtle' | 'primary' | 'success' | 'warning' | 'danger' | 'inverse';

type AppTextProps = TextProps & {
  variant?: Variant;
  tone?: Tone;
  align?: TextStyle['textAlign'];
};

/**
 * Themed Text. Always uses our type ramp + theme colors.
 *
 *   <AppText variant="h2">Settings</AppText>
 *   <AppText variant="bodySm" tone="muted">Last sync 2m ago</AppText>
 */
export function AppText({ variant = 'body', tone = 'default', align, style, ...rest }: AppTextProps) {
  const colors = useNavigationColors();
  const color = (() => {
    switch (tone) {
      case 'muted':
        return colors.onSurfaceVariant;
      case 'subtle':
        return colors.outline;
      case 'primary':
        return colors.primary;
      case 'success':
        return colors.success;
      case 'warning':
        return colors.warning;
      case 'danger':
        return colors.danger;
      case 'inverse':
        return colors.onPrimary;
      default:
        return colors.onSurface;
    }
  })();

  const baseStyle: StyleProp<TextStyle> = { color, textAlign: align, ...text[variant] };
  return <Text {...rest} style={[baseStyle, style]} />;
}
