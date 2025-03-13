CREATE TYPE "public"."type" AS ENUM('email', 'google', 'github');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('member', 'admin');--> statement-breakpoint
CREATE TABLE "gf_user" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text,
	"emailVerified" timestamp,
	CONSTRAINT "gf_user_email_unique" UNIQUE("email")
);
