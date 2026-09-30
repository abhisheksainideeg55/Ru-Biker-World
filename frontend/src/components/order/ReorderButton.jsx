import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiRefreshCw, FiShoppingCart } from 'react-icons/fi';
import { useOrders } from '../../hooks/useOrders';

export const ReorderButton = ({ orderId, size = 'md', className = '' }) => {
  const navigate = useNavigate();
  const { reorder } = useOrders();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReorder = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!orderId || isSubmitting) return;

    setIsSubmitting(true);
    const res = await reorder(orderId);
    setIsSubmitting(false);

    if (res && res.success) {
      navigate('/cart');
    }
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs font-bold rounded-lg gap-1.5',
    md: 'px-4 py-2 text-xs sm:text-sm font-bold rounded-xl gap-2',
  };

  return (
    <button
      type="button"
      onClick={handleReorder}
      disabled={isSubmitting}
      className={`inline-flex items-center justify-center bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 shadow-xs transition-all ${
        sizeClasses[size] || sizeClasses.md
      } ${isSubmitting ? 'opacity-70 cursor-wait' : ''} ${className}`}
    >
      <FiRefreshCw className={`w-3.5 h-3.5 ${isSubmitting ? 'animate-spin' : ''}`} />
      <span>{isSubmitting ? 'Adding...' : 'Reorder'}</span>
    </button>
  );
};

export default ReorderButton;
