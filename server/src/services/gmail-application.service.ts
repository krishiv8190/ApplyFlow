import type { ParsedGmailMessage } from './gmail-parser.service.js';
import type { GmailApplicationStatus } from './gmail-classifier.service.js';

export interface GmailApplicationEvent {
  messageId: string;
  company: string;
  role: string | null;
  status: GmailApplicationStatus;
  eventDate: string;
  subject: string;
  message: ParsedGmailMessage;
}
