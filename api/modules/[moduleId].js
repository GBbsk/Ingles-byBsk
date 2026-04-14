/**
 * Vercel Serverless Function — GET /api/modules/:moduleId
 */

import { readData } from '../../server/shared/dataStore.js';
import { corsMiddleware, runMiddleware } from '../../server/shared/cors.js';

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
        res.status(200).json(mod);
      } else {
        res.status(404).json({ error: 'Module not found' });
      }
    } catch (error) {
      console.error('[API] Error:', error);
      res.status(500).json({ error: 'Error reading server data' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'OPTIONS']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}