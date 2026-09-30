import React from 'react';
import { FiCheck, FiMapPin, FiTruck, FiCreditCard } from 'react-icons/fi';

export const CheckoutProgress = ({ currentStep = 1, onStepClick }) => {
  const steps = [
    { number: 1, label: 'Delivery Address', icon: FiMapPin },
    { number: 2, label: 'Shipping Method', icon: FiTruck },
    { number: 3, label: 'Review & Payment', icon: FiCreditCard },
  ];

  return (
    <div className="w-full py-4 mb-6">
      {/* Desktop Step Bar */}
      <div className="hidden sm:flex items-center justify-between relative max-w-2xl mx-auto">
        {/* Connecting progress line */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -translate-y-1/2 z-0" />
        <div
          className="absolute top-1/2 left-0 h-1 bg-amber-500 -translate-y-1/2 z-0 transition-all duration-300"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step) => {
          const Icon = step.icon;
          const isCompleted = currentStep > step.number;
          const isCurrent = currentStep === step.number;

          return (
            <div
              key={step.number}
              onClick={() => isCompleted && onStepClick && onStepClick(step.number)}
              className={`relative z-10 flex flex-col items-center select-none ${
                isCompleted ? 'cursor-pointer' : ''
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-200 ${
                  isCompleted
                    ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-100 shadow-sm'
                    : isCurrent
                    ? 'bg-slate-900 text-amber-400 ring-4 ring-slate-100 shadow-md'
                    : 'bg-white border-2 border-slate-300 text-slate-400'
                }`}
              >
                {isCompleted ? <FiCheck className="w-5 h-5 stroke-[2.5]" /> : <Icon className="w-4 h-4" />}
              </div>

              <span
                className={`mt-2 text-xs font-bold transition-colors ${
                  isCurrent ? 'text-slate-900' : isCompleted ? 'text-amber-700' : 'text-slate-400'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Mobile Compact Step Indicator */}
      <div className="sm:hidden flex items-center justify-between px-2 bg-slate-50 border border-slate-200 rounded-xl p-3">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-slate-900 text-amber-400 text-xs font-bold flex items-center justify-center">
            {currentStep}
          </span>
          <span className="text-xs font-bold text-slate-900">
            Step {currentStep} of 3: <span className="text-amber-600">{steps[currentStep - 1]?.label}</span>
          </span>
        </div>
        <div className="flex gap-1">
          {steps.map((s) => (
            <div
              key={s.number}
              className={`h-1.5 w-6 rounded-full ${
                s.number <= currentStep ? 'bg-amber-500' : 'bg-slate-200'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CheckoutProgress;
