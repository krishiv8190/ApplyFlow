import {
  createApplication,
  getApplicationByCompanyAndRole,
  getApplicationBySourceMessageId,
  getApplicationsByUser,
  isGmailMessageExcluded,
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

function normalizeCompanyName(company: string) {
  return company
    .toLowerCase()
    .replace(/\b(global|services|inc|incorporated|ltd|limited|llc|corp|corporation)\b/g, '')
    .replace(/[^a-z0-9]/g, '');
}

export async function syncGmailApplications(userId: string) {
  const messages = await listJobEmails(userId);

  // console.log('[Gmail Sync] Starting classification for', messages.length, 'messages');

  const results = [];

  for (const message of messages) {
    try {
      const excluded = await isGmailMessageExcluded(message.messageId, userId);

      if (excluded) {
        results.push({
          messageId: message.messageId,
          action: 'skipped',
          reason: 'excluded',
        });

        continue;
      }

      const classified = classifyGmailMessage(message);

      // console.log('[Gmail Sync] Classification:', {
      //   from: message.from,
      //   subject: message.subject,
      //   status: classified?.status ?? null,
      // });

      if (!classified) {
        continue;
      }

      const extracted = extractGmailApplication(message);

      // console.log('[Gmail Sync] Extraction:', {
      //   from: message.from,
      //   subject: message.subject,
      //   company: extracted.company,
      //   role: extracted.role,
      // });

      if (!extracted.company) {
        continue;
      }

      const existingMessage = await getApplicationBySourceMessageId(message.messageId, userId);

      if (existingMessage) {
        results.push({
          messageId: message.messageId,
          action: 'skipped',
          applicationId: existingMessage.id,
        });

        continue;
      }

      if (extracted.role) {
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
      }

      if (!extracted.role) {
        const userApplications = await getApplicationsByUser(userId);

        const matchingApplications = userApplications.filter(
          (application) =>
            normalizeCompanyName(application.company) === normalizeCompanyName(extracted.company!),
        );

        if (matchingApplications.length === 1) {
          const existingApplication = matchingApplications[0];

          if (!existingApplication) {
            continue;
          }

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
      }

      if (!extracted.role) {
        continue;
      }

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
    } catch (error) {
      console.error('[Gmail Sync] Failed to process message:', {
        messageId: message.messageId,
        from: message.from,
        subject: message.subject,
        error,
      });

      results.push({
        messageId: message.messageId,
        action: 'skipped',
        reason: 'processing_error',
      });

      continue;
    }
  }

  console.log('[Gmail Sync] Results:', results);

  return results;
}
