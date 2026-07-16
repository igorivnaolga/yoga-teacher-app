import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { useColorScheme } from '@/shared/hooks/useColorScheme';
import { colors, spacing, typography } from '@/shared/theme';

export default function NotFoundScreen() {
  const scheme = useColorScheme();
  const theme = colors[scheme];

  return (
    <>
      <Stack.Screen options={{ title: 'Not found' }} />
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.title, { color: theme.text }]}>This screen does not exist.</Text>
        <Link href="/" style={styles.link}>
          <Text style={[styles.linkText, { color: theme.tint }]}>Go to Plans</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  title: {
    ...typography.heading,
  },
  link: {
    marginTop: spacing.md,
    paddingVertical: spacing.md,
  },
  linkText: {
    ...typography.body,
  },
});
