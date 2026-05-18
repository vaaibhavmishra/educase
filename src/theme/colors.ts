/**
 * Centralized color palette for the EduCase app.
 * Dark theme inspired by the Rick & Morty universe.
 */
export const Colors = {
  // Backgrounds
  background: '#0B0C10',
  surface: '#1A1B21',
  surfaceElevated: '#23242B',
  card: '#1E1F26',

  // Primary accent — Rick portal green
  primary: '#44D62C',
  primaryDark: '#2FA31E',
  primaryLight: '#6AE854',
  primaryMuted: 'rgba(68, 214, 44, 0.12)',

  // Secondary accent — Morty yellow
  secondary: '#F5C842',
  secondaryMuted: 'rgba(245, 200, 66, 0.12)',

  // Text
  textPrimary: '#F0F0F0',
  textSecondary: '#A0A3B1',
  textTertiary: '#6B6E7B',
  textInverse: '#0B0C10',

  // Status colors
  statusAlive: '#44D62C',
  statusDead: '#E74C3C',
  statusUnknown: '#7F8C8D',

  // Borders
  border: '#2A2B33',
  borderLight: '#3A3B44',

  // Feedback
  error: '#E74C3C',
  errorMuted: 'rgba(231, 76, 60, 0.12)',
  warning: '#F5C842',
  success: '#44D62C',

  // Utility
  shimmer: '#2A2B33',
  overlay: 'rgba(0, 0, 0, 0.6)',
  transparent: 'transparent',
  white: '#FFFFFF',
  black: '#000000',

  // Tab bar
  tabBarBackground: '#111218',
  tabBarBorder: '#1E1F26',
  tabBarActive: '#44D62C',
  tabBarInactive: '#6B6E7B',
} as const;

export type ColorKey = keyof typeof Colors;
