import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Typography } from './Typography';
import { useTheme } from '../../hooks/useTheme';
import { Radius, Spacing } from '../../constants/theme';

type BadgeVariant = 'brand' | 'warning' | 'success' | 'error' | 'neutral';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  style?: ViewStyle;
  dot?: boolean;
}

export function Badge({ label, variant = 'neutral', style, dot }: BadgeProps) {
  const { colors } = useTheme();

  const bgMap: Record<BadgeVariant, string> = {
    brand:   colors.brandSubtle,
    warning: colors.warningSubtle,
    success: colors.successSubtle,
    error:   colors.errorSubtle,
    neutral: colors.surfaceSecondary,
  };

  const textColorMap: Record<BadgeVariant, 'brand' | 'warning' | 'success' | 'error' | 'secondary'> = {
    brand:   'brand',
    warning: 'warning',
    success: 'success',
    error:   'error',
    neutral: 'secondary',
  };

  const dotColorMap: Record<BadgeVariant, string> = {
    brand:   colors.brandDefault,
    warning: colors.warningDefault,
    success: colors.successDefault,
    error:   colors.errorDefault,
    neutral: colors.textTertiary,
  };

  return (
    <View style={[styles.badge, { backgroundColor: bgMap[variant] }, style]}>
      {dot && (
        <View style={[styles.dot, { backgroundColor: dotColorMap[variant] }]} />
      )}
      <Typography variant="caption" color={textColorMap[variant]}>
        {label}
      </Typography>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing[2],
    paddingVertical: 3,
    borderRadius: Radius.full,
    gap: 4,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: Radius.full,
  },
});
