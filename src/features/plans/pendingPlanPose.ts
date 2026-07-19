/**
 * Pass a newly created pose back into an open plan editor without remounting it.
 * (router.replace was wiping unsaved plan draft state.)
 */
let pendingPoseId: string | null = null;

export function queuePoseForOpenPlan(poseId: string): void {
  pendingPoseId = poseId;
}

export function consumeQueuedPlanPose(): string | null {
  const next = pendingPoseId;
  pendingPoseId = null;
  return next;
}
