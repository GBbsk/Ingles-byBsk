/**
 * Lesson Controller — Lógica de negócio para aulas.
 */

import { findModule, writeData, generateId, readData } from './shared/dataStore.js';

/** POST /api/modules/:moduleId/lessons */
export function create(req, res) {
  const { data, module, index: moduleIndex } = findModule(req.params.moduleId);

  if (!module) {
    return res.status(404).json({ error: 'Module not found' });
  }

  const newLesson = { ...req.body };
  const allLessons = data.modules.flatMap((m) => m.lessons || []);
  newLesson.id = generateId(allLessons);

  if (!data.modules[moduleIndex].lessons) {
    data.modules[moduleIndex].lessons = [];
  }

  data.modules[moduleIndex].lessons.push(newLesson);

  if (writeData(data)) {
    res.status(201).json(newLesson);
  } else {
    res.status(500).json({ error: 'Failed to save lesson' });
  }
}

/** PUT /api/modules/:moduleId/lessons/:lessonId */
export function update(req, res) {
  const data = readData();
  const moduleId = parseInt(req.params.moduleId, 10);
  const lessonId = parseInt(req.params.lessonId, 10);

  const moduleIndex = data.modules.findIndex((m) => m.id === moduleId);
  if (moduleIndex === -1) {
    return res.status(404).json({ error: 'Module not found' });
  }

  const lessons = data.modules[moduleIndex].lessons || [];
  const lessonIndex = lessons.findIndex((l) => l.id === lessonId);
  if (lessonIndex === -1) {
    return res.status(404).json({ error: 'Lesson not found' });
  }

  const updatedLesson = { ...req.body, id: lessonId };
  data.modules[moduleIndex].lessons[lessonIndex] = updatedLesson;

  if (writeData(data)) {
    res.json(updatedLesson);
  } else {
    res.status(500).json({ error: 'Failed to update lesson' });
  }
}

/** DELETE /api/modules/:moduleId/lessons/:lessonId */
export function remove(req, res) {
  const data = readData();
  const moduleId = parseInt(req.params.moduleId, 10);
  const lessonId = parseInt(req.params.lessonId, 10);

  const moduleIndex = data.modules.findIndex((m) => m.id === moduleId);
  if (moduleIndex === -1) {
    return res.status(404).json({ error: 'Module not found' });
  }

  const lessons = data.modules[moduleIndex].lessons || [];
  const lessonIndex = lessons.findIndex((l) => l.id === lessonId);
  if (lessonIndex === -1) {
    return res.status(404).json({ error: 'Lesson not found' });
  }

  data.modules[moduleIndex].lessons.splice(lessonIndex, 1);

  if (writeData(data)) {
    res.json({ success: true });
  } else {
    res.status(500).json({ error: 'Failed to delete lesson' });
  }
}
