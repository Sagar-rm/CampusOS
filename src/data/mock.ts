import {
  Student,
  ClassSlot,
  TodayClass,
  Task,
  SubjectAttendance,
  AttendancePlan,
  AIInsight,
  DayOfWeek,
} from '../types';

// ─── Student ──────────────────────────────────────────────────────────────────

export const mockStudent: Student = {
  id: 'stu_001',
  name: 'Sagar Hegde',
  firstName: 'Sagar',
  college: 'Bangalore Institute of Technology',
  branch: 'Computer Science Engineering',
  semester: 5,
  rollNumber: '1BI22CS089',
  email: 'sagar.hegde@bit.edu.in',
  cgpa: 8.5,
};

// ─── Subjects ─────────────────────────────────────────────────────────────────

export const SUBJECTS = {
  DBMS: { subjectCode: 'DBMS', subjectName: 'Database Management Systems' },
  TOC:  { subjectCode: 'TOC',  subjectName: 'Theory of Computation' },
  DAA:  { subjectCode: 'DAA',  subjectName: 'Design & Analysis of Algorithms' },
  JAVA: { subjectCode: 'JAVA', subjectName: 'Java Programming' },
  CN:   { subjectCode: 'CN',   subjectName: 'Computer Networks' },
} as const;

// ─── Timetable ────────────────────────────────────────────────────────────────
// 5th Semester schedule — BIT style (Mon–Sat)

export const mockTimetable: ClassSlot[] = [
  // Monday
  { id: 'c01', ...SUBJECTS.DBMS, faculty: 'Dr. Rekha Sharma',   room: 'CS-201', day: 'Mon', startTime: '09:00', endTime: '10:00', type: 'lecture' },
  { id: 'c02', ...SUBJECTS.TOC,  faculty: 'Prof. Manjunath B',  room: 'CS-301', day: 'Mon', startTime: '10:00', endTime: '11:00', type: 'lecture' },
  { id: 'c03', ...SUBJECTS.DAA,  faculty: 'Dr. Kavitha R',      room: 'CS-201', day: 'Mon', startTime: '11:15', endTime: '12:15', type: 'lecture' },
  { id: 'c04', ...SUBJECTS.JAVA, faculty: 'Prof. Suresh K',     room: 'CS-Lab2',day: 'Mon', startTime: '14:00', endTime: '16:00', type: 'lab' },

  // Tuesday
  { id: 'c05', ...SUBJECTS.CN,   faculty: 'Dr. Anand P',        room: 'CS-201', day: 'Tue', startTime: '09:00', endTime: '10:00', type: 'lecture' },
  { id: 'c06', ...SUBJECTS.DBMS, faculty: 'Dr. Rekha Sharma',   room: 'CS-201', day: 'Tue', startTime: '10:00', endTime: '11:00', type: 'lecture' },
  { id: 'c07', ...SUBJECTS.TOC,  faculty: 'Prof. Manjunath B',  room: 'CS-301', day: 'Tue', startTime: '11:15', endTime: '12:15', type: 'lecture' },
  { id: 'c08', ...SUBJECTS.DAA,  faculty: 'Dr. Kavitha R',      room: 'CS-Lab1',day: 'Tue', startTime: '14:00', endTime: '16:00', type: 'lab' },

  // Wednesday
  { id: 'c09', ...SUBJECTS.JAVA, faculty: 'Prof. Suresh K',     room: 'CS-201', day: 'Wed', startTime: '09:00', endTime: '10:00', type: 'lecture' },
  { id: 'c10', ...SUBJECTS.CN,   faculty: 'Dr. Anand P',        room: 'CS-301', day: 'Wed', startTime: '10:00', endTime: '11:00', type: 'lecture' },
  { id: 'c11', ...SUBJECTS.DBMS, faculty: 'Dr. Rekha Sharma',   room: 'CS-Lab3',day: 'Wed', startTime: '11:15', endTime: '13:15', type: 'lab' },

  // Thursday
  { id: 'c12', ...SUBJECTS.TOC,  faculty: 'Prof. Manjunath B',  room: 'CS-301', day: 'Thu', startTime: '09:00', endTime: '10:00', type: 'lecture' },
  { id: 'c13', ...SUBJECTS.DAA,  faculty: 'Dr. Kavitha R',      room: 'CS-201', day: 'Thu', startTime: '10:00', endTime: '11:00', type: 'lecture' },
  { id: 'c14', ...SUBJECTS.JAVA, faculty: 'Prof. Suresh K',     room: 'CS-201', day: 'Thu', startTime: '11:15', endTime: '12:15', type: 'lecture' },
  { id: 'c15', ...SUBJECTS.CN,   faculty: 'Dr. Anand P',        room: 'CS-201', day: 'Thu', startTime: '14:00', endTime: '15:00', type: 'lecture' },

  // Friday
  { id: 'c16', ...SUBJECTS.DBMS, faculty: 'Dr. Rekha Sharma',   room: 'CS-201', day: 'Fri', startTime: '09:00', endTime: '10:00', type: 'lecture' },
  { id: 'c17', ...SUBJECTS.TOC,  faculty: 'Prof. Manjunath B',  room: 'CS-301', day: 'Fri', startTime: '10:00', endTime: '11:00', type: 'lecture' },
  { id: 'c18', ...SUBJECTS.CN,   faculty: 'Dr. Anand P',        room: 'CS-Lab1',day: 'Fri', startTime: '11:15', endTime: '13:15', type: 'lab' },

  // Saturday
  { id: 'c19', ...SUBJECTS.DAA,  faculty: 'Dr. Kavitha R',      room: 'CS-201', day: 'Sat', startTime: '09:00', endTime: '10:00', type: 'lecture' },
  { id: 'c20', ...SUBJECTS.JAVA, faculty: 'Prof. Suresh K',     room: 'CS-201', day: 'Sat', startTime: '10:00', endTime: '11:00', type: 'lecture' },
];

// ─── Attendance ───────────────────────────────────────────────────────────────
// All numbers are mathematically consistent: percentage = round(attended/total*100)

export const mockAttendance: SubjectAttendance[] = [
  {
    subjectCode: 'DBMS',
    subjectName: 'Database Management Systems',
    attended: 18,
    total: 25,
    percentage: 72, // 18/25 = 72%
    status: 'critical',
  },
  {
    subjectCode: 'TOC',
    subjectName: 'Theory of Computation',
    attended: 20,
    total: 25,
    percentage: 80, // 20/25 = 80%
    status: 'safe',
  },
  {
    subjectCode: 'DAA',
    subjectName: 'Design & Analysis of Algorithms',
    attended: 19,
    total: 25,
    percentage: 76, // 19/25 = 76%
    status: 'warning',
  },
  {
    subjectCode: 'JAVA',
    subjectName: 'Java Programming',
    attended: 21,
    total: 25,
    percentage: 84, // 21/25 = 84%
    status: 'safe',
  },
  {
    subjectCode: 'CN',
    subjectName: 'Computer Networks',
    attended: 17,
    total: 25,
    percentage: 68, // 17/25 = 68%
    status: 'critical',
  },
];

// ─── Tasks ────────────────────────────────────────────────────────────────────

const today = new Date();
const fmt = (d: Date) => d.toISOString().split('T')[0];
const addDays = (d: Date, n: number) => {
  const r = new Date(d); r.setDate(r.getDate() + n); return r;
};

export const mockTasks: Task[] = [
  {
    id: 'task_001',
    title: 'Complete DBMS ER Diagram assignment',
    subjectCode: 'DBMS',
    subjectName: 'Database Management Systems',
    priority: 'high',
    dueDate: fmt(today),
    dueTime: '23:59',
    completed: false,
    createdAt: fmt(addDays(today, -2)),
  },
  {
    id: 'task_002',
    title: 'Study pumping lemma for TOC exam',
    subjectCode: 'TOC',
    subjectName: 'Theory of Computation',
    priority: 'high',
    dueDate: fmt(today),
    completed: false,
    createdAt: fmt(addDays(today, -1)),
  },
  {
    id: 'task_003',
    title: 'Implement QuickSort in Java',
    subjectCode: 'JAVA',
    subjectName: 'Java Programming',
    priority: 'medium',
    dueDate: fmt(addDays(today, 2)),
    completed: false,
    createdAt: fmt(addDays(today, -1)),
  },
  {
    id: 'task_004',
    title: 'Read Chapter 5 — Greedy Algorithms',
    subjectCode: 'DAA',
    subjectName: 'Design & Analysis of Algorithms',
    priority: 'medium',
    dueDate: fmt(addDays(today, 3)),
    completed: false,
    createdAt: fmt(today),
  },
  {
    id: 'task_005',
    title: 'CN Lab report — Subnetting exercises',
    subjectCode: 'CN',
    subjectName: 'Computer Networks',
    priority: 'high',
    dueDate: fmt(addDays(today, -1)), // overdue
    completed: false,
    createdAt: fmt(addDays(today, -4)),
  },
  {
    id: 'task_006',
    title: 'Submit DBMS Mini-project proposal',
    subjectCode: 'DBMS',
    subjectName: 'Database Management Systems',
    priority: 'low',
    dueDate: fmt(addDays(today, 7)),
    completed: false,
    createdAt: fmt(today),
  },
  {
    id: 'task_007',
    title: 'TOC Assignment 3 — CFG problems',
    subjectCode: 'TOC',
    subjectName: 'Theory of Computation',
    priority: 'medium',
    dueDate: fmt(addDays(today, -3)), // overdue
    completed: true,
    createdAt: fmt(addDays(today, -7)),
  },
];

// ─── AI Insights ──────────────────────────────────────────────────────────────

export const mockInsights: AIInsight[] = [
  {
    id: 'ins_001',
    text: 'Your CN attendance is at 68% — attend the next 3 classes to get back to 75%.',
    category: 'attendance',
  },
  {
    id: 'ins_002',
    text: 'You have a DBMS ER Diagram due today. Block time before 9 PM.',
    category: 'task',
  },
  {
    id: 'ins_003',
    text: 'Good week for Java — you\'ve kept up with all 5 sessions this month.',
    category: 'study',
  },
];
