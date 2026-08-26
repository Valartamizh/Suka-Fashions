// AdminSidebar — fixed left sidebar with navigation
import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Package, PackagePlus, LayoutGrid, Boxes,
  ShoppingBag, Users, Star, PanelsTopLeft, ShieldCheck,
  Settings, LogOut, ChevronDown, ChevronRight, X,
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';

const NAV_SECTIONS = [
  {
    label: 'PRODUCT MANAGEMENT',
    items: [
      {
        label: 'Products',
        icon: Package,
        children: [
          { label: 'All Products', to: '/admin/products' },
          { label: 'Add Product', to: '/admin/products/add' },
          { label: 'Categories', to: '/admin/categories' },
        ],
      },
      { label: 'Inventory', icon: Boxes, to: '/admin/inventory' },
    ],
  },
  {
    label: 'SALES',
    items: [
      { label: 'Orders', icon: ShoppingBag, to: '/admin/orders' },
      { label: 'Customers', icon: Users, to: '/admin/customers' },
    ],
  },
  {
    label: 'ENGAGEMENT',
    items: [
      { label: 'Reviews', icon: Star, to: '/admin/reviews' },
    ],
  },
  {
    label: 'STORE',
    items: [
      { label: 'Content Management', icon: PanelsTopLeft, to: '/admin/content' },
    ],
  },
  {
    label: 'ADMINISTRATION',
    items: [
      { label: 'Users & Roles', icon: ShieldCheck, to: '/admin/users' },
      { label: 'Settings', icon: Settings, to: '/admin/settings' },
    ],
  },
];

function NavItem({ item, depth = 0, collapsed, onNavigate }) {
  const location = useLocation();
  const [open, setOpen] = useState(() => {
    if (!item.children) return false;
    return item.children.some(c => location.pathname === c.to || location.pathname.startsWith(c.to));
  });

  const isChildActive = item.children?.some(c => location.pathname === c.to || location.pathname.startsWith(c.to + '/'));

  if (item.children) {
    return (
      <div>
        <button
          onClick={() => setOpen(o => !o)}
          className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
            isChildActive
              ? 'bg-brand-powder/70 text-brand-teal'
              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
          }`}
        >
          <div className="flex items-center gap-3">
            {isChildActive && <span className="w-0.5 h-4 bg-brand-teal rounded-full absolute left-0" />}
            <item.icon size={16} className={isChildActive ? 'text-brand-teal' : 'text-slate-400 group-hover:text-slate-600'} />
            {!collapsed && <span>{item.label}</span>}
          </div>
          {!collapsed && (
            open
              ? <ChevronDown size={14} className="text-slate-400" />
              : <ChevronRight size={14} className="text-slate-400" />
          )}
        </button>
        {open && !collapsed && (
          <div className="ml-7 mt-0.5 space-y-0.5 border-l border-slate-100 pl-3">
            {item.children.map(child => (
              <NavLink
                key={child.to}
                to={child.to}
                onClick={onNavigate}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-lg text-sm transition-all ${
                    isActive
                      ? 'text-brand-teal font-semibold bg-brand-powder/50'
                      : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                  }`
                }
              >
                {child.label}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <NavLink
      to={item.to}
      onClick={onNavigate}
      className={({ isActive }) =>
        `relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
          isActive
            ? 'bg-brand-powder/70 text-brand-teal'
            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
        }`
      }
    >
      {({ isActive }) => (
        <>
          {isActive && <span className="w-0.5 h-5 bg-brand-teal rounded-full absolute left-0" />}
          <item.icon size={16} className={isActive ? 'text-brand-teal' : 'text-slate-400 group-hover:text-slate-600'} />
          {!collapsed && <span>{item.label}</span>}
        </>
      )}
    </NavLink>
  );
}

export default function AdminSidebar({ mobileOpen, onMobileClose }) {
  const { logout } = useAdminAuth();

  const SidebarContent = ({ onNavigate }) => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-brand-teal rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs font-sans">SF</span>
            </div>
            <div>
              <p className="font-serif text-sm font-bold text-brand-navy leading-none">Suka Fashions</p>
              <p className="font-sans text-[9px] text-brand-teal font-bold tracking-widest uppercase mt-0.5">Admin Panel</p>
            </div>
          </div>
        </div>
        {/* Mobile close */}
        {onNavigate && (
          <button onClick={onNavigate} className="text-slate-400 lg:hidden">
            <X size={18} />
          </button>
        )}
      </div>

      {/* Dashboard link */}
      <div className="px-3 pt-3 pb-1">
        <NavLink
          to="/admin"
          end
          onClick={onNavigate}
          className={({ isActive }) =>
            `relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
              isActive
                ? 'bg-brand-teal text-white shadow-sm'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <LayoutDashboard size={16} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'} />
              <span>Dashboard</span>
            </>
          )}
        </NavLink>
      </div>

      {/* Nav sections */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-4 no-scrollbar">
        {NAV_SECTIONS.map(section => (
          <div key={section.label}>
            <p className="px-3 text-[10px] font-bold text-slate-300 tracking-widest uppercase mb-1.5">
              {section.label}
            </p>
            <div className="space-y-0.5">
              {section.items.map(item => (
                <NavItem key={item.label} item={item} onNavigate={onNavigate} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-slate-100 flex-shrink-0">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all group"
        >
          <LogOut size={16} className="text-slate-400 group-hover:text-red-500" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-[240px] bg-white border-r border-slate-100 fixed left-0 top-0 h-screen z-30 shadow-sm">
        <SidebarContent />
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onMobileClose} />
          <aside className="absolute left-0 top-0 h-full w-[260px] bg-white shadow-2xl">
            <SidebarContent onNavigate={onMobileClose} />
          </aside>
        </div>
      )}
    </>
  );
}
