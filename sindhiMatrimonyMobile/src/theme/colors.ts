export type ThemeMode = 'light' | 'dark';

export interface ThemeColors {
  // Brand & Accents
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  linearGradient: readonly [string, string, string];

  // Backgrounds & Surfaces
  background: string;
  surface: string;
  surfaceElevated: string;
  card: string;
  cardElevated: string;

  // Text colors
  text: string;
  textSecondary: string;
  textMuted: string;
  textInverse: string;
  headerTitle: string;

  // Borders & Dividers
  border: string;
  borderSubtle: string;
  divider: string;

  // Functional Status
  success: string;
  successBg: string;
  warning: string;
  warningBg: string;
  danger: string;
  dangerBg: string;
  info: string;
  infoBg: string;

  // System
  statusBar: 'light-content' | 'dark-content';
  backdrop: string;
  white: string;
  black: string;
  inactiveTab: string;
}

export const lightColors: ThemeColors = {
  primary: '#DB2F3C',
  primaryLight: '#FF4A57',
  primaryDark: '#B71F2A',
  secondary: '#FF8A00',
  linearGradient: ['#FF4A57', '#DB2F3C', '#B71F2A'] as const,

  background: '#FFFFFF',
  surface: '#F8F9FA',
  surfaceElevated: '#FFFFFF',
  card: '#FFFFFF',
  cardElevated: '#FFFFFF',

  text: '#1A1A1A',
  textSecondary: '#666666',
  textMuted: '#9CA3AF',
  textInverse: '#FFFFFF',
  headerTitle: '#1A1A1A',

  border: '#E9E9E9',
  borderSubtle: '#F3F4F6',
  divider: '#EEEEEE',

  success: '#10B981',
  successBg: '#ECFDF5',
  warning: '#F59E0B',
  warningBg: '#FFFBEB',
  danger: '#EF4444',
  dangerBg: '#FEF2F2',
  info: '#3B82F6',
  infoBg: '#EFF6FF',

  statusBar: 'dark-content',
  backdrop: 'rgba(0, 0, 0, 0.6)',
  white: '#FFFFFF',
  black: '#000000',
  inactiveTab: '#7A7A7A',
};

export const darkColors: ThemeColors = {
  primary: '#FF4A57',
  primaryLight: '#FF6B76',
  primaryDark: '#DB2F3C',
  secondary: '#FFA733',
  linearGradient: ['#FF6B76', '#FF4A57', '#DB2F3C'] as const,

  background: '#121212',
  surface: '#1E1E1E',
  surfaceElevated: '#252525',
  card: '#1E1E1E',
  cardElevated: '#282828',

  text: '#F9FAFB',
  textSecondary: '#D1D5DB',
  textMuted: '#6B7280',
  textInverse: '#111827',
  headerTitle: '#F9FAFB',

  border: '#2E2E2E',
  borderSubtle: '#1F2937',
  divider: '#2A2A2A',

  success: '#34D399',
  successBg: '#064E3B',
  warning: '#FBBF24',
  warningBg: '#451A03',
  danger: '#F87171',
  dangerBg: '#7F1D1D',
  info: '#60A5FA',
  infoBg: '#1E3A8A',

  statusBar: 'light-content',
  backdrop: 'rgba(0, 0, 0, 0.75)',
  white: '#FFFFFF',
  black: '#000000',
  inactiveTab: '#9CA3AF',
};

export const themeColorMap: Record<ThemeMode, ThemeColors> = {
  light: lightColors,
  dark: darkColors,
};

export default themeColorMap;
