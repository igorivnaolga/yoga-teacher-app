import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import type { CourseEditorSession } from '@/features/courses/hooks/useCourseEditor';
import { useColorScheme } from '@/shared/hooks/useColorScheme';
import { colors, spacing, typography } from '@/shared/theme';

type CourseSessionRowProps = {
  session: CourseEditorSession;
  index: number;
  isFirst: boolean;
  isLast: boolean;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onRemove: (index: number) => void;
  onChangeLabel: (index: number, label: string) => void;
  onOpenPlan: (classPlanId: string) => void;
};

export function CourseSessionRow({
  session,
  index,
  isFirst,
  isLast,
  onMoveUp,
  onMoveDown,
  onRemove,
  onChangeLabel,
  onOpenPlan,
}: CourseSessionRowProps) {
  const scheme = useColorScheme();
  const theme = colors[scheme];

  return (
    <View style={[styles.row, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <View style={styles.header}>
        <Text style={[styles.order, { color: theme.tintMuted }]}>{index + 1}</Text>
        <View style={styles.copy}>
          <Pressable
            onPress={() => {
              if (!session.planMissing) onOpenPlan(session.classPlanId);
            }}
            disabled={session.planMissing}
            accessibilityRole="button"
            accessibilityLabel={`Open ${session.planTitle}`}
          >
            <Text
              style={[
                styles.title,
                { color: session.planMissing ? theme.danger : theme.text },
              ]}
            >
              {session.planTitle}
            </Text>
          </Pressable>
          <TextInput
            value={session.label ?? ''}
            onChangeText={(value) => onChangeLabel(index, value)}
            placeholder="Label (e.g. Week 1)"
            placeholderTextColor={theme.textMuted}
            style={[
              styles.labelInput,
              { color: theme.text, borderColor: theme.border, backgroundColor: theme.background },
            ]}
          />
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
  header: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'flex-start',
  },
  order: {
    ...typography.caption,
    fontWeight: '700',
    minWidth: 20,
    marginTop: 4,
  },
  copy: {
    flex: 1,
    gap: spacing.sm,
  },
  title: {
    ...typography.body,
    fontWeight: '600',
  },
  labelInput: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs + 2,
    ...typography.caption,
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
