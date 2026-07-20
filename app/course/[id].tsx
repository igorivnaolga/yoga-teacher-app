import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { type ReactNode, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { CourseSessionRow, useCourseEditor } from '@/features/courses';
import { useColorScheme } from '@/shared/hooks/useColorScheme';
import { colors, palette, spacing, typography } from '@/shared/theme';
import { EmptyState } from '@/shared/ui/EmptyState';
import { Screen } from '@/shared/ui/Screen';

export default function CourseEditorScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const scheme = useColorScheme();
  const theme = colors[scheme];
  const [pickerOpen, setPickerOpen] = useState(false);

  const editor = useCourseEditor({ courseId: id });

  const fieldError = (field: string) =>
    editor.validationErrors.find((error) => error.field === field)?.message;

  const onSave = async () => {
    const saved = await editor.save();
    if (saved) {
      router.back();
    }
  };

  const onDelete = () => {
    Alert.alert('Delete course', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          void editor.remove().then((ok) => {
            if (ok) router.back();
          });
        },
      },
    ]);
  };

  if (editor.loading) {
    return (
      <>
        <Stack.Screen options={{ title: 'Course' }} />
        <Screen>
          <ActivityIndicator color={theme.tint} />
        </Screen>
      </>
    );
  }

  if (editor.loadError) {
    return (
      <>
        <Stack.Screen options={{ title: 'Course' }} />
        <Screen>
          <EmptyState title="Course unavailable" message={editor.loadError} />
        </Screen>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: editor.isNew ? 'New course' : 'Edit course' }} />
      <Screen padded={false}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Field label="Title" error={fieldError('title')}>
            <TextInput
              value={editor.draft.title}
              onChangeText={editor.setTitle}
              placeholder="e.g. Foundation"
              placeholderTextColor={theme.textMuted}
              style={[
                styles.input,
                { color: theme.text, borderColor: theme.border, backgroundColor: theme.surface },
              ]}
            />
          </Field>

          <Field label="Description">
            <TextInput
              value={editor.draft.description ?? ''}
              onChangeText={editor.setDescription}
              placeholder="Optional overview of the path"
              placeholderTextColor={theme.textMuted}
              multiline
              style={[
                styles.input,
                styles.notes,
                { color: theme.text, borderColor: theme.border, backgroundColor: theme.surface },
              ]}
            />
          </Field>

          {editor.prunedCount > 0 ? (
            <Text style={[styles.notice, { color: theme.tintMuted }]}>
              Removed {editor.prunedCount} session
              {editor.prunedCount === 1 ? '' : 's'} linked to deleted class plans.
            </Text>
          ) : null}

          <View style={styles.sequenceHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Sessions</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Add class plan"
              onPress={() => setPickerOpen(true)}
              style={({ pressed }) => [
                styles.secondaryButton,
                { borderColor: theme.tint, opacity: pressed ? 0.8 : 1 },
              ]}
            >
              <Text style={[styles.secondaryLabel, { color: theme.tint }]}>Add plan</Text>
            </Pressable>
          </View>
          {fieldError('sessions') ? (
            <Text style={[styles.error, { color: theme.danger }]}>{fieldError('sessions')}</Text>
          ) : null}

          <View style={styles.items}>
            {editor.sessions.length === 0 ? (
              <Text style={[styles.emptySequence, { color: theme.textMuted }]}>
                No sessions yet. Add class plans to build this course path.
              </Text>
            ) : (
              editor.sessions.map((session, index) => (
                <CourseSessionRow
                  key={session.id}
                  session={session}
                  index={index}
                  isFirst={index === 0}
                  isLast={index === editor.sessions.length - 1}
                  onMoveUp={editor.moveUp}
                  onMoveDown={editor.moveDown}
                  onRemove={editor.removeAt}
                  onChangeLabel={editor.setSessionLabel}
                  onOpenPlan={(classPlanId) => router.push(`/plan/${classPlanId}`)}
                />
              ))
            )}
          </View>

          {editor.saveError ? (
            <Text style={[styles.error, { color: theme.danger }]}>{editor.saveError}</Text>
          ) : null}

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Save course"
            onPress={() => void onSave()}
            disabled={editor.saving}
            style={({ pressed }) => [
              styles.primaryButton,
              {
                backgroundColor: theme.tint,
                opacity: editor.saving ? 0.6 : pressed ? 0.85 : 1,
              },
            ]}
          >
            <Text style={styles.primaryLabel}>{editor.saving ? 'Saving…' : 'Save course'}</Text>
          </Pressable>

          {!editor.isNew ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Delete course"
              onPress={onDelete}
              style={({ pressed }) => [
                styles.dangerButton,
                { borderColor: theme.danger, opacity: pressed ? 0.8 : 1 },
              ]}
            >
              <Text style={[styles.dangerLabel, { color: theme.danger }]}>Delete course</Text>
            </Pressable>
          ) : null}
        </ScrollView>

        <Modal visible={pickerOpen} animationType="slide" onRequestClose={() => setPickerOpen(false)}>
          <Screen>
            <View style={styles.pickerHeader}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Add class plan</Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close plan picker"
                onPress={() => setPickerOpen(false)}
              >
                <Text style={{ color: theme.tint, ...typography.body, fontWeight: '600' }}>Done</Text>
              </Pressable>
            </View>
            {editor.availablePlans.length === 0 ? (
              <EmptyState
                title="No plans available"
                message="Create a class plan first, or all existing plans are already in this course."
              />
            ) : (
              <ScrollView contentContainerStyle={styles.pickerList}>
                {editor.availablePlans.map((plan) => (
                  <Pressable
                    key={plan.id}
                    accessibilityRole="button"
                    accessibilityLabel={`Add ${plan.title}`}
                    onPress={() => {
                      editor.addPlan(plan.id);
                      setPickerOpen(false);
                    }}
                    style={({ pressed }) => [
                      styles.planChoice,
                      {
                        backgroundColor: theme.surface,
                        borderColor: theme.border,
                        opacity: pressed ? 0.85 : 1,
                      },
                    ]}
                  >
                    <Text style={[styles.planChoiceTitle, { color: theme.text }]}>{plan.title}</Text>
                    <Text style={[styles.planChoiceMeta, { color: theme.textMuted }]}>
                      {plan.durationMinutes} min · {plan.items.length} poses
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            )}
          </Screen>
        </Modal>
      </Screen>
    </>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  const scheme = useColorScheme();
  const theme = colors[scheme];

  return (
    <View style={styles.field}>
      <Text style={[styles.label, { color: theme.textMuted }]}>{label}</Text>
      {children}
      {error ? <Text style={[styles.error, { color: theme.danger }]}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
    gap: spacing.md,
  },
  field: {
    gap: spacing.xs,
  },
  label: {
    ...typography.caption,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    ...typography.body,
  },
  notes: {
    minHeight: 88,
    textAlignVertical: 'top',
  },
  notice: {
    ...typography.caption,
  },
  sequenceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  sectionTitle: {
    ...typography.title,
  },
  secondaryButton: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
  },
  secondaryLabel: {
    ...typography.caption,
    fontWeight: '600',
  },
  items: {
    gap: spacing.sm,
  },
  emptySequence: {
    ...typography.body,
  },
  primaryButton: {
    borderRadius: 999,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  primaryLabel: {
    ...typography.body,
    color: palette.white,
    fontWeight: '700',
  },
  dangerButton: {
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  dangerLabel: {
    ...typography.body,
    fontWeight: '600',
  },
  error: {
    ...typography.caption,
  },
  pickerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  pickerList: {
    gap: spacing.sm,
    paddingBottom: spacing.xxl,
  },
  planChoice: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: 2,
  },
  planChoiceTitle: {
    ...typography.body,
    fontWeight: '600',
  },
  planChoiceMeta: {
    ...typography.caption,
  },
});
