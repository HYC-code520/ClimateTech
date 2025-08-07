// server/controllers/eventController.ts

import { Request, Response } from 'express';
import { db } from '../db';
import { companies, investors, fundingRounds, investments } from '../../shared/schema';
import { eq, and, or, ilike, sql, exists } from 'drizzle-orm'; // Add missing imports

export const searchEventsController = async (req: Request, res: Response) => {
  try {
    const { 
      searchTerm,
      stage, sector, country, tags,
      startDate,
      endDate
    } = req.query;

    // Build the base query
    let query = db
      .select({
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

    const whereConditions = [];

    // Add search conditions
    if (searchTerm) {
      whereConditions.push(
        or(
          ilike(companies.name, `%${searchTerm}%`),
          ilike(companies.industry, `%${searchTerm}%`),
          ilike(companies.country, `%${searchTerm}%`),
          ilike(companies.problemStatement || '', `%${searchTerm}%`),
          ilike(companies.tags || '', `%${searchTerm}%`),
          exists(
            db.select()
              .from(investors)
              .innerJoin(investments, eq(investments.investorId, investors.id))
              .where(and(
                eq(investments.fundingRoundId, fundingRounds.id),
                ilike(investors.name, `%${searchTerm}%`)
              ))
          )
        )
      );
    }

    // Add other filters
    if (stage) whereConditions.push(eq(fundingRounds.stage, stage as string));
    if (sector) whereConditions.push(eq(companies.industry, sector as string));
    if (country) whereConditions.push(eq(companies.country, country as string));

    // Apply WHERE conditions if any exist
    if (whereConditions.length > 0) {
      query = query.where(and(...whereConditions));
    }

    // Add GROUP BY
    query = query.groupBy(
      fundingRounds.id,
      companies.name,
      companies.industry,
      companies.country,
      companies.problemStatement,
      companies.impactMetric,
      companies.tags
    );

    // Execute the query
    const results = await query;
    
    res.json(results);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
