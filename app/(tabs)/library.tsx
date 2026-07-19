import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { poseRepository } from '@/data';
import {
  CategoryChips,
  PoseListItem,
  PoseSearchBar,
  usePoseLibrary,
} from '@/features/library';
import { useColorScheme } from '@/shared/hooks/useColorScheme';
import { colors, palette, spacing, typography } from '@/shared/theme';
import { EmptyState } from '@/shared/ui/EmptyState';
import { Screen } from '@/shared/ui/Screen';

export default function LibraryScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const theme = colors[scheme];
  const {
    search,
    setSearch,
    category,
    setCategory,
    categories,
    poses,
    resultCount,
    totalCount,
    refresh,
  } = usePoseLibrary();

  useFocusEffect(
    useCallback(() => {
      void poseRepository.ready().then(() => refresh());
    }, [refresh]),
  );

  return (
    <Screen padded={false}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={[styles.heading, { color: theme.text }]}>Pose library</Text>
          <Pressable
            onPress={() => router.push('/pose/manage/new')}
            style={[styles.addButton, { backgroundColor: theme.tint }]}
            accessibilityRole="button"
            accessibilityLabel="Add custom pose"
          >
            <Text style={styles.addLabel}>Add pose</Text>
          </Pressable>
        </View>
        <PoseSearchBar value={search} onChangeText={setSearch} />
        <CategoryChips options={categories} selected={category} onSelect={setCategory} />
        <Text style={[styles.count, { color: theme.textMuted }]}>
          {resultCount} of {totalCount} poses
        </Text>
      </View>

      <FlatList
        data={poses}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <EmptyState
            title="No poses found"
            message="Try another search term, clear the category filter, or add a custom pose."
          />
        }
        renderItem={({ item }) => (
          <PoseListItem
            pose={item}
            onPress={(poseId) => router.push(`/pose/${poseId}`)}
          />
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    gap: spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  heading: {
    ...typography.heading,
    fontSize: 22,
    flex: 1,
  },
  addButton: {
    borderRadius: 999,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  addLabel: {
    ...typography.caption,
    color: palette.white,
    fontWeight: '700',
  },
  count: {
    ...typography.caption,
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
});
