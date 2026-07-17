import { Pressable, StyleSheet, Text, View } from 'react-native';

import { CATEGORY_LABELS, type Pose } from '@/domain/pose';
import { useColorScheme } from '@/shared/hooks/useColorScheme';
import { colors, spacing, typography } from '@/shared/theme';

type PoseListItemProps = {
  pose: Pose;
  onPress: (poseId: string) => void;
};

export function PoseListItem({ pose, onPress }: PoseListItemProps) {
  const scheme = useColorScheme();
  const theme = colors[scheme];

  return (
    <Pressable
      onPress={() => onPress(pose.id)}
      accessibilityRole="button"
      accessibilityLabel={`${pose.name}${pose.sanskrit ? `, ${pose.sanskrit}` : ''}`}
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
        <Text style={[styles.name, { color: theme.text }]}>{pose.name}</Text>
        {pose.sanskrit ? (
          <Text style={[styles.sanskrit, { color: theme.textMuted }]}>{pose.sanskrit}</Text>
        ) : null}
        <Text style={[styles.meta, { color: theme.tintMuted }]}>
          {CATEGORY_LABELS[pose.category]} · {pose.difficulty}
        </Text>
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
  name: {
    ...typography.body,
    fontWeight: '600',
  },
  sanskrit: {
    ...typography.caption,
    fontStyle: 'italic',
  },
  meta: {
    ...typography.caption,
    marginTop: 2,
    textTransform: 'capitalize',
  },
  chevron: {
    fontSize: 22,
    lineHeight: 24,
  },
});
