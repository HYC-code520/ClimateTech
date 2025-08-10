import { Request, Response } from 'express';
import { scrapeAndParse } from '../scripts/geminiScraper';

export const runScraper = async (req: Request, res: Response) => {
    try {
        const url = 'https://www.ctvc.co/uk-ets-opens-floor-to-carbon-removal-256/';
        await scrapeAndParse(url);
        res.status(200).json({ message: 'Scraping completed successfully' });
    } catch (error) {
        console.error('Error running scraper:', error);
        res.status(500).json({ error: 'Scraping failed' });
    }
};
