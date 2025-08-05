// server/routes/pipelineRoutes.ts
import { Router } from 'express';
import { processScrapedDataController } from '../controllers/pipelineController';
import { protectWithApiKey } from '../middleware/authMiddleware'; // We will create this

const router = Router();

// This endpoint will be protected by our API key middleware
router.post('/ingest-scraped-data', protectWithApiKey, processScrapedDataController);

export default router;
