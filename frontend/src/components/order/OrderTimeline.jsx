import React from 'react';
import { FiCheck, FiClock, FiXCircle, FiPackage, FiTruck, FiHome } from 'react-icons/fi';

export const OrderTimeline = ({ order }) => {
  if (!order) return null;

  const standardSteps = [
    { key: 'Pending', label: 'Order Placed', icon: FiClock },
    { key: 'Confirmed', label: 'Payment Confirmed', icon: FiCheck },
    { key: 'Processing', label: 'Processing at Hub', icon: FiPackage },
    { key: 'Shipped', label: 'Dispatched & In Transit', icon: FiTruck },
    { key: 'Delivered', label: 'Delivered to Rider', icon: FiHome },
  ];

  const statusOrder = ['Pending', 'Confirmed', 'Processing', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'];
  const currentStatus = order.orderStatus;
  const isCancelled = currentStatus === 'Cancelled';
  const isReturned = currentStatus === 'Returned' || currentStatus === 'Return Requested';

  const history = order.statusHistory || [];
  const currentStatusIndex = statusOrder.indexOf(currentStatus);

  if (isCancelled) {
    return (
      <div className="p-5 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3">
        <FiXCircle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-bold text-rose-900">Order Cancelled</h4>
          <p className="text-xs text-rose-700 mt-0.5">
            {order.cancellation?.reason ? `Reason: ${order.cancellation.reason}` : 'This order has been cancelled.'}
          </p>
          {order.refund && order.refund.status !== 'Not Applicable' && (
            <div className="mt-2 text-xs font-semibold text-rose-800 bg-rose-100/70 px-2.5 py-1 rounded-md inline-block">
              Refund Status: {order.refund.status} (₹{order.refund.amount?.toLocaleString('en-IN')})
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 sm:p-6 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-4">
      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
        Order Progress Timeline
      </h3>

      <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-2.5 sm:before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
        {standardSteps.map((step, idx) => {
          const stepIndex = statusOrder.indexOf(step.key);
          const isCompleted = currentStatusIndex >= stepIndex;
          const isCurrent = currentStatus === step.key || (step.key === 'Shipped' && currentStatus === 'Out for Delivery');
          const historyEntry = history.find((h) => h.status === step.key);

          return (
            <div key={step.key} className="relative">
              {/* Circle bullet */}
              <div
                className={`absolute -left-6 sm:-left-8 top-0.5 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  isCompleted
                    ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-100'
                    : 'bg-white border-2 border-slate-300 text-slate-400'
                }`}
              >
                {isCompleted ? <FiCheck className="w-3.5 h-3.5 stroke-[2.5]" /> : idx + 1}
              </div>

              {/* Step info */}
              <div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs sm:text-sm font-bold ${isCurrent ? 'text-amber-600' : isCompleted ? 'text-slate-900' : 'text-slate-400'}`}>
                    {step.label}
                  </span>
                  {historyEntry && (
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(historyEntry.timestamp).toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  )}
                </div>

                {historyEntry && (
                  <p className="text-xs text-slate-500 mt-0.5">{historyEntry.message}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderTimeline;
