import { useColorScheme as useRNColorScheme } from 'react-native';
import { DarkColors, LightColors, ColorTokens } from '../constants/theme';

export function useTheme(): { colors: ColorTokens; isDark: boolean } {
  const scheme = useRNColorScheme();
  const isDark = scheme === 'dark';
  return {
    colors: isDark ? DarkColors : LightColors,
    isDark,
  };
}
