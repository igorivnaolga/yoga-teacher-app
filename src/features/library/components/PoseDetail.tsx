import { StyleSheet, Text, View } from 'react-native';

import { CATEGORY_LABELS, type Pose } from '@/domain/pose';
import { PoseIcon } from '@/features/library/components/PoseIcon';
import { useColorScheme } from '@/shared/hooks/useColorScheme';
import { colors, spacing, typography } from '@/shared/theme';

type PoseDetailProps = {
  pose: Pose;
};

export function PoseDetail({ pose }: PoseDetailProps) {
  const scheme = useColorScheme();
  const theme = colors[scheme];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <PoseIcon poseId={pose.id} category={pose.category} size="lg" />
        <View style={styles.headerCopy}>
          <Text style={[styles.name, { color: theme.text }]}>{pose.name}</Text>
          {pose.sanskrit ? (
            <Text style={[styles.sanskrit, { color: theme.textMuted }]}>{pose.sanskrit}</Text>
          ) : null}
        </View>
      </View>

      <View style={styles.metaRow}>
        <MetaPill label={CATEGORY_LABELS[pose.category]} />
        <MetaPill label={pose.difficulty} />
      </View>

      {pose.cues ? (
        <View style={[styles.section, { borderColor: theme.border, backgroundColor: theme.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Teaching cues</Text>
          <Text style={[styles.sectionBody, { color: theme.textMuted }]}>{pose.cues}</Text>
        </View>
      ) : null}

      <View style={[styles.section, { borderColor: theme.border, backgroundColor: theme.surface }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Tags</Text>
        <View style={styles.tags}>
          {pose.tags.map((tag) => (
            <View
              key={tag}
              style={[styles.tag, { borderColor: theme.border, backgroundColor: theme.background }]}
            >
              <Text style={[styles.tagLabel, { color: theme.tintMuted }]}>{tag}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

function MetaPill({ label }: { label: string }) {
  const scheme = useColorScheme();
  const theme = colors[scheme];

  return (
    <View style={[styles.pill, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <Text style={[styles.pillLabel, { color: theme.text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  headerCopy: {
    flex: 1,
    gap: 2,
  },
  name: {
    ...typography.title,
  },
  sanskrit: {
    ...typography.body,
    fontStyle: 'italic',
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  pill: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  pillLabel: {
    ...typography.caption,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  section: {
    borderWidth: 1,
    borderRadius: 14,
    padding: spacing.md,
    gap: spacing.sm,
  },
  sectionTitle: {
    ...typography.heading,
    fontSize: 18,
  },
  sectionBody: {
    ...typography.body,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  tag: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
  },
  tagLabel: {
    ...typography.caption,
  },
});
