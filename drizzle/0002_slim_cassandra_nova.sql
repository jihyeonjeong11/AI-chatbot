CREATE TABLE "gf_membership" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" serial NOT NULL,
	"groupId" serial NOT NULL,
	"role" "role" DEFAULT 'member'
);
--> statement-breakpoint
CREATE TABLE "gf_reset_tokens" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" serial NOT NULL,
	"token" text,
	"tokenExpiresAt" timestamp,
	CONSTRAINT "gf_reset_tokens_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
CREATE TABLE "gf_session" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" serial NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
ALTER TABLE "gf_membership" ADD CONSTRAINT "gf_membership_userId_gf_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."gf_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gf_membership" ADD CONSTRAINT "gf_membership_groupId_gf_group_id_fk" FOREIGN KEY ("groupId") REFERENCES "public"."gf_group"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gf_reset_tokens" ADD CONSTRAINT "gf_reset_tokens_userId_gf_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."gf_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gf_session" ADD CONSTRAINT "gf_session_userId_gf_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."gf_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "memberships_user_id_group_id_idx" ON "gf_membership" USING btree ("userId","groupId");--> statement-breakpoint
CREATE INDEX "reset_tokens_token_idx" ON "gf_reset_tokens" USING btree ("token");--> statement-breakpoint
CREATE INDEX "sessions_user_id_idx" ON "gf_session" USING btree ("userId");