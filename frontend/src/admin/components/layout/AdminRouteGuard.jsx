// AdminRouteGuard — Enforces role and permission route protection with luxury Access Denied view
import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home, Lock } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { roleLabels, ROLE_BADGE_STYLES } from '../../data/adminUsers';

export default function AdminRouteGuard({
  children,
  allowedRoles,
  requiredModule,
  requiredAction = 'view',
}) {
  const { admin, hasPermission } = useAdminAuth();

  if (!admin) {
    return null; // Will redirect via AdminLayout
  }

  // Role check if allowedRoles provided
  let isAuthorized = true;

  if (allowedRoles && allowedRoles.length > 0) {
    isAuthorized = allowedRoles.includes(admin.role);
  }

  // Granular module permission check if specified
  if (isAuthorized && requiredModule) {
    isAuthorized = hasPermission(requiredModule, requiredAction);
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200/80 shadow-xl p-8 text-center animate-in fade-in zoom-in-95 duration-200">
          
          {/* Shield Icon */}
          <div className="w-16 h-16 rounded-full bg-red-50 border-2 border-red-100 text-red-600 flex items-center justify-center mx-auto mb-5 shadow-xs">
            <ShieldAlert size={32} />
          </div>

          <span className="text-[10px] font-sans font-extrabold uppercase tracking-[0.2em] text-red-600 bg-red-50 px-3 py-1 rounded-full inline-block mb-3 border border-red-200/60">
            RESTRICTED ACCESS
          </span>

          <h2 className="font-serif text-2xl sm:text-3xl text-slate-900 font-bold mb-2">
            Access Denied
          </h2>

          <p className="text-sm text-slate-500 max-w-xs mx-auto mb-6">
            You don't have permission to access this page.
          </p>

          {/* Current Role Indicator */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 mb-6 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Your current role:</span>
            <span className={`text-[11px] px-2.5 py-0.5 rounded-full ${ROLE_BADGE_STYLES[admin.role] || 'bg-slate-100 text-slate-700'}`}>
              {roleLabels[admin.role] || admin.role}
            </span>
          </div>

          {/* Navigation action */}
          <Link
            to="/admin"
            className="w-full inline-flex items-center justify-center gap-2 bg-brand-teal hover:bg-brand-tealDark text-white text-xs font-bold uppercase tracking-wider py-3.5 px-6 rounded-xl transition-all shadow-md shadow-brand-teal/20 hover:shadow-lg active:scale-98"
          >
            <Home size={15} />
            <span>Back to Dashboard</span>
          </Link>

        </div>
      </div>
    );
  }

  return children;
}
