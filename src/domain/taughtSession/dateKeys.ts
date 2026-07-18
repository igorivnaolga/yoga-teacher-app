const DATE_KEY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function isValidDateKey(value: string): boolean {
  if (!DATE_KEY_PATTERN.test(value)) {
    return false;
  }
  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) {
    return false;
  }
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

export function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseDateKey(dateKey: string): Date {
  if (!isValidDateKey(dateKey)) {
    throw new Error(`Invalid date key: ${dateKey}`);
  }
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Date(year!, month! - 1, day!);
}

export function formatDateKeyLabel(dateKey: string): string {
  const date = parseDateKey(dateKey);
  return date.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function shiftMonth(year: number, monthIndex: number, delta: number): {
  year: number;
  monthIndex: number;
} {
  const date = new Date(year, monthIndex + delta, 1);
  return { year: date.getFullYear(), monthIndex: date.getMonth() };
}

export type CalendarDayCell = {
  dateKey: string;
  dayOfMonth: number;
  inCurrentMonth: boolean;
};

/** Builds a Sunday-start month grid (6 weeks × 7 days). */
export function buildMonthGrid(year: number, monthIndex: number): CalendarDayCell[] {
  const firstOfMonth = new Date(year, monthIndex, 1);
  const startOffset = firstOfMonth.getDay(); // 0 = Sunday
  const gridStart = new Date(year, monthIndex, 1 - startOffset);
  const cells: CalendarDayCell[] = [];

  for (let i = 0; i < 42; i += 1) {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + i);
    cells.push({
      dateKey: toDateKey(date),
      dayOfMonth: date.getDate(),
      inCurrentMonth: date.getMonth() === monthIndex,
    });
  }

  return cells;
}

export function monthTitle(year: number, monthIndex: number): string {
  return new Date(year, monthIndex, 1).toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric',
  });
}
