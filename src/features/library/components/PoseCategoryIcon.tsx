import type { PoseCategory } from '@/domain/pose';

import { PoseIcon } from './PoseIcon';

type PoseCategoryIconProps = {
  category: PoseCategory;
  size?: 'sm' | 'md' | 'lg';
};

export function PoseCategoryIcon({ category, size = 'md' }: PoseCategoryIconProps) {
  return <PoseIcon category={category} size={size} />;
}
