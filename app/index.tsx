import { Redirect } from 'expo-router';

// Redirect root to the auth screen.
// In Phase 2, this will check auth state and redirect accordingly.
export default function Index() {
  return <Redirect href="/(auth)" />;
}
