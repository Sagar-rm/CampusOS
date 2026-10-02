import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  RefreshControl,
  SectionList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../src/hooks/useTheme';
import { Typography } from '../../src/components/ui/Typography';
import { TaskItem } from '../../src/components/features/TaskItem';
import { AddTaskModal } from '../../src/components/features/AddTaskModal';
import { LoadingState, EmptyState, ErrorState } from '../../src/components/ui/StateViews';
import { getTaskGroup } from '../../src/services/tasks.service';
import { useTaskStore } from '../../src/stores/taskStore';
import { Task, TaskGroup } from '../../src/types';
import { Spacing, Radius } from '../../src/constants/theme';

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
  const tasks = useTaskStore((s) => s.tasks);
  const status = useTaskStore((s) => s.status);
  const fetchTasks = useTaskStore((s) => s.fetchTasks);
  const completeTask = useTaskStore((s) => s.completeTask);
  const uncompleteTask = useTaskStore((s) => s.uncompleteTask);
  const deleteTask = useTaskStore((s) => s.deleteTask);

  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    if (status === 'idle') fetchTasks();
  }, [status, fetchTasks]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchTasks();
    setRefreshing(false);
  }, [fetchTasks]);

  const handleComplete = useCallback(async (id: string) => {
    await completeTask(id);
    try { await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); } catch {}
  }, [completeTask]);

  const handleUncomplete = useCallback(async (id: string) => {
    await uncompleteTask(id);
  }, [uncompleteTask]);

  const handleDelete = useCallback((task: Task) => {
    Alert.alert(
      'Delete Task',
      `Are you sure you want to delete "${task.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteTask(task.id);
            try { await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); } catch {}
          },
        },
      ],
    );
  }, [deleteTask]);

  const handleEdit = useCallback((task: Task) => {
    setEditingTask(task);
    setModalVisible(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalVisible(false);
    setEditingTask(null);
  }, []);

  const sections = groupTasks(tasks);
  const pendingCount = tasks.filter((t) => !t.completed).length;

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

  if (status === 'error' && !tasks.length) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.bgPrimary }]}>
        <View style={styles.header}>
          <Typography variant="h3" color="primary">Tasks</Typography>
        </View>
        <ErrorState onRetry={fetchTasks} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bgPrimary }]} edges={['top']}>
      <View style={styles.header}>
        <Typography variant="h3" color="primary">Tasks</Typography>
        {pendingCount > 0 && (
          <Typography variant="caption" color="secondary">
            {pendingCount} pending
          </Typography>
        )}
      </View>

      {tasks.length === 0 ? (
        <EmptyState
          emoji="🎉"
          title="All clear!"
          subtitle="No tasks right now. Tap + to add one."
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
              onDelete={() => handleDelete(item)}
              onEdit={() => handleEdit(item)}
            />
          )}
          ListFooterComponent={<View style={{ height: Spacing[10] }} />}
        />
      )}

      {/* FAB */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.brandDefault }]}
        activeOpacity={0.8}
        onPress={() => setModalVisible(true)}
      >
        <Typography variant="h3" style={{ color: '#FFFFFF', lineHeight: 28 }}>+</Typography>
      </TouchableOpacity>

      <AddTaskModal
        visible={modalVisible}
        onClose={handleCloseModal}
        editTask={editingTask}
      />
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
  fab: {
    position: 'absolute',
    right: Spacing[5],
    bottom: Spacing[5],
    width: 56,
    height: 56,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});
