import React, { useState, useEffect } from 'react';
import {
  FiShoppingBag,
  FiTruck,
  FiCheckCircle,
  FiClock,
  FiSearch,
  FiExternalLink,
  FiMapPin,
  FiEye,
  FiX,
  FiFilter,
  FiCreditCard,
  FiPackage,
  FiPhone,
  FiMail,
  FiPrinter,
  FiAlertCircle,
  FiRefreshCw,
  FiChevronRight
} from 'react-icons/fi';
import { adminService } from '../../services/adminService';
import { useNotifications } from '../../hooks/useNotifications';

export const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [trackingModalOrder, setTrackingModalOrder] = useState(null);
  const [carrier, setCarrier] = useState('Delhivery Express');
  const [trackingNumber, setTrackingNumber] = useState('');

  const { addToast } = useNotifications() || {};

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await adminService.getOrders();
      setOrders(data || []);
    } catch (e) {
      console.error('Failed to load orders:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await adminService.updateOrderStatus(orderId, { orderStatus: newStatus });
      if (addToast) {
        addToast({
          type: 'success',
          message: `Order status updated to ${newStatus}.`,
        });
      }
      loadOrders();
    } catch (e) {
      if (addToast) addToast({ type: 'error', message: 'Failed to update order status.' });
    }
  };

  const handleSaveTracking = async (e) => {
    e.preventDefault();
    if (!trackingModalOrder) return;
    try {
      const id = trackingModalOrder.id || trackingModalOrder._id || trackingModalOrder.orderNumber;
      await adminService.updateOrderStatus(id, {
        orderStatus: 'Shipped',
        trackingCarrier: carrier,
        trackingNumber: trackingNumber || `DEL${Date.now().toString().slice(-8)}IN`,
      });
      if (addToast) {
        addToast({
          type: 'success',
          message: 'Tracking details saved and order marked as Shipped!',
        });
      }
      setTrackingModalOrder(null);
      loadOrders();
    } catch (e) {
      if (addToast) addToast({ type: 'error', message: 'Failed to update tracking.' });
    }
  };

  // Helper to format date
  const formatDate = (dateStr) => {
    if (!dateStr) return 'Recent';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  // Filter orders
  let filtered = [...orders];

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (o) =>
        o.orderNumber?.toLowerCase().includes(q) ||
        o.customerName?.toLowerCase().includes(q) ||
        o.userEmail?.toLowerCase().includes(q) ||
        o.userPhone?.toLowerCase().includes(q) ||
        o.shippingAddress?.fullName?.toLowerCase().includes(q) ||
        o.shippingAddress?.city?.toLowerCase().includes(q) ||
        o.items?.some((i) => 
          i.productName?.toLowerCase().includes(q) || 
          i.SKU?.toLowerCase().includes(q) ||
          i.name?.toLowerCase().includes(q)
        )
    );
  }

  if (statusFilter !== 'all') {
    filtered = filtered.filter((o) => o.orderStatus?.toLowerCase() === statusFilter.toLowerCase());
  }

  if (paymentFilter !== 'all') {
    filtered = filtered.filter((o) => {
      const pMethod = (o.paymentMethod || '').toLowerCase();
      const pStatus = (o.paymentStatus || '').toLowerCase();
      if (paymentFilter === 'cod') return pMethod.includes('cod');
      if (paymentFilter === 'online') return !pMethod.includes('cod');
      if (paymentFilter === 'paid') return pStatus === 'paid';
      if (paymentFilter === 'pending') return pStatus === 'pending';
      return true;
    });
  }

  // Delivery Status badge styling
  const getDeliveryStatusBadge = (status) => {
    const s = (status || 'Pending').toLowerCase();
    switch (s) {
      case 'delivered':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'shipped':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'out for delivery':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'processing':
      case 'packed':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'cancelled':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };

  // Payment Status badge styling
  const getPaymentStatusBadge = (status, method) => {
    const isCod = (method || '').toLowerCase().includes('cod');
    const s = (status || (isCod ? 'Pending' : 'Paid')).toLowerCase();
    switch (s) {
      case 'paid':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'failed':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'refunded':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn font-sans p-2 sm:p-4">
      {/* ===================== PAGE HEADER ===================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#c81e2b]/10 text-[#c81e2b] flex items-center justify-center font-bold">
              <FiPackage className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Order Management
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Real-time tracking of motorcycle spare parts, accessories, payments & delivery dispatch
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button
            onClick={loadOrders}
            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
            title="Refresh Orders"
          >
            <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <span className="text-xs font-bold bg-slate-900 text-white px-3.5 py-2 rounded-xl shadow-xs">
            {filtered.length} of {orders.length} Orders
          </span>
        </div>
      </div>

      {/* ===================== FILTER TABS & SEARCH ===================== */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Delivery Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 lg:pb-0">
          {[
            { id: 'all', label: 'All Orders' },
            { id: 'pending', label: 'Pending' },
            { id: 'processing', label: 'Processing' },
            { id: 'shipped', label: 'Shipped' },
            { id: 'delivered', label: 'Delivered' },
            { id: 'cancelled', label: 'Cancelled' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                statusFilter === tab.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search & Payment Filter */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5">
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:bg-white"
          >
            <option value="all">All Payments</option>
            <option value="cod">COD Orders</option>
            <option value="online">Online / UPI</option>
            <option value="paid">Payment: Paid</option>
            <option value="pending">Payment: Pending</option>
          </select>

          <div className="relative w-full sm:w-64">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search product, SKU, customer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#c81e2b] focus:bg-white transition-all"
            />
          </div>
        </div>
      </div>

      {/* ===================== ORDERS TABLE ===================== */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4 sm:px-5">Order ID & Date</th>
                <th className="py-3.5 px-4 sm:px-5">Customer</th>
                <th className="py-3.5 px-4 sm:px-5">Product Details</th>
                <th className="py-3.5 px-4 sm:px-5">Quantity</th>
                <th className="py-3.5 px-4 sm:px-5">Total Amount</th>
                <th className="py-3.5 px-4 sm:px-5">Payment Status</th>
                <th className="py-3.5 px-4 sm:px-5">Payment Method</th>
                <th className="py-3.5 px-4 sm:px-5">Delivery Status</th>
                <th className="py-3.5 px-4 sm:px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filtered.length > 0 ? (
                filtered.map((order) => {
                  const items = order.items || [];
                  const firstItem = items[0] || {};
                  const totalItemsCount = items.reduce((s, i) => s + (Number(i.quantity) || 1), 0) || 1;
                  const totalAmount = order.totalAmount || order.grandTotal || order.pricing?.finalTotal || 0;
                  const orderId = order.orderNumber || order.id || order._id;
                  const pMethod = order.paymentMethod || 'COD';
                  const isCod = pMethod.toLowerCase().includes('cod');
                  const pStatus = order.paymentStatus || (isCod ? 'Pending' : 'Paid');

                  // Image fallback helper
                  const itemImg = firstItem.image || firstItem.product?.images?.[0] || firstItem.product?.image || '/ru_biker_world-removebg-preview.png';

                  return (
                    <tr key={orderId} className="hover:bg-slate-50/80 transition-colors">
                      {/* 1. Order ID & Date */}
                      <td className="py-4 px-4 sm:px-5">
                        <div className="font-mono font-bold text-slate-900 text-xs flex items-center gap-1.5">
                          <span>#{order.orderNumber || String(orderId).slice(-6).toUpperCase()}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 font-medium mt-0.5">
                          {formatDate(order.createdAt)}
                        </div>
                      </td>

                      {/* 2. Customer */}
                      <td className="py-4 px-4 sm:px-5">
                        <div className="font-bold text-slate-900">
                          {order.customerName || order.shippingAddress?.fullName || 'Valued Rider'}
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <FiPhone className="w-3 h-3 text-slate-400" />
                          <span>{order.userPhone || order.shippingAddress?.phone || 'No phone'}</span>
                        </div>
                        {order.shippingAddress?.city && (
                          <div className="text-[10px] text-slate-400">
                            {order.shippingAddress.city}, {order.shippingAddress.state}
                          </div>
                        )}
                      </td>

                      {/* 3. Product(s) Detail */}
                      <td className="py-4 px-4 sm:px-5 max-w-xs">
                        <div className="flex items-center gap-3">
                          <img
                            src={itemImg}
                            alt={firstItem.productName || 'Product'}
                            className="w-10 h-10 object-cover rounded-lg border border-slate-200 shrink-0 bg-slate-50"
                            onError={(e) => {
                              e.target.src = '/ru_biker_world-removebg-preview.png';
                            }}
                          />
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-slate-900 truncate text-xs" title={firstItem.productName || firstItem.name}>
                              {firstItem.productName || firstItem.name || 'Motorcycle Spare Part'}
                            </p>
                            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium mt-0.5">
                              {firstItem.SKU && <span>SKU: {firstItem.SKU}</span>}
                              {items.length > 1 && (
                                <span className="px-1.5 py-0.2 rounded-md bg-slate-100 text-slate-600 font-bold border border-slate-200">
                                  +{items.length - 1} more
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* 4. Quantity */}
                      <td className="py-4 px-4 sm:px-5 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200">
                          {totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'}
                        </span>
                      </td>

                      {/* 5. Total Amount */}
                      <td className="py-4 px-4 sm:px-5 whitespace-nowrap">
                        <span className="font-black text-slate-900 text-sm">
                          ₹{Number(totalAmount).toLocaleString('en-IN')}
                        </span>
                      </td>

                      {/* 6. Payment Status */}
                      <td className="py-4 px-4 sm:px-5 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border ${getPaymentStatusBadge(pStatus, pMethod)}`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-80" />
                          {pStatus}
                        </span>
                      </td>

                      {/* 7. Payment Method */}
                      <td className="py-4 px-4 sm:px-5 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold border ${
                          isCod 
                            ? 'bg-amber-50 text-amber-800 border-amber-200' 
                            : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        }`}>
                          <FiCreditCard className="w-3.5 h-3.5" />
                          <span>{isCod ? 'Cash on Delivery (COD)' : (pMethod === 'razorpay' ? 'Razorpay Online' : pMethod)}</span>
                        </span>
                      </td>

                      {/* 8. Delivery Status (Instant Selector) */}
                      <td className="py-4 px-4 sm:px-5 whitespace-nowrap">
                        <select
                          value={order.orderStatus || 'Pending'}
                          onChange={(e) => handleStatusChange(order.id || order._id || orderId, e.target.value)}
                          className={`text-xs font-bold px-3 py-1.5 rounded-xl border focus:outline-none transition-all cursor-pointer ${getDeliveryStatusBadge(order.orderStatus)}`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Packed">Packed</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>

                      {/* 9. Actions */}
                      <td className="py-4 px-4 sm:px-5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="p-2 text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-200/80 rounded-xl border border-slate-200 transition-colors cursor-pointer"
                            title="View Full Order Details"
                          >
                            <FiEye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="9" className="py-12 text-center text-slate-400 text-xs">
                    {loading ? (
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-6 h-6 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                        <span>Loading order database...</span>
                      </div>
                    ) : (
                      'No matching orders found.'
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===================== FULL ORDER DETAILS MODAL ===================== */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-7 animate-fadeIn max-h-[90vh] overflow-y-auto space-y-6">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
                  <FiPackage className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="font-black text-lg text-slate-900">
                    Order #{selectedOrder.orderNumber || selectedOrder.id}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">
                    Placed on {formatDate(selectedOrder.createdAt)}
                  </p>
                </div>
              </div>
              
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Status Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Delivery Status</span>
                <span className={`inline-block px-2.5 py-1 rounded-lg font-bold text-xs border ${getDeliveryStatusBadge(selectedOrder.orderStatus)}`}>
                  {selectedOrder.orderStatus || 'Pending'}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Payment Method</span>
                <span className="font-bold text-slate-800 text-xs">
                  {selectedOrder.paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : selectedOrder.paymentMethod || 'Online'}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Payment Status</span>
                <span className={`inline-block px-2.5 py-1 rounded-lg font-bold text-xs border ${getPaymentStatusBadge(selectedOrder.paymentStatus, selectedOrder.paymentMethod)}`}>
                  {selectedOrder.paymentStatus || 'Pending'}
                </span>
              </div>
            </div>

            {/* Customer & Shipping Address */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold text-slate-900 border-b border-slate-200 pb-2">
                <FiMapPin className="w-4 h-4 text-[#c81e2b]" />
                <span>Shipping & Delivery Details</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <p className="font-bold text-slate-800">
                    {selectedOrder.customerName || selectedOrder.shippingAddress?.fullName || 'Customer'}
                  </p>
                  <p className="text-slate-600 mt-0.5">
                    {selectedOrder.shippingAddress?.addressLine1}
                    {selectedOrder.shippingAddress?.addressLine2 && `, ${selectedOrder.shippingAddress.addressLine2}`}
                  </p>
                  <p className="text-slate-600">
                    {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} - {selectedOrder.shippingAddress?.postalCode}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500">Contact Number:</p>
                  <p className="font-bold text-slate-800 font-mono">
                    {selectedOrder.userPhone || selectedOrder.shippingAddress?.phone || 'Not provided'}
                  </p>
                  {selectedOrder.userEmail && (
                    <p className="text-slate-500 text-[11px] mt-1">
                      {selectedOrder.userEmail}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Ordered Products List */}
            <div className="space-y-3 text-xs">
              <span className="font-bold text-slate-900 text-sm block">Ordered Items</span>
              <div className="space-y-2">
                {selectedOrder.items?.map((item, idx) => {
                  const img = item.image || item.product?.images?.[0] || '/ru_biker_world-removebg-preview.png';
                  const price = item.unitPrice || item.price || 0;
                  const qty = item.quantity || 1;
                  const itemTotal = item.itemTotal || price * qty;

                  return (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-2xl bg-white border border-slate-200/80 shadow-2xs gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={img}
                          alt={item.productName || 'Product'}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-100 shrink-0 bg-slate-50"
                          onError={(e) => {
                            e.target.src = '/ru_biker_world-removebg-preview.png';
                          }}
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 truncate">
                            {item.productName || item.name}
                          </p>
                          <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5 font-medium">
                            <span>₹{price.toLocaleString('en-IN')} × {qty}</span>
                            {item.SKU && <span>• SKU: {item.SKU}</span>}
                          </div>
                        </div>
                      </div>
                      <span className="font-black text-slate-900 text-sm whitespace-nowrap">
                        ₹{itemTotal.toLocaleString('en-IN')}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Pricing Summary */}
            <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span>Subtotal</span>
                <span>₹{(selectedOrder.subtotal || selectedOrder.totalAmount || 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Shipping Charges</span>
                <span className="text-emerald-400 font-bold">
                  {selectedOrder.shipping === 0 ? 'FREE' : `₹${selectedOrder.shipping || 0}`}
                </span>
              </div>
              {selectedOrder.discount > 0 && (
                <div className="flex items-center justify-between text-amber-300">
                  <span>Coupon Discount</span>
                  <span>- ₹{selectedOrder.discount}</span>
                </div>
              )}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between font-black text-base text-white">
                <span>Grand Total</span>
                <span className="text-amber-400">
                  ₹{(selectedOrder.totalAmount || selectedOrder.grandTotal || selectedOrder.pricing?.finalTotal || 0).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Modal Footer Controls */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <a
                href={`/account/orders/${selectedOrder.id || selectedOrder._id || selectedOrder.orderNumber}/print`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors"
              >
                <FiPrinter className="w-4 h-4" />
                <span>Print Official Invoice</span>
              </a>

              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                Close Order View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
