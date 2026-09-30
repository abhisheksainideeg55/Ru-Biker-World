/**
 * 404 Not Found Middleware
 */
export const notFound = (req, res, next) => {
  const error = new Error(`Resource Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * Centralized Production-Hardened Global Error Handler
 */
export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? (err.status || 500) : res.statusCode;

  // Handle specific Mongoose/MongoDB errors cleanly
  let message = err.message || 'Internal Server Error';
  let code = err.code || 'INTERNAL_SERVER_ERROR';

  if (err.name === 'CastError') {
    message = `Invalid format for resource identifier: ${err.value}`;
    code = 'RESOURCE_CAST_ERROR';
  } else if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    message = `Duplicate entry error: An item with this ${field} already exists.`;
    code = 'DUPLICATE_KEY_ERROR';
  } else if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors || {}).map((e) => e.message);
    message = messages.join('. ') || 'Database validation failed.';
    code = 'VALIDATION_ERROR';
  }

  // Never expose internal database stack traces or file system paths in production
  const isProduction = process.env.NODE_ENV === 'production';

  res.status(statusCode).json({
    success: false,
    message,
    code,
    ...(isProduction ? {} : { stack: err.stack }),
  });
};

export default {
  notFound,
  errorHandler,
};
