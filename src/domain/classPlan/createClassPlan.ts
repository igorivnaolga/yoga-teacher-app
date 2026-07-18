import type { ClassPlan, ClassPlanDraft, ClassPlanItem } from './types';
import { sortItemsByOrder } from './reorderItems';
import { validateClassPlan } from './validateClassPlan';

export type CreateClassPlanInput = ClassPlanDraft & {
  id: string;
  now?: string;
};

export function createClassPlanItem(input: {
  id: string;
  poseId: string;
  order?: number;
  durationSec?: number;
  cues?: string;
}): ClassPlanItem {
  return {
    id: input.id,
    poseId: input.poseId,
    order: input.order ?? 0,
    durationSec: input.durationSec,
    cues: input.cues?.trim() || undefined,
  };
}

export function createClassPlan(input: CreateClassPlanInput): ClassPlan {
  const errors = validateClassPlan(input);
  if (errors.length) {
    throw new Error(errors.map((error) => error.message).join(' '));
  }

  const now = input.now ?? new Date().toISOString();
  const items = sortItemsByOrder(input.items).map((item, index) => ({
    ...item,
    order: index,
    cues: item.cues?.trim() || undefined,
  }));

  return {
    id: input.id,
    title: input.title.trim(),
    level: input.level,
    durationMinutes: Math.round(input.durationMinutes),
    theme: input.theme?.trim() || undefined,
    notes: input.notes?.trim() || undefined,
    items,
    createdAt: now,
    updatedAt: now,
  };
}

export function updateClassPlan(
  existing: ClassPlan,
  draft: ClassPlanDraft,
  now = new Date().toISOString(),
): ClassPlan {
  const next = createClassPlan({
    ...draft,
    id: existing.id,
    now: existing.createdAt,
  });

  return {
    ...next,
    createdAt: existing.createdAt,
    updatedAt: now,
  };
}
