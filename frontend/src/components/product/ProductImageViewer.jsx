import React, { useEffect, useCallback } from 'react';
import { FiX, FiChevronLeft, FiChevronRight, FiZoomIn } from 'react-icons/fi';
import ProductImage from './ProductImage';

export const ProductImageViewer = ({
  isOpen,
  onClose,
  images = [],
  currentIndex = 0,
  onSelectIndex,
  productName = '',
  iconType = 'brake',
}) => {
  const handleKeyDown = useCallback(
    (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') {
        onSelectIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
      }
      if (e.key === 'ArrowRight') {
        onSelectIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
      }
    },
    [isOpen, onClose, onSelectIndex, images.length]
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen || images.length === 0) return null;

  const currentImage = images[currentIndex] || {};
  const currentImageUrl = typeof currentImage === 'string' ? currentImage : currentImage.url || currentImage.image || currentImage.src || '';
  const currentImageLabel = typeof currentImage === 'object' ? currentImage.label : `Image ${currentIndex + 1}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-surface-950/90 backdrop-blur-md p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Product Image Lightbox"
      onClick={onClose}
    >
      {/* Lightbox Container */}
      <div
        className="relative max-w-4xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div>
            <h3 className="text-sm font-bold text-slate-800 line-clamp-1">
              {productName}
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {currentImageLabel || `Image ${currentIndex + 1} of ${images.length}`}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-600 bg-slate-200/80 px-2.5 py-1 rounded-full">
              {currentIndex + 1} / {images.length}
            </span>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close image viewer"
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-colors focus:outline-none"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Image Viewport */}
        <div className="relative aspect-4/3 sm:aspect-16/10 w-full flex items-center justify-center bg-slate-50 p-6 select-none">
          <ProductImage
            src={currentImageUrl}
            alt={`${productName} - ${currentImageLabel || currentIndex + 1}`}
            iconType={iconType}
            aspectRatio="aspect-auto"
            imgClassName={currentImage.imgClassName || ''}
            imgStyle={currentImage.imgStyle || {}}
            className="h-full max-h-[65vh] w-auto object-contain border-none bg-transparent"
          />

          {/* Navigation Controls */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={() =>
                  onSelectIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))
                }
                aria-label="Previous image"
                className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/95 text-slate-700 hover:text-brand-600 hover:bg-white shadow-lg flex items-center justify-center transition-all focus:outline-none"
              >
                <FiChevronLeft className="w-6 h-6" />
              </button>
              <button
                type="button"
                onClick={() =>
                  onSelectIndex((prev) =>
                    prev < images.length - 1 ? prev + 1 : 0
                  )
                }
                aria-label="Next image"
                className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/95 text-slate-700 hover:text-brand-600 hover:bg-white shadow-lg flex items-center justify-center transition-all focus:outline-none"
              >
                <FiChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
        </div>

        {/* Thumbnail Strip */}
        {images.length > 1 && (
          <div className="flex items-center justify-center gap-3 p-4 bg-slate-100/80 border-t border-slate-200 overflow-x-auto">
            {images.map((img, idx) => {
              const imgUrl = typeof img === 'string' ? img : img?.url || img?.image || img?.src;
              return (
                <button
                  key={img.id || idx}
                  type="button"
                  onClick={() => onSelectIndex(idx)}
                  aria-label={`View image ${idx + 1}`}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all p-1 bg-white shrink-0 ${
                    currentIndex === idx
                      ? 'border-brand-500 shadow-md scale-105'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <ProductImage
                    src={imgUrl}
                    alt={`Thumbnail ${idx + 1}`}
                    iconType={iconType}
                    aspectRatio="aspect-square"
                    imgClassName={img.imgClassName || ''}
                    imgStyle={img.imgStyle || {}}
                    className="w-full h-full p-1 border-none bg-transparent"
                  />
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductImageViewer;
