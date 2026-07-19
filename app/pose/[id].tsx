import { Stack, useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { poseRepository } from '@/data';
import type { Pose } from '@/domain/pose';
import { PoseDetail } from '@/features/library';
import { useColorScheme } from '@/shared/hooks/useColorScheme';
import { colors, spacing, typography } from '@/shared/theme';
import { Screen } from '@/shared/ui/Screen';

export default function PoseDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const scheme = useColorScheme();
  const theme = colors[scheme];
  const [pose, setPose] = useState<Pose | undefined>();
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      setLoading(true);
      void poseRepository.ready().then(() => {
        if (!active) return;
        setPose(typeof id === 'string' ? poseRepository.getById(id) : undefined);
        setLoading(false);
      });
      return () => {
        active = false;
      };
    }, [id]),
  );

  const onDelete = () => {
    if (!pose?.custom) return;
    Alert.alert('Delete pose', 'Remove this custom pose?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          void poseRepository.removeCustom(pose.id).then(() => router.replace('/library'));
        },
      },
    ]);
  };

  return (
    <>
      <Stack.Screen options={{ title: pose?.name ?? 'Pose' }} />
      <Screen padded={false}>
        {loading ? (
          <ActivityIndicator color={theme.tint} style={styles.loader} />
        ) : (
          <ScrollView contentContainerStyle={styles.content}>
            {pose ? (
              <>
                <PoseDetail pose={pose} />
                {pose.custom ? (
                  <View style={styles.actions}>
                    <Pressable
                      onPress={() => router.push(`/pose/manage/${pose.id}`)}
                      style={[styles.button, { backgroundColor: theme.tint }]}
                    >
                      <Text style={styles.buttonLabel}>Edit pose</Text>
                    </Pressable>
                    <Pressable
                      onPress={onDelete}
                      style={[styles.buttonOutline, { borderColor: theme.danger }]}
                    >
                      <Text style={[styles.buttonOutlineLabel, { color: theme.danger }]}>
                        Delete pose
                      </Text>
                    </Pressable>
                  </View>
                ) : null}
              </>
            ) : (
              <Text style={[styles.missing, { color: theme.textMuted }]}>
                This pose could not be found in the library.
              </Text>
            )}
          </ScrollView>
        )}
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  loader: {
    marginTop: spacing.xl,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
    gap: spacing.lg,
  },
  missing: {
    ...typography.body,
  },
  actions: {
    gap: spacing.sm,
  },
  button: {
    borderRadius: 12,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  buttonLabel: {
    ...typography.body,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  buttonOutline: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  buttonOutlineLabel: {
    ...typography.body,
    fontWeight: '600',
  },
});
