// ProductStoreView — In-place Store-Style Product Detail View for Admin
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Edit, ExternalLink, PackagePlus, Copy, Trash2, Archive,
  Star, Heart, ShoppingBag, MessageSquare, Truck, RefreshCw, ShieldCheck,
  Check, CheckCircle2, Tag, Layers, Info, Sparkles, ZoomIn, X,
  ChevronLeft, ChevronRight, ChevronDown, IndianRupee, Eye, TrendingUp,
  BarChart3, Share2, Boxes, Image as ImageIcon, AlertCircle, Award,
  SlidersHorizontal, Sliders
} from 'lucide-react';
import StatusBadge from '../../components/ui/StatusBadge';
import sareeGolden from '../../../assets/saree_golden.jpg';
import { useSettings } from '../../../context/SettingsContext';
import { getWhatsAppUrl } from '../../../utils/whatsapp';
import { useAdminAuth } from '../../context/AdminAuthContext';

export default function ProductStoreView({
  product,
  onBack,
  onEdit,
  onQuickStock,
  onDuplicate,
  onToggleArchive,
  onDelete,
  onUpdateProduct
}) {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const { hasPermission } = useAdminAuth();
  const canEdit = hasPermission('products.edit');
  const canDelete = hasPermission('products.delete');
  const canCreate = hasPermission('products.create');
  const canUpdateStock = hasPermission('inventory.update');
  const storeWhatsAppPhone = settings?.store?.whatsappNumber || settings?.store?.supportPhone || '+91 9488463850';
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [activeTab, setActiveTab] = useState('details'); // 'details' | 'specs' | 'inventory'
  const [zoomModal, setZoomModal] = useState(false);
  const [simulatedCartAdded, setSimulatedCartAdded] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Editable Trust Badges / Perks
  const DEFAULT_PERKS = [
    { id: 'shipping', text: 'Free Shipping within India', icon: 'Truck' },
    { id: 'returns', text: '7 Days Easy Returns', icon: 'RefreshCw' },
    { id: 'authenticity', text: '100% Authentic Handcrafted', icon: 'ShieldCheck' },
    { id: 'cod', text: 'COD Option Enabled', icon: 'CheckCircle2' },
  ];

  const [perks, setPerks] = useState(product?.trustBadges || DEFAULT_PERKS);
  const [isEditingPerks, setIsEditingPerks] = useState(false);
  const [draftPerks, setDraftPerks] = useState(perks);
  const [savedPerksToast, setSavedPerksToast] = useState(false);

  // Editable Storefront Accordions & Perks
  const [openStoreAccordion, setOpenStoreAccordion] = useState('details');
  const [isEditingAccordions, setIsEditingAccordions] = useState(false);
  const [draftAccordions, setDraftAccordions] = useState({
    shippingInfo: product?.shippingInfo || 'Free Shipping within India on orders above ₹1999',
    returnInfo: product?.returnInfo || '7 Days easy returns and exchanges',
    description: product?.description || '',
    materialCare: product?.materialCare || (product?.attributes?.fabric ? `Fabric: ${product.attributes.fabric}. ${product?.attributes?.careInstructions || 'Dry clean only. Do not bleach. Iron on low heat.'}` : 'Fabric: Premium Blend. Dry clean only. Do not bleach. Iron on low heat.'),
    shippingReturns: product?.shippingReturns || 'Dispatched within 24-48 hours. Delivered in 3-5 business days. 7-day hassle-free return policy.',
  });
  const [savedAccordionsToast, setSavedAccordionsToast] = useState(false);

  useEffect(() => {
    if (product) {
      setDraftAccordions({
        shippingInfo: product.shippingInfo || 'Free Shipping within India on orders above ₹1999',
        returnInfo: product.returnInfo || '7 Days easy returns and exchanges',
        description: product.description || '',
        materialCare: product.materialCare || (product.attributes?.fabric ? `Fabric: ${product.attributes.fabric}. ${product.attributes?.careInstructions || 'Dry clean only. Do not bleach. Iron on low heat.'}` : 'Fabric: Premium Blend. Dry clean only. Do not bleach. Iron on low heat.'),
        shippingReturns: product.shippingReturns || 'Dispatched within 24-48 hours. Delivered in 3-5 business days. 7-day hassle-free return policy.',
      });
    }
  }, [product]);

  const handleSaveAccordions = () => {
    setIsEditingAccordions(false);
    setSavedAccordionsToast(true);
    setTimeout(() => setSavedAccordionsToast(false), 2500);
    onUpdateProduct?.({
      ...product,
      ...draftAccordions,
    });
  };

  useEffect(() => {
    if (product?.trustBadges) {
      setPerks(product.trustBadges);
      setDraftPerks(product.trustBadges);
    }
  }, [product]);

  const handleSavePerks = () => {
    setPerks(draftPerks);
    setIsEditingPerks(false);
    setSavedPerksToast(true);
    setTimeout(() => setSavedPerksToast(false), 2500);
    onUpdateProduct?.({ ...product, trustBadges: draftPerks });
  };

  const handleCancelPerks = () => {
    setDraftPerks(perks);
    setIsEditingPerks(false);
  };

  const handleResetPerks = () => {
    setDraftPerks(DEFAULT_PERKS);
  };

  const getPerkIcon = (iconName) => {
    switch (iconName) {
      case 'Truck': return Truck;
      case 'RefreshCw': return RefreshCw;
      case 'ShieldCheck': return ShieldCheck;
      case 'CheckCircle2': return CheckCircle2;
      default: return ShieldCheck;
    }
  };

  // Normalized colors and per-color galleries
  const colorsList = (product?.colors && product.colors.length > 0)
    ? product.colors
    : [{ id: '1', name: 'Standard', hex: '#006B70', images: [{ id: '1', url: product?.image || sareeGolden, isPrimary: true }], variants: [{ size: 'Free Size', sellingPrice: product?.price, mrp: product?.mrp, stock: product?.stock }] }];

  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const activeColor = colorsList[selectedColorIdx] || colorsList[0] || {};
  const imagesList = (activeColor?.images && activeColor.images.length > 0)
    ? activeColor.images.map(img => typeof img === 'string' ? img : img.url)
    : [product?.image || sareeGolden];

  const currentImage = imagesList[activeImageIdx] || imagesList[0] || sareeGolden;

  // Selected variant & sizes
  const availableSizes = activeColor?.variants || (product?.sizes || ['Free Size']).map(s => ({ size: s, stock: product?.stock, sellingPrice: product?.price, mrp: product?.mrp }));

  useEffect(() => {
    setActiveImageIdx(0);
    if (availableSizes.length > 0) {
      setSelectedSize(availableSizes[0].size || availableSizes[0]);
    }
  }, [selectedColorIdx, product]);

  if (!product) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
        <p className="text-slate-500 font-medium">No product selected to view.</p>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-brand-teal text-white rounded-xl text-xs font-semibold hover:bg-brand-tealDark transition-colors"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  const activeVariant = availableSizes.find(s => (typeof s === 'string' ? s : s.size) === selectedSize) || availableSizes[0] || {};
  const activePrice = Number(activeVariant.sellingPrice) || Number(product?.price) || 0;
  const activeMrp = Number(activeVariant.mrp) || Number(product?.mrp) || 0;
  const discountPercent = activeMrp > activePrice
    ? Math.round(((activeMrp - activePrice) / activeMrp) * 100)
    : (product?.discount || 0);

  const profitMargin = product.costPrice ? (activePrice - product.costPrice) : Math.round(activePrice * 0.45);
  const marginPercent = product.costPrice ? Math.round((profitMargin / activePrice) * 100) : 45;

  const activeBadge = (() => {
    if (product.badge === 'none') return null;
    if (product.badge === 'new' || (!product.badge && product.isNew)) return { label: 'NEW ARRIVAL', color: 'bg-emerald-600' };
    if (product.badge === 'bestSeller' || (!product.badge && product.isBestSeller)) return { label: 'BEST SELLER', color: 'bg-amber-500' };
    if (product.badge === 'featured' || (!product.badge && (product.featured || product.isFeatured))) return { label: 'FEATURED', color: 'bg-brand-navy' };
    if (product.badge === 'trending' || (!product.badge && product.isTrending)) return { label: 'TRENDING', color: 'bg-purple-600' };
    return null;
  })();

  const handleCopyPublicLink = () => {
    const url = `${window.location.origin}/product/${product.slug || product.id}`;
    navigator.clipboard?.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSimulateCart = () => {
    setSimulatedCartAdded(true);
    setTimeout(() => setSimulatedCartAdded(false), 2200);
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      
      {/* ── TOP HEADER / ADMIN CONTROL BAR ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
        
        {/* Left: Back button & Breadcrumbs */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onBack}
            className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 transition-all flex-shrink-0 cursor-pointer shadow-xs group"
            title="Back to All Products"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs font-bold text-brand-teal bg-brand-powder px-2.5 py-0.5 rounded-md">
                #{product.id}
              </span>
              <StatusBadge status={product.stock === 0 ? 'out-of-stock' : product.status} />
              {product.sku && (
                <span className="text-[11px] font-mono text-slate-400">
                  SKU: {product.sku}
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1 font-medium truncate">
              <button onClick={onBack} className="hover:text-brand-teal hover:underline cursor-pointer">Products</button>
              <span>/</span>
              <span className="text-slate-600">{product.category}</span>
              {product.subcategory && (
                <>
                  <span>/</span>
                  <span className="text-slate-600">{product.subcategory}</span>
                </>
              )}
              <span>/</span>
              <span className="text-slate-900 font-semibold truncate max-w-[200px] sm:max-w-xs">{product.name}</span>
            </div>
          </div>
        </div>

        {/* Right: Quick Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap ml-auto">
          {canEdit && (
            <button
              onClick={() => onEdit(product.id)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-brand-teal hover:bg-brand-tealDark text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
            >
              <Edit size={14} />
              <span>Edit Product</span>
            </button>
          )}

          {canUpdateStock && (
            <button
              onClick={() => onQuickStock(product)}
              className="flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              title="Adjust inventory stock quantity"
            >
              <PackagePlus size={14} className="text-brand-teal" />
              <span className="hidden sm:inline">Quick Stock</span>
            </button>
          )}

          <button
            onClick={() => window.open(`/product/${product.slug || product.id}`, '_blank')}
            className="flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            title="Open in public live store"
          >
            <ExternalLink size={14} className="text-slate-500" />
            <span className="hidden md:inline">View Store</span>
          </button>

          <button
            onClick={handleCopyPublicLink}
            className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 transition-colors cursor-pointer relative"
            title="Copy store link"
          >
            {copiedLink ? <Check size={16} className="text-emerald-600" /> : <Share2 size={15} />}
            {copiedLink && (
              <span className="absolute -bottom-7 right-0 bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-md whitespace-nowrap z-20">
                Link Copied!
              </span>
            )}
          </button>

          {canCreate && onDuplicate && (
            <button
              onClick={() => onDuplicate(product.id)}
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 transition-colors cursor-pointer"
              title="Duplicate product"
            >
              <Copy size={15} />
            </button>
          )}

          {canDelete && onDelete && (
            <button
              onClick={() => onDelete(product)}
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-red-100 hover:bg-red-50 text-red-500 transition-colors cursor-pointer"
              title="Delete product"
            >
              <Trash2 size={15} />
            </button>
          )}
        </div>

      </div>

      {/* ── ADMIN PERFORMANCE & KPI METRICS STRIP ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        
        {/* Card 1: Selling Price & MRP */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-brand-powder/60 text-brand-teal flex items-center justify-center flex-shrink-0">
            <Tag size={18} />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Selling Price</p>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-lg font-extrabold text-slate-900">₹{product.price?.toLocaleString('en-IN')}</span>
              {product.mrp > product.price && (
                <span className="text-xs text-slate-400 line-through">₹{product.mrp?.toLocaleString('en-IN')}</span>
              )}
            </div>
            {discountPercent > 0 && (
              <span className="text-[10px] font-bold text-emerald-600">
                {discountPercent}% Discount applied
              </span>
            )}
          </div>
        </div>

        {/* Card 2: Stock & Inventory Health */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
            product.stock === 0 ? 'bg-red-50 text-red-500' : product.stock <= 5 ? 'bg-amber-50 text-amber-500' : 'bg-emerald-50 text-emerald-600'
          }`}>
            <Boxes size={18} />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Live Inventory</p>
            <p className={`text-lg font-extrabold mt-0.5 ${
              product.stock === 0 ? 'text-red-500' : product.stock <= 5 ? 'text-amber-500' : 'text-slate-900'
            }`}>
              {product.stock} units
            </p>
            <p className="text-[10px] text-slate-400">
              Min Threshold: {product.minStock || 5} units
            </p>
          </div>
        </div>

        {/* Card 3: Estimated Margin */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <TrendingUp size={18} />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Profit Margin</p>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-lg font-extrabold text-emerald-600">{marginPercent}%</span>
              <span className="text-xs font-semibold text-slate-600">(+₹{profitMargin?.toLocaleString('en-IN')})</span>
            </div>
            <p className="text-[10px] text-slate-400">
              Cost: ₹{product.costPrice ? product.costPrice.toLocaleString('en-IN') : 'N/A'}
            </p>
          </div>
        </div>

        {/* Card 4: Lifetime Performance */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
            <BarChart3 size={18} />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Sales & Rating</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-lg font-extrabold text-slate-900">{product.unitsSold || 0} sold</span>
              {Number(product.reviewsCount) > 0 ? (
                <span className="text-xs font-bold text-amber-500 flex items-center gap-0.5">
                  ★ {Number(product.rating || 5).toFixed(1)}
                </span>
              ) : (
                <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                  New Product
                </span>
              )}
            </div>
            <p className="text-[10px] text-slate-400">
              {Number(product.reviewsCount) > 0 ? `${product.reviewsCount} customer reviews` : 'No reviews yet'}
            </p>
          </div>
        </div>

      </div>

      {/* ── PRODUCT SHOWCASE & DETAILS CONTAINER ── */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6 sm:p-8 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 xl:gap-10 items-start">

            {/* ── LEFT COLUMN: COMPACT PRODUCT MEDIA GALLERY (4-5 Cols) ── */}
            <div className="lg:col-span-5 xl:col-span-4 space-y-3.5 max-w-[340px] mx-auto lg:mx-0 w-full">
              
              {/* Main Image Showcase Card */}
              <div className="relative aspect-[3/4] max-h-[350px] bg-brand-cream/30 rounded-2xl overflow-hidden border border-slate-200 shadow-sm group mx-auto">
                <img
                  src={currentImage}
                  alt={product.name}
                  className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = sareeGolden;
                  }}
                />

                {/* Merchandising Badges */}
                <div className="absolute top-3 left-3 z-10 flex flex-col gap-1 items-start">
                  {activeBadge && (
                    <span className={`${activeBadge.color} text-white text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded shadow-xs`}>
                      {activeBadge.label}
                    </span>
                  )}
                  {discountPercent > 0 && (
                    <span className="bg-red-600 text-white text-[9px] font-extrabold px-2 py-0.5 rounded shadow-xs">
                      {discountPercent}% OFF
                    </span>
                  )}
                </div>

                {/* Zoom & Lightbox Button */}
                <button
                  onClick={() => setZoomModal(true)}
                  className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-brand-navy hover:bg-brand-teal hover:text-white px-2.5 py-1 rounded-lg shadow-sm transition-all flex items-center gap-1 text-[11px] font-semibold cursor-pointer z-10"
                >
                  <ZoomIn size={12} />
                  <span>Enlarge</span>
                </button>

                {/* Arrow navigation if multiple images */}
                {imagesList.length > 1 && (
                  <>
                    <button
                      onClick={() => setActiveImageIdx(prev => (prev === 0 ? imagesList.length - 1 : prev - 1))}
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/85 hover:bg-white text-slate-800 shadow-sm flex items-center justify-center transition-all opacity-80 hover:opacity-100 z-10 cursor-pointer"
                      title="Previous Image"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      onClick={() => setActiveImageIdx(prev => (prev + 1) % imagesList.length)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/85 hover:bg-white text-slate-800 shadow-sm flex items-center justify-center transition-all opacity-80 hover:opacity-100 z-10 cursor-pointer"
                      title="Next Image"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </>
                )}

                {/* Bottom Image Counter */}
                <div className="absolute bottom-2.5 right-2.5 bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold px-2 py-0.5 rounded">
                  {activeImageIdx + 1} / {imagesList.length}
                </div>
              </div>

              {/* Gallery Thumbnails Tray */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
                    <ImageIcon size={13} className="text-brand-teal" /> Product Images ({imagesList.length})
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">Click thumbnail to switch</span>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {imagesList.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIdx(idx)}
                      className={`relative w-14 h-18 sm:w-16 sm:h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 cursor-pointer ${
                        activeImageIdx === idx
                          ? 'border-brand-teal ring-2 ring-brand-powder shadow-xs scale-102'
                          : 'border-slate-200 hover:border-slate-400 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      {idx === 0 && (
                        <span className="absolute bottom-1 left-1 bg-brand-navy/90 text-white text-[7px] font-extrabold uppercase px-1 py-0.2 rounded">
                          Main
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* ── RIGHT COLUMN: STOREFRONT DETAILS, PRICING, VARIANTS & SPECS (7-8 Cols) ── */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-5 text-left">
              
              {/* Category & Brand Eyebrow */}
              <div>
                <span className="font-sans text-[11px] font-bold text-brand-teal tracking-[0.2em] uppercase block mb-1">
                  SUKA COUTURE • {product.category?.toUpperCase()} {product.subcategory ? `• ${product.subcategory.toUpperCase()}` : ''}
                </span>

                {/* Product Title */}
                <h1 className="font-serif text-2xl sm:text-3xl lg:text-[2.2rem] font-medium text-slate-900 leading-tight">
                  {product.name}
                </h1>

                {/* Tagline / Subtitle */}
                {product.tagline && (
                  <p className="font-serif text-sm italic text-slate-500 mt-1.5">
                    "{product.tagline}"
                  </p>
                )}
              </div>

              {/* Price Row with Large Figures */}
              <div className="flex items-baseline gap-3.5 pb-4 border-b border-slate-100">
                <span className="font-sans text-3xl sm:text-4xl font-extrabold text-slate-900">
                  ₹{activePrice?.toLocaleString('en-IN')}
                </span>
                {activeMrp > activePrice && (
                  <span className="font-sans text-lg sm:text-xl text-slate-400 line-through">
                    ₹{activeMrp?.toLocaleString('en-IN')}
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="font-sans text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                    {discountPercent}% OFF
                  </span>
                )}
              </div>

              {/* Ratings and Review Bar */}
              <div className="flex items-center gap-3">
                {Number(product.reviewsCount) > 0 ? (
                  <>
                    <div className="flex items-center text-amber-400">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={16}
                          className={s <= Math.floor(product.rating || 5) ? 'fill-amber-400' : 'text-slate-200'}
                          strokeWidth={1}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-slate-700">
                      {Number(product.rating || 5).toFixed(1)}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-xs text-slate-500">
                      {product.reviewsCount} customer {product.reviewsCount === 1 ? 'review' : 'reviews'}
                    </span>
                  </>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="flex items-center text-slate-300">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} size={15} className="text-slate-300" strokeWidth={1.5} />
                      ))}
                    </div>
                    <span className="text-xs font-medium text-slate-400">No reviews yet</span>
                  </div>
                )}
              </div>

              {/* Color Selection & Swatches */}
              {colorsList.length > 0 && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      COLOR: <span className="text-brand-teal font-extrabold capitalize">{activeColor?.name || 'Standard'}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    {colorsList.map((c, idx) => (
                      <button
                        key={c.id || idx}
                        onClick={() => setSelectedColorIdx(idx)}
                        className={`group relative flex items-center gap-2.5 px-3 py-2 rounded-xl border transition-all cursor-pointer ${
                          selectedColorIdx === idx
                            ? 'border-brand-teal bg-brand-powder/30 shadow-xs ring-1 ring-brand-teal'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <span
                          className="w-4 h-4 rounded-full border border-slate-300 shadow-xs flex-shrink-0"
                          style={{ backgroundColor: c.hex || '#006B70' }}
                        />
                        <span className="text-xs font-bold text-slate-800">{c.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size & Stock Selection */}
              <div className="space-y-2.5">
                {(() => {
                  const sizeObj = availableSizes.find(s => (typeof s === 'string' ? s : s.size) === selectedSize) || availableSizes[0] || {};
                  const activeSizeStock = typeof sizeObj === 'object' && sizeObj.stock !== undefined ? Number(sizeObj.stock) : Number(product.stock || 0);
                  return (
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                        SIZE: <span className="text-brand-teal font-extrabold">{selectedSize || 'Free Size'}</span>
                      </span>
                      <span className="text-[11px] font-medium">
                        {activeSizeStock > 0 ? (
                          <span className="text-emerald-600 font-bold">✓ Ready for dispatch ({activeSizeStock} units left)</span>
                        ) : (
                          <span className="text-red-500 font-bold">Out of stock for this size</span>
                        )}
                      </span>
                    </div>
                  );
                })()}

                <div className="flex items-center gap-2.5 flex-wrap">
                  {availableSizes.map((sizeItem) => {
                    const sizeName = typeof sizeItem === 'string' ? sizeItem : sizeItem.size;
                    const sStock = typeof sizeItem === 'object' && sizeItem.stock !== undefined ? Number(sizeItem.stock) : Number(product.stock || 0);
                    return (
                      <button
                        key={sizeName}
                        onClick={() => setSelectedSize(sizeName)}
                        className={`min-w-[70px] px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                          selectedSize === sizeName
                            ? 'bg-brand-navy text-white border-brand-navy shadow-sm'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-brand-teal'
                        } ${sStock === 0 ? 'opacity-60 bg-slate-50' : ''}`}
                      >
                        <span>{sizeName}</span>
                        {sStock === 0 && (
                          <span className="text-[9px] px-1 py-0.2 rounded bg-red-100 text-red-600 font-bold">0</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Live Customer Action Simulation (Add to Bag & WhatsApp Buy) */}
              <div className="space-y-2.5 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={handleSimulateCart}
                    className={`py-3.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer ${
                      simulatedCartAdded
                        ? 'bg-emerald-600 text-white'
                        : 'bg-brand-teal hover:bg-brand-tealDark text-white'
                    }`}
                  >
                    {simulatedCartAdded ? <Check size={16} /> : <ShoppingBag size={16} />}
                    <span>{simulatedCartAdded ? 'Simulated: Added to Cart!' : 'Live Button: Add to Bag'}</span>
                  </button>

                  <button
                    onClick={() => window.open(getWhatsAppUrl(storeWhatsAppPhone, `Hi, I am interested in ${product.name}`), '_blank')}
                    className="py-3.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
                  >
                    <MessageSquare size={16} />
                    <span>Buy on WhatsApp</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 text-center">
                  Live storefront interactive simulation for admin verification
                </p>
              </div>

            </div>

          </div>

          {/* ── LOWER SECTION: SPECIFICATIONS, STORY, INVENTORY & STOREFRONT POLICY TABS ── */}
          <div className="mt-12 pt-8 border-t border-slate-200">
            
            {/* Tab Navigation */}
            <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
              {[
                { id: 'details', label: 'Product Description & Story', icon: Info },
                { id: 'specs', label: 'Attributes & Specifications', icon: Tag },
                { id: 'inventory', label: 'SKU & Variant Stock', icon: Layers },
                { id: 'storefront', label: 'Storefront Policy & Accordions', icon: SlidersHorizontal },
              ].map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                      activeTab === tab.id
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <IconComponent size={14} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab Content 1: Description & Story */}
            {activeTab === 'details' && (
              <div className="pt-6 space-y-4 text-left animate-in fade-in duration-150">
                <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-700 leading-relaxed">
                  <p className="font-serif text-base sm:text-lg text-slate-900 font-medium">
                    {product.description || 'Elevate your festive look with this handcrafted creation from Suka Fashions.'}
                  </p>
                  {product.shortDescription && (
                    <p className="text-slate-600">{product.shortDescription}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Occasion</span>
                    <p className="font-bold text-slate-800 text-sm mt-1">{product.attributes?.occasion || 'Festive / Wedding'}</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Fabric Type</span>
                    <p className="font-bold text-slate-800 text-sm mt-1">{product.attributes?.fabric || 'Pure Organza'}</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Craft & Embroidery</span>
                    <p className="font-bold text-slate-800 text-sm mt-1">{product.attributes?.work || 'Hand Embroidered'}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab Content 2: Attributes & Specifications */}
            {activeTab === 'specs' && (
              <div className="pt-6 text-left animate-in fade-in duration-150">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Fabric</span>
                    <span className="text-xs font-bold text-slate-800 mt-0.5 block">{product.attributes?.fabric || 'Organza'}</span>
                  </div>
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Occasion</span>
                    <span className="text-xs font-bold text-slate-800 mt-0.5 block">{product.attributes?.occasion || 'Festive'}</span>
                  </div>
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Work / Craft</span>
                    <span className="text-xs font-bold text-slate-800 mt-0.5 block">{product.attributes?.work || 'Embroidered'}</span>
                  </div>
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Pattern</span>
                    <span className="text-xs font-bold text-slate-800 mt-0.5 block">{product.attributes?.pattern || 'Floral'}</span>
                  </div>
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Fit Type</span>
                    <span className="text-xs font-bold text-slate-800 mt-0.5 block">{product.attributes?.fit || 'Regular'}</span>
                  </div>
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Sleeve Length</span>
                    <span className="text-xs font-bold text-slate-800 mt-0.5 block">{product.attributes?.sleeve || 'N/A'}</span>
                  </div>
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Care Instructions</span>
                    <span className="text-xs font-bold text-slate-800 mt-0.5 block">{product.attributes?.careInstructions || 'Dry clean only'}</span>
                  </div>
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Country of Origin</span>
                    <span className="text-xs font-bold text-slate-800 mt-0.5 block">{product.attributes?.countryOfOrigin || 'India'}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Tab Content 3: SKU & Variant Stock */}
            {activeTab === 'inventory' && (
              <div className="pt-6 text-left animate-in fade-in duration-150 space-y-4">
                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold text-slate-500">Color Variant</th>
                        <th className="px-4 py-3 text-left font-semibold text-slate-500">Size</th>
                        <th className="px-4 py-3 text-left font-semibold text-slate-500">Variant SKU</th>
                        <th className="px-4 py-3 text-left font-semibold text-slate-500">Stock Qty</th>
                        <th className="px-4 py-3 text-left font-semibold text-slate-500">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {colorsList.map((c, vi) => (
                        (c.variants || [{ size: 'Free Size', stock: product.stock, sku: product.sku }]).map((s, si) => {
                          const itemStock = s.stock !== undefined ? s.stock : (product.stock || 0);
                          return (
                            <tr key={`${vi}-${si}`} className="hover:bg-slate-50">
                              <td className="px-4 py-3 font-semibold text-slate-800 flex items-center gap-2">
                                <span className="w-3.5 h-3.5 rounded-full border border-slate-300" style={{ backgroundColor: c.hex || '#006B70' }} />
                                {c.name}
                              </td>
                              <td className="px-4 py-3 font-bold text-slate-700">{s.size}</td>
                              <td className="px-4 py-3 font-mono text-slate-500">{s.sku || product.sku || `${product.id}-${c.name}-${s.size}`}</td>
                              <td className="px-4 py-3 font-extrabold text-slate-900">{itemStock} units</td>
                              <td className="px-4 py-3">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  itemStock > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'
                                }}`}>
                                  {itemStock > 0 ? 'In Stock' : 'Out of Stock'}
                                </span>
                              </td>
                            </tr>
                          );
                        })
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => onQuickStock(product)}
                    className="flex items-center gap-2 px-4 py-2 bg-brand-teal text-white rounded-xl text-xs font-bold hover:bg-brand-tealDark transition-colors cursor-pointer"
                  >
                    <PackagePlus size={14} /> Adjust Stock Quantities
                  </button>
                </div>
              </div>
            )}

            {/* Tab Content 4: Storefront Assurances, Policies & Accordions */}
            {activeTab === 'storefront' && (
              <div className="pt-6 text-left animate-in fade-in duration-150 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left: Storefront Trust Badges & Highlights */}
                  <div className="p-5 bg-slate-50/80 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                      <div className="flex items-center gap-2">
                        <Award size={16} className="text-brand-teal" />
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                            Storefront Assurances & Highlights
                          </h4>
                          <p className="text-[11px] text-slate-400">Assurance perks displayed across live PDP pages.</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      {perks.map((p) => {
                        const Icon = getPerkIcon(p.icon);
                        return (
                          <div key={p.id} className="flex items-center gap-2.5 p-3 bg-white rounded-xl border border-slate-200 text-xs font-medium text-slate-800">
                            <Icon size={16} className="text-brand-teal flex-shrink-0" />
                            <span className="truncate">{p.text}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right: STOREFRONT ACCORDIONS (Live PDP Accordion Simulation) */}
                  <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2">
                        <SlidersHorizontal size={16} className="text-brand-teal" />
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                            Storefront Policy & Information Accordions
                          </h4>
                          <p className="text-[11px] text-slate-400">Collapsible detail accordions for customer product page.</p>
                        </div>
                      </div>
                    </div>

                    {/* Interactive Accordion View */}
                    <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 overflow-hidden">
                      {/* Accordion 1: Product Description */}
                      <div className="p-3.5">
                        <button
                          type="button"
                          onClick={() => setOpenStoreAccordion(openStoreAccordion === 'details' ? null : 'details')}
                          className="w-full flex items-center justify-between text-left group cursor-pointer"
                        >
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-800 group-hover:text-brand-teal transition-colors">
                            Product Description
                          </span>
                          <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${openStoreAccordion === 'details' ? 'rotate-180 text-brand-teal' : ''}`} />
                        </button>
                        {openStoreAccordion === 'details' && (
                          <p className="text-xs text-slate-600 pt-2 leading-relaxed whitespace-pre-line">
                            {product.description || 'Elevate your celebratory ensemble with this handcrafted creation.'}
                          </p>
                        )}
                      </div>

                      {/* Accordion 2: Material & Care */}
                      <div className="p-3.5">
                        <button
                          type="button"
                          onClick={() => setOpenStoreAccordion(openStoreAccordion === 'fabric' ? null : 'fabric')}
                          className="w-full flex items-center justify-between text-left group cursor-pointer"
                        >
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-800 group-hover:text-brand-teal transition-colors">
                            Material & Care
                          </span>
                          <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${openStoreAccordion === 'fabric' ? 'rotate-180 text-brand-teal' : ''}`} />
                        </button>
                        {openStoreAccordion === 'fabric' && (
                          <p className="text-xs text-slate-600 pt-2 leading-relaxed whitespace-pre-line">
                            {product.materialCare || (product.attributes?.fabric ? `Fabric: ${product.attributes.fabric}. ${product.attributes?.careInstructions || 'Dry clean only. Do not bleach. Iron on low heat.'}` : 'Fabric: Premium Blend. Dry clean only. Do not bleach. Iron on low heat.')}
                          </p>
                        )}
                      </div>

                      {/* Accordion 3: Shipping & Returns */}
                      <div className="p-3.5">
                        <button
                          type="button"
                          onClick={() => setOpenStoreAccordion(openStoreAccordion === 'shipping' ? null : 'shipping')}
                          className="w-full flex items-center justify-between text-left group cursor-pointer"
                        >
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-800 group-hover:text-brand-teal transition-colors">
                            Shipping & Returns
                          </span>
                          <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${openStoreAccordion === 'shipping' ? 'rotate-180 text-brand-teal' : ''}`} />
                        </button>
                        {openStoreAccordion === 'shipping' && (
                          <p className="text-xs text-slate-600 pt-2 leading-relaxed whitespace-pre-line">
                            {product.shippingReturns || 'Dispatched within 24-48 hours. Delivered in 3-5 business days. 7-day hassle-free return policy.'}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

      {/* ── FULL ENLARGED IMAGE LIGHTBOX MODAL ── */}
      {zoomModal && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setZoomModal(false)}
        >
          <div className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setZoomModal(false)}
              className="absolute -top-12 right-0 text-white hover:text-brand-powder transition-colors cursor-pointer"
            >
              <X size={28} />
            </button>
            <img
              src={currentImage}
              alt={product.name}
              className="max-h-[85vh] w-auto object-contain rounded-2xl shadow-2xl border border-white/20"
            />
          </div>
        </div>
      )}

    </div>
  );
}
