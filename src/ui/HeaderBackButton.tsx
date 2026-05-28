/**
 * HeaderBackButton — custom themed back button for expo-router headers.
 * Pulls in the theme so it looks correct in both light and dark mode and
 * provides a subtle press animation + haptic.
 */

import { MaterialIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { useNavigationColors } from '@/theme/useNavigationTheme';
import { haptic } from './haptics';

type Props = { tint?: string; canGoBack?: boolean };

export function HeaderBackButton({ tint, canGoBack = true }: Props) {
  const colors = useNavigationColors();
  const router = useRouter();
  if (!canGoBack) return null;
  return (
    <Pressable
      onPress={() => {
        haptic.selection();
        router.back();
      }}
      hitSlop={12}
      accessibilityRole="button"
      accessibilityLabel="Back"
      style={({ pressed }) => [styles.btn, { backgroundColor: colors.surfaceContainer, opacity: pressed ? 0.7 : 1 }]}>
      <View style={styles.icon}>
        <MaterialIcons name="arrow-back" size={18} color={tint ?? colors.onSurface} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: { width: 36, height: 36, borderRadius: 999, alignItems: 'center', justifyContent: 'center', marginLeft: 4 },
  icon: { alignItems: 'center', justifyContent: 'center' },
});
