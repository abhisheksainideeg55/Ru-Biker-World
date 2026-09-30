import mongoose from 'mongoose';
import { getProductByIdOrSlug } from '../data/products.js';
import { calculateShipping } from './shippingService.js';
import { calculateTax } from './taxService.js';
import Coupon from '../models/Coupon.js';

// Pre-seeded fallback coupons for development/testing
export const fallbackCoupons = [
  {
    code: 'MOTO10',
    description: 'Get 10% OFF on all motorcycle parts & accessories',
    type: 'percentage',
    value: 10,
    minimumOrderAmount: 999,
    maximumDiscount: 500,
    isActive: true,
    expiryDate: new Date('2030-12-31'),
    usedCount: 14,
    usageLimit: 1000,
    perUserLimit: 5,
  },
  {
    code: 'RIDE500',
    description: 'Flat ₹500 discount on orders above ₹2,999',
    type: 'fixed',
    value: 500,
    minimumOrderAmount: 2999,
    maximumDiscount: 500,
    isActive: true,
    expiryDate: new Date('2030-12-31'),
    usedCount: 8,
    usageLimit: 500,
    perUserLimit: 2,
  },
  {
    code: 'BIKE20',
    description: '20% OFF on Spare Parts and Protection Gear (Min ₹1,999)',
    type: 'percentage',
    value: 20,
    minimumOrderAmount: 1999,
    maximumDiscount: 800,
    applicableCategories: ['Spare Parts', 'Protection', 'Accessories'],
    isActive: true,
    expiryDate: new Date('2030-12-31'),
    usedCount: 22,
    usageLimit: 200,
    perUserLimit: 1,
  },
  {
    code: 'WELCOME100',
    description: 'Flat ₹100 welcome savings on your first motorcycle upgrade',
    type: 'fixed',
    value: 100,
    minimumOrderAmount: 499,
    maximumDiscount: 100,
    isActive: true,
    expiryDate: new Date('2030-12-31'),
    usedCount: 50,
    usageLimit: 10000,
    perUserLimit: 1,
  },
];

/**
 * Validates a coupon against cart subtotal, items, and rules.
 */
export const validateCouponRules = async (couponInput, subtotal, items = [], userId = null) => {
  if (!couponInput) return { isValid: false, discountAmount: 0, reason: 'No coupon specified' };
  
  const code = typeof couponInput === 'string' ? couponInput.toUpperCase().trim() : couponInput.code?.toUpperCase().trim();
  if (!code) return { isValid: false, discountAmount: 0, reason: 'Invalid coupon code format' };

  let coupon = null;
  if (mongoose.connection && mongoose.connection.readyState === 1) {
    try {
      coupon = await Coupon.findOne({ code, isActive: true });
    } catch {
      // Database might not be connected or model unavailable
    }
  }

  if (!coupon) {
    coupon = fallbackCoupons.find((c) => c.code === code && c.isActive);
  }

  if (!coupon) {
    return { isValid: false, discountAmount: 0, reason: 'Coupon code is invalid or expired' };
  }

  if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
    return { isValid: false, discountAmount: 0, reason: 'Coupon has expired' };
  }

  if (coupon.startDate && new Date(coupon.startDate) > new Date()) {
    return { isValid: false, discountAmount: 0, reason: 'Coupon is not yet active' };
  }

  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
    return { isValid: false, discountAmount: 0, reason: 'Coupon usage limit has been reached' };
  }

  if (coupon.minimumOrderAmount && subtotal < coupon.minimumOrderAmount) {
    return {
      isValid: false,
      discountAmount: 0,
      reason: `Minimum order subtotal of ₹${coupon.minimumOrderAmount.toLocaleString()} required for this coupon`,
      requiredAmount: coupon.minimumOrderAmount,
    };
  }

  // Calculate discount
  let eligibleSubtotal = subtotal;

  // Category or product restrictions if specified
  if (coupon.applicableCategories?.length > 0) {
    eligibleSubtotal = items.reduce((acc, item) => {
      const prodCat = item.product?.category;
      if (prodCat && coupon.applicableCategories.includes(prodCat)) {
        return acc + (item.priceAtAdd * item.quantity);
      }
      return acc;
    }, 0);

    if (eligibleSubtotal <= 0) {
      return {
        isValid: false,
        discountAmount: 0,
        reason: `Coupon is only valid for categories: ${coupon.applicableCategories.join(', ')}`,
      };
    }
  }

  let discount = 0;
  if (coupon.type === 'percentage') {
    discount = Math.round((eligibleSubtotal * coupon.value) / 100);
    if (coupon.maximumDiscount && discount > coupon.maximumDiscount) {
      discount = coupon.maximumDiscount;
    }
  } else if (coupon.type === 'fixed') {
    discount = Math.min(coupon.value, eligibleSubtotal);
  }

  discount = Math.max(0, Math.min(discount, subtotal));

  return {
    isValid: true,
    coupon: {
      code: coupon.code,
      description: coupon.description,
      type: coupon.type,
      value: coupon.value,
      maximumDiscount: coupon.maximumDiscount,
      minimumOrderAmount: coupon.minimumOrderAmount,
    },
    discountAmount: discount,
  };
};

/**
 * Re-validates all cart items against live catalog prices & stock.
 * Modifies items in place or returns sanitized items.
 */
export const validateAndHydrateCartItems = async (rawItems = []) => {
  const validatedItems = [];
  const priceChanges = [];
  const stockAdjustments = [];

  for (const item of rawItems) {
    const rawProductId = item.productId || item.product?.id || item.product?._id || (typeof item.product === 'string' ? item.product : null);
    if (!rawProductId && !item.product) continue;

    let productDoc = await getProductByIdOrSlug(rawProductId);
    if (!productDoc && typeof item.product === 'object' && item.product !== null) {
      productDoc = item.product;
    }
    if (!productDoc) continue;

    // Check availability
    const isAvailable = productDoc.isActive !== false && productDoc.stock !== false && (productDoc.stockCount ?? 1) > 0;
    const availableStock = productDoc.stockCount ?? 10;
    const maxPurchase = productDoc.maxPurchaseQuantity ?? 10;
    const allowedMax = Math.min(availableStock, maxPurchase);

    let finalQty = Number(item.quantity) || 1;
    if (finalQty < 1) finalQty = 1;

    if (finalQty > allowedMax) {
      stockAdjustments.push({
        name: productDoc.name,
        requested: finalQty,
        adjusted: allowedMax,
      });
      finalQty = allowedMax;
    }

    const currentPrice = Number(productDoc.price);
    const oldPrice = Number(item.priceAtAdd);

    if (oldPrice && oldPrice !== currentPrice) {
      priceChanges.push({
        name: productDoc.name,
        oldPrice,
        newPrice: currentPrice,
      });
    }

    validatedItems.push({
      _id: item._id,
      product: {
        _id: productDoc._id || productDoc.id,
        id: productDoc.id || productDoc._id,
        name: productDoc.name,
        slug: productDoc.slug,
        sku: productDoc.sku,
        brand: productDoc.brand,
        category: productDoc.category,
        subcategory: productDoc.subcategory,
        price: currentPrice,
        originalPrice: productDoc.originalPrice || currentPrice,
        discount: productDoc.discount || 0,
        stock: isAvailable,
        stockCount: availableStock,
        maxPurchaseQuantity: maxPurchase,
        image: productDoc.image,
        imageType: productDoc.imageType || 'brake',
        bikeBrands: productDoc.bikeBrands || [],
        bikeModels: productDoc.bikeModels || [],
      },
      productId: String(productDoc.id || productDoc._id),
      quantity: finalQty,
      priceAtAdd: currentPrice,
      selectedVariant: item.selectedVariant || null,
      addedAt: item.addedAt || new Date(),
    });
  }

  return {
    items: validatedItems,
    priceChanges,
    stockAdjustments,
  };
};

/**
 * Calculates complete cart financials strictly on the server.
 */
export const calculateCartTotals = async ({
  items = [],
  coupon = null,
  shippingMethod = 'standard',
  address = null,
  userId = null,
}) => {
  // 1. Calculate subtotal strictly from priceAtAdd * quantity
  const subtotal = items.reduce((acc, it) => acc + (Number(it.priceAtAdd) * Number(it.quantity)), 0);
  const totalQuantity = items.reduce((acc, it) => acc + Number(it.quantity), 0);

  // 2. Validate & compute coupon discount
  let discount = 0;
  let activeCoupon = null;

  if (coupon && coupon.code && subtotal > 0) {
    const couponValidation = await validateCouponRules(coupon, subtotal, items, userId);
    if (couponValidation.isValid) {
      discount = couponValidation.discountAmount;
      activeCoupon = {
        code: couponValidation.coupon.code,
        discountAmount: discount,
        type: couponValidation.coupon.type,
        value: couponValidation.coupon.value,
      };
    }
  }

  const subtotalAfterDiscount = Math.max(0, subtotal - discount);

  // 3. Calculate shipping
  const shippingInfo = calculateShipping({
    subtotal: subtotalAfterDiscount,
    shippingMethod,
    address,
    totalQuantity,
  });
  const shipping = shippingInfo.amount;

  // 4. Calculate Tax
  const taxInfo = calculateTax(items, subtotalAfterDiscount, address);
  const tax = taxInfo.taxAmount;

  // 5. Grand Total
  const grandTotal = Math.max(0, subtotalAfterDiscount + shipping + tax);

  return {
    subtotal,
    discount,
    shipping,
    tax,
    grandTotal,
    totalQuantity,
    coupon: activeCoupon,
    shippingInfo,
    taxInfo,
  };
};

export default {
  validateCouponRules,
  validateAndHydrateCartItems,
  calculateCartTotals,
  fallbackCoupons,
};
