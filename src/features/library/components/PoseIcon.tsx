import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, View } from 'react-native';

import type { PoseCategory } from '@/domain/pose';
import { StickFigureSvg, resolvePoseArt } from '@/features/library/poseArt';
import { getPoseIconName } from '@/features/library/poseIcons';
import { useColorScheme } from '@/shared/hooks/useColorScheme';
import { colors } from '@/shared/theme';

type PoseIconProps = {
  poseId: string;
  category?: PoseCategory;
  size?: 'sm' | 'md' | 'lg';
};

const SIZE_MAP = {
  sm: { box: 32, figure: 26, icon: 16, stroke: 2.4 },
  md: { box: 40, figure: 32, icon: 20, stroke: 2.25 },
  lg: { box: 56, figure: 46, icon: 28, stroke: 2.1 },
} as const;

export function PoseIcon({ poseId, category, size = 'md' }: PoseIconProps) {
  const scheme = useColorScheme();
  const theme = colors[scheme];
  const dims = SIZE_MAP[size];
  const art = resolvePoseArt(poseId);

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
      {art.kind === 'svg' ? (
        <StickFigureSvg
          joints={art.joints}
          color={theme.tint}
          size={dims.figure}
          strokeWidth={dims.stroke}
        />
      ) : (
        <Ionicons
          name={getPoseIconName(poseId, category)}
          size={dims.icon}
          color={theme.tint}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});
