import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import Container from '../../components/common/Container';
import Breadcrumb from '../../components/common/Breadcrumb';
import SectionTitle from '../../components/common/SectionTitle';
import { AccountLayout } from '../../components/account';
import { WishlistGrid, WishlistEmpty } from '../../components/wishlist';
import { useWishlist } from '../../hooks/useWishlist';
import { useCart } from '../../hooks/useCart';
import { useNotifications } from '../../hooks/useNotifications';
import { FiHeart, FiShoppingBag, FiTrash2, FiArrowLeft } from 'react-icons/fi';

export const WishlistPage = () => {
  const location = useLocation();
  const isAccountView = location.pathname.startsWith('/account');

  const { wishlistItems = [], setWishlistItems, totalWishlist = 0 } = useWishlist() || {};
  const { addToCart } = useCart() || {};
  const { addToast } = useNotifications() || {};

  const handleMoveAllToCart = async () => {
    if (wishlistItems.length === 0) return;

    if (addToCart) {
      for (const wItem of wishlistItems) {
        if (wItem.stock && wItem.stockCount !== 0) {
          await addToCart(wItem.id || wItem._id, 1);
        }
      }
    }

    // Clear wishlist
    if (setWishlistItems) {
      setWishlistItems([]);
    }

    if (addToast) {
      addToast({
        type: 'success',
        message: 'All in-stock products moved to cart!',
      });
    }
  };

  const handleClearWishlist = () => {
    if (setWishlistItems) {
      setWishlistItems([]);
      if (addToast) {
        addToast({
          type: 'info',
          message: 'Wishlist cleared.',
        });
      }
    }
  };

  const content = (
    <div className="space-y-6">
      {/* Header / Actions Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-rose-50 text-rose-600">
              <FiHeart className="w-4 h-4 fill-rose-600" />
            </span>
            <h1 className="text-lg sm:text-xl font-black text-slate-900 font-display">
              Saved Wishlist
            </h1>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
              {totalWishlist} {totalWishlist === 1 ? 'Item' : 'Items'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Keep track of motorcycle parts, upgrades, and gear for your rides.
          </p>
        </div>

        {wishlistItems.length > 0 && (
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              type="button"
              onClick={handleMoveAllToCart}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-brand-500 hover:bg-brand-600 text-white shadow-glow transition-all duration-200 active:scale-[0.98]"
            >
              <FiShoppingBag className="w-3.5 h-3.5" />
              <span>Move All to Cart</span>
            </button>
            <button
              type="button"
              onClick={handleClearWishlist}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            >
              <FiTrash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>
        )}
      </div>

      {/* Grid or Empty */}
      {wishlistItems.length === 0 ? (
        <WishlistEmpty />
      ) : (
        <WishlistGrid items={wishlistItems} />
      )}
    </div>
  );

  if (isAccountView) {
    return (
      <AccountLayout breadcrumbs={[{ label: 'Saved Wishlist', path: null }]}>
        {content}
      </AccountLayout>
    );
  }

  return (
    <div className="bg-slate-50/60 min-h-[85vh] py-6 sm:py-8">
      <Container size="wide">
        <Breadcrumb items={[{ label: 'Saved Wishlist', path: null }]} className="mb-4" />
        {content}
      </Container>
    </div>
  );
};

export default WishlistPage;
