import poses from '@/data/seed/poses.json';

import { hasPoseIllustration, resolvePoseArt } from './resolvePoseArt';
import { POSE_SKELETONS } from './skeletons';

describe('resolvePoseArt', () => {
  it('provides stick-figure art for every seed pose', () => {
    expect(Object.keys(POSE_SKELETONS)).toHaveLength(poses.length);

    for (const pose of poses) {
      expect(hasPoseIllustration(pose.id)).toBe(true);
      const art = resolvePoseArt(pose.id);
      expect(art.kind).toBe('svg');
      if (art.kind === 'svg') {
        expect(art.joints.head).toEqual(
          expect.objectContaining({ x: expect.any(Number), y: expect.any(Number) }),
        );
        expect(art.joints.pelvis).toBeDefined();
        expect(art.joints.lFoot).toBeDefined();
        expect(art.joints.rFoot).toBeDefined();
      }
    }
  });

  it('falls back to icon for unknown pose ids', () => {
    expect(resolvePoseArt('not-a-real-pose')).toEqual({ kind: 'icon' });
  });
});
