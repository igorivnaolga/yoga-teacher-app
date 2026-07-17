import { useMemo, useState } from 'react';

import { poseRepository } from '@/data';
import {
  CATEGORY_LABELS,
  POSE_CATEGORIES,
  type Pose,
  type PoseCategory,
  type PoseQuery,
} from '@/domain/pose';

export type CategoryFilter = PoseCategory | 'all';

export function usePoseLibrary() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<CategoryFilter>('all');

  const query: PoseQuery = useMemo(
    () => ({
      search,
      category,
    }),
    [search, category],
  );

  const poses: Pose[] = useMemo(() => poseRepository.list(query), [query]);
  const totalCount = poseRepository.count();

  const categories = useMemo(
    () =>
      (['all', ...POSE_CATEGORIES] as const).map((value) => ({
        value,
        label: value === 'all' ? 'All' : CATEGORY_LABELS[value],
      })),
    [],
  );

  return {
    search,
    setSearch,
    category,
    setCategory,
    categories,
    poses,
    totalCount,
    resultCount: poses.length,
  };
}
