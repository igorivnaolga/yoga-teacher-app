import type { KeyValueStore } from './keyValueStore';

export function createMemoryStore(initial: Record<string, string> = {}): KeyValueStore {
  const data = new Map(Object.entries(initial));

  return {
    async getItem(key) {
      return data.has(key) ? (data.get(key) ?? null) : null;
    },
    async setItem(key, value) {
      data.set(key, value);
    },
    async removeItem(key) {
      data.delete(key);
    },
  };
}
