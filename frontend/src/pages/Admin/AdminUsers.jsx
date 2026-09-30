import React, { useState, useEffect } from 'react';
import {
  FiUsers,
  FiUserPlus,
  FiSearch,
  FiShield,
  FiCheckCircle,
  FiXCircle,
  FiEdit2,
  FiMail,
  FiPhone,
  FiShoppingBag,
  FiDollarSign,
  FiCalendar,
  FiX,
  FiLock,
  FiUnlock,
  FiEye,
  FiTrash2,
  FiAlertTriangle,
  FiPackage,
  FiClock,
  FiRefreshCw,
  FiCreditCard,
  FiActivity,
  FiCheck
} from 'react-icons/fi';
import { adminService } from '../../services/adminService';
import { useNotifications } from '../../hooks/useNotifications';

export const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Add User Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'staff',
    password: '',
  });

  // View User Details Modal state
  const [viewUser, setViewUser] = useState(null);

  // Delete User Confirmation Modal state
  const [deleteConfirmUser, setDeleteConfirmUser] = useState(null);

  // Block Modal state (Requirement 10)
  const [blockModalUser, setBlockModalUser] = useState(null);
  const [blockForm, setBlockForm] = useState({
    blockType: 'permanent', // 'permanent' | 'temporary'
    durationHours: 24, // 1, 24, 72, 168, 720, or 'custom'
    customBlockedUntil: '',
    reason: 'Violation of platform policies and suspicious checkout activity',
  });
  const [blockSubmitting, setBlockSubmitting] = useState(false);

  // Audit Logs Modal state (Requirement 12)
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [auditLogs, setAuditLogs] = useState([]);
  const [auditLoading, setAuditLoading] = useState(false);

  const { addToast } = useNotifications() || {};

  const loadData = async () => {
    try {
      setLoading(true);
      const [usersData, ordersData] = await Promise.all([
        adminService.getUsers(),
        adminService.getOrders(),
      ]);
      setUsers(usersData || []);
      setOrders(ordersData || []);
    } catch (e) {
      console.error('Failed to load users or orders:', e);
    } finally {
      setLoading(false);
    }
  };

  const loadAuditLogs = async () => {
    try {
      setAuditLoading(true);
      const logs = await adminService.getAuditLogs();
      setAuditLogs(logs || []);
    } catch (e) {
      console.error('Failed to load audit logs:', e);
    } finally {
      setAuditLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Open Block Modal
  const handleOpenBlockModal = (user) => {
    setBlockModalUser(user);
    setBlockForm({
      blockType: 'permanent',
      durationHours: 24,
      customBlockedUntil: '',
      reason: 'Violation of platform policies and suspicious checkout activity',
    });
  };

  // Confirm Block User & Session Revocation
  const handleConfirmBlock = async (e) => {
    e.preventDefault();
    if (!blockModalUser) return;
    const userId = blockModalUser.id || blockModalUser._id;

    try {
      setBlockSubmitting(true);
      await adminService.blockUser(userId, {
        blockType: blockForm.blockType,
        reason: blockForm.reason.trim(),
        durationHours: blockForm.durationHours === 'custom' ? null : Number(blockForm.durationHours),
        customBlockedUntil: blockForm.durationHours === 'custom' ? blockForm.customBlockedUntil : null,
      });

      if (addToast) {
        addToast({
          type: 'warning',
          message: `User ${blockModalUser.name} has been ${blockForm.blockType === 'temporary' ? 'temporarily' : 'permanently'} blocked. All active sessions revoked.`,
        });
      }

      setBlockModalUser(null);
      if (viewUser && (viewUser.id === userId || viewUser._id === userId)) {
        setViewUser(null);
      }
      loadData();
    } catch (err) {
      if (addToast) {
        addToast({ type: 'error', message: err.message || 'Failed to block user.' });
      }
    } finally {
      setBlockSubmitting(false);
    }
  };

  // Unblock User
  const handleUnblockUser = async (user) => {
    const userId = user.id || user._id;
    try {
      await adminService.unblockUser(userId, {
        reason: 'Restored access by Administrator after verification',
      });

      if (addToast) {
        addToast({
          type: 'success',
          message: `User ${user.name} has been unblocked. Session access restored.`,
        });
      }

      if (viewUser && (viewUser.id === userId || viewUser._id === userId)) {
        setViewUser(null);
      }
      loadData();
    } catch (err) {
      if (addToast) {
        addToast({ type: 'error', message: err.message || 'Failed to unblock user.' });
      }
    }
  };

  // Role privilege update
  const handleRoleChange = async (userId, newRole) => {
    try {
      await adminService.updateUser(userId, { role: newRole });
      if (addToast) {
        addToast({
          type: 'success',
          message: `User role updated to ${newRole.toUpperCase()}.`,
        });
      }
      loadData();
    } catch (e) {
      if (addToast) addToast({ type: 'error', message: 'Failed to update user role.' });
    }
  };

  // Delete User
  const handleDeleteUser = async () => {
    if (!deleteConfirmUser) return;
    const userId = deleteConfirmUser.id || deleteConfirmUser._id;
    try {
      await adminService.deleteUser(userId);
      if (addToast) {
        addToast({
          type: 'success',
          message: `User ${deleteConfirmUser.name} deleted successfully.`,
        });
      }
      setDeleteConfirmUser(null);
      if (viewUser && (viewUser.id === userId || viewUser._id === userId)) {
        setViewUser(null);
      }
      loadData();
    } catch (e) {
      if (addToast) addToast({ type: 'error', message: 'Failed to delete user.' });
    }
  };

  // Create User Submit
  const handleCreateUserSubmit = async (e) => {
    e.preventDefault();
    if (!newUserData.name || !newUserData.email) {
      if (addToast) addToast({ type: 'error', message: 'Name and Email are required.' });
      return;
    }

    try {
      await adminService.createUser(newUserData);
      if (addToast) addToast({ type: 'success', message: 'User account created successfully!' });
      setIsAddModalOpen(false);
      setNewUserData({ name: '', email: '', phone: '', role: 'staff', password: '' });
      loadData();
    } catch (e) {
      if (addToast) addToast({ type: 'error', message: 'Failed to create user.' });
    }
  };

  // Helper to format date
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  // Get orders associated with a user
  const getUserOrders = (user) => {
    if (!user) return [];
    const userId = String(user.id || user._id || '');
    const userEmail = (user.email || '').toLowerCase().trim();
    const userPhone = (user.phone || '').replace(/\D/g, '').slice(-10);

    return orders.filter((o) => {
      const oUserId = String(o.user?._id || o.user?.id || o.user || '');
      const oEmail = (o.userEmail || o.user?.email || '').toLowerCase().trim();
      const oPhone = (o.userPhone || o.shippingAddress?.phone || '').replace(/\D/g, '').slice(-10);

      return (
        (userId && oUserId && userId === oUserId) ||
        (userEmail && oEmail && userEmail === oEmail) ||
        (userPhone && oPhone && userPhone === oPhone)
      );
    });
  };

  // Filtered Users
  let filtered = [...users];
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (u) =>
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.phone?.toLowerCase().includes(q) ||
        String(u.id || u._id).toLowerCase().includes(q)
    );
  }

  if (roleFilter !== 'all') {
    filtered = filtered.filter((u) => u.role?.toLowerCase() === roleFilter.toLowerCase());
  }

  if (statusFilter !== 'all') {
    filtered = filtered.filter((u) => {
      const isBlocked = u.status === 'blocked' || u.status === 'temporarily_blocked' || u.isActive === false;
      return statusFilter === 'active' ? !isBlocked : isBlocked;
    });
  }

  return (
    <div className="space-y-6 animate-fadeIn font-sans p-2 sm:p-4">
      {/* ===================== PAGE HEADER ===================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
              <FiShield className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                User Management & Access Control
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Manage accounts, instant session revocation, temporary/permanent blocks & audit trail
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto flex-wrap">
          <button
            onClick={() => {
              setIsAuditModalOpen(true);
              loadAuditLogs();
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-200 transition-colors cursor-pointer"
            title="View Security Audit Logs"
          >
            <FiActivity className="w-4 h-4 text-slate-600" />
            <span>Audit Trail</span>
          </button>

          <button
            onClick={loadData}
            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
            title="Refresh Data"
          >
            <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#c81e2b] hover:bg-[#a81622] text-white rounded-xl text-xs font-bold shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            <FiUserPlus className="w-4 h-4" />
            <span>Add Staff</span>
          </button>
        </div>
      </div>

      {/* ===================== FILTER TABS & SEARCH ===================== */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Role Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 lg:pb-0">
          {[
            { id: 'all', label: 'All Users' },
            { id: 'customer', label: 'Customers' },
            { id: 'staff', label: 'Staff' },
            { id: 'manager', label: 'Managers' },
            { id: 'admin', label: 'Admins' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setRoleFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                roleFilter === tab.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Status Filter & Search */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:bg-white"
          >
            <option value="all">All Status</option>
            <option value="active">Active Only</option>
            <option value="blocked">Blocked / Suspended Only</option>
          </select>

          <div className="relative w-full sm:w-64">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search ID, name, email, phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#c81e2b] focus:bg-white transition-all"
            />
          </div>
        </div>
      </div>

      {/* ===================== USERS TABLE ===================== */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4 sm:px-5">User ID</th>
                <th className="py-3.5 px-4 sm:px-5">Name & Profile</th>
                <th className="py-3.5 px-4 sm:px-5">Email</th>
                <th className="py-3.5 px-4 sm:px-5">Phone</th>
                <th className="py-3.5 px-4 sm:px-5">Role</th>
                <th className="py-3.5 px-4 sm:px-5">Account Status</th>
                <th className="py-3.5 px-4 sm:px-5 text-center">Session & Access Control</th>
                <th className="py-3.5 px-4 sm:px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filtered.length > 0 ? (
                filtered.map((user) => {
                  const uid = user.id || user._id;
                  const displayId = String(uid).length > 10 ? `USR-${String(uid).slice(-6).toUpperCase()}` : uid;
                  const isBlocked = user.status === 'blocked' || user.status === 'temporarily_blocked' || user.isActive === false;
                  const isTemp = user.status === 'temporarily_blocked' || (isBlocked && user.blockDetails?.blockType === 'temporary');
                  const isSuperAdmin = user.email === 'admin@rubikerworld.com';

                  return (
                    <tr key={uid} className={`hover:bg-slate-50/80 transition-colors ${isBlocked ? 'bg-red-50/30' : ''}`}>
                      {/* 1. User ID */}
                      <td className="py-4 px-4 sm:px-5">
                        <span className="font-mono font-bold text-slate-800 text-[11px] bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                          {displayId}
                        </span>
                      </td>

                      {/* 2. Name & Avatar */}
                      <td className="py-4 px-4 sm:px-5">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white text-xs shrink-0 ${
                            user.role === 'admin' ? 'bg-purple-600' : user.role === 'manager' ? 'bg-blue-600' : 'bg-slate-800'
                          }`}>
                            {user.name ? user.name[0].toUpperCase() : 'U'}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                              <span>{user.name || 'Anonymous Rider'}</span>
                              {isBlocked && (
                                <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                                  isTemp ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-700'
                                }`}>
                                  {isTemp ? 'TEMP BLOCKED' : 'BLOCKED'}
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400">
                              Joined: {formatDate(user.createdAt)}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* 3. Email */}
                      <td className="py-4 px-4 sm:px-5">
                        <div className="text-slate-700 font-medium flex items-center gap-1.5">
                          <FiMail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate max-w-[180px]" title={user.email}>{user.email || 'No email'}</span>
                        </div>
                      </td>

                      {/* 4. Phone */}
                      <td className="py-4 px-4 sm:px-5 whitespace-nowrap">
                        <div className="text-slate-700 font-medium flex items-center gap-1.5">
                          <FiPhone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{user.phone || '+91 98765 43210'}</span>
                        </div>
                      </td>

                      {/* 5. Role Badge */}
                      <td className="py-4 px-4 sm:px-5 whitespace-nowrap">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                            user.role === 'admin'
                              ? 'bg-purple-50 text-purple-700 border-purple-200'
                              : user.role === 'manager'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : user.role === 'staff'
                              ? 'bg-teal-50 text-teal-700 border-teal-200'
                              : 'bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          {user.role || 'customer'}
                        </span>
                      </td>

                      {/* 6. Status Badge */}
                      <td className="py-4 px-4 sm:px-5 whitespace-nowrap">
                        {!isBlocked ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Active
                          </span>
                        ) : isTemp ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            <FiClock className="w-3 h-3 text-amber-600" />
                            Temp Suspended
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                            Blocked
                          </span>
                        )}
                      </td>

                      {/* 7. Block / Unblock Controls */}
                      <td className="py-4 px-4 sm:px-5 text-center whitespace-nowrap">
                        {isSuperAdmin ? (
                          <span className="text-[11px] text-slate-400 font-semibold italic">Protected</span>
                        ) : !isBlocked ? (
                          <button
                            type="button"
                            onClick={() => handleOpenBlockModal(user)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-50 hover:bg-rose-100 text-amber-800 hover:text-rose-800 border border-amber-200 hover:border-rose-300 transition-all cursor-pointer shadow-2xs"
                            title="Block user with options and force logout"
                          >
                            <FiLock className="w-3.5 h-3.5 text-amber-600" />
                            <span>Block User</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleUnblockUser(user)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-all cursor-pointer shadow-2xs"
                            title="Unblock user account"
                          >
                            <FiUnlock className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Unblock User</span>
                          </button>
                        )}
                      </td>

                      {/* 8. Actions (View & Delete) */}
                      <td className="py-4 px-4 sm:px-5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View Full History Button */}
                          <button
                            type="button"
                            onClick={() => setViewUser(user)}
                            className="p-2 text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-200 rounded-xl border border-slate-200 transition-colors cursor-pointer"
                            title="View User Profile & Order History"
                          >
                            <FiEye className="w-4 h-4" />
                          </button>

                          {/* Delete Button */}
                          {!isSuperAdmin && (
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmUser(user)}
                              className="p-2 text-rose-500 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl border border-rose-200 transition-colors cursor-pointer"
                              title="Delete User Account"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-slate-400 text-xs">
                    {loading ? (
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-6 h-6 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                        <span>Loading user directory...</span>
                      </div>
                    ) : (
                      'No users found matching your search.'
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===================== BLOCK USER MODAL (Requirement 10) ===================== */}
      {blockModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-7 animate-fadeIn space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
                  <FiLock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-base text-slate-900">
                    Suspend & Revoke User Access
                  </h3>
                  <p className="text-xs text-slate-400">
                    Target: <strong>{blockModalUser.name}</strong> ({blockModalUser.email})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setBlockModalUser(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 cursor-pointer"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmBlock} className="space-y-4 text-xs">
              {/* Block Type Selection */}
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">Suspension Type</label>
                <div className="grid grid-cols-2 gap-2.5">
                  <label
                    className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${
                      blockForm.blockType === 'permanent'
                        ? 'border-rose-500 bg-rose-50/50 text-rose-950 font-bold'
                        : 'border-slate-200 bg-slate-50 text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="blockType"
                      value="permanent"
                      checked={blockForm.blockType === 'permanent'}
                      onChange={() => setBlockForm({ ...blockForm, blockType: 'permanent' })}
                      className="text-rose-600"
                    />
                    <span>Permanent Block</span>
                  </label>

                  <label
                    className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${
                      blockForm.blockType === 'temporary'
                        ? 'border-amber-500 bg-amber-50/50 text-amber-950 font-bold'
                        : 'border-slate-200 bg-slate-50 text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="blockType"
                      value="temporary"
                      checked={blockForm.blockType === 'temporary'}
                      onChange={() => setBlockForm({ ...blockForm, blockType: 'temporary' })}
                      className="text-amber-600"
                    />
                    <span>Temporary Block</span>
                  </label>
                </div>
              </div>

              {/* Temporary Duration Selector */}
              {blockForm.blockType === 'temporary' && (
                <div className="space-y-2 p-3.5 rounded-2xl bg-amber-50/40 border border-amber-200 animate-fadeIn">
                  <label className="block text-amber-900 font-bold">Select Suspension Duration</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { hours: 1, label: '1 Hour' },
                      { hours: 24, label: '24 Hours' },
                      { hours: 72, label: '3 Days' },
                      { hours: 168, label: '7 Days' },
                      { hours: 720, label: '30 Days' },
                      { hours: 'custom', label: 'Custom' },
                    ].map((dur) => (
                      <button
                        key={dur.hours}
                        type="button"
                        onClick={() => setBlockForm({ ...blockForm, durationHours: dur.hours })}
                        className={`py-1.5 px-2 rounded-xl text-[11px] font-bold border transition-colors cursor-pointer ${
                          blockForm.durationHours === dur.hours
                            ? 'bg-amber-600 text-white border-amber-600'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {dur.label}
                      </button>
                    ))}
                  </div>

                  {blockForm.durationHours === 'custom' && (
                    <div className="pt-2">
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Custom Unblock Date & Time
                      </label>
                      <input
                        type="datetime-local"
                        required
                        value={blockForm.customBlockedUntil}
                        onChange={(e) => setBlockForm({ ...blockForm, customBlockedUntil: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Suspension Reason */}
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">
                  Suspension Reason (Displayed to User on Block Page)
                </label>

                {/* Preset Chips */}
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {[
                    'Fraudulent / Suspicious Payment',
                    'Multiple Order Cancellations',
                    'Abusive Behaviour with Staff',
                    'Policy & Terms Violation',
                  ].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setBlockForm({ ...blockForm, reason: preset })}
                      className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                    >
                      + {preset}
                    </button>
                  ))}
                </div>

                <textarea
                  rows={3}
                  required
                  placeholder="Enter detailed reason for suspension..."
                  value={blockForm.reason}
                  onChange={(e) => setBlockForm({ ...blockForm, reason: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-rose-500 focus:bg-white"
                />
              </div>

              {/* Real-time Force Logout Warning */}
              <div className="p-3 bg-rose-50 rounded-xl border border-rose-200/80 text-[11px] text-rose-800 flex items-start gap-2">
                <FiAlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Instant Force Logout:</strong> Submitting this will immediately disconnect all active WebSocket sessions on every device, invalidate tokens via tokenVersion, and redirect the user to <code>/account-blocked</code>.
                </span>
              </div>

              {/* Modal Actions */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setBlockModalUser(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={blockSubmitting}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-xs cursor-pointer flex items-center gap-2 disabled:opacity-50"
                >
                  {blockSubmitting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <FiLock className="w-3.5 h-3.5" />
                      <span>Confirm Block & Revoke Sessions</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================== AUDIT LOGS MODAL (Requirement 12) ===================== */}
      {isAuditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-3xl bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-7 animate-fadeIn max-h-[85vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                  <FiActivity className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="font-black text-base text-slate-900">
                    Administrative Action & Security Audit Log
                  </h3>
                  <p className="text-xs text-slate-400">
                    Immutable historical records of blocks, unblocks, and role modifications
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAuditModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 cursor-pointer"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {auditLoading ? (
              <div className="p-10 text-center flex flex-col items-center gap-2">
                <div className="w-6 h-6 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                <span className="text-xs text-slate-500">Loading audit records...</span>
              </div>
            ) : auditLogs.length > 0 ? (
              <div className="space-y-2.5">
                {auditLogs.map((log) => (
                  <div
                    key={log.id || log._id}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${
                          log.action?.includes('BLOCK')
                            ? 'bg-rose-100 text-rose-800'
                            : log.action?.includes('UNBLOCK')
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {log.action}
                        </span>
                        <span className="font-bold text-slate-900">
                          Target: {log.targetUserName || log.targetUserEmail || log.targetUserId}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600">
                        <strong>Reason:</strong> "{log.reason || 'N/A'}"
                      </p>
                    </div>

                    <div className="text-right text-[11px] text-slate-400 shrink-0">
                      <div>Admin: <strong className="text-slate-700">{log.adminEmail || 'SuperAdmin'}</strong></div>
                      <div>{formatDate(log.createdAt)}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-400">
                No administrative audit records logged yet.
              </div>
            )}

            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setIsAuditModalOpen(false)}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Close Log
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== VIEW USER DETAILS & ORDER HISTORY MODAL ===================== */}
      {viewUser && (() => {
        const userOrders = getUserOrders(viewUser);
        const totalOrders = userOrders.length;
        const totalSpent = userOrders.reduce((sum, o) => {
          const isCancelled = (o.orderStatus || '').toLowerCase() === 'cancelled';
          if (isCancelled) return sum;
          return sum + (Number(o.totalAmount || o.grandTotal || o.pricing?.finalTotal) || 0);
        }, 0);
        const cancelledOrders = userOrders.filter((o) => (o.orderStatus || '').toLowerCase() === 'cancelled');
        const isBlocked = viewUser.status === 'blocked' || viewUser.status === 'temporarily_blocked' || viewUser.isActive === false;
        const isTemp = viewUser.status === 'temporarily_blocked' || (isBlocked && viewUser.blockDetails?.blockType === 'temporary');

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-7 animate-fadeIn max-h-[90vh] overflow-y-auto space-y-6">
              
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-base shadow-sm">
                    {viewUser.name ? viewUser.name[0].toUpperCase() : 'U'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-black text-lg text-slate-900">{viewUser.name}</h3>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                        !isBlocked ? 'bg-emerald-100 text-emerald-800' : isTemp ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {!isBlocked ? 'Active' : isTemp ? 'Temporarily Blocked' : 'Blocked'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 font-medium">{viewUser.email} • {viewUser.phone || 'No phone'}</p>
                  </div>
                </div>

                <button
                  onClick={() => setViewUser(null)}
                  className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              {/* Block Details Notice if User is Blocked */}
              {isBlocked && viewUser.blockDetails && (
                <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 text-xs space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-rose-900">
                    <FiAlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>Active Suspension Info</span>
                  </div>
                  <p className="text-rose-800">
                    <strong>Reason:</strong> {viewUser.blockDetails.reason || 'Restricted by administrator'}
                  </p>
                  {viewUser.blockDetails.blockedUntil && (
                    <p className="text-rose-700">
                      <strong>Expires:</strong> {formatDate(viewUser.blockDetails.blockedUntil)}
                    </p>
                  )}
                </div>
              )}

              {/* Summary Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Total Orders */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Orders</span>
                    <FiShoppingBag className="w-4 h-4 text-blue-600" />
                  </div>
                  <p className="text-2xl font-black text-slate-900 mt-1">
                    {totalOrders}
                  </p>
                </div>

                {/* Total Payment / Spent */}
                <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/80">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">Total Payments</span>
                    <FiCreditCard className="w-4 h-4 text-emerald-600" />
                  </div>
                  <p className="text-2xl font-black text-emerald-950 mt-1">
                    ₹{totalSpent.toLocaleString('en-IN')}
                  </p>
                </div>

                {/* Cancelled Orders */}
                <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-200/80">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-rose-800">Cancelled Orders</span>
                    <FiAlertTriangle className="w-4 h-4 text-rose-600" />
                  </div>
                  <p className="text-2xl font-black text-rose-950 mt-1">
                    {cancelledOrders.length}
                  </p>
                </div>
              </div>

              {/* Complete Order History Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Order History ({totalOrders})
                  </h4>
                  <span className="text-[11px] text-slate-400 font-medium">Real-time sync</span>
                </div>

                {userOrders.length > 0 ? (
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {userOrders.map((order) => {
                      const total = order.totalAmount || order.grandTotal || order.pricing?.finalTotal || 0;
                      const isCancelled = (order.orderStatus || '').toLowerCase() === 'cancelled';
                      const itemsCount = order.items?.reduce((s, i) => s + (Number(i.quantity) || 1), 0) || 1;

                      return (
                        <div
                          key={order.orderNumber || order.id || order._id}
                          className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 text-xs ${
                            isCancelled ? 'bg-rose-50/30 border-rose-200/60' : 'bg-slate-50 border-slate-200/80'
                          }`}
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-slate-900">
                                #{order.orderNumber || order.id || order._id}
                              </span>
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                isCancelled ? 'bg-rose-100 text-rose-800 border-rose-200' : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                              }`}>
                                {order.orderStatus || 'Processing'}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-500 mt-1">
                              {formatDate(order.createdAt)} • {itemsCount} {itemsCount === 1 ? 'item' : 'items'} • Payment: {order.paymentMethod || 'COD'}
                            </div>
                          </div>

                          <div className="text-right whitespace-nowrap">
                            <span className="font-black text-slate-900 text-sm">
                              ₹{Number(total).toLocaleString('en-IN')}
                            </span>
                            <div className="text-[10px] font-semibold text-slate-400">
                              {order.paymentStatus || 'Paid'}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-6 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-400 text-xs">
                    No order history found for this user yet.
                  </div>
                )}
              </div>

              {/* Action Controls */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                {!isBlocked ? (
                  <button
                    type="button"
                    onClick={() => {
                      setViewUser(null);
                      handleOpenBlockModal(viewUser);
                    }}
                    className="px-4 py-2.5 rounded-xl font-bold text-xs bg-rose-600 hover:bg-rose-700 text-white transition-colors cursor-pointer"
                  >
                    Block This User
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleUnblockUser(viewUser)}
                    className="px-4 py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white transition-colors cursor-pointer"
                  >
                    Unblock This User
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setViewUser(null)}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  Close Profile
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ===================== DELETE CONFIRMATION MODAL ===================== */}
      {deleteConfirmUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 animate-fadeIn space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <FiTrash2 className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h3 className="text-base font-black text-slate-900">Delete User Account?</h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to permanently delete account for <strong className="text-slate-900">{deleteConfirmUser.name}</strong> ({deleteConfirmUser.email})?
              </p>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 text-[11px] text-amber-800">
              ⚠️ Warning: This action cannot be undone. All linked authentication sessions will be revoked.
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmUser(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteUser}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-xs cursor-pointer"
              >
                Yes, Delete User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== ADD NEW STAFF MODAL ===================== */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-7 animate-fadeIn">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-black text-base text-slate-900">Add New Staff / Admin</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 cursor-pointer"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUserSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Vikram Sharma"
                  value={newUserData.name}
                  onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#c81e2b] focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="staff@rubikerworld.com"
                  value={newUserData.email}
                  onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#c81e2b] focus:bg-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="+91 98765 43210"
                    value={newUserData.phone}
                    onChange={(e) => setNewUserData({ ...newUserData, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#c81e2b] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Assign Role</label>
                  <select
                    value={newUserData.role}
                    onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-[#c81e2b] focus:bg-white"
                  >
                    <option value="staff">Staff</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Temporary Password</label>
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={newUserData.password}
                  onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#c81e2b] focus:bg-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-[#c81e2b] hover:bg-[#a81622] text-white shadow-xs cursor-pointer"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
