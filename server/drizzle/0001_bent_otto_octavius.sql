ALTER TABLE "applications" ALTER COLUMN "source" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."application_source";--> statement-breakpoint
CREATE TYPE "public"."application_source" AS ENUM('Gmail', 'Manual', 'Referral', 'LinkedIn');--> statement-breakpoint
ALTER TABLE "applications" ALTER COLUMN "source" SET DATA TYPE "public"."application_source" USING "source"::"public"."application_source";--> statement-breakpoint
ALTER TABLE "applications" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."application_status";--> statement-breakpoint
CREATE TYPE "public"."application_status" AS ENUM('Applied', 'Screening', 'OA', 'Interview', 'Offer', 'Rejected', 'Ghosted');--> statement-breakpoint
ALTER TABLE "applications" ALTER COLUMN "status" SET DATA TYPE "public"."application_status" USING "status"::"public"."application_status";