/**
 * Auth — Middleware de autenticação.
 * 
 * Para Express (dev): exporta `authenticate` (middleware clássico).
 * Para Vercel: exporta `authenticateAdmin` (função pura).
 */

import { readData } from './dataStore.js';

/**
 * Middleware Express — verifica credenciais nos headers da requisição.
 */
export function authenticate(req, res, next) {
  const { username, password } = req.headers;
  const data = readData();

  if (
    data.admin &&
    username === data.admin.username &&
    password === data.admin.password
  ) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
}

/**
 * Função pura de autenticação — verifica credenciais e retorna boolean.
 * Usada nas Vercel Serverless Functions.
 */
export function authenticateAdmin(username, password) {
  try {
    const data = readData();
    const admin = data.admin || data.adminCredentials;
    return admin && username === admin.username && password === admin.password;
  } catch (error) {
    console.error('[Auth] Erro na autenticação:', error.message);
    return false;
  }
}
