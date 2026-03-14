import { DarkTheme, DefaultTheme, type Theme } from '@react-navigation/native';

// ─────────────────────────────────────────────────────────────
//  TKD STRIKE – Design System Tokens
//  Brand   : #E8622A (orange vibrant)
//  Dark bg : #0D0905 (brun-noir dojo)
//  Light bg: #F8F3EF (ivoire chaud)
// ─────────────────────────────────────────────────────────────

/** Palette de base accessible partout dans le code natif */
export const COLORS = {
  // Brand
  brand: '#E8622A',
  brandDark: '#C44E1C',
  brandLight: '#F07A45',

  // Backgrounds dark
  bgDark: '#0D0905',
  surfaceDark: '#1A1008',
  surfaceElevatedDark: '#231810',
  navyDark: '#1B2535',
  borderDark: '#2D2015',

  // Backgrounds light
  bgLight: '#F8F3EF',
  surfaceLight: '#FFFFFF',
  borderLight: '#DDD5CC',
  mutedLight: '#E6DDD6',

  // Text
  textLight: '#FFFFFF',
  textDark: '#1A0F07',
  textMuted: '#9A9A9A',
  textMutedLight: '#7A6E68',

  // Feedback
  success: '#22C55E',
  warning: '#F59E0B',
  destructive: '#EF4444',

  // Catégories exercices
  categoryMobility: '#3B82F6',
  categoryFlexibility: '#22C55E',
  categoryStrength: '#E8622A',
} as const;

export const THEME = {
  light: {
    background: 'hsl(27 40% 95%)',
    foreground: 'hsl(24 58% 6%)',
    card: 'hsl(0 0% 100%)',
    cardForeground: 'hsl(24 58% 6%)',
    popover: 'hsl(0 0% 100%)',
    popoverForeground: 'hsl(24 58% 6%)',
    primary: 'hsl(20 81% 54%)', // #E8622A
    primaryForeground: 'hsl(0 0% 100%)',
    secondary: 'hsl(27 30% 92%)',
    secondaryForeground: 'hsl(24 58% 6%)',
    muted: 'hsl(25 20% 87%)',
    mutedForeground: 'hsl(16 8% 44%)',
    accent: 'hsl(20 81% 54%)',
    accentForeground: 'hsl(0 0% 100%)',
    destructive: 'hsl(0 84.2% 60.2%)',
    border: 'hsl(27 21% 83%)',
    input: 'hsl(27 20% 90%)',
    ring: 'hsl(20 81% 54%)',
    radius: '0.75rem',
    chart1: 'hsl(20 81% 54%)',
    chart2: 'hsl(216 60% 50%)',
    chart3: 'hsl(142 60% 40%)',
    chart4: 'hsl(280 65% 60%)',
    chart5: 'hsl(40 90% 55%)',
  },
  dark: {
    background: 'hsl(30 44% 4%)', // #0D0905
    foreground: 'hsl(0 0% 98%)',
    card: 'hsl(25 53% 7%)', // #1A1008
    cardForeground: 'hsl(0 0% 98%)',
    popover: 'hsl(24 37% 10%)', // #231810
    popoverForeground: 'hsl(0 0% 98%)',
    primary: 'hsl(20 81% 54%)', // #E8622A
    primaryForeground: 'hsl(0 0% 100%)',
    secondary: 'hsl(216 33% 16%)', // #1B2535 navy
    secondaryForeground: 'hsl(0 0% 98%)',
    muted: 'hsl(24 36% 13%)', // #2D2015
    mutedForeground: 'hsl(0 0% 60%)',
    accent: 'hsl(20 81% 54%)',
    accentForeground: 'hsl(0 0% 100%)',
    destructive: 'hsl(0 70.9% 59.4%)',
    border: 'hsl(24 36% 13%)',
    input: 'hsl(25 53% 7%)',
    ring: 'hsl(20 81% 54%)',
    radius: '0.75rem',
    chart1: 'hsl(20 81% 54%)',
    chart2: 'hsl(216 60% 55%)',
    chart3: 'hsl(142 55% 45%)',
    chart4: 'hsl(280 60% 65%)',
    chart5: 'hsl(40 90% 60%)',
  },
};

export const NAV_THEME: Record<'light' | 'dark', Theme> = {
  light: {
    ...DefaultTheme,
    colors: {
      background: THEME.light.background,
      border: THEME.light.border,
      card: THEME.light.card,
      notification: THEME.light.destructive,
      primary: THEME.light.primary,
      text: THEME.light.foreground,
    },
  },
  dark: {
    ...DarkTheme,
    colors: {
      background: THEME.dark.background,
      border: THEME.dark.border,
      card: THEME.dark.card,
      notification: THEME.dark.destructive,
      primary: THEME.dark.primary,
      text: THEME.dark.foreground,
    },
  },
};
