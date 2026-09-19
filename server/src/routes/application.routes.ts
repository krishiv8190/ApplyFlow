import { Router } from 'express';
import { createApplicationController } from '../controllers/application.controller.js';
import { validateCreateApplication } from '../middleware/validate.js';

const router = Router();

router.post('/', validateCreateApplication, createApplicationController);

export default router;
