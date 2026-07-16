import { APP_TABS, getTabTitles } from '@/shared/navigation/tabs';

describe('APP_TABS', () => {
  it('defines the four primary teacher workspaces', () => {
    expect(APP_TABS).toHaveLength(4);
    expect(getTabTitles()).toEqual(['Plans', 'Calendar', 'Courses', 'Library']);
  });

  it('keeps Plans as the home tab', () => {
    expect(APP_TABS[0]?.name).toBe('index');
    expect(APP_TABS[0]?.title).toBe('Plans');
  });
});
