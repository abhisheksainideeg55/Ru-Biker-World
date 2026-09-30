import React, { useState } from 'react';
import { FiChevronLeft, FiChevronRight, FiMaximize2 } from 'react-icons/fi';
import ProductImage from './ProductImage';
import ProductImageViewer from './ProductImageViewer';

export const ProductGallery = ({ product }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  if (!product) return null;

  // Normalize images list (handles string arrays, object arrays, single image string)
  const rawList = [];
  if (product.image) {
    rawList.push(product.image);
  }
  if (Array.isArray(product.images) && product.images.length > 0) {
    product.images.forEach((img) => {
      const url = typeof img === 'string' ? img : img?.url || img?.image || img?.src;
      if (url && !rawList.includes(url)) {
        rawList.push(img);
      }
    });
  }

  const images = rawList.length > 0
    ? rawList.map((item, index) => {
        if (typeof item === 'string') {
          return {
            id: `img-${index}`,
            url: item,
            label: index === 0 ? 'Main View' : `View ${index + 1}`,
          };
        }
        return {
          id: item.id || `img-${index}`,
          url: item.url || item.image || item.src || null,
          label: item.label || (index === 0 ? 'Main View' : `View ${index + 1}`),
          imgClassName: item.imgClassName || '',
          imgStyle: item.imgStyle || {},
        };
      })
    : [
        { id: 'img-1', url: product.image || null, label: 'Main Angle', angle: 'Front' },
      ];

  const currentImage = images[selectedIndex] || images[0] || {};

  const handlePrev = (e) => {
    e?.stopPropagation();
    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = (e) => {
    e?.stopPropagation();
    setSelectedIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4 w-full">
      {/* Thumbnail Bar (Vertical on Desktop, Horizontal on Mobile) */}
      <div className="flex md:flex-col gap-2.5 overflow-x-auto md:overflow-y-auto pb-2 md:pb-0 md:w-20 md:shrink-0 scrollbar-none">
        {images.map((img, index) => (
          <button
            key={img.id || index}
            type="button"
            onClick={() => setSelectedIndex(index)}
            aria-label={`Select product image ${index + 1}`}
            className={`relative rounded-xl overflow-hidden border-2 transition-all p-1 bg-white shrink-0 w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 flex items-center justify-center focus:outline-none ${
              selectedIndex === index
                ? 'border-brand-500 shadow-md ring-2 ring-brand-500/20'
                : 'border-slate-200 hover:border-slate-300 opacity-80 hover:opacity-100'
            }`}
          >
            <ProductImage
              src={img.url}
              alt={`${product.name} thumbnail ${index + 1}`}
              iconType={product.imageType || 'brake'}
              aspectRatio="aspect-square"
              imgClassName={img.imgClassName || ''}
              imgStyle={img.imgStyle || {}}
              className="w-full h-full p-1 border-none bg-transparent"
            />
            {selectedIndex === index && (
              <span className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-brand-500" />
            )}
          </button>
        ))}
      </div>

      {/* Main Image Display Box */}
      <div className="relative flex-1 bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden group">
        <div
          className="relative aspect-square w-full cursor-zoom-in flex items-center justify-center p-6 bg-slate-50/50"
          onClick={() => setIsViewerOpen(true)}
        >
          <ProductImage
            src={currentImage.url}
            alt={`${product.name} - ${currentImage.label || selectedIndex + 1}`}
            iconType={product.imageType || 'brake'}
            aspectRatio="aspect-square"
            imgClassName={currentImage.imgClassName || ''}
            imgStyle={currentImage.imgStyle || {}}
            className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
          />

          {/* Floating Angle/Label Tag */}
          {currentImage.label && (
            <div className="absolute top-4 left-4 z-10">
              <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-wider bg-white/90 backdrop-blur-sm text-slate-700 border border-slate-200 px-2.5 py-1 rounded-md shadow-2xs">
                {currentImage.label}
              </span>
            </div>
          )}

          {/* Floating Zoom Action Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsViewerOpen(true);
            }}
            aria-label="Zoom product image"
            className="absolute top-4 right-4 z-10 w-9 h-9 rounded-xl bg-white/90 backdrop-blur-sm text-slate-700 hover:text-brand-600 hover:bg-white shadow-sm border border-slate-200 flex items-center justify-center transition-all focus:outline-none"
          >
            <FiMaximize2 className="w-4 h-4" />
          </button>

          {/* Image Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous image"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 text-slate-700 hover:text-brand-600 hover:bg-white shadow-md border border-slate-200 flex items-center justify-center transition-all opacity-80 hover:opacity-100 focus:outline-none"
              >
                <FiChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next image"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 text-slate-700 hover:text-brand-600 hover:bg-white shadow-md border border-slate-200 flex items-center justify-center transition-all opacity-80 hover:opacity-100 focus:outline-none"
              >
                <FiChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Image Counter Pill */}
          <div className="absolute bottom-4 right-4 z-10">
            <span className="text-xs font-bold text-slate-600 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full border border-slate-200 shadow-2xs">
              {selectedIndex + 1} / {images.length}
            </span>
          </div>
        </div>
      </div>

      {/* Lightbox / Modal */}
      <ProductImageViewer
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
        images={images}
        currentIndex={selectedIndex}
        onSelectIndex={setSelectedIndex}
        productName={product.name}
        iconType={product.imageType || 'brake'}
      />
    </div>
  );
};

export default ProductGallery;
