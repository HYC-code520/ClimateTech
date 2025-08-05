// server/controllers/eventController.ts

import { Request, Response } from 'express';
import { db } from '../db'; // Assuming your Drizzle instance is exported from 'server/db/index.ts'
import { companies, investors, fundingRounds } from '../../shared/schema';
import { sql, eq, ilike, and, gte, lte } from 'drizzle-orm'; // Import gte and lte for date ranges

export const searchEventsController = async (req: Request, res: Response) => {
  try {
    const { 
        companyName, investorName, stage, sector, country, tags,
        startDate, // NEW: For Date Range
        endDate    // NEW: For Date Range
    } = req.query;

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

    // --- Standard Filters ---
    if (companyName) conditions.push(ilike(companies.name, `%${companyName}%`));
    if (investorName) conditions.push(ilike(investors.name, `%${investorName}%`));
    if (stage) conditions.push(eq(fundingRounds.stage, stage as string));
    if (sector) conditions.push(eq(companies.industry, sector as string));
    if (country) conditions.push(eq(companies.country, country as string));

    // --- UPGRADE 1: Date Range Filter ---
    if (startDate) {
      conditions.push(gte(fundingRounds.announcedAt, startDate as string));
    }
    if (endDate) {
      conditions.push(lte(fundingRounds.announcedAt, endDate as string));
    }

    // --- UPGRADE 2: Multi-Select Tags Filter ---
    if (tags) {
      // Split the comma-separated string into an array of tags
      const tagList = (tags as string).split(',');
      // Add a condition for EACH tag, ensuring the company has all of them
      tagList.forEach(tag => {
        conditions.push(ilike(companies.tags, `%${tag.trim()}%`));
      });
    }

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
