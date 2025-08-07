// server/scripts/geminiScraper.ts

import axios from 'axios';
import * as cheerio from 'cheerio';
import { GoogleGenerativeAI, GenerationConfig, GenerateContentRequest } from '@google/generative-ai';
import * as dotenv from 'dotenv';


dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// --- Gemini Parser Function (UPDATED to infer date) ---
async function parseTextWithGemini(text: string, stage: string, publicationDate: string | null) {
  const generationConfig: GenerationConfig = {
    responseMimeType: "application/json",
  };

  const prompt = `
        Analyze the following text, which describes a business funding deal.
        The funding stage is likely "${stage}".
        Extract the information into a JSON object using this exact schema:
        {
          "companyName": "string",
          "country": "string (The country, inferred from the city or text)",
          "amountRaisedRaw": "string (e.g., '$12M', '€25M')",
          "fundingStage": "string",
          "leadInvestors": ["string"],
          "climateTechSector": "string (e.g., Energy, Mobility, Industry. Infer from the company description.)",
          "announcedAt": "string (Find the specific date for this deal in the text and format it as YYYY-MM-DD. If no specific date is found, use the article's publication date: ${publicationDate}. If neither is available, use null.)"
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
    if (parsed.announcedAt === 'null') {
        parsed.announcedAt = null;
    }
    return parsed;
  } catch (error) {
    console.error("Error parsing with Gemini:", error);
    return null; 
  }
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
    const allDeals = [];

    for (const deal of dealsToProcess) {
      console.log(`--- Parsing Deal (Stage: ${deal.stage}) ---`);
      // We no longer pass the date, we ask the AI to find it.
      const parsedData = await parseTextWithGemini(deal.rawText, deal.stage, publicationDate);
      if (parsedData) {
        parsedData.sourceUrl = targetUrl;
        allDeals.push(parsedData);
        console.log(`Successfully parsed: ${parsedData.companyName}`);
      } else {
        console.log(`Skipping a deal due to parsing error.`);
      }
    }

    if (allDeals.length > 0) {
      console.log(`\n--- Sending ${allDeals.length} deals to the ingest API... ---`);
      await axios.post(
        'http://localhost:5001/api/ingest-scraped-data', 
        { deals: allDeals },
        { headers: { 'x-api-key': process.env.INTERNAL_PIPELINE_KEY } }
      );
      console.log('--- Successfully sent data to API. ---');
    } else {
      console.log('--- No deals were successfully parsed to send. ---');
    }

  } catch (error) {
    console.error('An error occurred during the scraping process:', error);
  }
}

// --- Execution ---
const urlToScrape = 'https://www.ctvc.co/grwm-for-nycw-255/';
scrapeAndParse(urlToScrape);