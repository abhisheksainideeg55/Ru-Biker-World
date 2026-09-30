import React from 'react';
import { Link } from 'react-router-dom';
import { FiTrash2, FiBookmark, FiAlertCircle } from 'react-icons/fi';
import QuantitySelector from './QuantitySelector';
import Price from '../common/Price';
import { useCart } from '../../hooks/useCart';

export const CartItem = ({ item, isCompact = false }) => {
  const { updateQuantity, removeFromCart, saveItemForLater } = useCart();

  const product = item.product || {};
  const productId = item.productId || product.id || product._id || product.slug;
  const itemId = item._id || item.productId || product.id || product._id || productId;
  const quantity = item.quantity || 1;
  const unitPrice = Number(item.priceAtAdd || product.price || 0);
  const itemTotal = unitPrice * quantity;
  const stockCount = product.stockCount ?? 10;
  const maxAllowed = Math.min(stockCount, product.maxPurchaseQuantity ?? 10);
  const isAvailable = product.stock !== false && stockCount > 0;

  const handleQuantityChange = (newQty) => {
    updateQuantity(item, newQty);
  };

  const handleRemove = (e) => {
    e.preventDefault();
    e.stopPropagation();
    removeFromCart(item);
  };

  const handleSaveForLater = (e) => {
    e.preventDefault();
    e.stopPropagation();
    saveItemForLater(item);
  };

  const defaultImage =
    product.image ||
    'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=300&auto=format&fit=crop&q=80';

  const sizeLabel =
    item.selectedVariant?.size ||
    item.selectedVariant?.name ||
    item.selectedVariant?.value ||
    (typeof item.selectedVariant === 'string' ? item.selectedVariant : null) ||
    item.size ||
    null;

  if (isCompact) {
    return (
      <div className="flex items-start gap-3 py-3 border-b border-slate-100 last:border-b-0">
        <Link to={`/product/${product.slug || productId}`} className="shrink-0">
          <div className="w-16 h-16 rounded-lg bg-slate-50 border border-slate-200 overflow-hidden flex items-center justify-center">
            <img
              src={defaultImage}
              alt={product.name || 'Product'}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </Link>

        <div className="flex-1 min-w-0">
          <Link
            to={`/product/${product.slug || productId}`}
            className="text-xs font-bold text-slate-800 hover:text-amber-600 line-clamp-1 transition-colors"
          >
            {product.name}
          </Link>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <span className="text-[11px] text-slate-500">{product.brand}</span>
            {sizeLabel && (
              <span className="text-[10px] font-bold text-slate-800 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200">
                Size: {sizeLabel}
              </span>
            )}
          </div>
          <div className="flex items-center justify-between mt-2">
            <QuantitySelector
              quantity={quantity}
              min={1}
              max={maxAllowed}
              size="sm"
              onChange={handleQuantityChange}
            />
            <div className="text-xs font-bold text-slate-900">
              ₹{itemTotal.toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleRemove}
          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
          aria-label="Remove item from cart"
          title="Delete from cart"
        >
          <FiTrash2 className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-5 bg-white border border-slate-200/80 rounded-xl hover:border-slate-300 transition-all shadow-2xs">
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">
        {/* Product Image */}
        <Link
          to={`/product/${product.slug || productId}`}
          className="shrink-0 w-24 h-24 sm:w-28 sm:h-28 rounded-lg bg-slate-50 border border-slate-100 overflow-hidden flex items-center justify-center group"
        >
          <img
            src={defaultImage}
            alt={product.name || 'Product'}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </Link>

        {/* Product Details */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  {product.brand && (
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                      {product.brand}
                    </span>
                  )}
                  {product.sku && (
                    <span className="text-[11px] font-mono text-slate-400">
                      SKU: {product.sku}
                    </span>
                  )}
                  {sizeLabel && (
                    <span className="text-[11px] font-bold text-slate-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                      Size: {sizeLabel}
                    </span>
                  )}
                </div>

                <Link
                  to={`/product/${product.slug || productId}`}
                  className="text-sm sm:text-base font-bold text-slate-900 hover:text-amber-600 line-clamp-2 transition-colors"
                >
                  {product.name}
                </Link>
              </div>

              {/* Unit & Total Price (Desktop View) */}
              <div className="text-right hidden sm:block">
                <div className="text-base font-extrabold text-slate-900">
                  ₹{itemTotal.toLocaleString('en-IN')}
                </div>
                <div className="text-xs text-slate-500">
                  ₹{unitPrice.toLocaleString('en-IN')} each
                </div>
              </div>
            </div>

            {/* Stock status / warnings */}
            {!isAvailable && (
              <div className="mt-2 inline-flex items-center gap-1.5 text-xs text-rose-600 font-semibold bg-rose-50 px-2.5 py-1 rounded-md">
                <FiAlertCircle className="w-3.5 h-3.5" />
                Currently unavailable
              </div>
            )}
            {isAvailable && stockCount <= 5 && (
              <div className="mt-2 text-xs text-amber-600 font-medium">
                Only {stockCount} left in stock - order soon
              </div>
            )}
          </div>

          {/* Action Row & Quantity Selector */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-4">
              <QuantitySelector
                quantity={quantity}
                min={1}
                max={maxAllowed}
                disabled={!isAvailable}
                onChange={handleQuantityChange}
              />

              {/* Mobile price */}
              <div className="sm:hidden text-sm font-bold text-slate-900">
                ₹{itemTotal.toLocaleString('en-IN')}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSaveForLater}
                className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100 px-2.5 py-1.5 rounded-lg transition-colors"
                title="Save for Later"
              >
                <FiBookmark className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Save for Later</span>
              </button>

              <button
                type="button"
                onClick={handleRemove}
                className="inline-flex items-center gap-1 text-xs font-semibold text-rose-500 hover:text-rose-700 hover:bg-rose-50 px-2.5 py-1.5 rounded-lg transition-colors"
                title="Remove item"
              >
                <FiTrash2 className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
