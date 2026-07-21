import {
  createCourse,
  updateCourse,
  type Course,
  type CourseDraft,
} from '@/domain/course';

import { asyncStorageStore } from '@/data/storage/asyncStorageStore';
import type { KeyValueStore } from '@/data/storage/keyValueStore';

const STORAGE_KEY = 'yoga-teacher.courses.v1';

export type CourseRepository = {
  list: () => Promise<Course[]>;
  getById: (id: string) => Promise<Course | undefined>;
  create: (draft: CourseDraft, id?: string) => Promise<Course>;
  update: (id: string, draft: CourseDraft) => Promise<Course>;
  remove: (id: string) => Promise<void>;
  replaceAll: (courses: readonly Course[]) => Promise<void>;
  clear: () => Promise<void>;
};

function createId(): string {
  return `course_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function createCourseRepository(
  store: KeyValueStore = asyncStorageStore,
): CourseRepository {
  async function readAll(): Promise<Course[]> {
    const raw = await store.getItem(STORAGE_KEY);
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw) as Course[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  async function writeAll(courses: Course[]): Promise<void> {
    await store.setItem(STORAGE_KEY, JSON.stringify(courses));
  }

  return {
    async list() {
      const courses = await readAll();
      return [...courses].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    },

    async getById(id) {
      const courses = await readAll();
      return courses.find((course) => course.id === id);
    },

    async create(draft, id = createId()) {
      const course = createCourse({ ...draft, id });
      const courses = await readAll();
      await writeAll([course, ...courses]);
      return course;
    },

    async update(id, draft) {
      const courses = await readAll();
      const existing = courses.find((course) => course.id === id);
      if (!existing) {
        throw new Error(`Course not found: ${id}`);
      }
      const updated = updateCourse(existing, draft);
      await writeAll(courses.map((course) => (course.id === id ? updated : course)));
      return updated;
    },

    async remove(id) {
      const courses = await readAll();
      await writeAll(courses.filter((course) => course.id !== id));
    },

    async replaceAll(courses) {
      await writeAll([...courses]);
    },

    async clear() {
      await store.removeItem(STORAGE_KEY);
    },
  };
}

export const courseRepository = createCourseRepository();
