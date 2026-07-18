import { createClassPlan, updateClassPlan } from './createClassPlan';
import { validateClassPlan } from './validateClassPlan';

const validDraft = {
  title: 'Morning Flow',
  level: 'beginner' as const,
  durationMinutes: 60,
  theme: 'Grounding',
  items: [{ id: 'i1', poseId: 'mountain', order: 0 }],
};

describe('validateClassPlan', () => {
  it('accepts a valid draft', () => {
    expect(validateClassPlan(validDraft)).toEqual([]);
  });

  it('rejects missing title and empty items', () => {
    const errors = validateClassPlan({
      ...validDraft,
      title: '   ',
      items: [],
    });
    expect(errors.map((error) => error.field)).toEqual(['title', 'items']);
  });

  it('rejects invalid duration', () => {
    expect(validateClassPlan({ ...validDraft, durationMinutes: 0 })[0]?.field).toBe(
      'durationMinutes',
    );
  });
});

describe('createClassPlan', () => {
  it('creates a normalized plan', () => {
    const plan = createClassPlan({
      ...validDraft,
      id: 'plan-1',
      now: '2026-07-18T10:00:00.000Z',
      title: '  Morning Flow  ',
    });

    expect(plan.title).toBe('Morning Flow');
    expect(plan.createdAt).toBe('2026-07-18T10:00:00.000Z');
    expect(plan.items[0]?.order).toBe(0);
  });

  it('throws when invalid', () => {
    expect(() =>
      createClassPlan({
        ...validDraft,
        id: 'bad',
        title: '',
      }),
    ).toThrow(/Title is required/);
  });

  it('preserves createdAt on update', () => {
    const existing = createClassPlan({
      ...validDraft,
      id: 'plan-1',
      now: '2026-07-01T00:00:00.000Z',
    });
    const updated = updateClassPlan(
      existing,
      { ...validDraft, title: 'Evening Flow' },
      '2026-07-18T12:00:00.000Z',
    );

    expect(updated.title).toBe('Evening Flow');
    expect(updated.createdAt).toBe('2026-07-01T00:00:00.000Z');
    expect(updated.updatedAt).toBe('2026-07-18T12:00:00.000Z');
  });
});
