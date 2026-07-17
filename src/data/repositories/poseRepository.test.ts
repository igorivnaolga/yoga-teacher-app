import { createPoseRepository } from './poseRepository';
import { poseRepository } from './poseRepository';

describe('poseRepository', () => {
  it('loads the seed catalog with a useful size', () => {
    expect(poseRepository.count()).toBeGreaterThanOrEqual(80);
  });

  it('lists all seed poses by default', () => {
    expect(poseRepository.list()).toHaveLength(poseRepository.count());
  });

  it('gets a known seed pose by id', () => {
    const mountain = poseRepository.getById('mountain');
    expect(mountain?.name).toBe('Mountain Pose');
    expect(mountain?.category).toBe('standing');
  });

  it('searches the seed catalog', () => {
    const results = poseRepository.list({ search: 'warrior' });
    expect(results.length).toBeGreaterThanOrEqual(3);
    expect(results.some((pose) => pose.id === 'warrior-1')).toBe(true);
    expect(results.some((pose) => pose.id === 'warrior-2')).toBe(true);
  });

  it('filters seed poses by category', () => {
    const restorative = poseRepository.list({ category: 'restorative' });
    expect(restorative.length).toBeGreaterThan(0);
    expect(restorative.every((pose) => pose.category === 'restorative')).toBe(true);
  });

  it('lists unique tags from seed data', () => {
    const tags = poseRepository.listTags();
    expect(tags).toContain('hips');
    expect(tags).toEqual([...tags].sort((a, b) => a.localeCompare(b)));
  });

  it('supports an injected catalog for isolation', () => {
    const repo = createPoseRepository([
      {
        id: 'only',
        name: 'Only Pose',
        category: 'seated',
        difficulty: 'beginner',
        tags: ['test'],
      },
    ]);

    expect(repo.count()).toBe(1);
    expect(repo.list({ search: 'only' })[0]?.id).toBe('only');
  });
});
