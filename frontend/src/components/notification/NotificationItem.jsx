import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiPackage,
  FiRotateCcw,
  FiDollarSign,
  FiTag,
  FiBell,
  FiTrash2,
  FiCheck,
  FiTrendingDown,
  FiLayers,
} from 'react-icons/fi';

export const NotificationItem = ({ notification, onMarkRead, onDelete, onCloseDropdown }) => {
  const navigate = useNavigate();

  const getIcon = (type) => {
    switch (type) {
      case 'ORDER_PLACED':
      case 'ORDER_CONFIRMED':
      case 'ORDER_PROCESSING':
      case 'ORDER_SHIPPED':
      case 'ORDER_DELIVERED':
      case 'order':
        return <FiPackage className="w-4 h-4 text-blue-600" />;
      case 'RETURN_REQUESTED':
      case 'RETURN_APPROVED':
      case 'RETURN_REJECTED':
        return <FiRotateCcw className="w-4 h-4 text-orange-600" />;
      case 'REFUND_PROCESSING':
      case 'REFUND_COMPLETED':
        return <FiDollarSign className="w-4 h-4 text-emerald-600" />;
      case 'PRICE_DROP':
      case 'price_drop':
        return <FiTrendingDown className="w-4 h-4 text-amber-600" />;
      case 'BACK_IN_STOCK':
      case 'stock':
        return <FiLayers className="w-4 h-4 text-indigo-600" />;
      case 'OFFER':
      case 'offer':
        return <FiTag className="w-4 h-4 text-rose-600" />;
      default:
        return <FiBell className="w-4 h-4 text-slate-600" />;
    }
  };

  const handleClick = () => {
    if (!notification.isRead && onMarkRead) {
      onMarkRead(notification._id || notification.id);
    }
    if (onCloseDropdown) onCloseDropdown();
    if (notification.link) {
      navigate(notification.link);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`p-3.5 rounded-xl transition-all cursor-pointer flex items-start justify-between gap-3 border ${
        notification.isRead
          ? 'bg-white hover:bg-slate-50 border-slate-100 text-slate-700'
          : 'bg-amber-50/50 hover:bg-amber-50/80 border-amber-200/80 text-slate-900 shadow-2xs'
      }`}
    >
      <div className="flex items-start gap-3 min-w-0">
        <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center justify-center shrink-0 mt-0.5">
          {getIcon(notification.type)}
        </div>

        <div className="min-w-0 space-y-0.5">
          <div className="flex items-center gap-1.5">
            <h5 className="text-xs font-bold truncate">{notification.title}</h5>
            {!notification.isRead && (
              <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
            )}
          </div>
          <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
            {notification.message}
          </p>
          <span className="text-[10px] text-slate-400 font-mono block">
            {new Date(notification.createdAt).toLocaleDateString('en-IN', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0 ml-1">
        {!notification.isRead && onMarkRead && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onMarkRead(notification._id || notification.id);
            }}
            className="p-1 text-slate-400 hover:text-amber-600 rounded-md"
            title="Mark as read"
          >
            <FiCheck className="w-3.5 h-3.5" />
          </button>
        )}
        {onDelete && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(notification._id || notification.id);
            }}
            className="p-1 text-slate-400 hover:text-rose-600 rounded-md"
            title="Remove notification"
          >
            <FiTrash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default NotificationItem;
