import { render, screen } from '@testing-library/react-native';

import { EmptyState } from '@/shared/ui/EmptyState';

describe('EmptyState', () => {
  it('renders the title and supporting message', async () => {
    await render(
      <EmptyState
        title="No class plans yet"
        message="Create your first plan when you are ready to teach."
      />,
    );

    expect(screen.getByText('No class plans yet')).toBeOnTheScreen();
    expect(
      screen.getByText('Create your first plan when you are ready to teach.'),
    ).toBeOnTheScreen();
  });
});
