import { google } from 'googleapis';
import jwt from 'jsonwebtoken';

const GMAIL_SCOPE = 'https://www.googleapis.com/auth/gmail.readonly';

function getGoogleOAuthClient() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error('Google OAuth environment variables are not configured');
  }

  return new google.auth.OAuth2(clientId, clientSecret, redirectUri);
}

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET is not configured');
  }

  return secret;
}

export function createGmailOAuthState(userId: string) {
  return jwt.sign({ userId }, getJwtSecret(), { expiresIn: '10m' });
}

export function verifyGmailOAuthState(state: string) {
  const decoded = jwt.verify(state, getJwtSecret());

  if (typeof decoded !== 'object' || decoded === null || typeof decoded.userId !== 'string') {
    throw new Error('Invalid Gmail OAuth state');
  }

  return decoded.userId;
}

export function getGmailAuthorizationUrl(state: string) {
  const oauthClient = getGoogleOAuthClient();

  return oauthClient.generateAuthUrl({
    access_type: 'offline',
    scope: [GMAIL_SCOPE],
    state,
    prompt: 'consent',
  });
}

export async function exchangeGmailCode(code: string) {
  const oauthClient = getGoogleOAuthClient();

  const { tokens } = await oauthClient.getToken(code);

  if (!tokens.refresh_token) {
    throw new Error('Google did not return a refresh token');
  }

  oauthClient.setCredentials(tokens);

  const gmail = google.gmail({
    version: 'v1',
    auth: oauthClient,
  });

  const profile = await gmail.users.getProfile({
    userId: 'me',
  });

  if (!profile.data.emailAddress) {
    throw new Error('Unable to determine Gmail address');
  }

  return {
    email: profile.data.emailAddress,
    refreshToken: tokens.refresh_token,
  };
}
