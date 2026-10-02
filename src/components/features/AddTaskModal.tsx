import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Dimensions,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Typography } from '../ui/Typography';
import { Button } from '../ui/Button';
import { useTheme } from '../../hooks/useTheme';
import { useTaskStore } from '../../stores/taskStore';
import { Spacing, Radius, FontFamily, FontSize } from '../../constants/theme';
import { SUBJECTS } from '../../data/mock';
import { Task, TaskPriority } from '../../types';

// ─── Config ───────────────────────────────────────────────────────────────────

interface AddTaskModalProps {
  visible: boolean;
  onClose: () => void;
  editTask?: Task | null;
}

const SUBJECT_LIST = Object.values(SUBJECTS);

const PRIORITY_OPTIONS: { label: string; value: TaskPriority; emoji: string }[] = [
  { label: 'High', value: 'high', emoji: '🔴' },
  { label: 'Medium', value: 'medium', emoji: '🟡' },
  { label: 'Low', value: 'low', emoji: '🟢' },
];

const DUE_DATE_PRESETS = [
  { label: 'Today', days: 0 },
  { label: 'Tomorrow', days: 1 },
  { label: 'In 3 days', days: 3 },
  { label: 'In a week', days: 7 },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function computeDate(daysFromNow: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().split('T')[0];
}

function formatDateDisplay(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

// ─── Component ────────────────────────────────────────────────────────────────

export function AddTaskModal({ visible, onClose, editTask }: AddTaskModalProps) {
  const { colors } = useTheme();
  const addTask = useTaskStore((s) => s.addTask);
  const updateTask = useTaskStore((s) => s.updateTask);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subjectCode, setSubjectCode] = useState<string | null>(null);
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [dueDate, setDueDate] = useState(computeDate(0));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isEdit = !!editTask;

  // Reset / populate form when modal opens
  useEffect(() => {
    if (visible) {
      if (editTask) {
        setTitle(editTask.title);
        setDescription(editTask.description ?? '');
        setSubjectCode(editTask.subjectCode ?? null);
        setPriority(editTask.priority);
        setDueDate(editTask.dueDate);
      } else {
        setTitle('');
        setDescription('');
        setSubjectCode(null);
        setPriority('medium');
        setDueDate(computeDate(0));
      }
      setError('');
      setLoading(false);
    }
  }, [visible, editTask]);

  const handleSubmit = useCallback(async () => {
    const trimmed = title.trim();
    if (!trimmed) {
      setError('Please enter a task title');
      return;
    }
    setError('');
    setLoading(true);

    const subject = SUBJECT_LIST.find((s) => s.subjectCode === subjectCode);

    try {
      if (isEdit && editTask) {
        await updateTask(editTask.id, {
          title: trimmed,
          description: description.trim() || undefined,
          subjectCode: subject?.subjectCode,
          subjectName: subject?.subjectName,
          priority,
          dueDate,
        });
      } else {
        await addTask({
          title: trimmed,
          description: description.trim() || undefined,
          subjectCode: subject?.subjectCode,
          subjectName: subject?.subjectName,
          priority,
          dueDate,
        });
      }
      try {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch {
        // Haptics unavailable on this device
      }
      onClose();
    } catch {
      setError('Failed to save task. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [title, description, subjectCode, priority, dueDate, isEdit, editTask, addTask, updateTask, onClose]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {/* Backdrop — tap to dismiss */}
        <Pressable style={styles.backdrop} onPress={onClose} />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.sheetWrap}
        >
          <View
            style={[
              styles.sheet,
              {
                backgroundColor: colors.bgPrimary,
                borderColor: colors.borderDefault,
              },
            ]}
          >
            {/* Drag handle */}
            <View style={styles.handleBar}>
              <View style={[styles.handle, { backgroundColor: colors.borderStrong }]} />
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.content}
            >
              {/* ── Header ─────────────────────────────── */}
              <View style={styles.header}>
                <Typography variant="title" color="primary">
                  {isEdit ? 'Edit Task' : 'New Task'}
                </Typography>
                <TouchableOpacity
                  onPress={onClose}
                  hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                >
                  <Typography variant="body" color="tertiary">✕</Typography>
                </TouchableOpacity>
              </View>

              {/* ── Title ──────────────────────────────── */}
              <View style={styles.field}>
                <Typography variant="label" color="secondary" style={styles.fieldLabel}>
                  Title
                </Typography>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: colors.surfaceSecondary,
                      borderColor: error ? colors.errorDefault : colors.borderDefault,
                      color: colors.textPrimary,
                      fontFamily: FontFamily.regular,
                    },
                  ]}
                  value={title}
                  onChangeText={(t) => {
                    setTitle(t);
                    if (error) setError('');
                  }}
                  placeholder="What do you need to do?"
                  placeholderTextColor={colors.textTertiary}
                  maxLength={200}
                  autoFocus={!isEdit}
                  returnKeyType="next"
                />
                {error ? (
                  <Typography variant="caption" color="error" style={styles.errorText}>
                    {error}
                  </Typography>
                ) : null}
              </View>

              {/* ── Description ────────────────────────── */}
              <View style={styles.field}>
                <Typography variant="label" color="secondary" style={styles.fieldLabel}>
                  Description
                </Typography>
                <TextInput
                  style={[
                    styles.input,
                    styles.multiline,
                    {
                      backgroundColor: colors.surfaceSecondary,
                      borderColor: colors.borderDefault,
                      color: colors.textPrimary,
                      fontFamily: FontFamily.regular,
                    },
                  ]}
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Add details (optional)"
                  placeholderTextColor={colors.textTertiary}
                  multiline
                  textAlignVertical="top"
                  maxLength={500}
                />
              </View>

              {/* ── Subject ────────────────────────────── */}
              <View style={styles.field}>
                <Typography variant="label" color="secondary" style={styles.fieldLabel}>
                  Subject
                </Typography>
                <View style={styles.chipRow}>
                  {SUBJECT_LIST.map((sub) => {
                    const selected = subjectCode === sub.subjectCode;
                    return (
                      <TouchableOpacity
                        key={sub.subjectCode}
                        onPress={() =>
                          setSubjectCode(selected ? null : sub.subjectCode)
                        }
                        activeOpacity={0.7}
                        style={[
                          styles.chip,
                          {
                            backgroundColor: selected
                              ? colors.brandDefault
                              : colors.surfaceSecondary,
                            borderColor: selected
                              ? colors.brandDefault
                              : colors.borderDefault,
                          },
                        ]}
                      >
                        <Typography
                          variant="caption"
                          style={{
                            color: selected ? '#FFFFFF' : colors.textSecondary,
                          }}
                        >
                          {sub.subjectCode}
                        </Typography>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* ── Priority ───────────────────────────── */}
              <View style={styles.field}>
                <Typography variant="label" color="secondary" style={styles.fieldLabel}>
                  Priority
                </Typography>
                <View style={styles.chipRow}>
                  {PRIORITY_OPTIONS.map((opt) => {
                    const selected = priority === opt.value;
                    return (
                      <TouchableOpacity
                        key={opt.value}
                        onPress={() => setPriority(opt.value)}
                        activeOpacity={0.7}
                        style={[
                          styles.chip,
                          {
                            backgroundColor: selected
                              ? colors.brandDefault
                              : colors.surfaceSecondary,
                            borderColor: selected
                              ? colors.brandDefault
                              : colors.borderDefault,
                          },
                        ]}
                      >
                        <Typography
                          variant="caption"
                          style={{
                            color: selected ? '#FFFFFF' : colors.textSecondary,
                          }}
                        >
                          {opt.emoji} {opt.label}
                        </Typography>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* ── Due Date ───────────────────────────── */}
              <View style={styles.field}>
                <Typography variant="label" color="secondary" style={styles.fieldLabel}>
                  Due Date
                </Typography>
                <View style={styles.chipRow}>
                  {DUE_DATE_PRESETS.map((preset) => {
                    const presetDate = computeDate(preset.days);
                    const selected = dueDate === presetDate;
                    return (
                      <TouchableOpacity
                        key={preset.days}
                        onPress={() => setDueDate(presetDate)}
                        activeOpacity={0.7}
                        style={[
                          styles.chip,
                          {
                            backgroundColor: selected
                              ? colors.brandDefault
                              : colors.surfaceSecondary,
                            borderColor: selected
                              ? colors.brandDefault
                              : colors.borderDefault,
                          },
                        ]}
                      >
                        <Typography
                          variant="caption"
                          style={{
                            color: selected ? '#FFFFFF' : colors.textSecondary,
                          }}
                        >
                          {preset.label}
                        </Typography>
                      </TouchableOpacity>
                    );
                  })}
                </View>
                <Typography
                  variant="caption"
                  color="tertiary"
                  style={{ marginTop: Spacing[1] }}
                >
                  {formatDateDisplay(dueDate)}
                </Typography>
              </View>

              {/* ── Submit ─────────────────────────────── */}
              <Button
                label={isEdit ? 'Save Changes' : 'Add Task'}
                onPress={handleSubmit}
                loading={loading}
                disabled={loading}
                style={{ marginTop: Spacing[2] }}
              />
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFill as object,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  sheetWrap: {
    maxHeight: SCREEN_HEIGHT * 0.85,
  },
  sheet: {
    borderTopLeftRadius: Radius['2xl'],
    borderTopRightRadius: Radius['2xl'],
    borderWidth: 1,
    borderBottomWidth: 0,
    overflow: 'hidden',
  },
  handleBar: {
    alignItems: 'center',
    paddingVertical: Spacing[2],
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
  },
  content: {
    paddingHorizontal: Spacing[5],
    paddingBottom: Spacing[8],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing[5],
  },
  field: {
    marginBottom: Spacing[4],
  },
  fieldLabel: {
    marginBottom: Spacing[2],
  },
  input: {
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[3],
    fontSize: FontSize.base,
  },
  multiline: {
    minHeight: 80,
    paddingTop: Spacing[3],
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing[2],
  },
  chip: {
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[2],
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  errorText: {
    marginTop: Spacing[1],
  },
});
