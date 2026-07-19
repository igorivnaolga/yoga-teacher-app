import type { Pose } from '@/domain/pose';

import type { AlternativeSuggestion, PoseFrequency } from './types';

function scoreCandidate(
  source: Pose,
  candidate: Pose,
  recentCounts: ReadonlyMap<string, number>,
): number {
  let score = 0;
  const sharedCategories = candidate.categories.filter((category) =>
    source.categories.includes(category),
  ).length;
  score += sharedCategories * 3;
  const sharedTags = candidate.tags.filter((tag) => source.tags.includes(tag)).length;
  score += sharedTags;
  if (candidate.difficulty === source.difficulty) score += 1;
  const recentCount = recentCounts.get(candidate.id) ?? 0;
  score -= recentCount * 2;
  return score;
}

export function suggestAlternatives(input: {
  forPoseId: string;
  catalog: readonly Pose[];
  recentFrequencies: readonly PoseFrequency[];
  excludePoseIds?: readonly string[];
  limit?: number;
}): AlternativeSuggestion {
  const limit = input.limit ?? 3;
  const source = input.catalog.find((pose) => pose.id === input.forPoseId);
  if (!source) {
    return { forPoseId: input.forPoseId, alternatives: [] };
  }

  const recentCounts = new Map(
    input.recentFrequencies.map((entry) => [entry.poseId, entry.count]),
  );
  const excluded = new Set([input.forPoseId, ...(input.excludePoseIds ?? [])]);

  const ranked = input.catalog
    .filter((pose) => !excluded.has(pose.id))
    .map((pose) => ({
      poseId: pose.id,
      score: scoreCandidate(source, pose, recentCounts),
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.poseId);

  return {
    forPoseId: input.forPoseId,
    alternatives: ranked,
  };
}
