import { useCallback, useEffect, useMemo, useState } from 'react';

import { classPlanRepository, courseRepository } from '@/data';
import {
  appendSession,
  createCourseSession,
  draftFromCourse,
  emptyCourseDraft,
  moveSessionDown,
  moveSessionUp,
  pruneMissingPlanSessions,
  removeSessionAt,
  validateCourse,
  type Course,
  type CourseDraft,
  type CourseSession,
  type CourseValidationError,
} from '@/domain/course';
import type { ClassPlan } from '@/domain/classPlan';

function createSessionId(): string {
  return `cs_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

export type CourseEditorSession = CourseSession & {
  planTitle: string;
  planMissing: boolean;
};

type UseCourseEditorOptions = {
  courseId?: string;
};

export function useCourseEditor({ courseId }: UseCourseEditorOptions) {
  const isNew = !courseId || courseId === 'new';
  const [draft, setDraft] = useState<CourseDraft>(emptyCourseDraft());
  const [plansById, setPlansById] = useState<Map<string, ClassPlan>>(new Map());
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<CourseValidationError[]>([]);
  const [prunedCount, setPrunedCount] = useState(0);

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      setLoadError(null);
      try {
        const plans = await classPlanRepository.list();
        if (!active) return;
        const map = new Map(plans.map((plan) => [plan.id, plan]));
        setPlansById(map);

        if (isNew) {
          setDraft(emptyCourseDraft());
          setPrunedCount(0);
          return;
        }

        const course = await courseRepository.getById(courseId);
        if (!active) return;
        if (!course) {
          setLoadError('Course not found.');
          return;
        }

        const draftCourse = draftFromCourse(course);
        const { sessions, removedCount } = pruneMissingPlanSessions(
          draftCourse.sessions,
          new Set(map.keys()),
        );
        setDraft({ ...draftCourse, sessions });
        setPrunedCount(removedCount);
      } catch (err) {
        if (active) {
          setLoadError(err instanceof Error ? err.message : 'Failed to load course.');
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void load();
    return () => {
      active = false;
    };
  }, [courseId, isNew]);

  const sessions: CourseEditorSession[] = useMemo(
    () =>
      [...draft.sessions]
        .sort((a, b) => a.order - b.order)
        .map((session) => {
          const plan = plansById.get(session.classPlanId);
          return {
            ...session,
            planTitle: plan?.title ?? 'Missing class plan',
            planMissing: !plan,
          };
        }),
    [draft.sessions, plansById],
  );

  const availablePlans = useMemo(() => {
    const used = new Set(draft.sessions.map((session) => session.classPlanId));
    return [...plansById.values()]
      .filter((plan) => !used.has(plan.id))
      .sort((a, b) => a.title.localeCompare(b.title));
  }, [draft.sessions, plansById]);

  const setTitle = (title: string) => setDraft((prev) => ({ ...prev, title }));
  const setDescription = (description: string) =>
    setDraft((prev) => ({ ...prev, description }));

  const addPlan = useCallback((classPlanId: string, label?: string) => {
    setDraft((prev) => ({
      ...prev,
      sessions: appendSession(
        prev.sessions,
        createCourseSession({
          id: createSessionId(),
          classPlanId,
          label,
        }),
      ),
    }));
  }, []);

  const moveUp = useCallback((index: number) => {
    setDraft((prev) => ({ ...prev, sessions: moveSessionUp(prev.sessions, index) }));
  }, []);

  const moveDown = useCallback((index: number) => {
    setDraft((prev) => ({ ...prev, sessions: moveSessionDown(prev.sessions, index) }));
  }, []);

  const removeAt = useCallback((index: number) => {
    setDraft((prev) => ({ ...prev, sessions: removeSessionAt(prev.sessions, index) }));
  }, []);

  const setSessionLabel = useCallback((index: number, label: string) => {
    setDraft((prev) => {
      const sorted = [...prev.sessions].sort((a, b) => a.order - b.order);
      const next = sorted.map((session, i) =>
        i === index ? { ...session, label: label.trim() || undefined } : session,
      );
      return { ...prev, sessions: next };
    });
  }, []);

  const save = useCallback(async (): Promise<Course | null> => {
    setSaveError(null);
    const errors = validateCourse(draft);
    setValidationErrors(errors);
    if (errors.length) return null;

    setSaving(true);
    try {
      if (isNew) {
        return await courseRepository.create(draft);
      }
      return await courseRepository.update(courseId, draft);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to save course.');
      return null;
    } finally {
      setSaving(false);
    }
  }, [courseId, draft, isNew]);

  const remove = useCallback(async () => {
    if (isNew) return false;
    await courseRepository.remove(courseId);
    return true;
  }, [courseId, isNew]);

  return {
    isNew,
    draft,
    sessions,
    availablePlans,
    loading,
    saving,
    loadError,
    saveError,
    validationErrors,
    prunedCount,
    setTitle,
    setDescription,
    addPlan,
    moveUp,
    moveDown,
    removeAt,
    setSessionLabel,
    save,
    remove,
  };
}
