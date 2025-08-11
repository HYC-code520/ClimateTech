import { Request, Response } from 'express';
import { supabase } from '../db/supabase';

// Helper function to sort investors based on sortBy parameter
const sortInvestors = (investors: any[], sortBy: string) => {
  return investors.sort((a: any, b: any) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'mostActive':
        return b.investmentCount - a.investmentCount; // Descending order for most active
      case 'dealCount':
        return b.investmentCount - a.investmentCount; // Same as mostActive
      default:
        return a.name.localeCompare(b.name); // Default to name sorting
    }
  });
};

// Helper function to sort investors with full metrics
const sortInvestorsWithMetrics = (investors: any[], sortBy: string) => {
  return investors.sort((a: any, b: any) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'mostActive':
        return b.investmentCount - a.investmentCount; // Descending order for most active
      case 'dealCount':
        return b.investmentCount - a.investmentCount; // Same as mostActive
      case 'totalInvested':
        return b.totalInvested - a.totalInvested; // Descending order for highest investment
      case 'recentActivity':
        return b.mostRecentInvestment - a.mostRecentInvestment; // Most recent first
      default:
        return a.name.localeCompare(b.name); // Default to name sorting
    }
  });
};

export const getInvestorsWithTimeline = async (req: Request, res: Response) => {
  try {
    console.log("\n--- [API] Fetching Investors with Timeline ---");
    console.log("Query params:", req.query);
    
    // Get pagination and filter parameters from query
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 20;
    const minInvestments = req.query.minInvestments ? parseInt(req.query.minInvestments as string) : undefined;
    const maxInvestments = req.query.maxInvestments ? parseInt(req.query.maxInvestments as string) : undefined;
    const preferredStage = req.query.preferredStage as string || '';
    const searchTerm = req.query.searchTerm as string || '';
    const sortBy = req.query.sortBy as string || 'name';
    const sector = req.query.sector as string || '';
    const checkSize = req.query.checkSize as string || '';
    const offset = (page - 1) * pageSize;
    
    console.log("Processed params:", { page, pageSize, minInvestments, maxInvestments, preferredStage, searchTerm, sortBy, sector, checkSize, offset });

    // Debug query for Alantra's investments
    const { data: alantraDebug, error: alantraError } = await supabase
      .from('investors')
      .select(`
        id,
        name,
        investments!inner(
          funding_rounds!inner(
            announced_at,
            amount_usd,
            stage,
            companies!inner(name)
          )
        )
      `)
      .eq('name', 'Alantra');

    if (!alantraError && alantraDebug) {
      console.log('Alantra Debug Data:', JSON.stringify(alantraDebug, null, 2));
    }

    // Get all investors with their investment counts and stage filtering
    let investorQuery = supabase
      .from('investors')
      .select(`
        id,
        name,
        investments(
          funding_rounds(id, stage)
        )
      `);

    // Apply search filter if provided
    if (searchTerm) {
      investorQuery = investorQuery.ilike('name', `%${searchTerm}%`);
    }

    const { data: allInvestors, error: investorsError } = await investorQuery;

    if (investorsError) {
      throw investorsError;
    }

    // Process investors with client-side filtering for complex conditions
    const processedInvestors = allInvestors?.map((investor: any) => {
      const investments = investor.investments || [];
      const fundingRounds = investments.map((inv: any) => inv.funding_rounds).filter(Boolean);
      
      return {
        ...investor,
        investmentCount: fundingRounds.length,
        hasStage: preferredStage ? fundingRounds.some((fr: any) => fr.stage === preferredStage) : true
      };
    }) || [];

    // Apply all filters
    let filteredInvestors = processedInvestors.filter((investor: any) => {
      // Filter by minimum investments
      if (minInvestments && investor.investmentCount < minInvestments) return false;
      
      // Filter by maximum investments  
      if (maxInvestments && investor.investmentCount > maxInvestments) return false;
      
      // Filter by preferred stage
      if (preferredStage && !investor.hasStage) return false;
      
      return true;
    });

    // First get all detailed data for filtered investors (without pagination)
    const investorIds = filteredInvestors.map((inv: any) => inv.id);
    
    const { data: detailedData, error: detailedError } = await supabase
      .from('investors')
      .select(`
        id,
        name,
        investments!inner(
          funding_rounds!inner(
            announced_at,
            amount_usd,
            stage,
            companies!inner(name, industry)
          )
        )
      `)
      .in('id', investorIds);

    if (detailedError) {
      throw detailedError;
    }
    console.log("Query results count:", detailedData?.length || 0);

    // Process the data into the expected format with all metrics
    const processedResult = detailedData?.map((investor: any) => {
      const investments = investor.investments?.map((inv: any) => ({
        date: inv.funding_rounds.announced_at,
        amount: inv.funding_rounds.amount_usd / 1000000, // Convert to millions
        companyName: inv.funding_rounds.companies.name,
        stage: inv.funding_rounds.stage,
        sector: inv.funding_rounds.companies.industry
      })) || [];

      // Sort investments by date descending
      investments.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());

      const totalInvested = investments.reduce((sum: number, inv: any) => sum + (inv.amount * 1000000), 0);
      const mostRecentInvestment = investments.length > 0 ? new Date(investments[0].date).getTime() : 0;

      // Calculate average check size
      const validAmounts = investments.filter((inv: any) => inv.amount > 0);
      const avgCheckSize = validAmounts.length > 0 ? 
        validAmounts.reduce((sum: number, inv: any) => sum + inv.amount, 0) / validAmounts.length : 0;

      // Get unique sectors this investor invests in
      const investorSectors = Array.from(new Set(investments.map((inv: any) => inv.sector).filter(Boolean)));

      return {
        id: investor.id,
        name: investor.name,
        investments,
        totalInvested,
        investmentCount: investments.length,
        mostRecentInvestment,
        avgCheckSize,
        sectors: investorSectors
      };
    }) || [];

    // Apply additional filters that require full investment data
    const postFilteredResults = processedResult.filter((investor: any) => {
      // Filter by sector focus
      if (sector && !investor.sectors.includes(sector)) return false;
      
      // Filter by typical check size
      if (checkSize && investor.avgCheckSize > 0) {
        switch (checkSize) {
          case 'small': // $1M - $5M
            if (investor.avgCheckSize < 1 || investor.avgCheckSize > 5) return false;
            break;
          case 'medium': // $5M - $20M
            if (investor.avgCheckSize < 5 || investor.avgCheckSize > 20) return false;
            break;
          case 'large': // $20M - $100M
            if (investor.avgCheckSize < 20 || investor.avgCheckSize > 100) return false;
            break;
          case 'mega': // $100M+
            if (investor.avgCheckSize < 100) return false;
            break;
        }
      }
      
      return true;
    });

    // Sort the processed results
    const sortedResults = sortInvestorsWithMetrics(postFilteredResults, sortBy);
    
    // Apply pagination to sorted results
    const paginatedResults = sortedResults.slice(offset, offset + pageSize);

    console.log(`Found ${paginatedResults.length} investors for page ${page} (${postFilteredResults.length} total after filtering)`);
    res.status(200).json({
      investors: paginatedResults,
      pagination: {
        currentPage: page,
        pageSize,
        totalItems: postFilteredResults.length,
        totalPages: Math.ceil(postFilteredResults.length / pageSize)
      }
    });

  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
