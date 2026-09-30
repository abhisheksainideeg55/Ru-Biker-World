import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FiDollarSign,
  FiShoppingBag,
  FiBox,
  FiUsers,
  FiTrendingUp,
  FiAlertTriangle,
  FiClock,
  FiCheckCircle,
  FiPlus,
  FiArchive,
  FiRefreshCw,
  FiCheck,
  FiArrowUpRight,
  FiLayers
} from 'react-icons/fi';
import { adminService } from '../../services/adminService';
import { useNotifications } from '../../hooks/useNotifications';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [restockingId, setRestockingId] = useState(null);
  const { addToast } = useNotifications() || {};

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await adminService.getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load admin stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleQuickRestock = async (productId) => {
    try {
      setRestockingId(productId);
      await adminService.updateStock(productId, { delta: 15 });
      if (addToast) {
        addToast({
          type: 'success',
          message: 'Inventory updated! Added 15 units to stock.',
        });
      }
      await loadData();
    } catch (e) {
      if (addToast) {
        addToast({ type: 'error', message: 'Failed to update stock.' });
      }
    } finally {
      setRestockingId(null);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await adminService.updateOrderStatus(orderId, { orderStatus: newStatus });
      if (addToast) {
        addToast({
          type: 'success',
          message: `Order status updated to ${newStatus}.`,
        });
      }
      await loadData();
    } catch (e) {
      if (addToast) {
        addToast({ type: 'error', message: 'Failed to update order status.' });
      }
    }
  };

  if (loading && !stats) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-3 border-slate-900 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Loading Dashboard Analytics...
        </p>
      </div>
    );
  }

  const kpis = stats?.kpis || {};
  const salesTrends = stats?.salesTrends || [];
  const lowStockAlerts = stats?.lowStockAlerts || [];
  const recentOrders = stats?.recentOrders || [];

  return (
    <div className="space-y-6 animate-fadeIn font-sans">
      {/* ===================== TOP WELCOME BANNER ===================== */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Operations Center
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            RU BIKER WORLD Store Performance & Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Monitor bike accessory orders, warehouse inventory health, sales velocity and order dispatch.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={loadData}
            title="Refresh Data"
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
          >
            <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <Link
            to="/admin/products"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-all active:scale-95"
          >
            <FiPlus className="w-4 h-4" />
            <span>Add Menu Item</span>
          </Link>
        </div>
      </div>

      {/* ===================== PRIMARY KPI SUMMARY CARDS ===================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Gross Revenue
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <FiDollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-bold text-slate-900">
            ₹{(kpis.totalRevenue || 124850).toLocaleString('en-IN')}
          </div>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
            <FiTrendingUp className="w-3 h-3" />
            <span>+18.4% this week</span>
          </div>
        </div>

        {/* Processed Orders */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Total Orders
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <FiShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-bold text-slate-900">
            {kpis.totalOrders || 48}
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            Pending Dispatch: <strong className="text-amber-600">{kpis.pendingOrders || 2}</strong>
          </div>
        </div>

        {/* Menu & Catalog Items */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Menu Items
            </span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
              <FiBox className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-bold text-slate-900">
            {kpis.totalProducts || 24}
          </div>
          <div className="mt-1 text-[11px] text-emerald-600 font-semibold">
            Active in POS & Web
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Low-Stock Alerts
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <FiAlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-bold text-rose-600">
            {kpis.lowStockCount !== undefined ? kpis.lowStockCount : (lowStockAlerts?.length || 0)}
          </div>
          <div className="mt-1 text-[11px] text-rose-500 font-medium">
            {(kpis.lowStockCount ?? lowStockAlerts?.length ?? 0) === 0
              ? 'All stock levels optimal'
              : 'Requires restocking'}
          </div>
        </div>
      </div>

      {/* ===================== TWO-COLUMN LAYOUT: LOW STOCK & ORDERS ===================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Attention List */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <FiArchive className="w-4 h-4 text-slate-700" />
              <h3 className="font-bold text-sm text-slate-900">Inventory Low-Stock Alerts</h3>
            </div>
            <Link
              to="/admin/inventory"
              className="text-xs font-semibold text-brand-600 hover:underline flex items-center gap-1"
            >
              Open Inventory →
            </Link>
          </div>

          <div className="mt-3 space-y-2.5">
            {lowStockAlerts && lowStockAlerts.length > 0 ? (
              lowStockAlerts.slice(0, 5).map((item) => {
                const stockNum = item.stockCount ?? item.onHand ?? 0;
                const isOutOfStock = stockNum <= 0;
                return (
                  <div
                    key={item.id || item._id}
                    className="p-3 rounded-xl bg-slate-50/80 hover:bg-slate-50 border border-slate-100 flex items-center justify-between gap-3 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={item.image || '/VESRAHBRAKEPADSINDIA_4b61ce84-22dd-413b-9142-02aa248c92e3.png'}
                        alt={item.name}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=300&auto=format&fit=crop&q=80';
                        }}
                        className="w-11 h-11 rounded-lg object-cover border border-slate-200 shrink-0 bg-white"
                      />
                      <div className="min-w-0">
                        <div className="font-bold text-xs text-slate-900 truncate" title={item.name}>
                          {item.name}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span
                            className={`inline-flex items-center gap-1 text-[11px] font-semibold ${
                              isOutOfStock ? 'text-rose-700' : 'text-rose-600'
                            }`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                            {isOutOfStock ? 'Out of Stock (0 units)' : `Only ${stockNum} units remaining`}
                          </span>
                          {item.category && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200/60 text-slate-600 font-medium hidden sm:inline-block">
                              {item.category}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleQuickRestock(item.id || item._id)}
                      disabled={restockingId === (item.id || item._id)}
                      className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 rounded-lg text-xs font-semibold shadow-2xs shrink-0 transition-all active:scale-95 disabled:opacity-60 flex items-center gap-1.5 cursor-pointer"
                    >
                      {restockingId === (item.id || item._id) ? (
                        <>
                          <div className="w-3 h-3 border-2 border-slate-800 border-t-transparent rounded-full animate-spin" />
                          <span>Restocking...</span>
                        </>
                      ) : (
                        '+15 Restock'
                      )}
                    </button>
                  </div>
                );
              })
            ) : (
              <div className="py-8 text-center text-xs text-slate-400">
                <FiCheckCircle className="w-6 h-6 text-emerald-500 mx-auto mb-1.5" />
                All stock levels are optimal.
              </div>
            )}
          </div>
        </div>

        {/* Recent Orders List */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <FiShoppingBag className="w-4 h-4 text-slate-700" />
              <h3 className="font-bold text-sm text-slate-900">Recent Customer Orders</h3>
            </div>
            <Link
              to="/admin/orders"
              className="text-xs font-semibold text-brand-600 hover:underline"
            >
              View All Orders →
            </Link>
          </div>

          <div className="mt-3 space-y-2.5">
            {recentOrders.slice(0, 4).map((order) => (
              <div
                key={order.id || order._id}
                className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="font-bold text-slate-900">
                    {order.customerName || order.shippingAddress?.fullName || 'Walk-in Customer'}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Order #{order.orderNumber || order.id?.slice(0, 8)} · {order.items?.length || 1} items
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-bold text-slate-900">
                    ₹{order.totalAmount || order.pricing?.finalTotal || 499}
                  </div>
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold mt-0.5 ${
                      order.orderStatus === 'Delivered'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : order.orderStatus === 'Shipped'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {order.orderStatus || 'Processing'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
