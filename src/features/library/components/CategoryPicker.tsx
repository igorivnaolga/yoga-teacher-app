import { Pressable, StyleSheet, Text, View } from 'react-native';

import { CATEGORY_LABELS, POSE_CATEGORIES, type PoseCategory } from '@/domain/pose';
import { useColorScheme } from '@/shared/hooks/useColorScheme';
import { colors, palette, spacing, typography } from '@/shared/theme';

type CategoryPickerProps = {
  value: readonly PoseCategory[];
  onChange: (categories: PoseCategory[]) => void;
};

export function CategoryPicker({ value, onChange }: CategoryPickerProps) {
  const scheme = useColorScheme();
  const theme = colors[scheme];
  const selected = new Set(value);

  const toggle = (category: PoseCategory) => {
    if (selected.has(category)) {
      onChange(value.filter((item) => item !== category));
      return;
    }
    onChange([...value, category]);
  };

  return (
    <View style={styles.wrap}>
      <Text style={[styles.hint, { color: theme.textMuted }]}>Select one or more</Text>
      <View style={styles.row} accessibilityRole="list">
        {POSE_CATEGORIES.map((category) => {
          const isSelected = selected.has(category);
          return (
            <Pressable
              key={category}
              onPress={() => toggle(category)}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: isSelected }}
              style={[
                styles.chip,
                {
                  backgroundColor: isSelected ? theme.tint : theme.surface,
                  borderColor: isSelected ? theme.tint : theme.border,
                },
              ]}
            >
              <Text style={[styles.label, { color: isSelected ? palette.white : theme.text }]}>
                {CATEGORY_LABELS[category]}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.sm,
  },
  hint: {
    ...typography.caption,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  label: {
    ...typography.caption,
    fontWeight: '600',
  },
});
