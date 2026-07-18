import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { TaughtSessionView } from '@/features/calendar/hooks/useTeachingCalendar';
import { useColorScheme } from '@/shared/hooks/useColorScheme';
import { colors, spacing, typography } from '@/shared/theme';

type SessionListItemProps = {
  session: TaughtSessionView;
  onOpenPlan?: (classPlanId: string) => void;
  onRemove?: (sessionId: string) => void;
};

export function SessionListItem({ session, onOpenPlan, onRemove }: SessionListItemProps) {
  const scheme = useColorScheme();
  const theme = colors[scheme];

  return (
    <View style={[styles.row, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <Pressable
        style={styles.copy}
        accessibilityRole={onOpenPlan ? 'button' : undefined}
        onPress={onOpenPlan ? () => onOpenPlan(session.classPlanId) : undefined}
      >
        <Text style={[styles.title, { color: theme.text }]}>{session.planTitle}</Text>
        <Text style={[styles.meta, { color: theme.textMuted }]}>{session.date}</Text>
        {session.notes ? (
          <Text style={[styles.notes, { color: theme.tintMuted }]}>{session.notes}</Text>
        ) : null}
      </Pressable>
      {onRemove ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Remove taught session"
          onPress={() => onRemove(session.id)}
          style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
        >
          <Text style={[styles.remove, { color: theme.danger }]}>Remove</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    borderWidth: 1,
    borderRadius: 14,
    padding: spacing.md,
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
  notes: {
    ...typography.caption,
    marginTop: 2,
  },
  remove: {
    ...typography.caption,
    fontWeight: '600',
  },
});
