// server/scripts/removeSpecificRecords.ts

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function removeSpecificRecords() {
  const companiesToRemove = [
    'Climeworks',
    'Terra CO2 Technology',
    'HIVED',
    'Dexter Energy',
    'Steady Energy',
    'Emerald AI',
    'AssetCool',
    'Tibo Energy',
    'Eeki Foods',
    'Vok Bikes',
    'Woodchuck',
    'Crosstown H2R',
    'Cosma',
    'SDS Separation',
    'Currentt',
    'FieldFactors',
    'eMotion Fleet',
    'Tarnoc'
  ];

  console.log('Removing specific companies and their related records...');

  try {
    // First, get the company IDs for these companies
    const { data: companies, error: companiesError } = await supabase
      .from('companies')
      .select('id, name')
      .in('name', companiesToRemove);

    if (companiesError) {
      throw companiesError;
    }

    if (!companies || companies.length === 0) {
      console.log('No matching companies found to remove');
      return;
    }

    console.log(`Found ${companies.length} companies to remove:`, companies.map(c => c.name));

    const companyIds = companies.map(c => c.id);

    // Get funding round IDs for these companies
    const { data: fundingRounds, error: fundingRoundsError } = await supabase
      .from('funding_rounds')
      .select('id')
      .in('company_id', companyIds);

    if (fundingRoundsError) {
      throw fundingRoundsError;
    }

    const fundingRoundIds = fundingRounds?.map(fr => fr.id) || [];

    // Delete in the correct order (due to foreign key constraints)
    
    // 1. Delete investments first
    if (fundingRoundIds.length > 0) {
      const { error: investmentsError } = await supabase
        .from('investments')
        .delete()
        .in('funding_round_id', fundingRoundIds);

      if (investmentsError) {
        throw investmentsError;
      }
      console.log(`Deleted investments for ${fundingRoundIds.length} funding rounds`);
    }

    // 2. Delete funding rounds
    const { error: fundingRoundsDeleteError } = await supabase
      .from('funding_rounds')
      .delete()
      .in('company_id', companyIds);

    if (fundingRoundsDeleteError) {
      throw fundingRoundsDeleteError;
    }
    console.log(`Deleted funding rounds for ${companyIds.length} companies`);

    // 3. Delete companies
    const { error: companiesDeleteError } = await supabase
      .from('companies')
      .delete()
      .in('id', companyIds);

    if (companiesDeleteError) {
      throw companiesDeleteError;
    }
    console.log(`Deleted ${companyIds.length} companies`);

    console.log('Successfully removed all specified records!');

  } catch (error) {
    console.error('Error removing records:', error);
    process.exit(1);
  }
}

removeSpecificRecords();
