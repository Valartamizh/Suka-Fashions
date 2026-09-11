// Admin Auth Context — Centralized authentication, 4-role hierarchy, granular permissions, and audit trails
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  initialAdminUsers,
  initialAuditLogs,
  ROLES,
  STAFF_PRESETS,
  getDefaultPermissions,
  getAvatarInitials,
} from '../data/adminUsers';

const AdminAuthContext = createContext(null);

const SESSION_STORAGE_KEY = 'suka_admin_session';
const USERS_STORAGE_KEY = 'suka_admin_users_v2'; // v2 for granular schema
const AUDIT_LOGS_KEY = 'suka_admin_audit_logs_v2';
const SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000; // 30 Days

const DEFAULT_SUPER_ADMIN = initialAdminUsers[0]; // Valar Tamizh (Developer)

function getPersistedAdminSession() {
  try {
    let raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) raw = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return DEFAULT_SUPER_ADMIN;

    const session = JSON.parse(raw);
    if (!session || !session.email) return DEFAULT_SUPER_ADMIN;

    if (session.expiresAt && Date.now() > Number(session.expiresAt)) {
      localStorage.removeItem(SESSION_STORAGE_KEY);
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
      return DEFAULT_SUPER_ADMIN;
    }

    return session;
  } catch (err) {
    console.warn('Error restoring admin session:', err);
    return DEFAULT_SUPER_ADMIN;
  }
}

function sanitizeUser(u) {
  let title = u.title || '';
  title = title
    .replace(/^Employee\s*—\s*/i, '')
    .replace(/Developer\s*\/\s*Technical Administrator/i, 'System Administrator')
    .replace(/Business Owner/i, 'Store Administrator')
    .replace(/Store Manager/i, 'Operations Manager');
  return { ...u, title };
}

function getPersistedUsers() {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map(sanitizeUser);
      }
    }
  } catch (_) {}
  return initialAdminUsers;
}

function getPersistedAuditLogs() {
  try {
    const raw = localStorage.getItem(AUDIT_LOGS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (_) {}
  return initialAuditLogs;
}

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(getPersistedAdminSession);
  const [users, setUsers] = useState(getPersistedUsers);
  const [auditLogs, setAuditLogs] = useState(getPersistedAuditLogs);

  // Sync users to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    } catch (e) {
      console.error('Failed to persist admin users:', e);
    }
  }, [users]);

  // Sync audit logs to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(AUDIT_LOGS_KEY, JSON.stringify(auditLogs));
    } catch (e) {
      console.error('Failed to persist audit logs:', e);
    }
  }, [auditLogs]);

  // Append new audit log entry
  const logAction = useCallback((action, target, details) => {
    const newLog = {
      id: `LOG${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toISOString(),
      actorName: admin?.name || 'Administrator',
      actorRole: admin?.role || ROLES.SUPER_ADMIN,
      action,
      target,
      details,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  }, [admin]);

  // Centralized Permission Checker (Supports "module.action" OR module, action)
  const hasPermission = useCallback((moduleOrPath, action = 'view') => {
    if (!admin) return false;
    const role = admin.role;

    // Super Admin has unrestricted access to everything
    if (role === ROLES.SUPER_ADMIN) return true;

    // Parse path: e.g. "inventory.update" -> module="inventory", action="update"
    let mod = moduleOrPath;
    let act = action;
    if (typeof moduleOrPath === 'string' && moduleOrPath.includes('.')) {
      const parts = moduleOrPath.split('.');
      mod = parts[0];
      act = parts[1];
    }

    // ADMIN (Owner)
    if (role === ROLES.ADMIN) {
      if (mod === 'system' || mod === 'developerSettings' || mod === 'systemSettings') return false;
      if (mod === 'users') {
        if (act === 'create_super_admin' || act === 'delete_super_admin') return false;
        return true;
      }
      return true;
    }

    // MANAGER & STAFF: Check user's granular permissions
    if (mod === 'users' || mod === 'settings' || mod === 'businessSettings' || mod === 'systemSettings') {
      return false; // Manager & Staff can never access Users & Roles or System Settings
    }

    const userPerms = admin.permissions;
    if (!userPerms) return false;

    // If module check only (e.g. for sidebar or route guard)
    if (act === 'view') {
      if (mod === 'dashboard') return !!userPerms.dashboard?.view;
      if (mod === 'products') return !!userPerms.products?.view;
      if (mod === 'categories') return !!userPerms.products?.view;
      if (mod === 'inventory') return !!userPerms.inventory?.view;
      if (mod === 'orders') return !!userPerms.orders?.view;
      if (mod === 'customers') return !!userPerms.customers?.limitedView || !!userPerms.customers?.fullView;
      if (mod === 'reviews') return !!userPerms.reviews?.view || !!userPerms.reviews?.manage;
      if (mod === 'content') return !!userPerms.content?.view || !!userPerms.content?.edit;
      if (mod === 'reports') return !!userPerms.reports?.operational || !!userPerms.reports?.sales;
    }

    // Granular check: e.g. products.create, orders.refund, inventory.update
    if (userPerms[mod] && userPerms[mod][act] !== undefined) {
      return !!userPerms[mod][act];
    }

    return false;
  }, [admin]);

  const canPerform = useCallback((actionPath) => {
    return hasPermission(actionPath);
  }, [hasPermission]);

  // Login
  const login = (email, password, remember = true) => {
    if (!email || !password) {
      return { success: false, error: 'Email and password are required' };
    }

    const cleanEmail = email.toLowerCase().trim();
    const foundUser = users.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!foundUser) {
      return { success: false, error: 'No administrative account found with this email' };
    }

    if (foundUser.status === 'inactive') {
      return { success: false, error: 'This account has been deactivated. Please contact the Business Owner.' };
    }

    if (password !== 'admin123' && password !== 'password') {
      return { success: false, error: 'Invalid password. (Use demo password: admin123)' };
    }

    const now = Date.now();
    const session = {
      ...foundUser,
      loginTime: now,
      lastActive: now,
      expiresAt: now + SESSION_DURATION_MS,
    };

    setAdmin(session);
    try {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
      if (!remember) sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    } catch (e) {
      console.error('Failed to store session:', e);
    }

    setUsers((prev) =>
      prev.map((u) => (u.id === foundUser.id ? { ...u, lastLogin: new Date().toISOString() } : u))
    );

    logAction('LOGIN', `${foundUser.name} (${foundUser.role})`, 'Logged in to admin console');
    return { success: true };
  };

  const logout = () => {
    logAction('LOGOUT', `${admin?.name || 'User'}`, 'Logged out of admin console');
    setAdmin(null);
    try {
      localStorage.removeItem(SESSION_STORAGE_KEY);
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
    } catch (_) {}
  };

  // Switch demo preview role & preset
  const switchDemoRole = (role, preset = null) => {
    let candidate = users.find((u) => {
      if (u.status !== 'active') return false;
      if (u.role !== role) return false;
      if (preset && u.preset !== preset) return false;
      return true;
    });

    if (!candidate) {
      candidate = users.find((u) => u.role === role && u.status === 'active') || {
        id: `USR_DEMO_${role}`,
        name: `Demo ${role}`,
        email: `${role.toLowerCase()}@sukafashions.com`,
        role,
        status: 'active',
        avatar: role.slice(0, 2),
        preset: preset || (role === ROLES.STAFF ? STAFF_PRESETS.STANDARD : null),
        permissions: getDefaultPermissions(role, preset || STAFF_PRESETS.STANDARD),
      };
    }

    const session = {
      ...candidate,
      loginTime: Date.now(),
      lastActive: Date.now(),
      expiresAt: Date.now() + SESSION_DURATION_MS,
    };

    setAdmin(session);
    try {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    } catch (_) {}

    logAction('ROLE_SWITCHED_DEMO', candidate.name, `Switched preview role to ${role}`);
  };

  // Add User with Presets & Granular Permissions
  const addUser = (userData) => {
    const newId = `USR${String(users.length + 1).padStart(3, '0')}`;
    const name = `${userData.firstName.trim()} ${userData.lastName.trim()}`.trim();
    const avatar = getAvatarInitials(name);

    const role = userData.role;
    const preset = userData.preset || (role === ROLES.STAFF ? STAFF_PRESETS.STANDARD : null);
    const useRoleDefaults = userData.useRoleDefaults !== undefined ? userData.useRoleDefaults : true;
    
    // Compute permissions: use custom if provided, otherwise default
    const permissions = userData.permissions || getDefaultPermissions(role, preset);

    const newUser = {
      id: newId,
      firstName: userData.firstName.trim(),
      lastName: userData.lastName.trim(),
      name,
      email: userData.email.trim().toLowerCase(),
      phone: userData.phone?.trim() || '',
      role,
      status: userData.status || 'active',
      title: userData.title || (role === ROLES.STAFF ? (preset || 'Staff Member') : role),
      avatar,
      createdAt: new Date().toISOString().split('T')[0],
      lastLogin: null,
      preset,
      useRoleDefaults,
      permissions,
    };

    setUsers((prev) => [...prev, newUser]);
    logAction('USER_CREATED', `${newUser.name} (${newUser.role})`, `Created account with ${preset || 'standard'} permissions`);
    return { success: true, user: newUser };
  };

  // Update User Details
  const updateUser = (id, updates) => {
    const targetUser = users.find((u) => u.id === id);
    if (!targetUser) return { success: false, error: 'User not found' };

    if (admin?.role === ROLES.ADMIN && targetUser.role === ROLES.SUPER_ADMIN) {
      return { success: false, error: 'Access denied: Admin cannot modify Super Admin accounts' };
    }

    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const updatedName = updates.firstName && updates.lastName
            ? `${updates.firstName.trim()} ${updates.lastName.trim()}`
            : u.name;
          return {
            ...u,
            ...updates,
            name: updatedName,
            avatar: getAvatarInitials(updatedName),
          };
        }
        return u;
      })
    );

    // If editing self, update active session
    if (admin && admin.id === id) {
      setAdmin((prev) => ({ ...prev, ...updates }));
    }

    logAction('USER_UPDATED', targetUser.name, 'Updated user profile information');
    return { success: true };
  };

  // Update User Permissions
  const updateUserPermissions = (id, newPermissions, preset = 'Custom') => {
    const targetUser = users.find((u) => u.id === id);
    if (!targetUser) return { success: false, error: 'User not found' };

    if (admin?.role === ROLES.ADMIN && targetUser.role === ROLES.SUPER_ADMIN) {
      return { success: false, error: 'Access denied: Admin cannot modify Super Admin permissions' };
    }

    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? {
              ...u,
              permissions: newPermissions,
              preset,
              useRoleDefaults: false,
            }
          : u
      )
    );

    if (admin && admin.id === id) {
      setAdmin((prev) => ({
        ...prev,
        permissions: newPermissions,
        preset,
        useRoleDefaults: false,
      }));
    }

    logAction(
      'PERMISSION_CHANGED',
      targetUser.name,
      `Customized permissions applied (${preset})`
    );

    return { success: true };
  };

  // Change User Role
  const changeUserRole = (id, newRole, preset = null) => {
    const targetUser = users.find((u) => u.id === id);
    if (!targetUser) return { success: false, error: 'User not found' };

    if (admin?.role === ROLES.ADMIN) {
      if (targetUser.role === ROLES.SUPER_ADMIN) {
        return { success: false, error: 'Access denied: Admin cannot alter Super Admin accounts' };
      }
      if (newRole === ROLES.SUPER_ADMIN || newRole === ROLES.ADMIN) {
        return { success: false, error: 'Access denied: Admin can only assign Manager or Staff roles' };
      }
    }

    // Safeguard: Prevent changing role of the LAST active Super Admin
    if (targetUser.role === ROLES.SUPER_ADMIN && newRole !== ROLES.SUPER_ADMIN) {
      const activeSuperAdmins = users.filter(
        (u) => u.role === ROLES.SUPER_ADMIN && u.status === 'active' && u.id !== id
      );
      if (activeSuperAdmins.length === 0) {
        return {
          success: false,
          error: 'Protection lockout: Cannot change the role of the only active Super Admin account!',
        };
      }
    }

    const assignedPreset = preset || (newRole === ROLES.STAFF ? STAFF_PRESETS.STANDARD : null);
    const newPermissions = getDefaultPermissions(newRole, assignedPreset);

    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? {
              ...u,
              role: newRole,
              preset: assignedPreset,
              useRoleDefaults: true,
              permissions: newPermissions,
            }
          : u
      )
    );

    if (admin && admin.id === id) {
      setAdmin((prev) => ({
        ...prev,
        role: newRole,
        preset: assignedPreset,
        useRoleDefaults: true,
        permissions: newPermissions,
      }));
    }

    logAction('ROLE_CHANGED', targetUser.name, `Role changed from ${targetUser.role} → ${newRole}`);
    return { success: true };
  };

  // Toggle User Active / Inactive Status
  const toggleUserStatus = (id) => {
    const targetUser = users.find((u) => u.id === id);
    if (!targetUser) return { success: false, error: 'User not found' };

    if (admin?.role === ROLES.ADMIN && targetUser.role === ROLES.SUPER_ADMIN) {
      return { success: false, error: 'Access denied: Admin cannot disable Super Admin accounts' };
    }

    // Safeguard: Prevent disabling the LAST active Super Admin
    if (targetUser.role === ROLES.SUPER_ADMIN && targetUser.status === 'active') {
      const otherActiveSuperAdmins = users.filter(
        (u) => u.role === ROLES.SUPER_ADMIN && u.status === 'active' && u.id !== id
      );
      if (otherActiveSuperAdmins.length === 0) {
        return {
          success: false,
          error: 'Protection lockout: Cannot deactivate the only active Super Admin account!',
        };
      }
    }

    const nextStatus = targetUser.status === 'active' ? 'inactive' : 'active';

    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: nextStatus } : u))
    );

    logAction(
      'USER_DEACTIVATED',
      targetUser.name,
      `Status toggled to ${nextStatus.toUpperCase()}`
    );

    return { success: true, status: nextStatus };
  };

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        users,
        auditLogs,
        login,
        logout,
        hasPermission,
        canPerform,
        addUser,
        updateUser,
        updateUserPermissions,
        changeUserRole,
        toggleUserStatus,
        logAction,
        switchDemoRole,
        isAuthenticated: !!admin,
        isSuperAdmin: admin?.role === ROLES.SUPER_ADMIN,
        isAdmin: admin?.role === ROLES.ADMIN,
        isManager: admin?.role === ROLES.MANAGER,
        isStaff: admin?.role === ROLES.STAFF,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export const useAdminAuth = () => {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return ctx;
};
