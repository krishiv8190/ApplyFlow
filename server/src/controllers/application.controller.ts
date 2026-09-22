import type { Response } from 'express';
import type { AuthenticatedRequest } from '../middleware/auth.js';
import {
  createApplication,
  deleteApplication,
  getApplications,
  getApplicationById,
  updateApplication,
} from '../services/application.service.js';
import { z } from 'zod';

export async function createApplicationController(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.userId;

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

export async function getApplicationsController(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(500).json({
        error: 'Development user is not configured',
      });
    }

    const applications = await getApplications(userId);
    return res.status(200).json(applications);
  } catch (error) {
    console.error('Failed to fetch applications:', error);
    return res.status(500).json({
      error: 'Failed to fetch applications',
    });
  }
}

export async function getApplicationByIdController(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(500).json({
        error: 'Development user is not configured',
      });
    }
    const applicationId = req.params.id;

    if (!applicationId || Array.isArray(applicationId)) {
      return res.status(400).json({
        error: 'Invalid application ID',
      });
    }

    const uuidResult = z.string().uuid().safeParse(applicationId);
    if (!uuidResult.success) {
      return res.status(400).json({
        error: 'Invalid application ID',
      });
    }
    const application = await getApplicationById(applicationId, userId);

    if (!application) {
      return res.status(404).json({
        error: 'Application not found',
      });
    }

    return res.status(200).json(application);
  } catch (error) {
    console.error('Failed to fetch application by ID:', error);

    return res.status(500).json({
      error: 'Failed to fetch application',
    });
  }
}

export async function updateApplicationController(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(500).json({
        error: 'Development user is not configured',
      });
    }

    const applicationId = req.params.id;

    if (!applicationId || Array.isArray(applicationId)) {
      return res.status(400).json({
        error: 'Invalid application ID',
      });
    }

    const uuidResult = z.string().uuid().safeParse(applicationId);
    if (!uuidResult.success) {
      return res.status(400).json({
        error: 'Invalid application ID',
      });
    }

    const application = await updateApplication(applicationId, userId, req.body);

    if (!application) {
      return res.status(404).json({
        error: 'Application not found',
      });
    }

    return res.status(200).json(application);
  } catch (error) {
    console.error('Failed to update application:', error);

    return res.status(500).json({
      error: 'Failed to update application',
    });
  }
}

export async function deleteApplicationController(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(500).json({
        error: 'Development user is not configured',
      });
    }

    const applicationId = req.params.id;

    if (!applicationId || Array.isArray(applicationId)) {
      return res.status(400).json({
        error: 'Invalid application ID',
      });
    }

    const uuidResult = z.string().uuid().safeParse(applicationId);

    if (!uuidResult.success) {
      return res.status(400).json({
        error: 'Invalid application ID',
      });
    }

    const application = await deleteApplication(applicationId, userId);

    if (!application) {
      return res.status(404).json({
        error: 'Application not found',
      });
    }

    return res.status(200).json({
      message: 'Application deleted successfully',
      application,
    });
  } catch (error) {
    console.error('Failed to delete application:', error);

    return res.status(500).json({
      error: 'Failed to delete application',
    });
  }
}
