import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

import type { CategoryFilter } from '@/features/library/hooks/usePoseLibrary';
import { useColorScheme } from '@/shared/hooks/useColorScheme';
import { colors, palette, spacing, typography } from '@/shared/theme';

type CategoryOption = {
  value: CategoryFilter;
  label: string;
};

type CategoryChipsProps = {
  options: CategoryOption[];
  selected: CategoryFilter;
  onSelect: (value: CategoryFilter) => void;
};

export function CategoryChips({ options, selected, onSelect }: CategoryChipsProps) {
  const scheme = useColorScheme();
  const theme = colors[scheme];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
      accessibilityRole="tablist"
    >
      {options.map((option) => {
        const isSelected = option.value === selected;
        return (
          <Pressable
            key={option.value}
            onPress={() => onSelect(option.value)}
            accessibilityRole="tab"
            accessibilityState={{ selected: isSelected }}
            style={[
              styles.chip,
              {
                backgroundColor: isSelected ? theme.tint : theme.surface,
                borderColor: isSelected ? theme.tint : theme.border,
              },
            ]}
          >
            <Text
              style={[
                styles.label,
                { color: isSelected ? palette.white : theme.text },
              ]}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: spacing.sm,
    paddingVertical: spacing.xs,
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
