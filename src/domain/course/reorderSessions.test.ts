import {
  appendSession,
  moveSessionDown,
  moveSessionUp,
  pruneMissingPlanSessions,
  removeSessionAt,
  reorderSessions,
} from './reorderSessions';
import type { CourseSession } from './types';

const sessions: CourseSession[] = [
  { id: 's1', classPlanId: 'plan-a', order: 0 },
  { id: 's2', classPlanId: 'plan-b', order: 1 },
  { id: 's3', classPlanId: 'plan-c', order: 2 },
];

describe('course session ordering', () => {
  it('moves sessions up and down', () => {
    expect(moveSessionDown(sessions, 0).map((s) => s.classPlanId)).toEqual([
      'plan-b',
      'plan-a',
      'plan-c',
    ]);
    expect(moveSessionUp(sessions, 2).map((s) => s.classPlanId)).toEqual([
      'plan-a',
      'plan-c',
      'plan-b',
    ]);
  });

  it('reorders by index and renumbers', () => {
    const next = reorderSessions(sessions, 2, 0);
    expect(next.map((s) => s.classPlanId)).toEqual(['plan-c', 'plan-a', 'plan-b']);
    expect(next.map((s) => s.order)).toEqual([0, 1, 2]);
  });

  it('removes and appends sessions', () => {
    expect(removeSessionAt(sessions, 1).map((s) => s.classPlanId)).toEqual(['plan-a', 'plan-c']);
    expect(
      appendSession(sessions, { id: 's4', classPlanId: 'plan-d' }).map((s) => s.classPlanId),
    ).toEqual(['plan-a', 'plan-b', 'plan-c', 'plan-d']);
  });

  it('prunes sessions whose plans are missing', () => {
    const { sessions: kept, removedCount } = pruneMissingPlanSessions(
      sessions,
      new Set(['plan-a', 'plan-c']),
    );
    expect(removedCount).toBe(1);
    expect(kept.map((s) => s.classPlanId)).toEqual(['plan-a', 'plan-c']);
    expect(kept.map((s) => s.order)).toEqual([0, 1]);
  });
});
