import React, { useState } from 'react';
import {
  FiMapPin,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiCheckCircle,
  FiHome,
  FiBriefcase,
  FiPhone,
  FiX,
  FiAlertTriangle,
} from 'react-icons/fi';
import { AccountLayout } from '../../components/account';
import { AddressForm } from '../../components/forms';
import { useAddresses } from '../../hooks/useAddresses';

export const AddressesPage = () => {
  const {
    addresses,
    isLoading,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
  } = useAddresses();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [addressToDelete, setAddressToDelete] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenAdd = () => {
    setEditingAddress(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (addr) => {
    setEditingAddress(addr);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAddress(null);
  };

  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      if (editingAddress) {
        await updateAddress(editingAddress._id || editingAddress.id, formData);
      } else {
        await addAddress(formData);
      }
      handleCloseModal();
    } catch {
      // Handled by hook toasts
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!addressToDelete) return;
    setIsSubmitting(true);
    try {
      await deleteAddress(addressToDelete._id || addressToDelete.id);
      setAddressToDelete(null);
    } catch {
      // Handled by hook
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AccountLayout breadcrumbs={[{ label: 'Saved Addresses', path: null }]}>
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 sm:p-8">
        {/* Page Header */}
        <div className="flex items-center justify-between pb-5 border-b border-slate-100 mb-6 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-200/60">
              <FiMapPin className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-black text-slate-900 font-display">
                Delivery Addresses
              </h1>
              <p className="text-xs text-slate-500">
                Manage your home, workshop, and garage shipping destinations.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold rounded-xl shadow-glow transition-all duration-200 active:scale-[0.98]"
          >
            <FiPlus className="w-4 h-4 stroke-[3]" />
            <span>Add New Address</span>
          </button>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-pulse">
            <div className="h-44 bg-slate-100 rounded-2xl" />
            <div className="h-44 bg-slate-100 rounded-2xl" />
          </div>
        ) : addresses.length === 0 ? (
          /* Empty State */
          <div className="py-12 text-center max-w-sm mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <FiMapPin className="w-7 h-7" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              No saved addresses yet
            </h3>
            <p className="text-xs text-slate-500 mb-5 leading-relaxed">
              Add your delivery address to speed up order checkout and get accurate shipping estimates.
            </p>
            <button
              type="button"
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-surface-900 hover:bg-brand-600 text-white shadow-sm transition-colors"
            >
              <FiPlus className="w-4 h-4" />
              <span>Add Your First Address</span>
            </button>
          </div>
        ) : (
          /* Addresses Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-4">
            {addresses.map((addr) => {
              const addrId = addr._id || addr.id;
              return (
                <div
                  key={addrId}
                  className={`p-5 rounded-2xl border transition-all flex flex-col justify-between gap-4 ${
                    addr.isDefault
                      ? 'border-emerald-300 bg-emerald-50/20 shadow-2xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div>
                    {/* Card Top Row: Type & Default Badge */}
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200/60">
                        {addr.type === 'Home' && <FiHome className="w-3 h-3" />}
                        {addr.type === 'Work' && <FiBriefcase className="w-3 h-3" />}
                        {addr.type === 'Other' && <FiMapPin className="w-3 h-3" />}
                        <span>{addr.type || 'Home'}</span>
                      </span>

                      {addr.isDefault ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                          <FiCheckCircle className="w-3 h-3" />
                          <span>Default</span>
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setDefaultAddress(addrId)}
                          className="text-[11px] font-bold text-slate-500 hover:text-brand-600 hover:underline transition-colors"
                        >
                          Set as Default
                        </button>
                      )}
                    </div>

                    {/* Recipient Name */}
                    <h3 className="text-sm font-black text-slate-900">{addr.fullName}</h3>

                    {/* Address Text */}
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {addr.addressLine1 || addr.street}
                      {addr.addressLine2 && `, ${addr.addressLine2}`}
                      {addr.landmark && ` (Near ${addr.landmark})`}
                    </p>
                    <p className="text-xs font-semibold text-slate-700 mt-0.5">
                      {addr.city}, {addr.state} - {addr.postalCode || addr.pincode}
                    </p>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">
                      {addr.country || 'India'}
                    </p>

                    {/* Phone */}
                    <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium mt-3 pt-2 border-t border-slate-100">
                      <FiPhone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{addr.phone}</span>
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(addr)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 hover:text-brand-600 hover:bg-slate-50 transition-colors"
                    >
                      <FiEdit2 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAddressToDelete(addr)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      <FiTrash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add / Edit Address Modal */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn"
        >
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 animate-slideUp">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-900 font-display">
                  {editingAddress ? 'Edit Delivery Address' : 'Add New Delivery Address'}
                </h2>
                <p className="text-xs text-slate-500">
                  Please provide accurate Indian postal details for smooth delivery.
                </p>
              </div>
              <button
                type="button"
                onClick={handleCloseModal}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <AddressForm
              initialData={editingAddress}
              onSubmit={handleFormSubmit}
              onCancel={handleCloseModal}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {addressToDelete && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn"
        >
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md p-6 text-center animate-slideUp">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center mx-auto mb-3">
              <FiAlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-slate-900 font-display">
              Delete Delivery Address?
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Are you sure you want to delete the address for{' '}
              <strong className="text-slate-800">{addressToDelete.fullName}</strong>? This action cannot be undone.
            </p>

            <div className="flex items-center justify-center gap-3 pt-6">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => setAddressToDelete(null)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleConfirmDelete}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-sm flex items-center gap-1.5 transition-colors disabled:opacity-60"
              >
                <FiTrash2 className="w-4 h-4" />
                <span>{isSubmitting ? 'Deleting...' : 'Yes, Delete Address'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </AccountLayout>
  );
};

export default AddressesPage;
