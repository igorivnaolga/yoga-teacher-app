import { normalizePoseCategories, uniqueCategories } from './categories';
import type { Pose, PoseDraft } from './types';

export function isCustomPoseId(id: string): boolean {
  return id.startsWith('custom_');
}

export function createCustomPose(input: PoseDraft & { id: string }): Pose {
  const tags = input.tags.map((tag) => tag.trim()).filter(Boolean);
  const sanskrit = input.sanskrit?.trim();
  const cues = input.cues?.trim();

  return {
    id: input.id,
    name: input.name.trim(),
    sanskrit: sanskrit || undefined,
    categories: uniqueCategories(input.categories),
    difficulty: input.difficulty,
    tags,
    cues: cues || undefined,
    custom: true,
  };
}

export function updateCustomPose(existing: Pose, draft: PoseDraft): Pose {
  if (!existing.custom && !isCustomPoseId(existing.id)) {
    throw new Error('Seed poses cannot be edited.');
  }
  return createCustomPose({ ...draft, id: existing.id });
}

export function emptyPoseDraft(): PoseDraft {
  return {
    name: '',
    sanskrit: '',
    categories: ['standing'],
    difficulty: 'beginner',
    tags: [],
    cues: '',
  };
}

export function draftFromPose(pose: Pose): PoseDraft {
  return {
    name: pose.name,
    sanskrit: pose.sanskrit ?? '',
    categories: [...pose.categories],
    difficulty: pose.difficulty,
    tags: [...pose.tags],
    cues: pose.cues ?? '',
  };
}

/** Normalize raw seed/storage pose into the app Pose shape. */
export function normalizePose(raw: Record<string, unknown> & { id: string; name: string }): Pose {
  const categories = normalizePoseCategories({
    category: raw.category as string | undefined,
    categories: raw.categories as string[] | undefined,
  });

  return {
    id: raw.id,
    name: raw.name,
    sanskrit: typeof raw.sanskrit === 'string' ? raw.sanskrit : undefined,
    categories,
    difficulty: (raw.difficulty as Pose['difficulty']) ?? 'beginner',
    tags: Array.isArray(raw.tags) ? (raw.tags as string[]) : [],
    cues: typeof raw.cues === 'string' ? raw.cues : undefined,
    custom: raw.custom === true || isCustomPoseId(raw.id),
  };
}
