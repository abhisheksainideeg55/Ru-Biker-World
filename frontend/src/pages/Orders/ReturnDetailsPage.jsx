import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  FiArrowLeft,
  FiRotateCcw,
  FiCalendar,
  FiPackage,
  FiDollarSign,
  FiImage,
  FiAlertCircle,
  FiCheckCircle,
} from 'react-icons/fi';
import { AccountLayout } from '../../components/account';
import { returnService } from '../../services/returnService';
import { ReturnTimeline } from '../../components/order/ReturnTimeline';
import { useNotifications } from '../../hooks/useNotifications';

export const ReturnDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useNotifications() || {};

  const [returnReq, setReturnReq] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await returnService.getReturnById(id);
        if (res && res.data) {
          setReturnReq(res.data);
        } else {
          setError('Return request details not found.');
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch return details.');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleCancelReturn = async () => {
    if (!window.confirm('Are you sure you want to cancel this return request?')) return;

    setIsCancelling(true);
    try {
      const res = await returnService.cancelReturn(id);
      if (res && res.data) {
        setReturnReq(res.data);
        if (addToast) addToast({ type: 'info', message: 'Return request cancelled.' });
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to cancel return request.';
      if (addToast) addToast({ type: 'error', message: msg });
    } finally {
      setIsCancelling(false);
    }
  };

  if (isLoading) {
    return (
      <AccountLayout breadcrumbs={[{ label: 'Returns', path: '/account/returns' }, { label: 'Details' }]}>
        <div className="py-16 text-center space-y-3 bg-white rounded-2xl border border-slate-200">
          <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-slate-500">Loading return request...</p>
        </div>
      </AccountLayout>
    );
  }

  if (error || !returnReq) {
    return (
      <AccountLayout breadcrumbs={[{ label: 'Returns', path: '/account/returns' }, { label: 'Details' }]}>
        <div className="p-8 bg-white border border-slate-200 rounded-2xl text-center space-y-3">
          <FiAlertCircle className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">Return Request Not Found</h3>
          <p className="text-xs text-slate-500">{error || 'Unable to locate this return record.'}</p>
          <Link
            to="/account/returns"
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-xl inline-block"
          >
            Back to Returns
          </Link>
        </div>
      </AccountLayout>
    );
  }

  const canCancel = ['Requested', 'Under Review'].includes(returnReq.status);

  return (
    <AccountLayout
      breadcrumbs={[
        { label: 'Returns', path: '/account/returns' },
        { label: `Return #${returnReq._id.slice(-8).toUpperCase()}` },
      ]}
    >
      <div className="space-y-6">
        {/* Header Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              to="/account/returns"
              className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <FiArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black font-mono text-slate-900 font-display">
                  Return #{returnReq._id.slice(-8).toUpperCase()}
                </h1>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-900">
                  {returnReq.status}
                </span>
              </div>
              <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                <FiCalendar className="w-3.5 h-3.5" />
                <span>
                  Requested on{' '}
                  {new Date(returnReq.requestedAt || returnReq.createdAt).toLocaleDateString('en-IN', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {canCancel && (
              <button
                type="button"
                onClick={handleCancelReturn}
                disabled={isCancelling}
                className="px-3.5 py-2 text-rose-600 hover:bg-rose-50 text-xs font-bold rounded-xl border border-rose-200 transition-colors"
              >
                {isCancelling ? 'Cancelling...' : 'Cancel Return Request'}
              </button>
            )}

            {returnReq.order && (
              <Link
                to={`/account/orders/${returnReq.order._id || returnReq.order.orderNumber}`}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors"
              >
                View Order Details
              </Link>
            )}
          </div>
        </div>

        {/* Timeline & Summary Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7">
            <ReturnTimeline status={returnReq.status} />
          </div>

          <div className="lg:col-span-5 space-y-4">
            {/* Refund Calculation Card */}
            <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 pb-2 border-b border-slate-100">
                <FiDollarSign className="w-4 h-4 text-emerald-600" />
                <span>Refund Settlement Details</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Refund Method:</span>
                  <span className="font-bold text-slate-900 uppercase">
                    {returnReq.refundMethod === 'upi' ? 'UPI Transfer' : returnReq.refundMethod === 'bank_transfer' ? 'Bank Account Deposit' : 'Original Payment Source'}
                  </span>
                </div>
                {returnReq.bankDetails && returnReq.bankDetails.accountNumber && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Account Holder:</span>
                      <span className="font-semibold text-slate-900">{returnReq.bankDetails.accountHolderName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">A/C Number:</span>
                      <span className="font-mono font-bold text-slate-900">
                        •••• {returnReq.bankDetails.accountNumber.slice(-4)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">IFSC Code:</span>
                      <span className="font-mono font-bold text-slate-900">{returnReq.bankDetails.ifscCode}</span>
                    </div>
                  </>
                )}
                {returnReq.bankDetails && returnReq.bankDetails.upiId && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">UPI ID:</span>
                    <span className="font-mono font-bold text-slate-900">{returnReq.bankDetails.upiId}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-500">Refund Amount:</span>
                  <span className="font-extrabold text-slate-900 text-sm">
                    ₹{(returnReq.refundAmount || 0).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Status:</span>
                  <span className="font-bold text-amber-700">{returnReq.status}</span>
                </div>
              </div>

              {returnReq.adminNote && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                  <span className="font-bold text-slate-700 block">Support Note:</span>
                  <p className="text-slate-600">{returnReq.adminNote}</p>
                </div>
              )}
            </div>

            {/* Return Reason Breakdown */}
            <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Reason Details</h4>
              <p className="text-xs font-bold text-slate-900">{returnReq.reason}</p>
              {returnReq.description && (
                <p className="text-xs text-slate-600 italic bg-slate-50 p-3 rounded-xl border border-slate-100">
                  "{returnReq.description}"
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Returned Items */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
            Items Included in Return ({returnReq.items?.length || 0})
          </h3>

          <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
            {returnReq.items?.map((item, idx) => (
              <div key={idx} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <img
                    src={
                      item.product?.images?.[0]?.url ||
                      'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=160'
                    }
                    alt={item.product?.name || 'Product'}
                    className="w-12 h-12 object-cover rounded-xl bg-slate-50 border border-slate-200 shrink-0"
                  />
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                      {item.product?.name || 'Product Item'}
                    </h4>
                    <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                      Qty: {item.quantity} · Reason: {item.reason || returnReq.reason}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Uploaded Return Images */}
        {returnReq.images && returnReq.images.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <FiImage className="w-4 h-4 text-amber-500" />
              <span>Evidence Images Attached ({returnReq.images.length})</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {returnReq.images.map((imgUrl, i) => (
                <a
                  key={i}
                  href={imgUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="aspect-square rounded-xl overflow-hidden border border-slate-200 bg-slate-50 hover:opacity-90 transition-opacity"
                >
                  <img src={imgUrl} alt={`Evidence ${i + 1}`} className="w-full h-full object-cover" />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </AccountLayout>
  );
};

export default ReturnDetailsPage;
