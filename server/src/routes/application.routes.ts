import { Router } from 'express';

import {
  createApplicationController,
  getApplicationByIdController,
  getApplicationsController,
} from '../controllers/application.controller.js';

import { validateCreateApplication } from '../middleware/validate.js';

const router = Router();

router.post('/', validateCreateApplication, createApplicationController);

router.get('/', getApplicationsController);

router.get('/:id', getApplicationByIdController);

export default router;
