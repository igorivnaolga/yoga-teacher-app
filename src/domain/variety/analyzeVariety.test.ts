import type { ClassPlan } from '@/domain/classPlan';
import type { TaughtSession } from '@/domain/taughtSession';

import { analyzeVariety } from './analyzeVariety';
import { buildTaughtHistoryForWeekday } from './buildHistory';
import { compareSequences, longestSharedRunLength } from './compareSequences';
import { weekdayFromDateKey } from './weekdays';

const plansById = new Map<string, ClassPlan>([
  [
    'plan-mon-a',
    {
      id: 'plan-mon-a',
      title: 'Monday A',
      level: 'beginner',
      durationMinutes: 60,
      items: [
        { id: '1', poseId: 'mountain', order: 0 },
        { id: '2', poseId: 'forward-fold', order: 1 },
        { id: '3', poseId: 'half-lift', order: 2 },
        { id: '4', poseId: 'plank', order: 3 },
        { id: '5', poseId: 'downward-dog', order: 4 },
      ],
      createdAt: '2026-07-01T00:00:00.000Z',
      updatedAt: '2026-07-01T00:00:00.000Z',
    },
  ],
  [
    'plan-wed',
    {
      id: 'plan-wed',
      title: 'Wednesday',
      level: 'beginner',
      durationMinutes: 60,
      items: [
        { id: '1', poseId: 'mountain', order: 0 },
        { id: '2', poseId: 'tree', order: 1 },
        { id: '3', poseId: 'child', order: 2 },
      ],
      createdAt: '2026-07-02T00:00:00.000Z',
      updatedAt: '2026-07-02T00:00:00.000Z',
    },
  ],
]);

// 2026-07-13 = Monday, 2026-07-15 = Wednesday
const sessions: TaughtSession[] = [
  {
    id: 's-mon',
    classPlanId: 'plan-mon-a',
    date: '2026-07-13',
    createdAt: '2026-07-13T10:00:00.000Z',
  },
  {
    id: 's-wed',
    classPlanId: 'plan-wed',
    date: '2026-07-15',
    createdAt: '2026-07-15T10:00:00.000Z',
  },
];

describe('weekday helpers', () => {
  it('maps date keys to weekdays', () => {
    expect(weekdayFromDateKey('2026-07-13')).toBe(1); // Monday
    expect(weekdayFromDateKey('2026-07-15')).toBe(3); // Wednesday
  });
});

describe('sequence comparison', () => {
  it('allows shared poses but detects ordered runs', () => {
    expect(longestSharedRunLength(['a', 'b', 'c', 'd'], ['x', 'b', 'c', 'y'])).toBe(2);
    expect(
      compareSequences(['a', 'b', 'c', 'd'], ['a', 'b', 'c', 'd'])?.kind,
    ).toBe('exact');
    expect(compareSequences(['a', 'b'], ['a', 'x'])).toBeNull();
  });
});

describe('buildTaughtHistoryForWeekday', () => {
  it('only includes classes from that weekday', () => {
    const monday = buildTaughtHistoryForWeekday(sessions, plansById, 1, 8);
    expect(monday).toHaveLength(1);
    expect(monday[0]?.classPlanId).toBe('plan-mon-a');
  });
});

describe('analyzeVariety', () => {
  it('flags an exact sequence repeated on the same weekday', () => {
    const analysis = analyzeVariety({
      sessions,
      plansById,
      weekday: 1, // Monday
      draftPoseIds: ['mountain', 'forward-fold', 'half-lift', 'plank', 'downward-dog'],
    });

    expect(analysis.weekdayLabel).toBe('Monday');
    expect(analysis.exactSequenceRepeated).toBe(true);
    expect(analysis.overlapLevel).toBe('high');
    expect(analysis.matches[0]?.date).toBe('2026-07-13');
  });

  it('does not compare against a different weekday even with the same poses', () => {
    const analysis = analyzeVariety({
      sessions,
      plansById,
      weekday: 1, // Monday
      draftPoseIds: ['mountain', 'tree', 'child', 'boat', 'bridge'],
    });

    // Wednesday had mountain-tree-child, but Monday history should ignore it.
    expect(analysis.matches).toHaveLength(0);
    expect(analysis.overlapLevel).toBe('none');
  });

  it('allows pose reuse when the ordered sequence differs', () => {
    const analysis = analyzeVariety({
      sessions,
      plansById,
      weekday: 1,
      // Same poses as Monday class, different order
      draftPoseIds: ['downward-dog', 'plank', 'half-lift', 'forward-fold', 'mountain'],
    });

    expect(analysis.exactSequenceRepeated).toBe(false);
    // No 3+ consecutive shared run in reverse order
    expect(analysis.overlapLevel).toBe('none');
  });

  it('flags a partial ordered stretch on that weekday', () => {
    const analysis = analyzeVariety({
      sessions,
      plansById,
      weekday: 1,
      draftPoseIds: ['chair', 'mountain', 'forward-fold', 'half-lift', 'warrior-1'],
    });

    expect(analysis.exactSequenceRepeated).toBe(false);
    expect(analysis.matches[0]?.kind).toBe('partial');
    expect(analysis.matches[0]?.sharedRunLength).toBe(3);
    expect(analysis.overlapLevel).toBe('low');
  });
});
