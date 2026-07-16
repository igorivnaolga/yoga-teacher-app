export const APP_TABS = [
  {
    name: 'index',
    title: 'Plans',
    href: '/',
    description: 'Create and manage class plans',
  },
  {
    name: 'calendar',
    title: 'Calendar',
    href: '/calendar',
    description: 'See classes you have taught',
  },
  {
    name: 'courses',
    title: 'Courses',
    href: '/courses',
    description: 'Build multi-session courses',
  },
  {
    name: 'library',
    title: 'Library',
    href: '/library',
    description: 'Browse poses and references',
  },
] as const;

export type AppTabName = (typeof APP_TABS)[number]['name'];

export function getTabTitles(): string[] {
  return APP_TABS.map((tab) => tab.title);
}
