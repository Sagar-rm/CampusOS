import { Student } from '../types';
import { mockStudent } from '../data/mock';

// In Phase 2, replace this with an API call (e.g., GET /api/student/me)
export const studentService = {
  async getStudent(): Promise<Student> {
    await delay(300);
    return { ...mockStudent };
  },
};

// Shared utility
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
