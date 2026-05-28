/**
 * Spacing, radius, elevation, and type-scale tokens.
 *
 * Body text is intentionally a hair smaller (14) for that calm, scannable
 * clinical feel. Headlines stay punchy. All sizes carry the matching
 * lineHeight + weight as part of `text(...)` helpers below.
 */

export const metrics = {
  screenPadding: 20,
  screenPaddingSmall: 16,
  hairline: 1,
  radius: {
    xs: 8,
    sm: 12,
    md: 16,
    lg: 20,
    xl: 24,
    pill: 999,
  },
  // Spring presets — tuned for ~iOS feel.
  spring: {
    snappy: { damping: 18, stiffness: 240, mass: 0.9 },
    soft: { damping: 22, stiffness: 160, mass: 1 },
    bouncy: { damping: 12, stiffness: 220, mass: 0.9 },
  },
  // Durations (ms) for non-spring transitions.
  duration: {
    instant: 120,
    fast: 180,
    normal: 240,
    slow: 360,
    splash: 600,
  },
} as const;

/**
 * Layered shadows — JS values for `StyleSheet`. The Card primitive will
 * pull `shadow.color` from the theme so it works in dark mode.
 */
export const elevation = {
  none: { shadowOpacity: 0, elevation: 0 },
  xs: {
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  sm: {
    shadowOpacity: 0.07,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  md: {
    shadowOpacity: 0.09,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  lg: {
    shadowOpacity: 0.12,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 8,
  },
} as const;

export const typeScale = {
  // Display & headlines
  display: 32,
  h1: 26,
  h2: 22,
  h3: 18,
  // Body
  body: 14, // ← intentionally smaller than RN's 16 default
  bodyLg: 15,
  bodySm: 13,
  caption: 12,
  micro: 11,
} as const;

export const lineHeight = {
  display: 38,
  h1: 32,
  h2: 28,
  h3: 24,
  body: 20,
  bodyLg: 22,
  bodySm: 18,
  caption: 16,
  micro: 14,
} as const;

/**
 * Curated text presets. Use these instead of inline {fontFamily, fontSize}
 * so the type ramp stays consistent across screens.
 *
 *   <AppText style={text.h2}>Title</AppText>
 */
export const text = {
  display: { fontFamily: 'Inter_700Bold', fontSize: typeScale.display, lineHeight: lineHeight.display, letterSpacing: -0.5 },
  h1: { fontFamily: 'Inter_700Bold', fontSize: typeScale.h1, lineHeight: lineHeight.h1, letterSpacing: -0.3 },
  h2: { fontFamily: 'Inter_700Bold', fontSize: typeScale.h2, lineHeight: lineHeight.h2, letterSpacing: -0.2 },
  h3: { fontFamily: 'Inter_700Bold', fontSize: typeScale.h3, lineHeight: lineHeight.h3 },
  bodyLg: { fontFamily: 'Inter_400Regular', fontSize: typeScale.bodyLg, lineHeight: lineHeight.bodyLg },
  body: { fontFamily: 'Inter_400Regular', fontSize: typeScale.body, lineHeight: lineHeight.body },
  bodyStrong: { fontFamily: 'Inter_600SemiBold', fontSize: typeScale.body, lineHeight: lineHeight.body },
  bodySm: { fontFamily: 'Inter_400Regular', fontSize: typeScale.bodySm, lineHeight: lineHeight.bodySm },
  bodySmStrong: { fontFamily: 'Inter_600SemiBold', fontSize: typeScale.bodySm, lineHeight: lineHeight.bodySm },
  caption: { fontFamily: 'Inter_400Regular', fontSize: typeScale.caption, lineHeight: lineHeight.caption },
  micro: { fontFamily: 'Inter_400Regular', fontSize: typeScale.micro, lineHeight: lineHeight.micro },
  eyebrow: {
    fontFamily: 'Manrope_700Bold',
    fontSize: typeScale.micro,
    lineHeight: lineHeight.micro,
    letterSpacing: 1.3,
    textTransform: 'uppercase' as const,
  },
  numeric: { fontFamily: 'Inter_700Bold', fontSize: 56, lineHeight: 60, letterSpacing: -1 },
} as const;
