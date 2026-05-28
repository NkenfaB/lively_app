import { Pressable, StyleSheet, View, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Animated from 'react-native-reanimated';

import { useNavigationColors } from '@/theme/useNavigationTheme';
import { AppText } from './AppText';
import { metrics } from './metrics';
import { usePressScale } from './animated';
import { haptic } from './haptics';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Props = Omit<PressableProps, 'children' | 'style'> & {
  title: string;
  subtitle?: string;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  showChevron?: boolean;
  style?: StyleProp<ViewStyle>;
};

/**
 * ListItem — a Settings-style row with optional leading icon, subtitle,
 * trailing slot, and chevron. Press feedback + haptic built in.
 */
export function ListItem({
  title,
  subtitle,
  leading,
  trailing,
  showChevron,
  onPress,
  disabled,
  style,
  ...rest
}: Props) {
  const colors = useNavigationColors();
  const press = usePressScale(0.99);
  const interactive = Boolean(onPress) && !disabled;

  return (
    <AnimatedPressable
      onPress={(e) => {
        if (!interactive) return;
        haptic.selection();
        onPress?.(e);
      }}
      onPressIn={interactive ? press.onPressIn : undefined}
      onPressOut={interactive ? press.onPressOut : undefined}
      disabled={disabled}
      style={[interactive ? press.style : null, styles.row, { opacity: disabled ? 0.5 : 1 }, style]}
      {...rest}>
      {leading ? <View style={styles.leading}>{leading}</View> : null}
      <View style={styles.text}>
        <AppText variant="bodyStrong">{title}</AppText>
        {subtitle ? (
          <AppText variant="caption" tone="muted">
            {subtitle}
          </AppText>
        ) : null}
      </View>
      {trailing ? <View style={styles.trailing}>{trailing}</View> : null}
      {showChevron ? <MaterialIcons name="chevron-right" size={20} color={colors.outline} /> : null}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 12,
    borderRadius: metrics.radius.md,
  },
  leading: { alignItems: 'center', justifyContent: 'center' },
  text: { flex: 1, gap: 2 },
  trailing: { alignItems: 'flex-end', justifyContent: 'center' },
});
