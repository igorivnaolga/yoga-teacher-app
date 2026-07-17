import { filterPoses, getPoseById, listUniqueTags, type Pose, type PoseQuery } from '@/domain/pose';

import seedPoses from '@/data/seed/poses.json';

function asPoses(data: unknown): Pose[] {
  return data as Pose[];
}

export type PoseRepository = {
  list: (query?: PoseQuery) => Pose[];
  getById: (id: string) => Pose | undefined;
  listTags: () => string[];
  count: () => number;
};

export function createPoseRepository(poses: readonly Pose[] = asPoses(seedPoses)): PoseRepository {
  const catalog = [...poses];

  return {
    list(query = {}) {
      return filterPoses(catalog, query);
    },
    getById(id) {
      return getPoseById(catalog, id);
    },
    listTags() {
      return listUniqueTags(catalog);
    },
    count() {
      return catalog.length;
    },
  };
}

export const poseRepository = createPoseRepository();
