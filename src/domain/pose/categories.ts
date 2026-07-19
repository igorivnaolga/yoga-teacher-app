import { POSE_CATEGORIES, type Pose, type PoseCategory } from './types';

export function uniqueCategories(categories: readonly PoseCategory[]): PoseCategory[] {
  const seen = new Set<PoseCategory>();
  const result: PoseCategory[] = [];
  for (const category of categories) {
    if (!POSE_CATEGORIES.includes(category) || seen.has(category)) continue;
    seen.add(category);
    result.push(category);
  }
  return result;
}

/** Accept seed (`category`) or multi (`categories`) shapes. */
export function normalizePoseCategories(input: {
  category?: PoseCategory | string;
  categories?: readonly (PoseCategory | string)[];
}): PoseCategory[] {
  const fromList = uniqueCategories(
    (input.categories ?? []).filter((value): value is PoseCategory =>
      POSE_CATEGORIES.includes(value as PoseCategory),
    ),
  );
  if (fromList.length) return fromList;

  if (input.category && POSE_CATEGORIES.includes(input.category as PoseCategory)) {
    return [input.category as PoseCategory];
  }

  return ['standing'];
}

export function primaryCategory(pose: Pick<Pose, 'categories'>): PoseCategory {
  return pose.categories[0] ?? 'standing';
}

export function poseHasCategory(
  pose: Pick<Pose, 'categories'>,
  category: PoseCategory,
): boolean {
  return pose.categories.includes(category);
}
