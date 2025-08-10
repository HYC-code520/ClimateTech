// server/db/seed.ts

import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
const { Pool } = pg;
import * as schema from '../../shared/schema';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Use Supabase PostgreSQL connection string
const connectionString = process.env.SUPABASE_DB_URL;

if (!connectionString) {
  throw new Error('SUPABASE_DB_URL environment variable is not set!');
}

const pool = new Pool({ 
  connectionString,
  ssl: {
    rejectUnauthorized: false
  },
  max: 1, // Use only 1 connection for seeding
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
const db = drizzle(pool, { schema });

async function main() {
  console.log('Seeding database...');
  
  try {
    // Test the connection first
    const client = await pool.connect();
    console.log('Successfully connected to database');
    client.release();

    // --- Clear existing data in the correct order ---
  await db.delete(schema.investments);
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
  const [fr1, fr2, fr3, fr4] = await db.insert(schema.fundingRounds).values([
    { companyId: c1.id, stage: 'Series B', amountUsd: 82000000, announcedAt: '2025-03-04', sourceUrl: 'https://example.com/1' },
    { companyId: c2.id, stage: 'Series A', amountUsd: 12000000, announcedAt: '2025-02-18', sourceUrl: 'https://example.com/2' },
    { companyId: c3.id, stage: 'Series A', amountUsd: 25000000, announcedAt: '2025-01-20', sourceUrl: 'https://example.com/3' },
    { companyId: c1.id, stage: 'Series C', amountUsd: 150000000, announcedAt: '2025-05-10', sourceUrl: 'https://example.com/4' },
  ]).returning();
  
  console.log('Seeded Funding Rounds.');

  // --- Seed Investments (linking investors to rounds) ---
  await db.insert(schema.investments).values([
    // Round 1 (Terra B)
    { fundingRoundId: fr1.id, investorId: i1.id },
    // Round 2 (VerdeGo A)
    { fundingRoundId: fr2.id, investorId: i2.id },
    // Round 3 (SunSpark A)
    { fundingRoundId: fr3.id, investorId: i3.id },
    // Round 4 (Terra C)
    { fundingRoundId: fr4.id, investorId: i3.id },
  ]);
  
  console.log('Seeded Investments.');

    console.log('Database seeding complete!');
    await pool.end(); // Close the connection
  } catch (err) {
    console.error('Error during seeding:', err);
    process.exit(1);
  }
}

main();
