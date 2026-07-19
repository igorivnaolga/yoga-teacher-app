import { POSE_SKELETONS } from './skeletons';
import type { ResolvedPoseArt } from './types';

export function resolvePoseArt(poseId: string): ResolvedPoseArt {
  const joints = POSE_SKELETONS[poseId];
  if (joints) {
    return { kind: 'svg', joints };
  }
  return { kind: 'icon' };
}

export function hasPoseIllustration(poseId: string): boolean {
  return poseId in POSE_SKELETONS;
}
