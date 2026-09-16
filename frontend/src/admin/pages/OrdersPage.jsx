// OrdersPage — /admin/orders
import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Eye, Filter, Plus, Edit2, MessageCircle, CheckCircle2 } from 'lucide-react';
import AdminPageHeader from '../components/ui/AdminPageHeader';
import StatusBadge from '../components/ui/StatusBadge';
import Pagination from '../components/ui/Pagination';
import { useOrders } from '../../context/OrderContext';
import OrderFormView from '../components/orders/OrderFormView';

const PAGE_SIZE = 8;
const STATUS_TABS = ['All', 'Pending', 'Confirmed', 'Packed', 'Shipped', 'Delivered', 'Cancelled', 'Returned'];

export default function OrdersPage() {
  const navigate = useNavigate();
  const { adminOrders, addAdminOrder, updateAdminOrder, generateNextOrderId } = useOrders();

  const [search, setSearch] = useState('');
  const [statusTab, setStatusTab] = useState('All');
  const [paymentFilter, setPaymentFilter] = useState('All');
  const [page, setPage] = useState(1);

  // View Mode: 'list' | 'create' | 'edit'
  const [viewMode, setViewMode] = useState('list');
  const [editingOrder, setEditingOrder] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filtered = useMemo(() => {
    let list = [...adminOrders];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(o =>
        (o.id && o.id.toLowerCase().includes(q)) ||
        (o.customer?.name && o.customer.name.toLowerCase().includes(q)) ||
        (o.customer?.phone && o.customer.phone.includes(q))
      );
    }
    if (statusTab !== 'All') list = list.filter(o => o.status === statusTab.toLowerCase());
    if (paymentFilter !== 'All') list = list.filter(o => o.paymentStatus === paymentFilter.toLowerCase());
    return list;
  }, [adminOrders, search, statusTab, paymentFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleOpenCreate = () => {
    setEditingOrder(null);
    setViewMode('create');
  };

  const handleOpenEdit = (e, order) => {
    e.stopPropagation(); // prevent navigating to detail page
    setEditingOrder(order);
    setViewMode('edit');
  };

  const handleSaveOrder = (orderData) => {
    if (editingOrder) {
      updateAdminOrder(editingOrder.id, orderData);
      showToast(`Order #${editingOrder.id} successfully updated!`);
    } else {
      const created = addAdminOrder(orderData);
      showToast(`New WhatsApp/Manual order #${created.id} created successfully!`);
    }
    setViewMode('list');
    setEditingOrder(null);
  };

  const handleBackToList = () => {
    setViewMode('list');
    setEditingOrder(null);
  };

  // If in create or edit mode, render OrderFormView inline with Back button
  if (viewMode === 'create' || viewMode === 'edit') {
    return (
      <div className="space-y-5">
        {toastMessage && (
          <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-fadeIn border border-emerald-400">
            <CheckCircle2 size={16} />
            <span>{toastMessage}</span>
          </div>
        )}
        <OrderFormView
          onBack={handleBackToList}
          onSave={handleSaveOrder}
          initialOrder={editingOrder}
          nextOrderId={generateNextOrderId()}
        />
      </div>
    );
  }

  // Default List View
  return (
    <div className="space-y-5">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-fadeIn border border-emerald-400">
          <CheckCircle2 size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <AdminPageHeader title="Orders" subtitle="Manage all customer orders, WhatsApp sales, and fulfillment." />
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-teal hover:bg-brand-tealDark text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-brand-teal/20 active:scale-95 self-start sm:self-auto cursor-pointer"
        >
          <Plus size={15} />
          <span>Add Order</span>
        </button>
      </div>

      {/* Status tabs */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-x-auto">
        <div className="flex border-b border-slate-100 min-w-max">
          {STATUS_TABS.map(t => {
            const count = t === 'All' ? adminOrders.length : adminOrders.filter(o => o.status === t.toLowerCase()).length;
            return (
              <button
                key={t}
                onClick={() => { setStatusTab(t); setPage(1); }}
                className={`flex items-center gap-2 px-4 py-3.5 text-xs font-semibold whitespace-nowrap border-b-2 -mb-px transition-all cursor-pointer ${
                  statusTab === t
                    ? 'text-brand-teal border-brand-teal'
                    : 'text-slate-500 border-transparent hover:text-slate-700'
                }`}
              >
                {t}
                {count > 0 && (
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                    statusTab === t ? 'bg-brand-teal text-white' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Filter bar with Add Order Button in highlighted spot */}
        <div className="flex flex-wrap gap-3 items-center justify-between p-4">
          <div className="flex flex-wrap gap-3 items-center flex-1">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 flex-1 min-w-[200px] max-w-sm">
              <Search size={13} className="text-slate-400" />
              <input
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                placeholder="Order ID, customer name or phone..."
                className="bg-transparent text-xs text-slate-700 placeholder-slate-400 outline-none w-full"
              />
            </div>
            <select
              value={paymentFilter}
              onChange={e => { setPaymentFilter(e.target.value); setPage(1); }}
              className="border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 bg-white focus:outline-none focus:border-brand-teal cursor-pointer"
            >
              {['All', 'Paid', 'Pending', 'Refunded', 'Failed'].map(p => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Orders container */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Desktop & Tablet Table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                {['Order ID', 'Customer', 'Items', 'Amount', 'Payment', 'Status', 'Date', 'Actions'].map(h => (
                  <th key={h} className={`px-5 py-3.5 text-left font-semibold text-slate-400 uppercase tracking-wider text-[10px] whitespace-nowrap ${h === 'Actions' ? 'text-right pr-6' : ''}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-sm text-slate-400">
                    No orders found.
                  </td>
                </tr>
              ) : paginated.map(order => (
                <tr
                  key={order.id}
                  onClick={() => navigate(`/admin/orders/${order.id}`)}
                  className="hover:bg-brand-powder/20 cursor-pointer transition-colors group"
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-brand-teal text-xs group-hover:underline">#{order.id}</span>
                      {order.orderSource === 'WhatsApp' && (
                        <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded border border-emerald-200">
                          WA
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div>
                      <p className="font-semibold text-slate-800 whitespace-nowrap group-hover:text-brand-teal transition-colors">
                        {order.customer?.name || 'Customer'}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5 font-medium">{order.customer?.phone || 'No phone'}</p>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-slate-600 font-medium">
                    {order.items?.length || 0} item{(order.items?.length || 0) > 1 ? 's' : ''}
                  </td>
                  <td className="px-5 py-3.5 font-bold text-slate-800 whitespace-nowrap">
                    ₹{Number(order.total || 0).toLocaleString('en-IN')}
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={order.paymentStatus} />
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-5 py-3.5 text-slate-400 font-medium whitespace-nowrap">{order.date}</td>
                  
                  {/* Actions Column with Side Edit Button */}
                  <td className="px-5 py-3.5 text-right whitespace-nowrap pr-6" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center justify-end">
                      <button
                        onClick={(e) => handleOpenEdit(e, order)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-slate-600 hover:text-brand-teal bg-slate-50 hover:bg-brand-teal/10 border border-slate-200 rounded-lg text-xs font-semibold transition-all cursor-pointer shadow-2xs"
                        title="Edit Order"
                      >
                        <Edit2 size={12} className="text-brand-teal" />
                        <span>Edit</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Order Cards View (< sm screens) */}
        <div className="block sm:hidden divide-y divide-slate-100">
          {paginated.length === 0 ? (
            <div className="text-center py-12 px-4 text-sm text-slate-400">
              No orders found.
            </div>
          ) : paginated.map(order => (
            <div
              key={order.id}
              onClick={() => navigate(`/admin/orders/${order.id}`)}
              className="p-4 hover:bg-slate-50 transition-colors cursor-pointer space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono font-bold text-brand-teal text-xs">#{order.id}</span>
                  {order.orderSource === 'WhatsApp' && (
                    <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded border border-emerald-200">
                      WA
                    </span>
                  )}
                </div>
                <StatusBadge status={order.status} />
              </div>

              <div className="flex items-start justify-between text-xs">
                <div>
                  <p className="font-bold text-slate-900">{order.customer?.name || 'Customer'}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{order.customer?.phone || 'No phone'}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900 font-mono text-sm">₹{Number(order.total || 0).toLocaleString('en-IN')}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{order.items?.length || 0} items</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                <div className="flex items-center gap-2">
                  <StatusBadge status={order.paymentStatus} />
                  <span className="text-[11px] text-slate-400">{order.date}</span>
                </div>
                <button
                  type="button"
                  onClick={(e) => handleOpenEdit(e, order)}
                  className="px-3 py-1 bg-slate-100 hover:bg-brand-teal/10 text-slate-700 hover:text-brand-teal font-semibold rounded-lg text-xs flex items-center gap-1"
                >
                  <Edit2 size={11} /> Edit
                </button>
              </div>
            </div>
          ))}
        </div>

        {paginated.length > 0 && (
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} totalItems={filtered.length} pageSize={PAGE_SIZE} />
        )}
      </div>
    </div>
  );
}


