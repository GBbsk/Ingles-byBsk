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

  /**
   * Marca uma aula como concluída
   */
  const markLessonCompleted = useCallback((lessonId, moduleId) => {
    setProgress((prev) => ({
      ...prev,
      completedLessons: {
        ...prev.completedLessons,
        [lessonId]: {
          moduleId: Number(moduleId),
          completedAt: new Date().toISOString(),
        },
      },
    }));
  }, []);

  /**
   * Remove a marcação de concluída de uma aula
   */
  const unmarkLessonCompleted = useCallback((lessonId) => {
    setProgress((prev) => {
      const updated = { ...prev.completedLessons };
      delete updated[lessonId];
      return { ...prev, completedLessons: updated };
    });
  }, []);

  /**
   * Alterna o estado de conclusão
   */
  const toggleLessonCompleted = useCallback((lessonId, moduleId) => {
    setProgress((prev) => {
      const isCompleted = !!prev.completedLessons[lessonId];
      if (isCompleted) {
        const updated = { ...prev.completedLessons };
        delete updated[lessonId];
        return { ...prev, completedLessons: updated };
      } else {
        return {
          ...prev,
          completedLessons: {
            ...prev.completedLessons,
            [lessonId]: {
              moduleId: Number(moduleId),
              completedAt: new Date().toISOString(),
            },
          },
        };
      }
    });
  }, []);

  /**
   * Verifica se uma aula está concluída
   */
  const isLessonCompleted = useCallback(
    (lessonId) => {
      return !!progress.completedLessons[lessonId];
    },
    [progress.completedLessons]
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

  /**
   * Calcula o progresso de um módulo (0 a 100)
   * @param {number} moduleId
   * @param {Array} moduleLessons - array de aulas do módulo
   */
  const getModuleProgress = useCallback(
    (moduleId, moduleLessons) => {
      if (!moduleLessons || moduleLessons.length === 0) return 0;
      const completed = moduleLessons.filter(
        (l) => !!progress.completedLessons[l.id]
      ).length;
      return Math.round((completed / moduleLessons.length) * 100);
    },
    [progress.completedLessons]
  );

  /**
   * Retorna o total de aulas concluídas globalmente
   */
  const getTotalCompleted = useCallback(() => {
    return Object.keys(progress.completedLessons).length;
  }, [progress.completedLessons]);

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
