export type SequenceMatchKind = 'exact' | 'partial';

export type SequenceMatch = {
  kind: SequenceMatchKind;
  /** Longest run of consecutive poses shared in the same order */
  sharedRunLength: number;
  /** sharedRunLength / draft sequence length */
  sharedRatio: number;
};

/**
 * Longest common consecutive subsequence length (same order, contiguous).
 * Poses may repeat across classes; we care about ordered stretches.
 */
export function longestSharedRunLength(
  draft: readonly string[],
  taught: readonly string[],
): number {
  if (!draft.length || !taught.length) {
    return 0;
  }

  let best = 0;
  for (let i = 0; i < draft.length; i += 1) {
    for (let j = 0; j < taught.length; j += 1) {
      let run = 0;
      while (
        i + run < draft.length &&
        j + run < taught.length &&
        draft[i + run] === taught[j + run]
      ) {
        run += 1;
      }
      if (run > best) {
        best = run;
      }
    }
  }
  return best;
}

export function compareSequences(
  draft: readonly string[],
  taught: readonly string[],
): SequenceMatch | null {
  if (draft.length < 2 || taught.length < 2) {
    return null;
  }

  const exact =
    draft.length === taught.length && draft.every((poseId, index) => poseId === taught[index]);

  if (exact) {
    return {
      kind: 'exact',
      sharedRunLength: draft.length,
      sharedRatio: 1,
    };
  }

  const sharedRunLength = longestSharedRunLength(draft, taught);
  // Ignore tiny coincidences (e.g. mountain → down dog everywhere).
  if (sharedRunLength < 3) {
    return null;
  }

  return {
    kind: 'partial',
    sharedRunLength,
    sharedRatio: sharedRunLength / draft.length,
  };
}

export function sequenceMatchLevel(
  matches: readonly SequenceMatch[],
): 'none' | 'low' | 'medium' | 'high' {
  if (!matches.length) return 'none';
  if (matches.some((match) => match.kind === 'exact')) return 'high';
  // Level by ordered-run length (poses may repeat; order is what we care about).
  const bestRun = Math.max(...matches.map((match) => match.sharedRunLength));
  if (bestRun >= 6) return 'high';
  if (bestRun >= 4) return 'medium';
  return 'low';
}
