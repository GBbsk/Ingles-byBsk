/**
 * Vercel Serverless Function — GET /api/modules/:moduleId/lessons
 *                              POST /api/modules/:moduleId/lessons
 */

import { readData, writeData, generateId } from '../../../server/shared/dataStore.js';
import { corsMiddleware, runMiddleware } from '../../../server/shared/cors.js';
import { authenticateAdmin } from '../../../server/shared/auth.js';

export default async function handler(req, res) {
  await runMiddleware(req, res, corsMiddleware);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { moduleId } = req.query;

  if (req.method === 'GET') {
    try {
      const data = readData();
      const mod = data.modules.find((m) => m.id.toString() === moduleId);

      if (mod) {
        res.status(200).json(mod.lessons || []);
      } else {
        res.status(404).json({ error: 'Module not found' });
      }
    } catch (error) {
      console.error('[API] Error:', error);
      res.status(500).json({ error: 'Error reading server data' });
    }
    return;
  }

  if (req.method === 'POST') {
    const username = req.headers['username'];
    const password = req.headers['password'];
    if (!authenticateAdmin(username, password)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      const data = readData();
      const modIndex = data.modules.findIndex((m) => m.id.toString() === moduleId);
      if (modIndex === -1) return res.status(404).json({ error: 'Module not found' });

      const allLessons = data.modules.flatMap((m) => m.lessons || []);
      const newLesson = { ...req.body };
      newLesson.id = generateId(allLessons);

      if (!data.modules[modIndex].lessons) {
        data.modules[modIndex].lessons = [];
      }
      data.modules[modIndex].lessons.push(newLesson);

      if (writeData(data)) {
        res.status(201).json(newLesson);
      } else {
        res.status(500).json({ error: 'Failed to save lesson' });
      }
    } catch (error) {
      console.error('[API] Error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
    return;
  }

  res.setHeader('Allow', ['GET', 'POST', 'OPTIONS']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}