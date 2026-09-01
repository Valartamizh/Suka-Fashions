// AdminHeader — Top navbar spanning full width (88px-96px height) with Suka branding, Admin Profile, and Functional Live Search
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  Search, Bell, Menu, ExternalLink, User, Settings, LogOut, ChevronDown,
  Package, ShoppingBag, Users, X, ArrowRight
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useCustomers } from '../../../context/CustomerContext';
import { adminProducts } from '../../data/adminProducts';
import { adminOrders } from '../../data/adminOrders';
import StatusBadge from '../ui/StatusBadge';
import logo from '../../../assets/logo.jpg';

export default function AdminHeader({ onMenuToggle }) {
  const navigate = useNavigate();
  const { admin, logout } = useAdminAuth();
  const { customers } = useCustomers();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);

  const dropRef = useRef(null);
  const notifRef = useRef(null);
  const searchRef = useRef(null);

  // Close dropdowns & search on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropdownOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Compute instant live search results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return { products: [], orders: [], customers: [] };
    const q = searchQuery.toLowerCase().trim();

    const matchedProducts = adminProducts.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q)
    ).slice(0, 4);

    const matchedOrders = adminOrders.filter(o =>
      o.id.toLowerCase().includes(q) ||
      o.customer.name.toLowerCase().includes(q) ||
      (o.customer.phone && o.customer.phone.includes(q))
    ).slice(0, 4);

    const matchedCustomers = customers.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      (c.phone && c.phone.includes(q))
    ).slice(0, 4);

    return { products: matchedProducts, orders: matchedOrders, customers: matchedCustomers };
  }, [searchQuery, customers]);

  const hasResults =
    searchResults.products.length > 0 ||
    searchResults.orders.length > 0 ||
    searchResults.customers.length > 0;

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
          
          {/* Global Search bar */}
          <div className="relative hidden md:block" ref={searchRef}>
            <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 w-[320px] lg:w-[420px] focus-within:border-brand-teal focus-within:ring-2 focus-within:ring-brand-teal/10 transition-all">
              <Search size={16} className="text-slate-400 flex-shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setSearchOpen(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSearchOpen(true);
                }}
                placeholder="Search products, orders, customers..."
                className="bg-transparent text-xs text-slate-700 placeholder-slate-400 outline-none w-full font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-slate-400 hover:text-slate-600 transition-colors p-0.5"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Live Search Popup Overlay */}
            {searchOpen && searchQuery.trim() !== '' && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-xl border border-slate-200 shadow-2xl z-50 overflow-hidden max-h-[500px] overflow-y-auto animate-in fade-in zoom-in-95">
                
                {hasResults ? (
                  <div className="divide-y divide-slate-100 text-xs">
                    
                    {/* Products Section */}
                    {searchResults.products.length > 0 && (
                      <div className="p-3">
                        <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-brand-teal mb-2 px-1">
                          <Package size={13} />
                          <span>Products ({searchResults.products.length})</span>
                        </div>
                        <div className="space-y-1">
                          {searchResults.products.map(p => (
                            <div
                              key={p.id}
                              onClick={() => {
                                navigate(`/admin/products`);
                                setSearchOpen(false);
                              }}
                              className="flex items-center gap-3 p-2 rounded-lg hover:bg-brand-powder/20 cursor-pointer transition-colors group"
                            >
                              <img
                                src={p.image}
                                alt={p.name}
                                className="w-9 h-11 object-cover rounded-md border border-slate-100 flex-shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-slate-800 truncate group-hover:text-brand-teal transition-colors">{p.name}</p>
                                <p className="text-[10px] text-slate-400 font-mono mt-0.5">{p.sku} · {p.category}</p>
                              </div>
                              <span className="font-bold text-slate-900 flex-shrink-0">₹{p.price.toLocaleString('en-IN')}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Orders Section */}
                    {searchResults.orders.length > 0 && (
                      <div className="p-3">
                        <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-brand-teal mb-2 px-1">
                          <ShoppingBag size={13} />
                          <span>Orders ({searchResults.orders.length})</span>
                        </div>
                        <div className="space-y-1">
                          {searchResults.orders.map(o => (
                            <div
                              key={o.id}
                              onClick={() => {
                                navigate(`/admin/orders/${o.id}`);
                                setSearchOpen(false);
                              }}
                              className="flex items-center justify-between p-2 rounded-lg hover:bg-brand-powder/20 cursor-pointer transition-colors group"
                            >
                              <div className="min-w-0">
                                <p className="font-mono font-bold text-brand-teal group-hover:underline">#{o.id}</p>
                                <p className="text-[10px] text-slate-500 font-medium">{o.customer.name}</p>
                              </div>
                              <div className="flex items-center gap-3">
                                <StatusBadge status={o.status} />
                                <span className="font-bold text-slate-900">₹{o.total.toLocaleString('en-IN')}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Customers Section */}
                    {searchResults.customers.length > 0 && (
                      <div className="p-3">
                        <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-brand-teal mb-2 px-1">
                          <Users size={13} />
                          <span>Customers ({searchResults.customers.length})</span>
                        </div>
                        <div className="space-y-1">
                          {searchResults.customers.map(c => (
                            <div
                              key={c.id}
                              onClick={() => {
                                navigate(`/admin/customers/${c.id}`);
                                setSearchOpen(false);
                              }}
                              className="flex items-center justify-between p-2 rounded-lg hover:bg-brand-powder/20 cursor-pointer transition-colors group"
                            >
                              <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 bg-brand-powder rounded-full flex items-center justify-center text-brand-teal font-bold text-xs">
                                  {c.name.charAt(0)}
                                </div>
                                <div>
                                  <p className="font-semibold text-slate-800 group-hover:text-brand-teal">{c.name}</p>
                                  <p className="text-[10px] text-slate-400">{c.email}</p>
                                </div>
                              </div>
                              <span className="text-[11px] font-semibold text-slate-500">{c.phone}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>
                ) : (
                  <div className="p-6 text-center text-slate-400 text-xs">
                    <p className="font-semibold text-slate-600">No results found</p>
                    <p className="mt-1">No matching products, orders or customers for "{searchQuery}"</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* View Store Button */}
          <Link
            to="/"
            className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <ExternalLink size={14} className="text-slate-500" />
            <span>View Store</span>
          </Link>

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
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                      <item.icon size={14} className="text-slate-400" />
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      key={item.label}
                      to={item.to}
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                      <item.icon size={14} className="text-slate-400" />
                      {item.label}
                    </Link>
                  )
                ))}
                <div className="border-t border-slate-100 my-1" />
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors text-left"
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
