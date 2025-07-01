// backend/middleware/errorHandler.js

const errorHandler = (err, req, res, next) => {
  console.error('❌ Global Error:', err.stack || err.message);

  res.status(err.statusCode || 500).json({
    error: err.message || 'Server Error',
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
};

export default errorHandler;
