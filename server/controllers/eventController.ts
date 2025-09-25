// server/controllers/eventController.ts

import { Request, Response } from 'express';
import { supabase } from '../db/supabase';

// Type definitions for Supabase response
type SupabaseResponse = {
  id: number;
  announced_at: string;
  stage: string;
  amount_usd: number;
  source_url: string;
  companies: {
    name: string;
    industry: string;
    country: string;
    problem_statement: string;
    impact_metric: string;
    tags: string;
  };
  investments: Array<{
    investors: {
      name: string;
    };
  }>;
};

export const searchEventsController = async (req: Request, res: Response) => {
  try {
    console.log("\n--- [API] Received Search Request ---");
    console.log("Query Params:", req.query);

    const { 
        searchTerm, // Universal search parameter
        companyName, investorName, stage, sector, country, tags, // Keep existing for compatibility
        startDate,
        endDate,
        sortOrder // 'asc' or 'desc'
    } = req.query;

    // Start building the query
    let query = supabase
      .from('funding_rounds')
      .select(`
        id,
        announced_at,
        stage,
        amount_usd,
        source_url,
        companies!inner (
          name,
          industry,
          country,
          problem_statement,
          impact_metric,
          tags
        ),
        investments (
          investors (
            name
          )
        )
      `);

    // Apply filters
    if (searchTerm) {
      query = query.or(`companies.name.ilike.%${searchTerm}%,companies.industry.ilike.%${searchTerm}%,investments.investors.name.ilike.%${searchTerm}%`);
    }

    if (companyName) {
      query = query.ilike('companies.name', `%${companyName}%`);
    }

    if (stage) {
      query = query.eq('stage', stage);
    }

    if (sector) {
      query = query.ilike('companies.industry', `%${sector}%`);
    }

    if (country) {
      query = query.ilike('companies.country', `%${country}%`);
    }

    if (startDate) {
      query = query.gte('announced_at', startDate);
    }

    if (endDate) {
      query = query.lte('announced_at', endDate);
    }

    // For tag filtering
    if (tags) {
      const tagList = (tags as string).split(',');
      tagList.forEach(tag => {
        query = query.ilike('companies.tags', `%${tag.trim()}%`);
      });
    }

    // For specific investor filtering
    if (investorName) {
      query = query.ilike('investments.investors.name', `%${investorName}%`);
    }

    // Apply sorting
    query = query.order('announced_at', { ascending: sortOrder === 'asc' });

    // Execute the query
    const { data: results, error } = await query.returns<SupabaseResponse[]>();

    if (error) {
      console.error('Query Error:', error);
      return res.status(500).json({ message: 'Database query error' });
    }

    // Transform the results to match the expected format
    const transformedResults = results?.map((event: any) => ({
      EventID: event.id,
      CompanyName: event.companies.name,
      FundingDate: event.announced_at,
      FundingStage: event.stage,
      AmountRaisedUSD: event.amount_usd,
      LeadInvestors: event.investments?.map((inv: any) => inv.investors.name).join(', ') || '',
      ClimateTechSector: event.companies.industry,
      Country: event.companies.country,
      SourceURL: event.source_url,
      Problem: event.companies.problem_statement,
      ImpactMetric: event.companies.impact_metric,
      Tags: event.companies.tags
    }));

    console.log(`Query successful, found ${transformedResults.length} results.`);
    console.log('First result (if any):', transformedResults[0]);
    console.log("--- [API] Request Finished ---\n");

    res.status(200).json(transformedResults);

  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
