// InventoryPage — /admin/inventory
import React, { useState, useMemo } from 'react';
import { Search, Package, AlertTriangle, CheckCircle, XCircle, TrendingDown, ChevronDown, Layers } from 'lucide-react';
import AdminPageHeader from '../components/ui/AdminPageHeader';
import StatusBadge from '../components/ui/StatusBadge';
import StockAdjustmentModal from '../components/ui/StockAdjustmentModal';
import QuickStockModal from '../components/ui/QuickStockModal';
import Pagination from '../components/ui/Pagination';
import { useProducts } from '../../context/ProductContext';
import { inventoryHistory, getStockStatus } from '../data/adminInventory';

const PAGE_SIZE = 8;
const TABS = ['Inventory', 'History'];
const FILTER_OPTIONS = ['all', 'in-stock', 'low-stock', 'out-of-stock'];

export default function InventoryPage() {
  const { products, updateStock, editProduct } = useProducts();
  const [tab, setTab] = useState('Inventory');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [adjustItem, setAdjustItem] = useState(null);
  const [manageProduct, setManageProduct] = useState(null);
  const [history, setHistory] = useState(inventoryHistory);

  // Flattened inventory items by Product + Color Variant + Size
  const inventory = useMemo(() => {
    const rows = [];
    (products || []).forEach(p => {
      if (p.colors && p.colors.length > 0) {
        p.colors.forEach(c => {
          (c.variants || []).forEach(v => {
            rows.push({
              id: `${p.id}-${c.id || c.name}-${v.size}`,
              productId: p.id,
              productName: p.name,
              category: p.category,
              colorId: c.id,
              colorName: c.name,
              colorHex: c.hex,
              image: c.images?.find(i => i.isPrimary)?.url || c.images?.[0]?.url || p.image,
              size: v.size,
              variant: `${c.name} / ${v.size}`,
              sku: v.sku || `${p.sku || p.id}-${c.name}-${v.size}`,
              available: Number(v.stock) || 0,
              reserved: 0,
              minimumStock: 3,
              lastUpdated: p.updatedAt || '2026-08-26',
            });
          });
        });
      } else {
        rows.push({
          id: `${p.id}-default`,
          productId: p.id,
          productName: p.name,
          category: p.category,
          colorId: 'default',
          colorName: 'Standard',
          colorHex: '#006B70',
          image: p.image,
          size: 'Free Size',
          variant: 'Standard / Free Size',
          sku: p.sku || p.id,
          available: Number(p.stock) || 0,
          reserved: 0,
          minimumStock: 3,
          lastUpdated: p.updatedAt || '2026-08-26',
        });
      }
    });
    return rows;
  }, [products]);

  const invStats = useMemo(() => {
    const total = inventory.reduce((s, i) => s + i.available, 0);
    const inStock = inventory.filter(i => getStockStatus(i.available, i.minimumStock) === 'in-stock').length;
    const lowStock = inventory.filter(i => getStockStatus(i.available, i.minimumStock) === 'low-stock').length;
    const outOfStock = inventory.filter(i => getStockStatus(i.available, i.minimumStock) === 'out-of-stock').length;
    const value = inventory.reduce((s, i) => s + i.available * 1800, 0);
    return { total, inStock, lowStock, outOfStock, value };
  }, [inventory]);

  const filtered = useMemo(() => {
    let list = [...inventory];
    if (search) list = list.filter(i =>
      i.productName.toLowerCase().includes(search.toLowerCase()) ||
      i.sku.toLowerCase().includes(search.toLowerCase()) ||
      i.colorName?.toLowerCase().includes(search.toLowerCase())
    );
    if (filter !== 'all') list = list.filter(i => getStockStatus(i.available, i.minimumStock) === filter);
    return list;
  }, [inventory, search, filter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1;
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleAdjust = async ({ type, quantity, reason, notes, item }) => {
    let newQty = item.available;
    if (type === 'add') newQty = item.available + quantity;
    else if (type === 'remove') newQty = Math.max(0, item.available - quantity);
    else if (type === 'set') newQty = quantity;

    const change = newQty - item.available;
    await updateStock(item.productId, item.colorId, item.size, newQty);

    setHistory(h => [{
      id: `HIST${h.length + 1}`,
      date: new Date().toISOString().split('T')[0],
      productName: `${item.productName} (${item.variant})`,
      sku: item.sku,
      action: type === 'add' ? 'Stock Added' : type === 'remove' ? 'Stock Removed' : 'Stock Set',
      oldQty: item.available,
      change,
      newQty,
      reason: reason || 'Inventory Calibration',
      updatedBy: 'Admin',
    }, ...h]);
    setAdjustItem(null);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      
      {/* ── Compact Header with Inline Stat Badges ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-1">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-powder border border-brand-teal/20 text-brand-teal flex items-center justify-center shadow-2xs">
            <Layers size={20} />
          </div>
          <div>
            <h1 className="font-sans text-xl font-bold text-slate-900">Inventory Management</h1>
            <p className="text-xs text-slate-500 font-medium">
              Live stock tracking and instant stock management across all product variants and SKUs.
            </p>
          </div>
        </div>

        {/* Compact Right Stat Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 flex items-center gap-2 shadow-2xs">
            <span className="text-[11px] text-slate-500 font-semibold">Total SKUs</span>
            <span className="font-bold text-xs text-slate-900">{inventory.length}</span>
          </div>
          <div className="bg-emerald-50/80 border border-emerald-200/60 rounded-xl px-3 py-1.5 flex items-center gap-2 shadow-2xs">
            <span className="text-[11px] text-emerald-800 font-semibold">In Stock</span>
            <span className="font-bold text-xs text-emerald-700">{invStats.inStock}</span>
          </div>
          <div className="bg-amber-50/80 border border-amber-200/60 rounded-xl px-3 py-1.5 flex items-center gap-2 shadow-2xs">
            <span className="text-[11px] text-amber-800 font-semibold">Low Stock</span>
            <span className="font-bold text-xs text-amber-700">{invStats.lowStock}</span>
          </div>
          <div className="bg-red-50/80 border border-red-200/60 rounded-xl px-3 py-1.5 flex items-center gap-2 shadow-2xs">
            <span className="text-[11px] text-red-800 font-semibold">Out of Stock</span>
            <span className="font-bold text-xs text-red-600">{invStats.outOfStock}</span>
          </div>
        </div>
      </div>

      {/* ── Search, Status Filters & Tabs Bar ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-3.5 flex flex-wrap items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search product name, variant or SKU..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-slate-300"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap ml-auto">
          {/* Status Filter Pills */}
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl p-1">
            {FILTER_OPTIONS.map(f => (
              <button
                key={f}
                onClick={() => { setFilter(f); setPage(1); }}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all capitalize cursor-pointer ${
                  filter === f ? 'bg-brand-teal text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {f === 'all' ? 'All' : f.replace('-', ' ')}
              </button>
            ))}
          </div>

          {/* View Tab Toggle */}
          <div className="flex items-center gap-1 bg-slate-100 border border-slate-200 rounded-xl p-1">
            {TABS.map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  tab === t ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {tab === 'Inventory' && (
        <>
          {/* Inventory table */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
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
                        <td className="px-4 py-3 font-medium text-slate-800">
                          <div className="flex items-center gap-2.5">
                            {item.image && (
                              <img src={item.image} alt={item.productName} className="w-8 h-10 object-cover rounded border border-slate-200 shadow-2xs flex-shrink-0" />
                            )}
                            <div className="min-w-0">
                              <span className="truncate block font-bold text-slate-800 text-xs">{item.productName}</span>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="w-2.5 h-2.5 rounded-full border border-slate-300 shadow-2xs" style={{ backgroundColor: item.colorHex || '#006B70' }} />
                                <span className="text-[10px] text-slate-500 font-semibold">{item.colorName}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 font-mono text-slate-500 text-[10px] whitespace-nowrap">{item.sku}</td>
                        <td className="px-4 py-3 text-slate-800 font-bold">{item.size}</td>
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
                            onClick={() => {
                              const matchedProd = products.find(p => p.id === item.productId);
                              if (matchedProd) setManageProduct(matchedProd);
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100/80 text-blue-600 text-xs font-bold rounded-lg transition-colors whitespace-nowrap cursor-pointer shadow-2xs"
                            title="Manage all sizes and bulk stock for this product"
                          >
                            <Layers size={13} />
                            <span>Manage</span>
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

      {/* Stock Adjustment Modal (Individual) */}
      <StockAdjustmentModal
        isOpen={!!adjustItem}
        onClose={() => setAdjustItem(null)}
        onSubmit={handleAdjust}
        item={adjustItem}
      />

      {/* Manage Product Stock Modal (Bulk & Variants Matrix) */}
      <QuickStockModal
        isOpen={!!manageProduct}
        onClose={() => setManageProduct(null)}
        product={manageProduct}
        onSave={async (updatedProduct) => {
          await editProduct(updatedProduct.id, updatedProduct);
          setManageProduct(null);
        }}
      />
    </div>
  );
}
