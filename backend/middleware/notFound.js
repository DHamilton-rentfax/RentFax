/**
 * Middleware to handle 404 Not Found errors
 */
const notFound = (req, res, next) => {
  res.status(404).json({
    error: `🚫 Route not found: ${req.originalUrl}`,
  });
};

export default notFound;
