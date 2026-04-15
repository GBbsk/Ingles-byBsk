/**
 * Vercel Serverless Function — GET /api/modules/:moduleId/lessons/:lessonId
 *                              PUT /api/modules/:moduleId/lessons/:lessonId
 *                              DELETE /api/modules/:moduleId/lessons/:lessonId
 */

import { readData, writeData } from '../../../../server/shared/dataStore.js';
import { corsMiddleware, runMiddleware } from '../../../../server/shared/cors.js';
import { authenticateAdmin } from '../../../../server/shared/auth.js';

export default async function handler(req, res) {
  await runMiddleware(req, res, corsMiddleware);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { moduleId, lessonId } = req.query;

  if (req.method === 'GET') {
    try {
      const data = readData();
      const mod = data.modules.find((m) => m.id.toString() === moduleId);

      if (mod && mod.lessons) {
        const lesson = mod.lessons.find((l) => l.id.toString() === lessonId);
        if (lesson) {
          res.status(200).json(lesson);
        } else {
          res.status(404).json({ error: 'Lesson not found' });
        }
      } else {
        res.status(404).json({ error: 'Module not found or has no lessons' });
      }
    } catch (error) {
      console.error('[API] Error:', error);
      res.status(500).json({ error: 'Error reading server data' });
    }
    return;
  }

  // Rotas protegidas (PUT, DELETE)
  const username = req.headers['username'];
  const password = req.headers['password'];
  if (!authenticateAdmin(username, password)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'PUT') {
    try {
      const data = readData();
      const modIndex = data.modules.findIndex((m) => m.id.toString() === moduleId);
      if (modIndex === -1) return res.status(404).json({ error: 'Module not found' });

      const lessons = data.modules[modIndex].lessons || [];
      const lessonIndex = lessons.findIndex((l) => l.id.toString() === lessonId);
      if (lessonIndex === -1) return res.status(404).json({ error: 'Lesson not found' });

      const updated = { ...req.body, id: lessons[lessonIndex].id };
      data.modules[modIndex].lessons[lessonIndex] = updated;

      if (writeData(data)) {
        res.status(200).json(updated);
      } else {
        res.status(500).json({ error: 'Failed to update lesson' });
      }
    } catch (error) {
      console.error('[API] Error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
    return;
  }

  if (req.method === 'DELETE') {
    try {
      const data = readData();
      const modIndex = data.modules.findIndex((m) => m.id.toString() === moduleId);
      if (modIndex === -1) return res.status(404).json({ error: 'Module not found' });

      const lessons = data.modules[modIndex].lessons || [];
      const lessonIndex = lessons.findIndex((l) => l.id.toString() === lessonId);
      if (lessonIndex === -1) return res.status(404).json({ error: 'Lesson not found' });

      data.modules[modIndex].lessons.splice(lessonIndex, 1);

      if (writeData(data)) {
        res.status(200).json({ success: true });
      } else {
        res.status(500).json({ error: 'Failed to delete lesson' });
      }
    } catch (error) {
      console.error('[API] Error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
    return;
  }

  res.setHeader('Allow', ['GET', 'PUT', 'DELETE', 'OPTIONS']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}