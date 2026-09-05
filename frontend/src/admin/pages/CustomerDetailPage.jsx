// CustomerDetailPage — /admin/customers/:id (Fully Editable Profile, Addresses & CRM Notes)
import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft, Phone, Mail, ShoppingBag, Heart, Eye, Edit2, Trash2,
  MapPin, Check, Plus, MessageSquare, Clock, Crown, ShieldAlert, X
} from 'lucide-react';
import StatusBadge from '../components/ui/StatusBadge';
import ConfirmModal from '../components/ui/ConfirmModal';
import { useCustomers } from '../../context/CustomerContext';
import { useOrders } from '../../context/OrderContext';

const TABS = ['Profile', 'Orders', 'Cart', 'Wishlist'];

export default function CustomerDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { customers, updateCustomer, deleteCustomer, toggleCustomerStatus, addCustomerNote } = useCustomers();
  const { adminOrders } = useOrders();

  const customer = customers.find(c => c.id === id);
  const [tab, setTab] = useState('Profile');

  // Modals & form state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [confirmModal, setConfirmModal] = useState(null);
  const [toast, setToast] = useState(null);
  const [newNoteText, setNewNoteText] = useState('');

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

  if (!customer) {
    return (
      <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm">
        <p className="text-slate-500 font-medium">Customer not found or has been removed.</p>
        <Link to="/admin/customers" className="text-brand-teal font-semibold mt-3 inline-block hover:underline">
          &larr; Back to Customers List
        </Link>
      </div>
    );
  }

  const customerOrders = (adminOrders || []).filter(o => o.customer?.id === customer.id || o.customer?.phone === customer.phone);

  const handleOpenEdit = () => {
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
    setIsEditModalOpen(true);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!formData.firstName.trim() || !formData.email.trim()) {
      showToast('First Name and Email are required.');
      return;
    }

    updateCustomer(customer.id, {
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

    showToast('Customer profile updated successfully!');
    setIsEditModalOpen(false);
  };

  const promptDelete = () => {
    setConfirmModal({
      title: 'Delete Customer',
      message: `Are you sure you want to delete "${customer.name}"? All profile data will be permanently removed.`,
      confirmLabel: 'Delete Customer',
      variant: 'danger',
      onConfirm: () => {
        deleteCustomer(customer.id);
        navigate('/admin/customers');
      },
    });
  };

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    addCustomerNote(customer.id, newNoteText);
    setNewNoteText('');
    showToast('CRM note recorded.');
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

      {/* Header & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3.5">
          <button
            onClick={() => navigate('/admin/customers')}
            className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors"
            title="Back to customers"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="font-sans font-bold text-slate-800 text-lg leading-tight">{customer.name}</h1>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                customer.tier === 'VIP' ? 'bg-amber-100 text-amber-800' :
                customer.tier === 'Wholesale' ? 'bg-indigo-50 text-indigo-700' :
                'bg-slate-100 text-slate-600'
              }`}>
                {customer.tier === 'VIP' && <Crown size={10} />}
                {customer.tier || 'Regular'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 font-mono">{customer.id} · Registered {customer.joinedAt}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              toggleCustomerStatus(customer.id);
              showToast(`Status toggled to ${customer.status === 'active' ? 'inactive' : 'active'}`);
            }}
            className="cursor-pointer hover:opacity-80 transition-opacity"
            title="Click to toggle status"
          >
            <StatusBadge status={customer.status} size="md" />
          </button>
          <button
            onClick={handleOpenEdit}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-brand-powder hover:bg-brand-teal text-brand-teal hover:text-white text-xs font-semibold rounded-lg transition-all shadow-2xs"
          >
            <Edit2 size={13} /> Edit Customer
          </button>
          <button
            onClick={promptDelete}
            className="flex items-center gap-1.5 px-3.5 py-2 border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold rounded-lg transition-colors"
          >
            <Trash2 size={13} /> Delete
          </button>
        </div>
      </div>

      {/* Profile quick stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
          <div className="w-14 h-14 bg-brand-powder rounded-full flex items-center justify-center text-brand-teal font-bold text-lg flex-shrink-0">
            {customer.firstName ? customer.firstName.charAt(0) : 'C'}{customer.lastName ? customer.lastName.charAt(0) : ''}
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-slate-800 truncate text-sm">{customer.name}</h3>
            <p className="text-[11px] text-slate-500 truncate mt-0.5">{customer.email}</p>
            <p className="text-[11px] text-slate-500 truncate">{customer.phone || 'No phone'}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-brand-powder text-brand-teal">
            <ShoppingBag size={20} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Orders</p>
            <p className="font-bold text-slate-800 text-lg font-sans mt-0.5">{customer.totalOrders || 0}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-emerald-50 text-emerald-600">
            <ShoppingBag size={20} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Spent</p>
            <p className="font-bold text-slate-800 text-lg font-sans mt-0.5">₹{(customer.totalSpent || 0).toLocaleString('en-IN')}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-violet-50 text-violet-600">
            <Clock size={20} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Last Order</p>
            <p className="font-bold text-slate-800 text-sm font-sans mt-0.5">{customer.lastOrderDate || 'No orders yet'}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto no-scrollbar">
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-3 text-xs font-semibold transition-all border-b-2 -mb-px flex items-center gap-1.5 ${
              tab === t
                ? 'text-brand-teal border-brand-teal'
                : 'text-slate-500 border-transparent hover:text-slate-700'
            }`}
          >
            {t}
            {t === 'Cart' && customer.cartItems && customer.cartItems.length > 0 && (
              <span className="px-1.5 py-0.2 bg-slate-100 text-slate-500 rounded-full text-[10px] font-bold">
                {customer.cartItems.length}
              </span>
            )}
            {t === 'Wishlist' && customer.wishlistItems && customer.wishlistItems.length > 0 && (
              <span className="px-1.5 py-0.2 bg-slate-100 text-slate-500 rounded-full text-[10px] font-bold">
                {customer.wishlistItems.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab 1: Profile & Addresses */}
      {tab === 'Profile' && (
        <div className="grid lg:grid-cols-2 gap-5">
          {/* Customer info card */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-sans font-bold text-slate-800 text-sm">Personal & Account Information</h3>
              <button
                onClick={handleOpenEdit}
                className="text-brand-teal text-xs font-semibold hover:underline flex items-center gap-1"
              >
                <Edit2 size={11} /> Edit
              </button>
            </div>
            <div className="grid sm:grid-cols-2 gap-4 text-xs">
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Customer ID</span>
                <span className="font-mono font-bold text-slate-700">{customer.id}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Full Name</span>
                <span className="font-semibold text-slate-800">{customer.name}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</span>
                <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <Mail size={12} className="text-slate-400" /> {customer.email}
                </span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Phone Number</span>
                <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <Phone size={12} className="text-slate-400" /> {customer.phone || 'Not provided'}
                </span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Customer Tier</span>
                <span className="font-semibold text-brand-teal">{customer.tier || 'Regular'}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Account Status</span>
                <span className="font-semibold text-slate-700 capitalize">{customer.status}</span>
              </div>
            </div>
          </div>

          {/* Shipping & Delivery Address Card */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-sans font-bold text-slate-800 text-sm flex items-center gap-2">
                <MapPin size={15} className="text-brand-teal" /> Primary Delivery Address
              </h3>
              <button
                onClick={handleOpenEdit}
                className="text-brand-teal text-xs font-semibold hover:underline flex items-center gap-1"
              >
                <Edit2 size={11} /> Edit Address
              </button>
            </div>
            {customer.address?.street || customer.address?.city ? (
              <div className="space-y-1 text-xs text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <p className="font-bold text-slate-800">{customer.name}</p>
                <p className="text-slate-600">{customer.address?.street || 'Street address'}</p>
                <p className="text-slate-600">
                  {customer.address?.city}{customer.address?.state ? `, ${customer.address?.state}` : ''}
                  {customer.address?.pincode ? ` - ${customer.address?.pincode}` : ''}
                </p>
                <p className="text-slate-500 pt-1 font-medium">Contact: {customer.phone}</p>
              </div>
            ) : (
              <div className="p-6 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-400 text-xs">
                <p>No primary address recorded.</p>
                <button
                  onClick={handleOpenEdit}
                  className="mt-2 text-brand-teal font-semibold hover:underline"
                >
                  + Add Customer Address
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Orders */}
      {tab === 'Orders' && (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
          {customerOrders.length === 0 ? (
            <div className="text-center py-12 text-xs text-slate-400">No orders placed by this customer yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
                    {['Order ID', 'Items', 'Amount', 'Payment', 'Status', 'Date', ''].map(h => (
                      <th key={h} className="px-4 py-3.5 text-left font-semibold text-slate-400 uppercase tracking-wider text-[10px]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {customerOrders.map(order => (
                    <tr key={order.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-4 py-3.5 font-mono font-bold text-brand-teal">#{order.id}</td>
                      <td className="px-4 py-3.5 text-slate-600">{order.items.length} items</td>
                      <td className="px-4 py-3.5 font-bold text-slate-800">₹{order.total.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3.5"><StatusBadge status={order.paymentStatus} /></td>
                      <td className="px-4 py-3.5"><StatusBadge status={order.status} /></td>
                      <td className="px-4 py-3.5 text-slate-400">{order.date}</td>
                      <td className="px-4 py-3.5">
                        <Link to={`/admin/orders/${order.id}`} className="flex items-center gap-1 text-brand-teal font-semibold hover:underline text-xs">
                          <Eye size={11} /> View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Cart */}
      {tab === 'Cart' && (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-sans font-bold text-slate-800 text-sm flex items-center gap-2">
              <ShoppingBag size={15} className="text-slate-400" />
              Active Shopping Bag ({(customer.cartItems || []).length} items)
            </h3>
          </div>
          {(!customer.cartItems || customer.cartItems.length === 0) ? (
            <div className="text-center py-12 text-xs text-slate-400">Customer shopping bag is currently empty.</div>
          ) : (
            <div className="divide-y divide-slate-50">
              {customer.cartItems.map((item, i) => (
                <div key={i} className="flex gap-4 px-5 py-4">
                  <img src={item.image} alt={item.name} className="w-12 h-14 object-cover rounded-lg border border-slate-100" />
                  <div className="flex-1">
                    <p className="font-semibold text-slate-800 text-xs">{item.name}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{item.variant} · Qty: {item.qty}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Added {item.addedAt}</p>
                  </div>
                  <p className="font-bold text-slate-800 text-xs">₹{(item.price * item.qty).toLocaleString('en-IN')}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 5: Wishlist */}
      {tab === 'Wishlist' && (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-sans font-bold text-slate-800 text-sm flex items-center gap-2">
              <Heart size={15} className="text-slate-400" />
              Wishlist Items ({(customer.wishlistItems || []).length} items)
            </h3>
          </div>
          {(!customer.wishlistItems || customer.wishlistItems.length === 0) ? (
            <div className="text-center py-12 text-xs text-slate-400">Wishlist is empty.</div>
          ) : (
            <div className="divide-y divide-slate-50">
              {customer.wishlistItems.map((item, i) => (
                <div key={i} className="flex gap-4 px-5 py-4">
                  <img src={item.image} alt={item.name} className="w-12 h-14 object-cover rounded-lg border border-slate-100" />
                  <div className="flex-1">
                    <p className="font-semibold text-slate-800 text-xs">{item.name}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Added {item.addedAt}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-800 text-xs">₹{item.price.toLocaleString('en-IN')}</p>
                    <StatusBadge status={item.stock === 'In Stock' ? 'in-stock' : 'low-stock'} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Edit Customer Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={() => setIsEditModalOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden animate-[fadeInUp_0.2s_ease-out]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand-powder text-brand-teal flex items-center justify-center font-bold">
                  <Edit2 size={16} />
                </div>
                <div>
                  <h3 className="font-sans font-bold text-slate-800 text-sm">Edit Customer ({customer.id})</h3>
                  <p className="text-[10px] text-slate-400">Update personal info, addresses, and tier</p>
                </div>
              </div>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">First Name *</label>
                  <input
                    required
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 outline-none focus:border-brand-teal"
                    value={formData.firstName}
                    onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Last Name</label>
                  <input
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 outline-none focus:border-brand-teal"
                    value={formData.lastName}
                    onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 outline-none focus:border-brand-teal"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Phone Number</label>
                  <input
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 outline-none focus:border-brand-teal"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Status</label>
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
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Customer Tier</label>
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
                <p className="text-[11px] font-bold text-slate-600 mb-2">Delivery Address</p>
                <div className="space-y-2.5">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Street Address</label>
                    <input
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 outline-none focus:border-brand-teal"
                      value={formData.street}
                      onChange={e => setFormData({ ...formData, street: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">City</label>
                      <input
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 outline-none focus:border-brand-teal"
                        value={formData.city}
                        onChange={e => setFormData({ ...formData, city: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">State</label>
                      <input
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 outline-none focus:border-brand-teal"
                        value={formData.state}
                        onChange={e => setFormData({ ...formData, state: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Pincode</label>
                      <input
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 outline-none focus:border-brand-teal"
                        value={formData.pincode}
                        onChange={e => setFormData({ ...formData, pincode: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 border border-slate-200 rounded-lg py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-brand-teal hover:bg-brand-tealDark text-white rounded-lg py-2.5 text-xs font-semibold transition-colors shadow-sm"
                >
                  Save Changes
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
