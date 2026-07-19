import type { ClassPlan } from '@/domain/classPlan';
import type { TaughtSession } from '@/domain/taughtSession';

import { buildTaughtHistoryForWeekday } from './buildHistory';
import { compareSequences, sequenceMatchLevel } from './compareSequences';
import type { SequenceRepetition, VarietyAnalysis } from './types';
import { todayWeekday, weekdayLabel } from './weekdays';

export function analyzeVariety(input: {
  sessions: readonly TaughtSession[];
  plansById: ReadonlyMap<string, ClassPlan>;
  /** Ordered draft sequence (repeats allowed; order matters). */
  draftPoseIds: readonly string[];
  /** Weekday to compare against; defaults to today. */
  weekday?: number;
  /** How many prior same-weekday classes to inspect. */
  windowSize?: number;
}): VarietyAnalysis {
  const weekday = input.weekday ?? todayWeekday();
  const windowSize = input.windowSize ?? 8;
  const draftSequence = [...input.draftPoseIds];
  const history = buildTaughtHistoryForWeekday(
    input.sessions,
    input.plansById,
    weekday,
    windowSize,
  );

  const matches: SequenceRepetition[] = [];
  for (const entry of history) {
    const comparison = compareSequences(draftSequence, entry.poseIds);
    if (!comparison) continue;
    matches.push({
      sessionId: entry.sessionId,
      date: entry.date,
      classPlanId: entry.classPlanId,
      kind: comparison.kind,
      sharedRunLength: comparison.sharedRunLength,
      sharedRatio: comparison.sharedRatio,
    });
  }

  matches.sort((a, b) => {
    if (a.kind !== b.kind) return a.kind === 'exact' ? -1 : 1;
    return b.sharedRunLength - a.sharedRunLength;
  });

  return {
    weekday,
    weekdayLabel: weekdayLabel(weekday),
    sessionWindow: history.length,
    draftSequence,
    matches,
    overlapLevel: sequenceMatchLevel(matches),
    exactSequenceRepeated: matches.some((match) => match.kind === 'exact'),
  };
}
