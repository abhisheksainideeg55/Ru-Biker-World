import React, { useState, useEffect } from 'react';
import {
  FiTruck,
  FiAlertCircle,
  FiPhoneCall,
  FiArrowRight,
  FiCheck
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import Container from '../../components/common/Container';
import { setPageMeta } from '../../utils/seo';

export const TrackOrderPage = () => {
  const [trackBy, setTrackBy] = useState('trackingNumber'); // 'orderId' or 'trackingNumber'
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [trackingResult, setTrackingResult] = useState(null);

  useEffect(() => {
    setPageMeta({
      title: 'Track Your Order – RU BIKER WORLD Logistics | Live Shipment Tracker',
      description:
        'Track your motorcycle parts and accessories order with real-time live dispatch and delivery updates powered by Prozo logistics for RU BIKER WORLD.',
      canonical: window.location.origin + '/track-order',
    });
    window.scrollTo(0, 0);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) {
      setError(`Please enter a valid ${trackBy === 'orderId' ? 'Order ID' : 'Tracking Number'}.`);
      return;
    }

    setIsLoading(true);
    setError(null);

    // Simulate real-time tracking lookup with Prozo logistics simulation / live fallback
    setTimeout(() => {
      setIsLoading(false);
      const cleanQ = query.trim().toUpperCase();

      setTrackingResult({
        identifier: cleanQ,
        type: trackBy === 'orderId' ? 'Order ID' : 'Tracking Number (AWB)',
        courier: 'Prozo Express Logistics (Bluedart Air)',
        awbNumber: trackBy === 'trackingNumber' ? cleanQ : `RUBW-84920481-IN`,
        orderId: trackBy === 'orderId' ? cleanQ : `RUBW-2026-${Math.floor(10000 + Math.random() * 90000)}`,
        status: 'In Transit',
        statusDescription: 'Package arrived at regional sorting hub and is scheduled for final dispatch.',
        origin: 'RU BIKER WORLD Fulfillment Hub, Bengaluru, KA',
        destination: 'Customer Address, Destination Hub',
        estimatedDelivery: 'Wednesday, Sep 30, 2026 (By 7:00 PM)',
        currentLocation: 'Bengaluru Central Logistics Hub',
        items: [
          { name: 'HJG 4-LED Fog Lamp Dual Projector Set (60W)', qty: 1 },
          { name: 'Waterproof Wiring Harness with Relay & Switch', qty: 1 },
        ],
        timeline: [
          {
            title: 'Delivered',
            time: 'Pending Delivery',
            location: 'Destination Address',
            completed: false,
            current: false,
          },
          {
            title: 'Out for Delivery',
            time: 'Expected by 10:00 AM, Sep 30',
            location: 'Local Delivery Station',
            completed: false,
            current: false,
          },
          {
            title: 'In Transit (Regional Hub)',
            time: 'Sep 28, 2026 • 09:15 AM',
            location: 'Central Logistics Hub, Bengaluru',
            completed: true,
            current: true,
          },
          {
            title: 'Dispatched from Warehouse',
            time: 'Sep 27, 2026 • 06:45 PM',
            location: 'RU BIKER WORLD Primary Fulfillment Center',
            completed: true,
            current: false,
          },
          {
            title: 'Order Verified & Packed',
            time: 'Sep 27, 2026 • 02:30 PM',
            location: 'RU BIKER WORLD Quality Inspection Bay',
            completed: true,
            current: false,
          },
          {
            title: 'Order Placed & Payment Confirmed',
            time: 'Sep 27, 2026 • 11:15 AM',
            location: 'RU BIKER WORLD Online Store',
            completed: true,
            current: false,
          },
        ],
      });
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-slate-900 pb-20 font-sans">
      {/* Top Header matching Screenshot */}
      <div className="bg-white border-b border-slate-200/80 py-4 px-4 sm:px-8 lg:px-12">
        <Container size="wide" className="flex items-center justify-between">
          {/* RU BIKER WORLD Brand Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="flex items-center font-black italic tracking-tighter text-xl sm:text-2xl">
              <span className="bg-[#f97316] text-white px-2.5 py-1 rounded-sm uppercase tracking-tight">
                RU BIKER WORLD
              </span>
            </div>
          </Link>

          {/* Powered by prozo branding */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium select-none">
            <span>Powered by</span>
            <span className="font-extrabold text-[#5b21b6] tracking-tight text-sm">prozo</span>
          </div>
        </Container>
      </div>

      {/* Main Track Order Container */}
      <Container size="wide" className="px-4 sm:px-8 lg:px-12 pt-8 sm:pt-12">
        {/* White Card with Top Blue Stripe matching Screenshot */}
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-xs border border-slate-200/80 overflow-hidden relative">
          {/* Top Blue Accent Bar */}
          <div className="h-1.5 w-full bg-[#3b82f6]" />

          <div className="p-6 sm:p-10">
            {/* Card Title */}
            <h1 className="text-xl sm:text-2xl font-bold text-[#1e293b] tracking-tight mb-2 font-sans">
              Track Your Order
            </h1>

            {/* Sub-label: Track By */}
            <div className="text-xs sm:text-sm text-[#0284c7] font-semibold mb-4">
              Track By
            </div>

            {/* Radio Options: Order ID vs Tracking Number */}
            <div className="flex items-center gap-8 mb-6 text-xs sm:text-sm font-medium text-slate-800 select-none">
              {/* Order ID Radio */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="trackType"
                  value="orderId"
                  checked={trackBy === 'orderId'}
                  onChange={() => {
                    setTrackBy('orderId');
                    setError(null);
                  }}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-300"
                />
                <span className={trackBy === 'orderId' ? 'font-bold text-black' : 'text-slate-600'}>
                  Order ID
                </span>
              </label>

              {/* Tracking Number Radio */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="trackType"
                  value="trackingNumber"
                  checked={trackBy === 'trackingNumber'}
                  onChange={() => {
                    setTrackBy('trackingNumber');
                    setError(null);
                  }}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-300"
                />
                <span className={trackBy === 'trackingNumber' ? 'font-bold text-black' : 'text-slate-600'}>
                  Tracking Number
                </span>
              </label>
            </div>

            {/* Error Message Alert */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
                <FiAlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Search Input and Button matching Screenshot */}
            <form onSubmit={handleSearch} className="mb-2">
              <div className="flex items-stretch border border-slate-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all shadow-2xs">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={
                    trackBy === 'trackingNumber'
                      ? 'Enter your tracking number'
                      : 'Enter your order ID (e.g., RUBW-10824)'
                  }
                  className="flex-1 px-4 py-3 bg-white text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`px-8 py-3 text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    query.trim()
                      ? 'bg-[#1e293b] hover:bg-black text-white'
                      : 'bg-[#e2e8f0] text-[#94a3b8] hover:bg-slate-300 hover:text-slate-700'
                  }`}
                >
                  {isLoading ? 'Searching...' : 'Search'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Live Tracking Result Details */}
        {trackingResult && (
          <div className="max-w-3xl mx-auto mt-8 bg-white rounded-xl shadow-xs border border-slate-200/80 p-6 sm:p-8 animate-fadeIn">
            {/* Status Summary Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[11px] font-bold uppercase tracking-wider mb-2">
                  <FiTruck className="w-3.5 h-3.5" />
                  <span>{trackingResult.status}</span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                  AWB: {trackingResult.awbNumber}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Order Reference: <span className="font-semibold text-slate-700">{trackingResult.orderId}</span> • Carrier: <span className="font-semibold text-slate-700">{trackingResult.courier}</span>
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-right sm:text-right shrink-0">
                <span className="text-[10px] font-bold text-slate-500 block uppercase tracking-wider">
                  Estimated Delivery
                </span>
                <span className="text-xs sm:text-sm font-extrabold text-emerald-600 block mt-0.5">
                  {trackingResult.estimatedDelivery}
                </span>
              </div>
            </div>

            {/* Milestone Progress Timeline */}
            <div className="py-8">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-6">
                Shipment Progress & Checkpoints
              </h3>

              <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-2.5 sm:before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {trackingResult.timeline.map((step, idx) => (
                  <div key={idx} className="relative flex items-start gap-4">
                    {/* Node Dot */}
                    <div
                      className={`absolute -left-6 sm:-left-8 top-1 w-5 h-5 sm:w-7 sm:h-7 rounded-full flex items-center justify-center border-2 ${
                        step.completed
                          ? step.current
                            ? 'bg-blue-600 border-blue-600 text-white ring-4 ring-blue-100'
                            : 'bg-emerald-500 border-emerald-500 text-white'
                          : 'bg-white border-slate-300 text-slate-300'
                      }`}
                    >
                      {step.completed ? (
                        <FiCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[3]" />
                      ) : (
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                      )}
                    </div>

                    {/* Step Info */}
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <span
                          className={`text-xs sm:text-sm font-bold ${
                            step.current
                              ? 'text-blue-600 font-extrabold'
                              : step.completed
                              ? 'text-slate-900'
                              : 'text-slate-400'
                          }`}
                        >
                          {step.title}
                        </span>
                        <span className="text-[11px] font-medium text-slate-400">
                          {step.time}
                        </span>
                      </div>
                      <span className="text-xs text-slate-500 block mt-0.5">
                        {step.location}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Help / Support Footer Bar */}
            <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <FiPhoneCall className="w-4 h-4 text-slate-400" />
                <span>Need delivery help? Call Support at <strong className="text-slate-900">+91 8105 00 3848</strong></span>
              </div>
              <a
                href="https://wa.me/918105003848?text=Hi%20RU%20Biker%20World,%20I%20need%20an%20update%20on%20my%20order"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 font-bold hover:underline inline-flex items-center gap-1"
              >
                <span>Live Chat on WhatsApp</span>
                <FiArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
};

export default TrackOrderPage;
