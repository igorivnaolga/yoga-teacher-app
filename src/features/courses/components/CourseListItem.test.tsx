import { fireEvent, render, screen } from '@testing-library/react-native';

import type { Course } from '@/domain/course';

import { CourseListItem } from './CourseListItem';

const course: Course = {
  id: 'course-1',
  title: 'Foundation',
  description: 'Eight weeks of basics',
  sessions: [
    { id: 's1', classPlanId: 'plan-a', order: 0 },
    { id: 's2', classPlanId: 'plan-b', order: 1 },
  ],
  createdAt: '2026-07-01T00:00:00.000Z',
  updatedAt: '2026-07-01T00:00:00.000Z',
};

describe('CourseListItem', () => {
  it('shows course summary and handles press', async () => {
    const onPress = jest.fn();
    await render(<CourseListItem course={course} onPress={onPress} />);

    expect(screen.getByText('Foundation')).toBeOnTheScreen();
    expect(screen.getByText(/2 sessions/i)).toBeOnTheScreen();

    fireEvent.press(screen.getByLabelText('Foundation'));
    expect(onPress).toHaveBeenCalledWith('course-1');
  });
});
