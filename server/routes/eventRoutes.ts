// server/routes/eventRoutes.ts

import { Router } from 'express';
import { searchEventsController } from '../controllers/eventController'; // We will create this next

const router = Router();

// This defines the route and connects it to our controller function
router.get('/events/search', searchEventsController);

export default router;
