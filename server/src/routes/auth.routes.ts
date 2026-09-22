import { Router } from 'express';

import { loginController, registerController } from '../controllers/auth.controller.js';
import { loginSchema, registerSchema } from '../schemas/auth.schema.js';

const router = Router();

router.post(
  '/register',
  (req, res, next) => {
    const result = registerSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: result.error.flatten().fieldErrors,
      });
    }

    next();
  },
  registerController,
);

router.post(
  '/login',
  (req, res, next) => {
    const result = loginSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: result.error.flatten().fieldErrors,
      });
    }

    next();
  },
  loginController,
);
export default router;
