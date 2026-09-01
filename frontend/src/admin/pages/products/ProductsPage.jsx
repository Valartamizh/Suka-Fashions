// ProductsPage — /admin/products
import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Plus, Search, Filter, MoreVertical, Edit, Eye, Copy, Package,
  PackagePlus, Archive, Trash2, SlidersHorizontal, X, Check,
  Sparkles, CheckCircle2, Tag, ShoppingBag, ExternalLink, IndianRupee,
  Layers, ShieldCheck, Truck, RotateCcw, TrendingUp, BarChart2, Star,
  Info, ArrowRight, Image as ImageIcon
} from 'lucide-react';
import StatusBadge from '../../components/ui/StatusBadge';
import Pagination from '../../components/ui/Pagination';
import ConfirmModal from '../../components/ui/ConfirmModal';
import EmptyState from '../../components/ui/EmptyState';
import { adminProducts } from '../../data/adminProducts';
import sareeGolden from '../../../assets/saree_golden.jpg';

const PAGE_SIZE = 6;
const CATEGORIES = ['All', 'Sarees', 'Lehengas', 'Kurtis', 'Dresses', 'Co-ords', 'Dupattas'];
const STATUSES = ['All', 'active', 'draft', 'archived', 'out-of-stock'];

function ProductDetailModal({ product, onClose, onEdit, onView, onQuickStock }) {
  const [previewTab, setPreviewTab] = useState('card'); // 'card' | 'page'
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!product) return null;

  const imagesList = (product.images && product.images.length > 0)
    ? product.images
    : [product.image || sareeGolden];

  const currentPreviewImage = imagesList[activeImageIdx] || imagesList[0] || sareeGolden;

  const discountPercent = product.discount || (product.mrp && product.price
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : 0);

  const activeBadge = (() => {
    if (product.badge === 'none') return null;
    if (product.badge === 'new' || (!product.badge && product.isNew)) return { label: 'NEW', color: 'bg-brand-teal' };
    if (product.badge === 'bestSeller' || (!product.badge && product.isBestSeller)) return { label: 'BESTSELLER', color: 'bg-amber-500' };
    if (product.badge === 'featured' || (!product.badge && (product.featured || product.isFeatured))) return { label: 'FEATURED', color: 'bg-brand-navy' };
    if (product.badge === 'trending' || (!product.badge && product.isTrending)) return { label: 'TRENDING', color: 'bg-purple-600' };
    return null;
  })();

  const profitMargin = product.costPrice ? (product.price - product.costPrice) : null;
  const marginPercent = product.costPrice ? Math.round((profitMargin / product.price) * 100) : null;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-slate-50 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-2xl max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="bg-white px-5 sm:px-6 py-4 border-b border-slate-200 flex items-center justify-between gap-4 flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <span className="font-mono text-xs font-bold text-brand-teal bg-brand-powder px-2.5 py-1 rounded-lg flex-shrink-0">
              #{product.id}
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-slate-900 text-base sm:text-lg truncate leading-tight">
                  {product.name}
                </h2>
                <StatusBadge status={product.stock === 0 ? 'out-of-stock' : product.status} />
              </div>
              <p className="text-xs text-slate-500 truncate mt-0.5">
                {product.category} {product.subcategory ? `· ${product.subcategory}` : ''} {product.brand ? `· by ${product.brand}` : ''}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => { onClose(); onEdit(product.id); }}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-brand-teal hover:bg-brand-tealDark text-white text-xs font-semibold rounded-xl transition-all shadow-xs cursor-pointer"
            >
              <Edit size={14} />
              <span className="hidden sm:inline">Edit Product</span>
            </button>
            <button
              onClick={() => { onClose(); onView(product.slug || product.id); }}
              className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              title="View on live store"
            >
              <ExternalLink size={14} />
              <span className="hidden sm:inline">View Store</span>
            </button>
            <button
              onClick={onClose}
              className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Close modal (Esc)"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content: 2-Column Layout */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* Left 7 Columns: Complete Product Information */}
            <div className="lg:col-span-7 space-y-5">

              {/* 1. Quick KPI Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white p-3.5 rounded-xl border border-slate-100 shadow-xs">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Selling Price</p>
                  <p className="text-base font-extrabold text-slate-900 mt-1">₹{product.price?.toLocaleString('en-IN')}</p>
                  {product.mrp > product.price && (
                    <p className="text-[11px] text-slate-400 line-through">₹{product.mrp?.toLocaleString('en-IN')}</p>
                  )}
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-slate-100 shadow-xs">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Stock Qty</p>
                  <p className={`text-base font-extrabold mt-1 ${product.stock === 0 ? 'text-red-500' : product.stock <= 5 ? 'text-amber-500' : 'text-slate-900'}`}>
                    {product.stock} units
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Min: {product.minStock || 5}</p>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-slate-100 shadow-xs">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Units Sold</p>
                  <p className="text-base font-extrabold text-brand-teal mt-1">
                    {product.unitsSold || 0}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Lifetime</p>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-slate-100 shadow-xs">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Profit Margin</p>
                  <p className="text-base font-extrabold text-emerald-600 mt-1">
                    {marginPercent ? `${marginPercent}%` : 'N/A'}
                  </p>
                  {profitMargin && (
                    <p className="text-[10px] text-emerald-600 font-medium">+₹{profitMargin.toLocaleString('en-IN')}</p>
                  )}
                </div>
              </div>

              {/* 2. Gallery & Media View */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <ImageIcon size={14} className="text-brand-teal" /> Media Gallery ({imagesList.length})
                  </h3>
                  <span className="text-[10px] text-slate-400">Click any image to preview in card</span>
                </div>
                <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
                  {imagesList.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIdx(idx)}
                      className={`relative w-16 h-20 sm:w-20 sm:h-24 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 cursor-pointer ${
                        activeImageIdx === idx ? 'border-brand-teal ring-2 ring-brand-powder shadow-sm' : 'border-slate-200 hover:border-slate-300 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      {idx === 0 && (
                        <span className="absolute bottom-1 left-1 bg-brand-navy/90 text-white text-[8px] font-bold px-1 rounded">
                          Main
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Variants, Colors & Sizes */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-xs space-y-3">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers size={14} className="text-brand-teal" /> Color & Size Variants
                </h3>
                {product.variants && product.variants.length > 0 ? (
                  <div className="space-y-2">
                    {product.variants.map((v, i) => (
                      <div key={i} className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                        <div className="flex items-center gap-2.5">
                          <span
                            className="w-4 h-4 rounded-full border border-slate-300 shadow-xs flex-shrink-0"
                            style={{ backgroundColor: v.colorHex }}
                          />
                          <span className="font-bold text-slate-800">{v.color}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          {v.sizes && v.sizes.map((s, si) => (
                            <span key={si} className="bg-white border border-slate-200 px-2.5 py-1 rounded-lg text-slate-700 font-medium text-[11px]">
                              {s.size} <span className="font-bold text-brand-teal">({s.stock} in stock)</span>
                              {s.sku && <span className="text-slate-400 font-mono text-[9px] ml-1.5">· {s.sku}</span>}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">Standard single variant product.</p>
                )}
              </div>

              {/* 4. Specifications / Attributes */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-xs space-y-3">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Tag size={14} className="text-brand-teal" /> Attributes & Specifications
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                  <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-[10px] font-semibold text-slate-400 block">Fabric</span>
                    <span className="font-bold text-slate-800">{product.attributes?.fabric || 'N/A'}</span>
                  </div>
                  <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-[10px] font-semibold text-slate-400 block">Occasion</span>
                    <span className="font-bold text-slate-800">{product.attributes?.occasion || 'N/A'}</span>
                  </div>
                  <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-[10px] font-semibold text-slate-400 block">Work / Craft</span>
                    <span className="font-bold text-slate-800">{product.attributes?.work || 'N/A'}</span>
                  </div>
                  <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-[10px] font-semibold text-slate-400 block">Pattern</span>
                    <span className="font-bold text-slate-800">{product.attributes?.pattern || 'N/A'}</span>
                  </div>
                  <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-[10px] font-semibold text-slate-400 block">Fit Type</span>
                    <span className="font-bold text-slate-800">{product.attributes?.fit || 'Regular'}</span>
                  </div>
                  <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-[10px] font-semibold text-slate-400 block">Care Instructions</span>
                    <span className="font-bold text-slate-800">{product.attributes?.careInstructions || 'Dry clean only'}</span>
                  </div>
                </div>
              </div>

              {/* 5. Merchandising Flags & SEO */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-xs space-y-3">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles size={14} className="text-brand-teal" /> Merchandising & Store Settings
                </h3>
                <div className="flex flex-wrap gap-2 text-xs">
                  {product.isNew && (
                    <span className="bg-teal-50 text-teal-700 border border-teal-200 px-2.5 py-1 rounded-lg font-bold">
                      ✓ New Arrival
                    </span>
                  )}
                  {(product.featured || product.isFeatured) && (
                    <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-lg font-bold">
                      ★ Featured Item
                    </span>
                  )}
                  {product.isBestSeller && (
                    <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-lg font-bold">
                      🔥 Best Seller
                    </span>
                  )}
                  {product.isTrending && (
                    <span className="bg-purple-50 text-purple-700 border border-purple-200 px-2.5 py-1 rounded-lg font-bold">
                      📈 Trending Pick
                    </span>
                  )}
                  {product.allowCOD && (
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-lg font-medium">
                      COD Allowed
                    </span>
                  )}
                  {product.returnable && (
                    <span className="bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-1 rounded-lg font-medium">
                      Easy Returns
                    </span>
                  )}
                </div>

                {product.description && (
                  <div className="pt-2 border-t border-slate-100 text-xs text-slate-600 leading-relaxed">
                    <span className="font-bold text-slate-700 block mb-1">Description:</span>
                    {product.description}
                  </div>
                )}
              </div>

            </div>

            {/* Right 5 Columns: Sticky Live Storefront Card Preview (Exact like Edit page) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 overflow-hidden sticky top-0">

                {/* Card Preview Header */}
                <div className="flex items-center justify-between mb-3.5 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-bold text-slate-800">Live Customer Preview</span>
                  </div>
                  <div className="flex gap-1 bg-slate-100 p-0.5 rounded-lg text-[10px] font-bold">
                    <button
                      onClick={() => setPreviewTab('card')}
                      className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                        previewTab === 'card' ? 'bg-white text-brand-teal shadow-xs' : 'text-slate-500'
                      }`}
                    >
                      Card View
                    </button>
                    <button
                      onClick={() => setPreviewTab('page')}
                      className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                        previewTab === 'page' ? 'bg-white text-brand-teal shadow-xs' : 'text-slate-500'
                      }`}
                    >
                      Detail View
                    </button>
                  </div>
                </div>

                {/* CARD PREVIEW MODE (Identical to Edit Page) */}
                {previewTab === 'card' ? (
                  <div className="bg-white border border-brand-powder/60 rounded-xl overflow-hidden shadow-md max-w-xs mx-auto group">
                    {/* Product Image Box */}
                    <div className="relative aspect-[3/4] bg-slate-100 overflow-hidden">
                      <img
                        src={currentPreviewImage}
                        alt="Preview"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = sareeGolden;
                        }}
                      />

                      {/* Merchandising Ribbon */}
                      {activeBadge && (
                        <div className="absolute top-2 left-2 z-10">
                          <span className={`${activeBadge.color} text-white text-[9px] font-extrabold uppercase px-2 py-0.5 rounded shadow-xs`}>
                            {activeBadge.label}
                          </span>
                        </div>
                      )}

                      {/* Discount Badge */}
                      {discountPercent > 0 && (
                        <span className="absolute top-2 right-2 bg-red-600 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-xs">
                          {discountPercent}% OFF
                        </span>
                      )}
                    </div>

                    {/* Product Meta */}
                    <div className="p-3.5 space-y-1.5 text-left">
                      <div className="flex items-center justify-between gap-1">
                        <p className="text-[10px] font-bold text-brand-teal uppercase tracking-widest truncate">
                          {product.category} {product.subcategory ? `· ${product.subcategory}` : ''}
                        </p>
                        <span className="text-[9px] font-mono font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded flex-shrink-0">
                          #{product.id}
                        </span>
                      </div>

                      <h4 className="font-serif text-xs font-bold text-brand-navy truncate">
                        {product.name}
                      </h4>

                      {product.tagline && (
                        <p className="text-[10px] text-slate-500 italic truncate font-sans leading-tight">
                          {product.tagline}
                        </p>
                      )}

                      <div className="flex items-center gap-2 pt-1">
                        <span className="font-sans text-sm font-bold text-brand-navy">
                          ₹{product.price ? product.price.toLocaleString('en-IN') : '0'}
                        </span>
                        {product.mrp && product.mrp > product.price && (
                          <span className="font-sans text-xs text-brand-navy/40 line-through">
                            ₹{product.mrp.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>

                      {/* Available Variant Colors */}
                      {product.variants && product.variants.length > 0 && (
                        <div className="flex items-center gap-1 pt-1">
                          {product.variants.map((v, i) => (
                            <span
                              key={i}
                              className="w-3 h-3 rounded-full border border-slate-200 shadow-xs"
                              style={{ backgroundColor: v.colorHex }}
                              title={v.color}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  /* DETAIL PAGE MINI PREVIEW MODE */
                  <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 text-xs">
                    <div className="flex gap-3">
                      <div className="w-20 h-24 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={currentPreviewImage}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = sareeGolden;
                          }}
                        />
                      </div>
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9px] font-bold text-brand-teal uppercase tracking-wider">{product.category}</span>
                          <span className="text-[9px] font-mono font-bold text-slate-400 bg-slate-100 px-1 py-0.5 rounded">#{product.id}</span>
                        </div>
                        <h4 className="font-bold text-slate-800 leading-tight truncate">{product.name}</h4>
                        {product.tagline && <p className="text-[10px] text-slate-500 italic truncate">{product.tagline}</p>}
                        <div className="flex items-center gap-1.5 pt-1">
                          <span className="font-bold text-slate-900">₹{product.price?.toLocaleString('en-IN')}</span>
                          {product.mrp > product.price && (
                            <span className="text-slate-400 line-through text-[10px]">₹{product.mrp?.toLocaleString('en-IN')}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-slate-100 pt-2.5 space-y-1.5 text-[11px]">
                      <p><span className="font-bold text-slate-700">Fabric:</span> {product.attributes?.fabric || 'Not specified'}</p>
                      <p><span className="font-bold text-slate-700">Occasion:</span> {product.attributes?.occasion || 'Not specified'}</p>
                      <p><span className="font-bold text-slate-700">Work/Craft:</span> {product.attributes?.work || 'Not specified'}</p>
                    </div>
                  </div>
                )}

                {/* Quick Modal Actions */}
                <div className="mt-4 pt-3.5 border-t border-slate-100 space-y-2">
                  <button
                    onClick={() => { onClose(); onEdit(product.id); }}
                    className="w-full py-2.5 bg-brand-teal hover:bg-brand-tealDark text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Edit size={14} /> Full Edit Product Page
                  </button>
                  <button
                    onClick={() => { onClose(); onQuickStock(product); }}
                    className="w-full py-2 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <PackagePlus size={14} /> Quick Stock Update
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

function ActionsMenu({ product, onView, onEdit, onDuplicate, onUpdateStock, onToggleArchive, onDelete }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative" onClick={(e) => e.stopPropagation()}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen(o => !o);
        }}
        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500 transition-colors cursor-pointer"
      >
        <MoreVertical size={15} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={(e) => { e.stopPropagation(); setOpen(false); }} />
          <div className="absolute right-0 top-8 w-44 bg-white rounded-xl border border-slate-100 shadow-xl z-20 py-1 font-sans animate-in fade-in zoom-in-95">
            <button
              onClick={(e) => { e.stopPropagation(); onView(); setOpen(false); }}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <Eye size={13} className="text-slate-400" />
              View on Store
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(); setOpen(false); }}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <Edit size={13} className="text-slate-400" />
              Edit Details
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDuplicate(); setOpen(false); }}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <Copy size={13} className="text-slate-400" />
              Duplicate Product
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onUpdateStock(); setOpen(false); }}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <PackagePlus size={13} className="text-slate-400" />
              Quick Stock Update
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onToggleArchive(); setOpen(false); }}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <Archive size={13} className="text-slate-400" />
              {product.status === 'archived' ? 'Unarchive' : 'Archive'}
            </button>
            <div className="border-t border-slate-100 my-1" />
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(); setOpen(false); }}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
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
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState('All');
  const [page, setPage] = useState(1);
  const [deleteModal, setDeleteModal] = useState(null);
  const [stockModalProduct, setStockModalProduct] = useState(null);
  const [newStockVal, setNewStockVal] = useState('');

  const filtered = useMemo(() => {
    let list = [...productsList];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || (p.id && p.id.toLowerCase().includes(q)) || (p.sku && p.sku.toLowerCase().includes(q)));
    }
    if (category !== 'All') list = list.filter(p => p.category === category);
    if (status !== 'All') list = list.filter(p => p.status === status || (status === 'out-of-stock' && p.stock === 0));
    list.sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || ''));
    return list;
  }, [productsList, search, category, status]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleDeleteConfirm = () => {
    if (deleteModal) {
      setProductsList(list => list.filter(p => p.id !== deleteModal.id));
      if (selectedProduct?.id === deleteModal.id) {
        setSelectedProduct(null);
      }
      setDeleteModal(null);
    }
  };

  return (
    <div className="space-y-3.5">
      {/* Page Title */}
      <div>
        <h1 className="font-sans text-xl font-bold text-slate-800">Products</h1>
        <p className="text-xs text-slate-400 mt-0.5">Manage your complete Suka Fashions catalogue.</p>
      </div>

      {/* Action & Filters bar */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-3.5">
        <div className="flex flex-wrap gap-2.5 items-center">
          {/* Search */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 flex-1 min-w-[180px] max-w-xs">
            <Search size={13} className="text-slate-400 flex-shrink-0" />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search products by name or ID..."
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

          {/* Add Product Button */}
          <Link
            to="/admin/products/add"
            className="flex items-center gap-2 bg-brand-teal hover:bg-brand-tealDark text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors shadow-xs cursor-pointer ml-auto"
          >
            <Plus size={14} />
            Add Product
          </Link>
        </div>

        {/* Active filters summary */}
        {(search || category !== 'All' || status !== 'All') && (
          <div className="flex items-center gap-2 mt-2.5 pt-2 border-t border-slate-100 flex-wrap">
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
              className="text-xs text-red-500 hover:underline font-semibold cursor-pointer ml-auto"
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
                {['Product ID', 'Product', 'Category', 'Price', 'Stock', 'Status', 'Updated', 'Actions'].map(h => (
                  <th key={h} className="px-5 py-3.5 text-left font-semibold text-slate-400 uppercase tracking-wider text-[10px] whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={8}>
                    <EmptyState
                      icon={Package}
                      title="No products found"
                      description="Try adjusting your search or filters."
                    />
                  </td>
                </tr>
              ) : paginated.map(product => (
                <tr
                  key={product.id}
                  onClick={() => setSelectedProduct(product)}
                  className="hover:bg-brand-powder/25 transition-colors group cursor-pointer select-none"
                  title="Click to view full product information & customer card preview"
                >
                  <td className="px-5 py-3 font-mono text-xs whitespace-nowrap">
                    <span className="font-mono text-xs font-bold text-brand-teal bg-brand-powder/60 px-2 py-1 rounded">
                      #{product.id}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3.5">
                      <img
                        src={product.image || sareeGolden}
                        alt={product.name}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = sareeGolden;
                        }}
                        className="w-10 h-12 sm:w-11 sm:h-13 object-cover rounded-lg border border-slate-200 shadow-xs flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-semibold text-sm text-slate-900 leading-snug group-hover:text-brand-teal transition-colors truncate">
                          {product.name}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5 font-medium truncate">
                          {product.tagline ? `${product.tagline} · ` : ''}{product.category} {product.subcategory ? `· ${product.subcategory}` : ''}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-slate-700 text-xs font-medium whitespace-nowrap">{product.category}</td>
                  <td className="px-5 py-3 whitespace-nowrap">
                    <span className="font-bold text-sm text-slate-900">₹{product.price.toLocaleString('en-IN')}</span>
                    {product.mrp > product.price && (
                      <span className="text-xs text-slate-400 line-through ml-1.5">₹{product.mrp.toLocaleString('en-IN')}</span>
                    )}
                  </td>
                  <td className={`px-5 py-3 font-bold text-xs ${product.stock === 0 ? 'text-red-500' : product.stock <= 5 ? 'text-amber-500' : 'text-slate-800'}`}>
                    {product.stock}
                  </td>
                  <td className="px-5 py-3">
                    <StatusBadge status={product.stock === 0 ? 'out-of-stock' : product.status} />
                  </td>
                  <td className="px-5 py-3 text-slate-400 text-xs whitespace-nowrap">{product.updatedAt || '2026-08-25'}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/admin/products/edit/${product.id}`);
                        }}
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

      {/* Product Detail & Live Card View Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onEdit={(id) => navigate(`/admin/products/edit/${id}`)}
          onView={(slugOrId) => navigate(`/product/${slugOrId}`)}
          onQuickStock={(prod) => {
            setStockModalProduct(prod);
            setNewStockVal(prod.stock.toString());
          }}
        />
      )}

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
