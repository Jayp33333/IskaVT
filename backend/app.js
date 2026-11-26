import cors from 'cors';
import express from 'express';

import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import logbookRoutes from './routes/logbookRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import userRoutes from './routes/userRoutes.js';

/**
 * Express application. Builds middleware and routes only: it does not
 * connect to MongoDB or start listening, so tests can import it directly.
 * See server.js for the production entry point.
 */
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/logbook', logbookRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/feedback', feedbackRoutes);

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'OK',
    message: 'ISKA Virtual Tour Backend API is running',
    timestamp: new Date().toISOString(),
  });
});

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
