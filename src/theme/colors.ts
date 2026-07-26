export const colors = {
  background: '#FBF7F1',
  surface: '#FFFFFF',
  blush: '#F3D9E1',

  accent: '#DD8FA6',
  accentText: '#8A4A63',

  textPrimary: '#3A322E',
  textMuted: '#9C8F87',
  textMutedAlt: '#8A8078',
  textDisabled: '#B4A8A2',

  border: '#F0E4E2',
  divider: '#F0E4E2',

  inputBorder: '#F0E4E2',
  disabledBg: '#F0E4E2',
  toggleOffBg: '#E4D9D5',

  chevron: '#C9BAB4',

  success: '#4A7C60',
  successBg: '#E1EFE7',
  warning: '#C06A45',
  warningBg: '#FBE3DA',
  error: '#C0654A',

  scanBackground: '#2B2622',
  scanFrame: '#F3D9E1',
  scanHint: '#F3E5EA',
} as const;

export type AppColors = typeof colors;
