export type Point = {
  x: number;
  y: number;
};

/** Stick-figure joints in a 64×64 viewBox (animation-friendly). */
export type StickJoints = {
  head: Point;
  neck: Point;
  lShoulder: Point;
  rShoulder: Point;
  lElbow: Point;
  rElbow: Point;
  lHand: Point;
  rHand: Point;
  pelvis: Point;
  lKnee: Point;
  rKnee: Point;
  lFoot: Point;
  rFoot: Point;
};

export type PoseArtKind = 'svg' | 'icon';

export type ResolvedPoseArt =
  | { kind: 'svg'; joints: StickJoints }
  | { kind: 'icon' };
