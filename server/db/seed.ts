// server/db/seed.ts

import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
const { Pool } = pg;
import * as schema from '../../shared/schema';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// IMPORTANT: Use your actual Neon connection string from your environment variables
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set!');
}

const pool = new Pool({ connectionString });
const db = drizzle(pool, { schema });

async function main() {
  console.log('Seeding database...');

  // --- Clear existing data to prevent duplicates ---
  await db.delete(schema.fundingRounds);
  await db.delete(schema.companies);
  await db.delete(schema.investors);
  console.log('Cleared existing data.');

  // --- Seed Investors ---
  const [i1, i2, i3] = await db.insert(schema.investors).values([
    { name: 'Breakthrough Energy Ventures' },
    { name: 'S2G Ventures' },
    { name: 'Lowercarbon Capital' },
  ]).returning(); // .returning() gets the inserted rows back with their IDs

  // --- Seed Companies ---
  const [c1, c2, c3] = await db.insert(schema.companies).values([
    { name: 'Terra CO2 Technology', country: 'USA', industry: 'Industry', problemStatement: 'High emissions from cement.', impactMetric: 'tCO2e abated', tags: 'Hardware,B2B' },
    { name: 'VerdeGo', country: 'USA', industry: 'Food & Agriculture', problemStatement: 'Inefficient water use in farming.', impactMetric: 'Water saved', tags: 'SaaS,AI/ML' },
    { name: 'SunSpark Homes', country: 'Germany', industry: 'Energy', problemStatement: 'High cost of residential solar.', impactMetric: 'kWh generated', tags: 'B2C,Fintech' },
  ]).returning();
  
  console.log('Seeded Companies and Investors.');

  // --- Seed Funding Rounds (The Events) ---
  await db.insert(schema.fundingRounds).values([
    { companyId: c1.id, investorId: i1.id, stage: 'Series B', amountUsd: 82000000, announcedAt: '2025-03-04', sourceUrl: 'https://example.com/1' },
    { companyId: c2.id, investorId: i2.id, stage: 'Series A', amountUsd: 12000000, announcedAt: '2025-02-18', sourceUrl: 'https://example.com/2' },
    { companyId: c3.id, investorId: i3.id, stage: 'Series A', amountUsd: 25000000, announcedAt: '2025-01-20', sourceUrl: 'https://example.com/3' },
    { companyId: c1.id, investorId: i3.id, stage: 'Series C', amountUsd: 150000000, announcedAt: '2025-05-10', sourceUrl: 'https://example.com/4' },
  ]);
  
  console.log('Seeded Funding Rounds.');

  console.log('Database seeding complete!');
  await pool.end(); // Close the connection
}

main().catch((err) => {
  console.error('Error during seeding:', err);
  process.exit(1);
});
