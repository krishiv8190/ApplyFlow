interface GmailHeader {
  name?: string | null;
  value?: string | null;
}

interface GmailPart {
  mimeType?: string | null;
  body?: {
    data?: string | null;
  } | null;
  parts?: GmailPart[] | null;
}

export interface ParsedGmailMessage {
  messageId: string;
  from: string;
  subject: string;
  date: string;
  body: string;
}

function decodeBase64Url(data: string) {
  const normalized = data.replace(/-/g, '+').replace(/_/g, '/');

  return Buffer.from(normalized, 'base64').toString('utf-8');
}

function extractBody(part: GmailPart): string {
  if (part.body?.data) {
    return decodeBase64Url(part.body.data);
  }

  if (part.parts) {
    for (const childPart of part.parts) {
      const body = extractBody(childPart);

      if (body) {
        return body;
      }
    }
  }

  return '';
}

function stripHtml(html: string) {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&#39;/gi, "'")
    .replace(/&quot;/gi, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

export function parseGmailMessage(message: {
  id?: string | null;
  payload?:
    | (GmailPart & {
        headers?: GmailHeader[];
      })
    | null;
}): ParsedGmailMessage | null {
  if (!message.id) {
    return null;
  }

  const headers = message.payload?.headers ?? [];

  function getHeader(name: string) {
    return headers.find((header) => header.name?.toLowerCase() === name.toLowerCase())?.value ?? '';
  }

  return {
    messageId: message.id,
    from: getHeader('From'),
    subject: getHeader('Subject'),
    date: getHeader('Date'),
    body: message.payload ? stripHtml(extractBody(message.payload)) : '',
  };
}
