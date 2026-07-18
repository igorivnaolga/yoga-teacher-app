import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { ClassPlanListItem, useClassPlans } from '@/features/plans';
import { useColorScheme } from '@/shared/hooks/useColorScheme';
import { colors, palette, spacing, typography } from '@/shared/theme';
import { EmptyState } from '@/shared/ui/EmptyState';
import { Screen } from '@/shared/ui/Screen';

export default function PlansScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const theme = colors[scheme];
  const { plans, loading, error, refresh } = useClassPlans();

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh]),
  );

  return (
    <Screen padded={false}>
      <View style={styles.header}>
        <Text style={[styles.subtitle, { color: theme.textMuted }]}>
          Build sequences you can teach and refine over time.
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Create class plan"
          onPress={() => router.push('/plan/new')}
          style={({ pressed }) => [
            styles.createButton,
            { backgroundColor: theme.tint, opacity: pressed ? 0.85 : 1 },
          ]}
        >
          <Text style={styles.createLabel}>New plan</Text>
        </Pressable>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator color={theme.tint} />
        </View>
      ) : error ? (
        <View style={styles.padded}>
          <EmptyState title="Could not load plans" message={error} />
        </View>
      ) : (
        <FlatList
          data={plans}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={
            <EmptyState
              title="No class plans yet"
              message="Create your first plan, add poses from the library, and reorder the sequence."
            />
          }
          renderItem={({ item }) => (
            <ClassPlanListItem
              plan={item}
              onPress={(planId) => router.push(`/plan/${planId}`)}
            />
          )}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    gap: spacing.md,
  },
  subtitle: {
    ...typography.body,
  },
  createButton: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 2,
  },
  createLabel: {
    ...typography.body,
    color: palette.white,
    fontWeight: '600',
  },
  list: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
    flexGrow: 1,
  },
  separator: {
    height: spacing.sm,
  },
  padded: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
