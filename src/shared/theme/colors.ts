export const palette = {
  sage: '#2F5D50',
  sageMuted: '#4A7C6F',
  stone: '#F2F4F3',
  stoneDark: '#1A1F1E',
  ink: '#1C2421',
  inkMuted: '#5C6B66',
  border: '#D5DDD9',
  danger: '#9B3B3B',
  white: '#FFFFFF',
} as const;

export const colors = {
  light: {
    text: palette.ink,
    textMuted: palette.inkMuted,
    background: palette.stone,
    surface: palette.white,
    tint: palette.sage,
    tintMuted: palette.sageMuted,
    border: palette.border,
    tabIconDefault: '#9AA8A3',
    tabIconSelected: palette.sage,
    danger: palette.danger,
  },
  dark: {
    text: '#EEF2F0',
    textMuted: '#A8B5B0',
    background: palette.stoneDark,
    surface: '#242B29',
    tint: '#7FB5A5',
    tintMuted: '#5C9486',
    border: '#3A4541',
    tabIconDefault: '#6B7A75',
    tabIconSelected: '#7FB5A5',
    danger: '#E08A8A',
  },
} as const;

export type ColorSchemeName = keyof typeof colors;
export type ThemeColors = (typeof colors)[ColorSchemeName];
