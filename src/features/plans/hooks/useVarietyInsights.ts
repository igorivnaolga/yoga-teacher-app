import { useEffect, useMemo, useState } from 'react';

import { classPlanRepository, taughtSessionRepository } from '@/data';
import type { ClassPlan } from '@/domain/classPlan';
import type { TaughtSession } from '@/domain/taughtSession';
import {
  analyzeVariety,
  todayWeekday,
  type VarietyAnalysis,
  type WeekdayIndex,
} from '@/domain/variety';

const WINDOW_SIZE = 8;

export function useVarietyInsights(
  draftPoseIds: readonly string[],
  options?: {
    weekday?: WeekdayIndex;
  },
) {
  const [sessions, setSessions] = useState<TaughtSession[]>([]);
  const [plans, setPlans] = useState<ClassPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const weekday = options?.weekday ?? todayWeekday();

  useEffect(() => {
    let active = true;
    setLoading(true);
    void Promise.all([taughtSessionRepository.list(), classPlanRepository.list()])
      .then(([nextSessions, nextPlans]) => {
        if (!active) return;
        setSessions(nextSessions);
        setPlans(nextPlans);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const plansById = useMemo(
    () => new Map(plans.map((plan) => [plan.id, plan])),
    [plans],
  );

  const analysis: VarietyAnalysis = useMemo(
    () =>
      analyzeVariety({
        sessions,
        plansById,
        draftPoseIds,
        weekday,
        windowSize: WINDOW_SIZE,
      }),
    [sessions, plansById, draftPoseIds, weekday],
  );

  const matchSummaries = useMemo(
    () =>
      analysis.matches.map((match) => {
        const planTitle = plansById.get(match.classPlanId)?.title ?? 'Class plan';
        return {
          ...match,
          planTitle,
          label:
            match.kind === 'exact'
              ? `Same full sequence as ${planTitle} (${match.date})`
              : `${match.sharedRunLength}-pose stretch matches ${planTitle} (${match.date})`,
        };
      }),
    [analysis.matches, plansById],
  );

  return {
    loading,
    analysis,
    matchSummaries,
    hasHistory: analysis.sessionWindow > 0,
  };
}
