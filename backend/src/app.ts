import express from 'express';
import cors from 'cors';
import { authMiddleware } from './middleware/auth';
import eventsRouter from './routes/events';

const app = express();

const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',')
  : ['http://localhost:5173', 'http://localhost:4173'];

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/events', authMiddleware, eventsRouter);

export default app;
