import { CLASS_PLAN_LEVELS, type ClassPlanDraft, type ClassPlanValidationError } from './types';

export function validateClassPlan(draft: ClassPlanDraft): ClassPlanValidationError[] {
  const errors: ClassPlanValidationError[] = [];
  const title = draft.title.trim();

  if (!title) {
    errors.push({ field: 'title', message: 'Title is required.' });
  } else if (title.length > 80) {
    errors.push({ field: 'title', message: 'Title must be 80 characters or fewer.' });
  }

  if (!CLASS_PLAN_LEVELS.includes(draft.level)) {
    errors.push({ field: 'level', message: 'Level is invalid.' });
  }

  if (!Number.isFinite(draft.durationMinutes) || draft.durationMinutes <= 0) {
    errors.push({ field: 'durationMinutes', message: 'Duration must be greater than 0.' });
  } else if (draft.durationMinutes > 240) {
    errors.push({
      field: 'durationMinutes',
      message: 'Duration must be 240 minutes or fewer.',
    });
  }

  if (!draft.items.length) {
    errors.push({ field: 'items', message: 'Add at least one pose to the plan.' });
  }

  return errors;
}

export function isValidClassPlan(draft: ClassPlanDraft): boolean {
  return validateClassPlan(draft).length === 0;
}
