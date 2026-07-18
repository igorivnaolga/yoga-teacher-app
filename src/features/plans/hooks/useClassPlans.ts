import { useCallback, useEffect, useState } from 'react';

import { classPlanRepository } from '@/data';
import type { ClassPlan } from '@/domain/classPlan';

export function useClassPlans() {
  const [plans, setPlans] = useState<ClassPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const next = await classPlanRepository.list();
      setPlans(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load class plans.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return {
    plans,
    loading,
    error,
    refresh,
  };
}
