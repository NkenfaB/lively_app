---
name: Clinical Diagnostic Mobile
colors:
  surface: '#f9f9fe'
  surface-dim: '#d9d9df'
  surface-bright: '#f9f9fe'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f9'
  surface-container: '#ededf3'
  surface-container-high: '#e8e8ed'
  surface-container-highest: '#e2e2e7'
  on-surface: '#1a1c20'
  on-surface-variant: '#424750'
  inverse-surface: '#2f3035'
  inverse-on-surface: '#f0f0f6'
  outline: '#737781'
  outline-variant: '#c3c6d1'
  surface-tint: '#335f99'
  primary: '#003466'
  on-primary: '#ffffff'
  primary-container: '#1a4b84'
  on-primary-container: '#93bcfc'
  inverse-primary: '#a6c8ff'
  secondary: '#006e25'
  on-secondary: '#ffffff'
  secondary-container: '#80f98b'
  on-secondary-container: '#007327'
  tertiary: '#433100'
  on-tertiary: '#ffffff'
  tertiary-container: '#5f4600'
  on-tertiary-container: '#ebb100'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d5e3ff'
  primary-fixed-dim: '#a6c8ff'
  on-primary-fixed: '#001c3b'
  on-primary-fixed-variant: '#144780'
  secondary-fixed: '#83fc8e'
  secondary-fixed-dim: '#66df75'
  on-secondary-fixed: '#002106'
  on-secondary-fixed-variant: '#00531a'
  tertiary-fixed: '#ffdf9e'
  tertiary-fixed-dim: '#fabd00'
  on-tertiary-fixed: '#261a00'
  on-tertiary-fixed-variant: '#5b4300'
  background: '#f9f9fe'
  on-background: '#1a1c20'
  surface-variant: '#e2e2e7'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-caps:
    fontFamily: Manrope
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.05em
  label-md:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  touch-target: 44px
  container-padding: 20px
---

## Brand & Style

This design system is built upon a **Corporate / Modern** aesthetic tailored specifically for clinical accuracy and user reassurance. The brand personality is authoritative yet accessible, minimizing cognitive load for users who may be in a state of health-related anxiety. 

The style prioritizes clarity through a high-contrast interface, utilizing expansive white space and a structured hierarchy. It avoids decorative elements in favor of functional precision, ensuring that the "CoughScreen" diagnostic data remains the primary focus. The emotional response is one of trust, reliability, and medical-grade professionalism.

## Colors

The color palette is strictly functional. The **Deep Blue** primary color establishes a foundation of clinical stability. Semantic colors—**Success Green**, **Warning Amber**, and **Danger Red**—are used exclusively for risk assessment results and status indicators to prevent visual noise.

In Dark Mode, surfaces use a tiered grayscale to maintain depth, ensuring that the high-contrast relationship between text and background is preserved for legibility. Pure White is used for the light mode background to mimic the clean environment of a medical facility.

## Typography

This design system utilizes **Inter** for its systematic, neutral qualities, ensuring high legibility across various screen densities. **Manrope** is introduced for labels and secondary metadata to provide a slightly more refined, modern touch to technical data.

Headings are bold and large to provide immediate context. Body text maintains a generous line height (1.5x) to ensure diagnostic instructions are easily readable by users of all ages.

## Layout & Spacing

The layout follows a **Fluid Grid** model optimized for mobile devices. It utilizes a 4px baseline shift to maintain mathematical harmony. Safe area margins are set at 20px to prevent content from crowding the edges of modern edge-to-edge displays.

All interactive elements must adhere to a minimum touch target of 44px. Spacing between card elements should remain consistent at 16px (md) to create a clear rhythmic separation between different diagnostic metrics.

## Elevation & Depth

Visual hierarchy is achieved through **Tonal Layers** and **Ambient Shadows**. Surfaces at the base level are flat. Interactive cards and primary containers use a subtle, highly-diffused shadow (Y: 4px, Blur: 12px, Opacity: 6%) to indicate interactability without appearing "heavy."

In Dark Mode, elevation is communicated through increasing the lightness of the surface color rather than increasing shadow opacity, following standard modern accessible practices.

## Shapes

The design system employs **Rounded** corners (0.5rem / 8px base) with larger containers like cards and primary action buttons using `rounded-lg` (1rem / 16px) or `rounded-xl` (1.5rem / 24px). This softness counteracts the clinical "coldness" of the deep blue and white palette, making the application feel more user-friendly and modern.

## Components

### Buttons
Primary buttons use the Deep Blue background with White text. Secondary buttons use a light gray or subtle blue tint. All buttons must have a height of 48-56px for easy thumb access.

### Cards
Cards are the primary vessel for information. They should feature a White background (or Dark Gray in Dark Mode), 16px corner radius, and a subtle border (1px #E9ECEF) to define edges in high-light environments.

### Input Fields
Text inputs and selection menus use a 12px corner radius. The active state is indicated by a 2px Deep Blue border. Error states utilize the Danger Red for both the border and supportive helper text.

### Icons
Use **Outline style** icons with a 2px stroke weight. Icons should be sourced from medical-themed sets to ensure professional visual metaphors (e.g., lungs, shields, stethoscopes).

### Risk Indicators (Chips)
Small, rounded-pill chips used for status. They combine a light background tint of the semantic color with high-contrast dark text of the same hue (e.g., Light Red background with Dark Red text) for maximum accessibility.