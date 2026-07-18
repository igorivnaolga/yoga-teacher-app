import { buildMonthGrid, isValidDateKey, shiftMonth, toDateKey } from './dateKeys';

describe('dateKeys', () => {
  it('validates YYYY-MM-DD keys', () => {
    expect(isValidDateKey('2026-07-18')).toBe(true);
    expect(isValidDateKey('2026-02-30')).toBe(false);
    expect(isValidDateKey('07-18-2026')).toBe(false);
  });

  it('formats local dates as keys', () => {
    expect(toDateKey(new Date(2026, 6, 18))).toBe('2026-07-18');
  });

  it('builds a 42-cell month grid including adjacent days', () => {
    const grid = buildMonthGrid(2026, 6); // July 2026
    expect(grid).toHaveLength(42);
    expect(grid.filter((cell) => cell.inCurrentMonth).length).toBe(31);
    expect(grid.some((cell) => cell.dateKey === '2026-07-01')).toBe(true);
  });

  it('shifts months across year boundaries', () => {
    expect(shiftMonth(2026, 0, -1)).toEqual({ year: 2025, monthIndex: 11 });
    expect(shiftMonth(2026, 11, 1)).toEqual({ year: 2027, monthIndex: 0 });
  });
});
