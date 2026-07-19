export const POSE_CATEGORIES = [
  'standing',
  'seated',
  'supine',
  'prone',
  'balance',
  'inversion',
  'twist',
  'forward_fold',
  'backbend',
  'hip_opener',
  'arm_balance',
  'restorative',
] as const;

export type PoseCategory = (typeof POSE_CATEGORIES)[number];

export const POSE_DIFFICULTIES = ['beginner', 'intermediate', 'advanced'] as const;

export type PoseDifficulty = (typeof POSE_DIFFICULTIES)[number];

export type Pose = {
  id: string;
  name: string;
  sanskrit?: string;
  /** One or more categories (seed poses usually have one). */
  categories: PoseCategory[];
  difficulty: PoseDifficulty;
  tags: string[];
  cues?: string;
  /** True for user-created poses (seed catalog poses omit this). */
  custom?: boolean;
};

export type PoseDraft = {
  name: string;
  sanskrit?: string;
  categories: PoseCategory[];
  difficulty: PoseDifficulty;
  tags: string[];
  cues?: string;
};

export type PoseValidationError = {
  field: 'name' | 'categories' | 'difficulty' | 'tags' | 'cues' | 'sanskrit';
  message: string;
};

export type PoseQuery = {
  search?: string;
  category?: PoseCategory | 'all';
  tag?: string;
  difficulty?: PoseDifficulty | 'all';
};

export const CATEGORY_LABELS: Record<PoseCategory, string> = {
  standing: 'Standing',
  seated: 'Seated',
  supine: 'Supine',
  prone: 'Prone',
  balance: 'Balance',
  inversion: 'Inversion',
  twist: 'Twist',
  forward_fold: 'Forward fold',
  backbend: 'Backbend',
  hip_opener: 'Hip opener',
  arm_balance: 'Arm balance',
  restorative: 'Restorative',
};
