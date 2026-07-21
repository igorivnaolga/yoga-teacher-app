import type { ClassPlan } from '@/domain/classPlan';
import type { Course } from '@/domain/course';
import type { Pose } from '@/domain/pose';
import type { TaughtSession } from '@/domain/taughtSession';

import { BACKUP_VERSION, type AppBackup } from './types';

export function createBackup(input: {
  classPlans: readonly ClassPlan[];
  taughtSessions: readonly TaughtSession[];
  courses: readonly Course[];
  customPoses: readonly Pose[];
  exportedAt?: string;
}): AppBackup {
  return {
    version: BACKUP_VERSION,
    exportedAt: input.exportedAt ?? new Date().toISOString(),
    classPlans: [...input.classPlans],
    taughtSessions: [...input.taughtSessions],
    courses: [...input.courses],
    customPoses: [...input.customPoses],
  };
}

export function serializeBackup(backup: AppBackup): string {
  return JSON.stringify(backup, null, 2);
}
