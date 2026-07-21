import { Stack } from 'expo-router';
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { useBackup } from '@/features/backup/hooks/useBackup';
import { useColorScheme } from '@/shared/hooks/useColorScheme';
import { colors, palette, spacing, typography } from '@/shared/theme';
import { Screen } from '@/shared/ui/Screen';

export default function BackupScreen() {
  const scheme = useColorScheme();
  const theme = colors[scheme];
  const backup = useBackup();

  const onRestore = () => {
    Alert.alert(
      'Restore from clipboard',
      'This replaces your current plans, courses, taught sessions, and custom poses with the backup on the clipboard.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Restore',
          style: 'destructive',
          onPress: () => {
            void backup.restoreFromClipboard();
          },
        },
      ],
    );
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Backup' }} />
      <Screen>
        <View style={styles.content}>
          <Text style={[styles.lead, { color: theme.textMuted }]}>
            Export your teaching data as JSON, or restore a previous backup from the clipboard.
          </Text>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Copy backup to clipboard"
            onPress={() => void backup.copyBackup()}
            disabled={backup.busy}
            style={({ pressed }) => [
              styles.primaryButton,
              {
                backgroundColor: theme.tint,
                opacity: backup.busy ? 0.6 : pressed ? 0.85 : 1,
              },
            ]}
          >
            <Text style={styles.primaryLabel}>Copy backup JSON</Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Share backup"
            onPress={() => void backup.shareBackup()}
            disabled={backup.busy}
            style={({ pressed }) => [
              styles.secondaryButton,
              {
                borderColor: theme.tint,
                opacity: backup.busy ? 0.6 : pressed ? 0.85 : 1,
              },
            ]}
          >
            <Text style={[styles.secondaryLabel, { color: theme.tint }]}>Share backup</Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Restore backup from clipboard"
            onPress={onRestore}
            disabled={backup.busy}
            style={({ pressed }) => [
              styles.secondaryButton,
              {
                borderColor: theme.danger,
                opacity: backup.busy ? 0.6 : pressed ? 0.85 : 1,
              },
            ]}
          >
            <Text style={[styles.secondaryLabel, { color: theme.danger }]}>
              Restore from clipboard
            </Text>
          </Pressable>

          {backup.busy ? <ActivityIndicator color={theme.tint} /> : null}

          {backup.message ? (
            <Text style={[styles.status, { color: theme.tintMuted }]}>{backup.message}</Text>
          ) : null}
          {backup.error ? (
            <Text style={[styles.status, { color: theme.danger }]}>{backup.error}</Text>
          ) : null}

          {backup.lastBackup ? (
            <Text style={[styles.meta, { color: theme.textMuted }]}>
              Last handled backup from {new Date(backup.lastBackup.exportedAt).toLocaleString()}
            </Text>
          ) : null}
        </View>
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.md,
  },
  lead: {
    ...typography.body,
    marginBottom: spacing.sm,
  },
  primaryButton: {
    borderRadius: 999,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  primaryLabel: {
    ...typography.body,
    color: palette.white,
    fontWeight: '700',
  },
  secondaryButton: {
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  secondaryLabel: {
    ...typography.body,
    fontWeight: '600',
  },
  status: {
    ...typography.body,
  },
  meta: {
    ...typography.caption,
  },
});
