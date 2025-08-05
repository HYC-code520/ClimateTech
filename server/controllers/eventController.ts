// server/controllers/eventController.ts

import { Request, Response } from 'express';
import { db } from '../db'; // Assuming your Drizzle instance is exported from 'server/db/index.ts'
import { companies, investors, fundingRounds } from '../../shared/schema';
import { sql, eq, ilike, and } from 'drizzle-orm';

export const searchEventsController = async (req: Request, res: Response) => {
  try {
    // --- 1. Get Query Parameters from the URL ---
    const { companyName, investorName, stage, sector, country, tags } = req.query;

    // --- 2. Build the Database Query Dynamically ---
    // Start with the base query that connects all the tables
    let query = db
      .select({
        // Select all the fields defined in our API Contract
        EventID: fundingRounds.id,
        CompanyName: companies.name,
        FundingDate: fundingRounds.announcedAt,
        FundingStage: fundingRounds.stage,
        AmountRaisedUSD: fundingRounds.amountUsd,
        LeadInvestors: investors.name,
        ClimateTechSector: companies.industry,
        Country: companies.country,
        SourceURL: fundingRounds.sourceUrl,
        Problem: companies.problemStatement,
        ImpactMetric: companies.impactMetric,
        Tags: companies.tags,
      })
      .from(fundingRounds)
      .leftJoin(companies, eq(fundingRounds.companyId, companies.id))
      .leftJoin(investors, eq(fundingRounds.investorId, investors.id));

    // Create a list of conditions to apply to the query
    const conditions = [];

    if (companyName) {
      conditions.push(ilike(companies.name, `%${companyName}%`));
    }
    if (investorName) {
      conditions.push(ilike(investors.name, `%${investorName}%`));
    }
    if (stage) {
      conditions.push(eq(fundingRounds.stage, stage as string));
    }
    if (sector) {
      conditions.push(eq(companies.industry, sector as string));
    }
    if (country) {
      conditions.push(eq(companies.country, country as string));
    }
    if (tags) {
      conditions.push(ilike(companies.tags, `%${tags}%`));
    }

    // Apply the conditions if any exist
    if (conditions.length > 0) {
      query.where(and(...conditions));
    }

    // --- 3. Execute the Query ---
    const results = await query;

    // --- 4. Send the Response ---
    res.status(200).json(results);

  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
