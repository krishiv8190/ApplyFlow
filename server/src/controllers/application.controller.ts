import { Request, Response } from 'express';
import { createApplication } from '../services/application.service.js';

export async function createApplicationController(req: Request, res: Response) {
  try {
    const userId = process.env.DEV_USER_ID;

    if (!userId) {
      return res.status(500).json({
        error: 'Development user is not configured',
      });
    }

    const application = await createApplication({
      userId,
      ...req.body,
    });

    return res.status(201).json(application);
  } catch (error) {
    console.error('Failed to create application:', error);

    return res.status(500).json({
      error: 'Failed to create application',
    });
  }
}
