import { useCallback, useEffect, useMemo, useState } from 'react';

import { classPlanRepository, poseRepository } from '@/data';
import {
  appendItem,
  createClassPlanItem,
  draftFromClassPlan,
  duplicateClassPlanDraft,
  moveItemDown,
  moveItemUp,
  removeItemAt,
  validateClassPlan,
  type ClassPlan,
  type ClassPlanDraft,
  type ClassPlanItem,
  type ClassPlanLevel,
  type ClassPlanValidationError,
} from '@/domain/classPlan';
import { primaryCategory, type PoseCategory } from '@/domain/pose';

function createItemId(): string {
  return `item_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

function emptyDraft(): ClassPlanDraft {
  return {
    title: '',
    level: 'beginner',
    durationMinutes: 60,
    theme: '',
    notes: '',
    items: [],
  };
}

export type PlanEditorItem = ClassPlanItem & {
  poseName: string;
  poseSanskrit?: string;
  poseCategory?: PoseCategory;
};

type UseClassPlanEditorOptions = {
  planId?: string;
};

export function useClassPlanEditor({ planId }: UseClassPlanEditorOptions) {
  const isNew = !planId || planId === 'new';
  const [draft, setDraft] = useState<ClassPlanDraft>(emptyDraft());
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [duplicating, setDuplicating] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<ClassPlanValidationError[]>([]);

  useEffect(() => {
    if (isNew) {
      setDraft(emptyDraft());
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);
    void classPlanRepository
      .getById(planId)
      .then((plan) => {
        if (!active) return;
        if (!plan) {
          setLoadError('Class plan not found.');
          return;
        }
        setDraft(draftFromClassPlan(plan));
      })
      .catch((err) => {
        if (!active) return;
        setLoadError(err instanceof Error ? err.message : 'Failed to load plan.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [isNew, planId]);

  const items: PlanEditorItem[] = useMemo(
    () =>
      draft.items.map((item) => {
        const pose = poseRepository.getById(item.poseId);
        return {
          ...item,
          poseName: pose?.name ?? 'Unknown pose',
          poseSanskrit: pose?.sanskrit,
          poseCategory: pose ? primaryCategory(pose) : undefined,
        };
      }),
    [draft.items],
  );

  const setTitle = (title: string) => setDraft((prev) => ({ ...prev, title }));
  const setLevel = (level: ClassPlanLevel) => setDraft((prev) => ({ ...prev, level }));
  const setDurationMinutes = (durationMinutes: number) =>
    setDraft((prev) => ({ ...prev, durationMinutes }));
  const setTheme = (theme: string) => setDraft((prev) => ({ ...prev, theme }));
  const setNotes = (notes: string) => setDraft((prev) => ({ ...prev, notes }));

  const addPose = useCallback((poseId: string) => {
    setDraft((prev) => ({
      ...prev,
      items: appendItem(prev.items, createClassPlanItem({ id: createItemId(), poseId })),
    }));
  }, []);

  const moveUp = useCallback((index: number) => {
    setDraft((prev) => ({ ...prev, items: moveItemUp(prev.items, index) }));
  }, []);

  const moveDown = useCallback((index: number) => {
    setDraft((prev) => ({ ...prev, items: moveItemDown(prev.items, index) }));
  }, []);

  const removeAt = useCallback((index: number) => {
    setDraft((prev) => ({ ...prev, items: removeItemAt(prev.items, index) }));
  }, []);

  const save = useCallback(async () => {
    setSaveError(null);
    const errors = validateClassPlan(draft);
    setValidationErrors(errors);
    if (errors.length) {
      return null;
    }

    setSaving(true);
    try {
      if (isNew) {
        return await classPlanRepository.create(draft);
      }
      return await classPlanRepository.update(planId, draft);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to save plan.');
      return null;
    } finally {
      setSaving(false);
    }
  }, [draft, isNew, planId]);

  const remove = useCallback(async () => {
    if (isNew) return false;
    await classPlanRepository.remove(planId);
    return true;
  }, [isNew, planId]);

  const duplicate = useCallback(async (): Promise<ClassPlan | null> => {
    if (isNew) return null;
    setDuplicating(true);
    setSaveError(null);
    try {
      const plan = await classPlanRepository.getById(planId);
      if (!plan) {
        setSaveError('Class plan not found.');
        return null;
      }
      return await classPlanRepository.create(duplicateClassPlanDraft(plan, createItemId));
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to duplicate plan.');
      return null;
    } finally {
      setDuplicating(false);
    }
  }, [isNew, planId]);

  return {
    isNew,
    draft,
    items,
    loading,
    saving,
    duplicating,
    loadError,
    saveError,
    validationErrors,
    setTitle,
    setLevel,
    setDurationMinutes,
    setTheme,
    setNotes,
    addPose,
    moveUp,
    moveDown,
    removeAt,
    save,
    remove,
    duplicate,
  };
}
