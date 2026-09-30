import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../src/hooks/useTheme';
import { Typography } from '../../src/components/ui/Typography';
import { ClassCard } from '../../src/components/features/ClassCard';
import { LoadingState, EmptyState, ErrorState } from '../../src/components/ui/StateViews';
import { timetableService } from '../../src/services/timetable.service';
import { ClassSlot, TodayClass, DayOfWeek } from '../../src/types';
import { Spacing, Radius } from '../../src/constants/theme';

const DAYS: DayOfWeek[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAY_FULL: Record<DayOfWeek, string> = {
  Mon: 'Monday', Tue: 'Tuesday', Wed: 'Wednesday',
  Thu: 'Thursday', Fri: 'Friday', Sat: 'Saturday',
};

export default function TimetableScreen() {
  const { colors } = useTheme();
  const todayDay = timetableService.getTodayDay();
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>(todayDay ?? 'Mon');
  const [classes, setClasses] = useState<ClassSlot[]>([]);
  const [status, setStatus] = useState<'loading' | 'error' | 'success'>('loading');
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await timetableService.getForDay(selectedDay);
      setClasses(data);
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }, [selectedDay]);

  useEffect(() => { setStatus('loading'); load(); }, [load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  // Convert to TodayClass for the card (mark status if today)
  const toDisplaySlot = (slot: ClassSlot): TodayClass => {
    if (selectedDay !== todayDay) return { ...slot, status: 'upcoming' };

    const now = new Date();
    const nowMin = now.getHours() * 60 + now.getMinutes();
    const [sh, sm] = slot.startTime.split(':').map(Number);
    const [eh, em] = slot.endTime.split(':').map(Number);
    const startMin = sh * 60 + sm;
    const endMin = eh * 60 + em;

    if (nowMin >= startMin && nowMin < endMin) {
      return { ...slot, status: 'ongoing', minutesUntilEnd: endMin - nowMin };
    }
    if (nowMin >= endMin) return { ...slot, status: 'completed' };
    return { ...slot, status: 'upcoming', minutesUntilStart: startMin - nowMin };
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bgPrimary }]} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Typography variant="h3" color="primary">Schedule</Typography>
      </View>

      {/* Day Selector */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.daySelector}
        style={[styles.daySelectorWrap, { borderBottomColor: colors.borderDefault }]}
      >
        {DAYS.map((day) => {
          const isSelected = day === selectedDay;
          const isToday = day === todayDay;
          return (
            <TouchableOpacity
              key={day}
              onPress={() => setSelectedDay(day)}
              style={[
                styles.dayChip,
                isSelected && { backgroundColor: colors.brandDefault },
                !isSelected && { backgroundColor: colors.surfacePrimary, borderColor: colors.borderDefault, borderWidth: 1 },
              ]}
              hitSlop={{ top: 8, bottom: 8 }}
            >
              <Typography
                variant="label"
                style={{ color: isSelected ? '#fff' : colors.textSecondary }}
              >
                {day}
              </Typography>
              {isToday && (
                <View style={[styles.todayDot, { backgroundColor: isSelected ? '#fff' : colors.brandDefault }]} />
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Day Title */}
      <View style={styles.dayTitle}>
        <Typography variant="body" color="secondary">
          {DAY_FULL[selectedDay]}
          {selectedDay === todayDay ? ' · Today' : ''}
        </Typography>
      </View>

      {/* Classes */}
      {status === 'loading' && !classes.length ? (
        <LoadingState message="Loading schedule..." />
      ) : status === 'error' ? (
        <ErrorState
          title="Couldn't load schedule"
          message="Pull down to try again."
          onRetry={load}
        />
      ) : (
        <ScrollView
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.brandDefault} />
          }
        >
          {classes.length === 0 ? (
            <EmptyState
              emoji="🎉"
              title="No classes today"
              subtitle="Nothing scheduled for this day."
            />
          ) : (
            classes.map((cls) => (
              <ClassCard key={cls.id} slot={toDisplaySlot(cls)} variant="full" />
            ))
          )}
          <View style={{ height: Spacing[8] }} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    paddingHorizontal: Spacing[4],
    paddingTop: Spacing[4],
    paddingBottom: Spacing[3],
  },
  daySelectorWrap: {
    borderBottomWidth: 1,
  },
  daySelector: {
    paddingHorizontal: Spacing[4],
    paddingBottom: Spacing[3],
    gap: Spacing[2],
  },
  dayChip: {
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[2],
    borderRadius: Radius.full,
    alignItems: 'center',
    position: 'relative',
  },
  todayDot: {
    position: 'absolute',
    bottom: 3,
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  dayTitle: {
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[2],
  },
  list: {
    paddingHorizontal: Spacing[4],
    paddingTop: Spacing[2],
    gap: Spacing[3],
  },
});
