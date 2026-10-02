import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../src/hooks/useTheme';
import { Typography } from '../../src/components/ui/Typography';
import { Card } from '../../src/components/ui/Card';
import { ClassCard } from '../../src/components/features/ClassCard';
import { TaskItem } from '../../src/components/features/TaskItem';
import { LoadingState, EmptyState, ErrorState } from '../../src/components/ui/StateViews';
import { timetableService } from '../../src/services/timetable.service';
import { attendanceService } from '../../src/services/attendance.service';
import { tasksService } from '../../src/services/tasks.service';
import { studentService } from '../../src/services/student.service';
import { useTaskStore } from '../../src/stores/taskStore';
import { TodayClass, Task, AIInsight } from '../../src/types';
import { Spacing, Radius } from '../../src/constants/theme';
import { mockInsights } from '../../src/data/mock';

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function formatDate(): string {
  return new Date().toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long',
  });
}

interface HomeData {
  studentName: string;
  todayClasses: TodayClass[];
  overallAttendance: number;
  atRiskCount: number;
  insight: AIInsight;
}

export default function HomeScreen() {
  const { colors } = useTheme();
  const [data, setData] = useState<HomeData | null>(null);
  const [status, setStatus] = useState<'loading' | 'error' | 'success'>('loading');
  const [refreshing, setRefreshing] = useState(false);

  const tasksStoreTasks = useTaskStore((s) => s.tasks);
  const fetchTasks = useTaskStore((s) => s.fetchTasks);
  const tasksStatus = useTaskStore((s) => s.status);

  const load = useCallback(async () => {
    try {
      const [student, classes, attendance] = await Promise.all([
        studentService.getStudent(),
        timetableService.getTodayClasses(),
        attendanceService.getSummary(),
      ]);
      
      if (tasksStatus === 'idle') {
        fetchTasks();
      }

      setData({
        studentName: student.firstName,
        todayClasses: classes,
        overallAttendance: attendance.overall,
        atRiskCount: attendance.atRiskCount,
        insight: mockInsights[Math.floor(Math.random() * mockInsights.length)],
      });
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }, [fetchTasks, tasksStatus]);

  useEffect(() => { load(); }, [load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([load(), fetchTasks()]);
    setRefreshing(false);
  }, [load, fetchTasks]);

  const completeTask = useTaskStore((s) => s.completeTask);

  const handleCompleteTask = useCallback(async (id: string) => {
    await completeTask(id);
    try { await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); } catch {}
  }, [completeTask]);

  if (status === 'loading' && !data) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.bgPrimary }]}>
        <LoadingState message="Loading your day..." />
      </SafeAreaView>
    );
  }

  if (status === 'error' && !data) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.bgPrimary }]}>
        <ErrorState
          title="Couldn't load your day"
          message="Something went wrong. Pull down to try again."
          onRetry={load}
        />
      </SafeAreaView>
    );
  }

  const now = data!;
  const currentClass = now.todayClasses.find((c) => c.status === 'ongoing');
  const nextClass = now.todayClasses.find((c) => c.status === 'upcoming');
  const displayClass = currentClass ?? nextClass ?? null;

  const todayStr = new Date().toISOString().split('T')[0];
  const urgentTasks = tasksStoreTasks
    .filter((t) => !t.completed && t.dueDate <= todayStr)
    .slice(0, 3);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bgPrimary }]} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.brandDefault}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Typography variant="body" color="secondary">
              {formatDate()}
            </Typography>
            <Typography variant="h2" color="primary">
              {getGreeting()}, {now.studentName} 👋
            </Typography>
          </View>
        </View>

        {/* Current / Next Class */}
        <Section title={currentClass ? 'Now' : nextClass ? 'Up Next' : 'Today'}>
          {displayClass ? (
            <ClassCard slot={displayClass} variant="full" />
          ) : now.todayClasses.length > 0 ? (
            <Card>
              <Typography variant="body" color="secondary">
                All classes for today are done. 🎉
              </Typography>
            </Card>
          ) : (
            <Card>
              <EmptyState emoji="🎉" title="No classes today" subtitle="Enjoy your day off." />
            </Card>
          )}
        </Section>

        {/* Today's Schedule Strip */}
        {now.todayClasses.length > 0 && (
          <Section title="Today's Schedule">
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.strip}
            >
              {now.todayClasses.map((cls) => (
                <ClassCard key={cls.id} slot={cls} variant="compact" />
              ))}
            </ScrollView>
          </Section>
        )}

        {/* Attendance Warning */}
        {now.atRiskCount > 0 && (
          <TouchableOpacity onPress={() => router.push('/(tabs)/attendance')} activeOpacity={0.85}>
            <Card style={[styles.warningCard, { backgroundColor: colors.warningSubtle, borderColor: colors.warningDefault }]}>
              <View style={styles.warningRow}>
                <Typography variant="label" color="warning">
                  ⚠️ {now.atRiskCount} subject{now.atRiskCount > 1 ? 's' : ''} below 75%
                </Typography>
                <Typography variant="caption" color="secondary">View plan →</Typography>
              </View>
              <Typography variant="caption" color="secondary">
                Overall attendance: {now.overallAttendance}%
              </Typography>
            </Card>
          </TouchableOpacity>
        )}

        {/* Today's Tasks */}
        <Section
          title="Today's Tasks"
          action={{ label: 'View all', onPress: () => router.push('/(tabs)/tasks') }}
        >
          {urgentTasks.length === 0 ? (
            <Card>
              <EmptyState emoji="🎉" title="No tasks for today" subtitle="You're all caught up." />
            </Card>
          ) : (
            urgentTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onComplete={handleCompleteTask}
              />
            ))
          )}
        </Section>

        {/* AI Insight */}
        <Section title="Insight">
          <Card accent>
            <View style={styles.insightRow}>
              <Typography variant="caption" color="brand">✦ AI</Typography>
            </View>
            <Typography variant="body" color="primary" style={styles.insightText}>
              {now.insight.text}
            </Typography>
          </Card>
        </Section>

        <View style={styles.bottomPad} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Section helper ───────────────────────────────────────────────────────────

function Section({
  title,
  children,
  action,
}: {
  title: string;
  children: React.ReactNode;
  action?: { label: string; onPress: () => void };
}) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Typography variant="label" color="tertiary" style={styles.sectionTitle}>
          {title.toUpperCase()}
        </Typography>
        {action && (
          <TouchableOpacity onPress={action.onPress} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Typography variant="caption" color="brand">{action.label}</Typography>
          </TouchableOpacity>
        )}
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: Spacing[4],
    paddingTop: Spacing[4],
    gap: Spacing[1],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing[4],
  },
  section: {
    gap: Spacing[2],
    marginBottom: Spacing[4],
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing[1],
  },
  sectionTitle: {
    letterSpacing: 0.8,
  },
  strip: {
    gap: Spacing[2],
    paddingRight: Spacing[4],
  },
  warningCard: {
    borderWidth: 1,
    padding: Spacing[3],
    gap: Spacing[1],
    marginBottom: Spacing[4],
    borderRadius: Radius.lg,
  },
  warningRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  insightRow: {
    marginBottom: Spacing[2],
  },
  insightText: {
    lineHeight: 22,
  },
  bottomPad: {
    height: Spacing[8],
  },
});
