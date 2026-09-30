import React from 'react';
import { Outlet, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const AdminRoute = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  const hasAdminRole = Boolean(
    isAuthenticated && 
    user && 
    (user.role === 'admin' || user.role === 'manager' || user.role === 'staff')
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-bold text-slate-400">Verifying Admin Access...</span>
        </div>
      </div>
    );
  }

  // Strictly allow ONLY authenticated Admin/Staff
  if (hasAdminRole) {
    return <Outlet />;
  }

  // Otherwise redirect to dedicated Admin Login Page
  return <Navigate to="/admin/login" state={{ from: location }} replace />;
};

export default AdminRoute;
