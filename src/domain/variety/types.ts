export type OverlapLevel = 'none' | 'low' | 'medium' | 'high';

export type SequenceMatchKind = 'exact' | 'partial';

export type SequenceRepetition = {
  sessionId: string;
  date: string;
  classPlanId: string;
  kind: SequenceMatchKind;
  sharedRunLength: number;
  sharedRatio: number;
};

export type VarietyAnalysis = {
  /** Weekday used for comparison (0 = Sunday). */
  weekday: number;
  weekdayLabel: string;
  /** How many past classes on that weekday were considered. */
  sessionWindow: number;
  draftSequence: string[];
  matches: SequenceRepetition[];
  overlapLevel: OverlapLevel;
  /** True when the full ordered sequence was taught on that weekday before. */
  exactSequenceRepeated: boolean;
};

export type AlternativeSuggestion = {
  forPoseId: string;
  alternatives: string[];
};

/** @deprecated kept for suggestAlternatives scoring helpers */
export type PoseFrequency = {
  poseId: string;
  count: number;
  lastTaughtDate: string;
};
