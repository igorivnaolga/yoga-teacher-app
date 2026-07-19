import poses from '@/data/seed/poses.json';
import type { PoseCategory } from '@/domain/pose';

import { getPoseIconName, POSE_ICONS } from './poseIcons';

describe('poseIcons', () => {
  it('maps every seed pose to an icon', () => {
    for (const pose of poses) {
      expect(POSE_ICONS[pose.id]).toBeDefined();
      expect(getPoseIconName(pose.id, pose.category as PoseCategory)).toBe(POSE_ICONS[pose.id]);
    }
  });

  it('falls back to category icon for unknown poses', () => {
    expect(getPoseIconName('unknown-pose', 'balance')).toBe('infinite-outline');
  });
});
