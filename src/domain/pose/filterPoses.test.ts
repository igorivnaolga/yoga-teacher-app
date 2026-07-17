import { filterPoses, getPoseById, listUniqueTags } from './filterPoses';
import type { Pose } from './types';

const samplePoses: Pose[] = [
  {
    id: 'tree',
    name: 'Tree Pose',
    sanskrit: 'Vrksasana',
    category: 'balance',
    difficulty: 'beginner',
    tags: ['balance', 'hips', 'focus'],
    cues: 'Soft gaze.',
  },
  {
    id: 'crow',
    name: 'Crow Pose',
    sanskrit: 'Bakasana',
    category: 'arm_balance',
    difficulty: 'intermediate',
    tags: ['arm-balance', 'core', 'strength'],
  },
  {
    id: 'child',
    name: "Child's Pose",
    sanskrit: 'Balasana',
    category: 'restorative',
    difficulty: 'beginner',
    tags: ['restorative', 'calming', 'hips'],
  },
];

describe('filterPoses', () => {
  it('returns all poses when query is empty', () => {
    expect(filterPoses(samplePoses)).toHaveLength(3);
  });

  it('filters by category', () => {
    expect(filterPoses(samplePoses, { category: 'balance' }).map((p) => p.id)).toEqual(['tree']);
  });

  it('filters by difficulty', () => {
    expect(filterPoses(samplePoses, { difficulty: 'beginner' })).toHaveLength(2);
  });

  it('filters by tag case-insensitively', () => {
    expect(filterPoses(samplePoses, { tag: 'Hips' }).map((p) => p.id)).toEqual(['tree', 'child']);
  });

  it('searches name, sanskrit, tags, and cues', () => {
    expect(filterPoses(samplePoses, { search: 'vrksa' }).map((p) => p.id)).toEqual(['tree']);
    expect(filterPoses(samplePoses, { search: 'gaze' }).map((p) => p.id)).toEqual(['tree']);
    expect(filterPoses(samplePoses, { search: 'core' }).map((p) => p.id)).toEqual(['crow']);
  });

  it('combines search and category', () => {
    expect(
      filterPoses(samplePoses, { search: 'pose', category: 'restorative' }).map((p) => p.id),
    ).toEqual(['child']);
  });

  it('treats all as no category filter', () => {
    expect(filterPoses(samplePoses, { category: 'all' })).toHaveLength(3);
  });
});

describe('getPoseById', () => {
  it('returns the matching pose', () => {
    expect(getPoseById(samplePoses, 'crow')?.name).toBe('Crow Pose');
  });

  it('returns undefined when missing', () => {
    expect(getPoseById(samplePoses, 'missing')).toBeUndefined();
  });
});

describe('listUniqueTags', () => {
  it('returns sorted unique tags', () => {
    expect(listUniqueTags(samplePoses)).toEqual([
      'arm-balance',
      'balance',
      'calming',
      'core',
      'focus',
      'hips',
      'restorative',
      'strength',
    ]);
  });
});
