import { Pressable, StyleSheet, Text, View } from 'react-native';

import {
  CLASS_PLAN_LEVELS,
  CLASS_PLAN_LEVEL_LABELS,
  type ClassPlanLevel,
} from '@/domain/classPlan';
import { useColorScheme } from '@/shared/hooks/useColorScheme';
import { colors, palette, spacing, typography } from '@/shared/theme';

type LevelPickerProps = {
  value: ClassPlanLevel;
  onChange: (level: ClassPlanLevel) => void;
};

export function LevelPicker({ value, onChange }: LevelPickerProps) {
  const scheme = useColorScheme();
  const theme = colors[scheme];

  return (
    <View style={styles.row} accessibilityRole="radiogroup">
      {CLASS_PLAN_LEVELS.map((level) => {
        const selected = level === value;
        return (
          <Pressable
            key={level}
            onPress={() => onChange(level)}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            style={[
              styles.chip,
              {
                backgroundColor: selected ? theme.tint : theme.surface,
                borderColor: selected ? theme.tint : theme.border,
              },
            ]}
          >
            <Text style={[styles.label, { color: selected ? palette.white : theme.text }]}>
              {CLASS_PLAN_LEVEL_LABELS[level]}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
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
