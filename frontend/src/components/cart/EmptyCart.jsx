import React from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingBag, FiCompass, FiArrowRight } from 'react-icons/fi';
import { RiMotorbikeLine } from 'react-icons/ri';
import Button from '../common/Button';

export const EmptyCart = ({ isDrawer = false, onCloseDrawer }) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center ${isDrawer ? 'py-12 px-4' : 'py-16 px-4 bg-white border border-slate-200/80 rounded-2xl shadow-xs'}`}>
      <div className="w-20 h-20 bg-amber-50 text-amber-500 rounded-3xl flex items-center justify-center mb-5 shadow-inner">
        <FiShoppingBag className="w-10 h-10" />
      </div>

      <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-2">
        Your Cart is Empty
      </h3>

      <p className="text-sm text-slate-500 max-w-md mb-8">
        Looks like you haven't added any motorcycle parts or riding accessories to your cart yet. Explore our curated selection for top bike brands.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-xs">
        <Link
          to="/shop"
          onClick={onCloseDrawer}
          className="w-full py-3 px-5 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-bold rounded-xl flex items-center justify-center gap-2 text-sm shadow-sm transition-all"
        >
          <FiCompass className="w-4 h-4" />
          <span>Continue Shopping</span>
        </Link>

        <Link
          to="/shop"
          onClick={onCloseDrawer}
          className="w-full py-3 px-5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl flex items-center justify-center gap-2 text-sm transition-colors"
        >
          <RiMotorbikeLine className="w-4 h-4" />
          <span>Shop by Bike</span>
        </Link>
      </div>
    </div>
  );
};

export default EmptyCart;
