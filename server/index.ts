import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// TODO: Add routes for investors, events, pipelines, etc.
app.post('/api/ingest-scraped-data', (req, res) => {
  // For now, just log and acknowledge the payload
  console.log('Received scraped deals:', req.body);
  res.status(200).json({ message: 'Deals received', count: req.body.deals?.length || 0 });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
