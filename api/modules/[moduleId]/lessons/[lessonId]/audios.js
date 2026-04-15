/**
 * Vercel Serverless Function — POST /api/modules/:moduleId/lessons/:lessonId/audios
 */

import { readData, writeData } from '../../../../../server/shared/dataStore.js';
import { corsMiddleware, runMiddleware } from '../../../../../server/shared/cors.js';
import { authenticateAdmin } from '../../../../../server/shared/auth.js';

export default async function handler(req, res) {
  await runMiddleware(req, res, corsMiddleware);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const username = req.headers['username'];
  const password = req.headers['password'];
  if (!authenticateAdmin(username, password)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { moduleId, lessonId } = req.query;

  if (req.method === 'POST') {
    try {
      const data = readData();
      const modIndex = data.modules.findIndex((m) => m.id.toString() === moduleId);
      if (modIndex === -1) return res.status(404).json({ error: 'Module not found' });

      const lessonIndex = (data.modules[modIndex].lessons || []).findIndex(
        (l) => l.id.toString() === lessonId
      );
      if (lessonIndex === -1) return res.status(404).json({ error: 'Lesson not found' });

      const allAudios = data.modules.flatMap((m) =>
        (m.lessons || []).flatMap((l) => l.audios || [])
      );
      const maxId = allAudios.reduce((max, a) => Math.max(max, a.id || 0), 2000);

      const newAudio = { ...req.body, id: maxId + 1 };

      if (!data.modules[modIndex].lessons[lessonIndex].audios) {
        data.modules[modIndex].lessons[lessonIndex].audios = [];
      }
      data.modules[modIndex].lessons[lessonIndex].audios.push(newAudio);

      if (writeData(data)) {
        res.status(201).json(newAudio);
      } else {
        res.status(500).json({ error: 'Failed to save audio' });
      }
    } catch (error) {
      console.error('[API] Error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
    return;
  }

  res.setHeader('Allow', ['POST', 'OPTIONS']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
