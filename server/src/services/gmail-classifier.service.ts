import type { ParsedGmailMessage } from './gmail-parser.service.js';

export type GmailApplicationStatus =
  'Applied' | 'Screening' | 'OA' | 'Interview' | 'Offer' | 'Rejected';

export interface ClassifiedGmailMessage {
  message: ParsedGmailMessage;
  status: GmailApplicationStatus;
}

export function classifyGmailMessage(message: ParsedGmailMessage): ClassifiedGmailMessage | null {
  const text = `${message.subject} ${message.body}`.toLowerCase();

  const sender = message.from.toLowerCase();

  if (sender.includes('naukri.com')) {
    return null;
  }

  // Ignore job recommendations and promotional emails.
  const ignorePatterns = [
    'job alert',
    'jobs found',
    'job recommendations',
    'recommended jobs',
    'explore jobs',
    'jobs are waiting',
    'apply now',
  ];

  if (ignorePatterns.some((pattern) => text.includes(pattern))) {
    return null;
  }

  if (
    text.includes('offer letter') ||
    text.includes('pleased to offer') ||
    text.includes('job offer')
  ) {
    return {
      message,
      status: 'Offer',
    };
  }

  if (
    text.includes('not moving forward') ||
    text.includes('application has been rejected') ||
    text.includes('regret to inform') ||
    text.includes('unfortunately')
  ) {
    return {
      message,
      status: 'Rejected',
    };
  }

  if (
    text.includes('online assessment') ||
    text.includes('coding assessment') ||
    text.includes('assessment invitation')
  ) {
    return {
      message,
      status: 'OA',
    };
  }

  if (
    text.includes('interview invitation') ||
    text.includes('invite you for an interview') ||
    text.includes('preliminary screening') ||
    text.includes('schedule your interview')
  ) {
    return {
      message,
      status: 'Interview',
    };
  }

  if (
    text.includes('screening') ||
    text.includes('phone screen') ||
    text.includes('screening call')
  ) {
    return {
      message,
      status: 'Screening',
    };
  }

  if (
    text.includes('application received') ||
    text.includes('received your application') ||
    text.includes('received and saved your application') ||
    text.includes('application has been submitted') ||
    text.includes('you applied for')
  ) {
    return {
      message,
      status: 'Applied',
    };
  }

  return null;
}
