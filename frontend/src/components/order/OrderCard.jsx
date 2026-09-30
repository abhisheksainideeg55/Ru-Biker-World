import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiPackage,
  FiCalendar,
  FiChevronRight,
  FiXCircle,
  FiRotateCcw,
  FiTruck,
  FiEye,
} from 'react-icons/fi';
import ReorderButton from './ReorderButton';
import CancelOrderModal from './CancelOrderModal';
import ReturnRequestModal from './ReturnRequestModal';

export const OrderCard = ({ order, onOrderUpdated }) => {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);

  if (!order) return null;

  const firstItem = order.items?.[0] || {};
  const itemName = firstItem.productName || firstItem.name || firstItem.product?.name || 'Motorcycle Spare Part';
  const itemImage = firstItem.image || firstItem.product?.image || 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=160&auto=format&fit=crop&q=80';
  const itemQty = firstItem.quantity || firstItem.qty || 1;
  const totalItems = order.items?.reduce((acc, it) => acc + (it.quantity || it.qty || 1), 0) || itemQty;
  const isCancellable = ['Pending', 'Confirmed', 'Processing'].includes(order.orderStatus);
  const isReturnable = ['Delivered', 'Confirmed', 'Processing', 'Shipped', 'Out for Delivery'].includes(order.orderStatus);

  const statusColors = {
    Confirmed: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    Delivered: 'bg-emerald-600 text-white border-emerald-600',
    Processing: 'bg-blue-100 text-blue-800 border-blue-200',
    Packed: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    Shipped: 'bg-purple-100 text-purple-800 border-purple-200',
    'Out for Delivery': 'bg-amber-100 text-amber-900 border-amber-300',
    Cancelled: 'bg-rose-100 text-rose-800 border-rose-200',
    'Return Requested': 'bg-orange-100 text-orange-800 border-orange-200',
    Returned: 'bg-slate-200 text-slate-800 border-slate-300',
    Pending: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  const statusBadgeStyle = statusColors[order.orderStatus] || statusColors.Pending;

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-2xs hover:shadow-xs transition-all space-y-4">
      {/* Card Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-slate-100 gap-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-200/50">
            <FiPackage className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-black font-mono text-slate-900">
                {order.orderNumber}
              </span>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${statusBadgeStyle}`}>
                {order.orderStatus}
              </span>
            </div>
            <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
              <FiCalendar className="w-3 h-3" />
              <span>
                Placed on {new Date(order.createdAt || Date.now()).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
          </div>
        </div>

        {/* Total amount */}
        <div className="text-left sm:text-right">
          <div className="text-[11px] font-bold uppercase text-slate-400">Total Amount</div>
          <div className="text-base sm:text-lg font-black text-slate-900">
            ₹{(order.grandTotal || 0).toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      {/* Product Summary Row */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-14 h-14 rounded-xl bg-slate-50 border border-slate-200 overflow-hidden shrink-0">
            <img
              src={itemImage}
              alt={itemName}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="min-w-0">
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1">
              {itemName}
            </h4>
            <div className="text-[11px] text-slate-500 mt-0.5">
              <span>Qty: {itemQty}</span>
              {order.items?.length > 1 && (
                <span className="ml-2 font-semibold text-amber-600">
                  +{order.items.length - 1} more {order.items.length - 1 === 1 ? 'item' : 'items'}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* View Details arrow button */}
        <Link
          to={`/account/orders/${order.orderNumber || order._id}`}
          className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors shrink-0"
          title="View Order Details"
        >
          <FiChevronRight className="w-5 h-5" />
        </Link>
      </div>

      {/* Actions Row */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <Link
            to={`/account/orders/${order.orderNumber || order._id}`}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg transition-colors inline-flex items-center gap-1"
          >
            <FiEye className="w-3.5 h-3.5" />
            <span>Details</span>
          </Link>

          <Link
            to={`/track-order?orderNumber=${order.orderNumber}&contact=${order.shippingAddress?.phone || ''}`}
            className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold rounded-lg border border-amber-200 transition-colors inline-flex items-center gap-1"
          >
            <FiTruck className="w-3.5 h-3.5" />
            <span>Track</span>
          </Link>

          {isCancellable && (
            <button
              type="button"
              onClick={() => setShowCancelModal(true)}
              className="px-3 py-1.5 text-rose-600 hover:bg-rose-50 text-xs font-bold rounded-lg border border-rose-200 transition-colors inline-flex items-center gap-1 cursor-pointer"
            >
              <FiXCircle className="w-3.5 h-3.5" />
              <span>Cancel</span>
            </button>
          )}

          {isReturnable && (
            <button
              type="button"
              onClick={() => setShowReturnModal(true)}
              className="px-3 py-1.5 text-orange-700 bg-orange-50 hover:bg-orange-100 text-xs font-bold rounded-lg border border-orange-200 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <FiRotateCcw className="w-3.5 h-3.5" />
              <span>Return & Refund</span>
            </button>
          )}
        </div>

        <ReorderButton orderId={order._id || order.orderNumber} size="sm" />
      </div>

      {/* Cancel Order Modal */}
      {showCancelModal && (
        <CancelOrderModal
          order={order}
          isOpen={showCancelModal}
          onClose={() => setShowCancelModal(false)}
          onSuccess={() => {
            setShowCancelModal(false);
            onOrderUpdated && onOrderUpdated();
          }}
        />
      )}

      {/* Return Request Modal */}
      {showReturnModal && (
        <ReturnRequestModal
          order={order}
          isOpen={showReturnModal}
          onClose={() => setShowReturnModal(false)}
          onSuccess={() => {
            setShowReturnModal(false);
            onOrderUpdated && onOrderUpdated();
          }}
        />
      )}
    </div>
  );
};

export default OrderCard;
