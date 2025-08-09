import axios from 'axios';
import * as cheerio from 'cheerio';
import { GoogleGenerativeAI, GenerationConfig, GenerateContentRequest } from '@google/generative-ai';
import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// --- Gemini Parser Function (UPDATED to infer date) ---
async function parseTextWithGemini(text: string, stage: string) {
  const generationConfig: GenerationConfig = {
    responseMimeType: "application/json",
  };

  const prompt = `
        Analyze the following text, which describes a business funding deal.
        The funding stage is likely "${stage}".
        Extract the information into a JSON object using this exact schema:
        {
          "companyName": "string",
          "city": "string (The city where the company is located, inferred from the text)",
          "country": "string (The country, inferred from the city or text)",
          "amountRaisedRaw": "string (e.g., '$12M', '€25M')",
          "fundingStage": "string",
          "leadInvestors": ["string"],
          "climateTechSector": "string (e.g., Energy, Mobility, Industry. Infer from the company description.)",
          "announcedAt": "string (Find the specific date for this deal in the text and format it as YYYY-MM-DD. If no date is found, use null.)"
        }
        If a value cannot be found, use null. Do not wrap the JSON in markdown backticks.

        Text: "${text}"
    `;

  try {
    const request: GenerateContentRequest = {
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig,
    };
    const result = await model.generateContent(request);
    let responseText = result.response.text();
    
    // Clean markdown from the response if present
    if (responseText.startsWith("```json")) {
      const firstBrace = responseText.indexOf('{');
      const lastBrace = responseText.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1) {
        responseText = responseText.substring(firstBrace, lastBrace + 1);
      }
    }

    const parsed = JSON.parse(responseText);
    console.log("Extracted city:", parsed.city);
    return parsed;
  } catch (error) {
    console.error("Error parsing with Gemini:", error);
    return null; 
  }
}

// --- Supabase Upsert Helpers ---
async function upsertCompany({ name, country, industry, city }: { name: string, country: string, industry: string, city: string }) {
  const { data: existing, error } = await supabase
    .from('companies')
    .select('*')
    .eq('name', name)
    .maybeSingle();
  if (error) throw error;
  if (existing) {
    // Update city/country/industry if changed
    const needsUpdate = existing.city !== city || existing.country !== country || existing.industry !== industry;
    if (needsUpdate) {
      const { data: updated, error: updateError } = await supabase
        .from('companies')
        .update({ city, country, industry })
        .eq('id', existing.id)
        .select()
        .single();
      if (updateError) throw updateError;
      return updated;
    }
    return existing;
  }
  const { data: inserted, error: insertError } = await supabase
    .from('companies')
    .insert([{ name, country, industry, city }])
    .select()
    .single();
  if (insertError) throw insertError;
  return inserted;
}

async function upsertInvestor(name: string) {
  const { data: existing, error } = await supabase
    .from('investors')
    .select('*')
    .eq('name', name)
    .maybeSingle();
  if (error) throw error;
  if (existing) return existing;
  const { data: inserted, error: insertError } = await supabase
    .from('investors')
    .insert([{ name }])
    .select()
    .single();
  if (insertError) throw insertError;
  return inserted;
}

async function insertFundingRound({ companyId, stage, amountUsd, announcedAt, sourceUrl }: any) {
  const { data, error } = await supabase
    .from('funding_rounds')
    .insert([{ company_id: companyId, stage, amount_usd: amountUsd, announced_at: announcedAt, source_url: sourceUrl }])
    .select()
    .single();
  if (error) throw error;
  return data;
}

async function insertInvestment({ fundingRoundId, investorId }: any) {
  const { error } = await supabase
    .from('investments')
    .insert([{ funding_round_id: fundingRoundId, investor_id: investorId }]);
  if (error) throw error;
}

// --- Amount Parsing Helper ---
function parseAmountToUSD(amountRaw: string): number | null {
  if (!amountRaw || typeof amountRaw !== 'string') return null;
  // Remove currency symbols and commas
  let cleaned = amountRaw.replace(/[$€,]/g, '').trim();
  let multiplier = 1;
  if (/b/i.test(cleaned)) {
    multiplier = 1_000_000_000;
    cleaned = cleaned.replace(/b/i, '');
  } else if (/m/i.test(cleaned)) {
    multiplier = 1_000_000;
    cleaned = cleaned.replace(/m/i, '');
  } else if (/k/i.test(cleaned)) {
    multiplier = 1_000;
    cleaned = cleaned.replace(/k/i, '');
  }
  const num = parseFloat(cleaned);
  if (isNaN(num)) return null;
  return Math.round(num * multiplier);
}

// --- The Main Scraping Function ---
async function scrapeAndParse(targetUrl: string) {
  try {
    console.log(`Fetching data from ${targetUrl}...`);
    const response = await axios.get(targetUrl);
    const html = response.data;
    const $ = cheerio.load(html);

    // --- Extract the article's publication date ---
    let publicationDate: string | null = null;
    const timeElement = $('time').first();
    if (timeElement.length) {
        const datetime = timeElement.attr('datetime');
        if (datetime) {
            publicationDate = new Date(datetime).toISOString().split('T')[0]; // Format as YYYY-MM-DD
            console.log(`Found publication date: ${publicationDate}`);
        }
    }
    if (!publicationDate) {
        console.log("Could not find publication date from <time> tag.");
    }

    let startHeader: any;
    $('h2').each((index, element) => {
      const el = $(element);
      if (el.text().trim().startsWith('Deals of the Week')) {
        startHeader = el;
        return false; // exit loop
      }
    });

    if (!startHeader) {
      console.error("Could not find the 'Deals of the Week' header.");
      return;
    }

    console.log(`Found header: "${startHeader.text()}"`);

    const relevantElements = startHeader.nextAll('h3, p');
    const dealsToProcess: { rawText: string, stage: string }[] = [];
    let currentStage = "Unknown";

    relevantElements.each((index: any, element: any) => {
      const el = $(element);
      if (el.is('h3')) {
        currentStage = el.text().trim();
        if (currentStage.includes("Exits") || currentStage.includes("New Funds")) {
          return false; // stop processing
        }
      } else if (el.is('p')) {
        dealsToProcess.push({ rawText: el.text().trim(), stage: currentStage });
      }
    });

    console.log(`Found ${dealsToProcess.length} potential deals to process.`);
    for (const deal of dealsToProcess) {
      const parsedData = await parseTextWithGemini(deal.rawText, deal.stage);
      if (parsedData) {
        // Always fallback to publicationDate if Gemini did not extract a date
        if (!parsedData.announcedAt || parsedData.announcedAt === 'null' || parsedData.announcedAt === '') {
          parsedData.announcedAt = publicationDate;
        }
        parsedData.sourceUrl = targetUrl;
        // Ensure announcedAt is null if not a valid date
        if (!parsedData.announcedAt || parsedData.announcedAt === 'null' || parsedData.announcedAt === '') {
          parsedData.announcedAt = null;
        }
        console.log('Gemini returned city:', parsedData.city); // Debug log
        // --- Supabase DB Insert Logic ---
        const company = await upsertCompany({
          name: parsedData.companyName,
          country: parsedData.country,
          industry: parsedData.climateTechSector,
          city: parsedData.city,
        });
        const amountUsd = parseAmountToUSD(parsedData.amountRaisedRaw);
        const fundingRound = await insertFundingRound({
          companyId: company.id,
          stage: parsedData.fundingStage,
          amountUsd,
          announcedAt: parsedData.announcedAt,
          sourceUrl: parsedData.sourceUrl,
        });
        for (const investorName of parsedData.leadInvestors || []) {
          if (!investorName) continue;
          const investor = await upsertInvestor(investorName);
          await insertInvestment({
            fundingRoundId: fundingRound.id,
            investorId: investor.id,
          });
        }
        console.log(`Saved deal for company: ${parsedData.companyName}`);
      } else {
        console.log(`Skipping a deal due to parsing error.`);
      }
    }
  } catch (error) {
    console.error('An error occurred during the scraping process:', error);
  }
}

// --- Execution ---
const urlToScrape = 'https://www.ctvc.co/epa-puts-emissions-rules-in-danger-257/';
scrapeAndParse(urlToScrape);
