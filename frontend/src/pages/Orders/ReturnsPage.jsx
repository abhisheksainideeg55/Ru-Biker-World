import React from 'react';
import { Link } from 'react-router-dom';
import { AccountLayout } from '../../components/account';
import { useReturns } from '../../hooks/useReturns';
import EmptyState from '../../components/common/EmptyState';
import { FiRotateCcw, FiCalendar, FiChevronRight, FiPackage, FiCheckCircle, FiClock, FiXCircle } from 'react-icons/fi';

export const ReturnsPage = () => {
  const { returns, isLoading, error, refetch, cancelReturnRequest } = useReturns();

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Refunded':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Approved':
      case 'Received':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Requested':
      case 'Under Review':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Rejected':
      case 'Cancelled':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <AccountLayout breadcrumbs={[{ label: 'Returns & Refunds', path: null }]}>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-5 sm:p-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 border border-orange-200/60">
              <FiRotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-black text-slate-900 font-display">
                Return & Replacement Requests
              </h1>
              <p className="text-xs text-slate-500">
                Track return status, pickup logistics, and source refund settlements.
              </p>
            </div>
          </div>

          <Link
            to="/account/orders"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors"
          >
            <FiPackage className="w-3.5 h-3.5" />
            <span>My Orders</span>
          </Link>
        </div>

        {/* Returns List */}
        {isLoading ? (
          <div className="py-16 text-center space-y-3 bg-white rounded-2xl border border-slate-200">
            <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-bold text-slate-500">Loading your return requests...</p>
          </div>
        ) : error ? (
          <div className="p-6 bg-white border border-rose-200 rounded-2xl text-center space-y-2">
            <FiXCircle className="w-8 h-8 text-rose-500 mx-auto" />
            <p className="text-xs text-rose-700 font-bold">{error}</p>
            <button
              onClick={refetch}
              className="text-xs font-bold text-amber-600 hover:underline"
            >
              Try Again
            </button>
          </div>
        ) : returns.length === 0 ? (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200/60">
                <FiRotateCcw className="w-8 h-8" />
              </div>
              <div className="space-y-1 max-w-md mx-auto">
                <h3 className="text-base font-bold text-slate-900">No active return requests</h3>
                <p className="text-xs text-slate-500">
                  You have not initiated any return or replacement requests for your delivered purchases.
                </p>
              </div>

              <div className="pt-2">
                <Link
                  to="/account/orders"
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                >
                  <FiPackage className="w-4 h-4" />
                  <span>View Delivered Orders to Return</span>
                </Link>
              </div>
            </div>

            {/* How returns work step by step */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                How Returns & Refunds Work (3 Simple Steps)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                  <div className="w-6 h-6 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-[11px]">
                    1
                  </div>
                  <h5 className="font-bold text-slate-900">Go to My Orders</h5>
                  <p className="text-slate-500 text-[11px]">
                    Open your delivered order from the My Orders section and click the <strong>"Return"</strong> button.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                  <div className="w-6 h-6 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-[11px]">
                    2
                  </div>
                  <h5 className="font-bold text-slate-900">Fill Return Form</h5>
                  <p className="text-slate-500 text-[11px]">
                    Select items to return, choose the reason, upload package photos, and submit your request.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                  <div className="w-6 h-6 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-[11px]">
                    3
                  </div>
                  <h5 className="font-bold text-slate-900">Pickup & Refund</h5>
                  <p className="text-slate-500 text-[11px]">
                    Our courier picks up the product, and refund is reversed directly to your original payment source.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {returns.map((ret) => {
              const orderNumber = ret.order?.orderNumber || 'Order Reference';
              const canCancel = ['Requested', 'Under Review'].includes(ret.status);

              return (
                <div
                  key={ret._id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-card p-5 sm:p-6 transition-all hover:border-slate-300 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-slate-400">
                          ID: {ret._id.slice(-8).toUpperCase()}
                        </span>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md border ${getStatusBadge(
                            ret.status
                          )}`}
                        >
                          {ret.status}
                        </span>
                      </div>
                      <div className="text-xs font-black text-slate-900 mt-1">
                        Order #{orderNumber}
                      </div>
                    </div>

                    <div className="text-xs text-slate-500 flex items-center gap-1">
                      <FiCalendar className="w-3.5 h-3.5" />
                      <span>
                        Requested{' '}
                        {new Date(ret.requestedAt || ret.createdAt).toLocaleDateString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Return Items & Reason Summary */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="text-xs text-slate-600">
                        <span className="font-semibold text-slate-800">Reason: </span>
                        {ret.reason}
                      </div>
                      <div className="text-xs text-slate-500">
                        <span className="font-semibold">Items for Return: </span>
                        {ret.items?.map((it) => `${it.product?.name || 'Product'} (Qty: ${it.quantity})`).join(', ') || '1 Item'}
                      </div>
                    </div>

                    <div className="text-left sm:text-right">
                      <div className="text-[10px] uppercase font-bold text-slate-400">Est. Refund Amount</div>
                      <div className="text-base font-black text-slate-900">
                        ₹{(ret.refundAmount || 0).toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                    {canCancel && (
                      <button
                        type="button"
                        onClick={() => cancelReturnRequest(ret._id)}
                        className="px-3 py-1.5 text-rose-600 hover:bg-rose-50 text-xs font-bold rounded-xl border border-rose-200 transition-colors"
                      >
                        Cancel Return
                      </button>
                    )}
                    <Link
                      to={`/account/returns/${ret._id}`}
                      className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl inline-flex items-center gap-1.5 transition-colors shadow-xs"
                    >
                      <span>View Return</span>
                      <FiChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AccountLayout>
  );
};

export default ReturnsPage;
