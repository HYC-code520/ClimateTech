// server/scripts/geminiScraper.ts

import axios from 'axios';
import * as cheerio from 'cheerio';
import { GoogleGenerativeAI, GenerationConfig } from '@google/generative-ai';
import * as dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// --- Gemini Parser Function (UPDATED WITH CLEANING LOGIC) ---
async function parseTextWithGemini(text: string, stage: string) {
  const generationConfig: GenerationConfig = {
    responseMimeType: "application/json",
  };

  const prompt = `
        Analyze the following text. The funding stage is likely "${stage}".
        Extract the information into a JSON object using this exact schema:
        {
          "companyName": "string",
          "country": "string (The country, inferred from the city or text)",
          "amountRaisedRaw": "string (e.g., '$12M', '€25M')",
          "fundingStage": "string",
          "leadInvestors": ["string"],
          "climateTechSector": "string (e.g., Energy, Mobility, Industry, Carbon Tech, Food & Ag. Infer from the company description.)"
        }
        If a value cannot be found, use null. Do not wrap the JSON in markdown backticks.

        Text: "${text}"
    `;

  try {
    const result = await model.generateContent([prompt], generationConfig);
    let responseText = result.response.text();
    
    // --- THIS IS THE NEW CLEANING LOGIC ---
    // Check if the response contains markdown backticks and extract the JSON
    if (responseText.startsWith("```json")) {
      console.log("...Cleaning markdown from AI response.");
      // Find the first '{' and the last '}' to extract the pure JSON string
      const firstBrace = responseText.indexOf('{');
      const lastBrace = responseText.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1) {
        responseText = responseText.substring(firstBrace, lastBrace + 1);
      }
    }
    // --- END OF NEW LOGIC ---

    return JSON.parse(responseText);
  } catch (error) {
    console.error("Error parsing with Gemini:", error);
    // Log the problematic text for debugging
    // console.error("Problematic AI response text:", result.response.text());
    return null; 
  }
}

// --- The Main Scraping Function (No changes needed here) ---
async function scrapeAndParse(targetUrl: string) {
  // ... (The rest of this function is correct and does not need changes)
  try {
    console.log(`Fetching data from ${targetUrl}...`);
    const response = await axios.get(targetUrl);
    const html = response.data;
    const $ = cheerio.load(html);

    let startHeader;
    $('h2').each((index, element) => {
      const el = $(element);
      if (el.text().trim().startsWith('Deals of the Week')) {
        startHeader = el;
        return false;
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

    relevantElements.each((index, element) => {
      const el = $(element);
      if (el.is('h3')) {
        currentStage = el.text().trim();
        if (currentStage.includes("Exits") || currentStage.includes("New Funds")) {
          return false;
        }
      } else if (el.is('p')) {
        dealsToProcess.push({ rawText: el.text().trim(), stage: currentStage });
      }
    });

    console.log(`\nIdentified ${dealsToProcess.length} deals to parse.`);

    for (const deal of dealsToProcess) {
      console.log(`\nParsing: "${deal.rawText.substring(0, 100)}..." under stage: ${deal.stage}`);
      const structuredData = await parseTextWithGemini(deal.rawText, deal.stage);
      
      console.log('--- Structured Data from Gemini ---');
      console.log(structuredData);
      console.log('-----------------------------------');
      
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    const allParsedDeals = [];
    for (const deal of dealsToProcess) {
        const structuredData = await parseTextWithGemini(deal.rawText, deal.stage);
        if (structuredData) {
            allParsedDeals.push(structuredData);
        }
        await new Promise(resolve => setTimeout(resolve, 1000)); 
    }

    // --- NEW: Send all deals to our secure API endpoint ---
    if (allParsedDeals.length > 0) {
        console.log(`\nSending ${allParsedDeals.length} parsed deals to the API...`);
        try {
            const response = await axios.post('http://localhost:5001/api/ingest-scraped-data', 
                { deals: allParsedDeals },
                {
                    headers: {
                        'x-api-key': process.env.INTERNAL_PIPELINE_KEY
                    }
                }
            );
            console.log('API Response:', response.data);
        } catch (error: any) {
            console.error('Error sending data to API:', error.response?.data || error.message);
        }
    }
  } catch (error) {
    console.error('Error during scraping:', error);
  }
}

// Call the function with the URL you want to scrape
scrapeAndParse('https://www.ctvc.co/fervo-goes-hotter-deeper-faster-cheaper-250/');