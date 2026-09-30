import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiPrinter, FiArrowLeft, FiPackage, FiCheckCircle } from 'react-icons/fi';
import { useOrder } from '../../hooks/useOrder';
import { OrderProvider } from '../../context/OrderContext';

const OrderPrintContent = () => {
  const { id } = useParams();
  const { order, isLoading, error } = useOrder(id);

  useEffect(() => {
    // Auto trigger print when loaded if query parameter ?autoprint=true is set
    const params = new URLSearchParams(window.location.search);
    if (params.get('autoprint') === 'true' && order) {
      window.print();
    }
  }, [order]);

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-slate-600">Generating Printable Order Summary...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 max-w-md text-center space-y-4">
          <FiPackage className="w-12 h-12 text-slate-400 mx-auto" />
          <h2 className="text-lg font-bold text-slate-900">Order Summary Unavailable</h2>
          <p className="text-xs text-slate-500">{error || 'Order could not be loaded.'}</p>
          <Link
            to="/account/orders"
            className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold inline-block"
          >
            Return to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 sm:px-6 print:p-0 print:bg-white text-slate-900">
      {/* Top Action Bar (hidden when printing) */}
      <div className="max-w-4xl mx-auto mb-6 flex items-center justify-between print:hidden">
        <Link
          to={`/account/orders/${order.orderNumber || order._id}`}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
        >
          <FiArrowLeft className="w-4 h-4" />
          <span>Back to Order Details</span>
        </Link>

        <button
          type="button"
          onClick={handlePrint}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-black transition-all shadow-md active:scale-95"
        >
          <FiPrinter className="w-4 h-4" />
          <span>Print Order Summary</span>
        </button>
      </div>

      {/* Printable Invoice Sheet */}
      <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 shadow-sm print:border-none print:shadow-none print:p-0 print:rounded-none">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-slate-200 pb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black tracking-tight text-slate-950 font-display">
                MOTO<span className="text-amber-500">ZONE</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-amber-100 text-amber-900 rounded-md">
                Official Receipt
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">Premium Motorcycle Spare Parts & Accessories</p>
            <p className="text-[11px] text-slate-400 font-mono">support@motozone.in · www.motozone.in</p>
          </div>

          <div className="sm:text-right space-y-1">
            <div className="text-xs uppercase font-bold text-slate-400 tracking-wider">Order Reference</div>
            <div className="text-lg font-black font-mono text-slate-900">{order.orderNumber}</div>
            <div className="text-xs text-slate-600">
              Date: {new Date(order.createdAt).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
            <div className="text-xs font-bold text-emerald-700 flex sm:justify-end items-center gap-1">
              <FiCheckCircle className="w-3.5 h-3.5" />
              <span>Status: {order.orderStatus}</span>
            </div>
          </div>
        </div>

        {/* Addresses & Payment Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 py-8 border-b border-slate-200 text-xs">
          <div>
            <div className="font-bold text-slate-400 uppercase tracking-wider mb-2 text-[10px]">
              Shipping & Delivery
            </div>
            <div className="font-bold text-slate-900 text-sm">{order.shippingAddress?.fullName}</div>
            <div className="text-slate-600 leading-relaxed mt-1">
              {order.shippingAddress?.addressLine1}
              {order.shippingAddress?.addressLine2 && `, ${order.shippingAddress.addressLine2}`}
              <br />
              {order.shippingAddress?.city}, {order.shippingAddress?.state} — {order.shippingAddress?.postalCode}
              <br />
              Phone: {order.shippingAddress?.phone}
            </div>
            <div className="mt-2 text-slate-500">
              Delivery Method: <span className="font-semibold text-slate-800">{order.shippingMethod?.name || 'Standard Courier Delivery'}</span>
            </div>
          </div>

          <div>
            <div className="font-bold text-slate-400 uppercase tracking-wider mb-2 text-[10px]">
              Payment Information
            </div>
            <div className="space-y-1 text-slate-700">
              <div>
                Payment Method: <span className="font-bold uppercase text-slate-900">{order.paymentMethod || 'Razorpay / Prepaid'}</span>
              </div>
              <div>
                Payment Status: <span className="font-bold text-emerald-600">{order.paymentStatus || 'Paid'}</span>
              </div>
              {order.payment?.razorpayPaymentId && (
                <div className="font-mono text-[11px] text-slate-500">
                  Transaction ID: {order.payment.razorpayPaymentId}
                </div>
              )}
              {order.tracking?.trackingNumber && (
                <div className="pt-2 border-t border-slate-100 text-slate-600">
                  Carrier: <span className="font-semibold text-slate-900">{order.tracking.carrier}</span> ({order.tracking.trackingNumber})
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Itemized Table */}
        <div className="py-8 border-b border-slate-200">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] font-black uppercase tracking-wider text-slate-400">
                <th className="py-3 px-2">#</th>
                <th className="py-3 px-2">Item Description</th>
                <th className="py-3 px-2">SKU</th>
                <th className="py-3 px-2 text-center">Qty</th>
                <th className="py-3 px-2 text-right">Price</th>
                <th className="py-3 px-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {order.items?.map((item, index) => (
                <tr key={item._id || index}>
                  <td className="py-3.5 px-2 text-slate-400 font-mono">{index + 1}</td>
                  <td className="py-3.5 px-2 font-bold text-slate-900">{item.productName}</td>
                  <td className="py-3.5 px-2 text-slate-500 font-mono">{item.SKU}</td>
                  <td className="py-3.5 px-2 text-center font-bold text-slate-800">{item.quantity}</td>
                  <td className="py-3.5 px-2 text-right text-slate-600">₹{(item.unitPrice || 0).toLocaleString('en-IN')}</td>
                  <td className="py-3.5 px-2 text-right font-black text-slate-900">
                    ₹{(item.itemTotal || item.unitPrice * item.quantity).toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary Footer */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between gap-6 text-xs">
          <div className="text-slate-500 space-y-1 max-w-sm">
            <div className="font-bold text-slate-700">Thank you for riding with MotoZone!</div>
            <p className="text-[11px] leading-relaxed">
              For any warranty, cancellation, or return inquiries within the 7-day delivery window, please visit your account order portal or contact support.
            </p>
          </div>

          <div className="w-full sm:w-72 space-y-2 text-slate-700">
            <div className="flex justify-between">
              <span>Items Subtotal:</span>
              <span className="font-bold text-slate-900">₹{order.subtotal?.toLocaleString('en-IN')}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Promotional Discount:</span>
                <span>-₹{order.discount?.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Shipping Charges:</span>
              <span className="font-bold text-slate-900">{order.shipping === 0 ? 'FREE' : `₹${order.shipping}`}</span>
            </div>
            <div className="flex justify-between">
              <span>Applicable GST (18%):</span>
              <span className="font-bold text-slate-900">₹{order.tax?.toLocaleString('en-IN')}</span>
            </div>
            <div className="pt-3 border-t-2 border-slate-900 flex justify-between text-sm font-black text-slate-950">
              <span>Grand Total:</span>
              <span>₹{order.grandTotal?.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const OrderPrintPage = () => {
  return (
    <OrderProvider>
      <OrderPrintContent />
    </OrderProvider>
  );
};

export default OrderPrintPage;
