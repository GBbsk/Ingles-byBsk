/**
 * Module Routes — Define endpoints REST para módulos.
 */

import { Router } from 'express';
import { authenticate } from '../shared/auth.js';
import * as moduleController from '../controllers/moduleController.js';

const router = Router();

router.get('/', moduleController.getAll);
router.get('/:id', moduleController.getById);
router.post('/', authenticate, moduleController.create);
router.put('/:id', authenticate, moduleController.update);
router.delete('/:id', authenticate, moduleController.remove);

export default router;
