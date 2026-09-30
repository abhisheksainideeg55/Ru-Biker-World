import mongoose from 'mongoose';
import User from '../models/User.js';
import { localUserStore } from '../controllers/authController.js';

const isDbConnected = () => mongoose.connection && mongoose.connection.readyState === 1;

// Global in-memory blocked identity registry for fast multi-factor lookups (ID, Phone, Email)
export const blockedUserRegistry = new Map();

/**
 * Normalizes phone numbers to 10 digits
 */
export const normalizePhone = (phone) => {
  if (!phone) return '';
  const digits = String(phone).replace(/\D/g, '');
  return digits.slice(-10);
};

/**
 * Normalizes email address
 */
export const normalizeEmail = (email) => {
  if (!email) return '';
  return String(email).trim().toLowerCase();
};

/**
 * Checks if a user is currently blocked across MongoDB, localUserStore, and blockedRegistry
 */
export const checkIsUserBlocked = async ({ userId = null, email = null, phone = null }) => {
  const cleanPhone = normalizePhone(phone);
  const cleanEmail = normalizeEmail(email);
  const cleanUserId = userId ? String(userId) : '';

  // 1. Fast lookup in in-memory blocked registry
  if (cleanUserId && blockedUserRegistry.has(`id_${cleanUserId}`)) {
    const entry = blockedUserRegistry.get(`id_${cleanUserId}`);
    if (entry.expiresAt && new Date() >= entry.expiresAt) {
      blockedUserRegistry.delete(`id_${cleanUserId}`);
    } else {
      return { isBlocked: true, blockDetails: entry.blockDetails };
    }
  }

  if (cleanPhone && blockedUserRegistry.has(`phone_${cleanPhone}`)) {
    const entry = blockedUserRegistry.get(`phone_${cleanPhone}`);
    if (entry.expiresAt && new Date() >= entry.expiresAt) {
      blockedUserRegistry.delete(`phone_${cleanPhone}`);
    } else {
      return { isBlocked: true, blockDetails: entry.blockDetails };
    }
  }

  if (cleanEmail && blockedUserRegistry.has(`email_${cleanEmail}`)) {
    const entry = blockedUserRegistry.get(`email_${cleanEmail}`);
    if (entry.expiresAt && new Date() >= entry.expiresAt) {
      blockedUserRegistry.delete(`email_${cleanEmail}`);
    } else {
      return { isBlocked: true, blockDetails: entry.blockDetails };
    }
  }

  // 2. Database lookup if MongoDB is connected
  if (isDbConnected()) {
    try {
      const orQueries = [];
      if (cleanUserId && mongoose.Types.ObjectId.isValid(cleanUserId)) {
        orQueries.push({ _id: cleanUserId });
      }
      if (cleanPhone) {
        orQueries.push({ phone: cleanPhone });
        orQueries.push({ phone: `+91${cleanPhone}` });
        orQueries.push({ phone: `+91 ${cleanPhone}` });
      }
      if (cleanEmail) {
        orQueries.push({ email: cleanEmail });
      }

      if (orQueries.length > 0) {
        const users = await User.find({ $or: orQueries });
        for (const user of users) {
          // Check for expired temporary block
          if (
            user.status === 'temporarily_blocked' &&
            user.blockDetails?.blockedUntil &&
            new Date(user.blockDetails.blockedUntil) <= new Date()
          ) {
            user.status = 'active';
            user.isActive = true;
            user.blockDetails = undefined;
            await user.save();
            continue;
          }

          if (
            user.status === 'blocked' ||
            user.status === 'temporarily_blocked' ||
            user.isActive === false
          ) {
            return {
              isBlocked: true,
              user,
              blockDetails: user.blockDetails || {
                reason: 'Account restricted by administration.',
                blockType: user.status === 'temporarily_blocked' ? 'temporary' : 'permanent',
              },
            };
          }
        }
      }
    } catch (err) {
      console.warn('[BlockService] DB query error:', err.message);
    }
  }

  // 3. Check localUserStore (Dev/In-Memory fallback)
  for (const lu of localUserStore.values()) {
    const luPhone = normalizePhone(lu.phone);
    const luEmail = normalizeEmail(lu.email);
    const luId = String(lu.id || lu._id || '');

    const matches =
      (cleanUserId && luId && cleanUserId === luId) ||
      (cleanPhone && luPhone && cleanPhone === luPhone) ||
      (cleanEmail && luEmail && cleanEmail === luEmail);

    if (matches) {
      // Check for expired temporary block
      if (
        lu.status === 'temporarily_blocked' &&
        lu.blockDetails?.blockedUntil &&
        new Date(lu.blockDetails.blockedUntil) <= new Date()
      ) {
        lu.status = 'active';
        lu.isActive = true;
        lu.blockDetails = undefined;
        continue;
      }

      if (
        lu.status === 'blocked' ||
        lu.status === 'temporarily_blocked' ||
        lu.isActive === false
      ) {
        return {
          isBlocked: true,
          user: lu,
          blockDetails: lu.blockDetails || {
            reason: 'Account restricted by administration.',
            blockType: lu.status === 'temporarily_blocked' ? 'temporary' : 'permanent',
          },
        };
      }
    }
  }

  return { isBlocked: false, blockDetails: null };
};

/**
 * Registers an active block across memory and registries
 */
export const registerBlock = ({ userId, email, phone, blockDetails, blockedUntil }) => {
  const cleanPhone = normalizePhone(phone);
  const cleanEmail = normalizeEmail(email);
  const cleanUserId = userId ? String(userId) : '';
  const expiresAt = blockedUntil ? new Date(blockedUntil) : null;

  const payload = {
    blockDetails,
    expiresAt,
    blockedAt: new Date(),
  };

  if (cleanUserId) blockedUserRegistry.set(`id_${cleanUserId}`, payload);
  if (cleanPhone) blockedUserRegistry.set(`phone_${cleanPhone}`, payload);
  if (cleanEmail) blockedUserRegistry.set(`email_${cleanEmail}`, payload);
};

/**
 * Removes a block from the registry
 */
export const unregisterBlock = ({ userId, email, phone }) => {
  const cleanPhone = normalizePhone(phone);
  const cleanEmail = normalizeEmail(email);
  const cleanUserId = userId ? String(userId) : '';

  if (cleanUserId) blockedUserRegistry.delete(`id_${cleanUserId}`);
  if (cleanPhone) blockedUserRegistry.delete(`phone_${cleanPhone}`);
  if (cleanEmail) blockedUserRegistry.delete(`email_${cleanEmail}`);
};
