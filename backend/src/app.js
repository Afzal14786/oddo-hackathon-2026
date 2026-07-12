import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

dotenv.config();

import connectDB from './config/database.js';
import { apiLimiter } from './shared/middlewares/rate-limit.middleware.js';
import { notFoundHandler } from './shared/middlewares/not-found.middleware.js';
import { errorHandler } from './shared/middlewares/error.middleware.js';
import routes from './routes/index.routes.js';

connectDB();

const app = express();

app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true, // allow cookies to be sent
}));
app.use(compression());
app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// rate limiting 
app.use('/v1/api', apiLimiter);

// health check
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Backend is running',
    timestamp: new Date().toISOString(),
  });
});

// main api routes
app.use('/api', routes);          // keep for backward compatibility
app.use('/api/v1', routes);       // versioned endpoint

// 404 and error handlers
app.use(notFoundHandler);
app.use(errorHandler);

export default app;