import React from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';
import { FontFamily, FontSize } from '../../constants/theme';
import { useTheme } from '../../hooks/useTheme';

type Variant = 'h1' | 'h2' | 'h3' | 'title' | 'body' | 'bodySmall' | 'caption' | 'label';
type Color = 'primary' | 'secondary' | 'tertiary' | 'brand' | 'warning' | 'success' | 'error';

interface TypographyProps {
  children: React.ReactNode;
  variant?: Variant;
  color?: Color;
  style?: TextStyle;
  numberOfLines?: number;
  onPress?: () => void;
}

const variantStyles: Record<Variant, TextStyle> = {
  h1:        { fontSize: FontSize['3xl'], fontFamily: FontFamily.bold,     lineHeight: FontSize['3xl'] * 1.2 },
  h2:        { fontSize: FontSize['2xl'], fontFamily: FontFamily.bold,     lineHeight: FontSize['2xl'] * 1.2 },
  h3:        { fontSize: FontSize.xl,    fontFamily: FontFamily.semiBold,  lineHeight: FontSize.xl * 1.3 },
  title:     { fontSize: FontSize.md,    fontFamily: FontFamily.semiBold,  lineHeight: FontSize.md * 1.4 },
  body:      { fontSize: FontSize.base,  fontFamily: FontFamily.regular,   lineHeight: FontSize.base * 1.5 },
  bodySmall: { fontSize: FontSize.sm,    fontFamily: FontFamily.regular,   lineHeight: FontSize.sm * 1.5 },
  caption:   { fontSize: FontSize.xs,    fontFamily: FontFamily.medium,    lineHeight: FontSize.xs * 1.4 },
  label:     { fontSize: FontSize.sm,    fontFamily: FontFamily.medium,    lineHeight: FontSize.sm * 1.4 },
};

export function Typography({
  children,
  variant = 'body',
  color = 'primary',
  style,
  numberOfLines,
  onPress,
}: TypographyProps) {
  const { colors } = useTheme();

  const colorMap: Record<Color, string> = {
    primary:   colors.textPrimary,
    secondary: colors.textSecondary,
    tertiary:  colors.textTertiary,
    brand:     colors.brandDefault,
    warning:   colors.warningDefault,
    success:   colors.successDefault,
    error:     colors.errorDefault,
  };

  return (
    <Text
      style={[variantStyles[variant], { color: colorMap[color] }, style]}
      numberOfLines={numberOfLines}
      onPress={onPress}
    >
      {children}
    </Text>
  );
}
