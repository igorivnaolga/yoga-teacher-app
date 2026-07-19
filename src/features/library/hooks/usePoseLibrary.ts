import { useCallback, useEffect, useMemo, useState } from 'react';

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
  const [ready, setReady] = useState(false);
  const [version, setVersion] = useState(0);

  const refresh = useCallback(() => {
    setVersion((value) => value + 1);
  }, []);

  useEffect(() => {
    let active = true;
    void poseRepository.ready().then(() => {
      if (active) {
        setReady(true);
        refresh();
      }
    });
    return () => {
      active = false;
    };
  }, [refresh]);

  const query: PoseQuery = useMemo(
    () => ({
      search,
      category,
    }),
    [search, category],
  );

  const poses: Pose[] = useMemo(() => {
    if (!ready) return [];
    return poseRepository.list(query);
  }, [query, ready, version]);

  const totalCount = ready ? poseRepository.count() : 0;

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
    ready,
    refresh,
  };
}
