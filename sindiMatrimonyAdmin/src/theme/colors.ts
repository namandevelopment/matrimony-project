export type ThemeMode = 'light' | 'dark';

export interface ThemeColors {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  navy: string;
  navyDark: string;
  background: string;
  surface: string;
  card: string;
  text: string;
  textSecondary: string;
  border: string;
  success: string;
  warning: string;
  danger: string;
  info: string;
}

export const lightColors: ThemeColors = {
  primary: '#DB2F3C',
  primaryLight: '#FF4A57',
  primaryDark: '#B71F2A',
  secondary: '#EAB308', // Sindhi cultural gold
  navy: '#0F172A',
  navyDark: '#020617',
  background: '#F8FAFC',
  surface: '#FFFFFF',
  card: '#FFFFFF',
  text: '#0F172A',
  textSecondary: '#64748B',
  border: '#E2E8F0',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#0284C7',
};
