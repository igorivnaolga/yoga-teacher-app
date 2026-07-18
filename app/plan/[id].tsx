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

import { poseRepository } from '@/data';
import { PoseListItem, PoseSearchBar } from '@/features/library';
import { LevelPicker, PlanItemRow, useClassPlanEditor } from '@/features/plans';
import { useColorScheme } from '@/shared/hooks/useColorScheme';
import { colors, palette, spacing, typography } from '@/shared/theme';
import { EmptyState } from '@/shared/ui/EmptyState';
import { Screen } from '@/shared/ui/Screen';

export default function ClassPlanEditorScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const scheme = useColorScheme();
  const theme = colors[scheme];
  const [pickerOpen, setPickerOpen] = useState(false);
  const [poseSearch, setPoseSearch] = useState('');

  const editor = useClassPlanEditor({ planId: id });
  const poseChoices = poseRepository.list({ search: poseSearch });

  const fieldError = (field: string) =>
    editor.validationErrors.find((error) => error.field === field)?.message;

  const onSave = async () => {
    const saved = await editor.save();
    if (saved) {
      router.back();
    }
  };

  const onDelete = () => {
    Alert.alert('Delete plan', 'This cannot be undone.', [
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
        <Stack.Screen options={{ title: 'Class plan' }} />
        <Screen>
          <ActivityIndicator color={theme.tint} />
        </Screen>
      </>
    );
  }

  if (editor.loadError) {
    return (
      <>
        <Stack.Screen options={{ title: 'Class plan' }} />
        <Screen>
          <EmptyState title="Plan unavailable" message={editor.loadError} />
        </Screen>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: editor.isNew ? 'New plan' : 'Edit plan' }} />
      <Screen padded={false}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Field label="Title" error={fieldError('title')}>
            <TextInput
              value={editor.draft.title}
              onChangeText={editor.setTitle}
              placeholder="e.g. Foundation — Week 1"
              placeholderTextColor={theme.textMuted}
              style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.surface }]}
            />
          </Field>

          <Field label="Level">
            <LevelPicker value={editor.draft.level} onChange={editor.setLevel} />
          </Field>

          <Field label="Duration (minutes)" error={fieldError('durationMinutes')}>
            <TextInput
              value={String(editor.draft.durationMinutes)}
              onChangeText={(value) => {
                const next = Number(value.replace(/[^0-9]/g, ''));
                editor.setDurationMinutes(Number.isFinite(next) ? next : 0);
              }}
              keyboardType="number-pad"
              style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.surface }]}
            />
          </Field>

          <Field label="Theme">
            <TextInput
              value={editor.draft.theme ?? ''}
              onChangeText={editor.setTheme}
              placeholder="Optional focus for the class"
              placeholderTextColor={theme.textMuted}
              style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.surface }]}
            />
          </Field>

          <Field label="Notes">
            <TextInput
              value={editor.draft.notes ?? ''}
              onChangeText={editor.setNotes}
              placeholder="Private teaching notes"
              placeholderTextColor={theme.textMuted}
              multiline
              style={[
                styles.input,
                styles.notes,
                { color: theme.text, borderColor: theme.border, backgroundColor: theme.surface },
              ]}
            />
          </Field>

          <View style={styles.sequenceHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Sequence</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Add pose"
              onPress={() => setPickerOpen(true)}
              style={({ pressed }) => [
                styles.secondaryButton,
                { borderColor: theme.tint, opacity: pressed ? 0.8 : 1 },
              ]}
            >
              <Text style={[styles.secondaryLabel, { color: theme.tint }]}>Add pose</Text>
            </Pressable>
          </View>
          {fieldError('items') ? (
            <Text style={[styles.error, { color: theme.danger }]}>{fieldError('items')}</Text>
          ) : null}

          <View style={styles.items}>
            {editor.items.length === 0 ? (
              <Text style={[styles.emptySequence, { color: theme.textMuted }]}>
                No poses yet. Add poses from the library to build this class.
              </Text>
            ) : (
              editor.items.map((item, index) => (
                <PlanItemRow
                  key={item.id}
                  item={item}
                  index={index}
                  isFirst={index === 0}
                  isLast={index === editor.items.length - 1}
                  onMoveUp={editor.moveUp}
                  onMoveDown={editor.moveDown}
                  onRemove={editor.removeAt}
                />
              ))
            )}
          </View>

          {editor.saveError ? (
            <Text style={[styles.error, { color: theme.danger }]}>{editor.saveError}</Text>
          ) : null}

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Save class plan"
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
            <Text style={styles.primaryLabel}>{editor.saving ? 'Saving…' : 'Save plan'}</Text>
          </Pressable>

          {!editor.isNew ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Delete class plan"
              onPress={onDelete}
              style={({ pressed }) => [
                styles.deleteButton,
                { borderColor: theme.danger, opacity: pressed ? 0.8 : 1 },
              ]}
            >
              <Text style={[styles.deleteLabel, { color: theme.danger }]}>Delete plan</Text>
            </Pressable>
          ) : null}
        </ScrollView>
      </Screen>

      <Modal visible={pickerOpen} animationType="slide" onRequestClose={() => setPickerOpen(false)}>
        <Screen padded={false}>
          <View style={styles.pickerHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Add a pose</Text>
            <Pressable onPress={() => setPickerOpen(false)} accessibilityRole="button">
              <Text style={{ color: theme.tint, ...typography.body, fontWeight: '600' }}>Done</Text>
            </Pressable>
          </View>
          <View style={styles.pickerSearch}>
            <PoseSearchBar value={poseSearch} onChangeText={setPoseSearch} />
          </View>
          <ScrollView contentContainerStyle={styles.pickerList}>
            {poseChoices.map((pose) => (
              <View key={pose.id} style={styles.pickerItem}>
                <PoseListItem
                  pose={pose}
                  onPress={(poseId) => {
                    editor.addPose(poseId);
                    setPickerOpen(false);
                    setPoseSearch('');
                  }}
                />
              </View>
            ))}
          </ScrollView>
        </Screen>
      </Modal>
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
      <Text style={[styles.label, { color: theme.text }]}>{label}</Text>
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
    gap: spacing.lg,
  },
  field: {
    gap: spacing.sm,
  },
  label: {
    ...typography.caption,
    fontWeight: '600',
  },
  input: {
    ...typography.body,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
  },
  notes: {
    minHeight: 88,
    textAlignVertical: 'top',
  },
  sequenceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  sectionTitle: {
    ...typography.heading,
  },
  secondaryButton: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  secondaryLabel: {
    ...typography.caption,
    fontWeight: '600',
  },
  items: {
    gap: spacing.sm,
    marginTop: -spacing.sm,
  },
  emptySequence: {
    ...typography.body,
  },
  primaryButton: {
    borderRadius: 14,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  primaryLabel: {
    ...typography.body,
    color: palette.white,
    fontWeight: '700',
  },
  deleteButton: {
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  deleteLabel: {
    ...typography.body,
    fontWeight: '600',
  },
  error: {
    ...typography.caption,
  },
  pickerHeader: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pickerSearch: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  pickerList: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  pickerItem: {
    marginBottom: spacing.sm,
  },
});
