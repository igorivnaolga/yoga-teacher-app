import { Pressable, StyleSheet, Text, View } from 'react-native';

import { CLASS_PLAN_LEVEL_LABELS, type ClassPlan } from '@/domain/classPlan';
import { useColorScheme } from '@/shared/hooks/useColorScheme';
import { colors, spacing, typography } from '@/shared/theme';

type ClassPlanListItemProps = {
  plan: ClassPlan;
  onPress: (planId: string) => void;
};

export function ClassPlanListItem({ plan, onPress }: ClassPlanListItemProps) {
  const scheme = useColorScheme();
  const theme = colors[scheme];

  return (
    <Pressable
      onPress={() => onPress(plan.id)}
      accessibilityRole="button"
      accessibilityLabel={plan.title}
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
        <Text style={[styles.title, { color: theme.text }]}>{plan.title}</Text>
        <Text style={[styles.meta, { color: theme.textMuted }]}>
          {CLASS_PLAN_LEVEL_LABELS[plan.level]} · {plan.durationMinutes} min · {plan.items.length}{' '}
          poses
        </Text>
        {plan.theme ? (
          <Text style={[styles.theme, { color: theme.tintMuted }]}>{plan.theme}</Text>
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
  theme: {
    ...typography.caption,
    marginTop: 2,
  },
  chevron: {
    fontSize: 22,
    lineHeight: 24,
  },
});
