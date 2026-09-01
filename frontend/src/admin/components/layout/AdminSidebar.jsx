// AdminSidebar — Fixed left sidebar (270px width) with exact route matching for Products submenu
import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Package, Boxes, ShoppingBag, Users, Star,
  PanelsTopLeft, ShieldCheck, Settings, LogOut, ChevronDown, ChevronRight, X,
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';

export default function AdminSidebar({ mobileOpen, onMobileClose }) {
  const location = useLocation();
  const { logout } = useAdminAuth();

  // Check if current route is inside product management section
  const isProductsSection =
    location.pathname === '/admin/products' ||
    location.pathname.startsWith('/admin/products/') ||
    location.pathname === '/admin/categories' ||
    location.pathname === '/admin/filters';

  // Products dropdown expanded state — defaults to true if inside products section
  const [productsOpen, setProductsOpen] = useState(isProductsSection);

  // Keep expanded if route changes into products section
  useEffect(() => {
    if (isProductsSection) {
      setProductsOpen(true);
    }
  }, [location.pathname, isProductsSection]);

  const SidebarContent = ({ onNavigate }) => (
    <div className="flex flex-col h-full bg-white text-slate-700">
      
      {/* Mobile Header Close Button */}
      {onNavigate && (
        <div className="p-4 flex items-center justify-between border-b border-slate-100 lg:hidden flex-shrink-0">
          <span className="font-bold text-slate-800 text-sm">Navigation</span>
          <button onClick={onNavigate} className="p-1 text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>
      )}

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto px-4 py-5 space-y-5 no-scrollbar">
        
        {/* Dashboard Link (Top Item) */}
        <div>
          <NavLink
            to="/admin"
            end
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all shadow-2xs ${
                isActive
                  ? 'bg-brand-teal text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <LayoutDashboard size={18} className={isActive ? 'text-white' : 'text-slate-400'} />
                <span>Dashboard</span>
              </>
            )}
          </NavLink>
        </div>

        {/* PRODUCT MANAGEMENT */}
        <div>
          <p className="px-4 text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-2">
            PRODUCT MANAGEMENT
          </p>
          <div className="space-y-1">
            {/* Products Dropdown Parent */}
            <div>
              <button
                type="button"
                onClick={() => setProductsOpen(o => !o)}
                className={`w-full flex items-center justify-between gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                  isProductsSection
                    ? 'text-brand-teal font-semibold bg-brand-powder/40'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Package size={18} className={isProductsSection ? 'text-brand-teal' : 'text-slate-400 group-hover:text-slate-600'} />
                  <span>Products</span>
                </div>
                {productsOpen ? (
                  <ChevronDown size={15} className={isProductsSection ? 'text-brand-teal' : 'text-slate-400'} />
                ) : (
                  <ChevronRight size={15} className="text-slate-400" />
                )}
              </button>

              {/* Submenu Children with EXACT Route Matching */}
              {productsOpen && (
                <div className="mt-1 space-y-1">
                  {[
                    { label: 'All Products', to: '/admin/products' },
                    { label: 'Add Product', to: '/admin/products/add' },
                    { label: 'Categories', to: '/admin/categories' },
                    { label: 'Filter Catalog', to: '/admin/filters' },
                  ].map(child => {
                    // EXACT ROUTE MATCHING logic
                    const isChildActive = location.pathname === child.to;
                    return (
                      <NavLink
                        key={child.to}
                        to={child.to}
                        onClick={onNavigate}
                        className={`flex items-center gap-2.5 pl-11 pr-4 py-2 rounded-lg text-xs transition-all ${
                          isChildActive
                            ? 'text-brand-teal font-semibold bg-brand-powder/60 shadow-2xs'
                            : 'text-slate-500 font-normal hover:text-brand-teal hover:bg-brand-powder/20'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full flex-shrink-0 transition-colors ${
                            isChildActive ? 'bg-brand-teal' : 'bg-slate-300'
                          }`}
                        />
                        <span>{child.label}</span>
                      </NavLink>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Inventory */}
            <NavLink
              to="/admin/inventory"
              onClick={onNavigate}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-brand-teal text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Boxes size={18} className={isActive ? 'text-white' : 'text-slate-400'} />
                  <span>Inventory</span>
                </>
              )}
            </NavLink>
          </div>
        </div>

        {/* SALES */}
        <div>
          <p className="px-4 text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-2">
            SALES
          </p>
          <div className="space-y-1">
            <NavLink
              to="/admin/orders"
              onClick={onNavigate}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-brand-teal text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <ShoppingBag size={18} className={isActive ? 'text-white' : 'text-slate-400'} />
                  <span>Orders</span>
                </>
              )}
            </NavLink>

            <NavLink
              to="/admin/customers"
              onClick={onNavigate}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-brand-teal text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Users size={18} className={isActive ? 'text-white' : 'text-slate-400'} />
                  <span>Customers</span>
                </>
              )}
            </NavLink>
          </div>
        </div>

        {/* ENGAGEMENT */}
        <div>
          <p className="px-4 text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-2">
            ENGAGEMENT
          </p>
          <div className="space-y-1">
            <NavLink
              to="/admin/reviews"
              onClick={onNavigate}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-brand-teal text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Star size={18} className={isActive ? 'text-white' : 'text-slate-400'} />
                  <span>Reviews</span>
                </>
              )}
            </NavLink>
          </div>
        </div>

        {/* STORE */}
        <div>
          <p className="px-4 text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-2">
            STORE
          </p>
          <div className="space-y-1">
            <NavLink
              to="/admin/content"
              onClick={onNavigate}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-brand-teal text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <PanelsTopLeft size={18} className={isActive ? 'text-white' : 'text-slate-400'} />
                  <span>Content Management</span>
                </>
              )}
            </NavLink>
          </div>
        </div>

        {/* ADMINISTRATION */}
        <div>
          <p className="px-4 text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-2">
            ADMINISTRATION
          </p>
          <div className="space-y-1">
            <NavLink
              to="/admin/users"
              onClick={onNavigate}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-brand-teal text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <ShieldCheck size={18} className={isActive ? 'text-white' : 'text-slate-400'} />
                  <span>Users & Roles</span>
                </>
              )}
            </NavLink>

            <NavLink
              to="/admin/settings"
              onClick={onNavigate}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-brand-teal text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Settings size={18} className={isActive ? 'text-white' : 'text-slate-400'} />
                  <span>Settings</span>
                </>
              )}
            </NavLink>
          </div>
        </div>

      </nav>

      {/* Logout at bottom */}
      <div className="px-4 py-4 border-t border-slate-100 flex-shrink-0">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all group"
        >
          <LogOut size={18} className="text-slate-400 group-hover:text-red-500" />
          <span>Logout</span>
        </button>
      </div>

    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Fixed under top navbar) */}
      <aside className="hidden lg:flex flex-col w-[270px] bg-white border-r border-slate-200/80 sticky top-[88px] sm:top-[92px] h-[calc(100vh-88px)] sm:h-[calc(100vh-92px)] flex-shrink-0 z-30 shadow-2xs">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onMobileClose} />
          <aside className="absolute left-0 top-0 h-full w-[270px] bg-white shadow-2xl z-50">
            <SidebarContent onNavigate={onMobileClose} />
          </aside>
        </div>
      )}
    </>
  );
}
