import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Search,
  DollarSign,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Download,
  Filter,
  ArrowUpRight,
  ShieldCheck,
  X,
  RotateCcw,
  Clock,
  Check,
  XCircle,
  Eye,
  Truck,
  FileText,
  ChevronRight,
  MessageSquare
} from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications';
import { adminService } from '../../services/adminService';

const INITIAL_TRANSACTIONS = [
  {
    id: 'txn-9921',
    orderId: 'ORD-88219',
    customerName: 'Aman Sharma',
    customerEmail: 'aman.sharma@gmail.com',
    paymentMethod: 'UPI / Razorpay',
    amount: 14850,
    status: 'captured', // 'captured' | 'pending' | 'failed' | 'refunded'
    date: '2026-09-28 14:22',
    gatewayRef: 'pay_Nq28Y892019',
    cardBrand: 'HDFC UPI'
  },
  {
    id: 'txn-9920',
    orderId: 'ORD-88218',
    customerName: 'Vikram Rajput',
    customerEmail: 'vikram.r@gmail.com',
    paymentMethod: 'Credit Card',
    amount: 5400,
    status: 'captured',
    date: '2026-09-28 12:40',
    gatewayRef: 'pay_Nq27K102938',
    cardBrand: 'Visa **** 4242'
  },
  {
    id: 'txn-9919',
    orderId: 'ORD-88215',
    customerName: 'Sneha Patel',
    customerEmail: 'sneha.patel@outlook.com',
    paymentMethod: 'Net Banking',
    amount: 2890,
    status: 'failed',
    date: '2026-09-27 18:15',
    gatewayRef: 'pay_Nq26M998231',
    cardBrand: 'SBI NetBanking'
  },
  {
    id: 'txn-9918',
    orderId: 'ORD-88210',
    customerName: 'Karan Malhotra',
    customerEmail: 'karan.m@gmail.com',
    paymentMethod: 'Cash on Delivery',
    amount: 1250,
    status: 'pending',
    date: '2026-09-27 15:30',
    gatewayRef: 'COD-VERIFIED',
    cardBrand: 'COD'
  },
  {
    id: 'txn-9917',
    orderId: 'ORD-88204',
    customerName: 'Pooja Iyer',
    customerEmail: 'pooja.iyer@gmail.com',
    paymentMethod: 'UPI / PhonePe',
    amount: 3200,
    status: 'refunded',
    date: '2026-09-26 11:10',
    gatewayRef: 'rfnd_Nq25P001923',
    cardBrand: 'PhonePe UPI'
  }
];

export const AdminPayments = () => {
  const { addToast } = useNotifications() || {};

  // Active top tab: 'returns' or 'transactions'
  const [activeTab, setActiveTab] = useState('returns');

  // Transactions State
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [txnSearch, setTxnSearch] = useState('');
  const [txnStatusFilter, setTxnStatusFilter] = useState('all');
  const [selectedTxn, setSelectedTxn] = useState(null);
  const [txnRefundModal, setTxnRefundModal] = useState(null);
  const [txnRefundReason, setTxnRefundReason] = useState('');

  // Returns / Refunds State
  const [returnRequests, setReturnRequests] = useState([]);
  const [isLoadingReturns, setIsLoadingReturns] = useState(true);
  const [returnSearch, setReturnSearch] = useState('');
  const [returnStatusFilter, setReturnStatusFilter] = useState('all');

  // Modal States for Returns
  const [previewReturn, setPreviewReturn] = useState(null);
  const [actionModal, setActionModal] = useState(null); // { type: 'approve' | 'reject' | 'update' | 'refund', returnReq: object }
  const [actionNote, setActionNote] = useState('');
  const [actionStatus, setActionStatus] = useState('Approved');
  const [actionRefundAmount, setActionRefundAmount] = useState(0);
  const [isSubmittingAction, setIsSubmittingAction] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  // Load Return Requests from API / Service
  const loadReturns = async () => {
    setIsLoadingReturns(true);
    try {
      const data = await adminService.getReturns();
      if (Array.isArray(data)) {
        setReturnRequests(data);
      }
    } catch (e) {
      console.error('Failed to load return requests:', e);
    } finally {
      setIsLoadingReturns(false);
    }
  };

  useEffect(() => {
    loadReturns();
  }, []);

  // Return Request Metrics
  const totalReturnCount = returnRequests.length;
  const pendingReviewCount = returnRequests.filter(
    (r) => r.status === 'Requested' || r.status === 'Under Review'
  ).length;
  const approvedReturnsCount = returnRequests.filter(
    (r) => ['Approved', 'Pickup Scheduled', 'Received', 'Refund Processing'].includes(r.status)
  ).length;
  const totalRefundSettled = returnRequests
    .filter((r) => r.status === 'Refunded')
    .reduce((acc, r) => acc + (Number(r.refundAmount) || 0), 0);

  // Filtered Returns
  const filteredReturns = returnRequests.filter((r) => {
    if (returnStatusFilter !== 'all') {
      if (returnStatusFilter === 'pending') {
        if (!['Requested', 'Under Review'].includes(r.status)) return false;
      } else if (r.status.toLowerCase() !== returnStatusFilter.toLowerCase()) {
        return false;
      }
    }
    if (returnSearch.trim()) {
      const q = returnSearch.toLowerCase();
      const orderNum = (r.orderNumber || r.order?.orderNumber || '').toLowerCase();
      const retId = (r._id || '').toLowerCase();
      const customerName = (r.user?.name || '').toLowerCase();
      const customerEmail = (r.user?.email || '').toLowerCase();
      const reason = (r.reason || '').toLowerCase();
      return (
        orderNum.includes(q) ||
        retId.includes(q) ||
        customerName.includes(q) ||
        customerEmail.includes(q) ||
        reason.includes(q)
      );
    }
    return true;
  });

  // Action Handlers for Returns
  const handleOpenActionModal = (type, returnReq) => {
    setActionModal({ type, returnReq });
    setActionNote(returnReq.adminNote || '');
    setActionRefundAmount(returnReq.refundAmount || 0);

    if (type === 'approve') {
      setActionStatus('Approved');
    } else if (type === 'reject') {
      setActionStatus('Rejected');
    } else if (type === 'refund') {
      setActionStatus('Refunded');
    } else {
      setActionStatus(returnReq.status || 'Under Review');
    }
  };

  const handleConfirmReturnAction = async (e) => {
    e.preventDefault();
    if (!actionModal?.returnReq) return;

    setIsSubmittingAction(true);
    const returnId = actionModal.returnReq._id;

    try {
      const payload = {
        status: actionStatus,
        adminNote: actionNote.trim(),
        refundAmount: Number(actionRefundAmount),
      };

      await adminService.updateReturnStatus(returnId, payload);

      setReturnRequests((prev) =>
        prev.map((r) =>
          r._id === returnId
            ? {
                ...r,
                status: actionStatus,
                adminNote: actionNote.trim(),
                refundAmount: Number(actionRefundAmount),
                updatedAt: new Date().toISOString(),
              }
            : r
        )
      );

      // If refunded, also reflect on transactions if matching
      if (actionStatus === 'Refunded') {
        const orderNum = actionModal.returnReq.orderNumber || actionModal.returnReq.order?.orderNumber;
        setTransactions((prev) =>
          prev.map((t) =>
            t.orderId === orderNum ? { ...t, status: 'refunded' } : t
          )
        );
      }

      if (addToast) {
        addToast({
          type: 'success',
          message: `Return request #${returnId.slice(-8).toUpperCase()} updated to ${actionStatus}.`,
        });
      }

      setActionModal(null);
      if (previewReturn?._id === returnId) {
        setPreviewReturn((prev) => ({
          ...prev,
          status: actionStatus,
          adminNote: actionNote.trim(),
        }));
      }
    } catch (err) {
      if (addToast) {
        addToast({
          type: 'error',
          message: err.message || 'Failed to update return request.',
        });
      }
    } finally {
      setIsSubmittingAction(false);
    }
  };

  // Status Badge Styles for Returns
  const getReturnStatusBadge = (status) => {
    switch (status) {
      case 'Refunded':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Approved':
      case 'Received':
      case 'Pickup Scheduled':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Requested':
      case 'Under Review':
      case 'Refund Processing':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Rejected':
      case 'Cancelled':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  // Transactions calculations
  const totalCollected = transactions
    .filter((t) => t.status === 'captured')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalRefundedTxns = transactions
    .filter((t) => t.status === 'refunded')
    .reduce((acc, t) => acc + t.amount, 0);

  const filteredTransactions = transactions.filter((t) => {
    if (txnStatusFilter !== 'all' && t.status !== txnStatusFilter) return false;
    if (txnSearch.trim()) {
      const q = txnSearch.toLowerCase();
      return (
        t.id.toLowerCase().includes(q) ||
        t.orderId.toLowerCase().includes(q) ||
        t.customerName.toLowerCase().includes(q) ||
        t.gatewayRef.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleInitiateTxnRefund = (e) => {
    e.preventDefault();
    if (!txnRefundModal) return;

    setTransactions(
      transactions.map((t) =>
        t.id === txnRefundModal.id ? { ...t, status: 'refunded' } : t
      )
    );
    if (addToast) {
      addToast({
        type: 'success',
        message: `Refund of ₹${txnRefundModal.amount} initiated for ${txnRefundModal.orderId}.`,
      });
    }
    setTxnRefundModal(null);
    setTxnRefundReason('');
  };

  const handleExportCSV = () => {
    if (activeTab === 'returns') {
      const headers = ['ReturnID,OrderID,CustomerName,Email,Reason,RefundAmount,Status,RequestedDate,AdminNote'];
      const rows = returnRequests.map(
        (r) =>
          `"${r._id}","${r.orderNumber || r.order?.orderNumber}","${r.user?.name || 'Customer'}","${
            r.user?.email || ''
          }","${r.reason}","${r.refundAmount}","${r.status}","${r.createdAt || r.requestedAt}","${
            r.adminNote || ''
          }"`
      );
      const blob = new Blob([[headers, ...rows].join('\n')], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ru_biker_returns_${Date.now()}.csv`;
      a.click();
      if (addToast) addToast({ type: 'success', message: 'Exported return requests to CSV!' });
    } else {
      const headers = ['TransactionID,OrderID,Customer,Method,Amount,Status,Date,GatewayRef'];
      const rows = transactions.map(
        (t) =>
          `"${t.id}","${t.orderId}","${t.customerName}","${t.paymentMethod}","${t.amount}","${t.status}","${t.date}","${t.gatewayRef}"`
      );
      const blob = new Blob([[headers, ...rows].join('\n')], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ru_biker_payments_${Date.now()}.csv`;
      a.click();
      if (addToast) addToast({ type: 'success', message: 'Exported payments to CSV!' });
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn font-sans pb-12">
      {/* ===================== HEADER ===================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-emerald-600" />
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Payments, Refunds & Returns Control
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-medium">
            Manage customer return requests, review evidence, authorize refunds, and track gateway transactions
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadReturns}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors cursor-pointer"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* ===================== TOP NAVIGATION TABS ===================== */}
      <div className="flex items-center gap-3 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('returns')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'returns'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <RotateCcw className="w-4 h-4" />
          <span>Return & Refund Requests</span>
          {pendingReviewCount > 0 && (
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                activeTab === 'returns'
                  ? 'bg-amber-400 text-slate-950'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {pendingReviewCount} Pending
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('transactions')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'transactions'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Gateway Transactions & Settlements</span>
        </button>
      </div>

      {/* ===================== VIEW 1: RETURN & REFUND REQUESTS ===================== */}
      {activeTab === 'returns' && (
        <div className="space-y-6">
          {/* Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Total Return Requests
              </p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{totalReturnCount}</h3>
              <span className="text-[10px] text-slate-500 font-medium mt-1 inline-block">
                All time customer submissions
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <p className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">
                Pending Review
              </p>
              <h3 className="text-2xl font-bold text-amber-600 mt-1">{pendingReviewCount}</h3>
              <span className="text-[10px] text-amber-700 font-bold mt-1 inline-block">
                Requires Admin Action
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <p className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
                Approved / Logistics
              </p>
              <h3 className="text-2xl font-bold text-blue-700 mt-1">{approvedReturnsCount}</h3>
              <span className="text-[10px] text-blue-600 font-medium mt-1 inline-block">
                In pickup / inspection
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">
                Total Refunded Value
              </p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">
                ₹{totalRefundSettled.toLocaleString('en-IN')}
              </h3>
              <span className="text-[10px] text-emerald-600 font-medium mt-1 inline-block">
                Settled to Customer Source
              </span>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by Order #, Return ID, Customer, Reason..."
                value={returnSearch}
                onChange={(e) => setReturnSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-slate-800"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {[
                { label: 'All', value: 'all' },
                { label: 'Action Required', value: 'pending' },
                { label: 'Approved', value: 'Approved' },
                { label: 'Refunded', value: 'Refunded' },
                { label: 'Rejected', value: 'Rejected' },
              ].map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setReturnStatusFilter(tab.value)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    returnStatusFilter === tab.value
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Returns Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            {isLoadingReturns ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs font-bold text-slate-400">Loading Return & Refund requests...</p>
              </div>
            ) : filteredReturns.length === 0 ? (
              <div className="py-16 text-center space-y-2">
                <RotateCcw className="w-10 h-10 text-slate-300 mx-auto" />
                <h4 className="text-sm font-bold text-slate-700">No Return Requests Found</h4>
                <p className="text-xs text-slate-400">
                  {returnSearch ? 'Try clearing your search query.' : 'Customer return requests will appear here.'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                      <th className="py-3.5 px-5">Return Request</th>
                      <th className="py-3.5 px-5">Order Ref</th>
                      <th className="py-3.5 px-5">Customer</th>
                      <th className="py-3.5 px-5">Reason & Description</th>
                      <th className="py-3.5 px-5">Evidence</th>
                      <th className="py-3.5 px-5">Est. Refund (₹)</th>
                      <th className="py-3.5 px-5">Status</th>
                      <th className="py-3.5 px-5 text-right">Admin Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {filteredReturns.map((ret) => {
                      const orderNum = ret.orderNumber || ret.order?.orderNumber || 'ORD-REF';
                      const custName = ret.user?.name || 'Customer';
                      const custEmail = ret.user?.email || '';
                      const isPendingAction = ['Requested', 'Under Review'].includes(ret.status);

                      return (
                        <tr key={ret._id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3.5 px-5">
                            <div className="font-mono font-bold text-slate-900">
                              #{ret._id.slice(-8).toUpperCase()}
                            </div>
                            <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                              <Clock className="w-3 h-3" />
                              <span>
                                {new Date(ret.requestedAt || ret.createdAt).toLocaleDateString('en-IN', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                })}
                              </span>
                            </div>
                          </td>

                          <td className="py-3.5 px-5 font-mono text-emerald-600 font-semibold">
                            {orderNum}
                          </td>

                          <td className="py-3.5 px-5">
                            <div className="font-bold text-slate-900">{custName}</div>
                            <div className="text-[11px] text-slate-400">{custEmail}</div>
                          </td>

                          <td className="py-3.5 px-5 max-w-xs">
                            <div className="font-semibold text-slate-800">{ret.reason}</div>
                            {ret.description && (
                              <div className="text-[11px] text-slate-500 truncate mt-0.5" title={ret.description}>
                                "{ret.description}"
                              </div>
                            )}
                            {ret.adminNote && (
                              <div className="text-[10px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded mt-1 border border-amber-200/50">
                                <strong>Admin Note:</strong> {ret.adminNote}
                              </div>
                            )}
                          </td>

                          <td className="py-3.5 px-5">
                            {ret.images && ret.images.length > 0 ? (
                              <div className="flex items-center gap-1">
                                {ret.images.slice(0, 2).map((img, i) => (
                                  <img
                                    key={i}
                                    src={img}
                                    alt="Evidence"
                                    onClick={() => setPreviewImage(img)}
                                    className="w-8 h-8 object-cover rounded-lg border border-slate-200 cursor-pointer hover:opacity-80 transition-opacity"
                                  />
                                ))}
                                {ret.images.length > 2 && (
                                  <button
                                    onClick={() => setPreviewReturn(ret)}
                                    className="text-[10px] font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 px-1.5 py-1 rounded cursor-pointer"
                                  >
                                    +{ret.images.length - 2}
                                  </button>
                                )}
                              </div>
                            ) : (
                              <span className="text-[11px] text-slate-400 italic">None</span>
                            )}
                          </td>

                          <td className="py-3.5 px-5 font-bold text-slate-900 text-sm">
                            ₹{(ret.refundAmount || 0).toLocaleString('en-IN')}
                          </td>

                          <td className="py-3.5 px-5">
                            <span
                              className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getReturnStatusBadge(
                                ret.status
                              )}`}
                            >
                              {ret.status}
                            </span>
                          </td>

                          <td className="py-3.5 px-5 text-right">
                            <div className="inline-flex items-center gap-1.5 flex-wrap justify-end">
                              {/* Quick Approve button */}
                              {isPendingAction && (
                                <button
                                  onClick={() => handleOpenActionModal('approve', ret)}
                                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-all cursor-pointer inline-flex items-center gap-1"
                                  title="Approve Return"
                                >
                                  <Check className="w-3 h-3" />
                                  <span>Approve</span>
                                </button>
                              )}

                              {/* Quick Reject button */}
                              {isPendingAction && (
                                <button
                                  onClick={() => handleOpenActionModal('reject', ret)}
                                  className="px-2.5 py-1 text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-lg text-xs font-semibold transition-all cursor-pointer inline-flex items-center gap-1"
                                  title="Reject Return"
                                >
                                  <XCircle className="w-3 h-3" />
                                  <span>Reject</span>
                                </button>
                              )}

                              {/* Issue Direct Refund */}
                              {ret.status === 'Approved' && (
                                <button
                                  onClick={() => handleOpenActionModal('refund', ret)}
                                  className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-all cursor-pointer inline-flex items-center gap-1"
                                  title="Process Refund"
                                >
                                  <DollarSign className="w-3 h-3" />
                                  <span>Refund</span>
                                </button>
                              )}

                              {/* Update Status Dropdown Modal */}
                              <button
                                onClick={() => handleOpenActionModal('update', ret)}
                                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                                title="Update Status & Notes"
                              >
                                Update
                              </button>

                              {/* View Details */}
                              <button
                                onClick={() => setPreviewReturn(ret)}
                                className="p-1 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                                title="View Complete Details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===================== VIEW 2: GATEWAY TRANSACTIONS ===================== */}
      {activeTab === 'transactions' && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Collected Revenue
              </p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">
                ₹{totalCollected.toLocaleString('en-IN')}
              </h3>
              <span className="text-[10px] text-emerald-600 font-bold mt-1 inline-block">
                100% Settled
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Pending Settlement
              </p>
              <h3 className="text-2xl font-bold text-amber-600 mt-1">₹1,250</h3>
              <span className="text-[10px] text-slate-400 font-medium mt-1 inline-block">
                Cash on Delivery
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Failed Transactions
              </p>
              <h3 className="text-2xl font-bold text-rose-600 mt-1">
                {transactions.filter((t) => t.status === 'failed').length}
              </h3>
              <span className="text-[10px] text-rose-500 font-medium mt-1 inline-block">
                Card / Bank drops
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Total Refunded
              </p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">
                ₹{totalRefundedTxns.toLocaleString('en-IN')}
              </h3>
              <span className="text-[10px] text-blue-600 font-medium mt-1 inline-block">
                Processed to Source
              </span>
            </div>
          </div>

          {/* Search & Filter */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by Transaction ID, Order ID, Gateway ref..."
                value={txnSearch}
                onChange={(e) => setTxnSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-slate-800"
              />
            </div>

            <div className="flex items-center gap-2">
              {['all', 'captured', 'pending', 'failed', 'refunded'].map((st) => (
                <button
                  key={st}
                  onClick={() => setTxnStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all cursor-pointer ${
                    txnStatusFilter === st
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                    <th className="py-3.5 px-6">Transaction ID</th>
                    <th className="py-3.5 px-6">Order ID</th>
                    <th className="py-3.5 px-6">Customer</th>
                    <th className="py-3.5 px-6">Method & Gateway</th>
                    <th className="py-3.5 px-6">Amount (₹)</th>
                    <th className="py-3.5 px-6">Status</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredTransactions.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-6 font-mono font-bold text-slate-900">{t.id}</td>

                      <td className="py-3.5 px-6 font-mono text-emerald-600 font-semibold">
                        {t.orderId}
                      </td>

                      <td className="py-3.5 px-6">
                        <div className="font-bold text-slate-900">{t.customerName}</div>
                        <div className="text-[11px] text-slate-400">{t.customerEmail}</div>
                      </td>

                      <td className="py-3.5 px-6">
                        <div className="font-semibold text-slate-800">{t.paymentMethod}</div>
                        <div className="text-[11px] font-mono text-slate-400">{t.gatewayRef}</div>
                      </td>

                      <td className="py-3.5 px-6 font-bold text-slate-900 text-sm">
                        ₹{t.amount.toLocaleString('en-IN')}
                      </td>

                      <td className="py-3.5 px-6">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                            t.status === 'captured'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : t.status === 'pending'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : t.status === 'failed'
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : 'bg-blue-50 text-blue-700 border-blue-200'
                          }`}
                        >
                          {t.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-6 text-right">
                        <div className="inline-flex items-center gap-2">
                          {t.status === 'captured' && (
                            <button
                              onClick={() => setTxnRefundModal(t)}
                              className="px-2.5 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-lg transition-colors cursor-pointer"
                            >
                              Refund
                            </button>
                          )}
                          <button
                            onClick={() => setSelectedTxn(t)}
                            className="px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
                          >
                            Receipt
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ===================== MODAL: RETURN ACTION (APPROVE / REJECT / UPDATE / REFUND) ===================== */}
      {actionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-base text-slate-900">
                  {actionModal.type === 'approve'
                    ? 'Approve Return Request'
                    : actionModal.type === 'reject'
                    ? 'Reject Return Request'
                    : actionModal.type === 'refund'
                    ? 'Process Refund Settlement'
                    : 'Update Return Status & Notes'}
                </h3>
              </div>
              <button
                onClick={() => setActionModal(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Request Summary */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Return ID:</span>
                <span className="font-mono font-bold text-slate-900">
                  #{actionModal.returnReq._id.slice(-8).toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Order Number:</span>
                <span className="font-mono font-bold text-emerald-600">
                  {actionModal.returnReq.orderNumber || actionModal.returnReq.order?.orderNumber}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Customer:</span>
                <span className="font-bold text-slate-900">
                  {actionModal.returnReq.user?.name || 'Customer'} (
                  {actionModal.returnReq.user?.email || 'N/A'})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Reason:</span>
                <span className="font-semibold text-slate-800">
                  {actionModal.returnReq.reason}
                </span>
              </div>
            </div>

            <form onSubmit={handleConfirmReturnAction} className="space-y-4 text-xs">
              {/* Status Select */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Change Request Status *
                </label>
                <select
                  value={actionStatus}
                  onChange={(e) => setActionStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-slate-800"
                >
                  <option value="Requested">Requested (Pending Review)</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Approved">Approved (Schedule Pickup)</option>
                  <option value="Pickup Scheduled">Pickup Scheduled</option>
                  <option value="Received">Received at Warehouse</option>
                  <option value="Refund Processing">Refund Processing</option>
                  <option value="Refunded">Refunded (Settled)</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              {/* Refund Amount Input */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Refund Amount (₹)
                </label>
                <input
                  type="number"
                  value={actionRefundAmount}
                  onChange={(e) => setActionRefundAmount(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-800 focus:outline-none focus:border-slate-800"
                />
              </div>

              {/* Admin Note / Customer Feedback */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Admin Support Note / Rejection Reason (Visible in user timeline)
                </label>
                <textarea
                  rows={3}
                  value={actionNote}
                  onChange={(e) => setActionNote(e.target.value)}
                  placeholder={
                    actionStatus === 'Rejected'
                      ? 'e.g. Return rejected: Item was found outside policy return window or damaged by customer misuse.'
                      : actionStatus === 'Approved'
                      ? 'e.g. Return approved. Delhivery courier agent will collect the item in 24-48 hours.'
                      : 'Add support note, tracking courier details, or refund transaction ID...'
                  }
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-slate-800 resize-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActionModal(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingAction}
                  className={`px-5 py-2 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer ${
                    actionStatus === 'Rejected'
                      ? 'bg-rose-600 hover:bg-rose-700'
                      : actionStatus === 'Approved'
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : actionStatus === 'Refunded'
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-slate-900 hover:bg-slate-800'
                  }`}
                >
                  {isSubmittingAction
                    ? 'Saving...'
                    : actionStatus === 'Rejected'
                    ? 'Confirm Rejection'
                    : actionStatus === 'Approved'
                    ? 'Approve & Confirm'
                    : actionStatus === 'Refunded'
                    ? 'Authorize & Issue Refund'
                    : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================== MODAL: RETURN DETAILS PREVIEW ===================== */}
      {previewReturn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="w-full max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-base text-slate-900">
                  Return Request #{previewReturn._id.slice(-8).toUpperCase()}
                </h3>
              </div>
              <button
                onClick={() => setPreviewReturn(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Status Bar */}
            <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Status</span>
                <span
                  className={`inline-block px-2.5 py-0.5 mt-1 rounded-md text-[10px] font-bold uppercase border ${getReturnStatusBadge(
                    previewReturn.status
                  )}`}
                >
                  {previewReturn.status}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Order</span>
                <span className="font-mono font-bold text-emerald-600 text-xs">
                  {previewReturn.orderNumber || previewReturn.order?.orderNumber}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Refund Amount
                </span>
                <span className="font-black text-slate-900 text-sm">
                  ₹{(previewReturn.refundAmount || 0).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Customer & Issue Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-2xl space-y-1.5">
                <h4 className="font-bold text-slate-800">Customer Info</h4>
                <div className="text-slate-700 font-semibold">
                  {previewReturn.user?.name || 'Customer'}
                </div>
                <div className="text-slate-500">{previewReturn.user?.email || 'N/A'}</div>
                <div className="text-slate-500">{previewReturn.user?.phone || 'N/A'}</div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl space-y-1.5">
                <h4 className="font-bold text-slate-800">Return Reason</h4>
                <div className="text-slate-900 font-bold">{previewReturn.reason}</div>
                {previewReturn.description && (
                  <p className="text-slate-600 italic bg-white p-2 rounded-xl border border-slate-200">
                    "{previewReturn.description}"
                  </p>
                )}
              </div>
            </div>

            {/* Items for Return */}
            {previewReturn.items && previewReturn.items.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Requested Items ({previewReturn.items.length})
                </h4>
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
                  {previewReturn.items.map((it, idx) => (
                    <div key={idx} className="p-3 flex items-center justify-between gap-3 bg-white text-xs">
                      <div className="flex items-center gap-3">
                        <img
                          src={it.image || 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=80'}
                          alt={it.productName}
                          className="w-10 h-10 object-cover rounded-lg border border-slate-200"
                        />
                        <div>
                          <div className="font-bold text-slate-900">{it.productName || 'Product'}</div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            SKU: {it.SKU || 'N/A'} · Qty: {it.quantity || 1}
                          </div>
                        </div>
                      </div>
                      <div className="font-bold text-slate-900">
                        ₹{((it.unitPrice || 0) * (it.quantity || 1)).toLocaleString('en-IN')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Evidence Photos */}
            {previewReturn.images && previewReturn.images.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Evidence Photos ({previewReturn.images.length})
                </h4>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {previewReturn.images.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt={`Evidence ${i + 1}`}
                      onClick={() => setPreviewImage(img)}
                      className="w-full aspect-square object-cover rounded-xl border border-slate-200 cursor-pointer hover:opacity-90"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Refund Settlement Bank / UPI Details */}
            {previewReturn.bankDetails && (previewReturn.bankDetails.accountNumber || previewReturn.bankDetails.upiId) && (
              <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl space-y-2 text-xs">
                <div className="flex items-center justify-between pb-1 border-b border-emerald-200/60">
                  <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-emerald-600" />
                    <span>Customer Refund Bank Details</span>
                  </span>
                  <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    {previewReturn.refundMethod || 'Bank Deposit'}
                  </span>
                </div>

                {previewReturn.bankDetails.accountNumber && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-emerald-900 pt-1">
                    <div>
                      <span className="text-emerald-700 block text-[10px]">A/C Holder Name:</span>
                      <strong>{previewReturn.bankDetails.accountHolderName || previewReturn.user?.name}</strong>
                    </div>
                    <div>
                      <span className="text-emerald-700 block text-[10px]">Account Number:</span>
                      <strong className="font-mono">{previewReturn.bankDetails.accountNumber}</strong>
                    </div>
                    <div>
                      <span className="text-emerald-700 block text-[10px]">IFSC Code:</span>
                      <strong className="font-mono">{previewReturn.bankDetails.ifscCode}</strong>
                    </div>
                    {previewReturn.bankDetails.bankName && (
                      <div>
                        <span className="text-emerald-700 block text-[10px]">Bank / Branch:</span>
                        <span>{previewReturn.bankDetails.bankName}</span>
                      </div>
                    )}
                  </div>
                )}

                {previewReturn.bankDetails.upiId && (
                  <div className="text-emerald-900 pt-1">
                    <span className="text-emerald-700 block text-[10px]">UPI ID / VPA:</span>
                    <strong className="font-mono text-sm">{previewReturn.bankDetails.upiId}</strong>
                  </div>
                )}
              </div>
            )}

            {/* Admin Note if any */}
            {previewReturn.adminNote && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs space-y-1">
                <span className="font-bold text-amber-900">Current Support Note:</span>
                <p className="text-amber-800">{previewReturn.adminNote}</p>
              </div>
            )}

            {/* Actions in Footer */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => setPreviewReturn(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Close
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const ret = previewReturn;
                    setPreviewReturn(null);
                    handleOpenActionModal('reject', ret);
                  }}
                  className="px-3.5 py-2 text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Reject
                </button>
                <button
                  onClick={() => {
                    const ret = previewReturn;
                    setPreviewReturn(null);
                    handleOpenActionModal('approve', ret);
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                >
                  Approve Return
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================== MODAL: IMAGE PREVIEW ===================== */}
      {previewImage && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 animate-fadeIn"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-3xl max-h-[85vh] bg-white rounded-2xl overflow-hidden p-2">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-3 right-3 p-1.5 bg-black/70 hover:bg-black text-white rounded-full cursor-pointer z-10"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={previewImage}
              alt="Evidence Full View"
              className="max-h-[80vh] w-auto object-contain rounded-xl"
            />
          </div>
        </div>
      )}

      {/* ===================== MODAL: TXN REFUND ===================== */}
      {txnRefundModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-lg text-slate-900">Initiate Gateway Refund</h3>
              <button
                onClick={() => setTxnRefundModal(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleInitiateTxnRefund} className="mt-4 space-y-4 text-xs">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900">
                Are you sure you want to refund <strong>₹{txnRefundModal.amount}</strong> to{' '}
                <strong>{txnRefundModal.customerName}</strong> for Order #{txnRefundModal.orderId}?
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Reason for Refund
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Customer return approved or cancellation"
                  value={txnRefundReason}
                  onChange={(e) => setTxnRefundReason(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-slate-800"
                  required
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setTxnRefundModal(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-xs cursor-pointer"
                >
                  Confirm & Process Refund
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================== MODAL: TXN RECEIPT ===================== */}
      {selectedTxn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-base text-slate-900">Payment Gateway Receipt</h3>
              </div>
              <button
                onClick={() => setSelectedTxn(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-400 font-medium">Transaction ID</span>
                <span className="font-mono font-bold text-slate-900">{selectedTxn.id}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-400 font-medium">Order Number</span>
                <span className="font-mono font-bold text-emerald-600">{selectedTxn.orderId}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-400 font-medium">Customer</span>
                <span className="font-bold text-slate-900">{selectedTxn.customerName}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-400 font-medium">Method</span>
                <span className="font-semibold text-slate-800">{selectedTxn.paymentMethod}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-400 font-medium">Gateway Reference</span>
                <span className="font-mono text-slate-600">{selectedTxn.gatewayRef}</span>
              </div>
              <div className="flex justify-between py-2 bg-slate-50 px-3 rounded-xl">
                <span className="font-bold text-slate-800">Total Settled Amount</span>
                <span className="font-bold text-slate-900 text-sm">
                  ₹{selectedTxn.amount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedTxn(null)}
                className="px-5 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPayments;
