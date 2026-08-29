// AdminLayout — wraps all admin pages with header + sidebar
import React, { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import { useAdminAuth } from '../../context/AdminAuthContext';

export default function AdminLayout() {
  const { isAuthenticated } = useAdminAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Navbar spans full width */}
      <AdminHeader onMenuToggle={() => setMobileOpen(true)} />

      {/* Main area below navbar */}
      <div className="flex flex-1 min-w-0">
        {/* Fixed/Sticky Sidebar */}
        <AdminSidebar
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
        />

        {/* Page Content */}
        <main className="flex-1 p-6 lg:p-8 overflow-x-hidden min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
