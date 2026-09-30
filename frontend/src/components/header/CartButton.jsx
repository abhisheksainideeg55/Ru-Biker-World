import React from 'react';
import { FiShoppingCart } from 'react-icons/fi';
import { useCart } from '../../hooks/useCart';

export const CartButton = () => {
  const { cartCount = 0, toggleDrawer } = useCart() || {};

  return (
    <button
      type="button"
      onClick={toggleDrawer}
      className="relative flex items-center gap-2 p-2 rounded-lg text-slate-900 hover:text-brand-600 transition-colors focus:outline-none"
      aria-label={`View Shopping Cart (${cartCount} items)`}
    >
      <div className="relative flex items-center">
        <FiShoppingCart className="w-6 h-6 text-slate-900" />
        {/* Badge counter on top right of cart */}
        <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-black text-white text-[10px] font-black flex items-center justify-center">
          {cartCount}
        </span>
      </div>
      <span className="text-sm font-bold text-slate-900 hidden sm:inline">
        Cart
      </span>
    </button>
  );
};

export default CartButton;
