// CustomersPage — /admin/customers
import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Eye, Users } from 'lucide-react';
import AdminPageHeader from '../components/ui/AdminPageHeader';
import StatusBadge from '../components/ui/StatusBadge';
import Pagination from '../components/ui/Pagination';
import EmptyState from '../components/ui/EmptyState';
import { adminCustomers } from '../data/adminCustomers';

const PAGE_SIZE = 8;

export default function CustomersPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let list = [...adminCustomers];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.email.toLowerCase().includes(q)
      );
    }
    if (status !== 'All') list = list.filter(c => c.status === status.toLowerCase());
    return list;
  }, [search, status]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-5">
      <AdminPageHeader title="Customers" subtitle="Manage your Suka Fashions customer base." />

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Customers', value: adminCustomers.length },
          { label: 'Active', value: adminCustomers.filter(c => c.status === 'active').length },
          { label: 'Total Revenue', value: `₹${(adminCustomers.reduce((s, c) => s + c.totalSpent, 0) / 100000).toFixed(1)}L` },
          { label: 'Avg. Order Value', value: `₹${Math.round(adminCustomers.reduce((s, c) => s + c.totalSpent, 0) / adminCustomers.reduce((s, c) => s + c.totalOrders, 0)).toLocaleString('en-IN')}` },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-xl border border-slate-100 shadow-sm px-5 py-4">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
            <p className="font-bold text-slate-800 text-xl font-sans mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 flex-1 min-w-[180px] max-w-sm">
          <Search size={13} className="text-slate-400" />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search name, ID, phone or email..."
            className="bg-transparent text-xs text-slate-700 placeholder-slate-400 outline-none w-full"
          />
        </div>
        <select
          value={status}
          onChange={e => { setStatus(e.target.value); setPage(1); }}
          className="border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 bg-white focus:outline-none focus:border-brand-teal"
        >
          {['All', 'Active', 'Inactive'].map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      {/* Customers table */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                {['ID', 'Customer', 'Phone', 'Email', 'Orders', 'Total Spent', 'Cart', 'Wishlist', 'Joined', 'Status'].map(h => (
                  <th key={h} className="px-5 py-3.5 text-left font-semibold text-slate-400 uppercase tracking-wider text-[10px] whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={10}>
                    <EmptyState icon={Users} title="No customers found" description="Try adjusting your search." />
                  </td>
                </tr>
              ) : paginated.map(c => (
                <tr key={c.id} onClick={() => navigate(`/admin/customers/${c.id}`)} className="hover:bg-brand-powder/20 cursor-pointer transition-colors group">
                  <td className="px-5 py-3.5 font-mono text-[10px] text-slate-500">{c.id}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 bg-brand-powder rounded-full flex items-center justify-center text-brand-teal font-bold text-xs flex-shrink-0">
                        {c.firstName.charAt(0)}{c.lastName.charAt(0)}
                      </div>
                      <span className="font-semibold text-slate-800 whitespace-nowrap group-hover:text-brand-teal transition-colors">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-slate-600 whitespace-nowrap font-medium">{c.phone}</td>
                  <td className="px-5 py-3.5 text-slate-500 max-w-[140px] truncate">{c.email}</td>
                  <td className="px-5 py-3.5 font-semibold text-slate-700">{c.totalOrders}</td>
                  <td className="px-5 py-3.5 font-bold text-slate-800">₹{c.totalSpent.toLocaleString('en-IN')}</td>
                  <td className="px-5 py-3.5 text-slate-500">{c.cartItems.length}</td>
                  <td className="px-5 py-3.5 text-slate-500">{c.wishlistItems.length}</td>
                  <td className="px-5 py-3.5 text-slate-400 font-medium whitespace-nowrap">{c.joinedAt}</td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={c.status} />
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
