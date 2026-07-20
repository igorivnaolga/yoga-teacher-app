import { useCallback, useEffect, useState } from 'react';

import { courseRepository } from '@/data';
import type { Course } from '@/domain/course';

export function useCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setCourses(await courseRepository.list());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load courses.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { courses, loading, error, refresh };
}
