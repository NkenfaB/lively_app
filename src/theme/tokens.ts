/**
 * Design tokens — the single source of truth for color, gradient, and elevation.
 *
 * The palette is "clinical & trustworthy": calm cobalt blues, neutral surfaces,
 * restrained semantic colors. Light and dark variants are tuned for parity
 * (same hue family, comparable contrast). System dark mode is honored
 * automatically via `useNavigationTheme` -> `useColorScheme()`.
 */

export type ThemeColors = {
  // Backgrounds & surfaces (Material 3 style hierarchy)
  background: string;
  onBackground: string;
  surface: string;
  surfaceContainer: string; // raised secondary surface (chips, inset cards)
  surfaceMuted: string; // for skeletons, hover, subtle wells
  onSurface: string;
  onSurfaceVariant: string; // secondary text
  outline: string; // borders, dividers, inactive states
  outlineMuted: string; // hair-line dividers

  // Brand / primary
  primary: string;
  primaryMuted: string; // tinted backgrounds for primary surfaces (e.g. `${primary}14`)
  onPrimary: string;

  // Semantic intents
  success: string;
  onSuccess: string;
  successMuted: string;
  warning: string;
  onWarning: string;
  warningMuted: string;
  danger: string;
  onDanger: string;
  dangerMuted: string;
  info: string;
  onInfo: string;
  infoMuted: string;

  // Decorative
  gradientFrom: string;
  gradientTo: string;
  scrim: string; // image overlays
  shadowColor: string;
};

export const lightColors: ThemeColors = {
  // Surfaces
  background: '#f6f8fb',
  onBackground: '#0b1220',
  surface: '#ffffff',
  surfaceContainer: '#eef2f7',
  surfaceMuted: '#e6ecf3',
  onSurface: '#0b1220',
  onSurfaceVariant: '#4b5563',
  outline: '#9aa3af',
  outlineMuted: '#e2e8f0',

  // Brand
  primary: '#003a7a',
  primaryMuted: '#dfe9f8',
  onPrimary: '#ffffff',

  // Semantic
  success: '#0b6b2c',
  onSuccess: '#ffffff',
  successMuted: '#daf2e1',
  warning: '#b26a00',
  onWarning: '#ffffff',
  warningMuted: '#fdecd2',
  danger: '#ba1a1a',
  onDanger: '#ffffff',
  dangerMuted: '#fde2e1',
  info: '#0b5fa3',
  onInfo: '#ffffff',
  infoMuted: '#dcebfb',

  // Decorative
  gradientFrom: '#0b4ea0',
  gradientTo: '#003a7a',
  scrim: 'rgba(7, 17, 38, 0.42)',
  shadowColor: '#0b1220',
};

export const darkColors: ThemeColors = {
  // Surfaces
  background: '#070b14',
  onBackground: '#e6edf7',
  surface: '#0f1726',
  surfaceContainer: '#152033',
  surfaceMuted: '#1b2840',
  onSurface: '#e6edf7',
  onSurfaceVariant: '#a9b4c3',
  outline: '#48566c',
  outlineMuted: '#1f2a3e',

  // Brand
  primary: '#a8c6ff',
  primaryMuted: '#1b2a44',
  onPrimary: '#001a36',

  // Semantic
  success: '#6dd391',
  onSuccess: '#03260e',
  successMuted: '#16331f',
  warning: '#f3b663',
  onWarning: '#2a1a00',
  warningMuted: '#3a2a10',
  danger: '#ff8e88',
  onDanger: '#370000',
  dangerMuted: '#3a1c1c',
  info: '#7fb4ec',
  onInfo: '#001a36',
  infoMuted: '#1a2a40',

  // Decorative
  gradientFrom: '#0e4596',
  gradientTo: '#0a2658',
  scrim: 'rgba(0, 0, 0, 0.55)',
  shadowColor: '#000000',
};

/** Convenience tuple for LinearGradient. */
export function brandGradient(c: ThemeColors): readonly [string, string] {
  return [c.gradientFrom, c.gradientTo] as const;
}
