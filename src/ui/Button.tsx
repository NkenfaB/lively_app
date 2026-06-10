import { forwardRef } from 'react';
import {
  ActivityIndicator,
  Pressable,
  View,
  type GestureResponderEvent,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Animated from 'react-native-reanimated';

import { useNavigationColors } from '@/theme/useNavigationTheme';
import { AppText } from './AppText';
import { metrics } from './metrics';
import { usePressScale } from './animated';
import { haptic } from './haptics';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'inverted' | 'danger' | 'success';
export type ButtonSize = 'lg' | 'md' | 'sm';

type ButtonProps = Omit<PressableProps, 'style' | 'children'> & {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  hapticFeedback?: 'none' | 'light' | 'medium' | 'heavy';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

/**
 * Button — single primitive replacing PrimaryButton/SecondaryButton/InvertedButton.
 * Backwards-compat wrappers below keep older imports working.
 *
 *   <Button title="Start" variant="primary" size="lg" loading />
 */
export const Button = forwardRef<View, ButtonProps>(function Button(
  {
    title,
    variant = 'primary',
    size = 'lg',
    loading = false,
    fullWidth = true,
    disabled,
    hapticFeedback = 'light',
    leftIcon,
    rightIcon,
    onPress,
    style,
    ...rest
  },
  ref
) {
  const colors = useNavigationColors();
  const press = usePressScale(0.97);
  const isDisabled = disabled || loading;

  const palette = (() => {
    switch (variant) {
      case 'secondary':
        return { bg: 'transparent', fg: colors.onSurface, border: colors.outlineMuted };
      case 'ghost':
        return { bg: 'transparent', fg: colors.primary, border: 'transparent' };
      case 'inverted':
        return { bg: colors.surface, fg: colors.primary, border: 'transparent' };
      case 'danger':
        return { bg: colors.danger, fg: colors.onDanger, border: 'transparent' };
      case 'success':
        return { bg: colors.success, fg: colors.onSuccess, border: 'transparent' };
      default:
        return { bg: colors.primary, fg: colors.onPrimary, border: 'transparent' };
    }
  })();

  const height = size === 'sm' ? 40 : size === 'md' ? 48 : 56;
  const fontSize = size === 'sm' ? 13 : 15;
  const textLineHeight = size === 'sm' ? 18 : 22;

  function handlePress(e: GestureResponderEvent) {
    if (isDisabled) return;
    if (hapticFeedback === 'medium') haptic.press();
    else if (hapticFeedback === 'heavy') haptic.heavy();
    else if (hapticFeedback !== 'none') haptic.tap();
    onPress?.(e);
  }

  return (
    <AnimatedPressable
      ref={ref as any}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      onPress={handlePress}
      onPressIn={press.onPressIn}
      onPressOut={press.onPressOut}
      disabled={isDisabled}
      style={[
        press.style,
        {
          height,
          borderRadius: metrics.radius.lg,
          backgroundColor: palette.bg,
          borderColor: palette.border,
          borderWidth: variant === 'secondary' ? 1 : 0,
          opacity: isDisabled ? 0.55 : 1,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          paddingHorizontal: 18,
          gap: 8,
          alignSelf: fullWidth ? 'stretch' : 'flex-start',
        },
        style,
      ]}
      {...rest}>
      {loading ? (
        <ActivityIndicator color={palette.fg} />
      ) : (
        <>
          {leftIcon}
          <AppText
            style={{
              color: palette.fg,
              fontFamily: 'Inter_700Bold',
              fontSize,
              includeFontPadding: true,
              lineHeight: textLineHeight,
              paddingHorizontal: 2,
            }}
            numberOfLines={1}>
            {title}
          </AppText>
          {rightIcon}
        </>
      )}
    </AnimatedPressable>
  );
});

/** Legacy wrappers for backwards-compat with existing imports. */
type LegacyProps = { title: string; onPress?: () => void; disabled?: boolean; style?: StyleProp<ViewStyle> };
export const PrimaryButton = (p: LegacyProps) => <Button {...p} variant="primary" hapticFeedback="medium" />;
export const SecondaryButton = (p: LegacyProps) => <Button {...p} variant="secondary" size="md" />;
export const InvertedButton = (p: LegacyProps) => <Button {...p} variant="inverted" hapticFeedback="medium" />;
