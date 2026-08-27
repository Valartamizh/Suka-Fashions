// AdminHeader — Top navbar spanning full width (88px-96px height) with Suka branding and Admin Profile
import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  Search, Bell, Menu, ExternalLink, User, Settings, LogOut, ChevronDown,
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import logo from '../../../assets/logo.jpg';

export default function AdminHeader({ onMenuToggle }) {
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

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-200/80 shadow-xs h-[88px] sm:h-[92px] flex items-center px-4 sm:px-6 lg:px-8">
      <div className="w-full flex items-center justify-between gap-4">
        
        {/* Left: Branding & Mobile Menu Toggle */}
        <div className="flex items-center gap-3 w-auto lg:w-[270px] flex-shrink-0">
          {/* Mobile hamburger */}
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Open Mobile Menu"
          >
            <Menu size={22} />
          </button>

          {/* Suka Fashions Brand Logo & Title */}
          <Link to="/admin" className="flex items-center gap-3.5 group">
            <img
              src={logo}
              alt="Suka Fashions Logo"
              className="w-[52px] h-[52px] sm:w-[58px] sm:h-[58px] rounded-full object-cover border border-brand-powder/60 shadow-sm flex-shrink-0 transition-transform group-hover:scale-105"
            />
            <div className="flex flex-col leading-none">
              <span className="font-serif text-2xl sm:text-[26px] font-bold text-brand-navy tracking-tight">
                Suka Fashions
              </span>
              <span className="font-sans text-[10px] tracking-[0.25em] text-brand-teal font-bold uppercase mt-1">
                ADMIN PANEL
              </span>
            </div>
          </Link>
        </div>

        {/* Center / Right: Search, Actions, Notifications & Admin Profile */}
        <div className="flex items-center gap-3 sm:gap-4 ml-auto">
          
          {/* Search bar */}
          <div className="hidden md:flex items-center gap-2.5 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 w-[320px] lg:w-[400px] focus-within:border-brand-teal focus-within:ring-2 focus-within:ring-brand-teal/10 transition-all">
            <Search size={16} className="text-slate-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search anything..."
              className="bg-transparent text-xs text-slate-700 placeholder-slate-400 outline-none w-full font-medium"
            />
          </div>

          {/* View Store Button */}
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <ExternalLink size={14} className="text-slate-500" />
            <span>View Store</span>
          </a>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotifOpen(o => !o)}
              className="relative w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200/80 text-slate-600 hover:bg-slate-50 transition-colors shadow-2xs"
              aria-label="Notifications"
            >
              <Bell size={18} />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white font-bold text-[9px] rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                3
              </span>
            </button>

            {notifOpen && (
              <div className="absolute right-0 top-12 w-72 bg-white rounded-xl border border-slate-100 shadow-xl z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                  <h4 className="font-sans font-bold text-slate-800 text-sm">Notifications</h4>
                  <span className="text-[10px] bg-red-50 text-red-600 font-bold px-2 py-0.5 rounded-full">3 New</span>
                </div>
                <div className="divide-y divide-slate-50 max-h-64 overflow-y-auto">
                  {[
                    { icon: '📦', text: '12 products are low on stock', time: '2 mins ago', dot: true },
                    { icon: '🛒', text: 'New order #SUK1028 received', time: '15 mins ago', dot: true },
                    { icon: '⭐', text: 'New review pending approval', time: '1 hour ago', dot: true },
                    { icon: '🔴', text: 'Navy Wrap Dress is out of stock', time: '3 hours ago', dot: false },
                  ].map((n, i) => (
                    <div key={i} className={`flex gap-3 px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors ${n.dot ? 'bg-brand-powder/20' : ''}`}>
                      <span className="text-base flex-shrink-0">{n.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-slate-700 leading-relaxed font-medium">{n.text}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{n.time}</p>
                      </div>
                      {n.dot && <span className="w-2 h-2 bg-brand-teal rounded-full flex-shrink-0 mt-1" />}
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50/50">
                  <Link to="/admin/orders" className="text-xs font-semibold text-brand-teal hover:underline block text-center">
                    View all notifications
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Admin Profile Dropdown */}
          <div className="relative" ref={dropRef}>
            <button
              onClick={() => setDropdownOpen(o => !o)}
              className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-xl hover:bg-slate-50 transition-colors"
            >
              <div className="w-10 h-10 bg-brand-teal rounded-full flex items-center justify-center text-white font-bold text-xs font-sans flex-shrink-0 shadow-sm">
                {admin?.avatar || 'AS'}
              </div>
              <div className="hidden sm:block text-left leading-tight">
                <p className="text-xs font-bold text-slate-800">{admin?.name || 'Aditi Sharma'}</p>
                <p className="text-[11px] text-slate-400 font-medium mt-0.5">Super Admin</p>
              </div>
              <ChevronDown size={14} className="text-slate-400 hidden sm:block ml-0.5" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-12 w-48 bg-white rounded-xl border border-slate-100 shadow-xl z-50 py-1.5 overflow-hidden">
                <div className="px-4 py-2 border-b border-slate-100 sm:hidden">
                  <p className="text-xs font-bold text-slate-800">{admin?.name || 'Aditi Sharma'}</p>
                  <p className="text-[10px] text-slate-400">Super Admin</p>
                </div>
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
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-brand-teal transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <item.icon size={15} className="text-slate-400" />
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      key={item.label}
                      to={item.to}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-brand-teal transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <item.icon size={15} className="text-slate-400" />
                      {item.label}
                    </Link>
                  )
                ))}
                <div className="border-t border-slate-100 my-1" />
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={15} className="text-red-400" />
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
