import {
  createBackup,
  parseBackup,
  serializeBackup,
  type AppBackup,
} from '@/domain/backup';

import {
  classPlanRepository,
  type ClassPlanRepository,
} from '@/data/repositories/classPlanRepository';
import {
  courseRepository,
  type CourseRepository,
} from '@/data/repositories/courseRepository';
import { poseRepository, type PoseRepository } from '@/data/repositories/poseRepository';
import {
  taughtSessionRepository,
  type TaughtSessionRepository,
} from '@/data/repositories/taughtSessionRepository';

export type BackupRepositories = {
  classPlans: ClassPlanRepository;
  taughtSessions: TaughtSessionRepository;
  courses: CourseRepository;
  poses: PoseRepository;
};

const defaultRepos: BackupRepositories = {
  classPlans: classPlanRepository,
  taughtSessions: taughtSessionRepository,
  courses: courseRepository,
  poses: poseRepository,
};

export function createBackupService(repos: BackupRepositories = defaultRepos) {
  return {
    async exportBackup(exportedAt?: string): Promise<AppBackup> {
      await repos.poses.ready();
      return createBackup({
        classPlans: await repos.classPlans.list(),
        taughtSessions: await repos.taughtSessions.list(),
        courses: await repos.courses.list(),
        customPoses: repos.poses.listCustom(),
        exportedAt,
      });
    },

    async exportBackupJson(exportedAt?: string): Promise<string> {
      return serializeBackup(await this.exportBackup(exportedAt));
    },

    parseBackupJson(raw: string) {
      return parseBackup(raw);
    },

    async restoreBackup(backup: AppBackup): Promise<void> {
      await repos.poses.replaceCustom(backup.customPoses);
      await repos.classPlans.replaceAll(backup.classPlans);
      await repos.taughtSessions.replaceAll(backup.taughtSessions);
      await repos.courses.replaceAll(backup.courses);
    },

    async restoreBackupJson(raw: string): Promise<AppBackup> {
      const parsed = parseBackup(raw);
      if (!parsed.ok) {
        throw new Error(parsed.error.message);
      }
      await this.restoreBackup(parsed.backup);
      return parsed.backup;
    },
  };
}

export const backupService = createBackupService();
