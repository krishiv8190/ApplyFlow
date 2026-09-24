import { pgEnum, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
export const applicationStatus = pgEnum('application_status', [
  'Applied',
  'Screening',
  'OA',
  'Interview',
  'Offer',
  'Rejected',
  'Ghosted',
]);

export const applicationSource = pgEnum('application_source', [
  'Gmail',
  'Manual',
  'Referral',
  'LinkedIn',
]);

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),

  email: text('email').notNull().unique(),

  passwordHash: text('password_hash').notNull(),

  firstName: varchar('first_name', { length: 255 }).notNull(),

  lastName: varchar('last_name', { length: 255 }).notNull(),
});

export const gmailConnections = pgTable('gmail_connections', {
  id: uuid('id').primaryKey().defaultRandom(),

  userId: uuid('user_id')
    .notNull()
    .unique()
    .references(() => users.id),

  googleEmail: text('google_email').notNull(),

  refreshToken: text('refresh_token').notNull(),

  createdAt: timestamp('created_at', {
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),

  updatedAt: timestamp('updated_at', {
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),
});

export const applications = pgTable('applications', {
  id: uuid('id').primaryKey().defaultRandom(),

  userId: uuid('user_id')
    .notNull()
    .references(() => users.id),

  company: varchar('company', { length: 255 }).notNull(),

  role: varchar('role', { length: 255 }).notNull(),

  location: varchar('location', { length: 255 }),

  source: applicationSource('source').notNull(),

  status: applicationStatus('status').notNull(),

  appliedAt: timestamp('applied_at', {
    withTimezone: true,
  }).notNull(),

  url: text('url'),

  notes: text('notes'),

  sourceMessageId: text('source_message_id'),
});
