/**
 * CORS — Middleware compartilhado para Vercel Serverless Functions.
 * 
 * Exporta `corsMiddleware` e `runMiddleware` para uso nas serverless functions.
 * O Express dev server usa o `cors()` diretamente, então este arquivo
 * é específico para o ambiente Vercel.
 */

import cors from 'cors';

export const corsMiddleware = cors({
  origin: '*', // Em produção, restringir para o domínio específico
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Username', 'Password'],
});

/**
 * Wrapper para rodar middleware Express em ambiente Serverless.
 */
export function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}
