import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AccountLayout } from '../../components/account';
import { OrderProvider, OrderContext } from '../../context/OrderContext';
import { useOrders } from '../../hooks/useOrders';
import { OrderCard, OrderCardSkeleton } from '../../components/order';
import Pagination from '../../components/common/Pagination';
import EmptyState from '../../components/common/EmptyState';
import { FiPackage, FiSearch, FiShoppingBag, FiTruck } from 'react-icons/fi';

const OrdersListContent = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialStatus = searchParams.get('status') || 'All';
  const initialPage = parseInt(searchParams.get('page'), 10) || 1;
  const initialSearch = searchParams.get('search') || '';

  const {
    orders,
    pagination,
    selectedStatus,
    setSelectedStatus,
    searchQuery,
    setSearchQuery,
    isLoading,
    fetchOrders,
    refreshOrders,
  } = useOrders();

  const [localSearch, setLocalSearch] = useState(initialSearch);

  const tabs = [
    { label: 'All Orders', value: 'All' },
    { label: 'Pending', value: 'Pending' },
    { label: 'Processing', value: 'Processing' },
    { label: 'Shipped', value: 'Shipped' },
    { label: 'Delivered', value: 'Delivered' },
    { label: 'Cancelled', value: 'Cancelled' },
    { label: 'Returns', value: 'Return Requested' },
  ];

  useEffect(() => {
    setSelectedStatus(initialStatus);
    setSearchQuery(initialSearch);
    fetchOrders({ page: initialPage, status: initialStatus, search: initialSearch });
  }, [initialStatus, initialPage, initialSearch, setSelectedStatus, setSearchQuery, fetchOrders]);

  const handleTabChange = (status) => {
    setSelectedStatus(status);
    setSearchParams({ status, page: '1', ...(searchQuery ? { search: searchQuery } : {}) });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchQuery(localSearch);
    setSearchParams({
      status: selectedStatus,
      page: '1',
      ...(localSearch ? { search: localSearch } : {}),
    });
  };

  const handlePageChange = (newPage) => {
    setSearchParams({
      status: selectedStatus,
      page: String(newPage),
      ...(searchQuery ? { search: searchQuery } : {}),
    });
  };

  return (
    <AccountLayout breadcrumbs={[{ label: 'My Orders', path: null }]}>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-200/60">
              <FiPackage className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-black text-slate-900 font-display">
                My Orders & Purchases
              </h1>
              <p className="text-xs text-slate-500">
                Track status history, download invoices, request cancellations, or reorder parts.
              </p>
            </div>
          </div>

          {/* Order Search Bar */}
          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-64">
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Search by Order # or item..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
            <FiSearch className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </form>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar border-b border-slate-200">
          {tabs.map((tab) => {
            const isActive = selectedStatus === tab.value;
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => handleTabChange(tab.value)}
                className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all select-none ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 bg-white'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Orders List */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <OrderCardSkeleton key={i} />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8">
            <EmptyState
              icon={FiShoppingBag}
              title={selectedStatus === 'All' ? 'No Orders Yet' : `No ${selectedStatus} Orders Found`}
              description="Explore genuine motorcycle components, maintenance kits, and accessories."
              actionLabel="Explore Shop"
              onAction={() => (window.location.href = '/shop')}
            />
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <OrderCard
                key={order._id || order.orderNumber}
                order={order}
                onOrderUpdated={refreshOrders}
              />
            ))}

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="pt-4 flex justify-center">
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </AccountLayout>
  );
};

export const OrdersPage = () => {
  return (
    <OrderProvider>
      <OrdersListContent />
    </OrderProvider>
  );
};

export default OrdersPage;
