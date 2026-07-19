import { useCallback, useEffect, useState } from 'react';

import { poseRepository } from '@/data';
import {
  draftFromPose,
  emptyPoseDraft,
  isCustomPoseId,
  validatePoseDraft,
  type Pose,
  type PoseCategory,
  type PoseDifficulty,
  type PoseDraft,
  type PoseValidationError,
} from '@/domain/pose';

type UsePoseEditorOptions = {
  poseId?: string;
  /** Prefill name when creating a new pose (e.g. from plan search). */
  initialName?: string;
};

export function usePoseEditor({ poseId, initialName }: UsePoseEditorOptions) {
  const isNew = !poseId || poseId === 'new';
  const [draft, setDraft] = useState<PoseDraft>(() => ({
    ...emptyPoseDraft(),
    name: initialName?.trim() ?? '',
  }));
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<PoseValidationError[]>([]);

  useEffect(() => {
    if (isNew) {
      setDraft({
        ...emptyPoseDraft(),
        name: initialName?.trim() ?? '',
      });
      setLoading(false);
      setLoadError(null);
      return;
    }

    let active = true;
    setLoading(true);
    void poseRepository
      .ready()
      .then(() => {
        if (!active) return;
        const pose = poseRepository.getById(poseId);
        if (!pose) {
          setLoadError('Pose not found.');
          return;
        }
        if (!pose.custom && !isCustomPoseId(pose.id)) {
          setLoadError('Built-in poses cannot be edited.');
          return;
        }
        setDraft(draftFromPose(pose));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [isNew, poseId, initialName]);

  const setName = (name: string) => setDraft((prev) => ({ ...prev, name }));
  const setSanskrit = (sanskrit: string) => setDraft((prev) => ({ ...prev, sanskrit }));
  const setCategories = (categories: PoseCategory[]) =>
    setDraft((prev) => ({ ...prev, categories }));
  const setDifficulty = (difficulty: PoseDifficulty) =>
    setDraft((prev) => ({ ...prev, difficulty }));
  const setCues = (cues: string) => setDraft((prev) => ({ ...prev, cues }));
  const setTagsText = (value: string) => {
    const tags = value
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);
    setDraft((prev) => ({ ...prev, tags }));
  };

  const save = useCallback(async (): Promise<Pose | null> => {
    setSaveError(null);
    const errors = validatePoseDraft(draft);
    setValidationErrors(errors);
    if (errors.length) return null;

    setSaving(true);
    try {
      if (isNew) {
        return await poseRepository.createCustom(draft);
      }
      return await poseRepository.updateCustom(poseId, draft);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to save pose.');
      return null;
    } finally {
      setSaving(false);
    }
  }, [draft, isNew, poseId]);

  const remove = useCallback(async () => {
    if (isNew) return false;
    await poseRepository.removeCustom(poseId);
    return true;
  }, [isNew, poseId]);

  return {
    isNew,
    draft,
    loading,
    saving,
    loadError,
    saveError,
    validationErrors,
    tagsText: draft.tags.join(', '),
    setName,
    setSanskrit,
    setCategories,
    setDifficulty,
    setCues,
    setTagsText,
    save,
    remove,
  };
}
