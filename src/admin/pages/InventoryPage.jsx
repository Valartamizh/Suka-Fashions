// InventoryPage — /admin/inventory
import React, { useState, useMemo } from 'react';
import { Search, Package, AlertTriangle, CheckCircle, XCircle, TrendingDown, ChevronDown } from 'lucide-react';
import AdminPageHeader from '../components/ui/AdminPageHeader';
import StatusBadge from '../components/ui/StatusBadge';
import StockAdjustmentModal from '../components/ui/StockAdjustmentModal';
import Pagination from '../components/ui/Pagination';
import { adminInventory, inventoryHistory, getStockStatus } from '../data/adminInventory';

const PAGE_SIZE = 8;
const TABS = ['Inventory', 'History'];
const FILTER_OPTIONS = ['all', 'in-stock', 'low-stock', 'out-of-stock'];

const invStats = {
  total: adminInventory.reduce((s, i) => s + i.available, 0),
  inStock: adminInventory.filter(i => getStockStatus(i.available, i.minimumStock) === 'in-stock').length,
  lowStock: adminInventory.filter(i => getStockStatus(i.available, i.minimumStock) === 'low-stock').length,
  outOfStock: adminInventory.filter(i => getStockStatus(i.available, i.minimumStock) === 'out-of-stock').length,
  value: adminInventory.reduce((s, i) => s + i.available * 1200, 0), // approx avg cost
};

export default function InventoryPage() {
  const [tab, setTab] = useState('Inventory');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [adjustItem, setAdjustItem] = useState(null);
  const [inventory, setInventory] = useState(adminInventory);
  const [history, setHistory] = useState(inventoryHistory);

  const filtered = useMemo(() => {
    let list = [...inventory];
    if (search) list = list.filter(i =>
      i.productName.toLowerCase().includes(search.toLowerCase()) ||
      i.sku.toLowerCase().includes(search.toLowerCase())
    );
    if (filter !== 'all') list = list.filter(i => getStockStatus(i.available, i.minimumStock) === filter);
    return list;
  }, [inventory, search, filter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleAdjust = ({ type, quantity, reason, notes, item }) => {
    let newQty = item.available;
    if (type === 'add') newQty = item.available + quantity;
    else if (type === 'remove') newQty = Math.max(0, item.available - quantity);
    else if (type === 'set') newQty = quantity;

    const change = newQty - item.available;
    setInventory(inv => inv.map(i => i.id === item.id ? { ...i, available: newQty, lastUpdated: '2026-08-26' } : i));
    setHistory(h => [{
      id: `HIST${h.length + 1}`,
      date: '2026-08-26',
      productName: item.productName,
      sku: item.sku,
      action: type === 'add' ? 'Stock Added' : type === 'remove' ? 'Stock Removed' : 'Stock Set',
      oldQty: item.available,
      change,
      newQty,
      reason,
      updatedBy: 'Admin',
    }, ...h]);
  };

  return (
    <div className="space-y-5">
      <AdminPageHeader title="Inventory" subtitle="Monitor and manage product stock levels." />

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Total Units', value: invStats.total.toLocaleString('en-IN'), icon: Package, color: 'text-brand-teal', bg: 'bg-brand-powder' },
          { label: 'In Stock', value: invStats.inStock, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Low Stock', value: invStats.lowStock, icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Out of Stock', value: invStats.outOfStock, icon: XCircle, color: 'text-red-500', bg: 'bg-red-50' },
          { label: 'Inventory Value', value: `₹${(invStats.value / 100000).toFixed(1)}L`, icon: TrendingDown, color: 'text-violet-600', bg: 'bg-violet-50' },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${stat.bg}`}>
              <stat.icon size={18} className={stat.color} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
              <p className="font-bold text-slate-800 text-lg font-sans">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-3 text-sm font-semibold transition-all border-b-2 -mb-px ${
              tab === t
                ? 'text-brand-teal border-brand-teal'
                : 'text-slate-500 border-transparent hover:text-slate-700'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'Inventory' && (
        <>
          {/* Filters */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex flex-wrap gap-3 items-center">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 flex-1 min-w-[180px] max-w-xs">
              <Search size={13} className="text-slate-400" />
              <input
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search product or SKU..."
                className="bg-transparent text-xs text-slate-700 placeholder-slate-400 outline-none w-full"
              />
            </div>
            <div className="flex gap-1 bg-slate-50 border border-slate-200 rounded-lg p-1">
              {FILTER_OPTIONS.map(f => (
                <button
                  key={f}
                  onClick={() => { setFilter(f); setPage(1); }}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all capitalize ${
                    filter === f ? 'bg-brand-teal text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {f === 'all' ? 'All' : f.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Inventory table */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
                    {['Product', 'SKU', 'Variant', 'Category', 'Available', 'Reserved', 'Min Stock', 'Status', 'Last Updated', ''].map(h => (
                      <th key={h} className="px-4 py-3.5 text-left font-semibold text-slate-400 uppercase tracking-wider text-[10px] whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {paginated.map(item => {
                    const status = getStockStatus(item.available, item.minimumStock);
                    return (
                      <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="px-4 py-3 font-medium text-slate-800 max-w-[160px]">
                          <span className="truncate block">{item.productName}</span>
                        </td>
                        <td className="px-4 py-3 font-mono text-slate-500 text-[10px] whitespace-nowrap">{item.sku}</td>
                        <td className="px-4 py-3 text-slate-600">{item.variant}</td>
                        <td className="px-4 py-3 text-slate-500">{item.category}</td>
                        <td className={`px-4 py-3 font-bold text-base ${
                          item.available === 0 ? 'text-red-500' :
                          item.available <= item.minimumStock ? 'text-amber-500' :
                          'text-slate-700'
                        }`}>
                          {item.available}
                        </td>
                        <td className="px-4 py-3 text-slate-400">{item.reserved}</td>
                        <td className="px-4 py-3 text-slate-400">{item.minimumStock}</td>
                        <td className="px-4 py-3">
                          <StatusBadge status={status} />
                        </td>
                        <td className="px-4 py-3 text-slate-400 whitespace-nowrap">{item.lastUpdated}</td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => setAdjustItem(item)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-powder hover:bg-brand-teal/20 text-brand-teal text-xs font-semibold rounded-lg transition-colors whitespace-nowrap"
                          >
                            Adjust Stock
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} totalItems={filtered.length} pageSize={PAGE_SIZE} />
          </div>
        </>
      )}

      {tab === 'History' && (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  {['Date', 'Product', 'SKU', 'Action', 'Old Qty', 'Change', 'New Qty', 'Reason', 'Updated By'].map(h => (
                    <th key={h} className="px-4 py-3.5 text-left font-semibold text-slate-400 uppercase tracking-wider text-[10px] whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {history.map(h => (
                  <tr key={h.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3 text-slate-400 whitespace-nowrap">{h.date}</td>
                    <td className="px-4 py-3 text-slate-800 font-medium max-w-[140px] truncate">{h.productName}</td>
                    <td className="px-4 py-3 font-mono text-slate-500 text-[10px] whitespace-nowrap">{h.sku}</td>
                    <td className="px-4 py-3 text-slate-700">{h.action}</td>
                    <td className="px-4 py-3 text-slate-500">{h.oldQty}</td>
                    <td className={`px-4 py-3 font-bold ${h.change > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                      {h.change > 0 ? `+${h.change}` : h.change}
                    </td>
                    <td className="px-4 py-3 font-bold text-slate-800">{h.newQty}</td>
                    <td className="px-4 py-3 text-slate-500">{h.reason}</td>
                    <td className="px-4 py-3 text-slate-400">{h.updatedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Stock Adjustment Modal */}
      <StockAdjustmentModal
        isOpen={!!adjustItem}
        onClose={() => setAdjustItem(null)}
        onSubmit={handleAdjust}
        item={adjustItem}
      />
    </div>
  );
}
