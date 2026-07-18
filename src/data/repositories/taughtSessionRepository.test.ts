import { createMemoryStore } from '@/data/storage/memoryStore';

import { createTaughtSessionRepository } from './taughtSessionRepository';

describe('taughtSessionRepository', () => {
  it('creates sessions and queries by date / range', async () => {
    const repo = createTaughtSessionRepository(createMemoryStore());

    await repo.create(
      { classPlanId: 'plan-a', date: '2026-07-10', notes: 'Morning' },
      's1',
    );
    await repo.create({ classPlanId: 'plan-b', date: '2026-07-10' }, 's2');
    await repo.create({ classPlanId: 'plan-a', date: '2026-07-12' }, 's3');

    expect((await repo.listByDate('2026-07-10')).map((s) => s.id)).toEqual(['s1', 's2']);
    expect(
      (await repo.listByDateRange('2026-07-11', '2026-07-12')).map((s) => s.id),
    ).toEqual(['s3']);
    expect((await repo.listRecent(2)).map((s) => s.id)).toEqual(['s3', 's2']);

    await repo.remove('s2');
    expect((await repo.listByDate('2026-07-10')).map((s) => s.id)).toEqual(['s1']);
  });

  it('rejects invalid drafts', async () => {
    const repo = createTaughtSessionRepository(createMemoryStore());
    await expect(
      repo.create({ classPlanId: '', date: '2026-07-18' }),
    ).rejects.toThrow(/Choose a class plan/);
  });
});
