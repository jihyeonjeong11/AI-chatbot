CREATE TABLE "gf_verify_email_tokens" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" serial NOT NULL,
	"token" text,
	"tokenExpiresAt" timestamp,
	CONSTRAINT "gf_verify_email_tokens_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
ALTER TABLE "gf_verify_email_tokens" ADD CONSTRAINT "gf_verify_email_tokens_userId_gf_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."gf_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "verify_email_tokens_token_idx" ON "gf_verify_email_tokens" USING btree ("token");