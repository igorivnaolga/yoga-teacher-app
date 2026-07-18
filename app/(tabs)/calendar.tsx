import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
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

import { MonthGrid, SessionListItem, useTeachingCalendar } from '@/features/calendar';
import { useColorScheme } from '@/shared/hooks/useColorScheme';
import { colors, palette, spacing, typography } from '@/shared/theme';
import { EmptyState } from '@/shared/ui/EmptyState';
import { Screen } from '@/shared/ui/Screen';

export default function CalendarScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const theme = colors[scheme];
  const calendar = useTeachingCalendar();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [notes, setNotes] = useState('');

  useFocusEffect(
    useCallback(() => {
      void calendar.refresh();
    }, [calendar.refresh]),
  );

  const confirmRemove = (sessionId: string, title: string) => {
    Alert.alert('Remove session', `Remove “${title}” from this day?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => {
          void calendar.removeSession(sessionId);
        },
      },
    ]);
  };

  return (
    <Screen padded={false}>
      {calendar.loading ? (
        <View style={styles.centered}>
          <ActivityIndicator color={theme.tint} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.monthHeader}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Previous month"
              onPress={calendar.goToPreviousMonth}
              style={styles.monthNav}
            >
              <Text style={{ color: theme.tint, ...typography.body, fontWeight: '700' }}>‹</Text>
            </Pressable>
            <Text style={[styles.monthTitle, { color: theme.text }]}>{calendar.title}</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Next month"
              onPress={calendar.goToNextMonth}
              style={styles.monthNav}
            >
              <Text style={{ color: theme.tint, ...typography.body, fontWeight: '700' }}>›</Text>
            </Pressable>
          </View>

          <MonthGrid
            cells={calendar.grid}
            selectedDateKey={calendar.selectedDateKey}
            todayKey={calendar.todayKey}
            markedDates={calendar.markedDates}
            onSelectDate={calendar.setSelectedDateKey}
          />

          <View style={styles.dayHeader}>
            <View style={styles.dayCopy}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                {calendar.selectedDateLabel}
              </Text>
              <Text style={[styles.sectionMeta, { color: theme.textMuted }]}>
                {calendar.selectedSessions.length
                  ? `${calendar.selectedSessions.length} class${calendar.selectedSessions.length === 1 ? '' : 'es'} taught`
                  : 'No classes logged yet'}
              </Text>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Log taught class"
              onPress={() => setPickerOpen(true)}
              style={({ pressed }) => [
                styles.primaryButton,
                { backgroundColor: theme.tint, opacity: pressed ? 0.85 : 1 },
              ]}
            >
              <Text style={styles.primaryLabel}>Log class</Text>
            </Pressable>
          </View>

          {calendar.error ? (
            <Text style={[styles.error, { color: theme.danger }]}>{calendar.error}</Text>
          ) : null}

          <View style={styles.list}>
            {calendar.selectedSessions.length === 0 ? (
              <EmptyState
                title="Nothing taught this day"
                message="Log a class plan to build your teaching history."
              />
            ) : (
              calendar.selectedSessions.map((session) => (
                <SessionListItem
                  key={session.id}
                  session={session}
                  onOpenPlan={(planId) => router.push(`/plan/${planId}`)}
                  onRemove={(sessionId) => confirmRemove(sessionId, session.planTitle)}
                />
              ))
            )}
          </View>

          {calendar.recent.length > 0 ? (
            <View style={styles.recent}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Recently taught</Text>
              {calendar.recent.map((session) => (
                <SessionListItem
                  key={`recent-${session.id}`}
                  session={session}
                  onOpenPlan={(planId) => router.push(`/plan/${planId}`)}
                />
              ))}
            </View>
          ) : null}
        </ScrollView>
      )}

      <Modal visible={pickerOpen} animationType="slide" onRequestClose={() => setPickerOpen(false)}>
        <Screen padded={false}>
          <View style={styles.pickerHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Log class · {calendar.selectedDateKey}
            </Text>
            <Pressable onPress={() => setPickerOpen(false)} accessibilityRole="button">
              <Text style={{ color: theme.tint, ...typography.body, fontWeight: '600' }}>Close</Text>
            </Pressable>
          </View>

          <View style={styles.pickerNotes}>
            <Text style={[styles.label, { color: theme.text }]}>Notes (optional)</Text>
            <TextInput
              value={notes}
              onChangeText={setNotes}
              placeholder="e.g. Tuesday beginners"
              placeholderTextColor={theme.textMuted}
              style={[
                styles.input,
                { color: theme.text, borderColor: theme.border, backgroundColor: theme.surface },
              ]}
            />
          </View>

          <ScrollView contentContainerStyle={styles.pickerList}>
            {calendar.plans.length === 0 ? (
              <EmptyState
                title="No class plans yet"
                message="Create a plan first, then log it as taught."
              />
            ) : (
              calendar.plans.map((plan) => (
                <Pressable
                  key={plan.id}
                  accessibilityRole="button"
                  accessibilityLabel={`Log ${plan.title}`}
                  disabled={calendar.logging}
                  onPress={() => {
                    void calendar.logTaught(plan.id, notes).then((ok) => {
                      if (ok) {
                        setPickerOpen(false);
                        setNotes('');
                      }
                    });
                  }}
                  style={({ pressed }) => [
                    styles.planChoice,
                    {
                      backgroundColor: theme.surface,
                      borderColor: theme.border,
                      opacity: pressed || calendar.logging ? 0.75 : 1,
                    },
                  ]}
                >
                  <Text style={[styles.planTitle, { color: theme.text }]}>{plan.title}</Text>
                  <Text style={[styles.sectionMeta, { color: theme.textMuted }]}>
                    {plan.durationMinutes} min · {plan.items.length} poses
                  </Text>
                </Pressable>
              ))
            )}
          </ScrollView>
        </Screen>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
    gap: spacing.lg,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  monthNav: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthTitle: {
    ...typography.heading,
  },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  dayCopy: {
    flex: 1,
    gap: 2,
  },
  sectionTitle: {
    ...typography.heading,
  },
  sectionMeta: {
    ...typography.caption,
  },
  primaryButton: {
    borderRadius: 999,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
  },
  primaryLabel: {
    ...typography.caption,
    color: palette.white,
    fontWeight: '700',
  },
  list: {
    gap: spacing.sm,
    minHeight: 120,
  },
  recent: {
    gap: spacing.sm,
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
  pickerNotes: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    marginBottom: spacing.md,
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
  pickerList: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.sm,
  },
  planChoice: {
    borderWidth: 1,
    borderRadius: 14,
    padding: spacing.md,
    gap: 2,
  },
  planTitle: {
    ...typography.body,
    fontWeight: '600',
  },
});
