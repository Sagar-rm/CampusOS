/**
 * Design tokens — single source of truth for all visual decisions.
 * Components must only reference these tokens, never raw values.
 */

// ─── Typography ───────────────────────────────────────────────────────────────

export const FontFamily = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semiBold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
} as const;

export const FontSize = {
  xs: 11,
  sm: 13,
  base: 15,
  md: 17,
  lg: 20,
  xl: 24,
  '2xl': 28,
  '3xl': 34,
} as const;

export const LineHeight = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.7,
} as const;

// ─── Spacing ──────────────────────────────────────────────────────────────────

export const Spacing = {
  '0': 0,
  '1': 4,
  '2': 8,
  '3': 12,
  '4': 16,
  '5': 20,
  '6': 24,
  '8': 32,
  '10': 40,
  '12': 48,
  '16': 64,
} as const;

// ─── Border Radius ────────────────────────────────────────────────────────────

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  full: 999,
} as const;

// ─── Shadows ──────────────────────────────────────────────────────────────────

export const Shadow = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
} as const;

// ─── Color Palette ────────────────────────────────────────────────────────────
// Raw palette — use semantic tokens in components

const Palette = {
  // Indigo / Violet — primary (use sparingly)
  indigo50: '#EEF2FF',
  indigo100: '#E0E7FF',
  indigo200: '#C7D2FE',
  indigo500: '#6366F1',
  indigo600: '#4F46E5',
  indigo700: '#4338CA',

  // Amber — warnings
  amber50: '#FFFBEB',
  amber100: '#FEF3C7',
  amber400: '#FBBF24',
  amber500: '#F59E0B',
  amber600: '#D97706',

  // Green — success / safe attendance
  green50: '#F0FDF4',
  green100: '#DCFCE7',
  green500: '#22C55E',
  green600: '#16A34A',
  green700: '#15803D',

  // Red — errors / critical
  red50: '#FEF2F2',
  red100: '#FEE2E2',
  red500: '#EF4444',
  red600: '#DC2626',
  red700: '#B91C1C',

  // Neutrals — dark mode
  neutral950: '#0A0A0B',
  neutral900: '#111113',
  neutral850: '#18181B',
  neutral800: '#1E1E23',
  neutral750: '#26262D',
  neutral700: '#2E2E38',
  neutral600: '#3F3F4D',
  neutral500: '#71717A',
  neutral400: '#A1A1AA',
  neutral300: '#D4D4D8',
  neutral200: '#E4E4E7',
  neutral100: '#F4F4F5',
  neutral50: '#FAFAFA',
  white: '#FFFFFF',
} as const;

// ─── Semantic Color Tokens ────────────────────────────────────────────────────

export interface ColorTokens {
  // Backgrounds
  bgPrimary: string;
  bgSecondary: string;
  bgTertiary: string;

  // Surfaces (cards, sheets)
  surfacePrimary: string;
  surfaceSecondary: string;
  surfaceElevated: string;

  // Borders
  borderDefault: string;
  borderStrong: string;

  // Text
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  textInverse: string;

  // Brand — use sparingly
  brandDefault: string;
  brandSubtle: string;
  brandText: string;

  // Status
  warningDefault: string;
  warningSubtle: string;
  warningText: string;

  successDefault: string;
  successSubtle: string;
  successText: string;

  errorDefault: string;
  errorSubtle: string;
  errorText: string;

  // Tab bar
  tabBarBg: string;
  tabBarBorder: string;
  tabIconActive: string;
  tabIconInactive: string;
}

export const DarkColors: ColorTokens = {
  bgPrimary: Palette.neutral950,
  bgSecondary: Palette.neutral900,
  bgTertiary: Palette.neutral850,

  surfacePrimary: Palette.neutral850,
  surfaceSecondary: Palette.neutral800,
  surfaceElevated: Palette.neutral750,

  borderDefault: Palette.neutral750,
  borderStrong: Palette.neutral600,

  textPrimary: Palette.white,
  textSecondary: Palette.neutral400,
  textTertiary: Palette.neutral500,
  textInverse: Palette.neutral950,

  brandDefault: Palette.indigo500,
  brandSubtle: 'rgba(99,102,241,0.12)',
  brandText: Palette.indigo200,

  warningDefault: Palette.amber500,
  warningSubtle: 'rgba(245,158,11,0.12)',
  warningText: Palette.amber400,

  successDefault: Palette.green500,
  successSubtle: 'rgba(34,197,94,0.12)',
  successText: Palette.green500,

  errorDefault: Palette.red500,
  errorSubtle: 'rgba(239,68,68,0.12)',
  errorText: Palette.red500,

  tabBarBg: Palette.neutral900,
  tabBarBorder: Palette.neutral800,
  tabIconActive: Palette.indigo500,
  tabIconInactive: Palette.neutral500,
};

export const LightColors: ColorTokens = {
  bgPrimary: Palette.neutral50,
  bgSecondary: Palette.white,
  bgTertiary: Palette.neutral100,

  surfacePrimary: Palette.white,
  surfaceSecondary: Palette.neutral50,
  surfaceElevated: Palette.white,

  borderDefault: Palette.neutral200,
  borderStrong: Palette.neutral300,

  textPrimary: Palette.neutral950,
  textSecondary: Palette.neutral500,
  textTertiary: Palette.neutral400,
  textInverse: Palette.white,

  brandDefault: Palette.indigo600,
  brandSubtle: Palette.indigo50,
  brandText: Palette.indigo600,

  warningDefault: Palette.amber500,
  warningSubtle: Palette.amber50,
  warningText: Palette.amber600,

  successDefault: Palette.green600,
  successSubtle: Palette.green50,
  successText: Palette.green700,

  errorDefault: Palette.red500,
  errorSubtle: Palette.red50,
  errorText: Palette.red600,

  tabBarBg: Palette.white,
  tabBarBorder: Palette.neutral200,
  tabIconActive: Palette.indigo600,
  tabIconInactive: Palette.neutral400,
};
