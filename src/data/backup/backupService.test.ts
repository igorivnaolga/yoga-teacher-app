import { createClassPlanRepository } from '@/data/repositories/classPlanRepository';
import { createCourseRepository } from '@/data/repositories/courseRepository';
import { createPoseRepository } from '@/data/repositories/poseRepository';
import { createTaughtSessionRepository } from '@/data/repositories/taughtSessionRepository';
import { createMemoryStore } from '@/data/storage/memoryStore';

import { createBackupService } from './backupService';

describe('backupService', () => {
  it('round-trips plans, sessions, courses, and custom poses', async () => {
    const sourceStore = createMemoryStore();
    const sourcePlans = createClassPlanRepository(sourceStore);
    const sourceSessions = createTaughtSessionRepository(sourceStore);
    const sourceCourses = createCourseRepository(sourceStore);
    const sourcePoses = createPoseRepository([], sourceStore);
    const exportService = createBackupService({
      classPlans: sourcePlans,
      taughtSessions: sourceSessions,
      courses: sourceCourses,
      poses: sourcePoses,
    });

    await sourcePoses.ready();
    const custom = await sourcePoses.createCustom({
      name: 'My Twist',
      categories: ['twist'],
      difficulty: 'beginner',
      tags: ['custom'],
    });

    const plan = await sourcePlans.create({
      title: 'Morning flow',
      level: 'open',
      durationMinutes: 45,
      items: [{ id: 'item-1', poseId: custom.id, order: 0 }],
    });

    await sourceSessions.create({ classPlanId: plan.id, date: '2026-07-20' });
    await sourceCourses.create({
      title: 'Foundation',
      sessions: [{ id: 's1', classPlanId: plan.id, order: 0, label: 'Week 1' }],
    });

    const json = await exportService.exportBackupJson('2026-07-21T12:00:00.000Z');

    const targetStore = createMemoryStore();
    const targetPlans = createClassPlanRepository(targetStore);
    const targetSessions = createTaughtSessionRepository(targetStore);
    const targetCourses = createCourseRepository(targetStore);
    const targetPoses = createPoseRepository([], targetStore);
    const restoreService = createBackupService({
      classPlans: targetPlans,
      taughtSessions: targetSessions,
      courses: targetCourses,
      poses: targetPoses,
    });

    await restoreService.restoreBackupJson(json);
    await targetPoses.ready();

    expect(targetPoses.listCustom()).toEqual([
      expect.objectContaining({ id: custom.id, name: 'My Twist' }),
    ]);
    expect(await targetPlans.list()).toEqual([
      expect.objectContaining({ id: plan.id, title: 'Morning flow' }),
    ]);
    expect(await targetSessions.list()).toEqual([
      expect.objectContaining({ classPlanId: plan.id, date: '2026-07-20' }),
    ]);
    expect(await targetCourses.list()).toEqual([
      expect.objectContaining({ title: 'Foundation' }),
    ]);
  });

  it('rejects invalid restore JSON', async () => {
    const store = createMemoryStore();
    const service = createBackupService({
      classPlans: createClassPlanRepository(store),
      taughtSessions: createTaughtSessionRepository(store),
      courses: createCourseRepository(store),
      poses: createPoseRepository([], store),
    });

    await expect(service.restoreBackupJson('not-json')).rejects.toThrow(/valid JSON/i);
  });
});
