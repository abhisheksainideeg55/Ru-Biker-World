import React, { useState } from 'react';
import { FiX, FiAlertTriangle } from 'react-icons/fi';
import Modal from '../common/Modal';
import { useOrders } from '../../hooks/useOrders';

export const CancelOrderModal = ({ order, isOpen, onClose, onSuccess }) => {
  const { cancelOrder } = useOrders();
  const [reason, setReason] = useState('Changed my mind');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const reasons = [
    'Changed my mind',
    'Ordered by mistake',
    'Found a better price elsewhere',
    'Delivery taking too long',
    'Incorrect shipping address or bike model selected',
    'Other',
  ];

  const handleCancel = async (e) => {
    e.preventDefault();
    if (!order) return;

    setIsSubmitting(true);
    setError(null);

    const res = await cancelOrder(order._id || order.orderNumber, {
      reason,
      description,
    });

    setIsSubmitting(false);

    if (res && res.success) {
      onSuccess && onSuccess();
    } else {
      setError(res?.message || 'Failed to cancel order.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Cancel Order Confirmation"
      size="md"
    >
      <form onSubmit={handleCancel} className="space-y-4">
        <div className="flex items-start gap-3 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800">
          <FiAlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Are you sure you want to cancel order #{order?.orderNumber}?</span>
            <p className="text-[11px] text-rose-700 mt-0.5">
              If payment has already been captured, an automated refund of ₹{order?.grandTotal?.toLocaleString('en-IN')} will be initiated to your original payment source.
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-rose-100 text-rose-800 rounded-lg text-xs font-semibold">
            {error}
          </div>
        )}

        <div>
          <label className="text-xs font-bold text-slate-800 block mb-1.5">
            Reason for Cancellation *
          </label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
          >
            {reasons.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-800 block mb-1.5">
            Additional Comments (Optional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Let us know how we can improve..."
            className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 resize-none"
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Keep Order
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
          >
            {isSubmitting ? 'Cancelling...' : 'Confirm Cancellation'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CancelOrderModal;
