import { useRouter } from 'expo-router';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import {
  CategoryChips,
  PoseListItem,
  PoseSearchBar,
  usePoseLibrary,
} from '@/features/library';
import { useColorScheme } from '@/shared/hooks/useColorScheme';
import { colors, spacing, typography } from '@/shared/theme';
import { EmptyState } from '@/shared/ui/EmptyState';
import { Screen } from '@/shared/ui/Screen';

export default function LibraryScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const theme = colors[scheme];
  const { search, setSearch, category, setCategory, categories, poses, resultCount, totalCount } =
    usePoseLibrary();

  return (
    <Screen padded={false}>
      <View style={styles.header}>
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
            message="Try another search term or clear the category filter."
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
