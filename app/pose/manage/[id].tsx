import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import type { ReactNode } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import {
  CategoryPicker,
  DifficultyPicker,
  usePoseEditor,
} from '@/features/library';
import { queuePoseForOpenPlan } from '@/features/plans/pendingPlanPose';
import { useColorScheme } from '@/shared/hooks/useColorScheme';
import { colors, palette, spacing, typography } from '@/shared/theme';
import { EmptyState } from '@/shared/ui/EmptyState';
import { Screen } from '@/shared/ui/Screen';

export default function ManagePoseScreen() {
  const router = useRouter();
  const { id, returnToPlan, initialName } = useLocalSearchParams<{
    id: string;
    returnToPlan?: string;
    initialName?: string;
  }>();
  const scheme = useColorScheme();
  const theme = colors[scheme];
  const prefilledName = typeof initialName === 'string' ? initialName : undefined;
  const editor = usePoseEditor({ poseId: id, initialName: prefilledName });
  const planReturnId = typeof returnToPlan === 'string' ? returnToPlan : undefined;

  const fieldError = (field: string) =>
    editor.validationErrors.find((error) => error.field === field)?.message;

  const onSave = async () => {
    const saved = await editor.save();
    if (!saved) return;

    if (planReturnId) {
      // Keep the plan editor mounted so its draft sequence is preserved.
      queuePoseForOpenPlan(saved.id);
      router.back();
      return;
    }

    router.replace(`/pose/${saved.id}`);
  };

  const onDelete = () => {
    Alert.alert('Delete pose', 'Remove this custom pose? Plans that use it will keep the id.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          void editor.remove().then((ok) => {
            if (ok) router.replace('/library');
          });
        },
      },
    ]);
  };

  if (editor.loading) {
    return (
      <>
        <Stack.Screen options={{ title: 'Pose' }} />
        <Screen>
          <ActivityIndicator color={theme.tint} />
        </Screen>
      </>
    );
  }

  if (editor.loadError) {
    return (
      <>
        <Stack.Screen options={{ title: 'Pose' }} />
        <Screen>
          <EmptyState title="Pose unavailable" message={editor.loadError} />
        </Screen>
      </>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: planReturnId
            ? 'New pose for plan'
            : editor.isNew
              ? 'New custom pose'
              : 'Edit custom pose',
        }}
      />
      <Screen padded={false}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Field label="Name" error={fieldError('name')}>
            <TextInput
              value={editor.draft.name}
              onChangeText={editor.setName}
              placeholder="e.g. Side Stretch Flow"
              placeholderTextColor={theme.textMuted}
              style={[
                styles.input,
                { color: theme.text, borderColor: theme.border, backgroundColor: theme.surface },
              ]}
            />
          </Field>

          <Field label="Sanskrit (optional)" error={fieldError('sanskrit')}>
            <TextInput
              value={editor.draft.sanskrit ?? ''}
              onChangeText={editor.setSanskrit}
              placeholder="Optional"
              placeholderTextColor={theme.textMuted}
              style={[
                styles.input,
                { color: theme.text, borderColor: theme.border, backgroundColor: theme.surface },
              ]}
            />
          </Field>

          <Field label="Categories" error={fieldError('categories')}>
            <CategoryPicker value={editor.draft.categories} onChange={editor.setCategories} />
          </Field>

          <Field label="Difficulty" error={fieldError('difficulty')}>
            <DifficultyPicker value={editor.draft.difficulty} onChange={editor.setDifficulty} />
          </Field>

          <Field label="Tags (comma-separated)" error={fieldError('tags')}>
            <TextInput
              value={editor.tagsText}
              onChangeText={editor.setTagsText}
              placeholder="hips, side body"
              placeholderTextColor={theme.textMuted}
              style={[
                styles.input,
                { color: theme.text, borderColor: theme.border, backgroundColor: theme.surface },
              ]}
            />
          </Field>

          <Field label="Teaching cues (optional)" error={fieldError('cues')}>
            <TextInput
              value={editor.draft.cues ?? ''}
              onChangeText={editor.setCues}
              placeholder="What to say or watch for"
              placeholderTextColor={theme.textMuted}
              multiline
              style={[
                styles.input,
                styles.multiline,
                { color: theme.text, borderColor: theme.border, backgroundColor: theme.surface },
              ]}
            />
          </Field>

          {editor.saveError ? (
            <Text style={[styles.error, { color: theme.danger }]}>{editor.saveError}</Text>
          ) : null}

          <Pressable
            onPress={() => void onSave()}
            disabled={editor.saving}
            style={[styles.primaryButton, { backgroundColor: theme.tint, opacity: editor.saving ? 0.7 : 1 }]}
          >
            <Text style={styles.primaryLabel}>{editor.saving ? 'Saving…' : 'Save pose'}</Text>
          </Pressable>

          {!editor.isNew ? (
            <Pressable onPress={onDelete} style={[styles.dangerButton, { borderColor: theme.danger }]}>
              <Text style={[styles.dangerLabel, { color: theme.danger }]}>Delete pose</Text>
            </Pressable>
          ) : null}
        </ScrollView>
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
      <Text style={[styles.fieldLabel, { color: theme.text }]}>{label}</Text>
      {children}
      {error ? <Text style={[styles.error, { color: theme.danger }]}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
    gap: spacing.md,
    paddingBottom: spacing.xxl,
  },
  field: {
    gap: spacing.sm,
  },
  fieldLabel: {
    ...typography.caption,
    fontWeight: '700',
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    ...typography.body,
  },
  multiline: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  error: {
    ...typography.caption,
  },
  primaryButton: {
    borderRadius: 12,
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
    borderRadius: 12,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  dangerLabel: {
    ...typography.body,
    fontWeight: '600',
  },
});
