import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  SectionList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../src/hooks/useTheme';
import { Typography } from '../../src/components/ui/Typography';
import { TaskItem } from '../../src/components/features/TaskItem';
import { LoadingState, EmptyState, ErrorState } from '../../src/components/ui/StateViews';
import { tasksService, getTaskGroup } from '../../src/services/tasks.service';
import { Task, TaskGroup } from '../../src/types';
import { Spacing } from '../../src/constants/theme';

interface TaskSection {
  title: string;
  key: TaskGroup;
  data: Task[];
}

const GROUP_LABELS: Record<TaskGroup, string> = {
  overdue: '🔴 Overdue',
  today: "Today",
  week: 'This Week',
  completed: 'Completed',
};

const GROUP_ORDER: TaskGroup[] = ['overdue', 'today', 'week', 'completed'];

function groupTasks(tasks: Task[]): TaskSection[] {
  const groups: Record<TaskGroup, Task[]> = { overdue: [], today: [], week: [], completed: [] };
  tasks.forEach((t) => groups[getTaskGroup(t)].push(t));
  return GROUP_ORDER
    .filter((g) => groups[g].length > 0)
    .map((g) => ({ title: GROUP_LABELS[g], key: g, data: groups[g] }));
}

export default function TasksScreen() {
  const { colors } = useTheme();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [status, setStatus] = useState<'loading' | 'error' | 'success'>('loading');
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await tasksService.getTasks();
      setTasks(data);
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  const handleComplete = useCallback(async (id: string) => {
    await tasksService.completeTask(id);
    await load();
  }, [load]);

  const handleUncomplete = useCallback(async (id: string) => {
    await tasksService.uncompleteTask(id);
    await load();
  }, [load]);

  const sections = groupTasks(tasks);

  if (status === 'loading' && !tasks.length) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.bgPrimary }]}>
        <View style={styles.header}>
          <Typography variant="h3" color="primary">Tasks</Typography>
        </View>
        <LoadingState message="Loading tasks..." />
      </SafeAreaView>
    );
  }

  if (status === 'error') {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.bgPrimary }]}>
        <View style={styles.header}>
          <Typography variant="h3" color="primary">Tasks</Typography>
        </View>
        <ErrorState onRetry={load} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bgPrimary }]} edges={['top']}>
      <View style={styles.header}>
        <Typography variant="h3" color="primary">Tasks</Typography>
        {tasks.filter((t) => !t.completed).length > 0 && (
          <Typography variant="caption" color="secondary">
            {tasks.filter((t) => !t.completed).length} pending
          </Typography>
        )}
      </View>

      {tasks.length === 0 ? (
        <EmptyState
          emoji="🎉"
          title="All clear!"
          subtitle="No tasks right now. Enjoy the moment."
        />
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          stickySectionHeadersEnabled={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.brandDefault} />
          }
          renderSectionHeader={({ section }) => (
            <View style={styles.sectionHeader}>
              <Typography variant="label" color="tertiary" style={styles.sectionLabel}>
                {section.title.toUpperCase()}
              </Typography>
            </View>
          )}
          renderItem={({ item }) => (
            <TaskItem
              task={item}
              onComplete={handleComplete}
              onUncomplete={handleUncomplete}
            />
          )}
          ListFooterComponent={<View style={{ height: Spacing[8] }} />}
        />
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  list: {
    paddingHorizontal: Spacing[4],
    paddingTop: Spacing[2],
  },
  sectionHeader: {
    paddingVertical: Spacing[2],
    marginTop: Spacing[2],
  },
  sectionLabel: {
    letterSpacing: 0.8,
  },
});
