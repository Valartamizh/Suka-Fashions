// ProductsPage — /admin/products
import React, { useState, useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  Plus, Search, Filter, MoreVertical, Edit, Eye, Copy, Package,
  PackagePlus, Archive, Trash2, SlidersHorizontal, X, Check,
  Sparkles, CheckCircle2, Tag, ShoppingBag, ExternalLink, IndianRupee,
  Layers, ShieldCheck, Truck, RotateCcw, TrendingUp, BarChart2, Star,
  Info, ArrowRight, Image as ImageIcon, ChevronLeft, ChevronRight
} from 'lucide-react';
import StatusBadge from '../../components/ui/StatusBadge';
import Pagination from '../../components/ui/Pagination';
import ConfirmModal from '../../components/ui/ConfirmModal';
import EmptyState from '../../components/ui/EmptyState';
import { useProducts } from '../../../context/ProductContext';
import sareeGolden from '../../../assets/saree_golden.jpg';
import ProductStoreView from './ProductStoreView';
import QuickStockModal from '../../components/ui/QuickStockModal';

const PAGE_SIZE = 8;
const CATEGORIES = ['All', 'Sarees', 'Lehengas', 'Kurtis', 'Dresses', 'Co-ords', 'Dupattas'];
const STATUSES = ['All', 'ACTIVE', 'INACTIVE', 'DRAFT', 'ARCHIVED', 'OUT_OF_STOCK'];

export default function ProductsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { products, editProduct, setProductStatus, deleteProduct } = useProducts();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState('All');
  const [page, setPage] = useState(1);
  const [deleteModal, setDeleteModal] = useState(null);
  const [stockModalProduct, setStockModalProduct] = useState(null);
  const [statusToggleProduct, setStatusToggleProduct] = useState(null);

  // Active product to view in-place (either via URL param :id or local selected state)
  const activeViewingProduct = useMemo(() => {
    if (selectedProduct) {
      return (products || []).find(p => p.id === selectedProduct.id) || selectedProduct;
    }
    if (id) {
      return (products || []).find(p => p.id === id || p.slug === id) || null;
    }
    return null;
  }, [selectedProduct, id, products]);

  const filtered = useMemo(() => {
    let list = [...(products || [])];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(p => p.name?.toLowerCase().includes(q) || (p.id && p.id.toLowerCase().includes(q)) || (p.sku && p.sku.toLowerCase().includes(q)));
    }
    if (category !== 'All') list = list.filter(p => p.category?.toLowerCase() === category.toLowerCase());
    if (status !== 'All') {
      const sUpper = status.toUpperCase();
      if (sUpper === 'OUT_OF_STOCK') {
        list = list.filter(p => p.stock === 0);
      } else {
        list = list.filter(p => p.status?.toUpperCase() === sUpper);
      }
    }
    list.sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || ''));
    return list;
  }, [products, search, category, status]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1;
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleDeleteConfirm = async () => {
    if (deleteModal) {
      await deleteProduct(deleteModal.id);
      if (selectedProduct?.id === deleteModal.id || id === deleteModal.id) {
        setSelectedProduct(null);
        if (id) navigate('/admin/products');
      }
      setDeleteModal(null);
    }
  };

  const handleSaveStock = async (updatedProduct) => {
    await editProduct(updatedProduct.id, updatedProduct);
    if (selectedProduct?.id === updatedProduct.id) {
      setSelectedProduct(updatedProduct);
    }
  };

  // If a product is selected for viewing, render the full-fidelity Store View directly in the main container (in-place)
  if (activeViewingProduct) {
    return (
      <div className="space-y-4">
        <ProductStoreView
          product={activeViewingProduct}
          onBack={() => {
            setSelectedProduct(null);
            if (id) navigate('/admin/products');
          }}
          onEdit={(prodId) => navigate(`/admin/products/edit/${prodId}`)}
          onQuickStock={(prod) => setStockModalProduct(prod)}
          onDuplicate={(prodId) => navigate(`/admin/products/add?duplicate=${prodId}`)}
          onDelete={(prod) => setDeleteModal(prod)}
          onUpdateProduct={async (updated) => {
            await editProduct(updated.id, updated);
            setSelectedProduct(updated);
          }}
        />

        {/* Quick Stock Update Modal by Size */}
        <QuickStockModal
          isOpen={!!stockModalProduct}
          onClose={() => setStockModalProduct(null)}
          product={stockModalProduct}
          onSave={handleSaveStock}
        />

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

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      
      {/* Top Filter & Action Bar */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[220px] max-w-sm">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search products..."
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-300 shadow-2xs"
          />
        </div>

        {/* Category Dropdown */}
        <select
          value={category}
          onChange={e => { setCategory(e.target.value); setPage(1); }}
          className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-medium text-slate-700 focus:outline-none cursor-pointer shadow-2xs"
        >
          <option value="All">All Categories ({products.length})</option>
          {CATEGORIES.filter(c => c !== 'All').map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        {/* Status Dropdown */}
        <select
          value={status}
          onChange={e => { setStatus(e.target.value); setPage(1); }}
          className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-medium text-slate-700 focus:outline-none cursor-pointer shadow-2xs"
        >
          <option value="All">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
          <option value="DRAFT">Draft</option>
          <option value="ARCHIVED">Archived</option>
          <option value="OUT_OF_STOCK">Out of Stock</option>
        </select>

        {/* Add Product Button */}
        <Link
          to="/admin/products/add"
          className="ml-auto flex items-center gap-1.5 bg-[#0b1b4f] hover:bg-[#07133a] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors shadow-xs cursor-pointer whitespace-nowrap"
        >
          <Plus size={15} strokeWidth={2.5} />
          <span>Add Product</span>
        </Link>
      </div>

      {/* Main Products Table Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="py-4 px-5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">IMAGE</th>
                <th className="py-4 px-5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">PRODUCT ID</th>
                <th className="py-4 px-5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">PRODUCT NAME</th>
                <th className="py-4 px-5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">CATEGORY</th>
                <th className="py-4 px-5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">PRICE</th>
                <th className="py-4 px-5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">DISCOUNT PRICE</th>
                <th className="py-4 px-5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">STOCK</th>
                <th className="py-4 px-5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12">
                    <EmptyState
                      icon={Package}
                      title="No products found"
                      description="Try adjusting your search or category filters."
                    />
                  </td>
                </tr>
              ) : paginated.map(product => {
                const originalPrice = product.mrp || product.price || 0;
                const sellingPrice = product.price || 0;
                const isActive = !product.status || product.status?.toUpperCase() === 'ACTIVE';

                return (
                  <tr
                    key={product.id}
                    onClick={() => setSelectedProduct(product)}
                    className="hover:bg-slate-50/80 transition-colors group cursor-pointer select-none"
                    title="Click to view full product details"
                  >
                    {/* 1. IMAGE */}
                    <td className="py-3.5 px-5">
                      <img
                        src={product.image || sareeGolden}
                        alt={product.name}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = sareeGolden;
                        }}
                        className="w-12 h-12 rounded-xl object-cover bg-slate-100 border border-slate-200/80 shadow-2xs flex-shrink-0"
                      />
                    </td>

                    {/* 2. PRODUCT ID */}
                    <td className="py-3.5 px-5 font-semibold text-xs text-slate-800 tracking-wide uppercase whitespace-nowrap">
                      {product.id.startsWith('#') ? product.id.slice(1) : product.id}
                    </td>

                    {/* 3. PRODUCT NAME */}
                    <td className="py-3.5 px-5 font-bold text-sm text-slate-900 whitespace-nowrap">
                      {product.name}
                    </td>

                    {/* 4. CATEGORY */}
                    <td className="py-3.5 px-5 text-xs text-slate-700 font-medium whitespace-nowrap">
                      {product.category}
                    </td>

                    {/* 5. PRICE */}
                    <td className="py-3.5 px-5 font-bold text-xs sm:text-sm text-slate-900 whitespace-nowrap">
                      ₹{Number(originalPrice).toLocaleString('en-IN')}
                    </td>

                    {/* 6. DISCOUNT PRICE */}
                    <td className="py-3.5 px-5 font-bold text-xs sm:text-sm text-[#16a34a] whitespace-nowrap">
                      ₹{Number(sellingPrice).toLocaleString('en-IN')}
                    </td>

                    {/* 7. STOCK */}
                    <td className="py-3.5 px-5 text-xs sm:text-sm font-medium text-slate-700 whitespace-nowrap">
                      {product.stock}
                    </td>

                    {/* 8. STATUS */}
                    <td className="py-3.5 px-5 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setStatusToggleProduct(product);
                        }}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-all hover:scale-105 active:scale-95 ${
                          isActive
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-200/60'
                            : 'bg-slate-100 text-slate-500 border border-slate-200'
                        }`}
                        title="Click to toggle product status"
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isActive ? 'bg-emerald-500' : 'bg-slate-400'
                          }`}
                        />
                        <span>{isActive ? 'Active' : 'Inactive'}</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination & Count at Bottom */}
        <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-t border-slate-100 bg-white">
          <div className="text-xs text-slate-500 font-medium">
            Showing <span className="font-bold text-slate-900">({paginated.length})</span> of <span className="font-bold text-slate-900">({filtered.length})</span> products
          </div>

          {totalPages > 1 && (
            <div className="flex items-center gap-1.5 ml-auto">
              <button
                onClick={() => setPage(p => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => {
                const p = i + 1;
                const isCurr = p === page;
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      isCurr
                        ? 'bg-[#0b1b4f] text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
              <button
                onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Quick Stock Update Modal by Size */}
      <QuickStockModal
        isOpen={!!stockModalProduct}
        onClose={() => setStockModalProduct(null)}
        product={stockModalProduct}
        onSave={handleSaveStock}
      />

      {/* Status Toggle Confirmation Modal */}
      <ConfirmModal
        isOpen={!!statusToggleProduct}
        onClose={() => setStatusToggleProduct(null)}
        onConfirm={async () => {
          if (!statusToggleProduct) return;
          const currentIsActive = statusToggleProduct.status?.toUpperCase() === 'ACTIVE';
          const nextStatus = currentIsActive ? 'INACTIVE' : 'ACTIVE';
          await setProductStatus(statusToggleProduct.id, nextStatus);
          if (selectedProduct?.id === statusToggleProduct.id) {
            setSelectedProduct(prev => prev ? { ...prev, status: nextStatus } : null);
          }
          setStatusToggleProduct(null);
        }}
        title={statusToggleProduct?.status?.toUpperCase() === 'ACTIVE' ? 'Deactivate Product?' : 'Activate Product?'}
        message={
          statusToggleProduct?.status?.toUpperCase() === 'ACTIVE'
            ? `Are you sure you want to mark "${statusToggleProduct?.name}" as Inactive? It will no longer be visible to shoppers on the live storefront.`
            : `Are you sure you want to mark "${statusToggleProduct?.name}" as Active? It will become visible and available for purchase on the live store.`
        }
        confirmLabel={statusToggleProduct?.status?.toUpperCase() === 'ACTIVE' ? 'Mark Inactive' : 'Mark Active'}
        variant={statusToggleProduct?.status?.toUpperCase() === 'ACTIVE' ? 'warning' : 'brand'}
      />

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

