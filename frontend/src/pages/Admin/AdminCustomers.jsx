import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Mail,
  Phone,
  Calendar,
  ShoppingBag,
  DollarSign,
  UserCheck,
  UserX,
  FileText,
  Download,
  Eye,
  MapPin,
  Star,
  Shield,
  X
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { useNotifications } from '../../hooks/useNotifications';

export const AdminCustomers = () => {
  const { addToast } = useNotifications() || {};
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const data = await adminService.getUsers();
      setCustomers(data || []);
    } catch (e) {
      console.error('Failed to load customers:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleToggleStatus = async (customer) => {
    const newStatus = !customer.isActive;
    try {
      await adminService.updateUser(customer.id || customer._id, { isActive: newStatus });
      setCustomers(
        customers.map((c) =>
          (c.id || c._id) === (customer.id || customer._id) ? { ...c, isActive: newStatus } : c
        )
      );
      if (addToast) {
        addToast({
          type: 'success',
          message: `Customer account ${newStatus ? 'Activated' : 'Suspended'}.`
        });
      }
    } catch (e) {
      if (addToast) addToast({ type: 'error', message: 'Failed to update customer status.' });
    }
  };

  const handleExportCSV = () => {
    const headers = ['ID,Name,Email,Phone,Role,OrdersCount,TotalSpent,Status,CreatedDate'];
    const rows = customers.map((c) =>
      `"${c.id || c._id}","${c.name}","${c.email}","${c.phone || ''}","${c.role}","${c.ordersCount || 0}","${c.totalSpent || 0}","${c.isActive ? 'Active' : 'Suspended'}","${c.createdAt || ''}"`
    );
    const blob = new Blob([[headers, ...rows].join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ru_biker_world_customers_${Date.now()}.csv`;
    a.click();
    if (addToast) addToast({ type: 'success', message: 'Exported customer data to CSV!' });
  };

  const filteredCustomers = customers.filter((c) => {
    if (statusFilter === 'active' && !c.isActive) return false;
    if (statusFilter === 'suspended' && c.isActive) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        (c.phone && c.phone.includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-fadeIn font-sans">
      {/* ===================== HEADER ===================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-600" />
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Customer Accounts & Rider Profiles
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-medium">
            Manage registered motorcycle enthusiasts, purchase histories, order spending and account security
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold shadow-xs transition-all active:scale-95 cursor-pointer"
        >
          <Download className="w-4 h-4 text-slate-500" />
          <span>Export Customer CSV</span>
        </button>
      </div>

      {/* ===================== KPI CARDS ===================== */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Total Registered Customers</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{customers.length}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Active Riders</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">
              {customers.filter((c) => c.isActive).length}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Total Customer Lifetime Spend</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">
              ₹{customers.reduce((acc, c) => acc + (c.totalSpent || 0), 0).toLocaleString('en-IN')}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* ===================== SEARCH & FILTER CONTROLS ===================== */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by customer name, email or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-slate-800"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              statusFilter === 'all'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All ({customers.length})
          </button>
          <button
            onClick={() => setStatusFilter('active')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              statusFilter === 'active'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Active ({customers.filter((c) => c.isActive).length})
          </button>
          <button
            onClick={() => setStatusFilter('suspended')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              statusFilter === 'suspended'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Suspended ({customers.filter((c) => !c.isActive).length})
          </button>
        </div>
      </div>

      {/* ===================== CUSTOMERS TABLE ===================== */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-6">Customer</th>
                <th className="py-3.5 px-6">Contact Info</th>
                <th className="py-3.5 px-6">Role / Type</th>
                <th className="py-3.5 px-6">Orders</th>
                <th className="py-3.5 px-6">Total Spent</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((c) => (
                  <tr key={c.id || c._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={c.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}&background=0D8ABC&color=fff`}
                          alt={c.name}
                          className="w-10 h-10 rounded-xl object-cover border border-slate-200 shadow-2xs"
                        />
                        <div>
                          <div className="font-bold text-slate-900 text-sm">{c.name}</div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            ID: {c.id || c._id}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-6">
                      <div className="text-slate-800 font-medium">{c.email}</div>
                      <div className="text-[11px] text-slate-400">{c.phone || '+91 98765 43210'}</div>
                    </td>

                    <td className="py-3.5 px-6">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          c.role === 'admin'
                            ? 'bg-purple-50 text-purple-700 border border-purple-200'
                            : c.role === 'manager'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {c.role || 'Customer'}
                      </span>
                    </td>

                    <td className="py-3.5 px-6 font-semibold text-slate-900">
                      {c.ordersCount || 0} Orders
                    </td>

                    <td className="py-3.5 px-6 font-bold text-slate-900">
                      ₹{(c.totalSpent || 0).toLocaleString('en-IN')}
                    </td>

                    <td className="py-3.5 px-6">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(c)}
                        className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ease-in-out cursor-pointer ${
                          c.isActive ? 'bg-slate-900' : 'bg-slate-200'
                        }`}
                      >
                        <div
                          className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                            c.isActive ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </td>

                    <td className="py-3.5 px-6 text-right">
                      <button
                        onClick={() => setSelectedCustomer(c)}
                        className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors inline-flex items-center gap-1 text-xs font-semibold"
                        title="View Full Profile"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Profile</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400 text-xs">
                    No customers found matching "{search}".
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===================== CUSTOMER PROFILE MODAL ===================== */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="w-full max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-7 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <img
                  src={selectedCustomer.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedCustomer.name)}`}
                  alt={selectedCustomer.name}
                  className="w-12 h-12 rounded-2xl object-cover border border-slate-200"
                />
                <div>
                  <h3 className="font-bold text-lg text-slate-900">{selectedCustomer.name}</h3>
                  <p className="text-xs text-slate-400 font-mono">Customer ID: {selectedCustomer.id || selectedCustomer._id}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Total Spend</span>
                  <div className="font-bold text-slate-900 text-sm mt-0.5">
                    ₹{(selectedCustomer.totalSpent || 0).toLocaleString('en-IN')}
                  </div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Total Orders</span>
                  <div className="font-bold text-slate-900 text-sm mt-0.5">
                    {selectedCustomer.ordersCount || 0} Orders
                  </div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Account Status</span>
                  <div className="font-bold text-emerald-600 mt-0.5">
                    {selectedCustomer.isActive ? 'Active' : 'Suspended'}
                  </div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Role</span>
                  <div className="font-bold text-slate-900 mt-0.5 capitalize">
                    {selectedCustomer.role || 'Customer'}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                <h4 className="font-bold text-slate-900">Personal & Delivery Details</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600">
                  <div><strong>Email:</strong> {selectedCustomer.email}</div>
                  <div><strong>Phone:</strong> {selectedCustomer.phone || '+91 98765 43210'}</div>
                  <div className="col-span-2">
                    <strong>Primary Address:</strong> {selectedCustomer.address || 'Flat 402, Royal Palms, Bangalore, Karnataka - 560001'}
                  </div>
                  <div><strong>Member Since:</strong> {selectedCustomer.createdAt?.slice(0, 10) || '2024-01-15'}</div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleToggleStatus(selectedCustomer)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer ${
                  selectedCustomer.isActive
                    ? 'bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
              >
                {selectedCustomer.isActive ? 'Suspend Account' : 'Activate Account'}
              </button>

              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCustomers;
