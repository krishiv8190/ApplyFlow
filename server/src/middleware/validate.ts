import { Request, Response, NextFunction } from 'express';
import { createApplicationSchema } from '../schemas/application.schema.js';

export function validateCreateApplication(req: Request, res: Response, next: NextFunction) {
  const result = createApplicationSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      error: 'Validation failed',
      details: result.error.flatten().fieldErrors,
    });
  }

  next();
}
