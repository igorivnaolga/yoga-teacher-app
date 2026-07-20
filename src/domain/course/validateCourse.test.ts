import { emptyCourseDraft } from './createCourse';
import { validateCourse } from './validateCourse';

describe('validateCourse', () => {
  it('requires title and at least one session', () => {
    const errors = validateCourse(emptyCourseDraft());
    expect(errors.some((error) => error.field === 'title')).toBe(true);
    expect(errors.some((error) => error.field === 'sessions')).toBe(true);
  });

  it('accepts a minimal valid course', () => {
    expect(
      validateCourse({
        title: 'Foundation',
        sessions: [{ id: 's1', classPlanId: 'plan-a', order: 0 }],
      }),
    ).toEqual([]);
  });
});
