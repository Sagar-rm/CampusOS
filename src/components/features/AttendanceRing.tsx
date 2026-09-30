import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Typography } from '../ui/Typography';
import { useTheme } from '../../hooks/useTheme';
import { SubjectAttendance, AttendanceStatus } from '../../types';
import { Spacing, Radius } from '../../constants/theme';

interface AttendanceRingProps {
  subject: SubjectAttendance;
  size?: number;
}

const STATUS_CONFIG: Record<AttendanceStatus, { color: string; label: string }> = {
  safe: { color: '', label: 'Good' },
  warning: { color: '', label: 'At Risk' },
  critical: { color: '', label: 'Critical' },
};

export function AttendanceRing({ subject, size = 64 }: AttendanceRingProps) {
  const { colors } = useTheme();
  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animValue, {
      toValue: subject.percentage / 100,
      duration: 600,
      useNativeDriver: false,
    }).start();
  }, [subject.percentage]);

  const statusColor =
    subject.status === 'safe'
      ? colors.successDefault
      : subject.status === 'warning'
      ? colors.warningDefault
      : colors.errorDefault;

  const statusBg =
    subject.status === 'safe'
      ? colors.successSubtle
      : subject.status === 'warning'
      ? colors.warningSubtle
      : colors.errorSubtle;

  return (
    <View style={styles.row}>
      {/* Ring (simplified as a colored circle since SVG needs library) */}
      <View
        style={[
          styles.ring,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderColor: statusColor,
            backgroundColor: statusBg,
          },
        ]}
      >
        <Typography
          variant="label"
          style={{ color: statusColor, fontSize: 13 }}
        >
          {subject.percentage}%
        </Typography>
      </View>

      {/* Info */}
      <View style={styles.info}>
        <Typography variant="label" color="primary" numberOfLines={1}>
          {subject.subjectName}
        </Typography>
        <Typography variant="caption" color="secondary">
          {subject.attended} / {subject.total} classes attended
        </Typography>
        {subject.status !== 'safe' && (
          <View style={[styles.statusPill, { backgroundColor: statusBg }]}>
            <Typography variant="caption" style={{ color: statusColor }}>
              {subject.status === 'warning' ? '⚠️ Needs attention' : '🔴 Below 75%'}
            </Typography>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[4],
  },
  ring: {
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  info: {
    flex: 1,
    gap: Spacing[1],
  },
  statusPill: {
    borderRadius: Radius.full,
    paddingHorizontal: Spacing[2],
    paddingVertical: 2,
    alignSelf: 'flex-start',
    marginTop: 2,
  },
});
