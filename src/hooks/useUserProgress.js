import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'platform_user_progress';

/**
 * Estrutura salva no localStorage:
 * {
 *   completedLessons: { [lessonId]: { moduleId, completedAt } },
 *   lastWatched: { moduleId, lessonId, timestamp },
 *   totalStudyTime: number (em minutos, opcional futuro)
 * }
 */

const getStoredProgress = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.warn('Erro ao ler progresso do localStorage:', e);
  }
  return {
    completedLessons: {},
    lastWatched: null,
  };
};

const saveProgress = (progress) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.warn('Erro ao salvar progresso no localStorage:', e);
  }
};

export function useUserProgress() {
  const [progress, setProgress] = useState(getStoredProgress);

  // Persiste toda vez que progress mudar
  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const markLessonCompleted = useCallback((lessonId, moduleId) => {
    setProgress((prev) => {
      const existingCompleted = prev?.completedLessons || {};
      return {
        ...prev,
        completedLessons: {
          ...existingCompleted,
          [lessonId]: {
            moduleId: Number(moduleId),
            completedAt: new Date().toISOString(),
          },
        },
      };
    });
  }, []);

  const unmarkLessonCompleted = useCallback((lessonId) => {
    setProgress((prev) => {
      const existingCompleted = prev?.completedLessons || {};
      const updated = { ...existingCompleted };
      delete updated[lessonId];
      return { ...prev, completedLessons: updated };
    });
  }, []);

  const toggleLessonCompleted = useCallback((lessonId, moduleId) => {
    setProgress((prev) => {
      const existingCompleted = prev?.completedLessons || {};
      const isCompleted = !!existingCompleted[lessonId];
      if (isCompleted) {
        const updated = { ...existingCompleted };
        delete updated[lessonId];
        return { ...prev, completedLessons: updated };
      } else {
        return {
          ...prev,
          completedLessons: {
            ...existingCompleted,
            [lessonId]: {
              moduleId: Number(moduleId),
              completedAt: new Date().toISOString(),
            },
          },
        };
      }
    });
  }, []);

  const isLessonCompleted = useCallback(
    (lessonId) => {
      return !!(progress?.completedLessons && progress.completedLessons[lessonId]);
    },
    [progress?.completedLessons]
  );

  /**
   * Registra "Continue Assistindo"
   */
  const setLastWatched = useCallback((lessonId, moduleId) => {
    setProgress((prev) => ({
      ...prev,
      lastWatched: {
        lessonId: Number(lessonId),
        moduleId: Number(moduleId),
        timestamp: new Date().toISOString(),
      },
    }));
  }, []);

  const getModuleProgress = useCallback(
    (moduleId, moduleLessons) => {
      if (!moduleLessons || moduleLessons.length === 0) return 0;
      const completed = moduleLessons.filter(
        (l) => !!(progress?.completedLessons && progress.completedLessons[l.id])
      ).length;
      return Math.round((completed / moduleLessons.length) * 100);
    },
    [progress?.completedLessons]
  );

  const getTotalCompleted = useCallback(() => {
    return Object.keys(progress?.completedLessons || {}).length;
  }, [progress?.completedLessons]);

  /**
   * Retorna os dados de "Continue Assistindo"
   */
  const getLastWatched = useCallback(() => {
    return progress.lastWatched;
  }, [progress.lastWatched]);

  return {
    progress,
    markLessonCompleted,
    unmarkLessonCompleted,
    toggleLessonCompleted,
    isLessonCompleted,
    setLastWatched,
    getModuleProgress,
    getTotalCompleted,
    getLastWatched,
  };
}
