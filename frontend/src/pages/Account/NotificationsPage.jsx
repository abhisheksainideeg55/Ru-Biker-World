import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FiBell,
  FiCheck,
  FiCheckCircle,
  FiPackage,
  FiTag,
  FiTrendingDown,
  FiLayers,
  FiRotateCcw,
  FiDollarSign,
  FiTrash2,
  FiArrowRight,
} from 'react-icons/fi';
import { AccountLayout } from '../../components/account';
import { useNotifications } from '../../hooks/useNotifications';

export const NotificationsPage = () => {
  const {
    notifications,
    unreadCount,
    isLoading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearNotifications,
  } = useNotifications();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const getIcon = (type) => {
    switch (type) {
      case 'ORDER_PLACED':
      case 'ORDER_CONFIRMED':
      case 'ORDER_PROCESSING':
      case 'ORDER_SHIPPED':
      case 'ORDER_DELIVERED':
      case 'order':
        return <FiPackage className="w-5 h-5 text-blue-600" />;
      case 'RETURN_REQUESTED':
      case 'RETURN_APPROVED':
      case 'RETURN_REJECTED':
        return <FiRotateCcw className="w-5 h-5 text-orange-600" />;
      case 'REFUND_PROCESSING':
      case 'REFUND_COMPLETED':
        return <FiDollarSign className="w-5 h-5 text-emerald-600" />;
      case 'PRICE_DROP':
      case 'price_drop':
        return <FiTrendingDown className="w-5 h-5 text-amber-600" />;
      case 'BACK_IN_STOCK':
      case 'stock':
        return <FiLayers className="w-5 h-5 text-indigo-600" />;
      case 'OFFER':
      case 'offer':
        return <FiTag className="w-5 h-5 text-rose-600" />;
      default:
        return <FiBell className="w-5 h-5 text-amber-600" />;
    }
  };

  const getIconBg = (type) => {
    switch (type) {
      case 'ORDER_PLACED':
      case 'ORDER_CONFIRMED':
      case 'ORDER_PROCESSING':
      case 'ORDER_SHIPPED':
      case 'ORDER_DELIVERED':
      case 'order':
        return 'bg-blue-50 border-blue-200/60';
      case 'RETURN_REQUESTED':
      case 'RETURN_APPROVED':
        return 'bg-orange-50 border-orange-200/60';
      case 'REFUND_PROCESSING':
      case 'REFUND_COMPLETED':
        return 'bg-emerald-50 border-emerald-200/60';
      case 'PRICE_DROP':
      case 'price_drop':
        return 'bg-amber-50 border-amber-200/60';
      case 'BACK_IN_STOCK':
      case 'stock':
        return 'bg-indigo-50 border-indigo-200/60';
      case 'OFFER':
      case 'offer':
        return 'bg-rose-50 border-rose-200/60';
      default:
        return 'bg-amber-50 border-amber-200/60';
    }
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return 'Recently';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${Math.max(1, diffMins)}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <AccountLayout breadcrumbs={[{ label: 'Notifications', path: null }]}>
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-slate-100 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-200/60">
              <FiBell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black text-slate-900 font-display">
                  Notification Center
                </h1>
                {unreadCount > 0 && (
                  <span className="text-[10px] font-extrabold text-amber-900 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full">
                    {unreadCount} New
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                Order status updates, shipment tracking, discounts, price drop alerts, and rider news.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 hover:text-amber-600 bg-slate-50 hover:bg-amber-50 border border-slate-200 transition-colors"
              >
                <FiCheck className="w-3.5 h-3.5" />
                <span>Mark All Read</span>
              </button>
            )}

            {notifications.length > 0 && (
              <button
                type="button"
                onClick={clearNotifications}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors"
              >
                <FiTrash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            )}
          </div>
        </div>

        {/* List Content */}
        {isLoading ? (
          <div className="space-y-3 animate-pulse">
            <div className="h-20 bg-slate-100 rounded-2xl" />
            <div className="h-20 bg-slate-100 rounded-2xl" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-12 text-center max-w-sm mx-auto space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-500 flex items-center justify-center mx-auto mb-3">
              <FiCheckCircle className="w-7 h-7" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              You're all caught up!
            </h3>
            <p className="text-xs text-slate-500">
              No new alerts or account notices at this moment.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {notifications.map((notif) => {
              const id = notif._id || notif.id;
              return (
                <div
                  key={id}
                  onClick={() => !notif.isRead && markAsRead(id)}
                  className={`py-4 px-3 sm:px-4 rounded-2xl transition-all cursor-pointer flex items-start gap-4 ${
                    notif.isRead
                      ? 'bg-transparent hover:bg-slate-50'
                      : 'bg-amber-50/40 border border-amber-200/60 hover:bg-amber-50/60'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${getIconBg(
                      notif.type
                    )}`}
                  >
                    {getIcon(notif.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3
                        className={`text-xs sm:text-sm ${
                          notif.isRead ? 'font-semibold text-slate-800' : 'font-black text-slate-900'
                        }`}
                      >
                        {notif.title}
                      </h3>
                      <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                        {formatTime(notif.createdAt)}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {notif.message}
                    </p>

                    <div className="mt-2 flex items-center justify-between">
                      {notif.link ? (
                        <Link
                          to={notif.link}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 hover:text-amber-700 hover:underline"
                        >
                          <span>View Details</span>
                          <FiArrowRight className="w-3 h-3" />
                        </Link>
                      ) : <div />}

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(id);
                        }}
                        className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                        title="Delete notification"
                      >
                        <FiTrash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {!notif.isRead && (
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AccountLayout>
  );
};

export default NotificationsPage;
