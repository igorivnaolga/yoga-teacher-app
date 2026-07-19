import { StyleSheet, Text, View } from 'react-native';

import type { PoseCategory } from '@/domain/pose';
import { getCategoryMark } from '@/features/library/poseIcons';
import { useColorScheme } from '@/shared/hooks/useColorScheme';
import { colors, typography } from '@/shared/theme';

type PoseIconProps = {
  category?: PoseCategory;
  size?: 'sm' | 'md' | 'lg';
};

const SIZE_MAP = {
  sm: { box: 32, fontSize: 11 },
  md: { box: 40, fontSize: 13 },
  lg: { box: 56, fontSize: 16 },
} as const;

/** Category badge shown next to poses (no vector-icon font). */
export function PoseIcon({ category, size = 'md' }: PoseIconProps) {
  const scheme = useColorScheme();
  const theme = colors[scheme];
  const dims = SIZE_MAP[size];

  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[
        styles.badge,
        {
          width: dims.box,
          height: dims.box,
          borderRadius: dims.box / 2,
          backgroundColor: scheme === 'light' ? '#E6F0EC' : '#2A3834',
        },
      ]}
    >
      <Text style={[styles.mark, { color: theme.tint, fontSize: dims.fontSize }]}>
        {getCategoryMark(category)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  mark: {
    ...typography.caption,
    fontWeight: '700',
  },
});
