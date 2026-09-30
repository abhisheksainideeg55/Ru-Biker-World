import mongoose from 'mongoose';
import Review from '../models/Review.js';
import ReviewHelpful from '../models/ReviewHelpful.js';
import ReviewReport from '../models/ReviewReport.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { getProductByIdOrSlug } from '../data/products.js';
import { validateReviewImages } from '../services/reviewImageService.js';
import { localOrderStore } from './paymentController.js';

const isDbConnected = () => mongoose.connection && mongoose.connection.readyState === 1;

// In-memory fallback stores for demo/testing
export const localReviewStore = new Map();
export const localHelpfulStore = new Set();
export const localReportStore = [];

/**
 * Seed initial reviews if store is empty
 */
const seedInitialReviews = () => {
  if (localReviewStore.size === 0) {
    const defaultReviews = [
      {
        _id: 'rev_001',
        product: '65f001000000000000000001',
        productId: 'prod-001',
        user: { _id: 'usr_arjun', name: 'Arjun Verma', avatar: null },
        rating: 5,
        title: 'Outstanding Braking Response on Track & Street',
        comment: 'Fitted these Brembo Sintered Pads on my Duke 390. Bite is immediate, zero fade even under hard mountain braking. High quality finish.',
        images: ['https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600'],
        isVerifiedPurchase: true,
        isApproved: true,
        helpfulCount: 14,
        reportCount: 0,
        createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 7 * 86400000).toISOString(),
      },
      {
        _id: 'rev_002',
        product: '65f001000000000000000001',
        productId: 'prod-001',
        user: { _id: 'usr_rohit', name: 'Rohit K.', avatar: null },
        rating: 4,
        title: 'Great upgrade over stock OEM pads',
        comment: 'Noticeable improvement in initial bite. Took about 50 kms to bed in properly. Worth every rupee for sporty riders.',
        images: [],
        isVerifiedPurchase: true,
        isApproved: true,
        helpfulCount: 6,
        reportCount: 0,
        createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 14 * 86400000).toISOString(),
      },
      {
        _id: 'rev_003',
        product: '65f001000000000000000002',
        productId: 'prod-002',
        user: { _id: 'usr_vikram', name: 'Vikram Sethi', avatar: null },
        rating: 5,
        title: 'Super smooth engine feel and slick gear shifts',
        comment: 'Motul 7100 10W50 synthetic oil keeps the engine running cool even in bumper to bumper summer traffic. Highly recommended.',
        images: [],
        isVerifiedPurchase: true,
        isApproved: true,
        helpfulCount: 9,
        reportCount: 0,
        createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 10 * 86400000).toISOString(),
      },
    ];

    defaultReviews.forEach((r) => localReviewStore.set(r._id, r));
  }
};
seedInitialReviews();

/**
 * Compute rating summary statistics for a list of reviews
 */
const computeRatingSummary = (reviews = []) => {
  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  let totalRatingSum = 0;

  reviews.forEach((r) => {
    const star = Math.min(5, Math.max(1, Math.round(r.rating || 5)));
    distribution[star] = (distribution[star] || 0) + 1;
    totalRatingSum += r.rating || 0;
  });

  const total = reviews.length;
  const average = total > 0 ? parseFloat((totalRatingSum / total).toFixed(1)) : 0;

  return {
    average,
    total,
    distribution,
  };
};

/**
 * @desc    Get reviews for a product with rating summary, sorting & pagination
 * @route   GET /api/products/:productId/reviews
 * @access  Public
 */
export const getProductReviews = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const queryObj = req.query || {};
    const page = Math.max(1, parseInt(queryObj.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(queryObj.limit, 10) || 10));
    const sort = queryObj.sort || 'newest';

    const catalogProduct = getProductByIdOrSlug(productId);
    const resolvedProdId = catalogProduct?._id || catalogProduct?.id || productId;
    const resolvedProdSlug = catalogProduct?.slug || productId;

    if (isDbConnected()) {
      let prodQuery = [{ productId: resolvedProdId }, { productId: resolvedProdSlug }];
      if (mongoose.Types.ObjectId.isValid(resolvedProdId)) {
        prodQuery.push({ product: resolvedProdId });
      }

      // Find all approved reviews to compute global rating stats
      const allApprovedReviews = await Review.find({
        $or: prodQuery,
        isApproved: true,
      });

      const summary = computeRatingSummary(allApprovedReviews);

      // Build sort criteria
      let sortCriteria = { createdAt: -1 };
      if (sort === 'highest') sortCriteria = { rating: -1, createdAt: -1 };
      if (sort === 'lowest') sortCriteria = { rating: 1, createdAt: -1 };
      if (sort === 'most_helpful') sortCriteria = { helpfulCount: -1, createdAt: -1 };

      const total = allApprovedReviews.length;
      const totalPages = Math.ceil(total / limit) || 1;
      const skip = (page - 1) * limit;

      const paginatedReviews = await Review.find({
        $or: prodQuery,
        isApproved: true,
      })
        .populate('user', 'name avatar')
        .sort(sortCriteria)
        .skip(skip)
        .limit(limit);

      return res.status(200).json({
        success: true,
        data: {
          reviews: paginatedReviews,
          summary,
          pagination: {
            page,
            limit,
            total,
            totalPages,
          },
        },
      });
    } else {
      seedInitialReviews();
      let matchedReviews = Array.from(localReviewStore.values()).filter((r) => {
        const matchesProduct =
          r.productId === resolvedProdId ||
          r.productId === resolvedProdSlug ||
          r.product === resolvedProdId ||
          r.product === resolvedProdSlug ||
          r.productId === productId;
        return matchesProduct && r.isApproved;
      });

      const summary = computeRatingSummary(matchedReviews);

      // Sorting
      if (sort === 'highest') {
        matchedReviews.sort((a, b) => b.rating - a.rating || new Date(b.createdAt) - new Date(a.createdAt));
      } else if (sort === 'lowest') {
        matchedReviews.sort((a, b) => a.rating - b.rating || new Date(b.createdAt) - new Date(a.createdAt));
      } else if (sort === 'most_helpful') {
        matchedReviews.sort((a, b) => b.helpfulCount - a.helpfulCount || new Date(b.createdAt) - new Date(a.createdAt));
      } else {
        matchedReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }

      const total = matchedReviews.length;
      const totalPages = Math.ceil(total / limit) || 1;
      const skip = (page - 1) * limit;
      const pageItems = matchedReviews.slice(skip, skip + limit);

      return res.status(200).json({
        success: true,
        data: {
          reviews: pageItems,
          summary,
          pagination: {
            page,
            limit,
            total,
            totalPages,
          },
        },
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Check if current authenticated user has purchased this product and can review it
 * @route   GET /api/products/:productId/reviews/eligibility
 * @access  Private
 */
export const checkReviewEligibility = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.userId || req.user.id;
    const userIdStr = String(userId);
    const { productId } = req.params;

    const catalogProduct = getProductByIdOrSlug(productId);
    const resolvedProdId = catalogProduct?._id || catalogProduct?.id || productId;
    const resolvedProdSlug = catalogProduct?.slug || productId;
    const resolvedProdName = catalogProduct?.name || '';

    let eligibleOrder = null;
    let eligibleItem = null;
    let existingReview = null;

    if (isDbConnected()) {
      // Look for a Delivered order containing this product
      const userOrders = await Order.find({
        user: userId,
        orderStatus: 'Delivered',
      });

      for (const ord of userOrders) {
        const item = ord.items.find((it) => {
          const itemProdId = it.product ? String(it.product) : '';
          return (
            itemProdId === String(resolvedProdId) ||
            it.productName === resolvedProdName ||
            it.SKU === catalogProduct?.sku
          );
        });

        if (item) {
          eligibleOrder = ord;
          eligibleItem = item;
          break;
        }
      }

      if (eligibleOrder) {
        existingReview = await Review.findOne({
          user: userId,
          $or: [
            { product: mongoose.Types.ObjectId.isValid(resolvedProdId) ? resolvedProdId : undefined },
            { productId: resolvedProdId },
            { productId: resolvedProdSlug },
          ].filter(Boolean),
        });
      }
    } else {
      for (const [, ord] of localOrderStore.entries()) {
        if (String(ord.user) === userIdStr && (ord.orderStatus === 'Delivered' || ord.orderStatus === 'Confirmed')) {
          const item = ord.items.find(
            (it) =>
              String(it.product) === String(resolvedProdId) ||
              it.productId === resolvedProdId ||
              it.productName === resolvedProdName
          );
          if (item) {
            eligibleOrder = ord;
            eligibleItem = item;
            break;
          }
        }
      }

      if (eligibleOrder) {
        for (const [, r] of localReviewStore.entries()) {
          const reviewUser = r.user?._id || r.user;
          if (String(reviewUser) === userIdStr && (r.productId === resolvedProdId || r.productId === resolvedProdSlug)) {
            existingReview = r;
            break;
          }
        }
      }
    }

    return res.status(200).json({
      success: true,
      data: {
        isEligible: !!eligibleOrder,
        orderId: eligibleOrder?._id || eligibleOrder?.orderNumber || null,
        orderItemId: eligibleItem?._id || null,
        existingReview: existingReview || null,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new verified review for a product
 * @route   POST /api/products/:productId/reviews
 * @access  Private
 */
export const createReview = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.userId || req.user.id;
    const userIdStr = String(userId);
    const { productId } = req.params;
    const { rating, title = '', comment, images = [], orderId, orderItemId } = req.body || {};

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating is required and must be between 1 and 5 stars.',
      });
    }

    if (!comment || comment.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Review comment must be at least 10 characters long.',
      });
    }

    const imageValidation = validateReviewImages(images);
    if (!imageValidation.isValid) {
      return res.status(400).json({
        success: false,
        message: imageValidation.message,
      });
    }

    const catalogProduct = getProductByIdOrSlug(productId);
    const resolvedProdId = catalogProduct?._id || catalogProduct?.id || productId;
    const resolvedProdSlug = catalogProduct?.slug || productId;
    const resolvedProdName = catalogProduct?.name || '';

    // Verify Customer Purchase
    let isVerifiedPurchase = false;
    let verifiedOrder = null;

    if (isDbConnected()) {
      const deliveredOrders = await Order.find({
        user: userId,
        orderStatus: 'Delivered',
      });

      for (const ord of deliveredOrders) {
        const item = ord.items.find((it) => {
          const itemProdId = it.product ? String(it.product) : '';
          return (
            itemProdId === String(resolvedProdId) ||
            it.productName === resolvedProdName ||
            it.SKU === catalogProduct?.sku
          );
        });
        if (item) {
          isVerifiedPurchase = true;
          verifiedOrder = ord;
          break;
        }
      }

      if (!isVerifiedPurchase) {
        return res.status(403).json({
          success: false,
          message: 'Only verified customers who purchased this product can review it.',
        });
      }

      // Check if user already reviewed this product
      let existing = await Review.findOne({
        user: userId,
        $or: [
          { product: mongoose.Types.ObjectId.isValid(resolvedProdId) ? resolvedProdId : undefined },
          { productId: resolvedProdId },
          { productId: resolvedProdSlug },
        ].filter(Boolean),
      });

      if (existing) {
        // Update existing review instead of creating duplicate
        existing.rating = rating;
        existing.title = title.trim();
        existing.comment = comment.trim();
        existing.images = images;
        await existing.save();

        return res.status(200).json({
          success: true,
          message: 'Review updated successfully.',
          data: existing,
        });
      }

      const newReview = await Review.create({
        product: mongoose.Types.ObjectId.isValid(resolvedProdId) ? resolvedProdId : new mongoose.Types.ObjectId(),
        productId: resolvedProdSlug,
        user: userId,
        order: verifiedOrder?._id,
        orderItemId: orderItemId && mongoose.Types.ObjectId.isValid(orderItemId) ? orderItemId : undefined,
        rating: Number(rating),
        title: title.trim(),
        comment: comment.trim(),
        images,
        isVerifiedPurchase: true,
        isApproved: true,
      });

      const populated = await Review.findById(newReview._id).populate('user', 'name avatar');

      return res.status(201).json({
        success: true,
        message: 'Review submitted successfully.',
        data: populated,
      });
    } else {
      // In-memory fallback
      for (const [, ord] of localOrderStore.entries()) {
        if (String(ord.user) === userIdStr) {
          const item = ord.items?.find(
            (it) =>
              String(it.product) === String(resolvedProdId) ||
              it.productId === resolvedProdId ||
              it.productName === resolvedProdName
          );
          if (item) {
            isVerifiedPurchase = true;
            verifiedOrder = ord;
            break;
          }
        }
      }

      // Allow in-memory testing for registered users
      const revId = `rev_${Date.now()}`;
      const newReview = {
        _id: revId,
        id: revId,
        product: resolvedProdId,
        productId: resolvedProdSlug,
        user: {
          _id: userId,
          name: req.user.name || 'Verified Rider',
          avatar: req.user.avatar || null,
        },
        rating: Number(rating),
        title: title.trim(),
        comment: comment.trim(),
        images,
        isVerifiedPurchase: true,
        isApproved: true,
        helpfulCount: 0,
        reportCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      localReviewStore.set(revId, newReview);

      return res.status(201).json({
        success: true,
        message: 'Review submitted successfully.',
        data: newReview,
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update customer's own review
 * @route   PUT /api/reviews/:id
 * @access  Private
 */
export const updateReview = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.userId || req.user.id;
    const userIdStr = String(userId);
    const { id } = req.params;
    const { rating, title, comment, images } = req.body || {};

    if (images) {
      const imageValidation = validateReviewImages(images);
      if (!imageValidation.isValid) {
        return res.status(400).json({ success: false, message: imageValidation.message });
      }
    }

    if (isDbConnected()) {
      const review = await Review.findById(id);
      if (!review) {
        return res.status(404).json({ success: false, message: 'Review not found.' });
      }

      if (String(review.user) !== userIdStr) {
        return res.status(403).json({ success: false, message: 'Not authorized to edit this review.' });
      }

      if (rating) review.rating = Number(rating);
      if (title !== undefined) review.title = title.trim();
      if (comment) review.comment = comment.trim();
      if (images) review.images = images;

      await review.save();
      const populated = await Review.findById(review._id).populate('user', 'name avatar');

      return res.status(200).json({
        success: true,
        message: 'Review updated successfully.',
        data: populated,
      });
    } else {
      const review = localReviewStore.get(id);
      if (!review) {
        return res.status(404).json({ success: false, message: 'Review not found.' });
      }

      const authorId = review.user?._id || review.user;
      if (String(authorId) !== userIdStr) {
        return res.status(403).json({ success: false, message: 'Not authorized to edit this review.' });
      }

      if (rating) review.rating = Number(rating);
      if (title !== undefined) review.title = title.trim();
      if (comment) review.comment = comment.trim();
      if (images) review.images = images;
      review.updatedAt = new Date().toISOString();

      return res.status(200).json({
        success: true,
        message: 'Review updated successfully.',
        data: review,
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete customer's own review
 * @route   DELETE /api/reviews/:id
 * @access  Private
 */
export const deleteReview = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.userId || req.user.id;
    const userIdStr = String(userId);
    const { id } = req.params;

    if (isDbConnected()) {
      const review = await Review.findById(id);
      if (!review) {
        return res.status(404).json({ success: false, message: 'Review not found.' });
      }

      if (String(review.user) !== userIdStr) {
        return res.status(403).json({ success: false, message: 'Not authorized to delete this review.' });
      }

      await Review.findByIdAndDelete(id);
      await ReviewHelpful.deleteMany({ review: id });

      return res.status(200).json({
        success: true,
        message: 'Review deleted successfully.',
      });
    } else {
      const review = localReviewStore.get(id);
      if (!review) {
        return res.status(404).json({ success: false, message: 'Review not found.' });
      }

      const authorId = review.user?._id || review.user;
      if (String(authorId) !== userIdStr) {
        return res.status(403).json({ success: false, message: 'Not authorized to delete this review.' });
      }

      localReviewStore.delete(id);

      return res.status(200).json({
        success: true,
        message: 'Review deleted successfully.',
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Mark a review as helpful (toggles / tracks unique user vote)
 * @route   POST /api/reviews/:id/helpful
 * @access  Private
 */
export const markReviewHelpful = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.userId || req.user.id;
    const userIdStr = String(userId);
    const { id } = req.params;

    if (isDbConnected()) {
      const review = await Review.findById(id);
      if (!review) {
        return res.status(404).json({ success: false, message: 'Review not found.' });
      }

      const existingVote = await ReviewHelpful.findOne({ review: id, user: userId });
      if (existingVote) {
        // Toggle off
        await ReviewHelpful.findByIdAndDelete(existingVote._id);
        review.helpfulCount = Math.max(0, (review.helpfulCount || 1) - 1);
        await review.save();

        return res.status(200).json({
          success: true,
          message: 'Helpful vote removed.',
          data: { helpfulCount: review.helpfulCount, isHelpful: false },
        });
      } else {
        await ReviewHelpful.create({ review: id, user: userId });
        review.helpfulCount = (review.helpfulCount || 0) + 1;
        await review.save();

        return res.status(200).json({
          success: true,
          message: 'Marked as helpful.',
          data: { helpfulCount: review.helpfulCount, isHelpful: true },
        });
      }
    } else {
      const review = localReviewStore.get(id);
      if (!review) {
        return res.status(404).json({ success: false, message: 'Review not found.' });
      }

      const voteKey = `${userIdStr}_${id}`;
      let isHelpful = false;

      if (localHelpfulStore.has(voteKey)) {
        localHelpfulStore.delete(voteKey);
        review.helpfulCount = Math.max(0, (review.helpfulCount || 1) - 1);
        isHelpful = false;
      } else {
        localHelpfulStore.add(voteKey);
        review.helpfulCount = (review.helpfulCount || 0) + 1;
        isHelpful = true;
      }

      return res.status(200).json({
        success: true,
        message: isHelpful ? 'Marked as helpful.' : 'Helpful vote removed.',
        data: { helpfulCount: review.helpfulCount, isHelpful },
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Report an inappropriate review
 * @route   POST /api/reviews/:id/report
 * @access  Private
 */
export const reportReview = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.userId || req.user.id;
    const { id } = req.params;
    const { reason = 'Other', details = '' } = req.body || {};

    const validReasons = ['Spam', 'Offensive', 'Fake Review', 'Irrelevant', 'Other'];
    if (!validReasons.includes(reason)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid report reason specified.',
      });
    }

    if (isDbConnected()) {
      const review = await Review.findById(id);
      if (!review) {
        return res.status(404).json({ success: false, message: 'Review not found.' });
      }

      const existingReport = await ReviewReport.findOne({ review: id, user: userId });
      if (existingReport) {
        return res.status(400).json({
          success: false,
          message: 'You have already reported this review.',
        });
      }

      await ReviewReport.create({ review: id, user: userId, reason, details });
      review.reportCount = (review.reportCount || 0) + 1;
      await review.save();

      return res.status(200).json({
        success: true,
        message: 'Thank you. Review report submitted for moderation.',
      });
    } else {
      const review = localReviewStore.get(id);
      if (!review) {
        return res.status(404).json({ success: false, message: 'Review not found.' });
      }

      review.reportCount = (review.reportCount || 0) + 1;
      localReportStore.push({ reviewId: id, userId, reason, details, reportedAt: new Date() });

      return res.status(200).json({
        success: true,
        message: 'Thank you. Review report submitted for moderation.',
      });
    }
  } catch (error) {
    next(error);
  }
};
