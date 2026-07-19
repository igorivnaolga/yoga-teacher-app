import { CATEGORY_LABELS } from './types';
import type { Pose, PoseQuery } from './types';
import { poseHasCategory } from './categories';

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

function matchesSearch(pose: Pose, search: string): boolean {
  const query = normalize(search);
  if (!query) {
    return true;
  }

  const categoryText = pose.categories.map((category) => CATEGORY_LABELS[category]).join(' ');
  const haystack = [pose.name, pose.sanskrit ?? '', categoryText, ...pose.tags, pose.cues ?? '']
    .join(' ')
    .toLowerCase();

  return haystack.includes(query);
}

export function filterPoses(poses: readonly Pose[], query: PoseQuery = {}): Pose[] {
  const category = query.category && query.category !== 'all' ? query.category : undefined;
  const difficulty =
    query.difficulty && query.difficulty !== 'all' ? query.difficulty : undefined;
  const tag = query.tag ? normalize(query.tag) : undefined;
  const search = query.search ?? '';

  return poses.filter((pose) => {
    if (category && !poseHasCategory(pose, category)) {
      return false;
    }
    if (difficulty && pose.difficulty !== difficulty) {
      return false;
    }
    if (tag && !pose.tags.some((poseTag) => normalize(poseTag) === tag)) {
      return false;
    }
    return matchesSearch(pose, search);
  });
}

export function getPoseById(poses: readonly Pose[], id: string): Pose | undefined {
  return poses.find((pose) => pose.id === id);
}

export function listUniqueTags(poses: readonly Pose[]): string[] {
  const tags = new Set<string>();
  for (const pose of poses) {
    for (const tag of pose.tags) {
      tags.add(tag);
    }
  }
  return [...tags].sort((a, b) => a.localeCompare(b));
}
