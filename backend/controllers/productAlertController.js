import mongoose from 'mongoose';
import ProductAlert from '../models/ProductAlert.js';
import Product from '../models/Product.js';
import { getProductByIdOrSlug } from '../data/products.js';

const isDbConnected = () => mongoose.connection && mongoose.connection.readyState === 1;

export const localAlertStore = new Map();

/**
 * @desc    Subscribe to Back-in-stock or Price-drop notification for a product
 * @route   POST /api/products/:productId/alerts
 * @access  Private
 */
export const createProductAlert = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.userId || req.user.id;
    const userIdStr = String(userId);
    const { productId } = req.params;
    const { type = 'BACK_IN_STOCK', targetPrice } = req.body || {};

    if (!['PRICE_DROP', 'BACK_IN_STOCK'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Alert type must be either PRICE_DROP or BACK_IN_STOCK.',
      });
    }

    const catalogProduct = getProductByIdOrSlug(productId);
    const resolvedProdId = catalogProduct?._id || catalogProduct?.id || productId;
    const resolvedProdSlug = catalogProduct?.slug || productId;

    if (isDbConnected()) {
      let existing = await ProductAlert.findOne({
        user: userId,
        type,
        $or: [
          { product: mongoose.Types.ObjectId.isValid(resolvedProdId) ? resolvedProdId : undefined },
          { productId: resolvedProdSlug },
          { productId: resolvedProdId },
        ].filter(Boolean),
      });

      if (existing) {
        existing.isActive = true;
        if (targetPrice) existing.targetPrice = targetPrice;
        await existing.save();

        return res.status(200).json({
          success: true,
          message: `Already subscribed to ${type === 'BACK_IN_STOCK' ? 'back in stock' : 'price drop'} alerts for this product.`,
          data: existing,
        });
      }

      const alert = await ProductAlert.create({
        user: userId,
        product: mongoose.Types.ObjectId.isValid(resolvedProdId) ? resolvedProdId : new mongoose.Types.ObjectId(),
        productId: resolvedProdSlug,
        type,
        targetPrice: targetPrice || null,
        isActive: true,
      });

      return res.status(201).json({
        success: true,
        message: `You will be notified when this item is ${type === 'BACK_IN_STOCK' ? 'back in stock' : 'reduced in price'}.`,
        data: alert,
      });
    } else {
      const alertKey = `${userIdStr}_${resolvedProdSlug}_${type}`;
      const alertData = {
        _id: `alt_${Date.now()}`,
        user: userId,
        productId: resolvedProdSlug,
        type,
        targetPrice: targetPrice || null,
        isActive: true,
        createdAt: new Date().toISOString(),
      };
      localAlertStore.set(alertKey, alertData);

      return res.status(201).json({
        success: true,
        message: `You will be notified when this item is ${type === 'BACK_IN_STOCK' ? 'back in stock' : 'reduced in price'}.`,
        data: alertData,
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Unsubscribe from a product alert
 * @route   DELETE /api/products/:productId/alerts/:type
 * @access  Private
 */
export const deleteProductAlert = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.userId || req.user.id;
    const userIdStr = String(userId);
    const { productId, type } = req.params;

    const catalogProduct = getProductByIdOrSlug(productId);
    const resolvedProdId = catalogProduct?._id || catalogProduct?.id || productId;
    const resolvedProdSlug = catalogProduct?.slug || productId;

    if (isDbConnected()) {
      await ProductAlert.deleteMany({
        user: userId,
        type,
        $or: [
          { product: mongoose.Types.ObjectId.isValid(resolvedProdId) ? resolvedProdId : undefined },
          { productId: resolvedProdSlug },
          { productId: resolvedProdId },
        ].filter(Boolean),
      });

      return res.status(200).json({
        success: true,
        message: 'Notification alert cancelled.',
      });
    } else {
      const alertKey = `${userIdStr}_${resolvedProdSlug}_${type}`;
      localAlertStore.delete(alertKey);

      return res.status(200).json({
        success: true,
        message: 'Notification alert cancelled.',
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all active product alert subscriptions for authenticated user
 * @route   GET /api/products/alerts
 * @access  Private
 */
export const getMyProductAlerts = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.userId || req.user.id;
    const userIdStr = String(userId);

    if (isDbConnected()) {
      const alerts = await ProductAlert.find({ user: userId, isActive: true })
        .populate('product', 'name slug images price stock')
        .sort({ createdAt: -1 });

      return res.status(200).json({ success: true, data: alerts });
    } else {
      const alerts = [];
      for (const [, a] of localAlertStore.entries()) {
        if (String(a.user) === userIdStr && a.isActive) {
          alerts.push(a);
        }
      }
      return res.status(200).json({ success: true, data: alerts });
    }
  } catch (error) {
    next(error);
  }
};
