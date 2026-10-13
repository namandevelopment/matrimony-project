/**
 * Centralized Font Family definitions for Sindhi Matrimony
 * Connects directly to Google Fonts configured in Next.js RootLayout:
 * - Sans / Body / Primary: Plus Jakarta Sans (via var(--font-sans))
 * - Heading / Brand / Display: Outfit (via var(--font-heading))
 */

export const fontFamily = {
  // Primary UI & Body Font (Plus Jakarta Sans)
  sans: 'var(--font-sans), var(--font-plus-jakarta), ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  primary: 'var(--font-sans), var(--font-plus-jakarta), ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  body: 'var(--font-sans), var(--font-plus-jakarta), ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  plusJakartaSans: 'var(--font-sans), var(--font-plus-jakarta), ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',

  // Heading & Brand Display Font (Outfit)
  heading: 'var(--font-heading), var(--font-outfit), ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  secondary: 'var(--font-heading), var(--font-outfit), ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  display: 'var(--font-heading), var(--font-outfit), ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  outfit: 'var(--font-heading), var(--font-outfit), ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',

  // Tailwind class helpers for className usage
  classes: {
    sans: 'font-sans',
    primary: 'font-sans',
    body: 'font-sans',
    heading: 'font-heading',
    display: 'font-heading',
    outfit: 'font-heading',
  },
} as const;

export type FontFamilyType = typeof fontFamily;

export default fontFamily;