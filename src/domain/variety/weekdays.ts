import { parseDateKey } from '@/domain/taughtSession';

export const WEEKDAY_LABELS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
] as const;

export type WeekdayIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export function weekdayFromDateKey(dateKey: string): WeekdayIndex {
  return parseDateKey(dateKey).getDay() as WeekdayIndex;
}

export function weekdayLabel(weekday: number): string {
  return WEEKDAY_LABELS[weekday] ?? 'Unknown day';
}

export function todayWeekday(now = new Date()): WeekdayIndex {
  return now.getDay() as WeekdayIndex;
}
