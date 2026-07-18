import { createMemoryStore } from '@/data/storage/memoryStore';

import { createClassPlanRepository } from './classPlanRepository';

const draft = {
  title: 'Foundation Week 1',
  level: 'beginner' as const,
  durationMinutes: 60,
  theme: 'Breath',
  items: [{ id: 'i1', poseId: 'mountain', order: 0 }],
};

describe('classPlanRepository', () => {
  it('creates, lists, updates, and deletes plans', async () => {
    const repo = createClassPlanRepository(createMemoryStore());

    const created = await repo.create(draft, 'plan-a');
    expect(created.id).toBe('plan-a');
    expect(await repo.list()).toHaveLength(1);

    const updated = await repo.update('plan-a', {
      ...draft,
      title: 'Foundation Week 1 Revised',
      items: [
        { id: 'i1', poseId: 'mountain', order: 0 },
        { id: 'i2', poseId: 'tree', order: 1 },
      ],
    });
    expect(updated.title).toBe('Foundation Week 1 Revised');
    expect(updated.items).toHaveLength(2);

    const fetched = await repo.getById('plan-a');
    expect(fetched?.title).toBe('Foundation Week 1 Revised');

    await repo.remove('plan-a');
    expect(await repo.list()).toHaveLength(0);
    expect(await repo.getById('plan-a')).toBeUndefined();
  });

  it('rejects invalid creates', async () => {
    const repo = createClassPlanRepository(createMemoryStore());
    await expect(
      repo.create({
        ...draft,
        title: '',
      }),
    ).rejects.toThrow(/Title is required/);
  });

  it('throws when updating a missing plan', async () => {
    const repo = createClassPlanRepository(createMemoryStore());
    await expect(repo.update('missing', draft)).rejects.toThrow(/not found/);
  });
});
