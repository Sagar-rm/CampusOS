import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useColorScheme } from 'react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { Typography } from '../../src/components/ui/Typography';
import { Card } from '../../src/components/ui/Card';
import { LoadingState, ErrorState } from '../../src/components/ui/StateViews';
import { studentService } from '../../src/services/student.service';
import { attendanceService } from '../../src/services/attendance.service';
import { Student } from '../../src/types';
import { Spacing, Radius } from '../../src/constants/theme';

interface ProfileData {
  student: Student;
  overallAttendance: number;
  cgpa: number;
}

export default function ProfileScreen() {
  const { colors, isDark } = useTheme();
  const scheme = useColorScheme();
  const [data, setData] = useState<ProfileData | null>(null);
  const [status, setStatus] = useState<'loading' | 'error' | 'success'>('loading');

  const load = useCallback(async () => {
    try {
      const [student, attendance] = await Promise.all([
        studentService.getStudent(),
        attendanceService.getSummary(),
      ]);
      setData({ student, overallAttendance: attendance.overall, cgpa: student.cgpa || 8.5 });
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSignOut = () => {
    Alert.alert(
      'Sign out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign out',
          style: 'destructive',
          onPress: () => router.replace('/(auth)'),
        },
      ]
    );
  };

  if (status === 'loading') {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.bgPrimary }]}>
        <LoadingState />
      </SafeAreaView>
    );
  }

  if (status === 'error' || !data) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.bgPrimary }]}>
        <ErrorState onRetry={load} />
      </SafeAreaView>
    );
  }

  const { student, overallAttendance } = data;
  const attStatus =
    overallAttendance >= 80 ? 'safe' :
    overallAttendance >= 75 ? 'warning' : 'critical';
  const attColor =
    attStatus === 'safe' ? colors.successDefault :
    attStatus === 'warning' ? colors.warningDefault : colors.errorDefault;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bgPrimary }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Typography variant="h3" color="primary">Profile</Typography>
        </View>

        {/* Avatar + Name */}
        <View style={styles.avatarSection}>
          <View style={[styles.avatar, { backgroundColor: colors.brandSubtle }]}>
            <Typography variant="h2" style={{ color: colors.brandDefault }}>
              {student.firstName.charAt(0)}
            </Typography>
          </View>
          <Typography variant="h3" color="primary">{student.name}</Typography>
          <Typography variant="body" color="secondary">{student.email}</Typography>
        </View>

        {/* College Info */}
        <SectionLabel label="COLLEGE" />
        <Card style={styles.infoCard}>
          <InfoRow label="College" value={student.college} />
          <Divider colors={colors} />
          <InfoRow label="Branch" value={student.branch} />
          <Divider colors={colors} />
          <InfoRow label="Semester" value={`${student.semester}th Semester`} />
          <Divider colors={colors} />
          <InfoRow label="Roll No." value={student.rollNumber} />
        </Card>

        {/* Academics */}
        <SectionLabel label="ACADEMICS" />
        <Card style={styles.infoCard}>
          <View style={styles.academicRow}>
            <View style={styles.academicItem}>
              <Typography variant="h3" style={{ color: attColor }}>
                {overallAttendance}%
              </Typography>
              <Typography variant="caption" color="secondary">Attendance</Typography>
            </View>
            <View style={styles.academicItem}>
              <Typography variant="h3" color="primary">
                {data.cgpa}
              </Typography>
              <Typography variant="caption" color="secondary">CGPA</Typography>
            </View>
          </View>
        </Card>

        {/* Settings */}
        <SectionLabel label="SETTINGS" />
        <Card style={styles.infoCard}>
          <View style={styles.settingRow}>
            <Typography variant="body" color="primary">Appearance</Typography>
            <Typography variant="caption" color="secondary">
              {scheme === 'dark' ? 'Dark mode' : 'Light mode'} (system)
            </Typography>
          </View>
        </Card>

        {/* Sign Out */}
        <TouchableOpacity
          onPress={handleSignOut}
          style={[styles.signOutBtn, { borderColor: colors.errorSubtle }]}
          activeOpacity={0.75}
        >
          <Typography variant="label" color="error">Sign out</Typography>
        </TouchableOpacity>

        {/* Footer */}
        <Typography variant="caption" color="tertiary" style={styles.footer}>
          CampusOS v1.0 · Phase 1
        </Typography>

        <View style={{ height: Spacing[8] }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function SectionLabel({ label }: { label: string }) {
  return (
    <Typography
      variant="caption"
      color="tertiary"
      style={styles.sectionLabel}
    >
      {label}
    </Typography>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Typography variant="caption" color="secondary">{label}</Typography>
      <Typography variant="label" color="primary" style={{ flex: 1, textAlign: 'right' }} numberOfLines={1}>
        {value}
      </Typography>
    </View>
  );
}

function Divider({ colors }: { colors: any }) {
  return <View style={[styles.divider, { backgroundColor: colors.borderDefault }]} />;
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: {
    paddingHorizontal: Spacing[4],
  },
  header: {
    paddingTop: Spacing[4],
    paddingBottom: Spacing[2],
  },
  avatarSection: {
    alignItems: 'center',
    gap: Spacing[2],
    paddingVertical: Spacing[6],
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing[2],
  },
  sectionLabel: {
    letterSpacing: 0.8,
    marginBottom: Spacing[2],
    marginTop: Spacing[4],
  },
  infoCard: {
    padding: 0,
    overflow: 'hidden',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
    gap: Spacing[3],
  },
  divider: {
    height: 1,
    marginHorizontal: Spacing[4],
  },
  academicRow: {
    flexDirection: 'row',
    padding: Spacing[4],
    gap: Spacing[6],
  },
  academicItem: {
    alignItems: 'center',
    gap: Spacing[1],
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
  },
  signOutBtn: {
    marginTop: Spacing[6],
    borderWidth: 1,
    borderRadius: Radius.lg,
    padding: Spacing[4],
    alignItems: 'center',
  },
  footer: {
    textAlign: 'center',
    marginTop: Spacing[6],
  },
});
