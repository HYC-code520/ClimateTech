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
  console.log('Clearing database tables...');
  
  try {
    // Test the connection first
    const client = await pool.connect();
    console.log('Successfully connected to database');
    client.release();

    // --- Clear existing data in the correct order ---
    console.log('Clearing investments table...');
    await db.delete(schema.investments);
    console.log('Clearing funding rounds table...');
    await db.delete(schema.fundingRounds);
    console.log('Clearing companies table...');
    await db.delete(schema.companies);
    console.log('Clearing investors table...');
    await db.delete(schema.investors);
    
    console.log('Successfully cleared all tables!');
    await pool.end(); // Close the connection
  } catch (err) {
    console.error('Error during database clearing:', err);
    process.exit(1);
  }
}

main();
