import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Typography } from './Typography';
import { useTheme } from '../../hooks/useTheme';
import { Spacing } from '../../constants/theme';

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = 'Loading...' }: LoadingStateProps) {
  const { colors } = useTheme();
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.brandDefault} />
      <Typography variant="bodySmall" color="secondary" style={styles.text}>
        {message}
      </Typography>
    </View>
  );
}

interface EmptyStateProps {
  emoji?: string;
  title: string;
  subtitle?: string;
}

export function EmptyState({ emoji = '📭', title, subtitle }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Typography variant="h2" style={styles.emoji}>{emoji}</Typography>
      <Typography variant="title" color="primary" style={styles.title}>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="bodySmall" color="secondary" style={styles.subtitle}>
          {subtitle}
        </Typography>
      )}
    </View>
  );
}

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = 'Something went wrong',
  message = 'We couldn\'t load your data. Please try again.',
  onRetry,
}: ErrorStateProps) {
  const { colors } = useTheme();
  return (
    <View style={styles.container}>
      <Typography variant="h2" style={styles.emoji}>⚠️</Typography>
      <Typography variant="title" color="primary" style={styles.title}>
        {title}
      </Typography>
      <Typography variant="bodySmall" color="secondary" style={styles.subtitle}>
        {message}
      </Typography>
      {onRetry && (
        <Typography
          vant="label"
          color="brand"
          style={{ marginTop: Spacing[4] }}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onPress={onRetry as any}
        >
          Try again
        </Typography>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing[6],
    gap: Spacing[2],
  },
  emoji: {
    marginBottom: Spacing[2],
  },
  title: {
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    maxWidth: 260,
  },
  text: {
    marginTop: Spacing[3],
  },
});
