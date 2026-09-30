import React, { useState, useEffect } from 'react';
import { FiShoppingBag, FiCheck } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { useCart } from '../../hooks/useCart';

export const StickyMobilePurchaseBar = ({
  product,
  quantity = 1,
  selectedSize = 'Medium',
  onSelectSize,
}) => {
  const { addToCart } = useCart() || {};

  const [isVisible, setIsVisible] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const target = document.getElementById('main-product-actions-area');
      if (target) {
        const rect = target.getBoundingClientRect();
        setIsVisible(rect.bottom < 0);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!product || !isVisible) return null;

  const isOutOfStock = !product.stock || product.stockCount === 0;

  const handleAddToCart = async () => {
    if (isOutOfStock || isAdding) return;

    setIsAdding(true);
    if (addToCart) {
      const extra = selectedSize ? { size: selectedSize } : null;
      const res = await addToCart(product.id || product._id, quantity, extra, true);
      if (res && res.success) {
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
      }
    }
    setIsAdding(false);
  };

  const isHelmet = Boolean(
    (product?.category && product.category.toLowerCase().includes('helmet')) ||
    (product?.subcategory && product.subcategory.toLowerCase().includes('helmet')) ||
    (product?.name && product.name.toLowerCase().includes('helmet'))
  );

  const defaultSizes = isHelmet
    ? ['Small (55-56 cm)', 'Medium (57-58 cm)', 'Large (59-60 cm)', 'XL (61-62 cm)', 'XXL (63-64 cm)']
    : ['Medium', 'Large', 'Extra Large', 'Double Extra Large'];

  const sizes = (product.sizes && product.sizes.length > 0) ? product.sizes : (isHelmet ? defaultSizes : null);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 animate-slideUp shadow-2xl">
      {/* Orange Banner Strip */}
      <div className="bg-[#e65100] text-white text-center py-1 text-xs font-extrabold tracking-wide uppercase">
        Avail offers in Cart
      </div>

      {/* Main Bar */}
      <div className="bg-white border-t border-slate-200 px-4 py-2.5 flex items-center justify-between gap-4">
        {/* Product Details & Size Selector */}
        <div className="flex flex-col min-w-0 flex-1">
          <span className="text-xs font-bold text-slate-900 truncate">
            {product.name}
          </span>
          <div className="flex items-center gap-3 text-xs mt-0.5">
            {sizes && sizes.length > 0 && (
              <div className="flex items-center gap-1 text-slate-600">
                <span>{isHelmet ? 'Helmet size:' : 'Size:'}</span>
                <select
                  value={selectedSize}
                  onChange={(e) => onSelectSize && onSelectSize(e.target.value)}
                  className="bg-slate-50 border border-slate-300 rounded px-1.5 py-0.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-black cursor-pointer"
                >
                  {sizes.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <span className="font-extrabold text-slate-900">
              ₹{Number(product.price).toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Action Button & WhatsApp */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            disabled={isOutOfStock || isAdding}
            onClick={handleAddToCart}
            className={`px-6 py-2.5 rounded-full font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-xs ${
              isAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-black hover:bg-neutral-800 text-white'
            }`}
          >
            {isAdded ? (
              <>
                <FiCheck className="w-4 h-4 stroke-[3]" />
                <span>Added</span>
              </>
            ) : (
              <>
                <FiShoppingBag className="w-4 h-4" />
                <span>Add to Cart</span>
              </>
            )}
          </button>

          <a
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent('Hi, I am interested in ' + product.name + ' on RU BIKER world: ' + window.location.href)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 rounded-full bg-[#25D366] text-white flex items-center justify-center text-lg hover:opacity-90 shadow-md"
            title="Chat on WhatsApp"
          >
            <FaWhatsapp />
          </a>
        </div>
      </div>
    </div>
  );
};

export default StickyMobilePurchaseBar;
