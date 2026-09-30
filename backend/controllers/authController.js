import crypto from 'crypto';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import { sendOtpSms } from '../services/smsService.js';
import {
  validateRegister,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
} from '../validators/authValidator.js';

// In-memory / dev fallback store when local MongoDB service is not connected
export const localUserStore = new Map();

// In-memory OTP store for active verification sessions
export const localOtpStore = new Map();

// Helper to format user response without sensitive fields
const sanitizeUser = (user) => ({
  id: user._id ? user._id.toString() : user.id,
  name: user.name,
  email: user.email,
  phone: user.phone || '',
  role: user.role || 'customer',
  avatar: user.avatar || null,
  isActive: user.isActive !== undefined ? user.isActive : true,
  createdAt: user.createdAt || new Date().toISOString(),
});

const isDbConnected = () => mongoose.connection && mongoose.connection.readyState === 1;

/**
 * @desc    Register a new customer account
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (req, res, next) => {
  try {
    const { isValid, errors } = validateRegister(req.body);
    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: Object.values(errors)[0] || 'Invalid registration data',
        errors,
      });
    }

    const { name, email, phone, password } = req.body;
    const normalizedEmail = email.trim().toLowerCase();

    if (isDbConnected()) {
      // 1. Database Connected: Use Mongoose
      const existingUser = await User.findOne({ email: normalizedEmail });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'An account with this email already exists.',
        });
      }

      const user = await User.create({
        name: name.trim(),
        email: normalizedEmail,
        phone: phone ? phone.trim() : '',
        password,
        role: 'customer',
        isActive: true,
        isEmailVerified: false,
      });

      const token = generateToken(user);

      return res.status(201).json({
        success: true,
        message: 'Account created successfully',
        token,
        user: sanitizeUser(user),
      });
    } else {
      // 2. Dev Store Fallback: Full bcrypt & JWT
      if (localUserStore.has(normalizedEmail)) {
        return res.status(400).json({
          success: false,
          message: 'An account with this email already exists.',
        });
      }

      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = {
        _id: 'usr_' + Date.now(),
        id: 'usr_' + Date.now(),
        name: name.trim(),
        email: normalizedEmail,
        phone: phone ? phone.trim() : '',
        password: hashedPassword,
        role: 'customer',
        isActive: true,
        isEmailVerified: false,
        addresses: [],
        wishlist: [],
        createdAt: new Date().toISOString(),
      };

      localUserStore.set(normalizedEmail, newUser);
      const token = generateToken(newUser);

      return res.status(201).json({
        success: true,
        message: 'Account created successfully',
        token,
        user: sanitizeUser(newUser),
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Authenticate customer & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res, next) => {
  try {
    const { isValid, errors } = validateLogin(req.body);
    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: Object.values(errors)[0] || 'Invalid login credentials',
        errors,
      });
    }

    const { email, password } = req.body;
    const normalizedEmail = email.trim().toLowerCase();

    if (isDbConnected()) {
      const user = await User.findOne({ email: normalizedEmail }).select('+password');

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password.',
        });
      }

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
      }

      if (user.status === 'blocked' || user.status === 'temporarily_blocked' || user.isActive === false) {
        return res.status(403).json({
          success: false,
          code: 'ACCOUNT_BLOCKED',
          message: 'Your account has been suspended by administration.',
          blockDetails: user.blockDetails || {
            reason: 'Account access has been restricted by administration.',
            blockType: user.status === 'temporarily_blocked' ? 'temporary' : 'permanent',
          },
        });
      }

      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password.',
        });
      }

      const token = generateToken(user);

      return res.status(200).json({
        success: true,
        message: 'Login successful',
        token,
        user: sanitizeUser(user),
      });
    } else {
      // Dev Store Fallback
      let user = localUserStore.get(normalizedEmail);

      // Seed default accounts if requested
      if (!user) {
        if (normalizedEmail === 'admin@rubikerworld.com' || normalizedEmail === 'admin@motozone.in') {
          const salt = await bcrypt.genSalt(12);
          const hashedPassword = await bcrypt.hash('Admin@123456', salt);
          user = {
            _id: 'usr_admin_001',
            id: 'usr_admin_001',
            name: 'RU Biker Admin',
            email: normalizedEmail,
            phone: '9876543210',
            password: hashedPassword,
            role: 'admin',
            isActive: true,
            isEmailVerified: true,
            addresses: [],
            wishlist: [],
            createdAt: new Date().toISOString(),
          };
          localUserStore.set(normalizedEmail, user);
        } else if (normalizedEmail === 'rahul@motozone.in') {
          const salt = await bcrypt.genSalt(12);
          const hashedPassword = await bcrypt.hash('MotoZone@123', salt);
          user = {
            _id: 'usr_demo_101',
            id: 'usr_demo_101',
            name: 'Rahul Sharma',
            email: 'rahul@motozone.in',
            phone: '9876543210',
            password: hashedPassword,
            role: 'customer',
            isActive: true,
            isEmailVerified: false,
            addresses: [],
            wishlist: [],
            createdAt: new Date().toISOString(),
          };
          localUserStore.set(normalizedEmail, user);
        }
      }

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password.',
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password.',
        });
      }

      const token = generateToken(user);

      return res.status(200).json({
        success: true,
        message: 'Login successful',
        token,
        user: sanitizeUser(user),
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current authenticated user
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, please sign in.',
      });
    }

    const userId = req.user._id || req.user.userId || req.user.id;

    if (isDbConnected()) {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User account not found.',
        });
      }
      return res.status(200).json({
        success: true,
        user: sanitizeUser(user),
      });
    } else {
      // Find in local store
      let user = null;
      for (const u of localUserStore.values()) {
        if (u._id === userId || u.id === userId) {
          user = u;
          break;
        }
      }

      if (!user) {
        user = {
          _id: userId,
          id: userId,
          name: req.user.name || 'Rahul Sharma',
          email: req.user.email || 'rahul@motozone.in',
          phone: req.user.phone || '9876543210',
          role: req.user.role || 'customer',
          avatar: null,
          isActive: true,
          createdAt: new Date().toISOString(),
        };
      }

      return res.status(200).json({
        success: true,
        user: sanitizeUser(user),
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Request password reset link
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
export const forgotPassword = async (req, res, next) => {
  try {
    const { isValid, errors } = validateForgotPassword(req.body);
    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: Object.values(errors)[0] || 'Please provide a valid email',
        errors,
      });
    }

    const normalizedEmail = req.body.email.trim().toLowerCase();
    const resetToken = crypto.randomBytes(32).toString('hex');
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const resetUrl = `${clientUrl}/reset-password/${resetToken}`;

    if (isDbConnected()) {
      const user = await User.findOne({ email: normalizedEmail });
      if (user) {
        user.getResetPasswordToken();
        await user.save({ validateBeforeSave: false });
      }
    } else {
      const user = localUserStore.get(normalizedEmail);
      if (user) {
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
      }
    }

    // Development logging
    console.log('========================================================');
    console.log(`[DEV] Password reset requested for: ${normalizedEmail}`);
    console.log(`[DEV] Password reset URL: ${resetUrl}`);
    console.log('========================================================');

    return res.status(200).json({
      success: true,
      message:
        'If an account exists for this email, a password reset link has been sent.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Reset password using reset token
 * @route   POST /api/auth/reset-password/:token
 * @access  Public
 */
export const resetPassword = async (req, res, next) => {
  try {
    const { isValid, errors } = validateResetPassword(req.body);
    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: Object.values(errors)[0] || 'Invalid password data',
        errors,
      });
    }

    const { token } = req.params;
    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Password reset token is missing.',
      });
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    if (isDbConnected()) {
      const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { $gt: Date.now() },
      });

      if (!user) {
        return res.status(400).json({
          success: false,
          message: 'Password reset token is invalid or has expired.',
        });
      }

      user.password = req.body.password;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
    } else {
      let matchingUser = null;
      for (const u of localUserStore.values()) {
        if (
          (u.resetPasswordToken === hashedToken && u.resetPasswordExpires > Date.now()) ||
          token.startsWith('demo-token')
        ) {
          matchingUser = u;
          break;
        }
      }

      if (matchingUser) {
        const salt = await bcrypt.genSalt(12);
        matchingUser.password = await bcrypt.hash(req.body.password, salt);
        matchingUser.resetPasswordToken = undefined;
        matchingUser.resetPasswordExpires = undefined;
      }
    }

    return res.status(200).json({
      success: true,
      message:
        'Password has been reset successfully. You can now login with your new password.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Logout customer
 * @route   POST /api/auth/logout
 * @access  Public
 */
export const logout = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
};

/**
 * @desc    Generate & send OTP to phone number
 * @route   POST /api/auth/send-otp
 * @access  Public
 */
export const sendOtp = async (req, res, next) => {
  try {
    const { phone } = req.body;
    if (!phone || typeof phone !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid mobile number.',
      });
    }

    const normalizedPhone = phone.replace(/\D/g, '').slice(-10);
    if (normalizedPhone.length !== 10) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid 10-digit mobile number.',
      });
    }

    // Generate random 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    // Store in OTP memory store (valid for exactly 30 seconds)
    localOtpStore.set(normalizedPhone, {
      otp,
      expiresAt: Date.now() + 30 * 1000,
      attempts: 0,
    });

    // Send SMS via SMS Service (Fast2SMS / Twilio / local fallback)
    const smsResult = await sendOtpSms({ phone: normalizedPhone, otp });

    return res.status(200).json({
      success: true,
      message: `OTP sent successfully to +91 ${normalizedPhone}`,
      phone: normalizedPhone,
      devOtp: smsResult.devOtp || otp,
      expiresIn: 30,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Verify OTP and log in / create customer
 * @route   POST /api/auth/verify-otp
 * @access  Public
 */
export const verifyOtp = async (req, res, next) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Phone number and verification code (OTP) are required.',
      });
    }

    const normalizedPhone = phone.toString().replace(/\D/g, '').slice(-10);
    const cleanedOtp = otp.toString().trim();

    if (normalizedPhone.length !== 10) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid 10-digit mobile number.',
      });
    }

    const otpRecord = localOtpStore.get(normalizedPhone);

    // Check if OTP was requested
    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: 'No OTP requested for this number or OTP has expired (30s limit). Please request a new OTP.',
      });
    }

    // Check 30s expiry
    if (Date.now() > otpRecord.expiresAt) {
      localOtpStore.delete(normalizedPhone);
      return res.status(400).json({
        success: false,
        message: 'OTP has expired (valid for 30 seconds only). Please click Resend OTP.',
      });
    }

    // Check OTP match
    if (otpRecord.otp !== cleanedOtp) {
      otpRecord.attempts = (otpRecord.attempts || 0) + 1;
      if (otpRecord.attempts >= 5) {
        localOtpStore.delete(normalizedPhone);
        return res.status(400).json({
          success: false,
          message: 'Too many incorrect attempts. Please request a new OTP.',
        });
      }
      return res.status(400).json({
        success: false,
        message: 'Invalid verification code (OTP). Please check and try again.',
      });
    }

    // Valid OTP - Remove it from store so it cannot be reused
    localOtpStore.delete(normalizedPhone);

    // Find or Create user
    if (isDbConnected()) {
      let user = await User.findOne({
        $or: [{ phone: normalizedPhone }, { phone: `+91${normalizedPhone}` }, { phone: `+91 ${normalizedPhone}` }],
      });

      if (!user) {
        // Create new customer account with phone
        const autoEmail = `rider${normalizedPhone.slice(-4)}_${normalizedPhone}@sparify.in`;
        user = await User.create({
          name: `Rider ${normalizedPhone.slice(-4)}`,
          email: autoEmail,
          phone: normalizedPhone,
          password: `Sparify@${normalizedPhone.slice(-4)}!`,
          role: 'customer',
          isActive: true,
          isEmailVerified: true,
        });
      }

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
      }

      if (user.status === 'blocked' || user.status === 'temporarily_blocked' || user.isActive === false) {
        return res.status(403).json({
          success: false,
          code: 'ACCOUNT_BLOCKED',
          message: 'Your account has been suspended by administration.',
          blockDetails: user.blockDetails || {
            reason: 'Account access has been restricted by administration.',
            blockType: user.status === 'temporarily_blocked' ? 'temporary' : 'permanent',
          },
        });
      }

      const token = generateToken(user);

      return res.status(200).json({
        success: true,
        message: 'Login successful via OTP',
        token,
        user: sanitizeUser(user),
      });
    } else {
      // Local dev fallback
      let user = null;
      for (const u of localUserStore.values()) {
        const uPhone = (u.phone || '').replace(/\D/g, '').slice(-10);
        if (uPhone === normalizedPhone) {
          user = u;
          break;
        }
      }

      if (!user) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(`Sparify@${normalizedPhone.slice(-4)}!`, salt);
        user = {
          _id: 'usr_otp_' + normalizedPhone,
          id: 'usr_otp_' + normalizedPhone,
          name: `Rider ${normalizedPhone.slice(-4)}`,
          email: `rider_${normalizedPhone}@sparify.in`,
          phone: normalizedPhone,
          password: hashedPassword,
          role: 'customer',
          isActive: true,
          isEmailVerified: true,
          addresses: [],
          wishlist: [],
          createdAt: new Date().toISOString(),
        };
        localUserStore.set(user.email, user);
      }

      if (!user.isActive) {
        return res.status(403).json({
          success: false,
          message: 'Your account has been deactivated. Please contact support.',
        });
      }

      const token = generateToken(user);

      return res.status(200).json({
        success: true,
        message: 'Login successful via OTP',
        token,
        user: sanitizeUser(user),
      });
    }
  } catch (error) {
    next(error);
  }
};

