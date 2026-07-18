export const CLASS_PLAN_LEVELS = ['beginner', 'open', 'intermediate', 'advanced'] as const;

export type ClassPlanLevel = (typeof CLASS_PLAN_LEVELS)[number];

export const CLASS_PLAN_LEVEL_LABELS: Record<ClassPlanLevel, string> = {
  beginner: 'Beginner',
  open: 'Open level',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

export type ClassPlanItem = {
  id: string;
  poseId: string;
  order: number;
  durationSec?: number;
  cues?: string;
};

export type ClassPlan = {
  id: string;
  title: string;
  level: ClassPlanLevel;
  durationMinutes: number;
  theme?: string;
  notes?: string;
  items: ClassPlanItem[];
  createdAt: string;
  updatedAt: string;
};

export type ClassPlanDraft = {
  title: string;
  level: ClassPlanLevel;
  durationMinutes: number;
  theme?: string;
  notes?: string;
  items: ClassPlanItem[];
};

export type ClassPlanValidationError = {
  field: 'title' | 'durationMinutes' | 'items' | 'level';
  message: string;
};
