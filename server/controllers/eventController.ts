// server/controllers/eventController.ts
import { Request, Response } from 'express';
import { db } from '../db';
import {
  companies,
  investors,
  fundingRounds,
  investments,
} from '../../shared/schema';
import {
  sql,
  eq,
  ilike,
  and,
  gte,
  lte,
  or,
  exists,          // ← NEW
} from 'drizzle-orm';

export const searchEventsController = async (req: Request, res: Response) => {
  try {
    console.log('\n--- [API] Received Search Request ---');
    console.log('Query Params:', req.query);

    const {
      // free-text & explicit filters
      searchTerm,
      companyName,
      investorName,
      stage,
      sector,
      country,
      tags,
      // date range
      startDate,
      endDate,
    } = req.query;

    /* ------------------------------------------------------------------ */
    /* 1. Build the base SELECT                                           */
    /* ------------------------------------------------------------------ */
    const query = db
      .select({
        EventID: fundingRounds.id,
        CompanyName: companies.name,
        FundingDate: fundingRounds.announcedAt,
        FundingStage: fundingRounds.stage,
        AmountRaisedUSD: fundingRounds.amountUsd,
        LeadInvestors: sql<string>`string_agg(${investors.name}, ', ')`.as(
          'lead_investors'
        ),
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

    /* ------------------------------------------------------------------ */
    /* 2. Assemble WHERE / HAVING clauses                                 */
    /* ------------------------------------------------------------------ */
    const whereConditions: any[] = [];
    const havingConditions: any[] = [];

    /* ---- Free-text search across multiple fields (WHERE) ---- */
    if (searchTerm) {
      const term = `%${searchTerm}%`;
      whereConditions.push(
        or(
          ilike(companies.name, term),
          ilike(companies.industry, term),
          ilike(companies.country, term),
          ilike(companies.problemStatement, term),
          ilike(companies.tags, term),
          exists(
            db
              .select()
              .from(investors)
              .innerJoin(
                investments,
                eq(investments.investorId, investors.id)
              )
              .where(
                and(
                  eq(investments.fundingRoundId, fundingRounds.id),
                  ilike(investors.name, term)
                )
              )
          )
        )
      );
    }

    /* ---- Standard field filters (WHERE) ---- */
    if (companyName)
      whereConditions.push(ilike(companies.name, `%${companyName}%`));
    if (stage) whereConditions.push(eq(fundingRounds.stage, stage as string));
    if (sector) whereConditions.push(eq(companies.industry, sector as string));
    if (country) whereConditions.push(eq(companies.country, country as string));

    /* ---- Date range (WHERE) ---- */
    if (startDate)
      whereConditions.push(gte(fundingRounds.announcedAt, startDate as string));
    if (endDate)
      whereConditions.push(lte(fundingRounds.announcedAt, endDate as string));

    /* ---- Multi-select tags (WHERE) ---- */
    if (tags) {
      (tags as string).split(',').forEach((tag) => {
        whereConditions.push(ilike(companies.tags, `%${tag.trim()}%`));
      });
    }

    /* ---- Aggregated investor filter (HAVING) ---- */
    if (investorName) {
      havingConditions.push(
        ilike(
          sql<string>`string_agg(${investors.name}, ', ')`,
          `%${investorName}%`
        )
      );
    }

    /* ---- Attach WHERE & HAVING to the query ---- */
    if (whereConditions.length) query.where(and(...whereConditions));
    if (havingConditions.length) query.having(and(...havingConditions));

    /* ------------------------------------------------------------------ */
    /* 3. Execute & respond                                               */
    /* ------------------------------------------------------------------ */
    const results = await query;
    console.log(`Query successful, found ${results.length} results.`);
    console.log('--- [API] Request Finished ---\n');

    res.status(200).json(results);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
