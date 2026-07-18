import { isValidDateKey } from './dateKeys';
import type { TaughtSessionDraft, TaughtSessionValidationError } from './types';

export function validateTaughtSession(
  draft: TaughtSessionDraft,
): TaughtSessionValidationError[] {
  const errors: TaughtSessionValidationError[] = [];

  if (!draft.classPlanId.trim()) {
    errors.push({ field: 'classPlanId', message: 'Choose a class plan.' });
  }

  if (!isValidDateKey(draft.date)) {
    errors.push({ field: 'date', message: 'Date must be a valid calendar day.' });
  }

  if (draft.notes && draft.notes.length > 500) {
    errors.push({ field: 'notes', message: 'Notes must be 500 characters or fewer.' });
  }

  return errors;
}
