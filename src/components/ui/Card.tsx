import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Radius, Shadow, Spacing } from '../../constants/theme';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Adds a subtle indigo left border accent */
  accent?: boolean;
  noPadding?: boolean;
}

export function Card({ children, style, accent, noPadding }: CardProps) {
  const { colors } = useTheme();
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surfacePrimary,
          borderColor: colors.borderDefault,
          borderLeftColor: accent ? colors.brandDefault : colors.borderDefault,
          borderLeftWidth: accent ? 3 : 1,
        },
        !noPadding && styles.padding,
        Shadow.sm,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    overflow: 'hidden',
  },
  padding: {
    padding: Spacing[4],
  },
});
