/**
 * Resource Routes — Define endpoints REST para arquivos e áudios.
 */

import { Router } from 'express';
import { authenticate } from '../shared/auth.js';
import * as resourceController from '../controllers/resourceController.js';

const router = Router();

// Arquivos
router.post('/modules/:moduleId/lessons/:lessonId/files', authenticate, resourceController.addFile);
router.put('/files/:fileId', authenticate, resourceController.updateFile);
router.delete('/files/:fileId', authenticate, resourceController.deleteFile);

// Áudios
router.post('/modules/:moduleId/lessons/:lessonId/audios', authenticate, resourceController.addAudio);
router.put('/audios/:audioId', authenticate, resourceController.updateAudio);
router.delete('/audios/:audioId', authenticate, resourceController.deleteAudio);

export default router;
