import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { localUserStore } from '../controllers/authController.js';
import { checkIsUserBlocked } from '../services/blockService.js';

/**
 * JWT Authentication Middleware
 * 1. Reads Authorization header (Bearer <token>)
 * 2. Verifies JWT signature and expiry
 * 3. Enforces session revocation via tokenVersion
 * 4. Checks account status & auto-resolves expired temporary blocks
 * 5. Attaches sanitized user info to req.user
 */
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const secret = process.env.JWT_SECRET;

      if (!secret) {
        return res.status(500).json({
          success: false,
          message: 'Server security configuration error (JWT_SECRET)',
        });
      }

      const decoded = jwt.verify(token, secret);
      const userId = decoded.userId || decoded._id || decoded.id;

      // 1. Direct Block Verification across Multi-Factor Registry (ID, Email, Phone)
      const blockCheck = await checkIsUserBlocked({
        userId,
        email: decoded.email,
        phone: decoded.phone,
      });

      if (blockCheck.isBlocked) {
        return res.status(403).json({
          success: false,
          code: 'ACCOUNT_BLOCKED',
          message: 'Your account has been temporarily restricted from placing orders. Please contact RU Biker World Support for assistance.',
          blockDetails: blockCheck.blockDetails || {
            reason: 'Account access has been restricted by administration.',
            blockType: 'permanent',
            blockedAt: new Date(),
          },
        });
      }

      let user = blockCheck.user || null;
      if (!user) {
        try {
          user = await User.findById(userId);
        } catch (dbErr) {
          // Fallback
        }
      }

      if (!user) {
        // Check local store
        for (const lu of localUserStore.values()) {
          if (lu.id === userId || lu._id === userId || lu.email === decoded.email) {
            user = lu;
            break;
          }
        }
      }

      if (!user) {
        return res.status(401).json({
          success: false,
          code: 'USER_NOT_FOUND',
          message: 'User account associated with this session no longer exists.',
        });
      }

      // Check for expired temporary block and auto-recover
      if (
        user.status === 'temporarily_blocked' &&
        user.blockDetails?.blockedUntil &&
        new Date(user.blockDetails.blockedUntil) <= new Date()
      ) {
        user.status = 'active';
        user.isActive = true;
        user.blockDetails = undefined;
        if (typeof user.save === 'function') {
          await user.save();
        }
      }

      // Verify Account Status (Blocked / Temporarily Blocked / Inactive)
      const isBlocked =
        user.status === 'blocked' ||
        user.status === 'temporarily_blocked' ||
        user.isActive === false;

      if (isBlocked) {
        return res.status(403).json({
          success: false,
          code: 'ACCOUNT_BLOCKED',
          message: 'Your account has been temporarily restricted from placing orders. Please contact RU Biker World Support for assistance.',
          blockDetails: user.blockDetails || {
            reason: 'Account access has been restricted by administration.',
            blockType: user.status === 'temporarily_blocked' ? 'temporary' : 'permanent',
            blockedAt: user.updatedAt || new Date(),
          },
        });
      }

      // Verify Token Version (Enforce Instant Force Logout / Revocation)
      const currentTokenVersion = user.tokenVersion !== undefined ? user.tokenVersion : 0;
      const tokenTokenVersion = decoded.tokenVersion !== undefined ? decoded.tokenVersion : 0;

      if (tokenTokenVersion !== currentTokenVersion) {
        return res.status(401).json({
          success: false,
          code: 'SESSION_REVOKED',
          message: 'Your session has been terminated or password was changed. Please log in again.',
        });
      }

      req.user = user;
      return next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        code: 'INVALID_TOKEN',
        message: 'Not authorized, session expired or token invalid.',
      });
    }
  }

  return res.status(401).json({
    success: false,
    code: 'NO_TOKEN',
    message: 'Not authorized, authentication token is required.',
  });
};

export const optionalProtect = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const secret = process.env.JWT_SECRET;
      if (secret) {
        const decoded = jwt.verify(token, secret);
        const userId = decoded.userId || decoded._id || decoded.id;
        let user = null;
        try {
          user = await User.findById(userId);
        } catch {}

        if (!user) {
          for (const lu of localUserStore.values()) {
            if (lu.id === userId || lu._id === userId || lu.email === decoded.email) {
              user = lu;
              break;
            }
          }
        }

        if (user) {
          // Check auto-unblock
          if (
            user.status === 'temporarily_blocked' &&
            user.blockDetails?.blockedUntil &&
            new Date(user.blockDetails.blockedUntil) <= new Date()
          ) {
            user.status = 'active';
            user.isActive = true;
            user.blockDetails = undefined;
            if (typeof user.save === 'function') await user.save();
          }

          const isBlocked =
            user.status === 'blocked' ||
            user.status === 'temporarily_blocked' ||
            user.isActive === false;

          const currentTokenVersion = user.tokenVersion !== undefined ? user.tokenVersion : 0;
          const tokenTokenVersion = decoded.tokenVersion !== undefined ? decoded.tokenVersion : 0;

          if (!isBlocked && currentTokenVersion === tokenTokenVersion) {
            req.user = user;
          }
        }
      }
    } catch {
      // Ignore token errors for optional protection
    }
  }
  return next();
};

export default protect;
