import { Request, Response, NextFunction } from 'express';
import { updateApplicationSchema } from '../schemas/update-application.schema.js';

export function validateUpdateApplication(req: Request, res: Response, next: NextFunction) {
  const result = updateApplicationSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      error: 'Validation failed',
      details: result.error.flatten().fieldErrors,
    });
  }

  next();
}
