import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import { FiCopy, FiCheck, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

export const ProductInfo = ({ product }) => {
  const [copied, setCopied] = useState(false);

  if (!product) return null;

  const handleCopySku = () => {
    if (!product.sku) return;
    navigator.clipboard.writeText(product.sku);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleScrollToReviews = (e) => {
    e.preventDefault();
    const reviewsEl = document.getElementById('customer-reviews-section');
    if (reviewsEl) {
      reviewsEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const formattedPrice = Number(product.price).toLocaleString('en-IN');
  const formattedOriginal = product.originalPrice
    ? Number(product.originalPrice).toLocaleString('en-IN')
    : null;

  const brandSlug = product.brand ? product.brand.toLowerCase().replace(/\s+/g, '-') : '';

  return (
    <div className="flex flex-col gap-3">
      {/* Brand & Subcategory Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
        <Link
          to={`/shop?brand=${brandSlug}`}
          className="text-brand-600 hover:text-brand-700 hover:underline transition-colors"
        >
          {product.brand}
        </Link>
        <span>•</span>
        <span className="text-slate-500">{product.subcategory || product.category}</span>
      </div>

      {/* Product Title */}
      <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 leading-tight font-display">
        {product.name}
      </h1>

      {/* Rating & SKU & Stock Row */}
      <div className="flex flex-wrap items-center gap-y-2 gap-x-4 py-1 text-xs border-b border-slate-100 pb-3">
        {/* Rating Link */}
        <a
          href="#customer-reviews-section"
          onClick={handleScrollToReviews}
          className="flex items-center gap-1.5 hover:text-brand-600 transition-colors group cursor-pointer"
        >
          <div className="flex items-center text-amber-400 text-xs">
            <FaStar className="shrink-0" />
          </div>
          <span className="font-bold text-slate-800">{product.rating}</span>
          <span className="text-slate-400 group-hover:underline">
            ({product.reviewCount || 0} Reviews)
          </span>
        </a>

        {/* SKU Copy Box */}
        {product.sku && (
          <div className="flex items-center gap-1.5 text-slate-500 border-l border-slate-200 pl-3">
            <span className="font-semibold text-slate-400">SKU:</span>
            <span className="font-mono text-slate-700 font-bold">{product.sku}</span>
            <button
              type="button"
              onClick={handleCopySku}
              aria-label="Copy SKU"
              className="p-1 hover:text-brand-600 hover:bg-slate-100 rounded transition-colors"
              title="Copy SKU"
            >
              {copied ? (
                <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-bold">
                  <FiCheck className="w-3 h-3" /> Copied!
                </span>
              ) : (
                <FiCopy className="w-3 h-3" />
              )}
            </button>
          </div>
        )}

        {/* Stock Status Badge */}
        <div className="border-l border-slate-200 pl-3">
          {!product.stock || product.stockCount === 0 ? (
            <span className="inline-flex items-center gap-1 text-rose-600 font-bold text-xs">
              <FiAlertCircle className="w-3.5 h-3.5" /> Out of Stock
            </span>
          ) : product.stockCount <= 4 ? (
            <span className="inline-flex items-center gap-1 text-amber-600 font-bold text-xs bg-amber-50 px-2 py-0.5 rounded">
              Only {product.stockCount} left in stock
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-emerald-600 font-bold text-xs">
              <FiCheckCircle className="w-3.5 h-3.5" /> In Stock
            </span>
          )}
        </div>
      </div>

      {/* Pricing Box */}
      <div className="pt-2">
        <div className="flex items-baseline gap-3 flex-wrap">
          <span className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
            ₹{formattedPrice}
          </span>
          {formattedOriginal && product.originalPrice > product.price && (
            <span className="text-sm sm:text-base text-slate-400 line-through font-medium">
              ₹{formattedOriginal}
            </span>
          )}
          {product.discount > 0 && (
            <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
              {product.discount}% OFF
            </span>
          )}
        </div>
        <p className="text-[11px] text-slate-400 font-medium mt-1">
          Inclusive of applicable taxes
        </p>
      </div>

      {/* Short Description */}
      {product.shortDescription && (
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-1">
          {product.shortDescription}
        </p>
      )}
    </div>
  );
};

export default ProductInfo;
