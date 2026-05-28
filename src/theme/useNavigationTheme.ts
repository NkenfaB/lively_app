import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import { useColorScheme } from 'react-native';

import { useAppSelector } from '@/store/hooks';
import { ThemeMode } from '@/store/slices/settingsSlice';
import { darkColors, lightColors, type ThemeColors } from './tokens';

function resolveThemeMode(system: 'light' | 'dark', mode: ThemeMode): 'light' | 'dark' {
  if (mode === 'system') return system;
  return mode;
}

/**
 * Hook that returns the resolved color scheme name. Useful for components
 * that need to branch behaviour (e.g. StatusBar bar-style, gradient stops).
 */
export function useResolvedScheme(): 'light' | 'dark' {
  const system = useColorScheme() ?? 'light';
  const mode = useAppSelector((s) => s.settings.themeMode);
  return resolveThemeMode(system, mode);
}

export function useNavigationTheme() {
  const scheme = useResolvedScheme();
  const colors = scheme === 'dark' ? darkColors : lightColors;
  const base = scheme === 'dark' ? DarkTheme : DefaultTheme;
  return {
    ...base,
    colors: {
      ...base.colors,
      background: colors.background,
      card: colors.surface,
      text: colors.onSurface,
      primary: colors.primary,
      border: colors.outlineMuted,
      notification: colors.primary,
    },
  };
}

/**
 * Returns the full themed color token set. Replaces the old narrow surface.
 * All previously-used keys remain (`background`, `surface`, `primary`, …) so
 * existing screens keep compiling.
 */
export function useNavigationColors(): ThemeColors {
  const scheme = useResolvedScheme();
  return scheme === 'dark' ? darkColors : lightColors;
}
