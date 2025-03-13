CREATE TABLE "gf_subscriptions" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" serial NOT NULL,
	"stripeSubscriptionId" text NOT NULL,
	"stripeCustomerId" text NOT NULL,
	"stripePriceId" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "gf_subscriptions_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
ALTER TABLE "gf_subscriptions" ADD CONSTRAINT "gf_subscriptions_userId_gf_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."gf_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "subscriptions_stripe_subscription_id_idx" ON "gf_subscriptions" USING btree ("stripeSubscriptionId");