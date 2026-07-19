import { Pressable, StyleSheet, Text, View } from 'react-native';

import { POSE_DIFFICULTIES, type PoseDifficulty } from '@/domain/pose';
import { useColorScheme } from '@/shared/hooks/useColorScheme';
import { colors, palette, spacing, typography } from '@/shared/theme';

type DifficultyPickerProps = {
  value: PoseDifficulty;
  onChange: (difficulty: PoseDifficulty) => void;
};

export function DifficultyPicker({ value, onChange }: DifficultyPickerProps) {
  const scheme = useColorScheme();
  const theme = colors[scheme];

  return (
    <View style={styles.row} accessibilityRole="radiogroup">
      {POSE_DIFFICULTIES.map((difficulty) => {
        const selected = difficulty === value;
        return (
          <Pressable
            key={difficulty}
            onPress={() => onChange(difficulty)}
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
            <Text
              style={[
                styles.label,
                { color: selected ? palette.white : theme.text, textTransform: 'capitalize' },
              ]}
            >
              {difficulty}
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
