import React, { useState } from 'react';
import { FiX, FiZoomIn } from 'react-icons/fi';

export const ReviewImageGallery = ({ images = [] }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  if (!images || images.length === 0) return null;

  return (
    <>
      <div className="flex items-center gap-2.5 overflow-x-auto py-2 no-scrollbar">
        {images.map((img, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setSelectedImage(img)}
            className="group relative w-16 h-16 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 shrink-0 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <img
              src={img}
              alt={`Review Evidence ${idx + 1}`}
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
              <FiZoomIn className="w-4 h-4" />
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative max-w-2xl w-full bg-slate-900 rounded-2xl overflow-hidden p-2 shadow-2xl">
            <button
              type="button"
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-full transition-colors z-10"
            >
              <FiX className="w-5 h-5" />
            </button>
            <img
              src={selectedImage}
              alt="Review Attachment Enlarge"
              className="w-full max-h-[80vh] object-contain rounded-xl"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ReviewImageGallery;
