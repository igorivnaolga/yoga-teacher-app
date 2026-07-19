import { Pressable, StyleSheet, Text, View } from 'react-native';

import { PoseIcon } from '@/features/library/components/PoseIcon';
import type { PlanEditorItem } from '@/features/plans/hooks/useClassPlanEditor';
import { useColorScheme } from '@/shared/hooks/useColorScheme';
import { colors, spacing, typography } from '@/shared/theme';

type PlanItemRowProps = {
  item: PlanEditorItem;
  index: number;
  isFirst: boolean;
  isLast: boolean;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onRemove: (index: number) => void;
};

export function PlanItemRow({
  item,
  index,
  isFirst,
  isLast,
  onMoveUp,
  onMoveDown,
  onRemove,
}: PlanItemRowProps) {
  const scheme = useColorScheme();
  const theme = colors[scheme];

  return (
    <View style={[styles.row, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <View style={styles.copy}>
        <Text style={[styles.order, { color: theme.tintMuted }]}>{index + 1}</Text>
        <PoseIcon category={item.poseCategory} size="sm" />
        <View style={styles.textBlock}>
          <Text style={[styles.name, { color: theme.text }]}>{item.poseName}</Text>
          {item.poseSanskrit ? (
            <Text style={[styles.sanskrit, { color: theme.textMuted }]}>{item.poseSanskrit}</Text>
          ) : null}
        </View>
      </View>
      <View style={styles.actions}>
        <ActionButton label="Up" disabled={isFirst} onPress={() => onMoveUp(index)} />
        <ActionButton label="Down" disabled={isLast} onPress={() => onMoveDown(index)} />
        <ActionButton label="Remove" danger onPress={() => onRemove(index)} />
      </View>
    </View>
  );
}

function ActionButton({
  label,
  onPress,
  disabled,
  danger,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  danger?: boolean;
}) {
  const scheme = useColorScheme();
  const theme = colors[scheme];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [
        styles.action,
        {
          borderColor: danger ? theme.danger : theme.border,
          opacity: disabled ? 0.35 : pressed ? 0.7 : 1,
        },
      ]}
    >
      <Text style={{ color: danger ? theme.danger : theme.text, ...typography.caption }}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    borderWidth: 1,
    borderRadius: 14,
    padding: spacing.md,
    gap: spacing.sm,
  },
  copy: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
  },
  order: {
    ...typography.caption,
    fontWeight: '700',
    minWidth: 20,
  },
  textBlock: {
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
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  action: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
  },
});
