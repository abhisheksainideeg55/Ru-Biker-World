import React from 'react';
import { FiCheck, FiClock, FiXCircle, FiPackage, FiTruck, FiDollarSign } from 'react-icons/fi';

export const ReturnTimeline = ({ status = 'Requested' }) => {
  const steps = [
    { key: 'Requested', label: 'Return Requested', icon: FiClock },
    { key: 'Under Review', label: 'Under Review by MotoZone', icon: FiPackage },
    { key: 'Approved', label: 'Return Approved', icon: FiCheck },
    { key: 'Pickup Scheduled', label: 'Courier Pickup Scheduled', icon: FiTruck },
    { key: 'Received', label: 'Item Received at Warehouse', icon: FiPackage },
    { key: 'Refunded', label: 'Refund Credited to Source', icon: FiDollarSign },
  ];

  const statusOrder = ['Requested', 'Under Review', 'Approved', 'Pickup Scheduled', 'Received', 'Refund Processing', 'Refunded'];
  const currentIndex = statusOrder.indexOf(status);
  const isRejected = status === 'Rejected';
  const isCancelled = status === 'Cancelled';

  if (isRejected || isCancelled) {
    return (
      <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
        <FiXCircle className="w-5 h-5 text-rose-600 shrink-0" />
        <span className="font-bold">
          Return request is {status.toLowerCase()}.
        </span>
      </div>
    );
  }

  return (
    <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
        Return & Refund Status Progression
      </h4>

      <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
        {steps.map((step, idx) => {
          const stepIndex = statusOrder.indexOf(step.key);
          const isCompleted = currentIndex >= stepIndex;
          const isCurrent = status === step.key;

          return (
            <div key={step.key} className="relative">
              <div
                className={`absolute -left-6 top-0.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  isCompleted
                    ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-100'
                    : 'bg-white border-2 border-slate-300 text-slate-400'
                }`}
              >
                {isCompleted ? <FiCheck className="w-3.5 h-3.5 stroke-[2.5]" /> : idx + 1}
              </div>

              <div>
                <span className={`text-xs font-bold ${isCurrent ? 'text-amber-600' : isCompleted ? 'text-slate-900' : 'text-slate-400'}`}>
                  {step.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ReturnTimeline;
