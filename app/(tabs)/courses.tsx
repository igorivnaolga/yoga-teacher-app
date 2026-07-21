import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { CourseListItem, useCourses } from '@/features/courses';
import { useColorScheme } from '@/shared/hooks/useColorScheme';
import { colors, palette, spacing, typography } from '@/shared/theme';
import { EmptyState } from '@/shared/ui/EmptyState';
import { Screen } from '@/shared/ui/Screen';

export default function CoursesScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const theme = colors[scheme];
  const { courses, loading, error, refresh } = useCourses();

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh]),
  );

  return (
    <Screen padded={false}>
      <View style={styles.header}>
        <Text style={[styles.subtitle, { color: theme.textMuted }]}>
          Link class plans into multi-session paths like Foundation.
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Create course"
          onPress={() => router.push({ pathname: '/course/[id]', params: { id: 'new' } })}
          style={({ pressed }) => [
            styles.createButton,
            { backgroundColor: theme.tint, opacity: pressed ? 0.85 : 1 },
          ]}
        >
          <Text style={styles.createLabel}>New course</Text>
        </Pressable>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator color={theme.tint} />
        </View>
      ) : error ? (
        <View style={styles.padded}>
          <EmptyState title="Could not load courses" message={error} />
        </View>
      ) : (
        <FlatList
          data={courses}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={
            <EmptyState
              title="No courses yet"
              message="Create a course, add class plans as sessions, and reorder the path. Need an existing plan first."
            />
          }
          renderItem={({ item }) => (
            <CourseListItem
              course={item}
              onPress={(courseId) =>
                router.push({ pathname: '/course/[id]', params: { id: courseId } })
              }
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
