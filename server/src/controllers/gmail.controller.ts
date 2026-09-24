import type { Response } from 'express';

import type { AuthenticatedRequest } from '../middleware/auth.js';
import {
  createGmailOAuthState,
  exchangeGmailCode,
  getGmailAuthorizationUrl,
  verifyGmailOAuthState,
} from '../services/gmail.service.js';
import { saveGmailConnection } from '../services/gmail-connection.service.js';
import { listJobEmails } from '../services/gmail-message.service.js';
import { classifyGmailMessage } from '../services/gmail-classifier.service.js';
import { extractGmailApplication } from '../services/gmail-extractor.service.js';
import { syncGmailApplications } from '../services/gmail-sync.service.js';
import { getGmailConnection } from '../services/gmail-connection.service.js';

export function connectGmailController(req: AuthenticatedRequest, res: Response) {
  if (!req.userId) {
    return res.status(401).json({
      error: 'Authentication required',
    });
  }

  const state = createGmailOAuthState(req.userId);
  const authorizationUrl = getGmailAuthorizationUrl(state);

  return res.json({
    authorizationUrl,
  });
}

export async function gmailCallbackController(req: AuthenticatedRequest, res: Response) {
  const { code, state, error } = req.query;

  if (error) {
    return res.status(400).json({
      error: `Google authorization failed: ${String(error)}`,
    });
  }

  if (typeof code !== 'string' || typeof state !== 'string') {
    return res.status(400).json({
      error: 'Missing Google OAuth parameters',
    });
  }

  try {
    const userId = verifyGmailOAuthState(state);

    const gmailConnection = await exchangeGmailCode(code);

    await saveGmailConnection({
      userId,
      googleEmail: gmailConnection.email,
      refreshToken: gmailConnection.refreshToken,
    });

    return res.status(200).json({
      message: 'Gmail connected successfully',
      email: gmailConnection.email,
    });
  } catch (error) {
    console.error('Gmail OAuth callback failed:', error);

    return res.status(400).json({
      error: 'Failed to connect Gmail',
    });
  }
}

export async function listGmailMessagesController(req: AuthenticatedRequest, res: Response) {
  if (!req.userId) {
    return res.status(401).json({
      error: 'Authentication required',
    });
  }

  try {
    const messages = await listJobEmails(req.userId);

    const classifiedMessages = messages
      .map((message) => {
        const classified = classifyGmailMessage(message);

        if (!classified) {
          return null;
        }

        const extracted = extractGmailApplication(message);

        return {
          messageId: message.messageId,
          status: classified.status,
          company: extracted.company,
          role: extracted.role,
          appliedAt: extracted.appliedAt,
          subject: message.subject,
        };
      })
      .filter((message) => message !== null);

    return res.status(200).json({
      messages: classifiedMessages,
    });
  } catch (error) {
    console.error('Failed to list Gmail messages:', error);

    return res.status(500).json({
      error: 'Failed to fetch Gmail messages',
    });
  }
}

export async function syncGmailApplicationsController(req: AuthenticatedRequest, res: Response) {
  if (!req.userId) {
    return res.status(401).json({
      error: 'Authentication required',
    });
  }

  try {
    const results = await syncGmailApplications(req.userId);

    return res.status(200).json({
      results,
    });
  } catch (error) {
    console.error('Failed to sync Gmail applications:', error);

    return res.status(500).json({
      error: 'Failed to sync Gmail applications',
    });
  }
}

export async function gmailStatusController(req: AuthenticatedRequest, res: Response) {
  if (!req.userId) {
    return res.status(401).json({
      error: 'Authentication required',
    });
  }

  try {
    const connection = await getGmailConnection(req.userId);

    return res.status(200).json({
      connected: Boolean(connection),
      email: connection?.googleEmail ?? null,
    });
  } catch (error) {
    console.error('Failed to get Gmail status:', error);

    return res.status(500).json({
      error: 'Failed to get Gmail status',
    });
  }
}
