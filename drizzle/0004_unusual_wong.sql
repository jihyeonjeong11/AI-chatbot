CREATE TABLE "gf_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"groupId" serial NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"imageId" text,
	"startsOn" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "gf_events" ADD CONSTRAINT "gf_events_groupId_gf_group_id_fk" FOREIGN KEY ("groupId") REFERENCES "public"."gf_group"("id") ON DELETE cascade ON UPDATE no action;