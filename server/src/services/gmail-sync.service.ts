import {
  createApplication,
  getApplicationByCompanyAndRole,
  getApplicationBySourceMessageId,
  updateApplication,
} from './application.service.js';
import { classifyGmailMessage } from './gmail-classifier.service.js';
import { extractGmailApplication } from './gmail-extractor.service.js';
import { listJobEmails } from './gmail-message.service.js';

import type { GmailApplicationStatus } from './gmail-classifier.service.js';

const statusPriority: Record<GmailApplicationStatus, number> = {
  Applied: 1,
  Screening: 2,
  OA: 3,
  Interview: 4,
  Offer: 5,
  Rejected: 6,
};

function shouldUpdateStatus(currentStatus: string, newStatus: GmailApplicationStatus) {
  if (newStatus === 'Rejected') {
    return currentStatus !== 'Rejected';
  }

  if (currentStatus === 'Rejected') {
    return false;
  }

  if (newStatus === 'Offer') {
    return currentStatus !== 'Offer';
  }

  const currentPriority = statusPriority[currentStatus as GmailApplicationStatus];

  const newPriority = statusPriority[newStatus];

  if (currentPriority === undefined) {
    return true;
  }

  return newPriority > currentPriority;
}

export async function syncGmailApplications(userId: string) {
  const messages = await listJobEmails(userId);

  const results = [];

  for (const message of messages) {
    const classified = classifyGmailMessage(message);

    if (!classified) {
      continue;
    }

    const extracted = extractGmailApplication(message);

    if (!extracted.company || !extracted.role) {
      continue;
    }

    // 1. Check whether this exact Gmail message was already processed.
    const existingMessage = await getApplicationBySourceMessageId(message.messageId, userId);

    if (existingMessage) {
      results.push({
        messageId: message.messageId,
        action: 'skipped',
        applicationId: existingMessage.id,
      });

      continue;
    }

    // 2. Check whether this Gmail event belongs to an existing application.
    const existingApplication = await getApplicationByCompanyAndRole(
      extracted.company,
      extracted.role,
      userId,
    );

    if (existingApplication) {
      const shouldUpdate = shouldUpdateStatus(existingApplication.status, classified.status);

      if (shouldUpdate) {
        const updatedApplication = await updateApplication(existingApplication.id, userId, {
          status: classified.status,
        });

        results.push({
          messageId: message.messageId,
          action: 'updated',
          applicationId: updatedApplication?.id,
        });
      } else {
        results.push({
          messageId: message.messageId,
          action: 'skipped',
          applicationId: existingApplication.id,
        });
      }

      continue;
    }

    // 3. Otherwise create a new application.
    const application = await createApplication({
      userId,
      company: extracted.company,
      role: extracted.role,
      source: 'Gmail',
      status: classified.status,
      appliedAt: extracted.appliedAt,
      url: undefined,
      notes: `Imported from Gmail: ${message.subject}`,
      sourceMessageId: message.messageId,
    });

    results.push({
      messageId: message.messageId,
      action: 'created',
      applicationId: application.id,
    });
  }

  return results;
}
