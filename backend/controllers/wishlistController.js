import mongoose from 'mongoose';
import User from '../models/User.js';
import { localUserStore } from './authController.js';

const isDbConnected = () => mongoose.connection && mongoose.connection.readyState === 1;

/**
 * @desc    Get user's wishlist items
 * @route   GET /api/users/me/wishlist
 * @access  Private
 */
export const getWishlist = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.userId || req.user.id;

    if (isDbConnected()) {
      const user = await User.findById(userId);
      return res.status(200).json({
        success: true,
        wishlist: user?.wishlist || [],
      });
    } else {
      let user = null;
      for (const u of localUserStore.values()) {
        if (u._id === userId || u.id === userId) {
          user = u;
          break;
        }
      }
      return res.status(200).json({
        success: true,
        wishlist: user?.wishlist || [],
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add product to wishlist
 * @route   POST /api/users/me/wishlist
 * @access  Private
 */
export const addToWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product identifier is required.',
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

      const idStr = productId.toString();
      if (!user.wishlist.includes(idStr)) {
        user.wishlist.push(idStr);
        await user.save();
      }

      return res.status(200).json({
        success: true,
        message: 'Product added to wishlist.',
        wishlist: user.wishlist,
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
        if (!user.wishlist) user.wishlist = [];
        const idStr = productId.toString();
        if (!user.wishlist.includes(idStr)) {
          user.wishlist.push(idStr);
        }
      }

      return res.status(200).json({
        success: true,
        message: 'Product added to wishlist.',
        wishlist: user?.wishlist || [productId],
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Remove product from wishlist
 * @route   DELETE /api/users/me/wishlist/:productId
 * @access  Private
 */
export const removeFromWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const userId = req.user._id || req.user.userId || req.user.id;

    if (isDbConnected()) {
      const user = await User.findById(userId);
      if (user) {
        const idStr = productId.toString();
        user.wishlist = user.wishlist.filter((id) => id !== idStr);
        await user.save();
      }

      return res.status(200).json({
        success: true,
        message: 'Product removed from wishlist.',
        wishlist: user?.wishlist || [],
      });
    } else {
      let user = null;
      for (const u of localUserStore.values()) {
        if (u._id === userId || u.id === userId) {
          user = u;
          break;
        }
      }

      if (user && user.wishlist) {
        const idStr = productId.toString();
        user.wishlist = user.wishlist.filter((id) => id !== idStr);
      }

      return res.status(200).json({
        success: true,
        message: 'Product removed from wishlist.',
        wishlist: user?.wishlist || [],
      });
    }
  } catch (error) {
    next(error);
  }
};
