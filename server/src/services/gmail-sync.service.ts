import {
  createApplication,
  getApplicationByCompanyAndRole,
  getApplicationBySourceMessageId,
  getApplicationsByUser,
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

  const results = [];

  for (const message of messages) {
    const classified = classifyGmailMessage(message);

    if (!classified) {
      continue;
    }

    const extracted = extractGmailApplication(message);

    if (!extracted.company) {
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

    // 2. If the email contains a role, try an exact company + role match.
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

    // 3. If the email has no role, try to match a unique application
    // using the normalized company name.
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

    // 4. We need both company and role to create a new application.
    if (!extracted.role) {
      continue;
    }

    // 5. Otherwise create a new application.
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
