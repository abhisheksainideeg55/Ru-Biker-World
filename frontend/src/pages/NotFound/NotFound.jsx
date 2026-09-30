import React from 'react';
import { Link } from 'react-router-dom';
import Container from '../../components/common/Container';
import { FiAlertOctagon, FiHome, FiShoppingBag } from 'react-icons/fi';

export const NotFound = () => {
  return (
    <div className="min-h-[75vh] flex items-center justify-center py-16 bg-slate-50">
      <Container size="wide">
        <div className="max-w-lg mx-auto bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center space-y-6 shadow-card">
          <div className="w-20 h-20 rounded-3xl bg-amber-50 border border-amber-200 text-amber-500 flex items-center justify-center mx-auto">
            <FiAlertOctagon className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-5xl sm:text-6xl font-black text-slate-900 font-display block">
              404
            </span>
            <h1 className="text-lg sm:text-xl font-black text-slate-900 font-display">
              Page Not Found
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-sm mx-auto">
              The motorcycle spare part, maintenance guide, or account section you requested could not be located on our server.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to="/"
              className="w-full sm:w-auto px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl inline-flex items-center justify-center gap-2 transition-colors shadow-xs"
            >
              <FiHome className="w-4 h-4" />
              <span>Go to Home</span>
            </Link>

            <Link
              to="/shop"
              className="w-full sm:w-auto px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black rounded-xl inline-flex items-center justify-center gap-2 transition-colors shadow-xs active:scale-95"
            >
              <FiShoppingBag className="w-4 h-4" />
              <span>Explore Shop</span>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default NotFound;
