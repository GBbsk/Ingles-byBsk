/**
 * Vercel Serverless Function — PUT /api/files/:fileId
 *                              DELETE /api/files/:fileId
 */

import { readData, writeData } from '../../../server/shared/dataStore.js';
import { corsMiddleware, runMiddleware } from '../../../server/shared/cors.js';
import { authenticateAdmin } from '../../../server/shared/auth.js';

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

  const { fileId } = req.query;

  if (req.method === 'PUT') {
    try {
      const data = readData();
      let found = false;

      for (const mod of data.modules) {
        for (const lesson of mod.lessons || []) {
          if (lesson.files) {
            const idx = lesson.files.findIndex((f) => f.id.toString() === fileId);
            if (idx !== -1) {
              lesson.files[idx] = { ...req.body, id: lesson.files[idx].id };
              found = true;
              break;
            }
          }
        }
        if (found) break;
      }

      if (!found) return res.status(404).json({ error: 'File not found' });

      if (writeData(data)) {
        res.status(200).json({ success: true });
      } else {
        res.status(500).json({ error: 'Failed to update file' });
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
      let found = false;

      for (const mod of data.modules) {
        for (const lesson of mod.lessons || []) {
          if (lesson.files) {
            const idx = lesson.files.findIndex((f) => f.id.toString() === fileId);
            if (idx !== -1) {
              lesson.files.splice(idx, 1);
              found = true;
              break;
            }
          }
        }
        if (found) break;
      }

      if (!found) return res.status(404).json({ error: 'File not found' });

      if (writeData(data)) {
        res.status(200).json({ success: true });
      } else {
        res.status(500).json({ error: 'Failed to delete file' });
      }
    } catch (error) {
      console.error('[API] Error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
    return;
  }

  res.setHeader('Allow', ['PUT', 'DELETE', 'OPTIONS']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
