import React, { useState, useEffect } from 'react';
import { FiX, FiStar, FiUploadCloud, FiTrash2, FiAlertCircle } from 'react-icons/fi';
import ReviewRating from './ReviewRating';

export const ReviewForm = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  productName = 'Product',
}) => {
  const [rating, setRating] = useState(initialData?.rating || 5);
  const [title, setTitle] = useState(initialData?.title || '');
  const [comment, setComment] = useState(initialData?.comment || '');
  const [images, setImages] = useState(initialData?.images || []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialData) {
      setRating(initialData.rating || 5);
      setTitle(initialData.title || '');
      setComment(initialData.comment || '');
      setImages(initialData.images || []);
    } else {
      setRating(5);
      setTitle('');
      setComment('');
      setImages([]);
    }
  }, [initialData]);

  if (!isOpen) return null;

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (images.length + files.length > 5) {
      setError('You can upload a maximum of 5 evidence photos.');
      return;
    }

    files.forEach((file) => {
      if (file.size > 2 * 1024 * 1024) {
        setError(`File ${file.name} exceeds 2MB limit.`);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImages((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comment.trim().length < 10) {
      setError('Review comment must be at least 10 characters.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await onSubmit({
        rating,
        title: title.trim(),
        comment: comment.trim(),
        images,
      });
      if (res && res.success) {
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Failed to submit review.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-black text-slate-900 font-display">
              {initialData ? 'Edit Your Review' : 'Write a Product Review'}
            </h3>
            <p className="text-xs text-slate-500 truncate max-w-xs">{productName}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2">
            <FiAlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Star rating selection */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 block">Overall Rating *</label>
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <ReviewRating value={rating} onChange={setRating} readOnly={false} size="lg" />
              <span className="font-bold text-slate-800 text-xs">
                {rating === 5 && 'Excellent / Highly Recommended'}
                {rating === 4 && 'Good Performance'}
                {rating === 3 && 'Average / Acceptable'}
                {rating === 2 && 'Below Expectations'}
                {rating === 1 && 'Poor Quality'}
              </span>
            </div>
          </div>

          {/* Review Title */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">Headline / Title (Optional)</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Incredible braking response, easy fitment"
              maxLength={150}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
          </div>

          {/* Review Comment */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Detailed Experience * <span className="font-normal text-slate-400">(min. 10 chars)</span>
            </label>
            <textarea
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Describe product build quality, performance, durability, and compatibility with your bike model..."
              required
              minLength={10}
              maxLength={2000}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
            <div className="text-[10px] text-right text-slate-400 font-mono mt-1">
              {comment.length} / 2000 chars
            </div>
          </div>

          {/* Photo uploads */}
          <div className="space-y-2">
            <label className="font-bold text-slate-700 block">
              Attach Photos <span className="font-normal text-slate-400">(Max 5 images, 2MB each)</span>
            </label>

            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
              {images.map((img, i) => (
                <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 bg-slate-50 group">
                  <img src={img} alt="Evidence" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute inset-0 bg-rose-900/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {images.length < 5 && (
                <label className="aspect-square rounded-xl border-2 border-dashed border-slate-300 hover:border-amber-500 hover:bg-amber-50/50 flex flex-col items-center justify-center cursor-pointer text-slate-400 hover:text-amber-600 transition-all p-2 text-center">
                  <FiUploadCloud className="w-5 h-5 mb-1" />
                  <span className="text-[9px] font-bold uppercase">Add Photo</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black rounded-xl transition-all shadow-xs active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? 'Saving Review...' : initialData ? 'Update Review' : 'Submit Verified Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewForm;
