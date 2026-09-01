// CustomersPage — /admin/customers (Fully Editable with CRUD & Persistence)
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Eye, Users, Plus, Edit2, Trash2, Check,
  UserCheck, UserX, Crown, Phone, Mail, MapPin, X, RotateCcw
} from 'lucide-react';
import AdminPageHeader from '../components/ui/AdminPageHeader';
import StatusBadge from '../components/ui/StatusBadge';
import Pagination from '../components/ui/Pagination';
import EmptyState from '../components/ui/EmptyState';
import ConfirmModal from '../components/ui/ConfirmModal';
import { useCustomers } from '../../context/CustomerContext';

const PAGE_SIZE = 8;

export default function CustomersPage() {
  const navigate = useNavigate();
  const {
    customers,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    toggleCustomerStatus,
    resetCustomers
  } = useCustomers();

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [tierFilter, setTierFilter] = useState('All');
  const [page, setPage] = useState(1);

  // Modals & Toasts
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [confirmModal, setConfirmModal] = useState(null);
  const [toast, setToast] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    status: 'active',
    tier: 'Regular',
    street: '',
    city: '',
    state: '',
    pincode: '',
    totalOrders: 0,
    totalSpent: 0,
  });

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const filtered = useMemo(() => {
    let list = [...customers];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q) ||
        (c.phone && c.phone.toLowerCase().includes(q)) ||
        (c.email && c.email.toLowerCase().includes(q)) ||
        (c.address?.city && c.address.city.toLowerCase().includes(q))
      );
    }
    if (status !== 'All') list = list.filter(c => c.status === status.toLowerCase());
    if (tierFilter !== 'All') list = list.filter(c => (c.tier || 'Regular') === tierFilter);
    return list;
  }, [customers, search, status, tierFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1;
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Open Add Modal
  const handleOpenAdd = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      status: 'active',
      tier: 'Regular',
      street: '',
      city: '',
      state: '',
      pincode: '',
      totalOrders: 0,
      totalSpent: 0,
    });
    setIsAddModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (customer, e) => {
    if (e) e.stopPropagation();
    setEditingCustomer(customer);
    setFormData({
      firstName: customer.firstName || '',
      lastName: customer.lastName || '',
      email: customer.email || '',
      phone: customer.phone || '',
      status: customer.status || 'active',
      tier: customer.tier || 'Regular',
      street: customer.address?.street || '',
      city: customer.address?.city || '',
      state: customer.address?.state || '',
      pincode: customer.address?.pincode || '',
      totalOrders: customer.totalOrders || 0,
      totalSpent: customer.totalSpent || 0,
    });
  };

  // Handle Save (Add or Edit)
  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (!formData.firstName.trim() || !formData.email.trim()) {
      showToast('First Name and Email are required!');
      return;
    }

    if (editingCustomer) {
      updateCustomer(editingCustomer.id, {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        status: formData.status,
        tier: formData.tier,
        address: {
          street: formData.street.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          pincode: formData.pincode.trim(),
        },
        totalOrders: Number(formData.totalOrders) || 0,
        totalSpent: Number(formData.totalSpent) || 0,
      });
      showToast(`Customer "${formData.firstName} ${formData.lastName}" updated successfully!`);
      setEditingCustomer(null);
    } else {
      const created = addCustomer({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        status: formData.status,
        tier: formData.tier,
        street: formData.street.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        pincode: formData.pincode.trim(),
        totalOrders: Number(formData.totalOrders) || 0,
        totalSpent: Number(formData.totalSpent) || 0,
      });
      showToast(`New customer "${created.name}" created with ID ${created.id}!`);
      setIsAddModalOpen(false);
    }
  };

  // Prompt Delete
  const promptDelete = (customer, e) => {
    if (e) e.stopPropagation();
    setConfirmModal({
      title: 'Delete Customer',
      message: `Are you sure you want to permanently delete customer "${customer.name}" (${customer.id})? This action cannot be undone.`,
      confirmLabel: 'Delete Customer',
      variant: 'danger',
      onConfirm: () => {
        deleteCustomer(customer.id);
        showToast(`Customer "${customer.name}" deleted.`);
      },
    });
  };

  // Prompt Status Toggle
  const handleToggleStatus = (customer, e) => {
    if (e) e.stopPropagation();
    const nextStatus = customer.status === 'active' ? 'inactive' : 'active';
    toggleCustomerStatus(customer.id);
    showToast(`Customer "${customer.name}" marked as ${nextStatus}.`);
  };

  // Prompt Reset to Defaults
  const promptResetDefaults = () => {
    setConfirmModal({
      title: 'Reset Customer Data',
      message: 'Are you sure you want to reset all customer records back to the default dataset? Custom additions and edits will be removed.',
      confirmLabel: 'Reset Defaults',
      variant: 'danger',
      onConfirm: () => {
        resetCustomers();
        showToast('Customer data reset to default demo records.');
      },
    });
  };

  return (
    <div className="space-y-5 relative">
      {/* Toast notification */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 animate-[fadeInUp_0.25s_ease-out]">
          <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
            <Check size={14} />
          </div>
          <span className="text-xs font-semibold">{toast}</span>
        </div>
      )}

      <AdminPageHeader title="Customer Management" subtitle="View, create, edit, and manage your full customer base.">
        <div className="flex items-center gap-2">
          <button
            onClick={promptResetDefaults}
            className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 text-xs font-semibold text-slate-500 hover:text-red-600 hover:border-red-200 rounded-lg hover:bg-red-50 transition-colors shadow-sm"
          >
            <RotateCcw size={13} /> Reset Demo Data
          </button>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4 py-2 bg-brand-teal hover:bg-brand-tealDark text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
          >
            <Plus size={14} /> Add Customer
          </button>
        </div>
      </AdminPageHeader>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Customers', value: customers.length },
          { label: 'Active Customers', value: customers.filter(c => c.status === 'active').length },
          { label: 'Total Revenue', value: `₹${(customers.reduce((s, c) => s + (c.totalSpent || 0), 0) / 100000).toFixed(1)}L` },
          {
            label: 'Avg. Order Value',
            value: customers.reduce((s, c) => s + (c.totalOrders || 0), 0) > 0
              ? `₹${Math.round(customers.reduce((s, c) => s + (c.totalSpent || 0), 0) / customers.reduce((s, c) => s + (c.totalOrders || 0), 0)).toLocaleString('en-IN')}`
              : '₹0'
          },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-xl border border-slate-100 shadow-sm px-5 py-4">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
            <p className="font-bold text-slate-800 text-xl font-sans mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex flex-wrap gap-3 items-center justify-between">
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 flex-1 min-w-[200px] max-w-md">
          <Search size={14} className="text-slate-400" />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search customer name, ID, phone, email or city..."
            className="bg-transparent text-xs text-slate-700 placeholder-slate-400 outline-none w-full"
          />
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span>Status:</span>
            <select
              value={status}
              onChange={e => { setStatus(e.target.value); setPage(1); }}
              className="border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 bg-white focus:outline-none focus:border-brand-teal"
            >
              {['All', 'Active', 'Inactive'].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span>Tier:</span>
            <select
              value={tierFilter}
              onChange={e => { setTierFilter(e.target.value); setPage(1); }}
              className="border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 bg-white focus:outline-none focus:border-brand-teal"
            >
              {['All', 'Regular', 'VIP', 'Wholesale', 'First Time'].map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Customers table */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                {['ID', 'Customer', 'Tier', 'Phone', 'Email', 'Orders', 'Total Spent', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-5 py-3.5 text-left font-semibold text-slate-400 uppercase tracking-wider text-[10px] whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={9}>
                    <EmptyState icon={Users} title="No customers found" description="Try adjusting your search criteria or add a new customer." />
                  </td>
                </tr>
              ) : paginated.map(c => (
                <tr
                  key={c.id}
                  onClick={() => navigate(`/admin/customers/${c.id}`)}
                  className="hover:bg-brand-powder/20 cursor-pointer transition-colors group"
                >
                  <td className="px-5 py-3.5 font-mono text-[10px] text-slate-500 font-semibold">{c.id}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 bg-brand-powder rounded-full flex items-center justify-center text-brand-teal font-bold text-xs flex-shrink-0">
                        {c.firstName ? c.firstName.charAt(0) : 'C'}{c.lastName ? c.lastName.charAt(0) : ''}
                      </div>
                      <div>
                        <span className="font-semibold text-slate-800 whitespace-nowrap group-hover:text-brand-teal transition-colors block">
                          {c.name || 'Unnamed'}
                        </span>
                        {c.address?.city && (
                          <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                            <MapPin size={9} /> {c.address.city}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      c.tier === 'VIP' ? 'bg-amber-100 text-amber-800' :
                      c.tier === 'Wholesale' ? 'bg-indigo-50 text-indigo-700' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {c.tier === 'VIP' && <Crown size={10} />}
                      {c.tier || 'Regular'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-600 whitespace-nowrap font-medium">{c.phone || '—'}</td>
                  <td className="px-5 py-3.5 text-slate-500 max-w-[150px] truncate">{c.email}</td>
                  <td className="px-5 py-3.5 font-semibold text-slate-700">{c.totalOrders || 0}</td>
                  <td className="px-5 py-3.5 font-bold text-slate-800">₹{(c.totalSpent || 0).toLocaleString('en-IN')}</td>
                  <td className="px-5 py-3.5">
                    <button
                      onClick={(e) => handleToggleStatus(c, e)}
                      className="cursor-pointer hover:opacity-80 transition-opacity"
                      title="Click to toggle status"
                    >
                      <StatusBadge status={c.status} />
                    </button>
                  </td>
                  <td className="px-5 py-3.5" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={(e) => handleOpenEdit(c, e)}
                        className="p-1.5 hover:bg-brand-powder rounded-lg text-slate-400 hover:text-brand-teal transition-colors"
                        title="Edit Customer"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => navigate(`/admin/customers/${c.id}`)}
                        className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700 transition-colors"
                        title="View Profile"
                      >
                        <Eye size={13} />
                      </button>
                      <button
                        onClick={(e) => promptDelete(c, e)}
                        className="p-1.5 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-600 transition-colors"
                        title="Delete Customer"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {paginated.length > 0 && (
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} totalItems={filtered.length} pageSize={PAGE_SIZE} />
        )}
      </div>

      {/* Add / Edit Customer Modal */}
      {(isAddModalOpen || editingCustomer) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
            onClick={() => { setIsAddModalOpen(false); setEditingCustomer(null); }}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden animate-[fadeInUp_0.2s_ease-out]">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand-powder text-brand-teal flex items-center justify-center font-bold">
                  {editingCustomer ? <Edit2 size={16} /> : <Plus size={16} />}
                </div>
                <div>
                  <h3 className="font-sans font-bold text-slate-800 text-sm">
                    {editingCustomer ? `Edit Customer (${editingCustomer.id})` : 'Add New Customer'}
                  </h3>
                  <p className="text-[10px] text-slate-400">
                    {editingCustomer ? 'Update profile information and customer tier' : 'Fill out customer personal & contact information'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => { setIsAddModalOpen(false); setEditingCustomer(null); }}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmitForm} className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    First Name *
                  </label>
                  <input
                    required
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 outline-none focus:border-brand-teal"
                    value={formData.firstName}
                    onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                    placeholder="e.g. Priya"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Last Name
                  </label>
                  <input
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 outline-none focus:border-brand-teal"
                    value={formData.lastName}
                    onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                    placeholder="e.g. Sharma"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 outline-none focus:border-brand-teal"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. priya.sharma@gmail.com"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Phone Number
                  </label>
                  <input
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 outline-none focus:border-brand-teal"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. +91 98765 43210"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Account Status
                  </label>
                  <select
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 outline-none focus:border-brand-teal bg-white"
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Customer Tier / Tag
                  </label>
                  <select
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 outline-none focus:border-brand-teal bg-white"
                    value={formData.tier}
                    onChange={e => setFormData({ ...formData, tier: e.target.value })}
                  >
                    <option value="Regular">Regular</option>
                    <option value="VIP">VIP Client</option>
                    <option value="Wholesale">Wholesale Buyer</option>
                    <option value="First Time">First Time Shopper</option>
                  </select>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-3">
                <p className="text-[11px] font-bold text-slate-600 mb-2">Address Information</p>
                <div className="space-y-2.5">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Street Address</label>
                    <input
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 outline-none focus:border-brand-teal"
                      value={formData.street}
                      onChange={e => setFormData({ ...formData, street: e.target.value })}
                      placeholder="e.g. 42, Jubilee Hills Road No. 36"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">City</label>
                      <input
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 outline-none focus:border-brand-teal"
                        value={formData.city}
                        onChange={e => setFormData({ ...formData, city: e.target.value })}
                        placeholder="e.g. Hyderabad"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">State</label>
                      <input
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 outline-none focus:border-brand-teal"
                        value={formData.state}
                        onChange={e => setFormData({ ...formData, state: e.target.value })}
                        placeholder="e.g. Telangana"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Pincode</label>
                      <input
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 outline-none focus:border-brand-teal"
                        value={formData.pincode}
                        onChange={e => setFormData({ ...formData, pincode: e.target.value })}
                        placeholder="e.g. 500033"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-3 grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Total Orders
                  </label>
                  <input
                    type="number"
                    min="0"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 outline-none focus:border-brand-teal"
                    value={formData.totalOrders}
                    onChange={e => setFormData({ ...formData, totalOrders: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Total Spent (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 outline-none focus:border-brand-teal"
                    value={formData.totalSpent}
                    onChange={e => setFormData({ ...formData, totalSpent: e.target.value })}
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => { setIsAddModalOpen(false); setEditingCustomer(null); }}
                  className="flex-1 border border-slate-200 rounded-lg py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-brand-teal hover:bg-brand-tealDark text-white rounded-lg py-2.5 text-xs font-semibold transition-colors shadow-sm"
                >
                  {editingCustomer ? 'Save Changes' : 'Create Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmModal && (
        <ConfirmModal
          isOpen={!!confirmModal}
          onClose={() => setConfirmModal(null)}
          onConfirm={confirmModal.onConfirm}
          title={confirmModal.title}
          message={confirmModal.message}
          confirmLabel={confirmModal.confirmLabel}
          variant={confirmModal.variant}
        />
      )}
    </div>
  );
}
