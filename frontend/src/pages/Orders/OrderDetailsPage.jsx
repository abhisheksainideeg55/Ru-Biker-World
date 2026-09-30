import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  FiArrowLeft,
  FiPrinter,
  FiPackage,
  FiCalendar,
  FiMapPin,
  FiCreditCard,
  FiTruck,
  FiRotateCcw,
  FiXCircle,
} from 'react-icons/fi';
import { AccountLayout } from '../../components/account';
import { OrderProvider } from '../../context/OrderContext';
import { useOrder } from '../../hooks/useOrder';
import {
  OrderTimeline,
  TrackingCard,
  ReorderButton,
  CancelOrderModal,
  ReturnRequestModal,
} from '../../components/order';
import Price from '../../components/common/Price';

const OrderDetailsContent = () => {
  const { id } = useParams();
  const { order, isLoading, error, refetch } = useOrder(id);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);

  if (isLoading) {
    return (
      <AccountLayout breadcrumbs={[{ label: 'Orders', path: '/account/orders' }, { label: 'Details' }]}>
        <div className="py-16 text-center space-y-3">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-slate-500">Loading order details...</p>
        </div>
      </AccountLayout>
    );
  }

  if (error || !order) {
    return (
      <AccountLayout breadcrumbs={[{ label: 'Orders', path: '/account/orders' }, { label: 'Details' }]}>
        <div className="p-8 bg-white border border-slate-200 rounded-2xl text-center space-y-3">
          <FiPackage className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">Order Not Found</h3>
          <p className="text-xs text-slate-500">{error || 'This order does not exist or belongs to another account.'}</p>
          <Link
            to="/account/orders"
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-xl inline-block"
          >
            Back to Orders
          </Link>
        </div>
      </AccountLayout>
    );
  }

  const isCancellable = ['Pending', 'Confirmed', 'Processing'].includes(order.orderStatus);
  const isReturnable = ['Delivered', 'Confirmed', 'Processing', 'Shipped', 'Out for Delivery'].includes(order.orderStatus);

  return (
    <AccountLayout
      breadcrumbs={[
        { label: 'Orders', path: '/account/orders' },
        { label: order.orderNumber, path: null },
      ]}
    >
      <div className="space-y-6">
        {/* Top Header Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              to="/account/orders"
              className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <FiArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black font-mono text-slate-900 font-display">
                  {order.orderNumber}
                </h1>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-900">
                  {order.orderStatus}
                </span>
              </div>
              <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                <FiCalendar className="w-3.5 h-3.5" />
                <span>
                  Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Link
              to={`/account/orders/${order.orderNumber || order._id}/print`}
              target="_blank"
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors inline-flex items-center gap-1.5"
            >
              <FiPrinter className="w-3.5 h-3.5" />
              <span>Print Invoice</span>
            </Link>

            {isCancellable && (
              <button
                type="button"
                onClick={() => setShowCancelModal(true)}
                className="px-3.5 py-2 text-rose-600 hover:bg-rose-50 text-xs font-bold rounded-xl border border-rose-200 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              >
                <FiXCircle className="w-3.5 h-3.5" />
                <span>Cancel Order</span>
              </button>
            )}

            {isReturnable && (
              <button
                type="button"
                onClick={() => setShowReturnModal(true)}
                className="px-3.5 py-2 text-orange-700 bg-orange-50 hover:bg-orange-100 text-xs font-bold rounded-xl border border-orange-200 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              >
                <FiRotateCcw className="w-3.5 h-3.5" />
                <span>Return & Refund</span>
              </button>
            )}

            <ReorderButton orderId={order._id || order.orderNumber} />
          </div>
        </div>

        {/* Timeline & Tracking Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7">
            <OrderTimeline order={order} />
          </div>
          <div className="lg:col-span-5">
            <TrackingCard order={order} />
          </div>
        </div>

        {/* Products Table Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
            Purchased Items ({order.items?.length || 0})
          </h3>

          <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
            {order.items?.map((item, idx) => {
              const itemName = item.productName || item.name || item.product?.name || 'Motorcycle Spare Part';
              const itemImg = item.image || item.product?.image || 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=160';
              const itemSku = item.SKU || item.sku || item.product?.sku || 'MZ-OEM-01';
              const itemQuantity = item.quantity || item.qty || 1;
              const unitP = Number(item.unitPrice || item.price || item.product?.price || 0);
              const lineTot = Number(item.itemTotal || unitP * itemQuantity);

              return (
                <div key={item._id || item.productId || idx} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={itemImg}
                      alt={itemName}
                      className="w-14 h-14 object-cover rounded-xl bg-slate-50 border border-slate-200 shrink-0"
                    />
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900">{itemName}</h4>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                        SKU: {itemSku} · Qty: {itemQuantity}
                      </div>
                    </div>
                  </div>

                  <div className="text-right pl-14 sm:pl-0">
                    <div className="text-xs text-slate-400">₹{unitP.toLocaleString('en-IN')} each</div>
                    <div className="text-sm sm:text-base font-extrabold text-slate-900">
                      ₹{lineTot.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Details Grid: Address, Payment & Financial Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Shipping Address */}
          <div className="p-5 bg-white border border-slate-200 rounded-2xl space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
              <FiMapPin className="w-4 h-4 text-amber-500" />
              <span>Delivery Address</span>
            </div>
            <div className="text-xs text-slate-700 space-y-0.5 pt-1">
              <div className="font-bold text-slate-900">{order.shippingAddress?.fullName}</div>
              <div>{order.shippingAddress?.addressLine1}</div>
              <div>{order.shippingAddress?.city}, {order.shippingAddress?.state} — {order.shippingAddress?.postalCode}</div>
              <div className="text-slate-500 pt-1">Phone: {order.shippingAddress?.phone}</div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="p-5 bg-white border border-slate-200 rounded-2xl space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
              <FiCreditCard className="w-4 h-4 text-amber-500" />
              <span>Payment Details</span>
            </div>
            <div className="text-xs text-slate-700 space-y-1 pt-1">
              <div>Method: <span className="font-bold uppercase">{order.paymentMethod || 'Razorpay'}</span></div>
              <div>Status: <span className="font-bold text-emerald-600">{order.paymentStatus || 'Paid'}</span></div>
              {order.payment?.razorpayPaymentId && (
                <div className="text-[11px] text-slate-400 font-mono">
                  Txn ID: {order.payment.razorpayPaymentId}
                </div>
              )}
            </div>
          </div>

          {/* Financial Summary */}
          <div className="p-5 bg-white border border-slate-200 rounded-2xl space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Summary</h4>
            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-slate-900">₹{order.subtotal?.toLocaleString('en-IN')}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount</span>
                  <span>-₹{order.discount?.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-bold text-slate-900">
                  {order.shipping === 0 ? 'FREE' : `₹${order.shipping}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>GST (18%)</span>
                <span className="font-bold text-slate-900">₹{order.tax?.toLocaleString('en-IN')}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between font-black text-slate-950 text-sm">
                <span>Total</span>
                <span>₹{order.grandTotal?.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Order Modal */}
      {showCancelModal && (
        <CancelOrderModal
          order={order}
          isOpen={showCancelModal}
          onClose={() => setShowCancelModal(false)}
          onSuccess={() => {
            setShowCancelModal(false);
            refetch();
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
            refetch();
          }}
        />
      )}
    </AccountLayout>
  );
};

export const OrderDetailsPage = () => {
  return (
    <OrderProvider>
      <OrderDetailsContent />
    </OrderProvider>
  );
};

export default OrderDetailsPage;
