import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Typography } from '../ui/Typography';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { useTheme } from '../../hooks/useTheme';
import { Spacing, Radius } from '../../constants/theme';
import { TodayClass } from '../../types';

interface ClassCardProps {
  slot: TodayClass;
  onPress?: () => void;
  variant?: 'compact' | 'full';
}

function formatTime(time: string): string {
  const [h, m] = time.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, '0')} ${ampm}`;
}

function useCountdown(minutesUntil?: number) {
  const [mins, setMins] = useState(minutesUntil ?? 0);
  useEffect(() => {
    if (minutesUntil === undefined) return;
    setMins(minutesUntil);
    const interval = setInterval(() => setMins((p) => Math.max(0, p - 1)), 60000);
    return () => clearInterval(interval);
  }, [minutesUntil]);
  return mins;
}

export function ClassCard({ slot, onPress, variant = 'full' }: ClassCardProps) {
  const { colors } = useTheme();
  const countdown = useCountdown(slot.minutesUntilStart ?? slot.minutesUntilEnd);

  const typeLabel = slot.type === 'lab' ? 'Lab' : slot.type === 'tutorial' ? 'Tutorial' : 'Lecture';

  const statusConfig = {
    ongoing: { badge: 'success' as const, label: 'In Progress', dotPulse: true },
    upcoming: { badge: 'neutral' as const, label: 'Upcoming', dotPulse: false },
    completed: { badge: 'neutral' as const, label: 'Done', dotPulse: false },
  };

  const cfg = statusConfig[slot.status];

  if (variant === 'compact') {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        <Card
          style={[
            styles.compact,
            slot.status === 'ongoing' && { borderColor: colors.successDefault, borderWidth: 1.5 },
            slot.status === 'completed' && { opacity: 0.5 },
          ]}
        >
          <View style={styles.compactTimeCol}>
            <Typography variant="caption" color="secondary">{formatTime(slot.startTime)}</Typography>
          </View>
          <View style={styles.compactContent}>
            <Typography variant="label" color="primary" numberOfLines={1}>
              {slot.subjectCode}
            </Typography>
            <Typography variant="caption" color="tertiary">{slot.room}</Typography>
          </View>
          {slot.status === 'ongoing' && (
            <View style={[styles.liveDot, { backgroundColor: colors.successDefault }]} />
          )}
        </Card>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
      <Card
        style={[
          styles.full,
          slot.status === 'ongoing' && {
            borderColor: colors.successDefault,
            borderWidth: 1.5,
            backgroundColor: colors.successSubtle,
          },
          slot.status === 'completed' && { opacity: 0.55 },
        ]}
      >
        {/* Header row */}
        <View style={styles.header}>
          <View style={styles.subjectRow}>
            <Typography variant="title" color="primary" numberOfLines={1} style={{ flex: 1 }}>
              {slot.subjectName}
            </Typography>
          </View>
          <Badge
            label={slot.status === 'ongoing' ? 'Live' : cfg.label}
            variant={cfg.badge}
            dot={slot.status === 'ongoing'}
          />
        </View>

        {/* Meta row */}
        <View style={styles.metaRow}>
          <MetaChip icon="🕐" label={`${formatTime(slot.startTime)} – ${formatTime(slot.endTime)}`} />
          <MetaChip icon="📍" label={slot.room} />
          <MetaChip icon="🏷️" label={typeLabel} />
        </View>

        <Typography variant="caption" color="secondary">{slot.faculty}</Typography>

        {/* Countdown */}
        {slot.status === 'upcoming' && slot.minutesUntilStart !== undefined && (
          <View style={[styles.countdown, { backgroundColor: colors.brandSubtle }]}>
            <Typography variant="caption" color="brand">
              Starts in {countdown} min
            </Typography>
          </View>
        )}
        {slot.status === 'ongoing' && slot.minutesUntilEnd !== undefined && (
          <View style={[styles.countdown, { backgroundColor: colors.successSubtle }]}>
            <Typography variant="caption" color="success">
              Ends in {countdown} min
            </Typography>
          </View>
        )}
      </Card>
    </TouchableOpacity>
  );
}

function MetaChip({ icon, label }: { icon: string; label: string }) {
  return (
    <View style={styles.metaChip}>
      <Typography variant="caption">{icon} {label}</Typography>
    </View>
  );
}

const styles = StyleSheet.create({
  full: {
    gap: Spacing[2],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Spacing[2],
  },
  subjectRow: {
    flex: 1,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing[2],
  },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  countdown: {
    marginTop: Spacing[1],
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[1],
    borderRadius: Radius.full,
    alignSelf: 'flex-start',
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: Radius.full,
    alignSelf: 'center',
  },
  compact: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[3],
    width: 140,
  },
  compactTimeCol: {
    minWidth: 52,
  },
  compactContent: {
    flex: 1,
  },
});
