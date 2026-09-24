import type { ParsedGmailMessage } from './gmail-parser.service.js';

export interface ExtractedGmailApplication {
  company: string | null;
  role: string | null;
  appliedAt: string;
}

export function extractGmailApplication(message: ParsedGmailMessage): ExtractedGmailApplication {
  return {
    company: extractCompany(message),
    role: extractRole(message),
    appliedAt: message.date,
  };
}

function extractCompany(message: ParsedGmailMessage): string | null {
  const fromMatch = message.from.match(/^([^<]+)\s*</);

  if (fromMatch?.[1]) {
    const senderName = fromMatch[1].trim();

    if (!isGenericSenderName(senderName)) {
      return senderName;
    }
  }

  const domainMatch = message.from.match(/@([a-z0-9.-]+)/i);

  if (domainMatch?.[1]) {
    const domain = domainMatch[1].toLowerCase();
    const parts = domain.split('.');

    if (parts.length >= 2) {
      const company = parts[parts.length - 2];

      if (!company) {
        return null;
      }

      if (!isGenericSenderName(company)) {
        return company.charAt(0).toUpperCase() + company.slice(1);
      }
    }
  }

  return null;
}

function isGenericSenderName(name: string) {
  const genericNames = [
    'noreply',
    'no-reply',
    'notification',
    'notifications',
    'careers',
    'recruitment',
    'recruiting',
    'talent acquisition',
  ];

  return genericNames.includes(name.toLowerCase());
}

function extractRole(message: ParsedGmailMessage): string | null {
  const text = `${message.subject} ${message.body}`;

  const naukriMatch = text.match(
    /Applied on [A-Za-z]+\s+\d{1,2},\s+\d{4}\s+(.+?)\s+(?:Naukri Assist|Track applications)/i,
  );

  if (naukriMatch?.[1]) {
    return naukriMatch[1].trim();
  }

  const patterns = [
    /position of (.+?)(?:\s+and|\s+with|\.\s|$)/i,

    /for the role of (.+?)(?:\s+at|\.\s|$)/i,

    /role of (.+?)(?:\s+at|\.\s|$)/i,

    /for the (.+?) position/i,

    /the (.+?) position with/i,

    /role.*?\|\s*(.+?)(?:\||$)/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);

    if (match?.[1]) {
      return match[1].trim();
    }
  }

  return null;
}
