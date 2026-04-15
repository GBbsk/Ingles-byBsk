/**
 * Vercel Serverless Function — GET/PUT/DELETE /api/modules/:moduleId
 */

import { readData, writeData } from '../../server/shared/dataStore.js';
import { corsMiddleware, runMiddleware } from '../../server/shared/cors.js';
import { authenticateAdmin } from '../../server/shared/auth.js';

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
        const sortedModules = [...data.modules].sort((a, b) => (a.order || 0) - (b.order || 0));
        const sortedIndex = sortedModules.findIndex((m) => m.id.toString() === moduleId);
        const enriched = {
          ...mod,
          stageName: mod.stageName || `Etapa ${mod.order || sortedIndex + 1}`,
          stageOrder: mod.order || sortedIndex + 1,
          prevModuleId: sortedIndex > 0 ? sortedModules[sortedIndex - 1].id : null,
          nextModuleId: sortedIndex < sortedModules.length - 1 ? sortedModules[sortedIndex + 1].id : null,
        };
        res.status(200).json(enriched);
      } else {
        res.status(404).json({ error: 'Module not found' });
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
      const index = data.modules.findIndex((m) => m.id.toString() === moduleId);
      if (index === -1) return res.status(404).json({ error: 'Module not found' });

      const updated = { ...req.body, id: data.modules[index].id };
      data.modules[index] = updated;

      if (writeData(data)) {
        res.status(200).json(updated);
      } else {
        res.status(500).json({ error: 'Failed to update module' });
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
      const index = data.modules.findIndex((m) => m.id.toString() === moduleId);
      if (index === -1) return res.status(404).json({ error: 'Module not found' });

      data.modules.splice(index, 1);

      if (writeData(data)) {
        res.status(200).json({ success: true });
      } else {
        res.status(500).json({ error: 'Failed to delete module' });
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