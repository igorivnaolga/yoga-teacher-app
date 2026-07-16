import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import type { ComponentProps } from 'react';

import { useClientOnlyValue } from '@/shared/hooks/useClientOnlyValue';
import { useColorScheme } from '@/shared/hooks/useColorScheme';
import { APP_TABS, type AppTabName } from '@/shared/navigation/tabs';
import { colors } from '@/shared/theme';

type IconName = ComponentProps<typeof FontAwesome>['name'];

function TabBarIcon({ name, color }: { name: IconName; color: string }) {
  return <FontAwesome size={22} style={{ marginBottom: -2 }} name={name} color={color} />;
}

const tabIcons: Record<AppTabName, IconName> = {
  index: 'list-alt',
  calendar: 'calendar',
  courses: 'graduation-cap',
  library: 'book',
};

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const theme = colors[colorScheme];

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.tabIconSelected,
        tabBarInactiveTintColor: theme.tabIconDefault,
        tabBarStyle: {
          backgroundColor: theme.surface,
          borderTopColor: theme.border,
        },
        headerStyle: {
          backgroundColor: theme.background,
        },
        headerTintColor: theme.text,
        headerShown: useClientOnlyValue(false, true),
      }}
    >
      {APP_TABS.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ color }) => (
              <TabBarIcon name={tabIcons[tab.name]} color={String(color)} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
