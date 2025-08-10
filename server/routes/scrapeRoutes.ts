import { Router } from 'express';
import { runScraper } from '../controllers/scrapeController';

const router = Router();

router.post('/run-scraper', runScraper);

export default router;
