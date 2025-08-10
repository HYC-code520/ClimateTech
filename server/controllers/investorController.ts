import { Request, Response } from 'express';
import { db } from '../db';
import { companies, investors, fundingRounds, investments } from '../../shared/schema';
import { sql, eq } from 'drizzle-orm';

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

    // Create a subquery to count investments per investor
    const investorInvestmentCounts = db
      .select({
        investorId: investments.investorId,
        investmentCount: sql<number>`count(distinct ${fundingRounds.id})`.as('investmentCount')
      })
      .from(investments)
      .leftJoin(fundingRounds, eq(investments.fundingRoundId, fundingRounds.id))
      .groupBy(investments.investorId)
      .as('investment_counts');

    // First, get filtered total count of investors
    const [{ count }] = await db
      .select({ 
        count: sql`count(distinct ${investors.id})` 
      })
      .from(investors)
      .leftJoin(investorInvestmentCounts, eq(investors.id, investorInvestmentCounts.investorId))
      .where(
        minInvestments !== undefined
          ? sql`COALESCE(${investorInvestmentCounts.investmentCount}, 0) >= ${minInvestments}`
          : undefined
      );
      
    console.log("Total filtered count:", count);

    // Get paginated investors with their investment data
    const investorData = await db
      .select({
        investorId: investors.id,
        investorName: investors.name,
        fundingDate: fundingRounds.announcedAt,
        amountUsd: fundingRounds.amountUsd,
        companyName: companies.name,
        stage: fundingRounds.stage,
        investmentCount: investorInvestmentCounts.investmentCount,
      })
      .from(investors)
      .leftJoin(investorInvestmentCounts, eq(investors.id, investorInvestmentCounts.investorId))
      .leftJoin(investments, eq(investors.id, investments.investorId))
      .leftJoin(fundingRounds, eq(investments.fundingRoundId, fundingRounds.id))
      .leftJoin(companies, eq(fundingRounds.companyId, companies.id))
      .where(
        minInvestments !== undefined
          ? sql`COALESCE(${investorInvestmentCounts.investmentCount}, 0) >= ${minInvestments}`
          : undefined
      )
      .orderBy(sql`${investors.name} ASC`)
      .limit(pageSize)
      .offset(offset);
      
    console.log("Query results count:", investorData.length);

    // Group the data by investor
    const groupedData = investorData.reduce((acc, row) => {
      if (!acc[row.investorId]) {
        acc[row.investorId] = {
          id: row.investorId,
          name: row.investorName,
          investments: [],
          totalInvested: 0,
          investmentCount: 0
        };
      }

      if (row.fundingDate && row.amountUsd) {
        acc[row.investorId].investments.push({
          date: row.fundingDate,
          amount: row.amountUsd / 1000000, // Convert to millions
          companyName: row.companyName,
          stage: row.stage
        });
        acc[row.investorId].totalInvested += row.amountUsd;
        acc[row.investorId].investmentCount += 1;
      }

      return acc;
    }, {} as Record<string, any>);

    // Convert to array and add mock timeline data for better visualization
    const result = Object.values(groupedData).map((investor: any) => {
      // Remove this mock data generation
      // if (investor.investments.length === 0) {
      //   investor.investments = generateMockTimelineData(investor.name);
      // }
      
      return investor;
    });

    console.log(`Found ${result.length} investors for page ${page}`);
    res.status(200).json({
      investors: result,
      pagination: {
        currentPage: page,
        pageSize,
        totalItems: Number(count),
        totalPages: Math.ceil(Number(count) / pageSize)
      }
    });

  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}; 