import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { connectDatabase } from './config/database';
import nodesRouter from './routes/nodes';
import connectionsRouter from './routes/connections';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '') || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '') || 100
});
app.use(limiter);

// Body parser
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Nihiltheism 3D Knowledge Map API',
    version: '1.0.0',
    endpoints: {
      nodes: '/api/nodes',
      connections: '/api/connections'
    }
  });
});

app.use('/api/nodes', nodesRouter);
app.use('/api/connections', connectionsRouter);

// Error handler (must be last)
app.use(errorHandler);

// Connect to database and start server
connectDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Backend server running on http://localhost:${PORT}`);
    });
  })
  .catch((error: any) => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });

export default app;
