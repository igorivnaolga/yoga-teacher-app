import {
  createCustomPose,
  filterPoses,
  getPoseById,
  isCustomPoseId,
  listUniqueTags,
  normalizePose,
  updateCustomPose,
  type Pose,
  type PoseDraft,
  type PoseQuery,
} from '@/domain/pose';

import seedPoses from '@/data/seed/poses.json';
import { asyncStorageStore } from '@/data/storage/asyncStorageStore';
import type { KeyValueStore } from '@/data/storage/keyValueStore';

const STORAGE_KEY = 'yoga-teacher.customPoses.v1';

function createCustomId(): string {
  return `custom_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function asNormalizedPoses(data: unknown): Pose[] {
  if (!Array.isArray(data)) return [];
  return data.map((item) => normalizePose(item as Record<string, unknown> & { id: string; name: string }));
}

export type PoseRepository = {
  ready: () => Promise<void>;
  list: (query?: PoseQuery) => Pose[];
  getById: (id: string) => Pose | undefined;
  listTags: () => string[];
  count: () => number;
  isCustom: (id: string) => boolean;
  createCustom: (draft: PoseDraft) => Promise<Pose>;
  updateCustom: (id: string, draft: PoseDraft) => Promise<Pose>;
  removeCustom: (id: string) => Promise<void>;
  clearCustom: () => Promise<void>;
};

export function createPoseRepository(
  seed: readonly Pose[] | unknown = seedPoses,
  store: KeyValueStore = asyncStorageStore,
): PoseRepository {
  const seedCatalog = asNormalizedPoses(seed).map((pose) => ({ ...pose, custom: false }));
  let customCatalog: Pose[] = [];
  let readyPromise: Promise<void> | undefined;

  async function readCustom(): Promise<Pose[]> {
    const raw = await store.getItem(STORAGE_KEY);
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw) as unknown[];
      if (!Array.isArray(parsed)) return [];
      return asNormalizedPoses(parsed)
        .filter((pose) => isCustomPoseId(pose.id))
        .map((pose) => ({ ...pose, custom: true }));
    } catch {
      return [];
    }
  }

  async function writeCustom(poses: Pose[]): Promise<void> {
    await store.setItem(STORAGE_KEY, JSON.stringify(poses));
  }

  function catalog(): Pose[] {
    return [...customCatalog, ...seedCatalog];
  }

  return {
    ready() {
      if (!readyPromise) {
        readyPromise = readCustom().then((poses) => {
          customCatalog = poses;
        });
      }
      return readyPromise;
    },

    list(query = {}) {
      return filterPoses(catalog(), query);
    },

    getById(id) {
      return getPoseById(catalog(), id);
    },

    listTags() {
      return listUniqueTags(catalog());
    },

    count() {
      return catalog().length;
    },

    isCustom(id) {
      return customCatalog.some((pose) => pose.id === id) || isCustomPoseId(id);
    },

    async createCustom(draft) {
      await this.ready();
      const pose = createCustomPose({ ...draft, id: createCustomId() });
      customCatalog = [pose, ...customCatalog];
      await writeCustom(customCatalog);
      return pose;
    },

    async updateCustom(id, draft) {
      await this.ready();
      const existing = customCatalog.find((pose) => pose.id === id);
      if (!existing) {
        throw new Error(`Custom pose not found: ${id}`);
      }
      const updated = updateCustomPose(existing, draft);
      customCatalog = customCatalog.map((pose) => (pose.id === id ? updated : pose));
      await writeCustom(customCatalog);
      return updated;
    },

    async removeCustom(id) {
      await this.ready();
      if (!customCatalog.some((pose) => pose.id === id)) {
        throw new Error(`Custom pose not found: ${id}`);
      }
      customCatalog = customCatalog.filter((pose) => pose.id !== id);
      await writeCustom(customCatalog);
    },

    async clearCustom() {
      customCatalog = [];
      await store.removeItem(STORAGE_KEY);
    },
  };
}

export const poseRepository = createPoseRepository();
