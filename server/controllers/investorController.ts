import { Request, Response } from 'express';
import { db } from '../db';
import { companies, investors, fundingRounds, investments } from '../../shared/schema';
import { sql, eq } from 'drizzle-orm';

export const getInvestorsWithTimeline = async (req: Request, res: Response) => {
  try {
    console.log("\n--- [API] Fetching Investors with Timeline ---");

    // Get all investors with their investment data
    const investorData = await db
      .select({
        investorId: investors.id,
        investorName: investors.name,
        fundingDate: fundingRounds.announcedAt,
        amountUsd: fundingRounds.amountUsd,
        companyName: companies.name,
        stage: fundingRounds.stage,
      })
      .from(investors)
      .leftJoin(investments, eq(investors.id, investments.investorId))
      .leftJoin(fundingRounds, eq(investments.fundingRoundId, fundingRounds.id))
      .leftJoin(companies, eq(fundingRounds.companyId, companies.id))
      .orderBy(investors.name, fundingRounds.announcedAt);

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

    console.log(`Found ${result.length} investors`);
    res.status(200).json(result);

  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}; 