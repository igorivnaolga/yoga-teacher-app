import type { PoseDraft } from '@/domain/pose';
import { createMemoryStore } from '@/data/storage/memoryStore';

import { createPoseRepository, poseRepository } from './poseRepository';

const validDraft: PoseDraft = {
  name: 'Moon Reach',
  sanskrit: '',
  categories: ['standing', 'twist'],
  difficulty: 'beginner',
  tags: ['custom', 'side body'],
  cues: 'Reach up and over.',
};

describe('poseRepository', () => {
  it('loads the seed catalog with a useful size', () => {
    expect(poseRepository.count()).toBeGreaterThanOrEqual(80);
  });

  it('lists all seed poses by default', () => {
    expect(poseRepository.list()).toHaveLength(poseRepository.count());
  });

  it('gets a known seed pose by id and normalizes categories', () => {
    const mountain = poseRepository.getById('mountain');
    expect(mountain?.name).toBe('Mountain Pose');
    expect(mountain?.categories).toEqual(['standing']);
    expect(mountain?.custom).toBe(false);
  });

  it('searches the seed catalog', () => {
    const results = poseRepository.list({ search: 'warrior' });
    expect(results.length).toBeGreaterThanOrEqual(3);
    expect(results.some((pose) => pose.id === 'warrior-1')).toBe(true);
  });

  it('filters seed poses by category', () => {
    const restorative = poseRepository.list({ category: 'restorative' });
    expect(restorative.length).toBeGreaterThan(0);
    expect(restorative.every((pose) => pose.categories.includes('restorative'))).toBe(true);
  });

  it('lists unique tags from seed data', () => {
    const tags = poseRepository.listTags();
    expect(tags).toContain('hips');
  });

  it('supports an injected seed catalog for isolation', () => {
    const repo = createPoseRepository(
      [
        {
          id: 'only',
          name: 'Only Pose',
          category: 'seated',
          difficulty: 'beginner',
          tags: ['test'],
        },
      ],
      createMemoryStore(),
    );

    expect(repo.count()).toBe(1);
    expect(repo.list({ search: 'only' })[0]?.id).toBe('only');
    expect(repo.list({ search: 'only' })[0]?.categories).toEqual(['seated']);
  });

  it('creates, updates, and removes custom poses with multiple categories', async () => {
    const store = createMemoryStore();
    const repo = createPoseRepository([], store);

    await repo.ready();
    expect(repo.count()).toBe(0);

    const created = await repo.createCustom(validDraft);
    expect(created.custom).toBe(true);
    expect(created.categories).toEqual(['standing', 'twist']);
    expect(repo.count()).toBe(1);

    const updated = await repo.updateCustom(created.id, {
      ...validDraft,
      name: 'Moon Reach II',
      categories: ['balance', 'standing'],
    });
    expect(updated.name).toBe('Moon Reach II');
    expect(repo.getById(created.id)?.categories).toEqual(['balance', 'standing']);

    await repo.removeCustom(created.id);
    expect(repo.getById(created.id)).toBeUndefined();

    const createdAgain = await repo.createCustom(validDraft);
    const reloaded = createPoseRepository([], store);
    await reloaded.ready();
    expect(reloaded.getById(createdAgain.id)?.categories).toEqual(['standing', 'twist']);
  });

  it('does not allow updating seed poses via updateCustom', async () => {
    const store = createMemoryStore();
    const repo = createPoseRepository(
      [
        {
          id: 'mountain',
          name: 'Mountain Pose',
          category: 'standing',
          difficulty: 'beginner',
          tags: [],
        },
      ],
      store,
    );

    await expect(repo.updateCustom('mountain', validDraft)).rejects.toThrow(/not found/i);
  });
});
