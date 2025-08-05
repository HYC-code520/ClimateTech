// server/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';

export const protectWithApiKey = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers['x-api-key'];
  
  if (apiKey && apiKey === process.env.INTERNAL_PIPELINE_KEY) {
    next(); // Key is valid, proceed to the controller
  } else {
    res.status(401).json({ message: 'Unauthorized: Invalid API Key' });
  }
};
