// OrdersPage — /admin/orders
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Eye, Filter } from 'lucide-react';
import AdminPageHeader from '../components/ui/AdminPageHeader';
import StatusBadge from '../components/ui/StatusBadge';
import Pagination from '../components/ui/Pagination';
import { adminOrders } from '../data/adminOrders';

const PAGE_SIZE = 7;
const STATUS_TABS = ['All', 'Pending', 'Confirmed', 'Packed', 'Shipped', 'Delivered', 'Cancelled', 'Returned'];

export default function OrdersPage() {
  const [search, setSearch] = useState('');
  const [statusTab, setStatusTab] = useState('All');
  const [paymentFilter, setPaymentFilter] = useState('All');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let list = [...adminOrders];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(o =>
        o.id.toLowerCase().includes(q) ||
        o.customer.name.toLowerCase().includes(q) ||
        o.customer.phone.includes(q)
      );
    }
    if (statusTab !== 'All') list = list.filter(o => o.status === statusTab.toLowerCase());
    if (paymentFilter !== 'All') list = list.filter(o => o.paymentStatus === paymentFilter.toLowerCase());
    return list;
  }, [search, statusTab, paymentFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-5">
      <AdminPageHeader title="Orders" subtitle="Manage all customer orders and fulfillment." />

      {/* Status tabs */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-x-auto">
        <div className="flex border-b border-slate-100 min-w-max">
          {STATUS_TABS.map(t => {
            const count = t === 'All' ? adminOrders.length : adminOrders.filter(o => o.status === t.toLowerCase()).length;
            return (
              <button
                key={t}
                onClick={() => { setStatusTab(t); setPage(1); }}
                className={`flex items-center gap-2 px-4 py-3.5 text-xs font-semibold whitespace-nowrap border-b-2 -mb-px transition-all ${
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

        {/* Filter bar */}
        <div className="flex flex-wrap gap-3 items-center p-4">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 flex-1 min-w-[180px] max-w-sm">
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
            className="border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 bg-white focus:outline-none focus:border-brand-teal"
          >
            {['All', 'Paid', 'Pending', 'Refunded', 'Failed'].map(p => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders table */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                {['Order ID', 'Customer', 'Items', 'Amount', 'Payment', 'Status', 'Date', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3.5 text-left font-semibold text-slate-400 uppercase tracking-wider text-[10px] whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-sm text-slate-400">No orders found.</td>
                </tr>
              ) : paginated.map(order => (
                <tr key={order.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-4 py-3.5 font-mono font-bold text-brand-teal text-xs">#{order.id}</td>
                  <td className="px-4 py-3.5">
                    <div>
                      <p className="font-semibold text-slate-800 whitespace-nowrap">{order.customer.name}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{order.customer.phone}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-slate-600">
                    {order.items.length} item{order.items.length > 1 ? 's' : ''}
                  </td>
                  <td className="px-4 py-3.5 font-bold text-slate-800 whitespace-nowrap">
                    ₹{order.total.toLocaleString('en-IN')}
                  </td>
                  <td className="px-4 py-3.5">
                    <StatusBadge status={order.paymentStatus} />
                  </td>
                  <td className="px-4 py-3.5">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-4 py-3.5 text-slate-400 whitespace-nowrap">{order.date}</td>
                  <td className="px-4 py-3.5">
                    <Link
                      to={`/admin/orders/${order.id}`}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-powder hover:bg-brand-teal/20 text-brand-teal text-xs font-semibold rounded-lg transition-colors whitespace-nowrap"
                    >
                      <Eye size={12} /> View
                    </Link>
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
    </div>
  );
}
