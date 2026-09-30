import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../src/hooks/useTheme';
import { Typography } from '../../src/components/ui/Typography';
import { Button } from '../../src/components/ui/Button';
import { Spacing, Radius, FontFamily } from '../../src/constants/theme';

const { height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const { colors, isDark } = useTheme();

  // Entrance animations
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoTranslate = useRef(new Animated.Value(30)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const ctaOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(logoOpacity, { toValue: 1, duration: 600, delay: 200, useNativeDriver: true }),
        Animated.timing(logoTranslate, { toValue: 0, duration: 600, delay: 200, useNativeDriver: true }),
      ]),
      Animated.timing(taglineOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(ctaOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleGoogleSignIn = () => {
    // Phase 2: Real Google OAuth via expo-auth-session
    // Phase 1: Navigate directly into the app
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bgPrimary }]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          bounces={false}
        >
          {/* Logo & Brand */}
          <Animated.View
            style={[
              styles.logoSection,
              { opacity: logoOpacity, transform: [{ translateY: logoTranslate }] },
            ]}
          >
            {/* App icon mark */}
            <View style={[styles.iconMark, { backgroundColor: colors.brandDefault }]}>
              <Typography
                variant="h2"
                style={{ color: '#fff', fontFamily: FontFamily.bold }}
              >
                C
              </Typography>
            </View>
            <Typography variant="h1" color="primary" style={styles.appName}>
              CampusOS
            </Typography>
          </Animated.View>

          {/* Tagline */}
          <Animated.View style={{ opacity: taglineOpacity, alignItems: 'center' }}>
            <Typography
              variant="body"
              color="secondary"
              style={styles.tagline}
            >
              Your entire college day,{'\n'}in one place.
            </Typography>

            {/* Feature pills */}
            <View style={styles.pillRow}>
              {['Timetable', 'Attendance', 'Tasks', 'AI Insights'].map((label) => (
                <View
                  key={label}
                  style={[styles.pill, { backgroundColor: colors.surfacePrimary, borderColor: colors.borderDefault }]}
                >
                  <Typography variant="caption" color="secondary">{label}</Typography>
                </View>
              ))}
            </View>
          </Animated.View>

          {/* CTA */}
          <Animated.View style={[styles.ctaSection, { opacity: ctaOpacity }]}>
            <Button
              label="Continue with Google"
              onPress={handleGoogleSignIn}
              variant="primary"
              icon={
                <Typography variant="body" style={{ lineHeight: 18 }}>🔑</Typography>
              }
              style={styles.googleBtn}
            />

            <Typography
              variant="caption"
              color="tertiary"
              style={styles.disclaimer}
            >
              By continuing, you agree to our Terms and Privacy Policy.
            </Typography>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing[6],
    paddingVertical: Spacing[8],
    gap: Spacing[8],
    minHeight: height,
  },
  logoSection: {
    alignItems: 'center',
    gap: Spacing[4],
  },
  iconMark: {
    width: 80,
    height: 80,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appName: {
    letterSpacing: -1,
  },
  tagline: {
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: Spacing[5],
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: Spacing[2],
  },
  pill: {
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[1],
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  ctaSection: {
    width: '100%',
    gap: Spacing[4],
    alignItems: 'center',
  },
  googleBtn: {
    width: '100%',
  },
  disclaimer: {
    textAlign: 'center',
  },
});
