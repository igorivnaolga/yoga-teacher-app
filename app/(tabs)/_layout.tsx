import { Tabs } from 'expo-router';
import { StyleSheet, Text } from 'react-native';

import { useClientOnlyValue } from '@/shared/hooks/useClientOnlyValue';
import { useColorScheme } from '@/shared/hooks/useColorScheme';
import { APP_TABS, type AppTabName } from '@/shared/navigation/tabs';
import { colors, typography } from '@/shared/theme';

/** System-font marks — avoids @expo/vector-icons FontFaceObserver timeouts on web. */
const tabMarks: Record<AppTabName, string> = {
  index: 'Pl',
  calendar: 'Ca',
  courses: 'Co',
  library: 'Li',
};

function TabBarMark({ mark, color }: { mark: string; color: string }) {
  return <Text style={[styles.mark, { color }]}>{mark}</Text>;
}

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
              <TabBarMark mark={tabMarks[tab.name]} color={String(color)} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}

const styles = StyleSheet.create({
  mark: {
    ...typography.caption,
    fontWeight: '700',
    fontSize: 13,
    marginBottom: -2,
  },
});
