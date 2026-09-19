import { z } from 'zod';
import { db } from '../db.js';
import { applications } from '../db/schema.js';
import { createApplicationSchema } from '../schemas/application.schema.js';

export type CreateApplicationInput = z.infer<typeof createApplicationSchema> & {
  userId: string;
};

export async function createApplication(input: CreateApplicationInput) {
  const [application] = await db
    .insert(applications)
    .values({
      userId: input.userId,
      company: input.company,
      role: input.role,
      location: input.location,
      source: input.source,
      status: input.status,
      appliedAt: new Date(input.appliedAt),
      url: input.url,
      notes: input.notes,
    })
    .returning();

  return application;
}
