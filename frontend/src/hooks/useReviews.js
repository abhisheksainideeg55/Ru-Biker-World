import { useState, useEffect, useCallback } from 'react';
import { reviewService } from '../services/reviewService';
import { useNotifications } from './useNotifications';

export const useReviews = (productId) => {
  const { addToast } = useNotifications() || {};

  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState({
    average: 0,
    total: 0,
    distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [sort, setSort] = useState('newest');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Review eligibility state for logged-in customer
  const [eligibility, setEligibility] = useState({
    isEligible: false,
    orderId: null,
    orderItemId: null,
    existingReview: null,
    isChecking: false,
  });

  const fetchReviews = useCallback(
    async (page = 1, sortOption = sort) => {
      if (!productId) return;
      setIsLoading(true);
      setError(null);
      try {
        const res = await reviewService.getProductReviews(productId, {
          page,
          limit: 10,
          sort: sortOption,
        });
        if (res && res.data) {
          setReviews(res.data.reviews || []);
          if (res.data.summary) setSummary(res.data.summary);
          if (res.data.pagination) setPagination(res.data.pagination);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load reviews.');
      } finally {
        setIsLoading(false);
      }
    },
    [productId, sort]
  );

  const checkEligibility = useCallback(async () => {
    if (!productId) return;
    setEligibility((prev) => ({ ...prev, isChecking: true }));
    try {
      const res = await reviewService.checkReviewEligibility(productId);
      if (res && res.data) {
        setEligibility({
          isEligible: res.data.isEligible || false,
          orderId: res.data.orderId || null,
          orderItemId: res.data.orderItemId || null,
          existingReview: res.data.existingReview || null,
          isChecking: false,
        });
      }
    } catch {
      setEligibility({
        isEligible: false,
        orderId: null,
        orderItemId: null,
        existingReview: null,
        isChecking: false,
      });
    }
  }, [productId]);

  useEffect(() => {
    fetchReviews(1, sort);
    checkEligibility();
  }, [fetchReviews, checkEligibility, sort]);

  const submitReview = async ({ rating, title, comment, images }) => {
    try {
      const res = await reviewService.createReview(productId, {
        rating,
        title,
        comment,
        images,
        orderId: eligibility.orderId,
        orderItemId: eligibility.orderItemId,
      });
      if (res && res.data) {
        if (addToast) addToast({ type: 'success', message: 'Review submitted successfully!' });
        fetchReviews(1, sort);
        checkEligibility();
        return { success: true, review: res.data };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit review.';
      if (addToast) addToast({ type: 'error', message: msg });
      return { success: false, message: msg };
    }
  };

  const editReview = async (reviewId, { rating, title, comment, images }) => {
    try {
      const res = await reviewService.updateReview(reviewId, { rating, title, comment, images });
      if (res && res.data) {
        if (addToast) addToast({ type: 'success', message: 'Review updated successfully.' });
        fetchReviews(pagination.page, sort);
        checkEligibility();
        return { success: true, review: res.data };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update review.';
      if (addToast) addToast({ type: 'error', message: msg });
      return { success: false, message: msg };
    }
  };

  const deleteReview = async (reviewId) => {
    try {
      await reviewService.deleteReview(reviewId);
      if (addToast) addToast({ type: 'info', message: 'Review deleted.' });
      fetchReviews(1, sort);
      checkEligibility();
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete review.';
      if (addToast) addToast({ type: 'error', message: msg });
      return { success: false, message: msg };
    }
  };

  const voteHelpful = async (reviewId) => {
    try {
      const res = await reviewService.markHelpful(reviewId);
      if (res && res.data) {
        setReviews((prev) =>
          prev.map((r) =>
            r._id === reviewId ? { ...r, helpfulCount: res.data.helpfulCount, isHelpful: res.data.isHelpful } : r
          )
        );
        return { success: true, data: res.data };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Please log in to vote.';
      if (addToast) addToast({ type: 'error', message: msg });
      return { success: false, message: msg };
    }
  };

  const report = async (reviewId, reason, details) => {
    try {
      const res = await reviewService.reportReview(reviewId, { reason, details });
      if (addToast) addToast({ type: 'info', message: 'Report submitted for moderation.' });
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to report review.';
      if (addToast) addToast({ type: 'error', message: msg });
      return { success: false, message: msg };
    }
  };

  return {
    reviews,
    summary,
    pagination,
    sort,
    setSort,
    isLoading,
    error,
    eligibility,
    fetchReviews,
    checkEligibility,
    submitReview,
    editReview,
    deleteReview,
    voteHelpful,
    report,
  };
};

export default useReviews;
