import { uniqueCategories } from './categories';
import { POSE_DIFFICULTIES, type PoseDraft, type PoseValidationError } from './types';

export function validatePoseDraft(draft: PoseDraft): PoseValidationError[] {
  const errors: PoseValidationError[] = [];
  const name = draft.name.trim();

  if (!name) {
    errors.push({ field: 'name', message: 'Name is required.' });
  } else if (name.length > 80) {
    errors.push({ field: 'name', message: 'Name must be 80 characters or fewer.' });
  }

  if (draft.sanskrit && draft.sanskrit.trim().length > 80) {
    errors.push({ field: 'sanskrit', message: 'Sanskrit name must be 80 characters or fewer.' });
  }

  const categories = uniqueCategories(draft.categories);
  if (!categories.length) {
    errors.push({ field: 'categories', message: 'Select at least one category.' });
  }

  if (!POSE_DIFFICULTIES.includes(draft.difficulty)) {
    errors.push({ field: 'difficulty', message: 'Difficulty is invalid.' });
  }

  if (draft.cues && draft.cues.trim().length > 1000) {
    errors.push({ field: 'cues', message: 'Cues must be 1000 characters or fewer.' });
  }

  if (draft.tags.length > 12) {
    errors.push({ field: 'tags', message: 'Use 12 tags or fewer.' });
  }

  for (const tag of draft.tags) {
    if (tag.trim().length > 30) {
      errors.push({ field: 'tags', message: 'Each tag must be 30 characters or fewer.' });
      break;
    }
  }

  return errors;
}

export function isValidPoseDraft(draft: PoseDraft): boolean {
  return validatePoseDraft(draft).length === 0;
}
