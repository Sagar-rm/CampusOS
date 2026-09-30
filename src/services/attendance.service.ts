import { SubjectAttendance, AttendanceSummary, AttendancePlan, AttendanceStatus } from '../types';
import { mockAttendance } from '../data/mock';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Calculates how many consecutive classes a student needs to attend
 * to reach exactly 75% attendance.
 *
 * Formula: if current attended/total < 0.75
 *   need x classes where: (attended + x) / (total + x) >= 0.75
 *   => attended + x >= 0.75 * total + 0.75x
 *   => 0.25x >= 0.75*total - attended
 *   => x >= (0.75*total - attended) / 0.25
 *   => x >= (3*total - 4*attended)
 */
function classesNeededFor75(attended: number, total: number): number {
  const needed = 3 * total - 4 * attended;
  return Math.max(0, Math.ceil(needed));
}

/**
 * How many classes can be missed while keeping attendance >= 75%.
 *
 * Formula: if (attended) / (total + x) >= 0.75
 *   => attended >= 0.75 * total + 0.75x
 *   => 0.75x <= attended - 0.75*total
 *   => x <= (attended - 0.75*total) / 0.75
 *   => x <= (4*attended - 3*total) / 3
 */
function classesCanMiss(attended: number, total: number): number {
  const canMiss = Math.floor((4 * attended - 3 * total) / 3);
  return Math.max(0, canMiss);
}

function getStatus(percentage: number): AttendanceStatus {
  if (percentage >= 80) return 'safe';
  if (percentage >= 75) return 'warning';
  return 'critical';
}

export const attendanceService = {
  async getSummary(): Promise<AttendanceSummary> {
    await delay(250);
    const subjects = mockAttendance.map((s) => ({
      ...s,
      status: getStatus(s.percentage),
    }));
    const totalAttended = subjects.reduce((a, s) => a + s.attended, 0);
    const totalClasses = subjects.reduce((a, s) => a + s.total, 0);
    const overall = Math.round((totalAttended / totalClasses) * 100);
    const atRiskCount = subjects.filter((s) => s.status === 'critical').length;
    return { overall, subjects, atRiskCount };
  },

  async getAttendancePlans(): Promise<AttendancePlan[]> {
    await delay(250);
    // Assume 10 classes remaining in semester for projection
    const remainingClasses = 10;
    return mockAttendance.map((s): AttendancePlan => {
      const status = getStatus(s.percentage);
      const projectedAttended = s.attended + remainingClasses;
      const projectedTotal = s.total + remainingClasses;
      const projectedPct = Math.round((projectedAttended / projectedTotal) * 100);
      return {
        subjectCode: s.subjectCode,
        subjectName: s.subjectName,
        currentPercentage: s.percentage,
        attended: s.attended,
        total: s.total,
        classesNeededFor75: classesNeededFor75(s.attended, s.total),
        classesCanMiss: classesCanMiss(s.attended, s.total),
        projectedPercentageIfAllAttended: projectedPct,
        status,
      };
    });
  },
};
