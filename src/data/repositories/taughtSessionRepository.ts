import {
  createTaughtSession,
  filterSessionsByDate,
  filterSessionsByDateRange,
  recentSessions,
  type TaughtSession,
  type TaughtSessionDraft,
} from '@/domain/taughtSession';

import { asyncStorageStore } from '@/data/storage/asyncStorageStore';
import type { KeyValueStore } from '@/data/storage/keyValueStore';

const STORAGE_KEY = 'yoga-teacher.taughtSessions.v1';

export type TaughtSessionRepository = {
  list: () => Promise<TaughtSession[]>;
  getById: (id: string) => Promise<TaughtSession | undefined>;
  listByDate: (dateKey: string) => Promise<TaughtSession[]>;
  listByDateRange: (startDateKey: string, endDateKey: string) => Promise<TaughtSession[]>;
  listRecent: (limit?: number) => Promise<TaughtSession[]>;
  create: (draft: TaughtSessionDraft, id?: string) => Promise<TaughtSession>;
  remove: (id: string) => Promise<void>;
  replaceAll: (sessions: readonly TaughtSession[]) => Promise<void>;
  clear: () => Promise<void>;
};

function createId(): string {
  return `taught_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function createTaughtSessionRepository(
  store: KeyValueStore = asyncStorageStore,
): TaughtSessionRepository {
  async function readAll(): Promise<TaughtSession[]> {
    const raw = await store.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    try {
      const parsed = JSON.parse(raw) as TaughtSession[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  async function writeAll(sessions: TaughtSession[]): Promise<void> {
    await store.setItem(STORAGE_KEY, JSON.stringify(sessions));
  }

  return {
    async list() {
      return recentSessions(await readAll(), Number.MAX_SAFE_INTEGER);
    },

    async getById(id) {
      const sessions = await readAll();
      return sessions.find((session) => session.id === id);
    },

    async listByDate(dateKey) {
      return filterSessionsByDate(await readAll(), dateKey);
    },

    async listByDateRange(startDateKey, endDateKey) {
      return filterSessionsByDateRange(await readAll(), startDateKey, endDateKey);
    },

    async listRecent(limit = 10) {
      return recentSessions(await readAll(), limit);
    },

    async create(draft, id = createId()) {
      const session = createTaughtSession({ ...draft, id });
      const sessions = await readAll();
      await writeAll([session, ...sessions]);
      return session;
    },

    async remove(id) {
      const sessions = await readAll();
      await writeAll(sessions.filter((session) => session.id !== id));
    },

    async replaceAll(sessions) {
      await writeAll([...sessions]);
    },

    async clear() {
      await store.removeItem(STORAGE_KEY);
    },
  };
}

export const taughtSessionRepository = createTaughtSessionRepository();
