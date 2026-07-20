import { createMemoryStore } from '@/data/storage/memoryStore';

import { createCourseRepository } from './courseRepository';

describe('courseRepository', () => {
  it('creates, lists, updates, and removes courses', async () => {
    const repo = createCourseRepository(createMemoryStore());

    const created = await repo.create({
      title: 'Foundation',
      description: 'Eight-week path',
      sessions: [
        { id: 's1', classPlanId: 'plan-a', order: 0, label: 'Week 1' },
        { id: 's2', classPlanId: 'plan-b', order: 1, label: 'Week 2' },
      ],
    });

    expect(created.id.startsWith('course_')).toBe(true);
    expect(await repo.list()).toHaveLength(1);
    expect((await repo.getById(created.id))?.title).toBe('Foundation');

    const updated = await repo.update(created.id, {
      title: 'Foundation+',
      description: 'Refined path',
      sessions: [{ id: 's1', classPlanId: 'plan-a', order: 0 }],
    });
    expect(updated.title).toBe('Foundation+');
    expect(updated.sessions).toHaveLength(1);

    await repo.remove(created.id);
    expect(await repo.list()).toHaveLength(0);
  });
});
