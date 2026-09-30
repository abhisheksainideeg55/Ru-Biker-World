import React from 'react';
import { FiTruck, FiExternalLink, FiCalendar, FiMapPin, FiShield } from 'react-icons/fi';

export const TrackingCard = ({ order, trackingData }) => {
  const tracking = trackingData?.tracking || order?.tracking || {};
  const status = trackingData?.orderStatus || order?.orderStatus || 'Pending';
  const orderNumber = trackingData?.orderNumber || order?.orderNumber;

  const isDispatched = ['Shipped', 'Out for Delivery', 'Delivered'].includes(status);

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <FiTruck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Live Shipment Tracking</h3>
            <p className="text-[11px] text-slate-400 font-mono">Order #{orderNumber}</p>
          </div>
        </div>

        <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-amber-100 text-amber-900">
          {status}
        </span>
      </div>

      {isDispatched ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase">Logistics Partner</div>
              <div className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5">
                {tracking.carrier || 'Delhivery Express'}
              </div>
            </div>

            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase">Airway Bill / Tracking No.</div>
              <div className="text-xs sm:text-sm font-black font-mono text-slate-900 mt-0.5">
                {tracking.trackingNumber || `DEL-${orderNumber?.replace('ORD-', '') || 'TRK9981'}`}
              </div>
            </div>

            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase">Est. Delivery Date</div>
              <div className="text-xs sm:text-sm font-bold text-emerald-600 mt-0.5 flex items-center gap-1">
                <FiCalendar className="w-3.5 h-3.5" />
                <span>
                  {tracking.estimatedDelivery
                    ? new Date(tracking.estimatedDelivery).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })
                    : '3–5 business days'}
                </span>
              </div>
            </div>
          </div>

          {tracking.trackingUrl && (
            <a
              href={tracking.trackingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-xs"
            >
              <span>Track on Courier Portal</span>
              <FiExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      ) : (
        <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-xl text-xs text-amber-800 space-y-1">
          <div className="font-bold flex items-center gap-1.5">
            <FiShield className="w-3.5 h-3.5 text-amber-600" />
            <span>Order Processing at Fulfillment Center</span>
          </div>
          <p className="text-[11px] text-amber-700">
            Shipment AWB number and live carrier tracking link will be activated immediately after the courier partner picks up your parcel.
          </p>
        </div>
      )}
    </div>
  );
};

export default TrackingCard;
