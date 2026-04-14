/**
 * Server Entry Point — Express application setup.
 * 
 * Responsável apenas por:
 * 1. Criar a instância do Express
 * 2. Aplicar middleware global
 * 3. Montar os routers
 * 4. Servir estáticos em produção
 * 5. Iniciar o listen
 */

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Routes
import moduleRoutes from './routes/moduleRoutes.js';
import lessonRoutes from './routes/lessonRoutes.js';
import resourceRoutes from './routes/resourceRoutes.js';

// ---------- Config ----------

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 5000;

// ---------- App Setup ----------

const app = express();

// Middleware global
app.use(cors());
app.use(express.json());

// ---------- API Routes ----------

app.use('/api/modules', moduleRoutes);   // GET/POST /api/modules, GET/PUT/DELETE /api/modules/:id
app.use('/api/modules', lessonRoutes);   // POST/PUT/DELETE /api/modules/:moduleId/lessons[/:lessonId]
app.use('/api', resourceRoutes);         // POST files/audios, PUT/DELETE /api/files/:id, /api/audios/:id

// ---------- Production Static Files ----------

if (process.env.NODE_ENV === 'production') {
  const buildPath = path.join(__dirname, '..', 'dist');
  app.use(express.static(buildPath));

  app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
}

// ---------- Start ----------

app.listen(PORT, () => {
  console.log(`[Server] Running on port ${PORT}`);
});
