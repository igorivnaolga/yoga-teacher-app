import { fireEvent, render, screen } from '@testing-library/react-native';

import type { ClassPlan } from '@/domain/classPlan';

import { ClassPlanListItem } from './ClassPlanListItem';

const plan: ClassPlan = {
  id: 'plan-1',
  title: 'Foundation Warmup',
  level: 'beginner',
  durationMinutes: 45,
  theme: 'Breath',
  items: [{ id: 'i1', poseId: 'mountain', order: 0 }],
  createdAt: '2026-07-18T00:00:00.000Z',
  updatedAt: '2026-07-18T00:00:00.000Z',
};

describe('ClassPlanListItem', () => {
  it('shows plan summary and handles press', async () => {
    const onPress = jest.fn();
    await render(<ClassPlanListItem plan={plan} onPress={onPress} />);

    expect(screen.getByText('Foundation Warmup')).toBeOnTheScreen();
    expect(screen.getByText(/45 min/)).toBeOnTheScreen();

    fireEvent.press(screen.getByLabelText('Foundation Warmup'));
    expect(onPress).toHaveBeenCalledWith('plan-1');
  });
});
