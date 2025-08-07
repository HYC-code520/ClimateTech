import { Router } from 'express';
import { getInvestorsWithTimeline } from '../controllers/investorController';

const router = Router();

router.get('/timeline', getInvestorsWithTimeline);

export default router; 