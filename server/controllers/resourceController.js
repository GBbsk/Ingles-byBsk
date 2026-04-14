/**
 * Resource Controller — Lógica de negócio para arquivos e áudios.
 */

import { readData, writeData, generateId } from '../shared/dataStore.js';

// ---------- Helpers privados ----------

/**
 * Busca um recurso (file/audio) em todas as aulas de todos os módulos.
 * @param {object} data - Dados completos
 * @param {string} type - 'files' ou 'audios'
 * @param {number} resourceId - ID do recurso
 * @returns {{ moduleIndex, lessonIndex, resourceIndex } | null}
 */
function findResourceLocation(data, type, resourceId) {
  for (let mi = 0; mi < data.modules.length; mi++) {
    const lessons = data.modules[mi].lessons || [];
    for (let li = 0; li < lessons.length; li++) {
      const resources = lessons[li][type] || [];
      const ri = resources.findIndex((r) => r.id === resourceId);
      if (ri !== -1) {
        return { moduleIndex: mi, lessonIndex: li, resourceIndex: ri };
      }
    }
  }
  return null;
}

// ---------- Files ----------

/** POST /api/modules/:moduleId/lessons/:lessonId/files */
export function addFile(req, res) {
  const data = readData();
  const moduleId = parseInt(req.params.moduleId, 10);
  const lessonId = parseInt(req.params.lessonId, 10);

  const moduleIndex = data.modules.findIndex((m) => m.id === moduleId);
  if (moduleIndex === -1) return res.status(404).json({ error: 'Module not found' });

  const lessons = data.modules[moduleIndex].lessons || [];
  const lessonIndex = lessons.findIndex((l) => l.id === lessonId);
  if (lessonIndex === -1) return res.status(404).json({ error: 'Lesson not found' });

  const newFile = { ...req.body };
  const allFiles = data.modules.flatMap((m) =>
    (m.lessons || []).flatMap((l) => l.files || [])
  );
  newFile.id = generateId(allFiles, 1000);

  if (!data.modules[moduleIndex].lessons[lessonIndex].files) {
    data.modules[moduleIndex].lessons[lessonIndex].files = [];
  }
  data.modules[moduleIndex].lessons[lessonIndex].files.push(newFile);

  if (writeData(data)) {
    res.status(201).json(newFile);
  } else {
    res.status(500).json({ error: 'Failed to save file' });
  }
}

/** PUT /api/files/:fileId */
export function updateFile(req, res) {
  const data = readData();
  const fileId = parseInt(req.params.fileId, 10);
  const loc = findResourceLocation(data, 'files', fileId);

  if (!loc) return res.status(404).json({ error: 'File not found' });

  const updatedFile = { ...req.body, id: fileId };
  data.modules[loc.moduleIndex].lessons[loc.lessonIndex].files[loc.resourceIndex] = updatedFile;

  if (writeData(data)) {
    res.json({ success: true });
  } else {
    res.status(500).json({ error: 'Failed to update file' });
  }
}

/** DELETE /api/files/:fileId */
export function deleteFile(req, res) {
  const data = readData();
  const fileId = parseInt(req.params.fileId, 10);
  const loc = findResourceLocation(data, 'files', fileId);

  if (!loc) return res.status(404).json({ error: 'File not found' });

  data.modules[loc.moduleIndex].lessons[loc.lessonIndex].files.splice(loc.resourceIndex, 1);

  if (writeData(data)) {
    res.json({ success: true });
  } else {
    res.status(500).json({ error: 'Failed to delete file' });
  }
}

// ---------- Audios ----------

/** POST /api/modules/:moduleId/lessons/:lessonId/audios */
export function addAudio(req, res) {
  const data = readData();
  const moduleId = parseInt(req.params.moduleId, 10);
  const lessonId = parseInt(req.params.lessonId, 10);

  const moduleIndex = data.modules.findIndex((m) => m.id === moduleId);
  if (moduleIndex === -1) return res.status(404).json({ error: 'Module not found' });

  const lessons = data.modules[moduleIndex].lessons || [];
  const lessonIndex = lessons.findIndex((l) => l.id === lessonId);
  if (lessonIndex === -1) return res.status(404).json({ error: 'Lesson not found' });

  const newAudio = { ...req.body };
  const allAudios = data.modules.flatMap((m) =>
    (m.lessons || []).flatMap((l) => l.audios || [])
  );
  newAudio.id = generateId(allAudios, 2000);

  if (!data.modules[moduleIndex].lessons[lessonIndex].audios) {
    data.modules[moduleIndex].lessons[lessonIndex].audios = [];
  }
  data.modules[moduleIndex].lessons[lessonIndex].audios.push(newAudio);

  if (writeData(data)) {
    res.status(201).json(newAudio);
  } else {
    res.status(500).json({ error: 'Failed to save audio' });
  }
}

/** PUT /api/audios/:audioId */
export function updateAudio(req, res) {
  const data = readData();
  const audioId = parseInt(req.params.audioId, 10);
  const loc = findResourceLocation(data, 'audios', audioId);

  if (!loc) return res.status(404).json({ error: 'Audio not found' });

  const updatedAudio = { ...req.body, id: audioId };
  data.modules[loc.moduleIndex].lessons[loc.lessonIndex].audios[loc.resourceIndex] = updatedAudio;

  if (writeData(data)) {
    res.json({ success: true });
  } else {
    res.status(500).json({ error: 'Failed to update audio' });
  }
}

/** DELETE /api/audios/:audioId */
export function deleteAudio(req, res) {
  const data = readData();
  const audioId = parseInt(req.params.audioId, 10);
  const loc = findResourceLocation(data, 'audios', audioId);

  if (!loc) return res.status(404).json({ error: 'Audio not found' });

  data.modules[loc.moduleIndex].lessons[loc.lessonIndex].audios.splice(loc.resourceIndex, 1);

  if (writeData(data)) {
    res.json({ success: true });
  } else {
    res.status(500).json({ error: 'Failed to delete audio' });
  }
}
