import { sql } from "drizzle-orm";
import { pgTable, text, varchar, boolean, timestamp, serial, integer, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const companies = pgTable('companies', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 256 }).notNull().unique(),
  country: varchar('country', { length: 100 }),
  industry: varchar('industry', { length: 100 }),      // ClimateTechSector
  problemStatement: text('problem_statement'),        // Problem
  impactMetric: varchar('impact_metric', { length: 256 }), // ImpactMetric
  tags: varchar('tags', { length: 512 }),             // Tags (comma-separated string)
});

export const investors = pgTable('investors', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 256 }).notNull().unique(),
});

export const fundingRounds = pgTable('funding_rounds', {
  id: serial('id').primaryKey(),
  companyId: integer('company_id').notNull().references(() => companies.id),
  stage: varchar('stage', { length: 50 }),
  amountUsd: integer('amount_usd'),
  announcedAt: date('announced_at'),
  sourceUrl: varchar('source_url', { length: 512 }),
});

// NEW "join" table to link investors to a funding round
export const investments = pgTable('investments', {
  id: serial('id').primaryKey(),
  fundingRoundId: integer('funding_round_id').notNull().references(() => fundingRounds.id),
  investorId: integer('investor_id').notNull().references(() => investors.id),
});

export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  password: true,
});

export const loginSchema = insertUserSchema;
export const signupSchema = insertUserSchema;

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type LoginData = z.infer<typeof loginSchema>;
export type SignupData = z.infer<typeof signupSchema>;
