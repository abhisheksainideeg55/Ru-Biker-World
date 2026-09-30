import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiStar, FiFilter, FiCheckCircle, FiInfo } from 'react-icons/fi';
import { useReviews } from '../../hooks/useReviews';
import { useAuth } from '../../hooks/useAuth';
import ReviewSummary from './ReviewSummary';
import ReviewCard from './ReviewCard';
import ReviewForm from './ReviewForm';
import ReviewSkeleton from './ReviewSkeleton';
import ReviewEmptyState from './ReviewEmptyState';
import Pagination from '../common/Pagination';

export const ReviewSection = ({ product }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const productId = product?.slug || product?.id || product?._id;
  const productName = product?.name || 'Product';

  const {
    reviews,
    summary,
    pagination,
    sort,
    setSort,
    isLoading,
    error,
    eligibility,
    fetchReviews,
    submitReview,
    editReview,
    deleteReview,
    voteHelpful,
    report,
  } = useReviews(productId);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [showEligibilityNotice, setShowEligibilityNotice] = useState(false);

  const handleWriteClick = () => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=/product/${product?.slug || productId}`);
      return;
    }

    if (!eligibility.isEligible && !eligibility.existingReview) {
      setShowEligibilityNotice(true);
      return;
    }

    setEditingReview(eligibility.existingReview || null);
    setIsFormOpen(true);
  };

  const handleEdit = (rev) => {
    setEditingReview(rev);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    if (editingReview) {
      return await editReview(editingReview._id, formData);
    } else {
      return await submitReview(formData);
    }
  };

  return (
    <section className="space-y-6 pt-6 border-t border-slate-200">
      {/* Section Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-lg sm:text-xl font-black text-slate-900 font-display">
            Customer Reviews & Ratings
          </h3>
          <p className="text-xs text-slate-500">
            Real feedback from verified riders who purchased and tested this product.
          </p>
        </div>

        {/* Sort Filter Selector */}
        <div className="flex items-center gap-2">
          <FiFilter className="w-4 h-4 text-slate-400" />
          <label htmlFor="review-sort" className="sr-only">
            Sort reviews
          </label>
          <select
            id="review-sort"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-xl text-slate-700 font-bold focus:outline-none focus:border-amber-500"
          >
            <option value="newest">Most Recent</option>
            <option value="highest">Highest Rated</option>
            <option value="lowest">Lowest Rated</option>
            <option value="most_helpful">Most Helpful</option>
          </select>
        </div>
      </div>

      {/* Eligibility Warning Banner if user clicked Write Review but never bought */}
      {showEligibilityNotice && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start justify-between gap-3 animate-fadeIn">
          <div className="flex items-start gap-2.5">
            <FiInfo className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900">
              <span className="font-bold block">Verified Purchase Required</span>
              Only customers who have purchased and received delivery of this product can submit a review to ensure authentic, trustworthy feedback.
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowEligibilityNotice(false)}
            className="text-xs font-bold text-amber-700 hover:text-amber-900"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Review Summary Breakdown Card */}
      <ReviewSummary
        summary={summary}
        onWriteReview={handleWriteClick}
        isEligible={eligibility.isEligible}
        isAuthenticated={isAuthenticated}
      />

      {/* Reviews List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <ReviewSkeleton key={i} />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <ReviewEmptyState
          onWriteReview={handleWriteClick}
          isEligible={eligibility.isEligible}
          isAuthenticated={isAuthenticated}
        />
      ) : (
        <div className="space-y-4">
          {reviews.map((rev) => (
            <ReviewCard
              key={rev._id}
              review={rev}
              onVote={voteHelpful}
              onReport={report}
              onEdit={handleEdit}
              onDelete={deleteReview}
            />
          ))}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="pt-4 flex justify-center">
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={(p) => fetchReviews(p, sort)}
              />
            </div>
          )}
        </div>
      )}

      {/* Review Write / Edit Modal */}
      {isFormOpen && (
        <ReviewForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleFormSubmit}
          initialData={editingReview}
          productName={productName}
        />
      )}
    </section>
  );
};

export default ReviewSection;
