import Svg, { Circle, Line } from 'react-native-svg';

import type { StickJoints } from './types';

type StickFigureSvgProps = {
  joints: StickJoints;
  color: string;
  size: number;
  strokeWidth?: number;
};

function Seg({
  a,
  b,
  color,
  strokeWidth,
}: {
  a: { x: number; y: number };
  b: { x: number; y: number };
  color: string;
  strokeWidth: number;
}) {
  return (
    <Line
      x1={a.x}
      y1={a.y}
      x2={b.x}
      y2={b.y}
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

export function StickFigureSvg({
  joints,
  color,
  size,
  strokeWidth = 2.25,
}: StickFigureSvgProps) {
  const j = joints;
  const headR = 4.2;

  return (
    <Svg width={size} height={size} viewBox="0 0 64 64">
      <Circle cx={j.head.x} cy={j.head.y} r={headR} stroke={color} strokeWidth={strokeWidth} fill="none" />
      <Seg a={j.head} b={j.neck} color={color} strokeWidth={strokeWidth} />
      <Seg a={j.lShoulder} b={j.rShoulder} color={color} strokeWidth={strokeWidth} />
      <Seg a={j.neck} b={j.pelvis} color={color} strokeWidth={strokeWidth} />
      <Seg a={j.lShoulder} b={j.lElbow} color={color} strokeWidth={strokeWidth} />
      <Seg a={j.lElbow} b={j.lHand} color={color} strokeWidth={strokeWidth} />
      <Seg a={j.rShoulder} b={j.rElbow} color={color} strokeWidth={strokeWidth} />
      <Seg a={j.rElbow} b={j.rHand} color={color} strokeWidth={strokeWidth} />
      <Seg a={j.pelvis} b={j.lKnee} color={color} strokeWidth={strokeWidth} />
      <Seg a={j.lKnee} b={j.lFoot} color={color} strokeWidth={strokeWidth} />
      <Seg a={j.pelvis} b={j.rKnee} color={color} strokeWidth={strokeWidth} />
      <Seg a={j.rKnee} b={j.rFoot} color={color} strokeWidth={strokeWidth} />
    </Svg>
  );
}
