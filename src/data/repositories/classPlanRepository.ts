import {
  createClassPlan,
  updateClassPlan,
  type ClassPlan,
  type ClassPlanDraft,
} from '@/domain/classPlan';

import { asyncStorageStore } from '@/data/storage/asyncStorageStore';
import type { KeyValueStore } from '@/data/storage/keyValueStore';

const STORAGE_KEY = 'yoga-teacher.classPlans.v1';

export type ClassPlanRepository = {
  list: () => Promise<ClassPlan[]>;
  getById: (id: string) => Promise<ClassPlan | undefined>;
  create: (draft: ClassPlanDraft, id?: string) => Promise<ClassPlan>;
  update: (id: string, draft: ClassPlanDraft) => Promise<ClassPlan>;
  remove: (id: string) => Promise<void>;
  replaceAll: (plans: readonly ClassPlan[]) => Promise<void>;
  clear: () => Promise<void>;
};

function createId(): string {
  return `plan_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function createClassPlanRepository(store: KeyValueStore = asyncStorageStore): ClassPlanRepository {
  async function readAll(): Promise<ClassPlan[]> {
    const raw = await store.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    try {
      const parsed = JSON.parse(raw) as ClassPlan[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  async function writeAll(plans: ClassPlan[]): Promise<void> {
    await store.setItem(STORAGE_KEY, JSON.stringify(plans));
  }

  return {
    async list() {
      const plans = await readAll();
      return [...plans].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    },

    async getById(id) {
      const plans = await readAll();
      return plans.find((plan) => plan.id === id);
    },

    async create(draft, id = createId()) {
      const plan = createClassPlan({ ...draft, id });
      const plans = await readAll();
      await writeAll([plan, ...plans]);
      return plan;
    },

    async update(id, draft) {
      const plans = await readAll();
      const existing = plans.find((plan) => plan.id === id);
      if (!existing) {
        throw new Error(`Class plan not found: ${id}`);
      }
      const updated = updateClassPlan(existing, draft);
      await writeAll(plans.map((plan) => (plan.id === id ? updated : plan)));
      return updated;
    },

    async remove(id) {
      const plans = await readAll();
      await writeAll(plans.filter((plan) => plan.id !== id));
    },

    async replaceAll(plans) {
      await writeAll([...plans]);
    },

    async clear() {
      await store.removeItem(STORAGE_KEY);
    },
  };
}

export const classPlanRepository = createClassPlanRepository();
