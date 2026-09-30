// ─── Student ──────────────────────────────────────────────────────────────────

export interface Student {
  id: string;
  name: string;
  firstName: string;
  college: string;
  branch: string;
  semester: number;
  rollNumber: string;
  email: string;
  avatarUrl?: string;
}

// ─── Timetable ────────────────────────────────────────────────────────────────

export type DayOfWeek = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat';

export interface ClassSlot {
  id: string;
  subjectCode: string;
  subjectName: string;
  faculty: string;
  room: string;
  day: DayOfWeek;
  startTime: string; // "HH:MM" 24h
  endTime: string;   // "HH:MM" 24h
  type: 'lecture' | 'lab' | 'tutorial';
}

export interface TodayClass extends ClassSlot {
  status: 'upcoming' | 'ongoing' | 'completed';
  minutesUntilStart?: number;
  minutesUntilEnd?: number;
}

// ─── Attendance ───────────────────────────────────────────────────────────────

export type AttendanceStatus = 'safe' | 'warning' | 'critical';

export interface SubjectAttendance {
  subjectCode: string;
  subjectName: string;
  attended: number;
  total: number;
  percentage: number; // 0–100
  status: AttendanceStatus;
}

export interface AttendancePlan {
  subjectCode: string;
  subjectName: string;
  currentPercentage: number;
  attended: number;
  total: number;
  /** Classes needed to reach 75% (positive = need more, 0 = safe) */
  classesNeededFor75: number;
  /** Classes can be missed while staying ≥75% (negative means already below) */
  classesCanMiss: number;
  /** Projected % if student attends all remaining classes */
  projectedPercentageIfAllAttended: number;
  status: AttendanceStatus;
}

export interface AttendanceSummary {
  overall: number;
  subjects: SubjectAttendance[];
  atRiskCount: number; // subjects < 75%
}

// ─── Tasks ────────────────────────────────────────────────────────────────────

export type TaskPriority = 'high' | 'medium' | 'low';
export type TaskGroup = 'today' | 'week' | 'overdue' | 'completed';

export interface Task {
  id: string;
  title: string;
  subjectCode?: string;
  subjectName?: string;
  priority: TaskPriority;
  dueDate: string; // ISO date string "YYYY-MM-DD"
  dueTime?: string; // "HH:MM"
  completed: boolean;
  createdAt: string;
}

// ─── UI State ─────────────────────────────────────────────────────────────────

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface AsyncState<T> {
  data: T | null;
  status: LoadingState;
  error: string | null;
}

// ─── AI Insight ───────────────────────────────────────────────────────────────

export interface AIInsight {
  id: string;
  text: string;
  category: 'study' | 'attendance' | 'task' | 'general';
}
