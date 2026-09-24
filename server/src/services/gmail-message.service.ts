import { google } from 'googleapis';

import { getGmailConnection } from './gmail-connection.service.js';
import { parseGmailMessage } from './gmail-parser.service.js';

export async function getGmailClient(userId: string) {
  const connection = await getGmailConnection(userId);

  if (!connection) {
    throw new Error('Gmail is not connected');
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error('Google OAuth environment variables are not configured');
  }

  const oauthClient = new google.auth.OAuth2(clientId, clientSecret, redirectUri);

  oauthClient.setCredentials({
    refresh_token: connection.refreshToken,
  });

  return google.gmail({
    version: 'v1',
    auth: oauthClient,
  });
}

export async function listJobEmails(userId: string) {
  const gmail = await getGmailClient(userId);

  const response = await gmail.users.messages.list({
    userId: 'me',
    maxResults: 20,
    q: ['newer_than:30d', '(application OR interview OR assessment OR recruiter OR hiring)'].join(
      ' ',
    ),
  });

  const messages = response.data.messages ?? [];

  const fullMessages = await Promise.all(
    messages.map((message) => (message.id ? getGmailMessage(userId, message.id) : null)),
  );

  return fullMessages
    .map((message) => (message ? parseGmailMessage(message) : null))
    .filter((message) => message !== null);
}

export async function getGmailMessage(userId: string, messageId: string) {
  const gmail = await getGmailClient(userId);

  const response = await gmail.users.messages.get({
    userId: 'me',
    id: messageId,
    format: 'full',
  });

  return response.data;
}
