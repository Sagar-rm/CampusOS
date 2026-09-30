import { ClassSlot, TodayClass, DayOfWeek } from '../types';
import { mockTimetable } from '../data/mock';

const DAY_MAP: Record<number, DayOfWeek> = {
  1: 'Mon', 2: 'Tue', 3: 'Wed', 4: 'Thu', 5: 'Fri', 6: 'Sat',
};

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

function classStatus(
  slot: ClassSlot,
  nowMinutes: number
): TodayClass['status'] {
  const start = timeToMinutes(slot.startTime);
  const end = timeToMinutes(slot.endTime);
  if (nowMinutes >= start && nowMinutes < end) return 'ongoing';
  if (nowMinutes >= end) return 'completed';
  return 'upcoming';
}

export const timetableService = {
  async getForDay(day: DayOfWeek): Promise<ClassSlot[]> {
    await delay(200);
    return mockTimetable
      .filter((c) => c.day === day)
      .sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));
  },

  async getTodayClasses(): Promise<TodayClass[]> {
    await delay(200);
    const jsDay = new Date().getDay(); // 0=Sun
    const day = DAY_MAP[jsDay];
    if (!day) return []; // Sunday → no classes

    const now = new Date();
    const nowMinutes = now.getHours() * 60 + now.getMinutes();

    const slots = mockTimetable
      .filter((c) => c.day === day)
      .sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));

    return slots.map((slot): TodayClass => {
      const status = classStatus(slot, nowMinutes);
      const startMin = timeToMinutes(slot.startTime);
      const endMin = timeToMinutes(slot.endTime);
      return {
        ...slot,
        status,
        minutesUntilStart: status === 'upcoming' ? startMin - nowMinutes : undefined,
        minutesUntilEnd: status === 'ongoing' ? endMin - nowMinutes : undefined,
      };
    });
  },

  getTodayDay(): DayOfWeek | null {
    const jsDay = new Date().getDay();
    return DAY_MAP[jsDay] ?? null;
  },

  getAllDays(): DayOfWeek[] {
    return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  },
};
