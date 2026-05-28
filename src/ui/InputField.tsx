/**
 * InputField — labeled text input with focus ring and error state.
 *
 *   <InputField label="Email" value={email} onChangeText={setEmail}
 *               keyboardType="email-address" autoCapitalize="none" />
 */

import { forwardRef, useState } from 'react';
import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { useNavigationColors } from '@/theme/useNavigationTheme';
import { AppText } from './AppText';
import { metrics, text } from './metrics';

type Props = TextInputProps & {
  label: string;
  helperText?: string;
  errorText?: string;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
};

export const InputField = forwardRef<TextInput, Props>(function InputField(
  { label, helperText, errorText, leading, trailing, onFocus, onBlur, style, ...rest },
  ref
) {
  const colors = useNavigationColors();
  const [focused, setFocused] = useState(false);
  const borderColor = errorText
    ? colors.danger
    : focused
    ? colors.primary
    : colors.outlineMuted;

  return (
    <View style={styles.wrap}>
      <AppText variant="eyebrow" tone="muted">
        {label}
      </AppText>
      <View
        style={[
          styles.field,
          {
            backgroundColor: colors.surface,
            borderColor,
            borderWidth: focused || errorText ? 1.5 : 1,
          },
        ]}>
        {leading}
        <TextInput
          ref={ref}
          {...rest}
          placeholderTextColor={colors.outline}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          style={[styles.input, { color: colors.onSurface, ...text.body }, style]}
        />
        {trailing}
      </View>
      {errorText ? (
        <AppText variant="caption" tone="danger">
          {errorText}
        </AppText>
      ) : helperText ? (
        <AppText variant="caption" tone="muted">
          {helperText}
        </AppText>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: { gap: 6 },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 48,
    paddingHorizontal: 14,
    borderRadius: metrics.radius.md,
  },
  input: { flex: 1, paddingVertical: 0 },
});
