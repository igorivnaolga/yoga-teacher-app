import { useCallback, useEffect, useMemo, useState } from 'react';

import { classPlanRepository, taughtSessionRepository } from '@/data';
import type { ClassPlan } from '@/domain/classPlan';
import {
  buildMonthGrid,
  datesWithSessions,
  filterSessionsByDate,
  formatDateKeyLabel,
  monthTitle,
  recentSessions,
  shiftMonth,
  toDateKey,
  type TaughtSession,
} from '@/domain/taughtSession';

export type TaughtSessionView = TaughtSession & {
  planTitle: string;
};

function toViews(
  sessions: TaughtSession[],
  plansById: Map<string, ClassPlan>,
): TaughtSessionView[] {
  return sessions.map((session) => ({
    ...session,
    planTitle: plansById.get(session.classPlanId)?.title ?? 'Deleted plan',
  }));
}

export function useTeachingCalendar() {
  const todayKey = toDateKey(new Date());
  const initial = new Date();
  const [year, setYear] = useState(initial.getFullYear());
  const [monthIndex, setMonthIndex] = useState(initial.getMonth());
  const [selectedDateKey, setSelectedDateKey] = useState(todayKey);
  const [sessions, setSessions] = useState<TaughtSession[]>([]);
  const [plans, setPlans] = useState<ClassPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [logging, setLogging] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [nextSessions, nextPlans] = await Promise.all([
        taughtSessionRepository.list(),
        classPlanRepository.list(),
      ]);
      setSessions(nextSessions);
      setPlans(nextPlans);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load calendar.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const plansById = useMemo(
    () => new Map(plans.map((plan) => [plan.id, plan])),
    [plans],
  );

  const grid = useMemo(() => buildMonthGrid(year, monthIndex), [year, monthIndex]);
  const markedDates = useMemo(() => datesWithSessions(sessions), [sessions]);
  const selectedSessions = useMemo(
    () => toViews(filterSessionsByDate(sessions, selectedDateKey), plansById),
    [sessions, selectedDateKey, plansById],
  );
  const recent = useMemo(
    () => toViews(recentSessions(sessions, 8), plansById),
    [sessions, plansById],
  );

  const goToPreviousMonth = () => {
    const next = shiftMonth(year, monthIndex, -1);
    setYear(next.year);
    setMonthIndex(next.monthIndex);
  };

  const goToNextMonth = () => {
    const next = shiftMonth(year, monthIndex, 1);
    setYear(next.year);
    setMonthIndex(next.monthIndex);
  };

  const logTaught = async (classPlanId: string, notes?: string) => {
    setLogging(true);
    setError(null);
    try {
      await taughtSessionRepository.create({
        classPlanId,
        date: selectedDateKey,
        notes,
      });
      await refresh();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to log session.');
      return false;
    } finally {
      setLogging(false);
    }
  };

  const removeSession = async (sessionId: string) => {
    await taughtSessionRepository.remove(sessionId);
    await refresh();
  };

  return {
    year,
    monthIndex,
    title: monthTitle(year, monthIndex),
    grid,
    markedDates,
    selectedDateKey,
    selectedDateLabel: formatDateKeyLabel(selectedDateKey),
    selectedSessions,
    recent,
    plans,
    todayKey,
    loading,
    logging,
    error,
    setSelectedDateKey,
    goToPreviousMonth,
    goToNextMonth,
    logTaught,
    removeSession,
    refresh,
  };
}
