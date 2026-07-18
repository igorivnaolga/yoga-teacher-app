export type TaughtSession = {
  id: string;
  classPlanId: string;
  /** Local calendar date as YYYY-MM-DD */
  date: string;
  notes?: string;
  createdAt: string;
};

export type TaughtSessionDraft = {
  classPlanId: string;
  date: string;
  notes?: string;
};

export type TaughtSessionValidationError = {
  field: 'classPlanId' | 'date' | 'notes';
  message: string;
};
