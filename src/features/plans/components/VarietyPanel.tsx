import { StyleSheet, Text, View } from 'react-native';

import type { VarietyAnalysis } from '@/domain/variety';
import { useColorScheme } from '@/shared/hooks/useColorScheme';
import { colors, spacing, typography } from '@/shared/theme';

type MatchSummary = {
  sessionId: string;
  label: string;
  kind: 'exact' | 'partial';
};

type VarietyPanelProps = {
  analysis: VarietyAnalysis;
  matchSummaries: MatchSummary[];
  hasHistory: boolean;
  loading?: boolean;
};

const LEVEL_COPY: Record<VarietyAnalysis['overlapLevel'], string> = {
  none: 'Sequence looks different from recent classes on this weekday. Reusing poses is fine.',
  low: 'A short ordered stretch matches a past class on this weekday.',
  medium: 'A longer ordered stretch matches a past class on this weekday. Consider reshuffling.',
  high: 'This sequence (or a large stretch of it) matches a past class on this weekday.',
};

export function VarietyPanel({
  analysis,
  matchSummaries,
  hasHistory,
  loading,
}: VarietyPanelProps) {
  const scheme = useColorScheme();
  const theme = colors[scheme];

  if (loading) {
    return null;
  }

  if (!hasHistory) {
    return (
      <View style={[styles.panel, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Text style={[styles.title, { color: theme.text }]}>Variety helper</Text>
        <Text style={[styles.body, { color: theme.textMuted }]}>
          Comparing sequences for {analysis.weekdayLabel}s. Log a class on this weekday to start
          tracking repeats. Individual poses can be reused — repeated order is what we flag.
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.panel, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <Text style={[styles.title, { color: theme.text }]}>Variety helper</Text>
      <Text style={[styles.body, { color: theme.textMuted }]}>
        Checking ordered sequences against your last {analysis.sessionWindow}{' '}
        {analysis.weekdayLabel}
        {analysis.sessionWindow === 1 ? '' : 's'}. Poses may repeat; matching order is the concern.
      </Text>
      <Text
        style={[
          styles.status,
          {
            color:
              analysis.overlapLevel === 'high' || analysis.overlapLevel === 'medium'
                ? theme.danger
                : theme.tintMuted,
          },
        ]}
      >
        {LEVEL_COPY[analysis.overlapLevel]}
      </Text>

      {analysis.exactSequenceRepeated ? (
        <Text style={[styles.body, { color: theme.danger }]}>
          Exact sequence already taught on a previous {analysis.weekdayLabel}.
        </Text>
      ) : null}

      {matchSummaries.length > 0 ? (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Matches</Text>
          {matchSummaries.map((match) => (
            <Text
              key={match.sessionId + match.label}
              style={[
                styles.body,
                { color: match.kind === 'exact' ? theme.danger : theme.text },
              ]}
            >
              {match.label}
            </Text>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    borderWidth: 1,
    borderRadius: 14,
    padding: spacing.md,
    gap: spacing.sm,
  },
  title: {
    ...typography.heading,
    fontSize: 18,
  },
  body: {
    ...typography.caption,
  },
  status: {
    ...typography.body,
    fontWeight: '600',
  },
  section: {
    marginTop: spacing.xs,
    gap: spacing.sm,
  },
  sectionTitle: {
    ...typography.caption,
    fontWeight: '700',
  },
});
