import { fireEvent, render, screen } from '@testing-library/react-native';

import { PoseSearchBar } from './PoseSearchBar';

describe('PoseSearchBar', () => {
  it('renders and reports text changes', async () => {
    const onChangeText = jest.fn();

    await render(<PoseSearchBar value="" onChangeText={onChangeText} />);

    fireEvent.changeText(screen.getByLabelText('Search poses'), 'tree');

    expect(onChangeText).toHaveBeenCalledWith('tree');
  });
});
