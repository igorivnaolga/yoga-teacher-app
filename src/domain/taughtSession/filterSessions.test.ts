import {
  datesWithSessions,
  filterSessionsByDate,
  filterSessionsByDateRange,
  recentSessions,
} from './filterSessions';
import type { TaughtSession } from './types';

const sessions: TaughtSession[] = [
  {
    id: 's1',
    classPlanId: 'plan-a',
    date: '2026-07-10',
    createdAt: '2026-07-10T09:00:00.000Z',
  },
  {
    id: 's2',
    classPlanId: 'plan-b',
    date: '2026-07-10',
    createdAt: '2026-07-10T18:00:00.000Z',
  },
  {
    id: 's3',
    classPlanId: 'plan-a',
    date: '2026-07-12',
    createdAt: '2026-07-12T10:00:00.000Z',
  },
];

describe('filterSessions', () => {
  it('returns multiple sessions for the same day in created order', () => {
    expect(filterSessionsByDate(sessions, '2026-07-10').map((s) => s.id)).toEqual(['s1', 's2']);
  });

  it('filters by inclusive date range', () => {
    expect(
      filterSessionsByDateRange(sessions, '2026-07-10', '2026-07-11').map((s) => s.id),
    ).toEqual(['s1', 's2']);
  });

  it('collects dates that have sessions', () => {
    expect([...datesWithSessions(sessions)].sort()).toEqual(['2026-07-10', '2026-07-12']);
  });

  it('returns recent sessions newest first', () => {
    expect(recentSessions(sessions, 2).map((s) => s.id)).toEqual(['s3', 's2']);
  });
});
