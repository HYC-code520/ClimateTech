// server/controllers/pipelineController.ts
import { Request, Response } from 'express';
import { supabase } from '../db/supabase';

// A helper function to parse strings like "$50M" or "€25m" into an integer
function parseAmount(amountStr: string): number | null {
    if (!amountStr) return null;
    const cleaned = amountStr.replace(/[^0-9.]/g, '');
    const value = parseFloat(cleaned);
    if (isNaN(value)) return null;
    const lowerStr = amountStr.toLowerCase();
    if (lowerStr.includes('b')) return Math.round(value * 1_000_000_000);
    if (lowerStr.includes('m')) return Math.round(value * 1_000_000);
    if (lowerStr.includes('k')) return Math.round(value * 1_000);
    return Math.round(value);
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
            let { data: company, error: companyError } = await supabase
                .from('companies')
                .select()
                .eq('name', deal.companyName)
                .single();

            if (companyError && companyError.code === 'PGRST116') { // no rows returned
                const { data: newCompany, error: insertError } = await supabase
                    .from('companies')
                    .insert({
                        name: deal.companyName,
                        city: deal.city,
                        country: deal.country,
                        industry: deal.climateTechSector,
                        problem_statement: deal.problem,
                        impact_metric: deal.impact,
                    })
                    .select()
                    .single();

                if (insertError) throw insertError;
                company = newCompany;
            } else if (!companyError) {
                // Update existing company with new information if we have it
                const updates: any = {};
                if (deal.city && !company.city) {
                    updates.city = deal.city;
                }
                if (deal.country && !company.country) {
                    updates.country = deal.country;
                }
                if (deal.climateTechSector && !company.industry) {
                    updates.industry = deal.climateTechSector;
                }
                if (deal.problem && !company.problem_statement) {
                    updates.problem_statement = deal.problem;
                }
                if (deal.impact && !company.impact_metric) {
                    updates.impact_metric = deal.impact;
                }

                // Only update if we have new information
                if (Object.keys(updates).length > 0) {
                    const { data: updatedCompany, error: updateError } = await supabase
                        .from('companies')
                        .update(updates)
                        .eq('id', company.id)
                        .select()
                        .single();

                    if (updateError) throw updateError;
                    company = updatedCompany;
                }
            }

            // --- 2. Find or Create the Investors ---
            const investorIds = [];
            if (deal.leadInvestors && Array.isArray(deal.leadInvestors)) {
                for (const investorName of deal.leadInvestors) {
                    if (!investorName) continue; // Skip if investor name is empty
                    
                    // Try to find existing investor
                    let { data: investor, error: investorError } = await supabase
                        .from('investors')
                        .select()
                        .eq('name', investorName.trim())
                        .single();

                    if (investorError && investorError.code === 'PGRST116') {
                        // Create new investor if not found
                        const { data: newInvestor, error: insertError } = await supabase
                            .from('investors')
                            .insert({ name: investorName.trim() })
                            .select()
                            .single();
                            
                        if (insertError) throw insertError;
                        investor = newInvestor;
                    } else if (investorError) {
                        throw investorError;
                    }

                    investorIds.push(investor.id);
                }
            }
            console.log(`Processed ${investorIds.length} investors.`);

            // --- 3. Find or Create the Funding Round ---
            const announcedDateStr = deal.announcedAt; // e.g., "2025-06-16"
            
            // Look for an existing round for this company and stage
            let { data: fundingRound, error: roundError } = await supabase
                .from('funding_rounds')
                .select()
                .eq('company_id', company.id)
                .eq('stage', deal.fundingStage)
                .single();

            if (roundError && roundError.code === 'PGRST116') {
                // Create new funding round if not found
                const { data: newRound, error: insertError } = await supabase
                    .from('funding_rounds')
                    .insert({
                        company_id: company.id,
                        stage: deal.fundingStage,
                        amount_usd: parseAmount(deal.amountRaisedRaw),
                        announced_at: announcedDateStr,
                        source_url: deal.sourceUrl,
                    })
                    .select()
                    .single();
                    
                if (insertError) throw insertError;
                fundingRound = newRound;
                createdCount++;
            } else if (roundError) {
                throw roundError;
            } else {
                // --- 3b. If Funding Round exists, check if it needs enrichment ---
                const updates: any = {};
                const newAmount = parseAmount(deal.amountRaisedRaw);

                if (!fundingRound.announced_at && announcedDateStr) {
                    updates.announced_at = announcedDateStr;
                }
                if (!fundingRound.source_url && deal.sourceUrl) {
                    updates.source_url = deal.sourceUrl;
                }
                if (!fundingRound.amount_usd && newAmount) {
                    updates.amount_usd = newAmount;
                }

                // If there are updates to apply, perform the update
                if (Object.keys(updates).length > 0) {
                    const { data: updatedRound, error: updateError } = await supabase
                        .from('funding_rounds')
                        .update(updates)
                        .eq('id', fundingRound.id)
                        .select()
                        .single();
                        
                    if (updateError) throw updateError;
                    fundingRound = updatedRound;
                }
            }

            // --- 4. Link Investors to the Funding Round via the "investments" table ---
            for (const investorId of investorIds) {
                // Check if this specific investment link already exists
                const { data: existingInvestment, error: investmentError } = await supabase
                    .from('investments')
                    .select()
                    .eq('funding_round_id', fundingRound.id)
                    .eq('investor_id', investorId)
                    .single();

                if (investmentError && investmentError.code === 'PGRST116') {
                    // Create new investment link if not found
                    const { error: insertError } = await supabase
                        .from('investments')
                        .insert({
                            funding_round_id: fundingRound.id,
                            investor_id: investorId,
                        });
                        
                    if (insertError) throw insertError;
                    investmentLinksCreated++;
                } else if (investmentError && investmentError.code !== 'PGRST116') {
                    throw investmentError;
                }
            }
        } catch (error) {
            console.error(`Error processing deal: ${deal.companyName}`, error);
        }
    }
    res.status(201).json({ message: `Processing complete. ${createdCount} new funding rounds created, and ${investmentLinksCreated} new investor links established.` });
};
