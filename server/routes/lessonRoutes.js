/**
 * Lesson Routes — Define endpoints REST para aulas.
 */

import { Router } from 'express';
import { authenticate } from './shared/auth.js';
import * as lessonController from './controllers/lessonController.js';

const router = Router();

router.post('/:moduleId/lessons', authenticate, lessonController.create);
router.put('/:moduleId/lessons/:lessonId', authenticate, lessonController.update);
router.delete('/:moduleId/lessons/:lessonId', authenticate, lessonController.remove);

export default router;
