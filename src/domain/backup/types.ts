import type { ClassPlan } from '@/domain/classPlan';
import type { Course } from '@/domain/course';
import type { Pose } from '@/domain/pose';
import type { TaughtSession } from '@/domain/taughtSession';

export const BACKUP_VERSION = 1 as const;

export type AppBackup = {
  version: typeof BACKUP_VERSION;
  exportedAt: string;
  classPlans: ClassPlan[];
  taughtSessions: TaughtSession[];
  courses: Course[];
  customPoses: Pose[];
};

export type BackupParseError = {
  message: string;
};
