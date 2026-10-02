import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
  PanResponder,
  Pressable,
} from 'react-native';
import { Typography } from '../ui/Typography';
import { Badge } from '../ui/Badge';
import { useTheme } from '../../hooks/useTheme';
import { Spacing, Radius } from '../../constants/theme';
import { Task, TaskPriority } from '../../types';

interface TaskItemProps {
  task: Task;
  onComplete: (id: string) => void;
  onUncomplete?: (id: string) => void;
  onDelete?: () => void;
  onEdit?: () => void;
}

const priorityLabel: Record<TaskPriority, string> = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};

const priorityVariant: Record<TaskPriority, 'error' | 'warning' | 'neutral'> = {
  high: 'error',
  medium: 'warning',
  low: 'neutral',
};

function formatDue(dueDate: string, dueTime?: string): string {
  const today = new Date().toISOString().split('T')[0];
  if (dueDate === today) return dueTime ? `Today, ${dueTime}` : 'Today';
  if (dueDate < today) return 'Overdue';
  const d = new Date(dueDate);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

export function TaskItem({ task, onComplete, onUncomplete, onDelete, onEdit }: TaskItemProps) {
  const { colors } = useTheme();
  const [translateX] = useState(() => new Animated.Value(0));
  const isOverdue = !task.completed && task.dueDate < new Date().toISOString().split('T')[0];

  const [panResponder] = useState(() =>
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 10 && Math.abs(g.dy) < 20,
      onPanResponderMove: (_, g) => {
        if (!task.completed && g.dx < 0) {
          translateX.setValue(Math.max(g.dx, -80));
        }
      },
      onPanResponderRelease: (_, g) => {
        if (!task.completed && g.dx < -60) {
          Animated.timing(translateX, { toValue: -400, duration: 220, useNativeDriver: true }).start(() => {
            onComplete(task.id);
          });
        } else {
          Animated.spring(translateX, { toValue: 0, useNativeDriver: true }).start();
        }
      },
    })
  );

  return (
    <Animated.View
      style={{ transform: [{ translateX }] }}
      {...panResponder.panHandlers}
    >
      <Pressable
        onLongPress={onDelete}
        onPress={onEdit}
        delayLongPress={500}
        style={[
          styles.container,
          {
            backgroundColor: colors.surfacePrimary,
            borderColor: isOverdue ? colors.errorDefault : colors.borderDefault,
            borderLeftColor: isOverdue ? colors.errorDefault : task.completed ? colors.borderDefault : colors.borderDefault,
            borderLeftWidth: isOverdue ? 3 : 1,
          },
          task.completed && styles.completed,
        ]}
      >
        {/* Checkbox */}
        <TouchableOpacity
          onPress={() => task.completed ? onUncomplete?.(task.id) : onComplete(task.id)}
          style={[
            styles.checkbox,
            {
              borderColor: task.completed ? colors.successDefault : colors.borderStrong,
              backgroundColor: task.completed ? colors.successSubtle : 'transparent',
            },
          ]}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          {task.completed && (
            <Typography variant="caption" color="success">✓</Typography>
          )}
        </TouchableOpacity>

        {/* Content */}
        <View style={styles.content}>
          <Typography
            variant="label"
            color={task.completed ? 'tertiary' : 'primary'}
            style={task.completed ? styles.strikethrough : undefined}
            numberOfLines={2}
          >
            {task.title}
          </Typography>

          <View style={styles.meta}>
            {task.subjectCode && (
              <Badge label={task.subjectCode} variant="neutral" />
            )}
            <Badge
              label={priorityLabel[task.priority]}
              variant={priorityVariant[task.priority]}
            />
            <Typography variant="caption" color={isOverdue ? 'error' : 'tertiary'}>
              {formatDue(task.dueDate, task.dueTime)}
            </Typography>
          </View>
        </View>

        {/* Swipe hint */}
        {!task.completed && (
          <View style={styles.swipeHint}>
            <Typography variant="caption" color="tertiary">←</Typography>
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderRadius: Radius.lg,
    padding: Spacing[3],
    gap: Spacing[3],
    marginBottom: Spacing[2],
  },
  completed: {
    opacity: 0.55,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: Radius.sm,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
    flexShrink: 0,
  },
  content: {
    flex: 1,
    gap: Spacing[2],
  },
  meta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: Spacing[2],
  },
  strikethrough: {
    textDecorationLine: 'line-through',
  },
  swipeHint: {
    alignSelf: 'center',
    opacity: 0.35,
  },
});
