import { z } from 'zod';
import { db } from '../db.js';
import { applications } from '../db/schema.js';
import { createApplicationSchema } from '../schemas/application.schema.js';
import { eq, and } from 'drizzle-orm';
import { updateApplicationSchema } from '../schemas/update-application.schema.js';

export type CreateApplicationInput = z.infer<typeof createApplicationSchema> & {
  userId: string;
  sourceMessageId?: string;
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
      sourceMessageId: input.sourceMessageId,
    })
    .returning();

  if (!application) {
    throw new Error('Failed to create application');
  }

  return application;
}

export async function getApplications(userId: string) {
  return db.select().from(applications).where(eq(applications.userId, userId));
}

export async function getApplicationById(applicationId: string, userId: string) {
  const [application] = await db
    .select()
    .from(applications)
    .where(and(eq(applications.id, applicationId), eq(applications.userId, userId)))
    .limit(1);

  return application;
}

export async function updateApplication(
  applicationId: string,
  userId: string,
  input: z.infer<typeof updateApplicationSchema>,
) {
  const [application] = await db
    .update(applications)
    .set({
      ...input,
      appliedAt: input.appliedAt ? new Date(input.appliedAt) : undefined,
    })
    .where(and(eq(applications.id, applicationId), eq(applications.userId, userId)))
    .returning();

  return application;
}

export async function deleteApplication(applicationId: string, userId: string) {
  const [application] = await db
    .delete(applications)
    .where(and(eq(applications.id, applicationId), eq(applications.userId, userId)))
    .returning();

  return application;
}

export async function getApplicationBySourceMessageId(sourceMessageId: string, userId: string) {
  const [application] = await db
    .select()
    .from(applications)
    .where(and(eq(applications.sourceMessageId, sourceMessageId), eq(applications.userId, userId)))
    .limit(1);

  return application;
}

export async function getApplicationByCompanyAndRole(
  company: string,
  role: string,
  userId: string,
) {
  const [application] = await db
    .select()
    .from(applications)
    .where(
      and(
        eq(applications.company, company),
        eq(applications.role, role),
        eq(applications.userId, userId),
      ),
    )
    .limit(1);

  return application;
}

export async function getApplicationsByCompany(company: string, userId: string) {
  return db
    .select()
    .from(applications)
    .where(and(eq(applications.company, company), eq(applications.userId, userId)));
}

export async function getApplicationsByUser(userId: string) {
  return db.select().from(applications).where(eq(applications.userId, userId));
}
