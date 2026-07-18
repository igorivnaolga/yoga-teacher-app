import type { TaughtSession } from './types';

export function filterSessionsByDate(
  sessions: readonly TaughtSession[],
  dateKey: string,
): TaughtSession[] {
  return sessions
    .filter((session) => session.date === dateKey)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export function filterSessionsByDateRange(
  sessions: readonly TaughtSession[],
  startDateKey: string,
  endDateKey: string,
): TaughtSession[] {
  return sessions
    .filter((session) => session.date >= startDateKey && session.date <= endDateKey)
    .sort((a, b) => {
      const byDate = a.date.localeCompare(b.date);
      if (byDate !== 0) return byDate;
      return a.createdAt.localeCompare(b.createdAt);
    });
}

export function datesWithSessions(sessions: readonly TaughtSession[]): Set<string> {
  return new Set(sessions.map((session) => session.date));
}

export function recentSessions(
  sessions: readonly TaughtSession[],
  limit = 10,
): TaughtSession[] {
  return [...sessions]
    .sort((a, b) => {
      const byDate = b.date.localeCompare(a.date);
      if (byDate !== 0) return byDate;
      return b.createdAt.localeCompare(a.createdAt);
    })
    .slice(0, limit);
}
