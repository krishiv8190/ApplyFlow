import { describe, expect, it } from 'vitest';

import { classifyGmailMessage } from './gmail-classifier.service.js';
import { extractGmailApplication } from './gmail-extractor.service.js';

const appleMessage = {
  messageId: 'test-apple-001',
  threadId: 'test-thread-001',
  from: 'Apple Worldwide Recruiting <appleworldwiderecruiting@email.apple.com>',
  to: 'test@example.com',
  subject: 'Thanks for your interest in Apple.',
  date: '2026-09-22T23:04:00.000Z',
  body: `
Hi Krishiv,

We just received your resume for the following role: Software Engineer - Java, Spring Boot and Microservices 200677836. Thanks for thinking of us.

Here's what happens next: If you're a potential match for the role, you'll hear from one of our recruiters.
  `,
};

describe('Gmail application extraction', () => {
  it('detects an Apple application confirmation email', () => {
    const classified = classifyGmailMessage(appleMessage);

    expect(classified).not.toBeNull();
    expect(classified?.status).toBe('Applied');

    const extracted = extractGmailApplication(appleMessage);
    expect(extracted.company).toBe('Apple Worldwide Recruiting');
    expect(extracted.role).toBe(
      'Software Engineer - Java, Spring Boot and Microservices 200677836',
    );
  });
});
