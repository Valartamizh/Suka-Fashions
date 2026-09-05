// AdminHeader — Top navbar spanning full width (88px-96px height) with Suka branding, Admin Profile, Live Search, and Functional Notifications
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Search, Bell, Menu, ExternalLink, User, Settings, LogOut, ChevronDown,
  Package, ShoppingBag, Users, X, ArrowRight
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useCustomers } from '../../../context/CustomerContext';
import { useOrders } from '../../../context/OrderContext';
import { useSettings } from '../../../context/SettingsContext';
import { adminProducts } from '../../data/adminProducts';
import StatusBadge from '../ui/StatusBadge';
import logo from '../../../assets/logo.jpg';

const DEFAULT_NOTIFICATIONS = [
  {
    id: 'notif-1',
    type: 'order',
    icon: '🛒',
    title: 'New Order #SUK1028',
    message: 'Priya Sharma placed an order for ₹4,518',
    time: '5 mins ago',
    unread: true,
    link: '/admin/orders/SUK1028',
  },
  {
    id: 'notif-2',
    type: 'inventory',
    icon: '⚠️',
    title: 'Low Stock Alert',
    message: 'Crimson Bridal Velvet Lehenga is low on stock (3 remaining)',
    time: '25 mins ago',
    unread: true,
    link: '/admin/inventory',
  },
  {
    id: 'notif-3',
    type: 'review',
    icon: '⭐',
    title: 'New 5-Star Review',
    message: 'Ananya Krishnan reviewed "Teal Embroidered Saree"',
    time: '1 hour ago',
    unread: true,
    link: '/admin/reviews',
  },
  {
    id: 'notif-4',
    type: 'order',
    icon: '📦',
    title: 'Order Delivered #SUK1025',
    message: 'Sneha Patel received their order',
    time: '3 hours ago',
    unread: false,
    link: '/admin/orders/SUK1025',
  },
  {
    id: 'notif-5',
    type: 'customer',
    icon: '👤',
    title: 'New Customer Registered',
    message: 'Rhea Kapoor created a new customer account',
    time: '5 hours ago',
    unread: false,
    link: '/admin/customers',
  },
];

export default function AdminHeader({ onMenuToggle }) {
  const navigate = useNavigate();
  const { admin, logout } = useAdminAuth();
  const { customers } = useCustomers();
  const { adminOrders } = useOrders();
  const { settings } = useSettings();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifTab, setNotifTab] = useState('all'); // 'all' | 'unread'
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);

  // Persistent Notifications State
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem('suka_admin_notifications');
      return saved ? JSON.parse(saved) : DEFAULT_NOTIFICATIONS;
    } catch {
      return DEFAULT_NOTIFICATIONS;
    }
  });

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('suka_admin_notifications', JSON.stringify(notifications));
    } catch (e) {
      console.error('Failed to save notifications', e);
    }
  }, [notifications]);

  // Sync recent new adminOrders into notification list
  useEffect(() => {
    if (adminOrders && adminOrders.length > 0) {
      const newest = adminOrders[0];
      setNotifications((prev) => {
        const exists = prev.some((n) => n.id === `order-${newest.id}`);
        if (!exists && newest.id) {
          const newNotif = {
            id: `order-${newest.id}`,
            type: 'order',
            icon: '🛒',
            title: `New Order #${newest.id}`,
            message: `${newest.customer?.name || 'Customer'} placed an order for ₹${Number(newest.total || 0).toLocaleString('en-IN')}`,
            time: 'Just now',
            unread: true,
            link: `/admin/orders/${newest.id}`,
          };
          return [newNotif, ...prev];
        }
        return prev;
      });
    }
  }, [adminOrders]);

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => n.unread).length;
  }, [notifications]);

  const filteredNotifications = useMemo(() => {
    if (notifTab === 'unread') {
      return notifications.filter((n) => n.unread);
    }
    return notifications;
  }, [notifications, notifTab]);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const handleNotificationClick = (item) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === item.id ? { ...n, unread: false } : n))
    );
    setNotifOpen(false);
    if (item.link) {
      navigate(item.link);
    }
  };

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

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

    const matchedOrders = (adminOrders || []).filter(o =>
      (o.id && o.id.toLowerCase().includes(q)) ||
      (o.customer?.name && o.customer.name.toLowerCase().includes(q)) ||
      (o.customer?.phone && o.customer.phone.includes(q))
    ).slice(0, 4);

    const matchedCustomers = customers.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      (c.phone && c.phone.includes(q))
    ).slice(0, 4);

    return { products: matchedProducts, orders: matchedOrders, customers: matchedCustomers };
  }, [searchQuery, customers, adminOrders]);

  const hasResults =
    searchResults.products.length > 0 ||
    searchResults.orders.length > 0 ||
    searchResults.customers.length > 0;

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const [mobileSearchActive, setMobileSearchActive] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-slate-200/80 shadow-xs h-16 sm:h-[78px] lg:h-[88px] flex items-center px-3 sm:px-6 lg:px-8">
      <div className="w-full flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Left: Branding & Mobile Menu Toggle */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {/* Mobile hamburger */}
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Open Navigation Menu"
          >
            <Menu size={22} />
          </button>

          {/* Brand Logo & Title */}
          <Link to="/admin" className="flex items-center gap-2 sm:gap-3.5 group">
            <img
              src={logo}
              alt="Store Logo"
              className="w-9 h-9 sm:w-12 sm:h-12 lg:w-[52px] lg:h-[52px] rounded-full object-cover border border-brand-powder/60 shadow-sm flex-shrink-0 transition-transform group-hover:scale-105"
            />
            <div className="flex flex-col leading-none">
              <span className="font-serif text-base sm:text-xl lg:text-2xl font-bold text-brand-navy tracking-tight truncate max-w-[140px] sm:max-w-none">
                {settings?.store?.storeName || 'Suka Fashions'}
              </span>
              <span className="font-sans text-[8px] sm:text-[9.5px] lg:text-[10px] tracking-[0.2em] sm:tracking-[0.25em] text-brand-teal font-bold uppercase mt-0.5 sm:mt-1">
                ADMIN PANEL
              </span>
            </div>
          </Link>
        </div>

        {/* Center / Right: Search, Actions, Notifications & Admin Profile */}
        <div className="flex items-center gap-1.5 sm:gap-3 lg:gap-4 ml-auto">
          
          {/* Mobile Search Trigger (< md) */}
          <button
            type="button"
            onClick={() => setMobileSearchActive(true)}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Search"
          >
            <Search size={18} />
          </button>

          {/* Desktop & Tablet Global Search bar (>= md) */}
          <div className="relative hidden md:block" ref={searchRef}>
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 w-[220px] lg:w-[320px] xl:w-[400px] focus-within:border-brand-teal focus-within:ring-2 focus-within:ring-brand-teal/10 transition-all">
              <Search size={15} className="text-slate-400 flex-shrink-0" />
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
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Live Search Popup Overlay */}
            {searchOpen && searchQuery.trim() !== '' && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-xl border border-slate-200 shadow-2xl z-50 overflow-hidden max-h-[480px] overflow-y-auto animate-in fade-in zoom-in-95">
                
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
                              <span className="font-bold text-slate-900 flex-shrink-0">₹{Number(p.price || 0).toLocaleString('en-IN')}</span>
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
                                <p className="text-[10px] text-slate-500 font-medium">{o.customer?.name}</p>
                              </div>
                              <div className="flex items-center gap-3">
                                <StatusBadge status={o.status} />
                                <span className="font-bold text-slate-900">₹{Number(o.total || 0).toLocaleString('en-IN')}</span>
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
              className={`relative w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200/80 transition-colors shadow-2xs cursor-pointer ${
                notifOpen ? 'bg-slate-100 text-brand-teal' : 'text-slate-600 hover:bg-slate-50'
              }`}
              aria-label="Notifications"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-red-500 text-white font-bold text-[10px] rounded-full flex items-center justify-center border-2 border-white shadow-xs animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 top-12 w-80 sm:w-96 bg-white rounded-xl border border-slate-200 shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95">
                {/* Header */}
                <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <div className="flex items-center gap-2">
                    <h4 className="font-sans font-bold text-slate-800 text-sm">Notifications</h4>
                    {unreadCount > 0 ? (
                      <span className="text-[10px] bg-red-50 text-red-600 font-bold px-2 py-0.5 rounded-full border border-red-200/60">
                        {unreadCount} New
                      </span>
                    ) : (
                      <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full border border-emerald-200/60">
                        All Read
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-[11px] font-semibold text-brand-teal hover:underline cursor-pointer flex items-center gap-1"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                {/* Filter Tabs */}
                <div className="flex border-b border-slate-100 bg-white px-3 pt-2">
                  <button
                    onClick={() => setNotifTab('all')}
                    className={`pb-2 px-2.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
                      notifTab === 'all'
                        ? 'border-brand-teal text-brand-teal'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    All ({notifications.length})
                  </button>
                  <button
                    onClick={() => setNotifTab('unread')}
                    className={`pb-2 px-2.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                      notifTab === 'unread'
                        ? 'border-brand-teal text-brand-teal'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Unread ({unreadCount})
                  </button>
                </div>

                {/* Notification Items List */}
                <div className="divide-y divide-slate-100 max-h-[340px] overflow-y-auto">
                  {filteredNotifications.length === 0 ? (
                    <div className="p-8 text-center text-slate-400">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-2 text-slate-500">
                        <Bell size={18} />
                      </div>
                      <p className="text-xs font-semibold text-slate-600">No notifications</p>
                      <p className="text-[11px] mt-0.5">You're all caught up!</p>
                    </div>
                  ) : (
                    filteredNotifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => handleNotificationClick(n)}
                        className={`flex items-start gap-3 px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors group relative ${
                          n.unread ? 'bg-brand-powder/20' : 'bg-white'
                        }`}
                      >
                        <div className="text-xl flex-shrink-0 mt-0.5">{n.icon}</div>
                        <div className="flex-1 min-w-0 pr-4">
                          <p className={`text-xs leading-snug font-semibold ${n.unread ? 'text-slate-900' : 'text-slate-700'}`}>
                            {n.title}
                          </p>
                          <p className="text-[11px] text-slate-600 leading-normal mt-0.5 line-clamp-2">
                            {n.message}
                          </p>
                          <span className="text-[10px] text-slate-400 mt-1 block font-medium">
                            {n.time}
                          </span>
                        </div>

                        {/* Unread indicator / remove button */}
                        <div className="flex items-center gap-1.5 flex-shrink-0 mt-1">
                          {n.unread && (
                            <span className="w-2 h-2 bg-brand-teal rounded-full group-hover:hidden" />
                          )}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(n.id);
                            }}
                            className="hidden group-hover:flex p-1 text-slate-400 hover:text-red-500 rounded hover:bg-slate-100 transition-colors"
                            title="Dismiss"
                          >
                            <X size={13} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Footer */}
                <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between text-xs">
                  {notifications.length > 0 && (
                    <button
                      onClick={clearAllNotifications}
                      className="font-medium text-slate-500 hover:text-red-600 transition-colors cursor-pointer"
                    >
                      Clear all
                    </button>
                  )}
                  <Link
                    to="/admin/orders"
                    onClick={() => setNotifOpen(false)}
                    className="font-semibold text-brand-teal hover:underline ml-auto flex items-center gap-1"
                  >
                    <span>View all orders</span>
                    <ArrowRight size={12} />
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

      {/* Mobile Search Overlay (< md) */}
      {mobileSearchActive && (
        <div className="md:hidden fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex flex-col justify-start p-3 animate-in fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl p-3 space-y-3">
            <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus-within:border-brand-teal focus-within:bg-white">
              <Search size={16} className="text-slate-400" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, orders, customers..."
                className="bg-transparent text-xs text-slate-700 outline-none w-full font-medium"
              />
              <button
                type="button"
                onClick={() => {
                  setMobileSearchActive(false);
                  setSearchQuery('');
                }}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X size={16} />
              </button>
            </div>

            {/* Results in mobile popup */}
            {searchQuery.trim() !== '' && (
              <div className="max-h-[60vh] overflow-y-auto divide-y divide-slate-100 text-xs">
                {hasResults ? (
                  <>
                    {searchResults.products.map(p => (
                      <div
                        key={p.id}
                        onClick={() => {
                          navigate(`/admin/products`);
                          setMobileSearchActive(false);
                        }}
                        className="flex items-center gap-2.5 p-2 hover:bg-slate-50 rounded-lg cursor-pointer"
                      >
                        <img src={p.image} alt={p.name} className="w-8 h-10 object-cover rounded-md flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-slate-800 truncate">{p.name}</p>
                          <p className="text-[10px] text-slate-400">{p.sku} · ₹{Number(p.price || 0).toLocaleString('en-IN')}</p>
                        </div>
                      </div>
                    ))}
                    {searchResults.orders.map(o => (
                      <div
                        key={o.id}
                        onClick={() => {
                          navigate(`/admin/orders/${o.id}`);
                          setMobileSearchActive(false);
                        }}
                        className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg cursor-pointer"
                      >
                        <div>
                          <p className="font-mono font-bold text-brand-teal">#{o.id}</p>
                          <p className="text-[10px] text-slate-500">{o.customer?.name}</p>
                        </div>
                        <span className="font-bold text-slate-800">₹{Number(o.total || 0).toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                    {searchResults.customers.map(c => (
                      <div
                        key={c.id}
                        onClick={() => {
                          navigate(`/admin/customers/${c.id}`);
                          setMobileSearchActive(false);
                        }}
                        className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg cursor-pointer"
                      >
                        <div>
                          <p className="font-semibold text-slate-800">{c.name}</p>
                          <p className="text-[10px] text-slate-400">{c.email}</p>
                        </div>
                        <span className="text-[10px] text-slate-500">{c.phone}</span>
                      </div>
                    ))}
                  </>
                ) : (
                  <p className="p-4 text-center text-slate-400 text-xs">No matching results for "{searchQuery}"</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
