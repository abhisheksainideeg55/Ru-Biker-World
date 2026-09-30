import React from 'react';
import { FiWifiOff, FiRefreshCw } from 'react-icons/fi';

export const NetworkError = ({ message = 'Unable to connect to the server.', onRetry }) => {
  return (
    <div className="p-8 bg-white border border-slate-200 rounded-3xl text-center space-y-4 shadow-sm max-w-md mx-auto my-6">
      <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto">
        <FiWifiOff className="w-7 h-7" />
      </div>
      <div className="space-y-1">
        <h3 className="text-base font-bold text-slate-900">Network Connection Issue</h3>
        <p className="text-xs text-slate-500 leading-relaxed">{message}</p>
      </div>
      {onRetry && (
        <div className="pt-2">
          <button
            type="button"
            onClick={onRetry}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl inline-flex items-center gap-2 transition-all shadow-xs active:scale-95"
          >
            <FiRefreshCw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default NetworkError;
