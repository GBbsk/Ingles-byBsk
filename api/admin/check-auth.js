/**
 * Vercel Serverless Function — GET /api/admin/check-auth
 */

import { authenticateAdmin } from '../server/shared/auth.js';
import { corsMiddleware, runMiddleware } from '../server/shared/cors.js';

export default async function handler(req, res) {
  await runMiddleware(req, res, corsMiddleware);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    const username = req.headers['username'];
    const password = req.headers['password'];

    if (authenticateAdmin(username, password)) {
      res.status(200).json({ authenticated: true });
    } else {
      res.status(401).json({ authenticated: false, message: 'Authentication failed' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'OPTIONS']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}