// AdminHeader — sticky top header with breadcrumb, search, notifications, avatar
import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  Search, Bell, Menu, ExternalLink, User, Settings, LogOut, ChevronDown,
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';

const BREADCRUMB_MAP = {
  '/admin': 'Dashboard',
  '/admin/products': 'Products / All Products',
  '/admin/products/add': 'Products / Add Product',
  '/admin/categories': 'Products / Categories',
  '/admin/inventory': 'Inventory',
  '/admin/orders': 'Orders',
  '/admin/customers': 'Customers',
  '/admin/reviews': 'Reviews',
  '/admin/content': 'Content Management',
  '/admin/users': 'Users & Roles',
  '/admin/settings': 'Settings',
};

export default function AdminHeader({ onMenuToggle }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { admin, logout } = useAdminAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const dropRef = useRef(null);
  const notifRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropdownOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const breadcrumb = (() => {
    const exact = BREADCRUMB_MAP[location.pathname];
    if (exact) return exact;
    if (location.pathname.startsWith('/admin/orders/')) return 'Orders / Order Details';
    if (location.pathname.startsWith('/admin/customers/')) return 'Customers / Customer Details';
    return 'Admin';
  })();

  const pageName = breadcrumb.split(' / ')[0];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-slate-100 shadow-sm">
      <div className="flex items-center justify-between h-14 px-4 lg:px-6">
        {/* Left: hamburger (mobile) + breadcrumb */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuToggle}
            className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
          >
            <Menu size={18} />
          </button>
          <div>
            <h2 className="font-sans font-bold text-slate-800 text-sm leading-none">{pageName}</h2>
            {breadcrumb.includes(' / ') && (
              <p className="text-[10px] text-slate-400 mt-0.5 font-sans">{breadcrumb}</p>
            )}
          </div>
        </div>

        {/* Right: search, view store, notifications, avatar */}
        <div className="flex items-center gap-2">
          {/* Search (desktop) */}
          <div className="hidden md:flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 w-48 lg:w-56">
            <Search size={13} className="text-slate-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent text-xs text-slate-600 placeholder-slate-400 outline-none w-full"
            />
          </div>

          {/* View Store */}
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <ExternalLink size={12} />
            View Store
          </a>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotifOpen(o => !o)}
              className="relative w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
            >
              <Bell size={16} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white" />
            </button>
            {notifOpen && (
              <div className="absolute right-0 top-10 w-72 bg-white rounded-xl border border-slate-100 shadow-xl z-50">
                <div className="px-4 py-3 border-b border-slate-100">
                  <h4 className="font-sans font-bold text-slate-800 text-sm">Notifications</h4>
                </div>
                <div className="divide-y divide-slate-50">
                  {[
                    { icon: '📦', text: '12 products are low on stock', time: '2 mins ago', dot: true },
                    { icon: '🛒', text: 'New order #SUK1028 received', time: '15 mins ago', dot: true },
                    { icon: '⭐', text: 'New review pending approval', time: '1 hour ago', dot: false },
                    { icon: '🔴', text: 'Navy Wrap Dress is out of stock', time: '3 hours ago', dot: false },
                  ].map((n, i) => (
                    <div key={i} className={`flex gap-3 px-4 py-3 hover:bg-slate-50 cursor-pointer ${n.dot ? 'bg-brand-powder/20' : ''}`}>
                      <span className="text-base flex-shrink-0">{n.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-slate-700 leading-relaxed">{n.text}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{n.time}</p>
                      </div>
                      {n.dot && <span className="w-2 h-2 bg-brand-teal rounded-full flex-shrink-0 mt-1" />}
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2.5 border-t border-slate-100">
                  <button className="text-xs font-semibold text-brand-teal hover:underline w-full text-center">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Avatar / dropdown */}
          <div className="relative" ref={dropRef}>
            <button
              onClick={() => setDropdownOpen(o => !o)}
              className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <div className="w-8 h-8 bg-brand-teal rounded-full flex items-center justify-center text-white font-bold text-xs font-sans flex-shrink-0">
                {admin?.avatar || 'A'}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-slate-800 leading-none">{admin?.name || 'Admin'}</p>
                <p className="text-[10px] text-slate-400 mt-0.5 capitalize">
                  {admin?.role?.replace(/_/g, ' ').toLowerCase() || 'Administrator'}
                </p>
              </div>
              <ChevronDown size={13} className="text-slate-400 hidden sm:block" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-11 w-44 bg-white rounded-xl border border-slate-100 shadow-xl z-50 py-1">
                {[
                  { icon: User, label: 'My Profile', to: '/admin/users' },
                  { icon: ExternalLink, label: 'View Store', href: '/', external: true },
                  { icon: Settings, label: 'Settings', to: '/admin/settings' },
                ].map(item => (
                  item.external ? (
                    <a
                      key={item.label}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <item.icon size={14} className="text-slate-400" />
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      key={item.label}
                      to={item.to}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <item.icon size={14} className="text-slate-400" />
                      {item.label}
                    </Link>
                  )
                ))}
                <div className="border-t border-slate-100 my-1" />
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={14} className="text-red-400" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
