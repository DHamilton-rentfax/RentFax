// backend/utils/logger.js

const fs = require('fs');
const path = require('path');
const { createLogger, format, transports } = require('winston');

// Ensure logs directory exists
const logDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }), // capture stack traces
    format.splat(),
    format.json()
  ),
  transports: [
    // Error logs
    new transports.File({
      filename: path.join(logDir, 'stripe-errors.log'),
      level: 'error',
      handleExceptions: true,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // General logs
    new transports.File({
      filename: path.join(logDir, 'combined.log'),
      level: 'info',
      maxsize: 5242880,
      maxFiles: 5,
    }),
  ],
});

// Add console only in development
if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    format: format.combine(
      format.colorize(),
      format.simple()
    ),
  }));
}

module.exports = logger;
