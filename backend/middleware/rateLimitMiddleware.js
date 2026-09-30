/**
 * In-Memory Sliding Window Rate Limiter Middleware
 * Protects auth, payment, and public tracking endpoints against brute force and abuse
 */

const hitRecords = new Map();

// Periodic cleanup of expired rate limit windows every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of hitRecords.entries()) {
    if (now > record.resetTime) {
      hitRecords.delete(key);
    }
  }
}, 5 * 60 * 1000);

export const createRateLimiter = ({
  windowMs = 15 * 60 * 1000,
  max = 100,
  message = 'Too many requests from this IP, please try again later.',
  code = 'RATE_LIMIT_EXCEEDED',
} = {}) => {
  return (req, res, next) => {
    // Skip rate limiting in automated unit tests
    if (process.env.NODE_ENV === 'test') {
      return next();
    }

    const ip =
      req.ip ||
      req.headers['x-forwarded-for'] ||
      req.connection?.remoteAddress ||
      'unknown-ip';

    const routeKey = `${req.baseUrl || ''}${req.path || ''}`;
    const key = `${ip}_${routeKey}`;
    const now = Date.now();

    let record = hitRecords.get(key);

    if (!record || now > record.resetTime) {
      record = {
        count: 1,
        resetTime: now + windowMs,
      };
      hitRecords.set(key, record);
    } else {
      record.count += 1;
    }

    const remaining = Math.max(0, max - record.count);
    const resetSeconds = Math.ceil((record.resetTime - now) / 1000);

    res.setHeader('X-RateLimit-Limit', max);
    res.setHeader('X-RateLimit-Remaining', remaining);
    res.setHeader('X-RateLimit-Reset', resetSeconds);

    if (record.count > max) {
      return res.status(429).json({
        success: false,
        message,
        code,
        retryAfterSeconds: resetSeconds,
      });
    }

    next();
  };
};

// Sensitive Auth Rate Limiter (15 attempts / 15 minutes)
export const authLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 15,
  message: 'Too many authentication attempts from this IP. Please try again after 15 minutes.',
  code: 'AUTH_RATE_LIMIT_EXCEEDED',
});

// Payment Operations Rate Limiter (30 attempts / 15 minutes)
export const paymentLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: 'Too many payment requests initiated. Please wait a moment before trying again.',
  code: 'PAYMENT_RATE_LIMIT_EXCEEDED',
});

// Public Guest Tracking Limiter (40 lookups / 15 minutes)
export const trackingLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 40,
  message: 'Too many order tracking lookups from this IP. Please try again in a few minutes.',
  code: 'TRACKING_RATE_LIMIT_EXCEEDED',
});

// General Public API Limiter (300 requests / 15 minutes)
export const generalApiLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: 'Request limit exceeded. Please slow down your requests.',
  code: 'API_RATE_LIMIT_EXCEEDED',
});

export default {
  createRateLimiter,
  authLimiter,
  paymentLimiter,
  trackingLimiter,
  generalApiLimiter,
};
