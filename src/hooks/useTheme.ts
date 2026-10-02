import { useColorScheme as useRNColorScheme } from 'react-native';
import { DarkColors, LightColors, ColorTokens } from '../constants/theme';
import { useThemeStore } from '../stores/themeStore';

export function useTheme(): { colors: ColorTokens; isDark: boolean } {
  const systemScheme = useRNColorScheme();
  const preference = useThemeStore((s) => s.preference);

  const effectiveScheme = preference === 'system' ? systemScheme : preference;
  const isDark = effectiveScheme === 'dark';
  return {
    colors: isDark ? DarkColors : LightColors,
    isDark,
  };
}
