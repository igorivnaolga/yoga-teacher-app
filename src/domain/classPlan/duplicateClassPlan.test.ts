import type { ClassPlan } from './types';
import { draftFromClassPlan, duplicateClassPlanDraft, duplicateTitle } from './duplicateClassPlan';

const plan: ClassPlan = {
  id: 'plan-1',
  title: 'Foundation — Week 1',
  level: 'beginner',
  durationMinutes: 60,
  theme: 'Breath',
  notes: 'Slow pace',
  items: [
    { id: 'item-a', poseId: 'pose-1', order: 1, cues: 'Soft knees' },
    { id: 'item-b', poseId: 'pose-2', order: 0 },
  ],
  createdAt: '2026-07-01T00:00:00.000Z',
  updatedAt: '2026-07-02T00:00:00.000Z',
};

describe('duplicateClassPlan', () => {
  it('builds a draft with new item ids and copy title', () => {
    let n = 0;
    const draft = duplicateClassPlanDraft(plan, () => `new_${++n}`);

    expect(draft.title).toBe('Foundation — Week 1 (copy)');
    expect(draft.level).toBe('beginner');
    expect(draft.items).toHaveLength(2);
    expect(draft.items.map((item) => item.id)).toEqual(['new_1', 'new_2']);
    expect(draft.items.map((item) => item.poseId)).toEqual(['pose-2', 'pose-1']);
    expect(draft.items[0]?.cues).toBeUndefined();
    expect(draft.items[1]?.cues).toBe('Soft knees');
  });

  it('truncates long titles so the copy suffix fits', () => {
    const long = 'A'.repeat(80);
    expect(duplicateTitle(long).length).toBeLessThanOrEqual(80);
    expect(duplicateTitle(long).endsWith(' (copy)')).toBe(true);
  });

  it('draftFromClassPlan preserves fields', () => {
    expect(draftFromClassPlan(plan)).toMatchObject({
      title: 'Foundation — Week 1',
      theme: 'Breath',
      notes: 'Slow pace',
    });
  });
});
