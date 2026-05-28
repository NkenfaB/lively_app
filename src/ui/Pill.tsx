import { StyleSheet, View, type ViewStyle, type StyleProp } from 'react-native';

import { useNavigationColors } from '@/theme/useNavigationTheme';
import { AppText } from './AppText';
import { metrics } from './metrics';

export type PillTone = 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info';

type Props = {
  label: string;
  tone?: PillTone;
  size?: 'sm' | 'md';
  leading?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

/**
 * Pill — small status chip. Used for "Offline", "Synced", risk levels, etc.
 *
 *   <Pill label="High risk" tone="danger" />
 */
export function Pill({ label, tone = 'neutral', size = 'sm', leading, style }: Props) {
  const colors = useNavigationColors();
  const palette = (() => {
    switch (tone) {
      case 'primary':
        return { bg: colors.primaryMuted, fg: colors.primary };
      case 'success':
        return { bg: colors.successMuted, fg: colors.success };
      case 'warning':
        return { bg: colors.warningMuted, fg: colors.warning };
      case 'danger':
        return { bg: colors.dangerMuted, fg: colors.danger };
      case 'info':
        return { bg: colors.infoMuted, fg: colors.info };
      default:
        return { bg: colors.surfaceContainer, fg: colors.onSurfaceVariant };
    }
  })();

  return (
    <View
      style={[
        styles.pill,
        {
          backgroundColor: palette.bg,
          paddingHorizontal: size === 'sm' ? 10 : 12,
          paddingVertical: size === 'sm' ? 4 : 6,
        },
        style,
      ]}>
      {leading}
      <AppText
        style={{
          color: palette.fg,
          fontFamily: 'Manrope_700Bold',
          fontSize: size === 'sm' ? 11 : 12,
          letterSpacing: 0.6,
        }}>
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: metrics.radius.pill,
    alignSelf: 'flex-start',
  },
});
