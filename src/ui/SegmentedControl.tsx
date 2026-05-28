/**
 * SegmentedControl — iOS-style switch group, used for theme picker etc.
 *
 *   <SegmentedControl
 *     value={mode}
 *     onChange={setMode}
 *     options={[
 *       { value: 'system', label: 'System' },
 *       { value: 'light', label: 'Light' },
 *       { value: 'dark', label: 'Dark' },
 *     ]}
 *   />
 */

import { Pressable, StyleSheet, View } from 'react-native';

import { useNavigationColors } from '@/theme/useNavigationTheme';
import { AppText } from './AppText';
import { metrics } from './metrics';
import { haptic } from './haptics';

type Option<T extends string> = { value: T; label: string };

type Props<T extends string> = {
  value: T;
  onChange: (next: T) => void;
  options: Option<T>[];
};

export function SegmentedControl<T extends string>({ value, onChange, options }: Props<T>) {
  const colors = useNavigationColors();
  return (
    <View style={[styles.wrap, { backgroundColor: colors.surfaceContainer }]}>
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <Pressable
            key={opt.value}
            onPress={() => {
              if (active) return;
              haptic.selection();
              onChange(opt.value);
            }}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            style={[
              styles.seg,
              active && {
                backgroundColor: colors.surface,
                shadowColor: colors.shadowColor,
                shadowOpacity: 0.08,
                shadowRadius: 4,
                shadowOffset: { width: 0, height: 1 },
                elevation: 2,
              },
            ]}>
            <AppText
              style={{
                color: active ? colors.onSurface : colors.onSurfaceVariant,
                fontFamily: active ? 'Inter_700Bold' : 'Inter_600SemiBold',
                fontSize: 13,
              }}>
              {opt.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    padding: 3,
    borderRadius: metrics.radius.pill,
    alignSelf: 'flex-start',
    gap: 2,
  },
  seg: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: metrics.radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 70,
  },
});
