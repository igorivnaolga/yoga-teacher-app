import type { PoseCategory } from '@/domain/pose';

import { PoseIcon } from './PoseIcon';

type PoseCategoryIconProps = {
  category: PoseCategory;
  poseId?: string;
  size?: 'sm' | 'md' | 'lg';
};

/** @deprecated Prefer PoseIcon with poseId. Kept for category-only call sites. */
export function PoseCategoryIcon({ category, poseId, size = 'md' }: PoseCategoryIconProps) {
  return <PoseIcon poseId={poseId ?? `__category_${category}`} category={category} size={size} />;
}
