import type { TaughtSession, TaughtSessionDraft } from './types';
import { validateTaughtSession } from './validateTaughtSession';

export type CreateTaughtSessionInput = TaughtSessionDraft & {
  id: string;
  now?: string;
};

export function createTaughtSession(input: CreateTaughtSessionInput): TaughtSession {
  const errors = validateTaughtSession(input);
  if (errors.length) {
    throw new Error(errors.map((error) => error.message).join(' '));
  }

  return {
    id: input.id,
    classPlanId: input.classPlanId.trim(),
    date: input.date,
    notes: input.notes?.trim() || undefined,
    createdAt: input.now ?? new Date().toISOString(),
  };
}
