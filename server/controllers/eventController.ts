// server/controllers/eventController.ts

import { Request, Response } from 'express';
import { db } from '../db';
import { companies, investors, fundingRounds, investments } from '../../shared/schema';
import { sql, eq, ilike, and, gte, lte } from 'drizzle-orm';

export const searchEventsController = async (req: Request, res: Response) => {
  try {
    console.log("\n--- [API] Received Search Request ---");
    console.log("Query Params:", req.query);

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
        LeadInvestors: sql<string>`string_agg(${investors.name}, ', ')`.as('lead_investors'),
        ClimateTechSector: companies.industry,
        Country: companies.country,
        SourceURL: fundingRounds.sourceUrl,
        Problem: companies.problemStatement,
        ImpactMetric: companies.impactMetric,
        Tags: companies.tags,
      })
      .from(fundingRounds)
      .leftJoin(companies, eq(fundingRounds.companyId, companies.id))
      .leftJoin(investments, eq(fundingRounds.id, investments.fundingRoundId))
      .leftJoin(investors, eq(investments.investorId, investors.id))
      .groupBy(
        fundingRounds.id, 
        companies.name, 
        companies.industry, 
        companies.country, 
        companies.problemStatement, 
        companies.impactMetric, 
        companies.tags
      );

    // Create two lists of conditions for WHERE and HAVING clauses
    const whereConditions = [];
    const havingConditions = [];

    // --- Standard Filters (go into WHERE) ---
    if (companyName) whereConditions.push(ilike(companies.name, `%${companyName}%`));
    if (stage) whereConditions.push(eq(fundingRounds.stage, stage as string));
    if (sector) whereConditions.push(eq(companies.industry, sector as string));
    if (country) whereConditions.push(eq(companies.country, country as string));

    // --- Aggregate Filter (goes into HAVING) ---
    if (investorName) {
      havingConditions.push(ilike(sql<string>`string_agg(${investors.name}, ', ')`, `%${investorName as string}%`));
    }

    // --- Date Range Filters (go into WHERE) ---
    if (startDate) {
      whereConditions.push(gte(fundingRounds.announcedAt, startDate as string));
    }
    if (endDate) {
      whereConditions.push(lte(fundingRounds.announcedAt, endDate as string));
    }

    // --- Multi-Select Tags Filter (goes into WHERE) ---
    if (tags) {
      const tagList = (tags as string).split(',');
      tagList.forEach(tag => {
        whereConditions.push(ilike(companies.tags, `%${tag.trim()}%`));
      });
    }

    // --- 3. Execute the Query ---
    const queryBuilder = db.select({
        EventID: fundingRounds.id,
        CompanyName: companies.name,
        FundingDate: fundingRounds.announcedAt,
        FundingStage: fundingRounds.stage,
        AmountRaisedUSD: fundingRounds.amountUsd,
        LeadInvestors: sql<string>`string_agg(${investors.name}, ', ')`.as('lead_investors'),
        ClimateTechSector: companies.industry,
        Country: companies.country,
        SourceURL: fundingRounds.sourceUrl,
        Problem: companies.problemStatement,
        ImpactMetric: companies.impactMetric,
        Tags: companies.tags,
      })
      .from(fundingRounds)
      .leftJoin(companies, eq(fundingRounds.companyId, companies.id))
      .leftJoin(investments, eq(fundingRounds.id, investments.fundingRoundId))
      .leftJoin(investors, eq(investments.investorId, investors.id));

    if (whereConditions.length > 0) {
      queryBuilder.where(and(...whereConditions));
    }

    const finalQuery = queryBuilder.groupBy(
        fundingRounds.id, 
        companies.name, 
        companies.industry, 
        companies.country, 
        companies.problemStatement, 
        companies.impactMetric, 
        companies.tags
      );

    if (havingConditions.length > 0) {
      finalQuery.having(and(...havingConditions));
    }
    
    const results = await finalQuery;

    console.log(`Query successful, found ${results.length} results.`);
    console.log("--- [API] Request Finished ---\n");

    // --- 4. Send the Response ---
    res.status(200).json(results);

  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
