/**
 * Vercel Serverless Function — GET /api/modules  |  POST /api/modules
 */

import { readData, writeData, generateId } from '../server/shared/dataStore.js';
import { corsMiddleware, runMiddleware } from '../server/shared/cors.js';
import { authenticateAdmin } from '../server/shared/auth.js';

export default async function handler(req, res) {
  await runMiddleware(req, res, corsMiddleware);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    try {
      const data = readData();
      res.status(200).json(data.modules || []);
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
      const newModule = { ...req.body };
      newModule.id = generateId(data.modules);
      data.modules.push(newModule);

      if (writeData(data)) {
        res.status(201).json(newModule);
      } else {
        res.status(500).json({ error: 'Failed to save module' });
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