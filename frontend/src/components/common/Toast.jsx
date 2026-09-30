import React from 'react';
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from 'react-icons/fi';
import { useNotifications } from '../../hooks/useNotifications';

const toastConfig = {
  success: {
    icon: FiCheckCircle,
    bg: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    iconColor: 'text-emerald-500',
  },
  error: {
    icon: FiAlertCircle,
    bg: 'bg-rose-50 border-rose-200 text-rose-800',
    iconColor: 'text-rose-500',
  },
  warning: {
    icon: FiAlertCircle,
    bg: 'bg-amber-50 border-amber-200 text-amber-800',
    iconColor: 'text-amber-500',
  },
  info: {
    icon: FiInfo,
    bg: 'bg-slate-900 border-slate-800 text-white',
    iconColor: 'text-brand-400',
  },
};

export const ToastContainer = () => {
  const { toasts, removeToast } = useNotifications();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full px-4 sm:px-0">
      {toasts.map((toast) => {
        const config = toastConfig[toast.type] || toastConfig.info;
        const Icon = config.icon;

        return (
          <div
            key={toast.id}
            className={`flex items-start gap-3 p-3.5 rounded-xl border shadow-lg transition-all duration-300 animate-slideUp ${config.bg}`}
            role="alert"
          >
            <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${config.iconColor}`} />
            <div className="flex-1 text-xs font-medium leading-relaxed">
              {toast.message}
            </div>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="p-1 rounded-md opacity-70 hover:opacity-100 transition-opacity focus:outline-none"
              aria-label="Dismiss notification"
            >
              <FiX className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default ToastContainer;
