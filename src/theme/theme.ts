import { colors } from './colors';
import { fonts, fontSize } from './typography';

export const theme = {
  colors,
  fonts,
  fontSize,
  radius: {
    sm: 10,
    md: 14,
    lg: 18,
    xl: 22,
    pill: 999,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
    '3xl': 32,
  },
} as const;

export type AppTheme = typeof theme;
