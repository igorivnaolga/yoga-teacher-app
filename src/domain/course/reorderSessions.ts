import type { CourseSession } from './types';

function renumber(sessions: CourseSession[]): CourseSession[] {
  return sessions.map((session, index) => ({
    ...session,
    order: index,
  }));
}

export function sortSessionsByOrder(sessions: readonly CourseSession[]): CourseSession[] {
  return [...sessions].sort((a, b) => a.order - b.order);
}

export function reorderSessions(
  sessions: readonly CourseSession[],
  fromIndex: number,
  toIndex: number,
): CourseSession[] {
  const sorted = sortSessionsByOrder(sessions);

  if (
    fromIndex < 0 ||
    toIndex < 0 ||
    fromIndex >= sorted.length ||
    toIndex >= sorted.length ||
    fromIndex === toIndex
  ) {
    return sorted;
  }

  const next = [...sorted];
  const [moved] = next.splice(fromIndex, 1);
  if (!moved) {
    return sorted;
  }
  next.splice(toIndex, 0, moved);
  return renumber(next);
}

export function moveSessionUp(
  sessions: readonly CourseSession[],
  index: number,
): CourseSession[] {
  return reorderSessions(sessions, index, index - 1);
}

export function moveSessionDown(
  sessions: readonly CourseSession[],
  index: number,
): CourseSession[] {
  return reorderSessions(sessions, index, index + 1);
}

export function removeSessionAt(
  sessions: readonly CourseSession[],
  index: number,
): CourseSession[] {
  const sorted = sortSessionsByOrder(sessions);
  if (index < 0 || index >= sorted.length) {
    return sorted;
  }
  return renumber(sorted.filter((_, i) => i !== index));
}

export function appendSession(
  sessions: readonly CourseSession[],
  session: Omit<CourseSession, 'order'>,
): CourseSession[] {
  const sorted = sortSessionsByOrder(sessions);
  return renumber([...sorted, { ...session, order: sorted.length }]);
}

/** Drop sessions whose class plan no longer exists. */
export function pruneMissingPlanSessions(
  sessions: readonly CourseSession[],
  existingPlanIds: ReadonlySet<string>,
): { sessions: CourseSession[]; removedCount: number } {
  const sorted = sortSessionsByOrder(sessions);
  const kept = sorted.filter((session) => existingPlanIds.has(session.classPlanId));
  return {
    sessions: renumber(kept),
    removedCount: sorted.length - kept.length,
  };
}
