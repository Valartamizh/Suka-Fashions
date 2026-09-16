// UsersPage — /admin/users (Streamlined 4-Role System with Granular Operational Permissions & Presets)
import React, { useState, useMemo } from 'react';
import {
  Plus, Edit, Trash2, X, Check, ShieldCheck, Mail, Phone,
  Users as UsersIcon, UserCheck, Shield, Award, UserX, Clock,
  ArrowRight, KeyRound, AlertTriangle, Sliders, History, Sparkles,
  CheckCircle2, Eye, MoreVertical, Package, Boxes, ShoppingBag,
  FileText, Star, PanelsTopLeft, Lock
} from 'lucide-react';
import AdminPageHeader from '../components/ui/AdminPageHeader';
import StatusBadge from '../components/ui/StatusBadge';
import ConfirmModal from '../components/ui/ConfirmModal';
import { useAdminAuth } from '../context/AdminAuthContext';
import {
  ROLES,
  STAFF_PRESETS,
  roleLabels,
  roleShortLabels,
  roleSubtitles,
  ROLE_BADGE_STYLES,
  ROLE_COLORS,
  PERMISSION_GROUPS,
  getDefaultPermissions,
  getAssignableRoles,
} from '../data/adminUsers';

const PERMISSION_MATRIX_DATA = [
  { module: 'Dashboard', superAdmin: 'Full', admin: 'Full', manager: 'Yes', staff: 'Limited' },
  { module: 'Products', superAdmin: 'Full', admin: 'Full', manager: 'Manage', staff: 'Custom' },
  { module: 'Inventory', superAdmin: 'Full', admin: 'Full', manager: 'Manage', staff: 'Custom' },
  { module: 'Orders', superAdmin: 'Full', admin: 'Full', manager: 'Manage', staff: 'Custom' },
  { module: 'Customers', superAdmin: 'Full', admin: 'Full', manager: 'Manage', staff: 'Limited / Custom' },
  { module: 'Reviews', superAdmin: 'Full', admin: 'Full', manager: 'Manage', staff: 'Optional' },
  { module: 'Content Management', superAdmin: 'Full', admin: 'Full', manager: 'Optional', staff: 'Optional*' },
  { module: 'Reports', superAdmin: 'Full', admin: 'Full', manager: 'Limited', staff: 'Optional*' },
  { module: 'Users & Roles', superAdmin: 'Full', admin: 'Limited', manager: 'No', staff: 'No' },
  { module: 'Business Settings', superAdmin: 'Full', admin: 'Full', manager: 'No', staff: 'No' },
  { module: 'System Settings', superAdmin: 'Full', admin: 'No', manager: 'No', staff: 'No' },
];

function MatrixBadge({ val }) {
  if (val === 'Full') {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
        <Check size={12} className="stroke-[3]" /> Full
      </span>
    );
  }
  if (val === 'Manage' || val === 'Yes') {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-teal bg-brand-powder px-2.5 py-0.5 rounded-full border border-brand-teal/30">
        {val}
      </span>
    );
  }
  if (val === 'Custom' || val === 'Limited / Custom') {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
        {val}
      </span>
    );
  }
  if (val === 'Limited') {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
        Limited
      </span>
    );
  }
  if (val.includes('Optional')) {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
        {val}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full">
      No Access
    </span>
  );
}

// Generate concise Access Summary for a permissions object
function formatAccessSummary(perms, role) {
  if (role === ROLES.SUPER_ADMIN) {
    return {
      products: 'Full Access',
      inventory: 'Full Access',
      orders: 'Full Access',
      customers: 'Full Access',
      reviews: 'Full Access',
      content: 'Full Access',
      reports: 'Full Access',
      users: 'Full Access',
      settings: 'Full Access',
    };
  }
  if (role === ROLES.ADMIN) {
    return {
      products: 'Full Business Access',
      inventory: 'Full Business Access',
      orders: 'Full Business Access',
      customers: 'Full Business Access',
      reviews: 'Full Access',
      content: 'Full Access',
      reports: 'Full Access',
      users: 'Manage Manager & Staff',
      settings: 'Business Settings Only',
    };
  }

  const p = perms || {};
  const productsList = [];
  if (p.products?.view) productsList.push('View');
  if (p.products?.create) productsList.push('Add');
  if (p.products?.edit) productsList.push('Edit');
  if (p.products?.changePrice) productsList.push('Price');
  if (p.products?.delete) productsList.push('Delete');

  const inventoryList = [];
  if (p.inventory?.view) inventoryList.push('View');
  if (p.inventory?.update) inventoryList.push('Update');
  if (p.inventory?.adjust) inventoryList.push('Adjust');

  const ordersList = [];
  if (p.orders?.view) ordersList.push('View');
  if (p.orders?.confirm) ordersList.push('Confirm');
  if (p.orders?.pack) ordersList.push('Pack');
  if (p.orders?.ship) ordersList.push('Ship');
  if (p.orders?.cancel) ordersList.push('Cancel');
  if (p.orders?.refund) ordersList.push('Refund');

  return {
    products: productsList.join(' + ') || 'No Access',
    inventory: inventoryList.join(' + ') || 'No Access',
    orders: ordersList.join(' + ') || 'No Access',
    customers: p.customers?.fullView ? 'Full View' : p.customers?.limitedView ? 'Limited View' : 'No Access',
    reviews: p.reviews?.manage ? 'Approve / Reject' : p.reviews?.view ? 'View Only' : 'No Access',
    content: p.content?.publish ? 'Edit + Publish' : p.content?.edit ? 'Edit Drafts' : p.content?.view ? 'View Only' : 'No Access',
    reports: p.reports?.sales ? 'Sales Reports' : p.reports?.operational ? 'Operational' : 'No Access',
    users: 'No Access',
    settings: 'No Access',
  };
}

export default function UsersPage() {
  const {
    admin,
    users,
    auditLogs,
    addUser,
    updateUser,
    updateUserPermissions,
    changeUserRole,
    toggleUserStatus,
  } = useAdminAuth();

  const [tab, setTab] = useState('users'); // 'users' | 'matrix' | 'audit'
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [viewUserModal, setViewUserModal] = useState(null);
  const [editModalUser, setEditModalUser] = useState(null);
  const [permissionsModalUser, setPermissionsModalUser] = useState(null);
  const [roleChangeModal, setRoleChangeModal] = useState(null); // { user, targetRole }
  const [statusToggleModal, setStatusToggleModal] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const assignableRoles = useMemo(() => {
    return getAssignableRoles(admin?.role);
  }, [admin?.role]);

  // Counts for Summary Cards
  const counts = useMemo(() => {
    return {
      total: users.length,
      superAdmin: users.filter((u) => u.role === ROLES.SUPER_ADMIN && u.status === 'active').length,
      admin: users.filter((u) => u.role === ROLES.ADMIN && u.status === 'active').length,
      managers: users.filter((u) => u.role === ROLES.MANAGER && u.status === 'active').length,
      staff: users.filter((u) => u.role === ROLES.STAFF && u.status === 'active').length,
    };
  }, [users]);

  // Add User Form State
  const [newUserData, setNewUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: assignableRoles[0] || ROLES.STAFF,
    status: 'active',
    preset: STAFF_PRESETS.STANDARD,
    useRoleDefaults: true,
    customizePermissions: false,
    permissions: getDefaultPermissions(assignableRoles[0] || ROLES.STAFF, STAFF_PRESETS.STANDARD),
  });

  // When role or preset changes in Add User form, update default permissions
  const handleAddRoleChange = (newRole) => {
    const defaultPreset = newRole === ROLES.STAFF ? STAFF_PRESETS.STANDARD : null;
    const defaultPerms = getDefaultPermissions(newRole, defaultPreset);
    setNewUserData((prev) => ({
      ...prev,
      role: newRole,
      preset: defaultPreset,
      useRoleDefaults: true,
      customizePermissions: false,
      permissions: defaultPerms,
    }));
  };

  const handleAddPresetChange = (presetName) => {
    const newPerms = getDefaultPermissions(ROLES.STAFF, presetName);
    setNewUserData((prev) => ({
      ...prev,
      preset: presetName,
      permissions: newPerms,
      customizePermissions: presetName === STAFF_PRESETS.CUSTOM,
    }));
  };

  const handleAddPermissionToggle = (group, key) => {
    setNewUserData((prev) => ({
      ...prev,
      useRoleDefaults: false,
      permissions: {
        ...prev.permissions,
        [group]: {
          ...prev.permissions[group],
          [key]: !prev.permissions[group]?.[key],
        },
      },
    }));
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newUserData.firstName.trim() || !newUserData.email.trim()) {
      showToast('First Name and Email are required.');
      return;
    }
    const res = addUser({
      firstName: newUserData.firstName,
      lastName: newUserData.lastName,
      email: newUserData.email,
      phone: newUserData.phone,
      role: newUserData.role,
      status: newUserData.status,
      preset: newUserData.preset,
      useRoleDefaults: newUserData.useRoleDefaults,
      permissions: newUserData.permissions,
    });

    if (res.success) {
      showToast(`User ${res.user.name} created successfully as ${roleLabels[res.user.role]}!`);
      setAddModalOpen(false);
      setNewUserData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        role: assignableRoles[0] || ROLES.STAFF,
        status: 'active',
        preset: STAFF_PRESETS.STANDARD,
        useRoleDefaults: true,
        customizePermissions: false,
        permissions: getDefaultPermissions(assignableRoles[0] || ROLES.STAFF, STAFF_PRESETS.STANDARD),
      });
    } else {
      showToast(res.error || 'Failed to create user');
    }
  };

  // Edit User Save
  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editModalUser) return;
    const res = updateUser(editModalUser.id, {
      firstName: editModalUser.firstName,
      lastName: editModalUser.lastName,
      email: editModalUser.email,
      phone: editModalUser.phone,
    });
    if (res.success) {
      showToast('User profile updated successfully!');
      setEditModalUser(null);
    } else {
      showToast(res.error || 'Failed to update user');
    }
  };

  // Permissions Modal Form State
  const [editingPermissions, setEditingPermissions] = useState(null);
  const [editingPreset, setEditingPreset] = useState(STAFF_PRESETS.CUSTOM);

  const openPermissionsModal = (user) => {
    setPermissionsModalUser(user);
    setEditingPermissions(JSON.parse(JSON.stringify(user.permissions || getDefaultPermissions(user.role))));
    setEditingPreset(user.preset || STAFF_PRESETS.CUSTOM);
  };

  const handleEditModalPresetChange = (presetName) => {
    setEditingPreset(presetName);
    if (presetName !== STAFF_PRESETS.CUSTOM) {
      setEditingPermissions(getDefaultPermissions(permissionsModalUser.role, presetName));
    }
  };

  const handleEditModalPermToggle = (group, key) => {
    setEditingPreset(STAFF_PRESETS.CUSTOM);
    setEditingPermissions((prev) => ({
      ...prev,
      [group]: {
        ...prev[group],
        [key]: !prev[group]?.[key],
      },
    }));
  };

  const handleSavePermissions = () => {
    if (!permissionsModalUser || !editingPermissions) return;
    const res = updateUserPermissions(permissionsModalUser.id, editingPermissions, editingPreset);
    if (res.success) {
      showToast(`Permissions updated for ${permissionsModalUser.name}`);
      setPermissionsModalUser(null);
    } else {
      showToast(res.error || 'Failed to update permissions');
    }
  };

  // Role Change Confirmation
  const confirmRoleChange = () => {
    if (!roleChangeModal) return;
    const { user, targetRole } = roleChangeModal;
    const res = changeUserRole(user.id, targetRole);
    if (res.success) {
      showToast(`${user.name}'s role changed to ${roleLabels[targetRole]}`);
      setRoleChangeModal(null);
    } else {
      showToast(res.error || 'Could not change user role');
    }
  };

  // Status Toggle Confirmation
  const confirmStatusToggle = () => {
    if (!statusToggleModal) return;
    const user = statusToggleModal;
    const res = toggleUserStatus(user.id);
    if (res.success) {
      showToast(`${user.name} is now ${res.status.toUpperCase()}`);
      setStatusToggleModal(null);
    } else {
      showToast(res.error || 'Could not toggle status');
    }
  };

  // Check if current logged-in user can modify target user
  const canModifyUser = (targetUser) => {
    if (admin?.role === ROLES.SUPER_ADMIN) return true;
    if (admin?.role === ROLES.ADMIN) {
      return targetUser.role !== ROLES.SUPER_ADMIN; // Owner cannot touch Super Admin
    }
    return false;
  };

  // Computed summary for Add Modal preview
  const addModalSummary = useMemo(() => {
    return formatAccessSummary(newUserData.permissions, newUserData.role);
  }, [newUserData.permissions, newUserData.role]);

  return (
    <div className="space-y-6 pb-12 text-left">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2.5 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 animate-in fade-in slide-in-from-top-4 text-xs font-semibold">
          <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <AdminPageHeader
        title="Users & Roles"
        subtitle="Manage people who can access the Suka Fashions Admin Panel."
      >
        {assignableRoles.length > 0 && (
          <button
            onClick={() => {
              handleAddRoleChange(assignableRoles[0] || ROLES.STAFF);
              setAddModalOpen(true);
            }}
            className="flex items-center gap-2 bg-brand-teal hover:bg-brand-tealDark text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl transition-all shadow-md shadow-brand-teal/20 hover:shadow-lg active:scale-95 cursor-pointer"
          >
            <Plus size={15} />
            <span>Add User</span>
          </button>
        )}
      </AdminPageHeader>

      {/* 5 Clean Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">TOTAL USERS</span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
              <UsersIcon size={16} />
            </div>
          </div>
          <p className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 mt-2">{counts.total}</p>
          <span className="text-[10px] text-slate-400 font-medium">All active & inactive accounts</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-purple-200/70 shadow-xs bg-gradient-to-br from-purple-50/40 to-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-900 uppercase tracking-wider">SUPER ADMIN</span>
            <div className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700">
              <KeyRound size={16} />
            </div>
          </div>
          <p className="font-serif text-2xl sm:text-3xl font-bold text-purple-950 mt-2">{counts.superAdmin}</p>
          <span className="text-[10px] text-purple-600 font-medium">System Administration</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-teal-200/70 shadow-xs bg-gradient-to-br from-brand-powder/40 to-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-brand-teal uppercase tracking-wider">ADMIN</span>
            <div className="w-8 h-8 rounded-xl bg-brand-powder flex items-center justify-center text-brand-teal">
              <ShieldCheck size={16} />
            </div>
          </div>
          <p className="font-serif text-2xl sm:text-3xl font-bold text-brand-navy mt-2">{counts.admin}</p>
          <span className="text-[10px] text-brand-teal font-medium">Store Administration</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-amber-200/70 shadow-xs bg-gradient-to-br from-amber-50/40 to-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">MANAGERS</span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700">
              <Award size={16} />
            </div>
          </div>
          <p className="font-serif text-2xl sm:text-3xl font-bold text-amber-950 mt-2">{counts.managers}</p>
          <span className="text-[10px] text-amber-600 font-medium">Operations Management</span>
        </div>

        <div className="col-span-2 sm:col-span-1 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">STAFF</span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
              <UserCheck size={16} />
            </div>
          </div>
          <p className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 mt-2">{counts.staff}</p>
          <span className="text-[10px] text-slate-500 font-medium">Operational Support</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200/80">
        {[
          { id: 'users', label: 'Admin Accounts', icon: UsersIcon },
          { id: 'matrix', label: 'Permission Matrix (4 Roles)', icon: Shield },
          { id: 'audit', label: 'Audit Activity Log', icon: History },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-bold transition-all border-b-2 -mb-px cursor-pointer ${
              tab === id
                ? 'text-brand-teal border-brand-teal'
                : 'text-slate-500 border-transparent hover:text-slate-800'
            }`}
          >
            <Icon size={15} />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: USERS TABLE & MOBILE CARDS */}
      {tab === 'users' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200/80 bg-slate-50/70">
                  <th className="px-5 py-3.5 font-bold text-slate-500 uppercase tracking-wider text-[10px]">USER</th>
                  <th className="px-4 py-3.5 font-bold text-slate-500 uppercase tracking-wider text-[10px]">ROLE</th>
                  <th className="px-4 py-3.5 font-bold text-slate-500 uppercase tracking-wider text-[10px]">STATUS</th>
                  <th className="px-4 py-3.5 font-bold text-slate-500 uppercase tracking-wider text-[10px]">LAST LOGIN</th>
                  <th className="px-5 py-3.5 font-bold text-slate-500 uppercase tracking-wider text-[10px] text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((user) => {
                  const isModifiable = canModifyUser(user);
                  const isCurrentSession = admin?.id === user.id || admin?.email?.toLowerCase() === user.email?.toLowerCase();

                  return (
                    <tr key={user.id} className="hover:bg-slate-50/60 transition-colors">
                      {/* Avatar & User Name */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-2xs ${ROLE_COLORS[user.role]}`}>
                            {user.avatar}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <p className="font-bold text-slate-900 text-sm">{user.name}</p>
                              {isCurrentSession && (
                                <span className="text-[9px] bg-brand-powder text-brand-teal font-extrabold px-1.5 py-0.5 rounded">
                                  YOU
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5">{user.email}</p>
                            {user.preset && (
                              <span className="inline-block text-[9.5px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded mt-0.5">
                                {user.preset}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="px-4 py-4">
                        <span className={`inline-block text-[11px] px-2.5 py-0.5 rounded-full ${ROLE_BADGE_STYLES[user.role]}`}>
                          {roleLabels[user.role]}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4">
                        <StatusBadge status={user.status} />
                      </td>

                      {/* Last Login */}
                      <td className="px-4 py-4 text-slate-500 whitespace-nowrap">
                        {user.lastLogin ? (
                          <div>
                            <p className="font-medium text-slate-700">
                              {new Date(user.lastLogin).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </p>
                            <p className="text-[10px] text-slate-400">
                              {new Date(user.lastLogin).toLocaleTimeString('en-IN', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">Never</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View User Button */}
                          <button
                            type="button"
                            onClick={() => setViewUserModal(user)}
                            className="px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-brand-teal hover:bg-brand-powder/40 rounded-lg transition-colors cursor-pointer flex items-center gap-1 border border-slate-200/80"
                            title="View User Details & Activity"
                          >
                            <Eye size={13} />
                            <span>View</span>
                          </button>

                          {/* Manage Permissions */}
                          {isModifiable && (user.role === ROLES.MANAGER || user.role === ROLES.STAFF) && (
                            <button
                              type="button"
                              onClick={() => openPermissionsModal(user)}
                              className="px-2.5 py-1.5 text-xs font-semibold text-brand-teal bg-brand-powder/50 hover:bg-brand-powder border border-brand-teal/30 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                              title="Manage Custom Permissions"
                            >
                              <Sliders size={13} />
                              <span>Permissions</span>
                            </button>
                          )}

                          {/* Edit Details */}
                          {isModifiable && (
                            <button
                              type="button"
                              onClick={() => setEditModalUser({ ...user })}
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                              title="Edit Personal Information"
                            >
                              <Edit size={14} />
                            </button>
                          )}

                          {/* Change Role (Only modifiable for OTHER users, not oneself) */}
                          {isModifiable && assignableRoles.length > 0 && !isCurrentSession && (
                            <button
                              type="button"
                              onClick={() => {
                                const nextRole = assignableRoles.find((r) => r !== user.role) || assignableRoles[0];
                                setRoleChangeModal({ user, targetRole: nextRole });
                              }}
                              className="px-2 py-1 text-[11px] font-semibold text-slate-600 hover:text-brand-teal hover:bg-slate-50 rounded-lg transition-colors cursor-pointer border border-slate-200"
                              title="Change Role"
                            >
                              Role ▾
                            </button>
                          )}

                          {/* Deactivate / Reactivate (Only for OTHER users, not oneself) */}
                          {isModifiable && !isCurrentSession && (
                            <button
                              type="button"
                              onClick={() => setStatusToggleModal(user)}
                              className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-colors cursor-pointer ${
                                user.status === 'active'
                                  ? 'text-amber-700 hover:bg-amber-50 border border-amber-200'
                                  : 'text-emerald-700 hover:bg-emerald-50 border border-emerald-200'
                              }`}
                            >
                              {user.status === 'active' ? 'Disable' : 'Enable'}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile User Cards View (responsive 320px - 768px) */}
          <div className="md:hidden divide-y divide-slate-100">
            {users.map((user) => {
              const isModifiable = canModifyUser(user);
              const isCurrentSession = admin?.id === user.id || admin?.email?.toLowerCase() === user.email?.toLowerCase();

              return (
                <div key={user.id} className="p-4 space-y-3.5 hover:bg-slate-50/40 transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm shadow-xs ${ROLE_COLORS[user.role]}`}>
                        {user.avatar}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="font-bold text-slate-900 text-sm">{user.name}</p>
                          {isCurrentSession && (
                            <span className="text-[8.5px] bg-brand-powder text-brand-teal font-extrabold px-1.5 py-0.5 rounded">
                              YOU
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500">{user.email}</p>
                      </div>
                    </div>
                    <StatusBadge status={user.status} />
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-xl text-xs border border-slate-100 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[9.5px] font-extrabold uppercase tracking-wider text-slate-400">Role</span>
                      <span className={`text-[10.5px] px-2 py-0.5 rounded-full ${ROLE_BADGE_STYLES[user.role]}`}>
                        {roleLabels[user.role]}
                      </span>
                    </div>
                    {user.preset && (
                      <div className="flex items-center justify-between pt-1 border-t border-slate-200/50">
                        <span className="text-[9.5px] font-semibold text-slate-400">Preset:</span>
                        <span className="font-bold text-slate-700 text-[11px]">{user.preset}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between pt-1 border-t border-slate-200/50">
                      <span className="text-[9.5px] font-semibold text-slate-400">Last Login:</span>
                      <span className="text-slate-600 text-[11px]">
                        {user.lastLogin
                          ? new Date(user.lastLogin).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
                          : 'Never'}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-100 flex-wrap">
                    <button
                      type="button"
                      onClick={() => setViewUserModal(user)}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer"
                    >
                      View
                    </button>

                    {isModifiable && (user.role === ROLES.MANAGER || user.role === ROLES.STAFF) && (
                      <button
                        type="button"
                        onClick={() => openPermissionsModal(user)}
                        className="px-3 py-1.5 text-xs font-semibold text-brand-teal bg-brand-powder/60 border border-brand-teal/30 rounded-lg cursor-pointer"
                      >
                        Permissions
                      </button>
                    )}

                    {isModifiable && (
                      <button
                        type="button"
                        onClick={() => setEditModalUser({ ...user })}
                        className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg cursor-pointer"
                      >
                        Edit
                      </button>
                    )}

                    {isModifiable && assignableRoles.length > 0 && !isCurrentSession && (
                      <button
                        type="button"
                        onClick={() => {
                          const nextRole = assignableRoles.find((r) => r !== user.role) || assignableRoles[0];
                          setRoleChangeModal({ user, targetRole: nextRole });
                        }}
                        className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer"
                      >
                        Change Role
                      </button>
                    )}

                    {isModifiable && !isCurrentSession && (
                      <button
                        type="button"
                        onClick={() => setStatusToggleModal(user)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg border cursor-pointer ${
                          user.status === 'active'
                            ? 'text-amber-700 border-amber-200 bg-amber-50/50'
                            : 'text-emerald-700 border-emerald-200 bg-emerald-50/50'
                        }`}
                      >
                        {user.status === 'active' ? 'Disable' : 'Enable'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* TAB 2: PERMISSION MATRIX */}
      {tab === 'matrix' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-slate-50/50">
            <h3 className="font-serif text-base font-bold text-slate-900">4-Role Permission Comparison</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              ROLE defines who the person is. PERMISSIONS define what that person can do.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[650px]">
              <thead>
                <tr className="border-b border-slate-200/80 bg-slate-50/80">
                  <th className="px-5 py-3.5 font-bold text-slate-500 uppercase tracking-wider text-[10px] w-48">MODULE</th>
                  <th className="px-4 py-3.5 font-bold text-purple-800 uppercase tracking-wider text-[10px] text-center">SUPER ADMIN</th>
                  <th className="px-4 py-3.5 font-bold text-brand-teal uppercase tracking-wider text-[10px] text-center">ADMIN</th>
                  <th className="px-4 py-3.5 font-bold text-amber-800 uppercase tracking-wider text-[10px] text-center">MANAGER</th>
                  <th className="px-4 py-3.5 font-bold text-slate-600 uppercase tracking-wider text-[10px] text-center">STAFF</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {PERMISSION_MATRIX_DATA.map((row) => (
                  <tr key={row.module} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-3.5 font-bold text-slate-800">{row.module}</td>
                    <td className="px-4 py-3.5 text-center"><MatrixBadge val={row.superAdmin} /></td>
                    <td className="px-4 py-3.5 text-center"><MatrixBadge val={row.admin} /></td>
                    <td className="px-4 py-3.5 text-center"><MatrixBadge val={row.manager} /></td>
                    <td className="px-4 py-3.5 text-center"><MatrixBadge val={row.staff} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-200/70 text-[11px] text-slate-500 flex flex-wrap items-center gap-4">
            <span className="font-bold text-slate-700">Legend:</span>
            <span className="flex items-center gap-1.5"><MatrixBadge val="Full" /> Unrestricted access</span>
            <span className="flex items-center gap-1.5"><MatrixBadge val="Manage" /> Daily operations</span>
            <span className="flex items-center gap-1.5"><MatrixBadge val="Custom" /> Configurable preset</span>
            <span className="flex items-center gap-1.5"><MatrixBadge val="Optional" /> Optional permission</span>
            <span className="flex items-center gap-1.5"><MatrixBadge val="No Access" /> No permission</span>
          </div>
        </div>
      )}

      {/* TAB 3: AUDIT LOG */}
      {tab === 'audit' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-slate-50/50">
            <h3 className="font-serif text-base font-bold text-slate-900">Store Activity & Modification Audit</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Live record of inventory changes, order updates, content publishing, and user administration.
            </p>
          </div>

          <div className="divide-y divide-slate-100">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-4 sm:p-5 hover:bg-slate-50/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-start gap-3.5">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-2xs ${ROLE_COLORS[log.actorRole] || 'bg-slate-100 text-slate-700'}`}>
                    {log.actorName?.slice(0, 2).toUpperCase() || 'SF'}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-slate-900">{log.actorName}</span>
                      <span className={`text-[10px] px-2 py-0.2 rounded-full ${ROLE_BADGE_STYLES[log.actorRole] || 'bg-slate-100 text-slate-600'}`}>
                        {roleShortLabels[log.actorRole] || log.actorRole}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">· {log.action}</span>
                    </div>
                    <p className="text-slate-800 font-semibold mt-1">{log.target}</p>
                    <p className="text-slate-500 text-[11px] mt-0.5">{log.details}</p>
                  </div>
                </div>

                <div className="text-left sm:text-right flex-shrink-0">
                  <span className="text-slate-500 font-medium block">
                    {new Date(log.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                  <span className="text-slate-400 text-[10.5px]">
                    {new Date(log.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: VIEW USER (Section 28) */}
      {viewUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in" onClick={() => setViewUserModal(null)}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 relative animate-in zoom-in-95" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm shadow-sm ${ROLE_COLORS[viewUserModal.role]}`}>
                  {viewUserModal.avatar}
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-slate-900 leading-tight">{viewUserModal.name}</h3>
                  <p className="text-xs text-slate-500">{viewUserModal.email}</p>
                </div>
              </div>
              <button onClick={() => setViewUserModal(null)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            {/* Role & Status Card */}
            <div className="flex items-center justify-between bg-slate-50 p-3 rounded-2xl border border-slate-200/80 mb-5 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Role</span>
                <span className={`text-[11px] px-2.5 py-0.5 rounded-full ${ROLE_BADGE_STYLES[viewUserModal.role]}`}>
                  {roleLabels[viewUserModal.role]}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Status</span>
                <StatusBadge status={viewUserModal.status} />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Preset</span>
                <span className="font-bold text-slate-700">{viewUserModal.preset || 'Standard'}</span>
              </div>
            </div>

            {/* Access Permissions Summary */}
            <div className="space-y-3 mb-6">
              <h4 className="font-sans text-xs uppercase tracking-wider font-extrabold text-slate-800 flex items-center gap-1.5">
                <Shield size={14} className="text-brand-teal" />
                <span>Access Permissions</span>
              </h4>
              
              {(() => {
                const summary = formatAccessSummary(viewUserModal.permissions, viewUserModal.role);
                return (
                  <div className="grid grid-cols-2 gap-2 text-xs bg-brand-cream/20 p-3.5 rounded-2xl border border-brand-powder/50">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block">Products</span>
                      <span className="font-semibold text-slate-800">{summary.products}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block">Inventory</span>
                      <span className="font-semibold text-slate-800">{summary.inventory}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block">Orders</span>
                      <span className="font-semibold text-slate-800">{summary.orders}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block">Customers</span>
                      <span className="font-semibold text-slate-800">{summary.customers}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block">Reviews</span>
                      <span className="font-semibold text-slate-800">{summary.reviews}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block">Content Management</span>
                      <span className="font-semibold text-slate-800">{summary.content}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block">Reports</span>
                      <span className="font-semibold text-slate-800">{summary.reports}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block">Users & Settings</span>
                      <span className="font-semibold text-slate-800">{summary.settings}</span>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Recent Activity */}
            <div>
              <h4 className="font-sans text-xs uppercase tracking-wider font-extrabold text-slate-800 mb-2 flex items-center gap-1.5">
                <History size={14} className="text-brand-teal" />
                <span>Recent Activity</span>
              </h4>
              {(() => {
                const userLogs = auditLogs.filter((l) => l.actorName === viewUserModal.name);
                if (userLogs.length === 0) {
                  return (
                    <div className="p-4 text-center bg-slate-50 rounded-xl border border-slate-100 text-slate-400 text-xs">
                      No recorded activity for this user yet.
                    </div>
                  );
                }
                return (
                  <div className="divide-y divide-slate-100 border border-slate-200/80 rounded-2xl overflow-hidden max-h-48 overflow-y-auto">
                    {userLogs.map((log) => (
                      <div key={log.id} className="p-3 hover:bg-slate-50/50 text-xs">
                        <div className="flex items-center justify-between text-slate-400 text-[10px]">
                          <span className="font-mono">{log.action}</span>
                          <span>{new Date(log.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                        </div>
                        <p className="font-semibold text-slate-800 mt-0.5">{log.target}</p>
                        <p className="text-slate-500 text-[11px]">{log.details}</p>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD USER (Section 12, 13, 14, 34) */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in" onClick={() => setAddModalOpen(false)}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto p-6 relative animate-in zoom-in-95" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <div>
                <h3 className="font-serif text-lg font-bold text-slate-900">ADD ADMIN USER</h3>
                <p className="text-xs text-slate-500">Provide personal info and choose access level</p>
              </div>
              <button onClick={() => setAddModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              {/* Personal Information */}
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2">
                  Personal Information
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Arun"
                      value={newUserData.firstName}
                      onChange={(e) => setNewUserData({ ...newUserData, firstName: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 outline-none focus:border-brand-teal"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Last Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Kumar"
                      value={newUserData.lastName}
                      onChange={(e) => setNewUserData({ ...newUserData, lastName: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 outline-none focus:border-brand-teal"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="arun@sukafashions.com"
                      value={newUserData.email}
                      onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 outline-none focus:border-brand-teal"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Phone</label>
                    <input
                      type="tel"
                      placeholder="+91 98000 00000"
                      value={newUserData.phone}
                      onChange={(e) => setNewUserData({ ...newUserData, phone: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 outline-none focus:border-brand-teal"
                    />
                  </div>
                </div>
              </div>

              {/* Access Section */}
              <div className="pt-2 border-t border-slate-100">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2">
                  Access Level
                </span>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Role</label>
                    <select
                      value={newUserData.role}
                      onChange={(e) => handleAddRoleChange(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2.5 bg-white text-slate-900 font-semibold outline-none focus:border-brand-teal"
                    >
                      {assignableRoles.map((r) => (
                        <option key={r} value={r}>
                          {roleLabels[r]}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Status</label>
                    <select
                      value={newUserData.status}
                      onChange={(e) => setNewUserData({ ...newUserData, status: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2.5 bg-white text-slate-900 outline-none focus:border-brand-teal"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Staff Presets & Customization Toggle */}
              {newUserData.role === ROLES.STAFF && (
                <div className="pt-2 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-800 block text-xs">Quick Permission Preset</span>
                      <span className="text-[11px] text-slate-400">Convenient presets for staff responsibilities</span>
                    </div>
                    <select
                      value={newUserData.preset}
                      onChange={(e) => handleAddPresetChange(e.target.value)}
                      className="border border-brand-powder rounded-xl px-2.5 py-1.5 bg-white text-slate-800 text-xs font-bold outline-none focus:border-brand-teal"
                    >
                      {Object.values(STAFF_PRESETS).map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200/80 rounded-2xl">
                    <div>
                      <p className="font-bold text-slate-800 text-xs">Customize Permissions</p>
                      <p className="text-[11px] text-slate-400">Fine-tune individual operational checkboxes</p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setNewUserData((prev) => ({
                          ...prev,
                          customizePermissions: !prev.customizePermissions,
                          preset: STAFF_PRESETS.CUSTOM,
                        }))
                      }
                      className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${
                        newUserData.customizePermissions ? 'bg-brand-teal' : 'bg-slate-200'
                      }`}
                    >
                      <div
                        className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                          newUserData.customizePermissions ? 'translate-x-5' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              )}

              {/* Granular Permission Checkboxes (Expanded when customized or Manager) */}
              {(newUserData.customizePermissions || newUserData.role === ROLES.MANAGER) && (
                <div className="pt-2 border-t border-slate-100 space-y-3">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                    {newUserData.role === ROLES.MANAGER ? 'Manager Permissions Configuration' : 'Custom Staff Permissions'}
                  </span>

                  <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                    {PERMISSION_GROUPS.map((group) => (
                      <div key={group.id} className="p-3 bg-slate-50 border border-slate-200/70 rounded-xl space-y-2">
                        <span className="font-extrabold text-[10px] text-brand-teal tracking-wider uppercase block">
                          {group.title}
                        </span>
                        <div className="grid grid-cols-2 gap-2">
                          {group.permissions.map((perm) => (
                            <label key={perm.key} className="flex items-center gap-2 text-[11px] text-slate-700 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={!!newUserData.permissions[group.id]?.[perm.key]}
                                onChange={() => handleAddPermissionToggle(group.id, perm.key)}
                                className="w-4 h-4 rounded text-brand-teal accent-brand-teal cursor-pointer"
                              />
                              <span>{perm.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Permission Summary Preview (Section 18) */}
              <div className="p-3.5 bg-brand-powder/20 border border-brand-powder/60 rounded-2xl text-xs space-y-1.5">
                <span className="font-extrabold text-[10px] text-brand-teal uppercase tracking-wider block">
                  ACCESS SUMMARY PREVIEW
                </span>
                <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] text-slate-600">
                  <div>
                    <span className="text-slate-400">Products:</span> <span className="font-semibold text-slate-800">{addModalSummary.products}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Inventory:</span> <span className="font-semibold text-slate-800">{addModalSummary.inventory}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Orders:</span> <span className="font-semibold text-slate-800">{addModalSummary.orders}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Customers:</span> <span className="font-semibold text-slate-800">{addModalSummary.customers}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-brand-teal hover:bg-brand-tealDark text-white font-bold transition-colors cursor-pointer shadow-md shadow-brand-teal/20"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: MANAGE PERMISSIONS (Section 6, 7, 8) */}
      {permissionsModalUser && editingPermissions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in" onClick={() => setPermissionsModalUser(null)}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto p-6 relative animate-in zoom-in-95" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <div>
                <h3 className="font-serif text-lg font-bold text-slate-900">MANAGE PERMISSIONS</h3>
                <p className="text-xs text-slate-500">
                  {permissionsModalUser.name} · <span className="font-semibold">{roleLabels[permissionsModalUser.role]}</span>
                </p>
              </div>
              <button onClick={() => setPermissionsModalUser(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Presets Row for Staff */}
              {permissionsModalUser.role === ROLES.STAFF && (
                <div className="flex items-center justify-between p-3 bg-brand-powder/30 rounded-2xl border border-brand-powder/60">
                  <div>
                    <span className="font-bold text-brand-navy block text-xs">Quick Preset</span>
                    <span className="text-[11px] text-slate-500">Apply standard operational template</span>
                  </div>
                  <select
                    value={editingPreset}
                    onChange={(e) => handleEditModalPresetChange(e.target.value)}
                    className="border border-brand-powder rounded-xl px-2.5 py-1.5 bg-white text-slate-800 text-xs font-bold outline-none focus:border-brand-teal"
                  >
                    {Object.values(STAFF_PRESETS).map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Permission Groups Checkboxes */}
              <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
                {PERMISSION_GROUPS.map((group) => (
                  <div key={group.id} className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2">
                    <span className="font-extrabold text-[10px] text-brand-teal tracking-wider uppercase block">
                      {group.title}
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {group.permissions.map((perm) => (
                        <label key={perm.key} className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer hover:text-slate-950">
                          <input
                            type="checkbox"
                            checked={!!editingPermissions[group.id]?.[perm.key]}
                            onChange={() => handleEditModalPermToggle(group.id, perm.key)}
                            className="w-4 h-4 rounded text-brand-teal accent-brand-teal cursor-pointer"
                          />
                          <span>{perm.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Access Summary Preview */}
              {(() => {
                const summary = formatAccessSummary(editingPermissions, permissionsModalUser.role);
                return (
                  <div className="p-3 bg-brand-cream/30 border border-brand-powder/50 rounded-xl text-[11px] text-slate-600">
                    <span className="font-bold text-slate-800 block mb-1">Updated Access Summary:</span>
                    <p><span className="text-slate-400">Products:</span> {summary.products} | <span className="text-slate-400">Inventory:</span> {summary.inventory}</p>
                    <p><span className="text-slate-400">Orders:</span> {summary.orders} | <span className="text-slate-400">Customers:</span> {summary.customers}</p>
                  </div>
                );
              })()}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPermissionsModalUser(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSavePermissions}
                  className="flex-1 py-2.5 rounded-xl bg-brand-teal hover:bg-brand-tealDark text-white font-bold transition-colors cursor-pointer shadow-md shadow-brand-teal/20"
                >
                  Save Permissions
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: EDIT USER (Personal Info) */}
      {editModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in" onClick={() => setEditModalUser(null)}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 relative animate-in zoom-in-95" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <div>
                <h3 className="font-serif text-lg font-bold text-slate-900">Edit User Details</h3>
                <p className="text-xs text-slate-500">{editModalUser.name} ({roleLabels[editModalUser.role]})</p>
              </div>
              <button onClick={() => setEditModalUser(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    value={editModalUser.firstName || ''}
                    onChange={(e) => setEditModalUser({ ...editModalUser, firstName: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 outline-none focus:border-brand-teal"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Last Name</label>
                  <input
                    type="text"
                    value={editModalUser.lastName || ''}
                    onChange={(e) => setEditModalUser({ ...editModalUser, lastName: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 outline-none focus:border-brand-teal"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={editModalUser.email || ''}
                  onChange={(e) => setEditModalUser({ ...editModalUser, email: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 outline-none focus:border-brand-teal"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Phone</label>
                <input
                  type="tel"
                  value={editModalUser.phone || ''}
                  onChange={(e) => setEditModalUser({ ...editModalUser, phone: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 outline-none focus:border-brand-teal"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditModalUser(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-brand-teal hover:bg-brand-tealDark text-white font-bold transition-colors shadow-md shadow-brand-teal/20"
                >
                  Save Details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CHANGE USER ROLE */}
      {roleChangeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in" onClick={() => setRoleChangeModal(null)}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 text-center animate-in zoom-in-95" onClick={(e) => e.stopPropagation()}>
            <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-3 border border-amber-200">
              <AlertTriangle size={26} />
            </div>

            <h3 className="font-serif text-lg font-bold text-slate-900">Change User Role?</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              This will update default access permissions for <span className="font-bold text-slate-800">{roleChangeModal.user.name}</span>.
            </p>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 mb-5 text-xs text-center space-y-2">
              <div className="flex items-center justify-center gap-2">
                <span className={`px-2 py-0.5 rounded-full ${ROLE_BADGE_STYLES[roleChangeModal.user.role]}`}>
                  {roleShortLabels[roleChangeModal.user.role]}
                </span>
                <ArrowRight size={14} className="text-slate-400" />
                <span className={`px-2 py-0.5 rounded-full ${ROLE_BADGE_STYLES[roleChangeModal.targetRole]}`}>
                  {roleShortLabels[roleChangeModal.targetRole]}
                </span>
              </div>

              <div className="pt-2 text-left">
                <label className="text-[10.5px] font-bold text-slate-600 block mb-1">Select New Role:</label>
                <select
                  value={roleChangeModal.targetRole}
                  onChange={(e) => setRoleChangeModal({ ...roleChangeModal, targetRole: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-brand-teal"
                >
                  {assignableRoles.map((r) => (
                    <option key={r} value={r}>
                      {roleLabels[r]}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setRoleChangeModal(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmRoleChange}
                className="flex-1 py-2.5 rounded-xl bg-brand-teal hover:bg-brand-tealDark text-white font-bold transition-colors shadow-md shadow-brand-teal/20"
              >
                Change Role
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: STATUS TOGGLE */}
      {statusToggleModal && (
        <ConfirmModal
          isOpen={!!statusToggleModal}
          onClose={() => setStatusToggleModal(null)}
          onConfirm={confirmStatusToggle}
          title={statusToggleModal.status === 'active' ? 'Deactivate User Account?' : 'Reactivate User Account?'}
          message={
            statusToggleModal.status === 'active'
              ? `Deactivating "${statusToggleModal.name}" will immediately prevent them from logging in to the admin panel. Historical audit logs remain preserved.`
              : `Reactivate administrative access for "${statusToggleModal.name}"? They will regain their assigned permissions.`
          }
          confirmLabel={statusToggleModal.status === 'active' ? 'Deactivate Account' : 'Reactivate Account'}
          variant={statusToggleModal.status === 'active' ? 'danger' : 'brand'}
        />
      )}
    </div>
  );
}
