CREATE TABLE "investments" (
	"id" serial PRIMARY KEY NOT NULL,
	"funding_round_id" integer NOT NULL,
	"investor_id" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "funding_rounds" DROP CONSTRAINT "funding_rounds_investor_id_investors_id_fk";
--> statement-breakpoint
ALTER TABLE "investments" ADD CONSTRAINT "investments_funding_round_id_funding_rounds_id_fk" FOREIGN KEY ("funding_round_id") REFERENCES "public"."funding_rounds"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "investments" ADD CONSTRAINT "investments_investor_id_investors_id_fk" FOREIGN KEY ("investor_id") REFERENCES "public"."investors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "funding_rounds" DROP COLUMN "investor_id";