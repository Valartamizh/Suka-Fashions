// UsersPage — /admin/users
import React, { useState } from 'react';
import { Plus, Edit, Trash2, X, Check, ShieldCheck, Mail, Phone } from 'lucide-react';
import AdminPageHeader from '../components/ui/AdminPageHeader';
import StatusBadge from '../components/ui/StatusBadge';
import ConfirmModal from '../components/ui/ConfirmModal';
import { adminUsers, roleLabels, permissions } from '../data/adminUsers';

const ROLES = Object.keys(roleLabels);
const ROLE_COLORS = {
  SUPER_ADMIN: 'bg-violet-100 text-violet-700',
  ADMIN: 'bg-brand-powder text-brand-teal',
  PRODUCT_MANAGER: 'bg-blue-50 text-blue-700',
  INVENTORY_MANAGER: 'bg-emerald-50 text-emerald-700',
  ORDER_MANAGER: 'bg-amber-50 text-amber-700',
  CONTENT_MANAGER: 'bg-pink-50 text-pink-700',
  CUSTOMER_SUPPORT: 'bg-slate-100 text-slate-600',
};

const PERMISSION_KEYS = ['dashboard', 'products', 'inventory', 'orders', 'customers', 'reviews', 'content', 'users', 'settings'];

function PermCell({ level }) {
  if (level === 'full') return <Check size={14} className="text-emerald-500 mx-auto" />;
  if (level === 'view') return <span className="text-[10px] font-bold text-amber-500 block text-center">View</span>;
  return <X size={12} className="text-slate-300 mx-auto" />;
}

export default function UsersPage() {
  const [users, setUsers] = useState(adminUsers);
  const [addModal, setAddModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(null);
  const [tab, setTab] = useState('Users');
  const [newUser, setNewUser] = useState({ firstName: '', lastName: '', email: '', phone: '', role: 'PRODUCT_MANAGER', status: 'active' });

  const set = (k, v) => setNewUser(u => ({ ...u, [k]: v }));

  const addUser = () => {
    if (!newUser.firstName || !newUser.email) return;
    setUsers(u => [...u, {
      id: `USR${u.length + 10}`,
      ...newUser,
      name: `${newUser.firstName} ${newUser.lastName}`,
      avatar: `${newUser.firstName.charAt(0)}${newUser.lastName.charAt(0)}`,
      lastLogin: null,
      createdAt: '2026-08-26',
    }]);
    setAddModal(false);
    setNewUser({ firstName: '', lastName: '', email: '', phone: '', role: 'PRODUCT_MANAGER', status: 'active' });
  };

  return (
    <div className="space-y-5">
      <AdminPageHeader title="Users & Roles" subtitle="Manage admin staff accounts and their permissions.">
        <button
          onClick={() => setAddModal(true)}
          className="flex items-center gap-2 bg-brand-teal hover:bg-brand-tealDark text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors shadow-sm"
        >
          <Plus size={14} /> Add User
        </button>
      </AdminPageHeader>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        {['Users', 'Role Permissions'].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-3 text-sm font-semibold transition-all border-b-2 -mb-px ${
              tab === t ? 'text-brand-teal border-brand-teal' : 'text-slate-500 border-transparent hover:text-slate-700'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'Users' && (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  {['Staff Member', 'Email', 'Phone', 'Role', 'Status', 'Last Login', ''].map(h => (
                    <th key={h} className="px-4 py-3.5 text-left font-semibold text-slate-400 uppercase tracking-wider text-[10px] whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {users.map(user => (
                  <tr key={user.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 ${ROLE_COLORS[user.role] || 'bg-slate-100 text-slate-600'}`}>
                          {user.avatar}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">{user.name}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5 font-mono">{user.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-slate-600 max-w-[160px] truncate">{user.email}</td>
                    <td className="px-4 py-4 text-slate-600 whitespace-nowrap">{user.phone}</td>
                    <td className="px-4 py-4">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${ROLE_COLORS[user.role] || 'bg-slate-100 text-slate-600'}`}>
                        {roleLabels[user.role]}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge status={user.status} />
                    </td>
                    <td className="px-4 py-4 text-slate-400 whitespace-nowrap">
                      {user.lastLogin
                        ? new Date(user.lastLogin).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
                        : 'Never'}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1">
                        <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 transition-colors">
                          <Edit size={13} />
                        </button>
                        {user.role !== 'SUPER_ADMIN' && (
                          <button
                            onClick={() => setDeleteModal(user)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Staff Cards View */}
          <div className="block sm:hidden divide-y divide-slate-100">
            {users.map(user => (
              <div key={user.id} className="p-4 hover:bg-slate-50 transition-colors space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 ${ROLE_COLORS[user.role] || 'bg-slate-100 text-slate-600'}`}>
                      {user.avatar}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{user.name}</p>
                      <span className="text-[10px] font-mono text-slate-400">{user.id}</span>
                    </div>
                  </div>
                  <StatusBadge status={user.status} />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 text-xs bg-slate-50 p-2.5 rounded-xl">
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase block">Role</span>
                    <span className="font-bold text-slate-800">{roleLabels[user.role]}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase block">Contact</span>
                    <span className="font-medium text-slate-600">{user.phone || user.email}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                  <span className="text-[11px] text-slate-400 truncate max-w-[180px]">{user.email}</span>
                  {user.role !== 'SUPER_ADMIN' && (
                    <button
                      onClick={() => setDeleteModal(user)}
                      className="px-2.5 py-1 text-red-600 hover:bg-red-50 font-bold rounded-lg text-xs flex items-center gap-1"
                    >
                      <Trash2 size={12} /> Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'Role Permissions' && (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="font-sans font-bold text-slate-800 text-sm">Permission Matrix</h3>
            <p className="text-xs text-slate-400 mt-0.5">Overview of what each role can access and do.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs min-w-[600px]">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="px-4 py-3 text-left font-semibold text-slate-500 uppercase tracking-wider text-[10px] w-36">Section</th>
                  {ROLES.map(role => (
                    <th key={role} className="px-4 py-3 text-center font-semibold text-slate-500 text-[10px] whitespace-nowrap">
                      <span className={`inline-block px-2 py-1 rounded-full ${ROLE_COLORS[role] || 'bg-slate-100 text-slate-500'}`}>
                        {roleLabels[role].split(' ')[0]}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {PERMISSION_KEYS.map(key => (
                  <tr key={key} className="hover:bg-slate-50/40 transition-colors">
                    <td className="px-4 py-3 font-semibold text-slate-700 capitalize">{key}</td>
                    {ROLES.map(role => (
                      <td key={role} className="px-4 py-3">
                        <PermCell level={permissions[role]?.[key] || 'none'} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-slate-200 bg-slate-50/30">
                  <td className="px-4 py-3 text-slate-400 text-[10px] col-span-8" colSpan={ROLES.length + 1}>
                    <div className="flex items-center gap-4 flex-wrap">
                      <span className="flex items-center gap-1.5"><Check size={11} className="text-emerald-500" /> Full Access</span>
                      <span className="flex items-center gap-1.5"><span className="text-[10px] font-bold text-amber-500">View</span> View Only</span>
                      <span className="flex items-center gap-1.5"><X size={10} className="text-slate-300" /> No Access</span>
                    </div>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* Add user modal */}
      {addModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setAddModal(false)}>
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
          <div className="relative bg-white rounded-2xl shadow-2xl w-[calc(100vw-32px)] max-w-md max-h-[90vh] overflow-y-auto p-5 sm:p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-sans font-bold text-slate-800 text-base">Add Admin User</h3>
              <button onClick={() => setAddModal(false)} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
            </div>
            <div className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                {[['First Name', 'firstName'], ['Last Name', 'lastName']].map(([label, key]) => (
                  <div key={key}>
                    <label className="text-xs font-semibold text-slate-600 block mb-1.5">{label} *</label>
                    <input className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-teal" value={newUser[key]} onChange={e => set(key, e.target.value)} />
                  </div>
                ))}
              </div>
              {[
                ['Email', 'email', 'email'],
                ['Phone', 'phone', 'tel'],
              ].map(([label, key, type]) => (
                <div key={key}>
                  <label className="text-xs font-semibold text-slate-600 block mb-1.5">{label} {key === 'email' && '*'}</label>
                  <input type={type} className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-teal" value={newUser[key]} onChange={e => set(key, e.target.value)} />
                </div>
              ))}
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1.5">Role</label>
                <select className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-brand-teal" value={newUser.role} onChange={e => set('role', e.target.value)}>
                  {ROLES.filter(r => r !== 'SUPER_ADMIN').map(r => <option key={r} value={r}>{roleLabels[r]}</option>)}
                </select>
              </div>
              <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                <input type="checkbox" checked className="accent-brand-teal" readOnly />
                Send invitation email
              </label>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setAddModal(false)} className="flex-1 border border-slate-200 rounded-lg py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
              <button onClick={addUser} className="flex-1 bg-brand-teal hover:bg-brand-tealDark text-white rounded-lg py-2.5 text-sm font-semibold transition-colors">Add User</button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteModal}
        onClose={() => setDeleteModal(null)}
        onConfirm={() => setUsers(u => u.filter(usr => usr.id !== deleteModal?.id))}
        title="Remove User"
        message={`Remove "${deleteModal?.name}" from the admin panel? They will lose all access immediately.`}
        confirmLabel="Remove User"
        variant="danger"
      />
    </div>
  );
}
