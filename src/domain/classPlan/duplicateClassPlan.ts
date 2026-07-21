import type { ClassPlan, ClassPlanDraft, ClassPlanItem } from './types';

const TITLE_MAX = 80;
const COPY_SUFFIX = ' (copy)';

export function draftFromClassPlan(plan: ClassPlan): ClassPlanDraft {
  return {
    title: plan.title,
    level: plan.level,
    durationMinutes: plan.durationMinutes,
    theme: plan.theme ?? '',
    notes: plan.notes ?? '',
    items: [...plan.items].sort((a, b) => a.order - b.order),
  };
}

export function duplicateTitle(title: string): string {
  const base = title.trim();
  const withSuffix = `${base}${COPY_SUFFIX}`;
  if (withSuffix.length <= TITLE_MAX) return withSuffix;
  const trimmedBase = base.slice(0, Math.max(0, TITLE_MAX - COPY_SUFFIX.length)).trimEnd();
  return `${trimmedBase}${COPY_SUFFIX}`;
}

export function duplicateClassPlanDraft(
  plan: ClassPlan,
  createItemId: () => string,
): ClassPlanDraft {
  const draft = draftFromClassPlan(plan);
  const items: ClassPlanItem[] = draft.items.map((item, index) => ({
    ...item,
    id: createItemId(),
    order: index,
  }));

  return {
    ...draft,
    title: duplicateTitle(draft.title),
    items,
  };
}
