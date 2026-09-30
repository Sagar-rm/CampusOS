import { Link, Stack } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Typography } from '../src/components/ui/Typography';
import { useTheme } from '../src/hooks/useTheme';
import { Spacing } from '../src/constants/theme';

export default function NotFoundScreen() {
  const { colors } = useTheme();
  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bgPrimary }]}>
      <Stack.Screen options={{ title: 'Not Found' }} />
      <View style={styles.container}>
        <Typography variant="h2">🗺️</Typography>
        <Typography variant="h3" color="primary">Page not found</Typography>
        <Typography variant="body" color="secondary" style={styles.sub}>
          This route doesn&apos;t exist.
        </Typography>
        <Link href="/(tabs)" style={{ marginTop: Spacing[4] }}>
          <Typography variant="label" color="brand">Go to Home →</Typography>
        </Link>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 20,
  },
  sub: { textAlign: 'center' },
});
