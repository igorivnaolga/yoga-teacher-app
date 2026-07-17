import { StyleSheet, TextInput, View } from 'react-native';

import { useColorScheme } from '@/shared/hooks/useColorScheme';
import { colors, spacing, typography } from '@/shared/theme';

type PoseSearchBarProps = {
  value: string;
  onChangeText: (value: string) => void;
};

export function PoseSearchBar({ value, onChangeText }: PoseSearchBarProps) {
  const scheme = useColorScheme();
  const theme = colors[scheme];

  return (
    <View style={[styles.wrap, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Search poses, Sanskrit, tags…"
        placeholderTextColor={theme.textMuted}
        autoCapitalize="none"
        autoCorrect={false}
        clearButtonMode="while-editing"
        accessibilityLabel="Search poses"
        style={[styles.input, { color: theme.text }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  input: {
    ...typography.body,
    padding: 0,
  },
});
