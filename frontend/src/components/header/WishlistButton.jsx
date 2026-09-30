import React from 'react';
import { Link } from 'react-router-dom';
import { FiHeart } from 'react-icons/fi';
import { useWishlist } from '../../hooks/useWishlist';
import Tooltip from '../common/Tooltip';

export const WishlistButton = () => {
  const { totalWishlist = 0 } = useWishlist() || {};

  return (
    <Tooltip content="Wishlist" position="bottom">
      <Link
        to="/wishlist"
        className="relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl text-slate-700 hover:text-brand-600 hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/20"
        aria-label={`View Wishlist (${totalWishlist} saved items)`}
      >
        <FiHeart className="w-5 h-5" />
        {totalWishlist > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-brand-600 px-1 text-[10px] font-bold text-white shadow-sm ring-2 ring-white animate-scaleUp">
            {totalWishlist > 99 ? '99+' : totalWishlist}
          </span>
        )}
      </Link>
    </Tooltip>
  );
};

export default WishlistButton;
