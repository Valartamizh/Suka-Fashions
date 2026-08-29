// ProductsPage — /admin/products
import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Plus, Search, Filter, MoreVertical, Edit, Eye, Copy, Package,
  PackagePlus, Archive, Trash2, SlidersHorizontal, X, Check
} from 'lucide-react';
import AdminPageHeader from '../../components/ui/AdminPageHeader';
import StatusBadge from '../../components/ui/StatusBadge';
import Pagination from '../../components/ui/Pagination';
import ConfirmModal from '../../components/ui/ConfirmModal';
import EmptyState from '../../components/ui/EmptyState';
import { adminProducts } from '../../data/adminProducts';
import sareeGolden from '../../../assets/saree_golden.jpg';

const PAGE_SIZE = 6;
const CATEGORIES = ['All', 'Sarees', 'Lehengas', 'Kurtis', 'Dresses', 'Co-ords', 'Dupattas'];
const STATUSES = ['All', 'active', 'draft', 'archived', 'out-of-stock'];
const SORT_OPTIONS = [
  { label: 'Newest', value: 'newest' },
  { label: 'Oldest', value: 'oldest' },
  { label: 'Price: Low → High', value: 'price-asc' },
  { label: 'Price: High → Low', value: 'price-desc' },
  { label: 'Stock: Low → High', value: 'stock-asc' },
  { label: 'Best Selling', value: 'best' },
];

function ActionsMenu({ product, onView, onEdit, onDuplicate, onUpdateStock, onToggleArchive, onDelete }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
      >
        <MoreVertical size={15} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-8 w-44 bg-white rounded-xl border border-slate-100 shadow-xl z-20 py-1 font-sans animate-in fade-in zoom-in-95">
            <button
              onClick={() => { onView(); setOpen(false); }}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <Eye size={13} className="text-slate-400" />
              View on Store
            </button>
            <button
              onClick={() => { onEdit(); setOpen(false); }}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <Edit size={13} className="text-slate-400" />
              Edit Details
            </button>
            <button
              onClick={() => { onDuplicate(); setOpen(false); }}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <Copy size={13} className="text-slate-400" />
              Duplicate Product
            </button>
            <button
              onClick={() => { onUpdateStock(); setOpen(false); }}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <PackagePlus size={13} className="text-slate-400" />
              Quick Stock Update
            </button>
            <button
              onClick={() => { onToggleArchive(); setOpen(false); }}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <Archive size={13} className="text-slate-400" />
              {product.status === 'archived' ? 'Unarchive' : 'Archive'}
            </button>
            <div className="border-t border-slate-100 my-1" />
            <button
              onClick={() => { onDelete(); setOpen(false); }}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs text-red-600 hover:bg-red-50 transition-colors"
            >
              <Trash2 size={13} className="text-red-400" />
              Delete Product
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default function ProductsPage() {
  const navigate = useNavigate();
  const [productsList, setProductsList] = useState(adminProducts);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState('All');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [deleteModal, setDeleteModal] = useState(null);
  const [stockModalProduct, setStockModalProduct] = useState(null);
  const [newStockVal, setNewStockVal] = useState('');

  const filtered = useMemo(() => {
    let list = [...productsList];
    if (search) list = list.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase()));
    if (category !== 'All') list = list.filter(p => p.category === category);
    if (status !== 'All') list = list.filter(p => p.status === status || (status === 'out-of-stock' && p.stock === 0));
    switch (sort) {
      case 'oldest': list.sort((a, b) => (a.createdAt || '').localeCompare(b.createdAt || '')); break;
      case 'price-asc': list.sort((a, b) => a.price - b.price); break;
      case 'price-desc': list.sort((a, b) => b.price - a.price); break;
      case 'stock-asc': list.sort((a, b) => a.stock - b.stock); break;
      case 'best': list.sort((a, b) => (b.unitsSold || 0) - (a.unitsSold || 0)); break;
      default: list.sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || ''));
    }
    return list;
  }, [productsList, search, category, status, sort]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleDeleteConfirm = () => {
    if (deleteModal) {
      setProductsList(list => list.filter(p => p.id !== deleteModal.id));
      setDeleteModal(null);
    }
  };

  return (
    <div className="space-y-5">
      <AdminPageHeader
        title="Products"
        subtitle="Manage your complete Suka Fashions catalogue."
      >
        <Link
          to="/admin/products/add"
          className="flex items-center gap-2 bg-brand-teal hover:bg-brand-tealDark text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors shadow-sm cursor-pointer"
        >
          <Plus size={14} />
          Add Product
        </Link>
      </AdminPageHeader>

      {/* Filters bar */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
        <div className="flex flex-wrap gap-3 items-center">
          {/* Search */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 flex-1 min-w-[180px] max-w-xs">
            <Search size={13} className="text-slate-400 flex-shrink-0" />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search products by name or SKU..."
              className="bg-transparent text-xs text-slate-700 placeholder-slate-400 outline-none w-full"
            />
          </div>

          {/* Category filter */}
          <select
            value={category}
            onChange={e => { setCategory(e.target.value); setPage(1); }}
            className="border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 bg-white focus:outline-none focus:border-brand-teal cursor-pointer"
          >
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>

          {/* Status filter */}
          <select
            value={status}
            onChange={e => { setStatus(e.target.value); setPage(1); }}
            className="border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 bg-white focus:outline-none focus:border-brand-teal cursor-pointer"
          >
            {STATUSES.map(s => <option key={s} value={s}>{s === 'All' ? 'All Statuses' : s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>

          {/* Sort */}
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 bg-white focus:outline-none focus:border-brand-teal ml-auto cursor-pointer"
          >
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        {/* Active filters summary */}
        {(search || category !== 'All' || status !== 'All') && (
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Filters:</span>
            {search && (
              <span className="bg-brand-powder text-brand-teal text-xs px-2.5 py-0.5 rounded-full font-medium">
                "{search}"
              </span>
            )}
            {category !== 'All' && (
              <span className="bg-brand-powder text-brand-teal text-xs px-2.5 py-0.5 rounded-full font-medium">{category}</span>
            )}
            {status !== 'All' && (
              <span className="bg-brand-powder text-brand-teal text-xs px-2.5 py-0.5 rounded-full font-medium capitalize">{status}</span>
            )}
            <button
              onClick={() => { setSearch(''); setCategory('All'); setStatus('All'); setPage(1); }}
              className="text-xs text-red-500 hover:underline font-semibold cursor-pointer"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Products table */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                {['Product', 'SKU', 'Category', 'Price', 'Stock', 'Status', 'Featured', 'Updated', 'Actions'].map(h => (
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
                    <EmptyState
                      icon={Package}
                      title="No products found"
                      description="Try adjusting your search or filters."
                    />
                  </td>
                </tr>
              ) : paginated.map(product => (
                <tr key={product.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={product.image || sareeGolden}
                        alt={product.name}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = sareeGolden;
                        }}
                        className="w-14 h-16 sm:w-16 sm:h-20 object-cover rounded-lg border border-slate-200 shadow-sm flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <p
                          onClick={() => navigate(`/admin/products/edit/${product.id}`)}
                          className="font-semibold text-sm text-slate-900 leading-snug hover:text-brand-teal cursor-pointer transition-colors"
                        >
                          {product.name}
                        </p>
                        <p className="text-xs text-slate-400 mt-1 font-medium">{product.category} · {product.subcategory}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 font-mono text-slate-600 text-xs font-semibold whitespace-nowrap">{product.sku}</td>
                  <td className="px-5 py-4 text-slate-700 text-xs font-medium whitespace-nowrap">{product.category}</td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <span className="font-bold text-sm text-slate-900">₹{product.price.toLocaleString('en-IN')}</span>
                    {product.mrp > product.price && (
                      <span className="text-xs text-slate-400 line-through ml-1.5">₹{product.mrp.toLocaleString('en-IN')}</span>
                    )}
                  </td>
                  <td className={`px-5 py-4 font-bold text-xs ${product.stock === 0 ? 'text-red-500' : product.stock <= 5 ? 'text-amber-500' : 'text-slate-800'}`}>
                    {product.stock}
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={product.stock === 0 ? 'out-of-stock' : product.status} />
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-semibold ${product.featured ? 'text-brand-teal font-bold' : 'text-slate-300'}`}>
                      {product.featured ? '★ Yes' : '—'}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-slate-400 text-xs whitespace-nowrap">{product.updatedAt || '2026-08-25'}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => navigate(`/admin/products/edit/${product.id}`)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-brand-powder text-slate-500 hover:text-brand-teal transition-colors cursor-pointer"
                        title="Edit Product"
                      >
                        <Edit size={15} />
                      </button>
                      <ActionsMenu
                        product={product}
                        onView={() => navigate(`/product/${product.slug || product.id}`)}
                        onEdit={() => navigate(`/admin/products/edit/${product.id}`)}
                        onDuplicate={() => navigate(`/admin/products/add?duplicate=${product.id}`)}
                        onUpdateStock={() => {
                          setStockModalProduct(product);
                          setNewStockVal(product.stock.toString());
                        }}
                        onToggleArchive={() => {
                          setProductsList(list => list.map(p => p.id === product.id ? { ...p, status: p.status === 'archived' ? 'active' : 'archived' } : p));
                        }}
                        onDelete={() => setDeleteModal(product)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {paginated.length > 0 && (
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            totalItems={filtered.length}
            pageSize={PAGE_SIZE}
          />
        )}
      </div>

      {/* Quick Stock Update Modal */}
      {stockModalProduct && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-sans font-bold text-slate-800 text-sm">Quick Stock Update</h3>
              <button onClick={() => setStockModalProduct(null)} className="text-slate-400 hover:text-slate-600">
                <X size={16} />
              </button>
            </div>

            <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <img src={stockModalProduct.image || sareeGolden} className="w-12 h-14 object-cover rounded-lg border border-slate-200" />
              <div>
                <p className="font-bold text-xs text-slate-800 leading-tight">{stockModalProduct.name}</p>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">SKU: {stockModalProduct.sku}</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Available Stock Quantity</label>
              <input
                type="number"
                min="0"
                value={newStockVal}
                onChange={e => setNewStockVal(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-bold text-slate-800 focus:outline-none focus:border-brand-teal"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setStockModalProduct(null)}
                className="flex-1 py-2.5 border border-slate-200 text-slate-600 text-xs font-semibold rounded-xl hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const qty = parseInt(newStockVal) || 0;
                  setProductsList(list => list.map(p => p.id === stockModalProduct.id ? { ...p, stock: qty, status: qty === 0 ? 'out-of-stock' : 'active' } : p));
                  setStockModalProduct(null);
                }}
                className="flex-1 py-2.5 bg-brand-teal text-white text-xs font-bold rounded-xl hover:bg-brand-tealDark shadow-sm cursor-pointer"
              >
                Save Stock
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm modal */}
      <ConfirmModal
        isOpen={!!deleteModal}
        onClose={() => setDeleteModal(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Product"
        message={`Are you sure you want to delete "${deleteModal?.name}"? This action cannot be undone.`}
        confirmLabel="Delete Product"
        variant="danger"
      />
    </div>
  );
}
