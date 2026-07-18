import { fireEvent, render, screen } from '@testing-library/react-native';

import { buildMonthGrid } from '@/domain/taughtSession';

import { MonthGrid } from './MonthGrid';

describe('MonthGrid', () => {
  it('selects a day when pressed', async () => {
    const onSelectDate = jest.fn();
    const cells = buildMonthGrid(2026, 6);

    await render(
      <MonthGrid
        cells={cells}
        selectedDateKey="2026-07-18"
        todayKey="2026-07-18"
        markedDates={new Set(['2026-07-10'])}
        onSelectDate={onSelectDate}
      />,
    );

    fireEvent.press(screen.getByLabelText('2026-07-10, has classes'));
    expect(onSelectDate).toHaveBeenCalledWith('2026-07-10');
  });
});
