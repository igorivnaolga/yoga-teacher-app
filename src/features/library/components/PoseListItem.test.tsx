import { fireEvent, render, screen } from '@testing-library/react-native';

import type { Pose } from '@/domain/pose';

import { PoseListItem } from './PoseListItem';

const pose: Pose = {
  id: 'tree',
  name: 'Tree Pose',
  sanskrit: 'Vrksasana',
  categories: ['balance'],
  difficulty: 'beginner',
  tags: ['balance'],
};

describe('PoseListItem', () => {
  it('shows pose identity and handles press', async () => {
    const onPress = jest.fn();

    await render(<PoseListItem pose={pose} onPress={onPress} />);

    expect(screen.getByText('Tree Pose')).toBeOnTheScreen();
    expect(screen.getByText('Vrksasana')).toBeOnTheScreen();

    fireEvent.press(screen.getByLabelText('Tree Pose, Vrksasana'));
    expect(onPress).toHaveBeenCalledWith('tree');
  });
});
