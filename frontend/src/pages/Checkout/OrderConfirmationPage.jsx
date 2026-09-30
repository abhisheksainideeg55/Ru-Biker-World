import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import {
  FiCheckCircle,
  FiPackage,
  FiMapPin,
  FiCalendar,
  FiArrowRight,
  FiShoppingBag,
  FiCreditCard,
  FiShield,
} from 'react-icons/fi';
import Container from '../../components/common/Container';
import Breadcrumb from '../../components/common/Breadcrumb';
import Price from '../../components/common/Price';
import { orderService } from '../../services/orderService';

export const OrderConfirmationPage = () => {
  const { orderId } = useParams();
  const location = useLocation();
  const stateOrder = location.state?.order;

  const [order, setOrder] = useState(stateOrder || null);
  const [isLoading, setIsLoading] = useState(!stateOrder);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!stateOrder && orderId) {
      setIsLoading(true);
      orderService
        .getOrderById(orderId)
        .then((res) => {
          if (res && (res.data || res.order)) {
            setOrder(res.data || res.order);
          } else {
            setError('Order details could not be retrieved.');
          }
        })
        .catch((err) => {
          setError(err.message || 'Unable to load order confirmation.');
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [orderId, stateOrder]);

  if (isLoading) {
    return (
      <div className="py-16 min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-bold text-slate-700">Loading your order confirmation...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="py-16 min-h-[60vh]">
        <Container size="narrow">
          <div className="p-8 bg-white border border-slate-200 rounded-2xl text-center space-y-4">
            <FiPackage className="w-12 h-12 text-slate-400 mx-auto" />
            <h2 className="text-xl font-bold text-slate-900">Order Information</h2>
            <p className="text-sm text-slate-500">{error || 'Order reference not found.'}</p>
            <div className="pt-2">
              <Link
                to="/account/orders"
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-xl transition-all inline-block"
              >
                View Your Orders
              </Link>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="py-8 sm:py-12 min-h-[80vh]">
      <Container size="narrow">
        <Breadcrumb
          items={[
            { label: 'Home', to: '/' },
            { label: 'Orders', to: '/account/orders' },
            { label: 'Confirmation' },
          ]}
        />

        {/* Success Banner */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-10 text-center shadow-sm space-y-6 mt-6">
          <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
            <FiCheckCircle className="w-10 h-10 stroke-[2.5]" />
          </div>

          <div>
            <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full ${
              order.paymentMethod === 'cod'
                ? 'text-amber-800 bg-amber-100'
                : 'text-emerald-600 bg-emerald-50'
            }`}>
              {order.paymentMethod === 'cod' ? 'Order Confirmed (Cash on Delivery)' : 'Order Confirmed & Paid'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-3 font-display">
              Thank You For Your Order!
            </h1>
            <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
              {order.paymentMethod === 'cod'
                ? `Your order has been confirmed! Please keep ₹${(order.grandTotal || 0).toLocaleString('en-IN')} ready to pay upon delivery via Cash or UPI.`
                : 'We have received your payment and our dispatch team is prepping your motorcycle components for shipment.'}
            </p>
          </div>

          {/* Quick Details Box */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase">Order Number</div>
              <div className="text-xs sm:text-sm font-black text-slate-900 font-mono mt-0.5">
                {order.orderNumber}
              </div>
            </div>

            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase">Payment Method</div>
              <div className="text-xs sm:text-sm font-bold text-slate-800 mt-0.5 flex items-center gap-1">
                <FiCreditCard className="w-3.5 h-3.5 text-amber-500" />
                <span>{order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Paid'}</span>
              </div>
            </div>

            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase">Order Status</div>
              <div className="text-xs sm:text-sm font-bold text-emerald-600 mt-0.5 flex items-center gap-1">
                <FiPackage className="w-3.5 h-3.5 text-emerald-500" />
                <span>{order.orderStatus || 'Confirmed'}</span>
              </div>
            </div>

            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase">
                {order.paymentMethod === 'cod' ? 'Payable on Delivery' : 'Total Paid'}
              </div>
              <div className="text-sm sm:text-base font-black text-slate-950 mt-0.5">
                ₹{(order.grandTotal || 0).toLocaleString('en-IN')}
              </div>
            </div>
          </div>

          {/* Delivery & Shipping Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left pt-2">
            <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 mb-1">
                <FiMapPin className="w-4 h-4 text-amber-500" />
                <span>Delivery Address</span>
              </div>
              <div className="text-xs font-bold text-slate-800">{order.shippingAddress?.fullName}</div>
              <div className="text-xs text-slate-600">{order.shippingAddress?.addressLine1}</div>
              <div className="text-xs text-slate-600">
                {order.shippingAddress?.city}, {order.shippingAddress?.state} — {order.shippingAddress?.postalCode}
              </div>
              <div className="text-xs text-slate-500 pt-1">Phone: {order.shippingAddress?.phone}</div>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 mb-1">
                <FiCalendar className="w-4 h-4 text-amber-500" />
                <span>Estimated Delivery</span>
              </div>
              <div className="text-xs font-bold text-slate-800">
                {order.shippingMethod?.estimatedDays || '3–7 business days'}
              </div>
              <div className="text-xs text-slate-500">
                Method: <span className="font-semibold capitalize">{order.shippingMethod?.type || 'standard'}</span>
              </div>
              <div className="text-[11px] text-emerald-600 font-semibold pt-1 flex items-center gap-1">
                <FiShield className="w-3.5 h-3.5" />
                <span>Tracking ID will be sent via SMS & Email</span>
              </div>
            </div>
          </div>

          {/* Ordered Items List */}
          <div className="text-left pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
              Purchased Items ({order.items?.length || 0})
            </h3>

            <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-slate-50/50">
              {order.items?.map((item, idx) => (
                <div key={item._id || idx} className="p-3.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=120&auto=format&fit=crop&q=80'}
                      alt={item.productName}
                      className="w-12 h-12 object-cover rounded-lg bg-white border border-slate-200"
                    />
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-slate-900">{item.productName}</div>
                      <div className="text-[11px] text-slate-500">
                        SKU: <span className="font-mono">{item.SKU}</span> · Qty: {item.quantity}
                      </div>
                    </div>
                  </div>

                  <div className="text-xs sm:text-sm font-extrabold text-slate-900">
                    ₹{(item.itemTotal || item.unitPrice * item.quantity).toLocaleString('en-IN')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link
              to="/account/orders"
              className="w-full sm:w-auto px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl shadow-sm transition-all text-xs sm:text-sm flex items-center justify-center gap-1.5"
            >
              <span>View Order in Account</span>
              <FiArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/shop"
              className="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl transition-colors text-xs sm:text-sm flex items-center justify-center gap-1.5"
            >
              <FiShoppingBag className="w-4 h-4" />
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default OrderConfirmationPage;
