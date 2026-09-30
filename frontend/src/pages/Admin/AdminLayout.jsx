import React, { useState, useEffect } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Image as ImageIcon,
  Archive,
  ShoppingCart,
  Layers,
  Grid,
  Sparkles,
  Users,
  CreditCard,
  Tag,
  Star,
  ShieldCheck,
  BarChart3,
  Settings,
  ArrowLeft,
  ExternalLink,
  Compass,
  Award,
  Search,
  Bell,
  Menu,
  X,
  LogOut,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { adminService } from '../../services/adminService';

export const AdminLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch low stock alerts count
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const stats = await adminService.getDashboardStats();
        if (stats?.kpis?.lowStockCount) {
          setLowStockCount(stats.kpis.lowStockCount);
        }
      } catch (e) { }
    };
    fetchAlerts();
  }, [location.pathname]);

  const navItems = [
    { name: 'Store Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
    { name: 'Products Catalog', path: '/admin/products', icon: Package },
    { name: 'Inventory & Stock', path: '/admin/inventory', icon: Archive, badge: lowStockCount > 0 ? lowStockCount : null },
    { name: 'Order Management', path: '/admin/orders', icon: ShoppingCart },
    { name: 'Categories', path: '/admin/categories', icon: Layers },
    { name: 'Bike Categories', path: '/admin/bike-categories', icon: Compass },
    { name: 'Shop By Category', path: '/admin/shop-by-category', icon: Grid },
    { name: 'Looking For Today', path: '/admin/looking-for', icon: Sparkles },
    { name: 'Featured Brands', path: '/admin/brands', icon: Award },
    { name: 'Customers', path: '/admin/customers', icon: Users },
    { name: 'Payments', path: '/admin/payments', icon: CreditCard },
    { name: 'Coupons & Promos', path: '/admin/coupons', icon: Tag },
    { name: 'Customer Reviews', path: '/admin/reviews', icon: Star },
    { name: 'User Management', path: '/admin/users', icon: ShieldCheck },
    { name: 'Sales Analytics', path: '/admin/analytics', icon: BarChart3 },
    { name: 'Store Settings', path: '/admin/settings', icon: Settings },
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/admin/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const isNavActive = (item) => {
    if (item.exact) {
      return location.pathname === '/admin' || location.pathname === '/admin/dashboard';
    }
    return location.pathname.startsWith(item.path);
  };

  return (
    <div className=" min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans selection:bg-red-600 selection:text-white antialiased">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex flex-1 relative overflow-hidden">
        {/* ===================== SIDEBAR ===================== */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200/80 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto shadow-xs ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
        >
          {/* Logo & Brand Header */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <Link to="/admin" className="flex items-center gap-3 group">
              <img src='/ru_biker_world-removebg-preview.png' alt='logo' className='h-[50px]' />
            </Link>

            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 lg:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Return to Storefront */}
          <div className="px-3 pt-3 pb-1">
            <Link
              to="/"
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/60 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-all group"
            >
              <span className="flex items-center gap-2">
                <ArrowLeft className="w-3.5 h-3.5 text-[#c81e2b] group-hover:-translate-x-1 transition-transform" />
                <span>Live Bike Storefront</span>
              </span>
              <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-slate-600" />
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto no-scrollbar">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 pt-2 pb-1.5">
              Store Operations
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isNavActive(item);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${active
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                    }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-[#c81e2b]' : 'text-slate-400'}`} />
                    <span className="truncate">{item.name}</span>
                  </div>

                  {item.badge && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#c81e2b] text-white shadow-2xs">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Admin User Profile */}
          <div className="p-3 border-t border-slate-100 bg-slate-50/50">
            <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-[#c81e2b] text-white font-black text-xs flex items-center justify-center shadow-xs">
                  {user?.name ? user.name[0].toUpperCase() : 'R'}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate">{user?.name || 'Super Admin'}</p>
                  <p className="text-[10px] text-slate-400 font-medium truncate">Store Director</p>
                </div>
              </div>

              <button
                onClick={async () => {
                  try {
                    sessionStorage.removeItem('motozone_admin_demo_access');
                  } catch (e) {}
                  await logout();
                  navigate('/admin/login');
                }}
                title="Logout"
                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </aside>

        {/* ===================== MAIN CONTENT AREA ===================== */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Top Navigation Bar */}
          <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 lg:px-6 py-3 flex items-center justify-between gap-4 shadow-2xs">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 lg:hidden"
              >
                <Menu className="w-5 h-5" />
              </button>

              {/* Global Search Bar */}
              <form onSubmit={handleSearchSubmit} className="relative max-w-md w-full hidden sm:block">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Quick search products, SKU, orders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-100 hover:bg-slate-200/60 focus:bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c81e2b] transition-colors"
                />
              </form>
            </div>

            {/* Right Header Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Notification Popover */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors relative"
                >
                  <Bell className="w-4 h-4" />
                  {lowStockCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#c81e2b] ring-2 ring-white" />
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl border border-slate-200 shadow-xl py-3 px-4 space-y-3 z-50">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <h4 className="text-xs font-black text-slate-900">Admin Alerts</h4>
                      <span className="text-[10px] text-slate-400 font-bold">Real-time</span>
                    </div>

                    <div className="space-y-2">
                      <div className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-200/60 text-xs">
                        <div className="flex items-center gap-1.5 font-bold text-amber-900">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                          <span>Low Stock Warning</span>
                        </div>
                        <p className="text-[11px] text-amber-800 mt-0.5">
                          {lowStockCount} items need restocking soon.
                        </p>
                      </div>

                      <div className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-200/60 text-xs">
                        <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Store Connected</span>
                        </div>
                        <p className="text-[11px] text-emerald-800 mt-0.5">
                          All systems and database sync are operational.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Admin Avatar */}
              <div className="w-8 h-8 rounded-xl bg-slate-900 text-white font-black text-xs flex items-center justify-center shadow-xs">
                {user?.name ? user.name[0].toUpperCase() : 'S'}
              </div>
            </div>
          </header>

          {/* Page Body Viewport */}
          <main className="flex-1 pb-16">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
