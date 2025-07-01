// backend/app.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const logger = require('./middleware/logger');

// Auth middleware
const { authMiddleware, isAdmin } = require('./middleware/auth');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

// Route imports
const authRoutes             = require('./routes/authRoutes');
const refreshRoutes          = require('./routes/refreshRoutes');
const reportRoutes           = require('./routes/reportRoutes');
const riskReportRoutes       = require('./routes/riskReportRoutes');
const stripeRoutes           = require('./routes/stripeRoutes');
const uploadRoutes           = require('./routes/uploadRoutes');
const applicantHistoryRoutes = require('./routes/applicantHistoryRoutes');
const renterRoutes           = require('./routes/renterRoutes');
const dashboardRoutes        = require('./routes/dashboardRoutes');
const auditLogRoutes         = require('./routes/auditLogRoutes');
const seedRoutes             = require('./routes/seedRoutes');

// Persona and manual review routes
const personaRoutes         = require('./routes/personaRoutes');
const manualReviewRoutes    = require('./routes/manualReviewRoutes');
const seedRiskFactors       = require('./routes/seedRiskFactors');

const app = express();

// ─── Webhooks ───────────────────────────────────────────────────────────────
app.use(
  '/api/stripe/webhook',
  express.raw({ type: 'application/json' }),
  stripeRoutes
);
app.use(
  '/api/persona/webhook',
  express.raw({ type: 'application/json' }),
  personaRoutes
);

// ─── CORS ───────────────────────────────────────────────────────────────────
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
  : ['http://localhost:5175'];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET','POST','PUT','PATCH','DELETE'],
    allowedHeaders: ['Content-Type','Authorization'],
  })
);

app.options('*', cors());

// ─── Rate Limiting ─────────────────────────────────────────────────────────
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,                // limit each IP to 100 requests per window
    message: { error: 'Too many requests, please try again later.' },
  })
);

// ─── Middleware ─────────────────────────────────────────────────────────────
app.use(express.json());
app.use(cookieParser());
app.use(logger);

// ─── Health Check ───────────────────────────────────────────────────────────
app.get('/health', (req, res) =>
  res.status(200).json({
    status:  'ok',
    service: 'RentFAX API',
    uptime:  process.uptime(),
    time:    new Date().toISOString(),
  })
);

// ─── Public Routes ──────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/refresh', refreshRoutes);

// ─── Protected Routes ───────────────────────────────────────────────────────
app.use('/api/reports', authMiddleware, reportRoutes);
app.use('/api/risk-reports', authMiddleware, riskReportRoutes);
app.use('/api/stripe', authMiddleware, stripeRoutes);
app.use('/api/upload', authMiddleware, uploadRoutes);
app.use('/api/persona', authMiddleware, personaRoutes);
app.use('/api/applicants', authMiddleware, applicantHistoryRoutes);

// ─── Admin-Only Routes ─────────────────────────────────────────────────────
app.use('/api/renters', authMiddleware, isAdmin, renterRoutes);
app.use('/api/admin/manual-reviews', authMiddleware, isAdmin, manualReviewRoutes);
app.use('/api/admin/seed-risk-factors', authMiddleware, isAdmin, seedRiskFactors);
app.use('/api/admin-seed', authMiddleware, isAdmin, seedRoutes);
app.use('/api/dashboard', authMiddleware, isAdmin, dashboardRoutes);
app.use('/api/reports/all', authMiddleware, isAdmin, reportRoutes); // alias
app.use('/api/audit-logs', authMiddleware, isAdmin, auditLogRoutes);

// ─── Error Handling ─────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

module.exports = app;
