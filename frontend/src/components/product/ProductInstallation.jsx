import React from 'react';
import { FiTool, FiClock, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';

export const ProductInstallation = ({ installation = {} }) => {
  const {
    difficulty = 'Moderate',
    estimatedTime = '30–45 mins',
    professionalInstallation = 'Recommended for optimal safety',
  } = installation;

  return (
    <div className="space-y-4">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">
            <FiTool className="w-4 h-4 text-brand-600" />
            <span>Difficulty</span>
          </div>
          <p className="text-sm font-black text-slate-900">{difficulty}</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">
            <FiClock className="w-4 h-4 text-brand-600" />
            <span>Estimated Time</span>
          </div>
          <p className="text-sm font-black text-slate-900">{estimatedTime}</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">
            <FiCheckCircle className="w-4 h-4 text-brand-600" />
            <span>Installation Method</span>
          </div>
          <p className="text-sm font-black text-slate-900">{professionalInstallation}</p>
        </div>
      </div>

      {/* Advisory Box */}
      <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 flex items-start gap-3 text-xs text-amber-900">
        <FiAlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Important Safety Note:</strong> Always follow your motorcycle manufacturer's specified torque recommendations and installation guidelines. If you are unsure about technical fitment or brake hydraulic bleeding, MotoZone strongly advises professional workshop assistance.
        </p>
      </div>
    </div>
  );
};

export default ProductInstallation;
