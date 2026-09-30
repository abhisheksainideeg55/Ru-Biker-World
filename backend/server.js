import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import { initSocket, broadcastUserBlocked, broadcastUserUpdated } from './services/socketService.js';
import User from './models/User.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import { sanitizeQuery } from './middleware/validationMiddleware.js';
import {
  authLimiter,
  paymentLimiter,
  trackingLimiter,
  generalApiLimiter,
} from './middleware/rateLimitMiddleware.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import bikeRoutes from './routes/bikeRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import singleReviewRoutes from './routes/singleReviewRoutes.js';
import userRoutes from './routes/userRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import offerRoutes from './routes/offerRoutes.js';
import couponRoutes from './routes/couponRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import returnRoutes from './routes/returnRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import contentRoutes from './routes/contentRoutes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// 1. Security Headers (Helmet with Razorpay & Cloudinary compatibility)
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'https://checkout.razorpay.com'],
        frameSrc: ["'self'", 'https://api.razorpay.com', 'https://checkout.razorpay.com'],
        connectSrc: ["'self'", 'https://api.razorpay.com', 'https://lumberjack.razorpay.com', CLIENT_URL, 'ws:', 'wss:'],
        imgSrc: ["'self'", 'data:', 'blob:', 'https://images.unsplash.com', 'https://*.razorpay.com', 'https://res.cloudinary.com', 'https://*.cloudinary.com'],
        mediaSrc: ["'self'", 'data:', 'blob:', 'https://res.cloudinary.com', 'https://*.cloudinary.com', 'https://assets.mixkit.co', 'https://www.w3schools.com'],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);

// 2. Strict CORS Configuration
const allowedOrigins = [
  CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked for origin: ${origin}`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'x-admin-dev-access', 'Accept', 'Origin'],
  })
);

// 3. Request Body Parsing & Limits
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// 4. Global Query Sanitization
app.use(sanitizeQuery);

// 5. Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'ok',
    service: 'ru-biker-world-api',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  });
});

// 6. Rate Limiting on sensitive routes
app.use('/api/auth', authLimiter);
app.use('/api/payments', paymentLimiter);
app.use('/api/orders/track', trackingLimiter);

// 7. API Routes Architecture
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/bikes', bikeRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/returns', returnRoutes);
app.use('/api/reviews', singleReviewRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/content', contentRoutes);

// 8. 404 & Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

// 9. HTTP Server & WebSocket Architecture
const httpServer = http.createServer(app);
export const io = initSocket(httpServer, allowedOrigins);
export { broadcastUserBlocked, broadcastUserUpdated };

// 10. Background Auto-Unblock Job for expired temporary suspensions
const runAutoUnblockJob = async () => {
  try {
    if (mongoose.connection && mongoose.connection.readyState === 1) {
      const now = new Date();
      const expiredBlockedUsers = await User.find({
        status: 'temporarily_blocked',
        'blockDetails.blockedUntil': { $lte: now },
      });

      if (expiredBlockedUsers.length > 0) {
        for (const u of expiredBlockedUsers) {
          u.status = 'active';
          u.isActive = true;
          u.blockDetails = undefined;
          await u.save();
          console.log(`[AutoUnblock] Auto-unblocked user ${u.email} (ID: ${u._id})`);
          broadcastUserUpdated(u._id, { status: 'active', isActive: true });
        }
      }
    }
  } catch (err) {
    console.error('[AutoUnblock Job Error]:', err.message);
  }
};

setInterval(runAutoUnblockJob, 30000);

// 11. Database Connection & Server Startup
let server = null;

const startServer = async () => {
  server = httpServer.listen(PORT, () => {
    console.log(
      `[RU Biker World Backend] Production server with WebSockets running in ${
        process.env.NODE_ENV || 'development'
      } mode on port ${PORT}`
    );
  });
  connectDB().catch((err) => {
    console.error('[MongoDB] Initial connection error:', err.message);
  });
};

// 12. Graceful Shutdown Handlers
const handleGracefulShutdown = (signal) => {
  console.log(`[RU Biker World Backend] Received ${signal}. Starting graceful shutdown...`);
  if (server) {
    server.close(() => {
      console.log('[RU Biker World Backend] HTTP & WebSocket server closed.');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
};

process.on('SIGTERM', () => handleGracefulShutdown('SIGTERM'));
process.on('SIGINT', () => handleGracefulShutdown('SIGINT'));

startServer();

export default app;
