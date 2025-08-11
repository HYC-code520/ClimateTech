import { Request, Response } from 'express';
import { supabase } from '../db/supabase';

export const getInvestorsWithTimeline = async (req: Request, res: Response) => {
  try {
    console.log("\n--- [API] Fetching Investors with Timeline ---");
    console.log("Query params:", req.query);
    
    // Get pagination parameters from query
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 20;
    const minInvestments = req.query.minInvestments ? parseInt(req.query.minInvestments as string) : undefined;
    const offset = (page - 1) * pageSize;
    
    console.log("Processed params:", { page, pageSize, minInvestments, offset });

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

    // Get all investors with their investment counts
    const { data: allInvestors, error: investorsError } = await supabase
      .from('investors')
      .select(`
        id,
        name,
        investments(
          funding_rounds(id)
        )
      `);

    if (investorsError) {
      throw investorsError;
    }

    // Process and filter investors
    const processedInvestors = allInvestors?.map((investor: any) => ({
      ...investor,
      investmentCount: investor.investments?.reduce((count: number, inv: any) => 
        count + (inv.funding_rounds ? 1 : 0), 0) || 0
    })) || [];

    // Filter by minimum investments if specified
    const filteredInvestors = minInvestments 
      ? processedInvestors.filter((inv: any) => inv.investmentCount >= minInvestments)
      : processedInvestors;

    // Sort and paginate
    const sortedInvestors = filteredInvestors.sort((a: any, b: any) => a.name.localeCompare(b.name));
    const paginatedInvestors = sortedInvestors.slice(offset, offset + pageSize);

    // Get detailed investment data for paginated investors
    const investorIds = paginatedInvestors.map((inv: any) => inv.id);
    
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
            companies!inner(name)
          )
        )
      `)
      .in('id', investorIds);

    if (detailedError) {
      throw detailedError;
    }
    console.log("Query results count:", detailedData?.length || 0);

    // Process the data into the expected format
    const result = detailedData?.map((investor: any) => {
      const investments = investor.investments?.map((inv: any) => ({
        date: inv.funding_rounds.announced_at,
        amount: inv.funding_rounds.amount_usd / 1000000, // Convert to millions
        companyName: inv.funding_rounds.companies.name,
        stage: inv.funding_rounds.stage
      })) || [];

      // Sort investments by date descending
      investments.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());

      const totalInvested = investments.reduce((sum: number, inv: any) => sum + (inv.amount * 1000000), 0);

      if (investor.name === 'Alantra') {
        console.log('Processed Alantra data:', JSON.stringify({
          id: investor.id,
          name: investor.name,
          investments,
          totalInvested,
          investmentCount: investments.length
        }, null, 2));
      }

      return {
        id: investor.id,
        name: investor.name,
        investments,
        totalInvested,
        investmentCount: investments.length
      };
    }) || [];

    console.log(`Found ${result.length} investors for page ${page}`);
    res.status(200).json({
      investors: result,
      pagination: {
        currentPage: page,
        pageSize,
        totalItems: filteredInvestors.length,
        totalPages: Math.ceil(filteredInvestors.length / pageSize)
      }
    });

  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
