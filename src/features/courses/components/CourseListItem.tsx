import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Course } from '@/domain/course';
import { useColorScheme } from '@/shared/hooks/useColorScheme';
import { colors, spacing, typography } from '@/shared/theme';

type CourseListItemProps = {
  course: Course;
  onPress: (courseId: string) => void;
};

export function CourseListItem({ course, onPress }: CourseListItemProps) {
  const scheme = useColorScheme();
  const theme = colors[scheme];

  return (
    <Pressable
      onPress={() => onPress(course.id)}
      accessibilityRole="button"
      accessibilityLabel={course.title}
      style={({ pressed }) => [
        styles.row,
        {
          backgroundColor: theme.surface,
          borderColor: theme.border,
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      <View style={styles.copy}>
        <Text style={[styles.title, { color: theme.text }]}>{course.title}</Text>
        <Text style={[styles.meta, { color: theme.textMuted }]}>
          {course.sessions.length} session{course.sessions.length === 1 ? '' : 's'}
        </Text>
        {course.description ? (
          <Text style={[styles.description, { color: theme.tintMuted }]} numberOfLines={2}>
            {course.description}
          </Text>
        ) : null}
      </View>
      <Text style={[styles.chevron, { color: theme.textMuted }]}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  copy: {
    flex: 1,
    gap: 2,
  },
  title: {
    ...typography.body,
    fontWeight: '600',
  },
  meta: {
    ...typography.caption,
  },
  description: {
    ...typography.caption,
    marginTop: 2,
  },
  chevron: {
    fontSize: 22,
    lineHeight: 24,
  },
});
