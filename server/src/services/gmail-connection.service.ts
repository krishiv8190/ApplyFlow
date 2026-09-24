import { eq } from 'drizzle-orm';

import { db } from '../db.js';
import { gmailConnections } from '../db/schema.js';

interface SaveGmailConnectionInput {
  userId: string;
  googleEmail: string;
  refreshToken: string;
}

export async function saveGmailConnection(input: SaveGmailConnectionInput) {
  const [connection] = await db
    .insert(gmailConnections)
    .values({
      userId: input.userId,
      googleEmail: input.googleEmail,
      refreshToken: input.refreshToken,
    })
    .onConflictDoUpdate({
      target: gmailConnections.userId,
      set: {
        googleEmail: input.googleEmail,
        refreshToken: input.refreshToken,
        updatedAt: new Date(),
      },
    })
    .returning({
      id: gmailConnections.id,
      googleEmail: gmailConnections.googleEmail,
    });

  return connection;
}

export async function getGmailConnection(userId: string) {
  const [connection] = await db
    .select()
    .from(gmailConnections)
    .where(eq(gmailConnections.userId, userId))
    .limit(1);

  return connection;
}
