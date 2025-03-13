CREATE TABLE "gf_accounts" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" serial NOT NULL,
	"accountType" "type" NOT NULL,
	"githubId" text,
	"googleId" text,
	"password" text,
	"salt" text,
	CONSTRAINT "gf_accounts_githubId_unique" UNIQUE("githubId"),
	CONSTRAINT "gf_accounts_googleId_unique" UNIQUE("googleId")
);
--> statement-breakpoint
CREATE TABLE "gf_group" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" serial NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"isPublic" boolean DEFAULT false NOT NULL,
	"bannerId" text,
	"info" text DEFAULT '',
	"youtubeLink" text DEFAULT '',
	"discordLink" text DEFAULT '',
	"githubLink" text DEFAULT '',
	"xLink" text DEFAULT ''
);
--> statement-breakpoint
CREATE TABLE "gf_profile" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" serial NOT NULL,
	"displayName" text,
	"imageId" text,
	"image" text,
	"bio" text DEFAULT '' NOT NULL,
	CONSTRAINT "gf_profile_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
ALTER TABLE "gf_accounts" ADD CONSTRAINT "gf_accounts_userId_gf_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."gf_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gf_group" ADD CONSTRAINT "gf_group_userId_gf_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."gf_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gf_profile" ADD CONSTRAINT "gf_profile_userId_gf_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."gf_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "user_id_account_type_idx" ON "gf_accounts" USING btree ("userId","accountType");--> statement-breakpoint
CREATE INDEX "groups_user_id_is_public_idx" ON "gf_group" USING btree ("userId","isPublic");