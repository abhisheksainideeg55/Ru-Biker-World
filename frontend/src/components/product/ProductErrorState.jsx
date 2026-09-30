import React from 'react';
import { FiAlertTriangle, FiRefreshCw } from 'react-icons/fi';
import Button from '../common/Button';

export const ProductErrorState = ({
  title = 'Unable to Load Products',
  message = 'An unexpected error occurred while fetching motorcycle catalog items. Please check your connection and try again.',
  onRetry,
}) => {
  return (
    <div className="card-premium p-8 sm:p-12 text-center flex flex-col items-center justify-center bg-rose-50/40 border border-rose-100 rounded-2xl my-6">
      <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
        <FiAlertTriangle className="w-7 h-7" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-1.5">{title}</h3>
      <p className="text-xs sm:text-sm text-slate-600 max-w-md mb-6 leading-relaxed">
        {message}
      </p>
      {onRetry && (
        <Button
          onClick={onRetry}
          variant="primary"
          size="md"
          icon={FiRefreshCw}
          className="shadow-sm"
        >
          Try Again
        </Button>
      )}
    </div>
  );
};

export default ProductErrorState;
