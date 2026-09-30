import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  ActivityIndicator,
  View,
} from 'react-native';
import { Typography } from './Typography';
import { useTheme } from '../../hooks/useTheme';
import { Radius, Spacing } from '../../constants/theme';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  icon?: React.ReactNode;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
  icon,
}: ButtonProps) {
  const { colors } = useTheme();

  const bgMap: Record<ButtonVariant, string> = {
    primary:   colors.brandDefault,
    secondary: colors.surfaceSecondary,
    ghost:     'transparent',
    danger:    colors.errorDefault,
  };

  const textColorMap: Record<ButtonVariant, 'brand' | 'secondary' | 'error' | 'primary'> = {
    primary:   'primary',   // textInverse handled via direct color
    secondary: 'secondary',
    ghost:     'brand',
    danger:    'primary',
  };

  const textColor = variant === 'primary' || variant === 'danger'
    ? colors.textInverse
    : variant === 'ghost'
    ? colors.brandDefault
    : colors.textSecondary;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.75}
      style={[
        styles.button,
        { backgroundColor: bgMap[variant] },
        (disabled || loading) && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <View style={styles.inner}>
          {icon}
          <Typography
            variant="label"
            style={{ color: textColor }}
          >
            {label}
          </Typography>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 50,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing[5],
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
  },
  disabled: {
    opacity: 0.5,
  },
});
