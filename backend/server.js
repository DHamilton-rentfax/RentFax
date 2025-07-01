// backend/server.js

// ─────────────────────────────────────────────────────────────────────────────
// Load environment variables
import 'dotenv/config';

// ─────────────────────────────────────────────────────────────────────────────
// Core Modules & Middleware
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';

// ─────────────────────────────────────────────────────────────────────────────
// Custom Middleware
import logger from './middleware/logger.js';
import notFound from './middleware/notFound.js';
import errorHandler from './middleware/errorHandler.js';
import { authMiddleware, isAdmin } from './middleware/auth.js';

// ─────────────────────────────────────────────────────────────────────────────
// Route Imports
import authRoutes from './routes/authRoutes.js';
import refreshRoutes from './routes/refreshRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import riskReportRoutes from './routes/riskReport.js';
import stripeWebhookHandler from './routes/stripeRoutes.js';
import userRoutes from './routes/userRoutes.js';
import seedRoutes from './routes/seedRoutes.js';
import auditLogRoutes from './routes/auditLogRoutes.js';
import blacklistRoutes from './routes/blacklistRoutes.js';
import alertRoutes from './routes/alertRoutes.js';
import applicantHistoryRoutes from './routes/applicantHistoryRoutes.js';
import rentalEventsRouter from './routes/rentalEvents.js';

// ─────────────────────────────────────────────────────────────────────────────
// App Initialization
const app = express();
const PORT = process.env.PORT || 5050;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('❌ MONGO_URI missing in .env');
  process.exit(1);
}

// ─────────────────────────────────────────────────────────────────────────────
// Stripe Webhook (must go before JSON body middleware)
app.post(
  '/api/stripe/webhook',
  express.raw({ type: 'application/json' }),
  stripeWebhookHandler
);

// ─────────────────────────────────────────────────────────────────────────────
// Global Middleware
app.use(cors({ origin: 'http://localhost:5175', credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(logger);
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100,
  message: { error: 'Too many requests, try again later.' },
}));

// ─────────────────────────────────────────────────────────────────────────────
// Health Check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'RentFAX API',
    uptime: process.uptime(),
    time: new Date().toISOString(),
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Public Routes
app.use('/api/auth', authRoutes);
app.use('/api/refresh', refreshRoutes);

// ─────────────────────────────────────────────────────────────────────────────
// Protected Routes
app.use('/api/reports', authMiddleware, reportRoutes);
app.use('/api/risk-reports', authMiddleware, riskReportRoutes);
app.use('/api/users', authMiddleware, userRoutes);

// ─────────────────────────────────────────────────────────────────────────────
// Admin-Only Routes
app.use('/api/applicants', authMiddleware, isAdmin, applicantHistoryRoutes);
app.use('/api/rental-events', authMiddleware, rentalEventsRouter);
app.use('/api/seed', authMiddleware, isAdmin, seedRoutes);
app.use('/api/audit-logs', authMiddleware, isAdmin, auditLogRoutes);
app.use('/api/blacklist', authMiddleware, isAdmin, blacklistRoutes);
app.use('/api/alerts', authMiddleware, isAdmin, alertRoutes);

// ─────────────────────────────────────────────────────────────────────────────
// Error Handling
app.use(notFound);
app.use(errorHandler);

// ─────────────────────────────────────────────────────────────────────────────
// Connect to MongoDB & Start Server
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');

    const server = app.listen(PORT, () => {
      console.log(`🚀 RentFAX API running at http://localhost:${PORT}`);
    });

    // Graceful Shutdown
    const shutdown = (err) => {
      console.error(err ? `💥 ${err}` : '🛑 Shutting down...');
      server.close(() => process.exit(err ? 1 : 0));
    };

    process.on('uncaughtException', shutdown);
    process.on('unhandledRejection', shutdown);
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.warn(`⚠️ Port ${PORT} is in use. Please change the port.`);
      } else {
        shutdown(err);
      }
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });
