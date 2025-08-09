// server/controllers/pipelineController.ts
import { Request, Response } from 'express';
import { db } from '../db';
import { companies, investors, fundingRounds, investments } from '../../shared/schema';
import { eq, and } from 'drizzle-orm';

// A helper function to parse strings like "$50M" or "€25m" into an integer
function parseAmount(amountStr: string): number | null {
    if (!amountStr) return null;
    const cleaned = amountStr.replace(/[^0-9.]/g, '');
    const value = parseFloat(cleaned);
    if (isNaN(value)) return null;
    if (amountStr.toLowerCase().includes('m')) return value * 1_000_000;
    if (amountStr.toLowerCase().includes('k')) return value * 1_000;
    return value;
}

export const processScrapedDataController = async (req: Request, res: Response) => {
    // This expects an array of deal objects from our scraper
    const deals = req.body.deals; 

    if (!deals || !Array.isArray(deals)) {
        return res.status(400).json({ message: 'Invalid request body. Expected a "deals" array.' });
    }

    let createdCount = 0;
    let investmentLinksCreated = 0;

    for (const deal of deals) {
        try {
            // --- 1. Find or Create the Company ---
            let [company] = await db.select().from(companies).where(eq(companies.name, deal.companyName));
            if (!company) {
                [company] = await db.insert(companies).values({
                    name: deal.companyName,
                    country: deal.country,
                    industry: deal.climateTechSector,
                    problemStatement: deal.problem,
                    impactMetric: deal.impact,
                }).returning();
            } 

            // --- 2. Find or Create the Investors ---
            const investorIds = [];
            if (deal.leadInvestors && Array.isArray(deal.leadInvestors)) {
                for (const investorName of deal.leadInvestors) {
                    if (!investorName) continue; // Skip if investor name is empty
                    let [investor] = await db.select().from(investors).where(eq(investors.name, investorName.trim()));
                    if (!investor) {
                        [investor] = await db.insert(investors).values({ name: investorName.trim() }).returning();
                    }
                    investorIds.push(investor.id);
                }
            }
            console.log(`Processed ${investorIds.length} investors.`);

            // --- 3. Find or Create the Funding Round ---
            const announcedDateStr = deal.announcedAt; // e.g., "2025-06-16"
            
            // Look for an existing round for this company and stage.
            let [fundingRound] = await db.select().from(fundingRounds)
                .where(and(
                    eq(fundingRounds.companyId, company.id),
                    eq(fundingRounds.stage, deal.fundingStage)
                ));

            if (!fundingRound) {
                [fundingRound] = await db.insert(fundingRounds).values({
                    companyId: company.id,
                    stage: deal.fundingStage,
                    amountUsd: parseAmount(deal.amountRaisedRaw),
                    announcedAt: announcedDateStr,
                    sourceUrl: deal.sourceUrl,
                }).returning();
                createdCount++;
            } else {
                // --- 3b. If Funding Round exists, check if it needs enrichment ---
                const updates: Partial<typeof fundingRounds.$inferInsert> = {};
                const newAmount = parseAmount(deal.amountRaisedRaw);

                if (!fundingRound.announcedAt && announcedDateStr) {
                    updates.announcedAt = announcedDateStr;
                }
                if (!fundingRound.sourceUrl && deal.sourceUrl) {
                    updates.sourceUrl = deal.sourceUrl;
                }
                if (!fundingRound.amountUsd && newAmount) {
                    updates.amountUsd = newAmount;
                }

                // If there are updates to apply, perform the update
                if (Object.keys(updates).length > 0) {
                    [fundingRound] = await db.update(fundingRounds)
                        .set(updates)
                        .where(eq(fundingRounds.id, fundingRound.id))
                        .returning();
                } 
            }

            // --- 4. Link Investors to the Funding Round via the "investments" table ---
            for (const investorId of investorIds) {
                // Check if this specific investment link already exists
                const [existingInvestment] = await db.select().from(investments)
                    .where(and(
                        eq(investments.fundingRoundId, fundingRound.id),
                        eq(investments.investorId, investorId)
                    ));
                
                if (!existingInvestment) {
                    await db.insert(investments).values({
                        fundingRoundId: fundingRound.id,
                        investorId: investorId,
                    });
                    investmentLinksCreated++;
                }
            }
        } catch (error) {
            console.error(`Error processing deal: ${deal.companyName}`, error);
        }
    }
    res.status(201).json({ message: `Processing complete. ${createdCount} new funding rounds created, and ${investmentLinksCreated} new investor links established.` });
};
