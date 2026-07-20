import type { CourseDraft, CourseValidationError } from './types';

export function validateCourse(draft: CourseDraft): CourseValidationError[] {
  const errors: CourseValidationError[] = [];
  const title = draft.title.trim();

  if (!title) {
    errors.push({ field: 'title', message: 'Title is required.' });
  } else if (title.length > 80) {
    errors.push({ field: 'title', message: 'Title must be 80 characters or fewer.' });
  }

  if (draft.description && draft.description.trim().length > 500) {
    errors.push({
      field: 'description',
      message: 'Description must be 500 characters or fewer.',
    });
  }

  if (!draft.sessions.length) {
    errors.push({ field: 'sessions', message: 'Add at least one class plan to the course.' });
  }

  return errors;
}

export function isValidCourse(draft: CourseDraft): boolean {
  return validateCourse(draft).length === 0;
}
