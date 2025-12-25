import { StyleSheet } from 'react-native';

export const palette = {
  light: {
    background: '#ffffff',
    foreground: '#1c1c1c',
    card: '#ffffff',
    cardForeground: '#1c1c1c',
    popover: '#ffffff',
    popoverForeground: '#1c1c1c',
    primary: '#030213',
    primaryForeground: '#ffffff',
    secondary: '#f1f1f5',
    secondaryForeground: '#030213',
    muted: '#ececf0',
    mutedForeground: '#717182',
    accent: '#e9ebef',
    accentForeground: '#030213',
    destructive: '#d4183d',
    destructiveForeground: '#ffffff',
    border: 'rgba(0, 0, 0, 0.1)',
    inputBackground: '#f3f3f5',
    switchBackground: '#cbced4',
    ring: '#b3b3b3',
  },
  dark: {
    background: '#1c1c1c',
    foreground: '#fbfbfb',
    card: '#1c1c1c',
    cardForeground: '#fbfbfb',
    popover: '#1c1c1c',
    popoverForeground: '#fbfbfb',
    primary: '#fbfbfb',
    primaryForeground: '#343434',
    secondary: '#454545',
    secondaryForeground: '#fbfbfb',
    muted: '#454545',
    mutedForeground: '#b3b3b3',
    accent: '#454545',
    accentForeground: '#fbfbfb',
    destructive: '#7f2321',
    destructiveForeground: '#f08d8b',
    border: '#454545',
    inputBackground: '#454545',
    switchBackground: '#454545', // Shared with input in your dark CSS
    ring: '#707070',
  }
};

export const typography = {
  size: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
  },
  weight: {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  }
};

export const radius = {
  sm: 6,
  md: 8,
  lg: 10, // var(--radius) 0.625rem
  xl: 14,
};