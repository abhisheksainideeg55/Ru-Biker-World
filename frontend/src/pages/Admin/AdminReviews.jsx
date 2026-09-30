import React, { useState } from 'react';
import {
  FiStar,
  FiCheck,
  FiX,
  FiTrash2,
  FiSearch,
  FiFilter,
  FiMessageSquare,
  FiUser,
  FiShield,
  FiCheckCircle
} from 'react-icons/fi';
import { useNotifications } from '../../hooks/useNotifications';

const INITIAL_REVIEWS = [
  {
    id: 'rev-1',
    productName: 'MT Thunder 4 SV Full Face Helmet - Matte Black',
    customerName: 'Aman Sharma',
    customerCity: 'New Delhi',
    bikeModel: 'Royal Enfield Continental GT 650',
    rating: 5,
    title: 'Top notch airflow and build quality!',
    comment: 'Super fast dispatch from RU BIKER world! The aerodynamic shape is great for highway speeds, zero neck fatigue. Highly recommended.',
    date: '2026-09-24',
    verifiedBuyer: true,
    status: 'approved', // 'approved' | 'pending' | 'rejected'
  },
  {
    id: 'rev-2',
    productName: 'Brembo Sintered Ceramic Brake Pads Front',
    customerName: 'Vikram Rajput',
    customerCity: 'Pune',
    bikeModel: 'KTM Duke 390',
    rating: 5,
    title: 'Insane bite compared to stock organic pads',
    comment: 'Fitted on my Duke 390. Braking distance reduced significantly without making any squeaking noise. 100% genuine Brembo parts.',
    date: '2026-09-22',
    verifiedBuyer: true,
    status: 'approved',
  },
  {
    id: 'rev-3',
    productName: 'Bobo Claw-Grip Mobile Mount with 15W Wireless Charger',
    customerName: 'Rahul Mehta',
    customerCity: 'Bangalore',
    bikeModel: 'Yamaha MT-15',
    rating: 4,
    title: 'Solid grip over potholes',
    comment: 'Vibration dampener works well on off-road trails. Wireless charging is quick enough for Google Maps navigation.',
    date: '2026-09-20',
    verifiedBuyer: true,
    status: 'approved',
  },
  {
    id: 'rev-4',
    productName: 'Motul 7100 10W-50 4T Fully Synthetic Engine Oil',
    customerName: 'Kunal Deshmukh',
    customerCity: 'Mumbai',
    bikeModel: 'Bajaj Dominar 400',
    rating: 5,
    title: 'Butter smooth gear shifts',
    comment: 'Engine heating is much lower now. Authentic QR code verified on Motul app.',
    date: '2026-09-18',
    verifiedBuyer: true,
    status: 'pending',
  }
];

export const AdminReviews = () => {
  const { addToast } = useNotifications() || {};
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredReviews = reviews.filter((r) => {
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        r.productName.toLowerCase().includes(q) ||
        r.customerName.toLowerCase().includes(q) ||
        r.comment.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleUpdateStatus = (id, newStatus) => {
    setReviews(
      reviews.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
    if (addToast) {
      addToast({
        type: newStatus === 'approved' ? 'success' : 'info',
        message: `Review ${newStatus === 'approved' ? 'Approved & Published' : 'Updated'}.`,
      });
    }
  };

  const handleDeleteReview = (id) => {
    setReviews(reviews.filter((r) => r.id !== id));
    if (addToast) addToast({ type: 'info', message: 'Review deleted.' });
  };

  return (
    <div className="space-y-6 animate-fadeIn font-sans">
      {/* ===================== PAGE HEADER ===================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FiMessageSquare className="w-5 h-5 text-amber-500" />
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Customer Ratings & Reviews Moderation
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-medium">
            Moderate bike parts feedback, verify buyer badges & ensure high authenticity
          </p>
        </div>
      </div>

      {/* ===================== FILTER CONTROLS ===================== */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              statusFilter === 'all'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Reviews ({reviews.length})
          </button>
          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              statusFilter === 'pending'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Pending ({reviews.filter((r) => r.status === 'pending').length})
          </button>
          <button
            onClick={() => setStatusFilter('approved')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              statusFilter === 'approved'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Approved ({reviews.filter((r) => r.status === 'approved').length})
          </button>
        </div>

        <div className="relative flex-1 max-w-sm">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by part, customer or keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-slate-800"
          />
        </div>
      </div>

      {/* ===================== REVIEWS LIST ===================== */}
      <div className="space-y-4">
        {filteredReviews.map((rev) => (
          <div
            key={rev.id}
            className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col md:flex-row md:items-start justify-between gap-5"
          >
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-sm">{rev.productName}</span>
                <span className="text-xs text-slate-400 font-mono">· {rev.date}</span>
              </div>

              {/* Stars & Rider Profile */}
              <div className="flex items-center gap-3">
                <div className="flex items-center text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <FiStar
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < rev.rating ? 'fill-current text-amber-400' : 'text-slate-200'
                      }`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-600">
                  <span className="font-semibold text-slate-800">{rev.customerName}</span>
                  {rev.bikeModel && (
                    <span className="text-slate-400">({rev.bikeModel})</span>
                  )}
                  {rev.verifiedBuyer && (
                    <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                      <FiCheckCircle className="w-3 h-3" />
                      <span>Verified Buyer</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Review Text */}
              <p className="text-xs font-bold text-slate-800 mt-1">{rev.title}</p>
              <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
            </div>

            {/* Status & Moderation Controls */}
            <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
              <span
                className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                  rev.status === 'approved'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : rev.status === 'pending'
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}
              >
                {rev.status}
              </span>

              <div className="flex items-center gap-1.5">
                {rev.status !== 'approved' && (
                  <button
                    onClick={() => handleUpdateStatus(rev.id, 'approved')}
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-2xs"
                  >
                    Approve
                  </button>
                )}
                {rev.status !== 'rejected' && (
                  <button
                    onClick={() => handleUpdateStatus(rev.id, 'rejected')}
                    className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
                  >
                    Reject
                  </button>
                )}
                <button
                  onClick={() => handleDeleteReview(rev.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                  title="Delete review"
                >
                  <FiTrash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminReviews;
