export const fonts = {
  heading: 'Manrope_700Bold',
  headingSemibold: 'Manrope_600SemiBold',
  headingMedium: 'Manrope_500Medium',
  body: 'DMSans_400Regular',
  bodyMedium: 'DMSans_500Medium',
  bodySemibold: 'DMSans_700Bold',
} as const;

export const fontSize = {
  xs: 11,
  sm: 12.5,
  base: 14,
  md: 14.5,
  lg: 15.5,
  xl: 17,
  '2xl': 18,
  '3xl': 21,
  '4xl': 23,
  '5xl': 26,
  '6xl': 30,
} as const;

export type AppFonts = typeof fonts;
export type AppFontSizes = typeof fontSize;
