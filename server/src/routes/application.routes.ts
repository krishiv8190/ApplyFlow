import { Router } from 'express';

import {
  createApplicationController,
  deleteApplicationController,
  getApplicationByIdController,
  getApplicationsController,
  updateApplicationController,
} from '../controllers/application.controller.js';

import { validateCreateApplication } from '../middleware/validate.js';
import { validateUpdateApplication } from '../middleware/validate-update-application.js';

const router = Router();

router.post('/', validateCreateApplication, createApplicationController);

router.get('/', getApplicationsController);

router.patch('/:id', validateUpdateApplication, updateApplicationController);

router.delete('/:id', deleteApplicationController);

router.get('/:id', getApplicationByIdController);

export default router;
