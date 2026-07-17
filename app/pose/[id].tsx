import { Stack, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text } from 'react-native';

import { poseRepository } from '@/data';
import { PoseDetail } from '@/features/library';
import { useColorScheme } from '@/shared/hooks/useColorScheme';
import { colors, spacing, typography } from '@/shared/theme';
import { Screen } from '@/shared/ui/Screen';

export default function PoseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const pose = typeof id === 'string' ? poseRepository.getById(id) : undefined;
  const scheme = useColorScheme();
  const theme = colors[scheme];

  return (
    <>
      <Stack.Screen options={{ title: pose?.name ?? 'Pose' }} />
      <Screen padded={false}>
        <ScrollView contentContainerStyle={styles.content}>
          {pose ? (
            <PoseDetail pose={pose} />
          ) : (
            <Text style={[styles.missing, { color: theme.textMuted }]}>
              This pose could not be found in the library.
            </Text>
          )}
        </ScrollView>
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
  },
  missing: {
    ...typography.body,
  },
});
