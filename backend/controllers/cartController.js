import mongoose from 'mongoose';
import Cart from '../models/Cart.js';
import User from '../models/User.js';
import { getProductByIdOrSlug } from '../data/products.js';
import {
  validateAndHydrateCartItems,
  calculateCartTotals,
  validateCouponRules,
} from '../services/cartCalculationService.js';
import { calculateShipping } from '../services/shippingService.js';

const isDbConnected = () => mongoose.connection && mongoose.connection.readyState === 1;

// In-memory cart store for local dev / offline testing fallback
export const localCartStore = new Map();

/**
 * Helper to fetch or create a user cart document / state.
 */
const getOrCreateCart = async (userId) => {
  const userIdStr = String(userId);

  if (isDbConnected()) {
    try {
      let cart = await Cart.findOne({ user: userId });
      if (!cart) {
        cart = await Cart.create({
          user: userId,
          items: [],
          coupon: { code: null, discountAmount: 0 },
          shippingMethod: 'standard',
          subtotal: 0,
          discount: 0,
          shipping: 0,
          tax: 0,
          grandTotal: 0,
          saveForLater: [],
        });
      }
      return cart;
    } catch {
      // Fallback
    }
  }

  // Local fallback
  let cart = localCartStore.get(userIdStr);
  if (!cart) {
    cart = {
      _id: `cart_${userIdStr}`,
      user: userIdStr,
      items: [],
      coupon: { code: null, discountAmount: 0 },
      shippingMethod: 'standard',
      subtotal: 0,
      discount: 0,
      shipping: 0,
      tax: 0,
      grandTotal: 0,
      saveForLater: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      save: async function () {
        this.updatedAt = new Date();
        localCartStore.set(userIdStr, this);
        return this;
      },
    };
    localCartStore.set(userIdStr, cart);
  }
  return cart;
};

/**
 * Synchronizes cart items, prices, and totals.
 */
const syncAndRecalculateCart = async (cart, options = {}) => {
  // 1. Hydrate and validate all items
  const { items: validatedItems, priceChanges, stockAdjustments } = await validateAndHydrateCartItems(cart.items || []);
  cart.items = validatedItems;

  // 2. Compute totals
  const totals = await calculateCartTotals({
    items: cart.items,
    coupon: cart.coupon,
    shippingMethod: cart.shippingMethod || 'standard',
    address: options.address || null,
    userId: cart.user,
  });

  cart.subtotal = totals.subtotal;
  cart.discount = totals.discount;
  cart.shipping = totals.shipping;
  cart.tax = totals.tax;
  cart.grandTotal = totals.grandTotal;
  cart.coupon = totals.coupon || { code: null, discountAmount: 0 };

  if (typeof cart.save === 'function') {
    await cart.save();
  }

  return {
    cart,
    totals,
    priceChanges,
    stockAdjustments,
  };
};

/**
 * @desc    Get authenticated user's cart
 * @route   GET /api/cart
 * @access  Private
 */
export const getCart = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.userId || req.user.id;
    const cart = await getOrCreateCart(userId);

    const { cart: updatedCart, totals, priceChanges, stockAdjustments } = await syncAndRecalculateCart(cart);

    const warnings = [];
    if (priceChanges.length > 0) {
      warnings.push(`Prices updated for ${priceChanges.map((p) => p.name).join(', ')}.`);
    }
    if (stockAdjustments.length > 0) {
      warnings.push(`Quantities adjusted due to available stock for ${stockAdjustments.map((s) => s.name).join(', ')}.`);
    }

    return res.status(200).json({
      success: true,
      data: {
        _id: updatedCart._id,
        user: updatedCart.user,
        items: updatedCart.items,
        coupon: updatedCart.coupon,
        shippingMethod: updatedCart.shippingMethod,
        subtotal: updatedCart.subtotal,
        discount: updatedCart.discount,
        shipping: updatedCart.shipping,
        tax: updatedCart.tax,
        grandTotal: updatedCart.grandTotal,
        saveForLater: updatedCart.saveForLater || [],
        itemCount: updatedCart.items.reduce((acc, it) => acc + (it.quantity || 1), 0),
        shippingInfo: totals.shippingInfo,
        warnings,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add item to cart
 * @route   POST /api/cart/items
 * @access  Private
 */
export const addItem = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.userId || req.user.id;
    const { productId, quantity = 1, selectedVariant } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required.',
        code: 'MISSING_PRODUCT_ID',
      });
    }

    const requestedQty = parseInt(quantity, 10) || 1;
    if (requestedQty < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1.',
        code: 'INVALID_QUANTITY',
      });
    }

    // 1. Fetch product strictly from backend
    const product = await getProductByIdOrSlug(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
        code: 'PRODUCT_NOT_FOUND',
      });
    }

    if (product.isActive === false || product.stock === false) {
      return res.status(400).json({
        success: false,
        message: 'This product is currently unavailable.',
        code: 'PRODUCT_UNAVAILABLE',
      });
    }

    const availableStock = product.stockCount ?? 10;
    const maxPurchase = product.maxPurchaseQuantity ?? 10;
    const maxAllowed = Math.min(availableStock, maxPurchase);

    const cart = await getOrCreateCart(userId);
    const existingItemIndex = cart.items.findIndex(
      (item) => String(item.productId) === String(product.id || product._id)
    );

    let newQuantity = requestedQty;
    if (existingItemIndex > -1) {
      newQuantity = cart.items[existingItemIndex].quantity + requestedQty;
    }

    if (newQuantity > maxAllowed) {
      return res.status(400).json({
        success: false,
        message: `Only ${maxAllowed} units of "${product.name}" can be added. (Stock limit reached)`,
        code: 'INSUFFICIENT_STOCK',
        availableStock: maxAllowed,
      });
    }

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity = newQuantity;
      cart.items[existingItemIndex].priceAtAdd = Number(product.price);
      if (selectedVariant) cart.items[existingItemIndex].selectedVariant = selectedVariant;
    } else {
      cart.items.push({
        _id: new mongoose.Types.ObjectId(),
        product: product.id || product._id,
        productId: String(product.id || product._id),
        quantity: newQuantity,
        priceAtAdd: Number(product.price),
        selectedVariant: selectedVariant || null,
        addedAt: new Date(),
      });
    }

    const { cart: updatedCart, totals } = await syncAndRecalculateCart(cart);

    return res.status(200).json({
      success: true,
      message: `"${product.name}" added to cart.`,
      data: {
        _id: updatedCart._id,
        items: updatedCart.items,
        coupon: updatedCart.coupon,
        subtotal: updatedCart.subtotal,
        discount: updatedCart.discount,
        shipping: updatedCart.shipping,
        tax: updatedCart.tax,
        grandTotal: updatedCart.grandTotal,
        itemCount: updatedCart.items.reduce((acc, it) => acc + it.quantity, 0),
        shippingInfo: totals.shippingInfo,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update quantity for a cart item
 * @route   PUT /api/cart/items/:itemId
 * @access  Private
 */
export const updateItem = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.userId || req.user.id;
    const { itemId } = req.params;
    const { quantity } = req.body;

    const requestedQty = parseInt(quantity, 10);
    if (isNaN(requestedQty)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid quantity',
      });
    }

    const cart = await getOrCreateCart(userId);

    if (requestedQty <= 0) {
      cart.items = cart.items.filter(
        (it) =>
          String(it._id) !== String(itemId) &&
          String(it.productId) !== String(itemId) &&
          String(it.product) !== String(itemId) &&
          !String(itemId).includes(String(it.productId))
      );
      const { cart: updatedCart, totals } = await syncAndRecalculateCart(cart);
      return res.status(200).json({
        success: true,
        message: 'Cart item removed.',
        data: {
          _id: updatedCart._id,
          items: updatedCart.items,
          coupon: updatedCart.coupon,
          subtotal: updatedCart.subtotal,
          discount: updatedCart.discount,
          shipping: updatedCart.shipping,
          tax: updatedCart.tax,
          grandTotal: updatedCart.grandTotal,
          itemCount: updatedCart.items.reduce((acc, it) => acc + it.quantity, 0),
          shippingInfo: totals.shippingInfo,
        },
      });
    }

    const item = cart.items.find(
      (it) =>
        String(it._id) === String(itemId) ||
        String(it.productId) === String(itemId) ||
        String(it.product) === String(itemId) ||
        (it.productId && String(itemId).includes(String(it.productId))) ||
        (itemId && String(it.productId) && String(itemId).toLowerCase() === String(it.productId).toLowerCase())
    );

    if (item) {
      item.quantity = requestedQty;
    }

    const { cart: updatedCart, totals } = await syncAndRecalculateCart(cart);

    return res.status(200).json({
      success: true,
      message: 'Cart item quantity updated.',
      data: {
        _id: updatedCart._id,
        items: updatedCart.items,
        coupon: updatedCart.coupon,
        subtotal: updatedCart.subtotal,
        discount: updatedCart.discount,
        shipping: updatedCart.shipping,
        tax: updatedCart.tax,
        grandTotal: updatedCart.grandTotal,
        itemCount: updatedCart.items.reduce((acc, it) => acc + it.quantity, 0),
        shippingInfo: totals.shippingInfo,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Remove an item from cart
 * @route   DELETE /api/cart/items/:itemId
 * @access  Private
 */
export const removeItem = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.userId || req.user.id;
    const { itemId } = req.params;

    const cart = await getOrCreateCart(userId);
    const targetStr = String(itemId || '').toLowerCase();

    cart.items = cart.items.filter((it) => {
      const itId = String(it._id || '').toLowerCase();
      const itProdId = String(it.productId || '').toLowerCase();
      const itProd = String(it.product || '').toLowerCase();

      return (
        itId !== targetStr &&
        itProdId !== targetStr &&
        itProd !== targetStr &&
        !(itProdId && targetStr.includes(itProdId)) &&
        !(targetStr && itProdId && itProdId.includes(targetStr))
      );
    });

    const { cart: updatedCart, totals } = await syncAndRecalculateCart(cart);

    return res.status(200).json({
      success: true,
      message: 'Product removed from cart.',
      data: {
        _id: updatedCart._id,
        items: updatedCart.items,
        coupon: updatedCart.coupon,
        subtotal: updatedCart.subtotal,
        discount: updatedCart.discount,
        shipping: updatedCart.shipping,
        tax: updatedCart.tax,
        grandTotal: updatedCart.grandTotal,
        itemCount: updatedCart.items.reduce((acc, it) => acc + it.quantity, 0),
        shippingInfo: totals.shippingInfo,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Clear all items in cart
 * @route   DELETE /api/cart
 * @access  Private
 */
export const clearCart = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.userId || req.user.id;
    const cart = await getOrCreateCart(userId);

    cart.items = [];
    cart.coupon = { code: null, discountAmount: 0 };
    cart.subtotal = 0;
    cart.discount = 0;
    cart.shipping = 0;
    cart.tax = 0;
    cart.grandTotal = 0;

    if (typeof cart.save === 'function') {
      await cart.save();
    }

    return res.status(200).json({
      success: true,
      message: 'Cart cleared successfully.',
      data: {
        _id: cart._id,
        items: [],
        coupon: cart.coupon,
        subtotal: 0,
        discount: 0,
        shipping: 0,
        tax: 0,
        grandTotal: 0,
        itemCount: 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Merge guest cart into authenticated user cart
 * @route   POST /api/cart/merge
 * @access  Private
 */
export const mergeGuestCart = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.userId || req.user.id;
    const { items = [] } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      const currentCart = await getOrCreateCart(userId);
      const { cart: refreshedCart, totals } = await syncAndRecalculateCart(currentCart);
      return res.status(200).json({
        success: true,
        message: 'Cart synchronized.',
        data: {
          _id: refreshedCart._id,
          items: refreshedCart.items,
          coupon: refreshedCart.coupon,
          subtotal: refreshedCart.subtotal,
          discount: refreshedCart.discount,
          shipping: refreshedCart.shipping,
          tax: refreshedCart.tax,
          grandTotal: refreshedCart.grandTotal,
          itemCount: refreshedCart.items.reduce((acc, it) => acc + it.quantity, 0),
          shippingInfo: totals.shippingInfo,
        },
      });
    }

    const cart = await getOrCreateCart(userId);
    const adjustments = [];

    for (const guestItem of items) {
      const productId = guestItem.productId || guestItem.product?.id || guestItem.product?._id || guestItem.product;
      if (!productId) continue;

      const product = await getProductByIdOrSlug(productId);
      if (!product || product.isActive === false || product.stock === false) continue;

      const availableStock = product.stockCount ?? 10;
      const maxPurchase = product.maxPurchaseQuantity ?? 10;
      const maxAllowed = Math.min(availableStock, maxPurchase);

      const existingIndex = cart.items.findIndex(
        (it) => String(it.productId) === String(product.id || product._id)
      );

      const guestQty = parseInt(guestItem.quantity, 10) || 1;

      if (existingIndex > -1) {
        const combinedQty = cart.items[existingIndex].quantity + guestQty;
        const finalQty = Math.min(combinedQty, maxAllowed);
        if (finalQty < combinedQty) {
          adjustments.push(`Quantity for ${product.name} capped at max available stock (${maxAllowed}).`);
        }
        cart.items[existingIndex].quantity = finalQty;
        cart.items[existingIndex].priceAtAdd = Number(product.price);
      } else {
        const finalQty = Math.min(guestQty, maxAllowed);
        if (finalQty < guestQty) {
          adjustments.push(`Quantity for ${product.name} capped at max available stock (${maxAllowed}).`);
        }
        cart.items.push({
          _id: new mongoose.Types.ObjectId(),
          product: product.id || product._id,
          productId: String(product.id || product._id),
          quantity: finalQty,
          priceAtAdd: Number(product.price),
          selectedVariant: guestItem.selectedVariant || null,
          addedAt: new Date(),
        });
      }
    }

    const { cart: mergedCart, totals } = await syncAndRecalculateCart(cart);

    return res.status(200).json({
      success: true,
      message: 'Guest cart successfully merged with your account.',
      data: {
        _id: mergedCart._id,
        items: mergedCart.items,
        coupon: mergedCart.coupon,
        subtotal: mergedCart.subtotal,
        discount: mergedCart.discount,
        shipping: mergedCart.shipping,
        tax: mergedCart.tax,
        grandTotal: mergedCart.grandTotal,
        itemCount: mergedCart.items.reduce((acc, it) => acc + it.quantity, 0),
        shippingInfo: totals.shippingInfo,
        adjustments,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Apply coupon to cart
 * @route   POST /api/cart/coupon
 * @access  Private
 */
export const applyCoupon = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.userId || req.user.id;
    const { code } = req.body;

    if (!code || typeof code !== 'string' || !code.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a coupon code.',
        code: 'MISSING_COUPON_CODE',
      });
    }

    const cart = await getOrCreateCart(userId);
    const subtotal = cart.items.reduce((sum, it) => sum + (it.priceAtAdd * it.quantity), 0);

    if (subtotal <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Your cart is empty. Add products before applying a coupon.',
        code: 'CART_EMPTY',
      });
    }

    const validation = await validateCouponRules(code, subtotal, cart.items, userId);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: validation.reason || 'Coupon is invalid or cannot be applied to current cart.',
        code: 'COUPON_INVALID',
      });
    }

    cart.coupon = {
      code: validation.coupon.code,
      discountAmount: validation.discountAmount,
      type: validation.coupon.type,
      value: validation.coupon.value,
    };

    const { cart: updatedCart, totals } = await syncAndRecalculateCart(cart);

    return res.status(200).json({
      success: true,
      message: `Coupon "${validation.coupon.code}" applied! You saved ₹${validation.discountAmount.toLocaleString()}.`,
      data: {
        _id: updatedCart._id,
        coupon: updatedCart.coupon,
        subtotal: updatedCart.subtotal,
        discount: updatedCart.discount,
        shipping: updatedCart.shipping,
        tax: updatedCart.tax,
        grandTotal: updatedCart.grandTotal,
        itemCount: updatedCart.items.reduce((acc, it) => acc + it.quantity, 0),
        shippingInfo: totals.shippingInfo,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Remove coupon from cart
 * @route   DELETE /api/cart/coupon
 * @access  Private
 */
export const removeCoupon = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.userId || req.user.id;
    const cart = await getOrCreateCart(userId);

    cart.coupon = { code: null, discountAmount: 0 };
    const { cart: updatedCart, totals } = await syncAndRecalculateCart(cart);

    return res.status(200).json({
      success: true,
      message: 'Coupon removed from cart.',
      data: {
        _id: updatedCart._id,
        coupon: updatedCart.coupon,
        subtotal: updatedCart.subtotal,
        discount: updatedCart.discount,
        shipping: updatedCart.shipping,
        tax: updatedCart.tax,
        grandTotal: updatedCart.grandTotal,
        itemCount: updatedCart.items.reduce((acc, it) => acc + it.quantity, 0),
        shippingInfo: totals.shippingInfo,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get shipping quote for selected address and method
 * @route   POST /api/cart/shipping-quote
 * @access  Private
 */
export const getShippingQuote = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.userId || req.user.id;
    const { addressId, shippingMethod = 'standard' } = req.body;

    const cart = await getOrCreateCart(userId);

    let address = null;
    if (addressId) {
      if (isDbConnected()) {
        const user = await User.findById(userId);
        if (user && user.addresses) {
          address = user.addresses.id(addressId);
        }
      }
    }

    cart.shippingMethod = shippingMethod;
    const { cart: updatedCart, totals } = await syncAndRecalculateCart(cart, { address });

    return res.status(200).json({
      success: true,
      data: {
        shipping: totals.shippingInfo,
        subtotal: updatedCart.subtotal,
        discount: updatedCart.discount,
        shippingFee: updatedCart.shipping,
        tax: updatedCart.tax,
        grandTotal: updatedCart.grandTotal,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Save cart item for later
 * @route   POST /api/cart/save-for-later
 * @access  Private
 */
export const saveForLater = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.userId || req.user.id;
    const { itemId } = req.body;

    const cart = await getOrCreateCart(userId);
    const itemIndex = cart.items.findIndex(
      (it) => String(it._id) === String(itemId) || String(it.productId) === String(itemId)
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found.',
        code: 'ITEM_NOT_FOUND',
      });
    }

    const itemToSave = cart.items[itemIndex];
    cart.items.splice(itemIndex, 1);

    if (!cart.saveForLater) cart.saveForLater = [];
    cart.saveForLater.push({
      _id: new mongoose.Types.ObjectId(),
      product: itemToSave.product,
      productId: itemToSave.productId,
      quantity: itemToSave.quantity,
      savedAt: new Date(),
    });

    const { cart: updatedCart } = await syncAndRecalculateCart(cart);

    return res.status(200).json({
      success: true,
      message: 'Item moved to Save for Later.',
      data: {
        items: updatedCart.items,
        saveForLater: updatedCart.saveForLater,
        subtotal: updatedCart.subtotal,
        grandTotal: updatedCart.grandTotal,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Remove item from save for later
 * @route   DELETE /api/cart/save-for-later/:itemId
 * @access  Private
 */
export const removeSavedItem = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.userId || req.user.id;
    const { itemId } = req.params;

    const cart = await getOrCreateCart(userId);
    cart.saveForLater = (cart.saveForLater || []).filter(
      (it) => String(it._id) !== String(itemId) && String(it.productId) !== String(itemId)
    );

    if (typeof cart.save === 'function') {
      await cart.save();
    }

    return res.status(200).json({
      success: true,
      message: 'Item removed from Save for Later.',
      data: {
        saveForLater: cart.saveForLater,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Move saved item back to active cart
 * @route   POST /api/cart/move-to-cart
 * @access  Private
 */
export const moveToCart = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.userId || req.user.id;
    const { itemId } = req.body;

    const cart = await getOrCreateCart(userId);
    const savedIndex = (cart.saveForLater || []).findIndex(
      (it) => String(it._id) === String(itemId) || String(it.productId) === String(itemId)
    );

    if (savedIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Saved item not found.',
        code: 'ITEM_NOT_FOUND',
      });
    }

    const savedItem = cart.saveForLater[savedIndex];
    cart.saveForLater.splice(savedIndex, 1);

    const product = await getProductByIdOrSlug(savedItem.productId);
    if (!product || product.isActive === false || product.stock === false) {
      return res.status(400).json({
        success: false,
        message: 'Product is currently unavailable or out of stock.',
        code: 'PRODUCT_UNAVAILABLE',
      });
    }

    cart.items.push({
      _id: new mongoose.Types.ObjectId(),
      product: product.id || product._id,
      productId: String(product.id || product._id),
      quantity: savedItem.quantity || 1,
      priceAtAdd: Number(product.price),
      addedAt: new Date(),
    });

    const { cart: updatedCart } = await syncAndRecalculateCart(cart);

    return res.status(200).json({
      success: true,
      message: `"${product.name}" moved to cart.`,
      data: {
        items: updatedCart.items,
        saveForLater: updatedCart.saveForLater,
        subtotal: updatedCart.subtotal,
        grandTotal: updatedCart.grandTotal,
      },
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getCart,
  addItem,
  updateItem,
  removeItem,
  clearCart,
  mergeGuestCart,
  applyCoupon,
  removeCoupon,
  getShippingQuote,
  saveForLater,
  removeSavedItem,
  moveToCart,
};
