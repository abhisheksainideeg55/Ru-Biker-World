import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import User from '../models/User.js';
import { validateProfileUpdate } from '../validators/authValidator.js';
import { localUserStore } from './authController.js';

const isDbConnected = () => mongoose.connection && mongoose.connection.readyState === 1;

const sanitizeUser = (user) => ({
  id: user._id ? user._id.toString() : user.id,
  name: user.name,
  email: user.email,
  phone: user.phone || '',
  role: user.role || 'customer',
  avatar: user.avatar || null,
  addresses: user.addresses || [],
  preferences: user.preferences || {
    emailNotifications: true,
    orderNotifications: true,
    promotionalNotifications: false,
  },
  wishlist: user.wishlist || [],
  isActive: user.isActive !== undefined ? user.isActive : true,
  createdAt: user.createdAt,
});

/**
 * @desc    Get current user profile
 * @route   GET /api/users/me
 * @access  Private
 */
export const getMyProfile = async (req, res, next) => {
  try {
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
          addresses: [],
          preferences: {
            emailNotifications: true,
            orderNotifications: true,
            promotionalNotifications: false,
          },
          wishlist: [],
          isActive: true,
          createdAt: new Date().toISOString(),
        };
        localUserStore.set(user.email, user);
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
 * @desc    Update customer profile (name, phone, avatar)
 * @route   PUT /api/users/me
 * @access  Private
 */
export const updateMyProfile = async (req, res, next) => {
  try {
    const { isValid, errors } = validateProfileUpdate(req.body);
    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: Object.values(errors)[0] || 'Invalid profile data',
        errors,
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

      if (req.body.name !== undefined) {
        user.name = req.body.name.trim();
      }
      if (req.body.phone !== undefined) {
        user.phone = req.body.phone ? req.body.phone.trim() : '';
      }
      if (req.body.avatar !== undefined) {
        user.avatar = req.body.avatar;
      }

      await user.save();

      return res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        user: sanitizeUser(user),
      });
    } else {
      let user = null;
      for (const u of localUserStore.values()) {
        if (u._id === userId || u.id === userId) {
          user = u;
          break;
        }
      }

      if (user) {
        if (req.body.name !== undefined) user.name = req.body.name.trim();
        if (req.body.phone !== undefined) user.phone = req.body.phone ? req.body.phone.trim() : '';
        if (req.body.avatar !== undefined) user.avatar = req.body.avatar;
      }

      return res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        user: sanitizeUser(user || req.user),
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Change customer password securely
 * @route   PUT /api/users/me/password
 * @access  Private
 */
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    if (!currentPassword || typeof currentPassword !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Current password is required.',
      });
    }

    if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 8 characters long.',
      });
    }

    if (confirmNewPassword && newPassword !== confirmNewPassword) {
      return res.status(400).json({
        success: false,
        message: 'Confirm new password does not match.',
      });
    }

    const userId = req.user._id || req.user.userId || req.user.id;

    if (isDbConnected()) {
      const user = await User.findById(userId).select('+password');
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User account not found.',
        });
      }

      const isMatch = await user.matchPassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: 'Current password is incorrect.',
        });
      }

      user.password = newPassword;
      await user.save();

      return res.status(200).json({
        success: true,
        message: 'Password changed successfully.',
      });
    } else {
      let user = null;
      for (const u of localUserStore.values()) {
        if (u._id === userId || u.id === userId) {
          user = u;
          break;
        }
      }

      if (user) {
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
          return res.status(400).json({
            success: false,
            message: 'Current password is incorrect.',
          });
        }

        const salt = await bcrypt.genSalt(12);
        user.password = await bcrypt.hash(newPassword, salt);
      }

      return res.status(200).json({
        success: true,
        message: 'Password changed successfully.',
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Remove customer profile avatar
 * @route   DELETE /api/users/me/avatar
 * @access  Private
 */
export const removeAvatar = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.userId || req.user.id;

    if (isDbConnected()) {
      const user = await User.findById(userId);
      if (user) {
        user.avatar = null;
        await user.save();
      }
      return res.status(200).json({
        success: true,
        message: 'Avatar removed successfully.',
        user: sanitizeUser(user),
      });
    } else {
      for (const u of localUserStore.values()) {
        if (u._id === userId || u.id === userId) {
          u.avatar = null;
          return res.status(200).json({
            success: true,
            message: 'Avatar removed successfully.',
            user: sanitizeUser(u),
          });
        }
      }
      return res.status(200).json({
        success: true,
        message: 'Avatar removed successfully.',
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user preferences
 * @route   GET /api/users/me/preferences
 * @access  Private
 */
export const getPreferences = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.userId || req.user.id;

    if (isDbConnected()) {
      const user = await User.findById(userId);
      return res.status(200).json({
        success: true,
        preferences: user?.preferences || {
          emailNotifications: true,
          orderNotifications: true,
          promotionalNotifications: false,
        },
      });
    } else {
      let preferences = {
        emailNotifications: true,
        orderNotifications: true,
        promotionalNotifications: false,
      };
      for (const u of localUserStore.values()) {
        if (u._id === userId || u.id === userId) {
          if (u.preferences) preferences = u.preferences;
          break;
        }
      }
      return res.status(200).json({
        success: true,
        preferences,
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user preferences
 * @route   PUT /api/users/me/preferences
 * @access  Private
 */
export const updatePreferences = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.userId || req.user.id;
    const { emailNotifications, orderNotifications, promotionalNotifications } = req.body;

    const newPrefs = {
      emailNotifications: emailNotifications !== undefined ? !!emailNotifications : true,
      orderNotifications: orderNotifications !== undefined ? !!orderNotifications : true,
      promotionalNotifications: promotionalNotifications !== undefined ? !!promotionalNotifications : false,
    };

    if (isDbConnected()) {
      const user = await User.findById(userId);
      if (user) {
        user.preferences = newPrefs;
        await user.save();
      }
      return res.status(200).json({
        success: true,
        message: 'Preferences updated successfully.',
        preferences: newPrefs,
      });
    } else {
      for (const u of localUserStore.values()) {
        if (u._id === userId || u.id === userId) {
          u.preferences = newPrefs;
          break;
        }
      }
      return res.status(200).json({
        success: true,
        message: 'Preferences updated successfully.',
        preferences: newPrefs,
      });
    }
  } catch (error) {
    next(error);
  }
};
