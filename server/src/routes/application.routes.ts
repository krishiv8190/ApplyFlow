import { Router } from 'express';

import {
  createApplicationController,
  getApplicationByIdController,
  getApplicationsController,
  updateApplicationController,
} from '../controllers/application.controller.js';

import { validateCreateApplication } from '../middleware/validate.js';
import { validateUpdateApplication } from '../middleware/validate-update-application.js';

const router = Router();

router.post('/', validateCreateApplication, createApplicationController);

router.get('/', getApplicationsController);

router.get('/:id', getApplicationByIdController);

router.patch('/:id', validateUpdateApplication, updateApplicationController);

export default router;
