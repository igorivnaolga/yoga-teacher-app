import { sortSessionsByOrder } from './reorderSessions';
import type { Course, CourseDraft, CourseSession } from './types';
import { validateCourse } from './validateCourse';

export type CreateCourseInput = CourseDraft & {
  id: string;
  now?: string;
};

export function createCourseSession(input: {
  id: string;
  classPlanId: string;
  order?: number;
  label?: string;
}): CourseSession {
  return {
    id: input.id,
    classPlanId: input.classPlanId,
    order: input.order ?? 0,
    label: input.label?.trim() || undefined,
  };
}

export function createCourse(input: CreateCourseInput): Course {
  const errors = validateCourse(input);
  if (errors.length) {
    throw new Error(errors.map((error) => error.message).join(' '));
  }

  const now = input.now ?? new Date().toISOString();
  const sessions = sortSessionsByOrder(input.sessions).map((session, index) => ({
    ...session,
    order: index,
    label: session.label?.trim() || undefined,
  }));

  return {
    id: input.id,
    title: input.title.trim(),
    description: input.description?.trim() || undefined,
    sessions,
    createdAt: now,
    updatedAt: now,
  };
}

export function updateCourse(
  existing: Course,
  draft: CourseDraft,
  now = new Date().toISOString(),
): Course {
  const next = createCourse({
    ...draft,
    id: existing.id,
    now: existing.createdAt,
  });

  return {
    ...next,
    createdAt: existing.createdAt,
    updatedAt: now,
  };
}

export function emptyCourseDraft(): CourseDraft {
  return {
    title: '',
    description: '',
    sessions: [],
  };
}

export function draftFromCourse(course: Course): CourseDraft {
  return {
    title: course.title,
    description: course.description ?? '',
    sessions: sortSessionsByOrder(course.sessions),
  };
}
