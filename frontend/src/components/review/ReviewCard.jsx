import React, { useState } from 'react';
import { FiCheckCircle, FiEdit2, FiTrash2 } from 'react-icons/fi';
import ReviewRating from './ReviewRating';
import ReviewImageGallery from './ReviewImageGallery';
import ReviewHelpfulButton from './ReviewHelpfulButton';
import ReviewReportButton from './ReviewReportButton';
import { useAuth } from '../../hooks/useAuth';

export const ReviewCard = ({ review, onVote, onReport, onEdit, onDelete }) => {
  const { user } = useAuth();
  const currentUserId = user?._id || user?.id;
  const reviewAuthorId = review.user?._id || review.user;
  const isOwner = currentUserId && String(currentUserId) === String(reviewAuthorId);

  const authorName = review.user?.name || 'Verified Rider';
  const authorAvatar = review.user?.avatar;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-2xs space-y-3.5 transition-all hover:border-slate-300">
      {/* Author and Rating header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-900 border border-amber-200 flex items-center justify-center font-black text-xs shrink-0 overflow-hidden">
            {authorAvatar ? (
              <img src={authorAvatar} alt={authorName} className="w-full h-full object-cover" />
            ) : (
              authorName.charAt(0).toUpperCase()
            )}
          </div>

          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs sm:text-sm font-bold text-slate-900">{authorName}</span>
              {review.isVerifiedPurchase && (
                <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                  <FiCheckCircle className="w-3 h-3 text-emerald-600 stroke-[2.5]" />
                  <span>Verified Purchase</span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 mt-0.5">
              <ReviewRating value={review.rating} size="xs" />
              <span className="text-[11px] text-slate-400 font-mono">
                {new Date(review.createdAt).toLocaleDateString('en-IN', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Owner actions */}
        {isOwner && (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onEdit(review)}
              className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
              title="Edit review"
            >
              <FiEdit2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(review._id)}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              title="Delete review"
            >
              <FiTrash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Review content */}
      <div className="space-y-1.5">
        {review.title && (
          <h4 className="text-xs sm:text-sm font-bold text-slate-900">{review.title}</h4>
        )}
        <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
          {review.comment}
        </p>
      </div>

      {/* Evidence image gallery */}
      {review.images && review.images.length > 0 && (
        <ReviewImageGallery images={review.images} />
      )}

      {/* Footer: helpful and report buttons */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
        <ReviewHelpfulButton
          reviewId={review._id}
          helpfulCount={review.helpfulCount || 0}
          onVote={onVote}
        />

        {!isOwner && (
          <ReviewReportButton reviewId={review._id} onReport={onReport} />
        )}
      </div>
    </div>
  );
};

export default ReviewCard;
