import { PropsWithChildren } from 'react';
import { StyleSheet, View, type ViewStyle, type StyleProp } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { useNavigationColors, useResolvedScheme } from '@/theme/useNavigationTheme';

type ScreenProps = PropsWithChildren<{
  /** Safe-area edges to apply. Defaults to top/left/right. */
  edges?: Edge[];
  /** Pass-through style for the SafeAreaView. */
  style?: StyleProp<ViewStyle>;
  /** If true, render without inner padding — useful for full-bleed screens. */
  fullBleed?: boolean;
}>;

/**
 * Themed Screen wrapper with auto-themed StatusBar.
 *
 * On every screen, the status bar foreground color is computed from the
 * resolved theme (system + user override), so it always reads correctly.
 */
export function Screen({ edges = ['top', 'left', 'right'], style, fullBleed, children }: ScreenProps) {
  const colors = useNavigationColors();
  const scheme = useResolvedScheme();
  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.background }, style]} edges={edges}>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} animated />
      {fullBleed ? children : <View style={styles.flex}>{children}</View>}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  flex: { flex: 1 },
});
