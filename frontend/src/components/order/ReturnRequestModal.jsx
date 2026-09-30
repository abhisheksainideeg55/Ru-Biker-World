import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiRotateCcw,
  FiUploadCloud,
  FiTrash2,
  FiAlertCircle,
  FiCreditCard,
  FiDollarSign,
  FiCheckCircle,
  FiInfo
} from 'react-icons/fi';
import Modal from '../common/Modal';
import { useReturns } from '../../hooks/useReturns';

export const ReturnRequestModal = ({ order, isOpen, onClose, onSuccess }) => {
  const navigate = useNavigate();
  const { submitReturn } = useReturns();

  const [selectedItems, setSelectedItems] = useState(() => {
    // Default to first item selected
    if (order?.items && order.items.length > 0) {
      return [{ orderItemId: order.items[0]._id, quantity: 1, productId: order.items[0].productId }];
    }
    return [];
  });

  const [reason, setReason] = useState('Wrong Product Delivered');
  const [description, setDescription] = useState('Wrong product delivered');
  const [images, setImages] = useState([]);

  // Bank / Refund Details State
  const [refundPreference, setRefundPreference] = useState('bank_account'); // 'bank_account' | 'upi'
  const [accountHolderName, setAccountHolderName] = useState(
    order?.shippingAddress?.fullName || 'Abhishek Saini'
  );
  const [accountNumber, setAccountNumber] = useState('');
  const [confirmAccountNumber, setConfirmAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [bankName, setBankName] = useState('');
  const [upiId, setUpiId] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const returnReasons = [
    'Wrong Product Delivered',
    'Damaged in Transit',
    'Missing Parts or Hardware',
    'Product Not as Expected',
    'Defective or Malfunctioning',
    'Incompatible with Bike Model',
    'Other',
  ];

  const handleToggleItem = (orderItem) => {
    const exists = selectedItems.find((it) => it.orderItemId === orderItem._id);
    if (exists) {
      if (selectedItems.length > 1) {
        setSelectedItems(selectedItems.filter((it) => it.orderItemId !== orderItem._id));
      }
    } else {
      setSelectedItems([
        ...selectedItems,
        { orderItemId: orderItem._id, quantity: orderItem.quantity || 1, productId: orderItem.productId },
      ]);
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 5) {
      setError('You can upload a maximum of 5 evidence photos.');
      return;
    }

    files.forEach((file) => {
      if (file.size > 2 * 1024 * 1024) {
        setError(`File ${file.name} exceeds 2MB limit.`);
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index) => {
    setImages(images.filter((_, idx) => idx !== index));
  };

  const calculateTotalRefund = () => {
    if (!order?.items) return 0;
    return selectedItems.reduce((acc, sel) => {
      const oItem = order.items.find((it) => it._id === sel.orderItemId);
      if (oItem) {
        return acc + (Number(oItem.unitPrice || oItem.price || 0) * (sel.quantity || 1));
      }
      return acc;
    }, 0) || Number(order.grandTotal || 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!order || selectedItems.length === 0) {
      setError('Please select at least one item to return.');
      return;
    }

    const finalDesc = description.trim() || reason;

    // Smart Validation: Detect if user put UPI ID in Account Number or vice versa
    let finalPreference = refundPreference;
    let finalAccNum = accountNumber.trim();
    let finalUpi = upiId.trim();

    if (finalAccNum.includes('@') && !finalUpi) {
      finalUpi = finalAccNum;
      finalPreference = 'upi';
    }

    if (finalPreference === 'bank_account') {
      if (!finalAccNum) {
        setError('Please enter your Bank Account Number or UPI ID.');
        return;
      }
      // If confirm account number is provided and differs, warn only if user actually typed a different number
      if (confirmAccountNumber.trim() && confirmAccountNumber.trim() !== finalAccNum) {
        setError('Bank Account Number and Confirm Account Number do not match.');
        return;
      }
      if (!ifscCode.trim()) {
        setError('Please enter your Bank IFSC code (e.g. BARB0... or HDFC0...).');
        return;
      }
    } else if (finalPreference === 'upi') {
      if (!finalUpi) {
        setError('Please enter your UPI ID (e.g. yourname@upi, 9876543210@paytm).');
        return;
      }
    }

    setIsSubmitting(true);

    const bankDetailsPayload = {
      refundPreference: finalPreference,
      accountHolderName: accountHolderName.trim() || 'Customer',
      accountNumber: finalAccNum,
      ifscCode: ifscCode.trim().toUpperCase(),
      bankName: bankName.trim(),
      upiId: finalUpi,
    };

    const res = await submitReturn({
      orderId: order.orderNumber || order._id,
      items: selectedItems,
      reason,
      description: finalDesc,
      images,
      bankDetails: bankDetailsPayload,
      refundMethod: finalPreference === 'upi' ? 'upi' : 'bank_transfer',
    });

    setIsSubmitting(false);

    if (res && res.success) {
      onSuccess && onSuccess();
      // Navigate directly to /account/returns so customer sees their request
      navigate('/account/returns');
    } else {
      setError(res?.message || 'Failed to submit return request. Please check all details.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Request Product Return & Refund"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1 text-xs">
        {/* Top Error Alert */}
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl font-semibold flex items-center gap-2">
            <FiAlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Item Selection */}
        <div>
          <label className="font-bold text-slate-800 block mb-1.5">
            Select Item(s) to Return *
          </label>
          <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl max-h-44 overflow-y-auto">
            {order?.items?.map((item) => {
              const isSelected = !!selectedItems.find((it) => it.orderItemId === item._id || it.productId === item.productId);
              return (
                <div
                  key={item._id || item.productId}
                  onClick={() => handleToggleItem(item)}
                  className={`p-3 flex items-center justify-between cursor-pointer transition-colors ${
                    isSelected ? 'bg-amber-50/50' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleToggleItem(item)}
                      className="w-4 h-4 text-amber-600 rounded border-slate-300 focus:ring-amber-500 cursor-pointer"
                    />
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=80'}
                      alt={item.productName}
                      className="w-10 h-10 object-cover rounded-lg bg-white border border-slate-200"
                    />
                    <div>
                      <div className="font-bold text-slate-800 line-clamp-1">{item.productName}</div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        SKU: {item.SKU || 'N/A'} · Qty: {item.quantity || 1}
                      </div>
                    </div>
                  </div>

                  <div className="font-extrabold text-slate-900">
                    ₹{((Number(item.unitPrice || item.price || 0)) * (item.quantity || 1)).toLocaleString('en-IN')}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Reason Dropdown */}
        <div>
          <label className="font-bold text-slate-800 block mb-1.5">
            Primary Return Reason *
          </label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
          >
            {returnReasons.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        {/* Detailed Description */}
        <div>
          <label className="font-bold text-slate-800 block mb-1.5">
            Detailed Issue Description *
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            placeholder="Please describe the defect, damage, or discrepancy in detail..."
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 resize-none"
          />
        </div>

        {/* Evidence Image Uploads */}
        <div>
          <label className="font-bold text-slate-800 block mb-1.5">
            Attach Evidence Photos (Optional, up to 5 photos)
          </label>
          <div className="flex items-center gap-2 flex-wrap">
            {images.map((img, idx) => (
              <div key={idx} className="relative w-14 h-14 rounded-lg overflow-hidden border border-slate-300">
                <img src={img} alt={`Evidence ${idx + 1}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="absolute top-1 right-1 p-1 bg-black/70 hover:bg-black text-white rounded-full cursor-pointer"
                >
                  <FiTrash2 className="w-2.5 h-2.5" />
                </button>
              </div>
            ))}

            {images.length < 5 && (
              <label className="w-14 h-14 rounded-lg border-2 border-dashed border-slate-300 hover:border-amber-500 hover:bg-amber-50 flex flex-col items-center justify-center cursor-pointer text-slate-400 hover:text-amber-600 transition-colors">
                <FiUploadCloud className="w-4 h-4" />
                <span className="text-[9px] font-bold mt-0.5">+ Photo</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        {/* ===================== REFUND DESTINATION & BANK DETAILS ===================== */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <FiCreditCard className="w-4 h-4 text-emerald-600" />
              <span>Refund Payment Destination (Bank Details)</span>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
              Direct Deposit
            </span>
          </div>

          <p className="text-[11px] text-slate-500">
            Approved refund will be transferred directly to your bank account or UPI ID.
          </p>

          {/* Refund Method Toggle */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setRefundPreference('bank_account')}
              className={`flex-1 py-2 px-3 rounded-xl font-bold transition-all border cursor-pointer ${
                refundPreference === 'bank_account'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              Bank Account Transfer
            </button>
            <button
              type="button"
              onClick={() => setRefundPreference('upi')}
              className={`flex-1 py-2 px-3 rounded-xl font-bold transition-all border cursor-pointer ${
                refundPreference === 'upi'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              UPI ID / VPA
            </button>
          </div>

          {/* Bank Account Fields */}
          {refundPreference === 'bank_account' ? (
            <div className="space-y-3 pt-1">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Account Holder Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Abhishek Saini"
                  value={accountHolderName}
                  onChange={(e) => setAccountHolderName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Bank Account Number *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Account Number or UPI"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="w-full px-3 py-2 font-mono bg-white border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Confirm Account Number (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Confirm Account Number"
                    value={confirmAccountNumber}
                    onChange={(e) => setConfirmAccountNumber(e.target.value)}
                    className="w-full px-3 py-2 font-mono bg-white border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    IFSC Code *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. BARB0... or HDFC0..."
                    value={ifscCode}
                    onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 font-mono font-bold uppercase bg-white border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    maxLength={14}
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Bank & Branch Name (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Bank of Baroda"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>
              </div>
            </div>
          ) : (
            /* UPI Details Field */
            <div className="space-y-3 pt-1">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  UPI ID / Virtual Payment Address (VPA) *
                </label>
                <input
                  type="text"
                  placeholder="e.g. 9876543210@upi, abhisheksaini@okhdfcbank, name@paytm"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value.trim())}
                  className="w-full px-3 py-2 font-mono bg-white border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  required
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Refund will be credited instantly to your linked bank account via UPI.
                </span>
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Payee Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Abhishek Saini"
                  value={accountHolderName}
                  onChange={(e) => setAccountHolderName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Refund Estimation Banner */}
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
          <div>
            <div className="font-bold text-emerald-950">Estimated Refund Amount:</div>
            <div className="text-[11px] text-emerald-700">
              {refundPreference === 'upi' ? 'Transfer to UPI ID upon verification' : 'Transfer to Bank Account upon verification'}
            </div>
          </div>
          <div className="text-base font-black text-emerald-900">
            ₹{calculateTotalRefund().toLocaleString('en-IN')}
          </div>
        </div>

        {/* Bottom Error Alert right above button */}
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl font-semibold flex items-center gap-2">
            <FiAlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || selectedItems.length === 0}
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl shadow-xs transition-colors cursor-pointer text-xs"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Return & Refund Request'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ReturnRequestModal;
