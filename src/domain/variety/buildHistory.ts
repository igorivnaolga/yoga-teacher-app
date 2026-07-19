import type { ClassPlan } from '@/domain/classPlan';
import { recentSessions, type TaughtSession } from '@/domain/taughtSession';

import { weekdayFromDateKey } from './weekdays';

export type TaughtHistoryEntry = {
  sessionId: string;
  date: string;
  classPlanId: string;
  /** Ordered pose sequence from the taught class plan */
  poseIds: string[];
  theme?: string;
  weekday: number;
};

function toEntry(
  session: TaughtSession,
  plansById: ReadonlyMap<string, ClassPlan>,
): TaughtHistoryEntry {
  const plan = plansById.get(session.classPlanId);
  return {
    sessionId: session.id,
    date: session.date,
    classPlanId: session.classPlanId,
    poseIds: plan ? plan.items.map((item) => item.poseId) : [],
    theme: plan?.theme?.trim() || undefined,
    weekday: weekdayFromDateKey(session.date),
  };
}

/** Recent classes on any day (legacy helper / diagnostics). */
export function buildTaughtHistory(
  sessions: readonly TaughtSession[],
  plansById: ReadonlyMap<string, ClassPlan>,
  windowSize = 8,
): TaughtHistoryEntry[] {
  return recentSessions(sessions, windowSize).map((session) => toEntry(session, plansById));
}

/**
 * Recent classes that fell on the same weekday (e.g. last N Mondays).
 * Individual poses may repeat; callers compare ordered sequences.
 */
export function buildTaughtHistoryForWeekday(
  sessions: readonly TaughtSession[],
  plansById: ReadonlyMap<string, ClassPlan>,
  weekday: number,
  windowSize = 8,
): TaughtHistoryEntry[] {
  const onWeekday = sessions.filter((session) => weekdayFromDateKey(session.date) === weekday);
  return recentSessions(onWeekday, windowSize).map((session) => toEntry(session, plansById));
}
