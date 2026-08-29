// AddProductPage — /admin/products/add
// Interactive, User-Convenient, Smart Product Creator with Real-time Storefront Preview
import React, { useState, useMemo } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  ChevronDown, Plus, X, Upload, Save, Eye, Send, ImagePlus,
  Sparkles, Check, RefreshCw, Layers, ShieldCheck, Tag, ShoppingBag,
  Percent, Info, ArrowRight, ArrowLeft, CheckCircle2, Sliders, AlertCircle,
  HelpCircle, Palette, Box
} from 'lucide-react';
import AdminPageHeader from '../../components/ui/AdminPageHeader';

// Assets for Sample Library selector
import sareeGolden from '../../../assets/saree_golden.jpg';
import sareeBeigeMaroon from '../../../assets/saree_beige_maroon.jpg';
import sareeBeigeOrange from '../../../assets/saree_beige_orange.jpg';
import lehengaRed from '../../../assets/lehenga_red.jpg';
import lehengaPink from '../../../assets/lehenga_pink.jpg';
import anarkaliBlack from '../../../assets/anarkali_black.jpg';
import kurtiTealPrinted from '../../../assets/kurti_teal_printed.jpg';
import dressNavy from '../../../assets/dress_navy.jpg';
import coordSet from '../../../assets/coord_set.jpg';
import dupattaSilk from '../../../assets/dupatta_silk.jpg';

const SAMPLE_IMAGES = [
  { name: 'Golden Zari Saree', url: sareeGolden },
  { name: 'Beige Maroon Saree', url: sareeBeigeMaroon },
  { name: 'Orange Festive Saree', url: sareeBeigeOrange },
  { name: 'Red Bridal Lehenga', url: lehengaRed },
  { name: 'Pink Party Lehenga', url: lehengaPink },
  { name: 'Black Anarkali Suit', url: anarkaliBlack },
  { name: 'Teal Printed Kurti', url: kurtiTealPrinted },
  { name: 'Navy Blue Dress', url: dressNavy },
  { name: 'Co-ord Set', url: coordSet },
  { name: 'Silk Dupatta', url: dupattaSilk },
];

const CATEGORIES = ['Sarees', 'Lehengas', 'Kurtis', 'Dresses', 'Co-ords', 'Dupattas', 'Festive Wear'];
const SUBCATEGORIES = {
  Sarees: ['Organza', 'Silk', 'Cotton', 'Georgette', 'Wedding', 'Festive'],
  Lehengas: ['Bridal', 'Party', 'Festive', 'Designer'],
  Kurtis: ['Anarkali', 'Straight', 'A-Line', 'Kurta Set', 'Palazzo'],
  Dresses: ['Midi', 'Maxi', 'Mini', 'Wrap', 'Bodycon'],
  'Co-ords': ['Printed', 'Solid', 'Embroidered'],
  Dupattas: ['Silk', 'Chiffon', 'Cotton', 'Banarasi'],
  'Festive Wear': ['Suits', 'Sharara', 'Gharara'],
};
const FABRICS = ['Organza', 'Silk', 'Georgette', 'Cotton', 'Chiffon', 'Velvet', 'Rayon', 'Polyester', 'Net', 'Banarasi Silk', 'Kanchipuram Silk'];
const OCCASIONS = ['Wedding', 'Party', 'Casual', 'Festive', 'Office', 'Daily Wear'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'];
const COLOR_PRESETS = [
  { name: 'Teal', hex: '#006B70' },
  { name: 'Gold', hex: '#D4AF37' },
  { name: 'Crimson', hex: '#DC143C' },
  { name: 'Navy', hex: '#1E3A5F' },
  { name: 'Blush Pink', hex: '#F8C8DC' },
  { name: 'Emerald', hex: '#10B981' },
  { name: 'Ivory', hex: '#FFFFF0' },
  { name: 'Royal Purple', hex: '#7B2FBE' },
];

const WIZARD_STEPS = [
  { id: 1, title: 'Basic Details', icon: Info, desc: 'Name, Category, Pricing' },
  { id: 2, title: 'Media & Gallery', icon: ImagePlus, desc: 'Product photos & assets' },
  { id: 3, title: 'Variants & Stock', icon: Box, desc: 'Colors, sizes & inventory' },
  { id: 4, title: 'Attributes & Badges', icon: Sliders, desc: 'Fabric, occasion & flags' },
  { id: 5, title: 'SEO & Review', icon: Sparkles, desc: 'Search tags & live preview' },
];

function FormField({ label, required, children, hint, toolTip, actionButton }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="block text-xs font-semibold text-slate-700 flex items-center gap-1">
          {label} {required && <span className="text-red-500 font-bold">*</span>}
          {toolTip && (
            <span className="text-slate-400 hover:text-slate-600 cursor-pointer" title={toolTip}>
              <HelpCircle size={12} />
            </span>
          )}
        </label>
        {actionButton}
      </div>
      {children}
      {hint && <p className="text-[10px] text-slate-400 mt-1">{hint}</p>}
    </div>
  );
}

function ToggleCard({ checked, onChange, label, description, icon: Icon }) {
  return (
    <div
      onClick={() => onChange(!checked)}
      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
        checked
          ? 'border-brand-teal/50 bg-brand-powder/20 shadow-xs'
          : 'border-slate-100 bg-white hover:border-slate-200'
      }`}
    >
      <div className="flex items-center gap-3">
        {Icon && (
          <div className={`p-2 rounded-lg ${checked ? 'bg-brand-teal text-white' : 'bg-slate-100 text-slate-500'}`}>
            <Icon size={16} />
          </div>
        )}
        <div>
          <p className={`text-xs font-bold ${checked ? 'text-brand-teal' : 'text-slate-700'}`}>{label}</p>
          {description && <p className="text-[10px] text-slate-400 leading-tight mt-0.5">{description}</p>}
        </div>
      </div>
      <div
        className={`relative w-9 h-5 rounded-full transition-colors flex-shrink-0 ${
          checked ? 'bg-brand-teal' : 'bg-slate-200'
        }`}
      >
        <div
          className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${
            checked ? 'translate-x-4.5' : 'translate-x-0.5'
          }`}
        />
      </div>
    </div>
  );
}

const inputClass = "w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/10 transition-all bg-white";
const textareaClass = `${inputClass} resize-none`;
const selectClass = `${inputClass} cursor-pointer`;

import { adminProducts } from '../../data/adminProducts';

export default function AddProductPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const duplicateId = searchParams.get('duplicate');
  const targetId = id || duplicateId;
  const isEditMode = Boolean(id);

  // Mode: 'wizard' vs 'single'
  const [viewMode, setViewMode] = useState('wizard');
  const [currentStep, setCurrentStep] = useState(1);
  const [showSamplePicker, setShowSamplePicker] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [previewTab, setPreviewTab] = useState('card'); // 'card' | 'page'

  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    shortDescription: '',
    category: 'Sarees',
    subcategory: 'Organza',
    brand: 'Suka Fashions',
    sku: 'SUK-SAR-101',
    sellingPrice: '3499',
    mrp: '4999',
    costPrice: '1800',
    gst: '5',
    fabric: 'Organza',
    occasion: 'Wedding',
    work: 'Embroidered',
    pattern: 'Floral',
    fit: 'Regular',
    sleeve: '3/4 Sleeve',
    neck: 'Sweetheart',
    careInstructions: 'Dry clean only',
    countryOfOrigin: 'India',
    metaTitle: '',
    metaDescription: '',
    isNew: true,
    isBestSeller: true,
    isFeatured: false,
    isTrending: true,
    showOnHomepage: true,
    allowCOD: true,
    returnable: true,
  });

  const [variants, setVariants] = useState([
    {
      color: 'Teal',
      colorHex: '#006B70',
      sizes: [
        { size: 'S', stock: '10', sku: 'SUK-SAR-101-S' },
        { size: 'M', stock: '15', sku: 'SUK-SAR-101-M' },
        { size: 'L', stock: '12', sku: 'SUK-SAR-101-L' },
        { size: 'XL', stock: '8', sku: 'SUK-SAR-101-XL' },
      ],
    },
  ]);

  const [images, setImages] = useState([
    { name: 'Golden Zari Saree', url: sareeGolden, primary: true },
  ]);

  // Pre-populate if editing or duplicating an existing product
  React.useEffect(() => {
    if (targetId) {
      const existing = adminProducts.find(p => p.id === targetId || p.slug === targetId);
      if (existing) {
        setForm({
          name: duplicateId ? `${existing.name} (Copy)` : (existing.name || ''),
          slug: duplicateId ? `${existing.slug}-copy` : (existing.slug || ''),
          description: existing.description || '',
          shortDescription: existing.shortDescription || '',
          category: existing.category || 'Sarees',
          subcategory: existing.subcategory || '',
          brand: existing.brand || 'Suka Fashions',
          sku: duplicateId ? `${existing.sku}-COPY` : (existing.sku || ''),
          sellingPrice: existing.price ? existing.price.toString() : (existing.sellingPrice ? existing.sellingPrice.toString() : '3499'),
          mrp: existing.mrp ? existing.mrp.toString() : '4999',
          costPrice: existing.costPrice ? existing.costPrice.toString() : '1800',
          gst: existing.gst ? existing.gst.toString() : '5',
          fabric: existing.attributes?.fabric || existing.fabric || 'Organza',
          occasion: existing.attributes?.occasion || existing.occasion || 'Wedding',
          work: existing.attributes?.work || existing.work || 'Embroidered',
          pattern: existing.attributes?.pattern || existing.pattern || 'Floral',
          fit: existing.attributes?.fit || existing.fit || 'Regular',
          sleeve: existing.attributes?.sleeve || existing.sleeve || '3/4 Sleeve',
          neck: existing.attributes?.neck || existing.neck || 'Sweetheart',
          careInstructions: existing.attributes?.careInstructions || existing.careInstructions || 'Dry clean only',
          countryOfOrigin: existing.attributes?.countryOfOrigin || existing.countryOfOrigin || 'India',
          metaTitle: existing.seo?.metaTitle || '',
          metaDescription: existing.seo?.metaDescription || '',
          isNew: existing.isNew ?? true,
          isBestSeller: existing.isBestSeller ?? false,
          isFeatured: existing.featured ?? existing.isFeatured ?? false,
          isTrending: existing.isTrending ?? false,
          showOnHomepage: existing.showOnHomepage ?? true,
          allowCOD: existing.allowCOD ?? true,
          returnable: existing.returnable ?? true,
        });

        if (existing.variants && existing.variants.length > 0) {
          setVariants(existing.variants.map(v => ({
            color: v.color || 'Color',
            colorHex: v.colorHex || '#006B70',
            sizes: (v.sizes || []).map(s => ({
              size: s.size,
              stock: s.stock !== undefined ? s.stock.toString() : '10',
              sku: s.sku || '',
            })),
          })));
        }

        const imgList = [];
        if (existing.image) {
          imgList.push({ name: existing.name, url: existing.image, primary: true });
        }
        if (existing.images && existing.images.length > 0) {
          existing.images.forEach((imgUrl) => {
            if (imgUrl !== existing.image && !imgList.some(i => i.url === imgUrl)) {
              imgList.push({ name: existing.name, url: imgUrl, primary: false });
            }
          });
        }
        if (imgList.length > 0) {
          setImages(imgList);
        }
      }
    }
  }, [targetId, duplicateId]);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const autoSlug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

  const generateAutoSKU = () => {
    const prefix = form.category ? form.category.substring(0, 3).toUpperCase() : 'PRD';
    const rand = Math.floor(100 + Math.random() * 900);
    const newSku = `SUK-${prefix}-${rand}`;
    set('sku', newSku);
    // Also update variant SKUs
    setVariants(vList =>
      vList.map(v => ({
        ...v,
        sizes: v.sizes.map(s => ({ ...s, sku: `${newSku}-${s.size}` })),
      }))
    );
  };

  const discountPercent = useMemo(() => {
    const sp = parseFloat(form.sellingPrice);
    const mrp = parseFloat(form.mrp);
    if (mrp && sp && mrp > sp) {
      return Math.round(((mrp - sp) / mrp) * 100);
    }
    return 0;
  }, [form.sellingPrice, form.mrp]);

  const profitMargin = useMemo(() => {
    const sp = parseFloat(form.sellingPrice);
    const cp = parseFloat(form.costPrice);
    if (sp && cp && sp > cp) {
      const profit = sp - cp;
      const margin = Math.round((profit / sp) * 100);
      return { profit, margin };
    }
    return null;
  }, [form.sellingPrice, form.costPrice]);

  // Form completion progress percentage
  const completionProgress = useMemo(() => {
    let score = 0;
    if (form.name) score += 20;
    if (form.category) score += 15;
    if (form.sellingPrice && form.mrp) score += 20;
    if (images.length > 0) score += 20;
    if (variants.length > 0 && variants[0].sizes.some(s => s.stock)) score += 15;
    if (form.fabric || form.occasion) score += 10;
    return score;
  }, [form, images, variants]);

  const addVariant = (presetColor) => {
    const colorName = presetColor?.name || 'New Color';
    const colorHex = presetColor?.hex || '#006B70';
    setVariants(v => [
      ...v,
      {
        color: colorName,
        colorHex: colorHex,
        sizes: SIZES.slice(1, 5).map(s => ({ size: s, stock: '10', sku: `${form.sku || 'SUK-PRD'}-${s.size}` })),
      },
    ]);
  };

  const removeVariant = (i) => setVariants(v => v.filter((_, idx) => idx !== i));

  const updateVariant = (vi, key, val) => {
    setVariants(v => v.map((variant, i) => (i === vi ? { ...variant, [key]: val } : variant)));
  };

  const updateVariantSize = (vi, si, key, val) => {
    setVariants(v =>
      v.map((variant, i) =>
        i !== vi
          ? variant
          : {
              ...variant,
              sizes: variant.sizes.map((s, j) => (j !== si ? s : { ...s, [key]: val })),
            }
      )
    );
  };

  const bulkSetStock = (vi, qty) => {
    setVariants(v =>
      v.map((variant, i) =>
        i !== vi
          ? variant
          : {
              ...variant,
              sizes: variant.sizes.map(s => ({ ...s, stock: qty })),
            }
      )
    );
  };

  const handleImageDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer?.files || e.target?.files || []);
    if (files.length > 0) {
      const urls = files.map(f => ({ name: f.name, url: URL.createObjectURL(f), primary: images.length === 0 }));
      setImages(imgs => [...imgs, ...urls]);
    }
  };

  const addSampleImage = (sample) => {
    setImages(imgs => [
      ...imgs,
      { name: sample.name, url: sample.url, primary: imgs.length === 0 },
    ]);
  };

  const setPrimaryImage = (index) => {
    setImages(imgs =>
      imgs.map((img, i) => ({ ...img, primary: i === index }))
    );
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    setShowSuccessModal(true);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Admin Page Header with Wizard Toggle & Completion Progress */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-brand-powder text-brand-teal p-1.5 rounded-lg">
                <Sparkles size={18} />
              </span>
              <h1 className="font-sans text-xl font-bold text-slate-800">
                {isEditMode ? 'Edit Product' : 'Add New Product'}
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {isEditMode ? `Products / Edit Product / ${form.name || 'Details'}` : 'Products / Create & Publish Listing'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="bg-slate-100 p-1 rounded-xl flex items-center text-xs font-semibold">
              <button
                type="button"
                onClick={() => setViewMode('wizard')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  viewMode === 'wizard' ? 'bg-white text-brand-teal shadow-xs' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Layers size={13} /> Step Wizard
              </button>
              <button
                type="button"
                onClick={() => setViewMode('single')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  viewMode === 'single' ? 'bg-white text-brand-teal shadow-xs' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Sliders size={13} /> Single Page
              </button>
            </div>

            <button
              type="button"
              onClick={() => navigate('/admin/products')}
              className="px-4 py-2 border border-slate-200 text-xs font-semibold text-slate-600 rounded-xl hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-5 py-2 bg-brand-teal hover:bg-brand-tealDark text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <Send size={13} /> {isEditMode ? 'Update Product' : 'Publish Product'}
            </button>
          </div>
        </div>

        {/* Completion Progress Bar */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-4">
          <div className="flex-1">
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="font-semibold text-slate-600">Product Readiness</span>
              <span className="font-bold text-brand-teal">{completionProgress}% Complete</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand-teal to-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${completionProgress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stepper Navigation (Only in Wizard Mode) */}
      {viewMode === 'wizard' && (
        <div className="bg-white rounded-2xl border border-slate-100 p-3 shadow-xs">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {WIZARD_STEPS.map((step) => {
              const StepIcon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => setCurrentStep(step.id)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    isActive
                      ? 'border-brand-teal bg-brand-powder/20 ring-2 ring-brand-teal/10 shadow-xs'
                      : isCompleted
                      ? 'border-slate-100 bg-slate-50/70 text-slate-600'
                      : 'border-transparent hover:bg-slate-50 text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                        isActive
                          ? 'bg-brand-teal text-white'
                          : isCompleted
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {isCompleted ? <Check size={12} /> : step.id}
                    </div>
                    <span className={`text-xs font-bold truncate ${isActive ? 'text-brand-teal' : 'text-slate-700'}`}>
                      {step.title}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 truncate pl-8">{step.desc}</p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Grid: Form Sections + Sticky Live Storefront Preview */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Form Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* STEP 1 / BASIC INFO & PRICING */}
          {(viewMode === 'single' || currentStep === 1) && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-brand-powder text-brand-teal rounded-xl">
                    <Info size={18} />
                  </div>
                  <div>
                    <h2 className="font-sans font-bold text-slate-800 text-base">Basic Details & Pricing</h2>
                    <p className="text-xs text-slate-400">Core title, category, pricing and inventory code</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={generateAutoSKU}
                  className="px-3 py-1.5 border border-brand-teal/30 bg-brand-powder/20 text-brand-teal text-xs font-semibold rounded-lg hover:bg-brand-teal hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw size={12} /> Auto-Generate SKU
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <FormField label="Product Title" required toolTip="Displayed as main headline across store">
                    <input
                      className={inputClass}
                      placeholder="e.g. Teal Embroidered Organza Saree"
                      value={form.name}
                      onChange={e => {
                        set('name', e.target.value);
                        set('slug', autoSlug(e.target.value));
                      }}
                    />
                  </FormField>
                </div>

                <div className="col-span-2">
                  <FormField label="URL Slug" hint="SEO friendly permalink for product page">
                    <div className="relative">
                      <span className="absolute left-3.5 top-2.5 text-xs text-slate-400 font-mono">
                        sukafashions.com/product/
                      </span>
                      <input
                        className={`${inputClass} pl-[170px] font-mono text-xs`}
                        value={form.slug}
                        onChange={e => set('slug', e.target.value)}
                        placeholder="teal-embroidered-organza-saree"
                      />
                    </div>
                  </FormField>
                </div>

                <FormField label="Category" required>
                  <select
                    className={selectClass}
                    value={form.category}
                    onChange={e => {
                      set('category', e.target.value);
                      const subOpts = SUBCATEGORIES[e.target.value] || [];
                      set('subcategory', subOpts[0] || '');
                    }}
                  >
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </FormField>

                <FormField label="Subcategory">
                  <select
                    className={selectClass}
                    value={form.subcategory}
                    onChange={e => set('subcategory', e.target.value)}
                  >
                    {(SUBCATEGORIES[form.category] || []).map(s => <option key={s}>{s}</option>)}
                  </select>
                </FormField>

                <FormField label="Base SKU" required hint="Unique inventory code">
                  <input
                    className={`${inputClass} font-mono uppercase font-bold`}
                    placeholder="SUK-SAR-001"
                    value={form.sku}
                    onChange={e => set('sku', e.target.value)}
                  />
                </FormField>

                <FormField label="Brand">
                  <input className={inputClass} value={form.brand} onChange={e => set('brand', e.target.value)} />
                </FormField>

                <div className="col-span-2 grid grid-cols-3 gap-4 pt-2 border-t border-slate-100">
                  <FormField label="Selling Price (₹)" required>
                    <input
                      type="number"
                      className={`${inputClass} font-bold text-brand-teal`}
                      placeholder="3499"
                      value={form.sellingPrice}
                      onChange={e => set('sellingPrice', e.target.value)}
                    />
                  </FormField>

                  <FormField label="MRP (₹)" required hint="Strikethrough original price">
                    <input
                      type="number"
                      className={inputClass}
                      placeholder="4999"
                      value={form.mrp}
                      onChange={e => set('mrp', e.target.value)}
                    />
                  </FormField>

                  <FormField label="Cost Price (₹)" hint="Admin internal margin estimate">
                    <input
                      type="number"
                      className={inputClass}
                      placeholder="1800"
                      value={form.costPrice}
                      onChange={e => set('costPrice', e.target.value)}
                    />
                  </FormField>
                </div>

                {/* Smart Pricing Calculations */}
                <div className="col-span-2 bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <Percent size={14} className="text-brand-teal" />
                    <span className="text-slate-600 font-medium">Calculated Discount:</span>
                    <span className="font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                      {discountPercent}% OFF
                    </span>
                  </div>
                  {profitMargin && (
                    <div className="flex items-center gap-2 text-slate-600">
                      <span>Profit per item:</span>
                      <span className="font-bold text-slate-800">₹{profitMargin.profit.toLocaleString('en-IN')}</span>
                      <span className="text-slate-400">({profitMargin.margin}% Margin)</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <span>GST:</span>
                    <select
                      className="border border-slate-200 rounded px-1.5 py-0.5 text-xs font-semibold bg-white"
                      value={form.gst}
                      onChange={e => set('gst', e.target.value)}
                    >
                      {['0', '5', '12', '18', '28'].map(g => <option key={g} value={g}>{g}%</option>)}
                    </select>
                  </div>
                </div>

                <div className="col-span-2">
                  <FormField label="Detailed Description">
                    <textarea
                      className={textareaClass}
                      rows={4}
                      placeholder="Crafted from premium organza, this saree features delicate thread embroidery and zari borders..."
                      value={form.description}
                      onChange={e => set('description', e.target.value)}
                    />
                  </FormField>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 / MEDIA & GALLERY */}
          {(viewMode === 'single' || currentStep === 2) && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-brand-powder text-brand-teal rounded-xl">
                    <ImagePlus size={18} />
                  </div>
                  <div>
                    <h2 className="font-sans font-bold text-slate-800 text-base">Media & Photo Gallery</h2>
                    <p className="text-xs text-slate-400">Upload high quality photos or pick from sample library</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowSamplePicker(!showSamplePicker)}
                  className="px-3.5 py-1.5 bg-brand-powder text-brand-teal font-semibold text-xs rounded-xl hover:bg-brand-teal hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles size={13} /> Select From Sample Library
                </button>
              </div>

              {/* Sample Library Drawer Strip */}
              {showSamplePicker && (
                <div className="bg-slate-50 border border-brand-powder rounded-2xl p-4 animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-bold text-slate-700">Instant Demo Images (Click to Add)</p>
                    <button onClick={() => setShowSamplePicker(false)} className="text-slate-400 hover:text-slate-600">
                      <X size={14} />
                    </button>
                  </div>
                  <div className="grid grid-cols-5 sm:grid-cols-10 gap-2.5">
                    {SAMPLE_IMAGES.map((s, idx) => (
                      <div
                        key={idx}
                        onClick={() => addSampleImage(s)}
                        className="group relative aspect-square rounded-xl overflow-hidden border border-slate-200 cursor-pointer hover:border-brand-teal hover:scale-105 transition-all shadow-xs"
                      >
                        <img src={s.url} alt={s.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-brand-teal/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                          <Plus size={16} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Drag & Drop Upload Zone */}
              <div
                onDrop={handleImageDrop}
                onDragOver={e => e.preventDefault()}
                onClick={() => document.getElementById('img-upload-input').click()}
                className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center hover:border-brand-teal hover:bg-brand-powder/20 transition-all cursor-pointer group bg-slate-50/50"
              >
                <input id="img-upload-input" type="file" multiple accept="image/*" className="hidden" onChange={handleImageDrop} />
                <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 text-slate-400 group-hover:text-brand-teal group-hover:border-brand-teal/40 flex items-center justify-center mx-auto mb-3 transition-colors shadow-xs">
                  <Upload size={22} />
                </div>
                <p className="text-sm font-bold text-slate-700 group-hover:text-brand-teal transition-colors">
                  Drag & Drop images here or click to browse
                </p>
                <p className="text-xs text-slate-400 mt-1">Supports PNG, JPG, WEBP up to 5MB each. First image set as primary cover photo.</p>
              </div>

              {/* Uploaded Gallery Grid */}
              {images.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-slate-700 mb-3">Gallery ({images.length} photos added)</p>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                    {images.map((img, i) => (
                      <div
                        key={i}
                        className={`relative group aspect-[3/4] rounded-xl overflow-hidden border-2 transition-all ${
                          img.primary ? 'border-brand-teal ring-2 ring-brand-teal/20 shadow-sm' : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                        
                        {img.primary ? (
                          <span className="absolute top-1.5 left-1.5 bg-brand-teal text-white text-[9px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                            PRIMARY COVER
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setPrimaryImage(i)}
                            className="absolute top-1.5 left-1.5 bg-black/60 hover:bg-brand-teal text-white text-[9px] font-bold px-2 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-all"
                          >
                            Set Cover
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => setImages(imgs => imgs.filter((_, j) => j !== i))}
                          className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-xs cursor-pointer"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 3 / VARIANTS & INVENTORY */}
          {(viewMode === 'single' || currentStep === 3) && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-brand-powder text-brand-teal rounded-xl">
                    <Box size={18} />
                  </div>
                  <div>
                    <h2 className="font-sans font-bold text-slate-800 text-base">Color Variants & Stock Matrix</h2>
                    <p className="text-xs text-slate-400">Configure shades, sizes and inventory per variant</p>
                  </div>
                </div>
              </div>

              {/* Color Presets Picker Bar */}
              <div>
                <p className="text-xs font-semibold text-slate-600 mb-2">Quick Add Preset Color:</p>
                <div className="flex flex-wrap gap-2">
                  {COLOR_PRESETS.map((cp) => (
                    <button
                      key={cp.name}
                      type="button"
                      onClick={() => addVariant(cp)}
                      className="px-3 py-1.5 bg-slate-50 hover:bg-brand-powder/30 border border-slate-200 rounded-xl text-xs text-slate-700 font-semibold flex items-center gap-2 transition-all cursor-pointer"
                    >
                      <span className="w-3.5 h-3.5 rounded-full border border-slate-300 shadow-xs" style={{ backgroundColor: cp.hex }} />
                      {cp.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Variant Cards */}
              <div className="space-y-4">
                {variants.map((variant, vi) => (
                  <div key={vi} className="border border-slate-200 rounded-2xl p-4 bg-slate-50/40 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
                      <div className="flex items-center gap-3">
                        <span
                          className="w-7 h-7 rounded-full border-2 border-white shadow-sm flex-shrink-0"
                          style={{ backgroundColor: variant.colorHex }}
                        />
                        <input
                          className="border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-800 bg-white focus:outline-none focus:border-brand-teal w-36"
                          value={variant.color}
                          onChange={e => updateVariant(vi, 'color', e.target.value)}
                          placeholder="Color Name"
                        />
                        <input
                          type="color"
                          value={variant.colorHex}
                          onChange={e => updateVariant(vi, 'colorHex', e.target.value)}
                          className="w-8 h-8 rounded-lg border border-slate-200 cursor-pointer p-0.5 bg-white"
                          title="Pick Color"
                        />
                      </div>

                      {/* Quick Bulk Stock Action */}
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-slate-500 font-medium">Bulk Stock:</span>
                        <input
                          type="number"
                          placeholder="Qty"
                          className="w-16 border border-slate-200 rounded-lg px-2 py-1 text-xs text-center bg-white"
                          onKeyDown={e => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              bulkSetStock(vi, e.target.value);
                            }
                          }}
                          id={`bulk-stock-${vi}`}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const val = document.getElementById(`bulk-stock-${vi}`)?.value || '10';
                            bulkSetStock(vi, val);
                          }}
                          className="px-2.5 py-1 bg-slate-200 hover:bg-brand-teal hover:text-white text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                        >
                          Apply
                        </button>
                        {variants.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeVariant(vi)}
                            className="p-1.5 text-slate-400 hover:text-red-500 transition-colors ml-2"
                          >
                            <X size={16} />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Size & Stock Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="text-slate-400 uppercase tracking-wider text-[10px] text-left border-b border-slate-200">
                            <th className="pb-2 font-bold w-16">Size</th>
                            <th className="pb-2 font-bold">Stock Quantity</th>
                            <th className="pb-2 font-bold">Variant SKU</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {variant.sizes.map((s, si) => (
                            <tr key={s.size}>
                              <td className="py-2.5 font-bold text-slate-700">{s.size}</td>
                              <td className="py-2.5 pr-4">
                                <input
                                  type="number"
                                  min="0"
                                  value={s.stock}
                                  onChange={e => updateVariantSize(vi, si, 'stock', e.target.value)}
                                  className="w-24 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 bg-white font-bold focus:border-brand-teal"
                                  placeholder="0"
                                />
                              </td>
                              <td className="py-2.5">
                                <input
                                  value={s.sku}
                                  onChange={e => updateVariantSize(vi, si, 'sku', e.target.value)}
                                  className="w-44 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-600 font-mono bg-white focus:border-brand-teal"
                                  placeholder={`${form.sku}-${s.size}`}
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => addVariant()}
                className="w-full py-3 border border-dashed border-brand-teal/40 hover:border-brand-teal bg-brand-powder/10 hover:bg-brand-powder/30 text-brand-teal font-bold text-xs rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus size={14} /> Add Another Color Variant
              </button>
            </div>
          )}

          {/* STEP 4 / ATTRIBUTES & FLAGS */}
          {(viewMode === 'single' || currentStep === 4) && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6 space-y-6">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
                <div className="p-2 bg-brand-powder text-brand-teal rounded-xl">
                  <Sliders size={18} />
                </div>
                <div>
                  <h2 className="font-sans font-bold text-slate-800 text-base">Product Attributes & Merchandising Badges</h2>
                  <p className="text-xs text-slate-400">Specify fabric, occasion and homepage highlight flags</p>
                </div>
              </div>

              {/* Product Badges & Flags Grid */}
              <div>
                <p className="text-xs font-bold text-slate-700 mb-3">Storefront Badges & Visibility</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <ToggleCard
                    label="New Arrival Badge"
                    description="Show 'NEW' ribbon on product cards"
                    checked={form.isNew}
                    onChange={v => set('isNew', v)}
                    icon={Sparkles}
                  />
                  <ToggleCard
                    label="Best Seller Badge"
                    description="Highlight as top customer favorite"
                    checked={form.isBestSeller}
                    onChange={v => set('isBestSeller', v)}
                    icon={CheckCircle2}
                  />
                  <ToggleCard
                    label="Featured Product"
                    description="Include in featured collections slider"
                    checked={form.isFeatured}
                    onChange={v => set('isFeatured', v)}
                    icon={Tag}
                  />
                  <ToggleCard
                    label="Trending Now"
                    description="Show in trending style picks"
                    checked={form.isTrending}
                    onChange={v => set('isTrending', v)}
                    icon={ShoppingBag}
                  />
                  <ToggleCard
                    label="Allow Cash on Delivery (COD)"
                    description="Enable COD payment option"
                    checked={form.allowCOD}
                    onChange={v => set('allowCOD', v)}
                    icon={ShieldCheck}
                  />
                  <ToggleCard
                    label="7-Day Easy Returnable"
                    description="Mark item eligible for easy exchange/return"
                    checked={form.returnable}
                    onChange={v => set('returnable', v)}
                    icon={RefreshCw}
                  />
                </div>
              </div>

              {/* Spec Attributes */}
              <div>
                <p className="text-xs font-bold text-slate-700 mb-3">Material & Design Attributes</p>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    ['Fabric Material', 'fabric', FABRICS],
                    ['Occasion', 'occasion', OCCASIONS],
                    ['Work / Craft', 'work', ['Embroidered', 'Printed', 'Zari', 'Plain', 'Sequin', 'Handwork']],
                    ['Pattern Type', 'pattern', ['Solid', 'Floral', 'Paisley', 'Geometric', 'Abstract', 'Brocade']],
                    ['Fit Style', 'fit', ['Regular', 'Slim', 'Flared', 'Wrap', 'Straight']],
                    ['Sleeve Type', 'sleeve', ['Sleeveless', 'Short', '3/4 Sleeve', 'Full Sleeve', 'Cap Sleeve']],
                    ['Neckline', 'neck', ['Round', 'V-Neck', 'Square', 'Sweetheart', 'Halter', 'N/A']],
                    ['Country of Origin', 'countryOfOrigin', ['India', 'Bangladesh', 'China']],
                  ].map(([label, key, options]) => (
                    <FormField key={key} label={label}>
                      <select className={selectClass} value={form[key]} onChange={e => set(key, e.target.value)}>
                        <option value="">Select {label}</option>
                        {options.map(o => <option key={o}>{o}</option>)}
                      </select>
                    </FormField>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 5 / SEO & PUBLISH */}
          {(viewMode === 'single' || currentStep === 5) && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6 space-y-6">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
                <div className="p-2 bg-brand-powder text-brand-teal rounded-xl">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h2 className="font-sans font-bold text-slate-800 text-base">Search Engine Optimization (SEO)</h2>
                  <p className="text-xs text-slate-400">Optimize meta titles and Google search snippet preview</p>
                </div>
              </div>

              <div className="space-y-4">
                <FormField label="Meta Title">
                  <input
                    className={inputClass}
                    placeholder={`${form.name || 'Product Title'} | Suka Fashions`}
                    value={form.metaTitle}
                    onChange={e => set('metaTitle', e.target.value)}
                  />
                </FormField>

                <FormField label="Meta Description">
                  <textarea
                    className={textareaClass}
                    rows={3}
                    placeholder="Buy authentic ethnic wear online at Suka Fashions. Free shipping & COD available..."
                    value={form.metaDescription}
                    onChange={e => set('metaDescription', e.target.value)}
                  />
                </FormField>

                {/* Google Search Result Card Snippet Preview */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">Google Snippet Preview</p>
                  <p className="text-xs text-[#202124] font-sans truncate">
                    https://sukafashions.com › product › {form.slug || 'product-slug'}
                  </p>
                  <h3 className="text-base text-[#1a0dab] font-semibold hover:underline cursor-pointer truncate mt-0.5">
                    {form.metaTitle || `${form.name || 'Teal Embroidered Organza Saree'} | Suka Fashions`}
                  </h3>
                  <p className="text-xs text-[#4d5156] line-clamp-2 mt-1">
                    {form.metaDescription || form.description || 'Shop luxury handcrafted sarees, kurtis, lehengas at Suka Fashions. Free shipping, cash on delivery and 7 days easy returns across India.'}
                  </p>
                </div>
              </div>

              {/* Bottom Action Footer for Wizard Step 5 */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 text-xs font-semibold rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-1.5"
                >
                  <ArrowLeft size={13} /> Back
                </button>

                <button
                  type="button"
                  onClick={handleSubmit}
                  className="px-6 py-3 bg-brand-teal hover:bg-brand-tealDark text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <Send size={14} /> Publish Product to Storefront
                </button>
              </div>
            </div>
          )}

          {/* Stepper Navigation Buttons (Bottom of Left Column) */}
          {viewMode === 'wizard' && currentStep < 5 && (
            <div className="flex items-center justify-between bg-white rounded-2xl border border-slate-100 p-4 shadow-xs">
              <button
                type="button"
                onClick={() => setCurrentStep(s => Math.max(1, s - 1))}
                disabled={currentStep === 1}
                className="px-4 py-2 border border-slate-200 text-slate-600 text-xs font-semibold rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
              >
                <ArrowLeft size={13} /> Previous Step
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(s => Math.min(5, s + 1))}
                className="px-5 py-2 bg-brand-teal hover:bg-brand-tealDark text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                Next Step <ArrowRight size={13} />
              </button>
            </div>
          )}
        </div>

        {/* Right 1 Column: Sticky Real-time Storefront Preview */}
        <div className="space-y-5">
          <div className="sticky top-6 space-y-4">
            {/* Live Customer Preview Card Header */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 overflow-hidden">
              <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-slate-800">Live Customer Preview</span>
                </div>
                <div className="flex gap-1 bg-slate-100 p-0.5 rounded-lg text-[10px] font-bold">
                  <button
                    onClick={() => setPreviewTab('card')}
                    className={`px-2 py-1 rounded-md transition-all ${
                      previewTab === 'card' ? 'bg-white text-brand-teal shadow-xs' : 'text-slate-500'
                    }`}
                  >
                    Card View
                  </button>
                  <button
                    onClick={() => setPreviewTab('page')}
                    className={`px-2 py-1 rounded-md transition-all ${
                      previewTab === 'page' ? 'bg-white text-brand-teal shadow-xs' : 'text-slate-500'
                    }`}
                  >
                    Detail View
                  </button>
                </div>
              </div>

              {/* CARD PREVIEW MODE */}
              {previewTab === 'card' ? (
                <div className="bg-white border border-brand-powder/60 rounded-xl overflow-hidden shadow-md max-w-xs mx-auto group">
                  {/* Product Image Box */}
                  <div className="relative aspect-[3/4] bg-slate-100 overflow-hidden">
                    {images[0] ? (
                      <img
                        src={images.find(i => i.primary)?.url || images[0].url}
                        alt="Preview"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 p-4 text-center">
                        <ImagePlus size={32} />
                        <span className="text-xs mt-2 font-medium">Upload photo to preview card</span>
                      </div>
                    )}

                    {/* Merchandising Ribbons */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
                      {form.isNew && (
                        <span className="bg-brand-teal text-white text-[9px] font-extrabold uppercase px-2 py-0.5 rounded shadow-xs">
                          NEW
                        </span>
                      )}
                      {form.isBestSeller && (
                        <span className="bg-amber-500 text-white text-[9px] font-extrabold uppercase px-2 py-0.5 rounded shadow-xs">
                          BESTSELLER
                        </span>
                      )}
                    </div>

                    {discountPercent > 0 && (
                      <span className="absolute top-2 right-2 bg-red-600 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-xs">
                        {discountPercent}% OFF
                      </span>
                    )}
                  </div>

                  {/* Product Meta */}
                  <div className="p-3.5 space-y-1.5 text-left">
                    <p className="text-[10px] font-bold text-brand-teal uppercase tracking-widest">
                      {form.category} {form.subcategory ? `· ${form.subcategory}` : ''}
                    </p>
                    <h4 className="font-serif text-xs font-bold text-brand-navy truncate">
                      {form.name || 'Untitled Product'}
                    </h4>
                    <div className="flex items-center gap-2 pt-1">
                      <span className="font-sans text-sm font-bold text-brand-navy">
                        ₹{form.sellingPrice ? parseInt(form.sellingPrice).toLocaleString('en-IN') : '0'}
                      </span>
                      {form.mrp && parseFloat(form.mrp) > parseFloat(form.sellingPrice) && (
                        <span className="font-sans text-xs text-brand-navy/40 line-through">
                          ₹{parseInt(form.mrp).toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>

                    {/* Available Colors */}
                    {variants.length > 0 && (
                      <div className="flex items-center gap-1 pt-1">
                        {variants.map((v, i) => (
                          <span
                            key={i}
                            className="w-3 h-3 rounded-full border border-slate-200"
                            style={{ backgroundColor: v.colorHex }}
                            title={v.color}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* DETAIL PAGE PREVIEW MODE */
                <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 text-xs">
                  <div className="flex gap-3">
                    <div className="w-20 h-24 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                      {images[0] ? (
                        <img src={images[0].url} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                          <ImagePlus size={16} />
                        </div>
                      )}
                    </div>
                    <div className="space-y-1 min-w-0">
                      <span className="text-[9px] font-bold text-brand-teal uppercase tracking-wider">{form.category}</span>
                      <h4 className="font-bold text-slate-800 leading-tight truncate">{form.name || 'Product Title'}</h4>
                      <p className="text-[10px] text-slate-500">SKU: {form.sku}</p>
                      <div className="flex items-center gap-1.5 pt-1">
                        <span className="font-bold text-slate-900">₹{form.sellingPrice || '0'}</span>
                        <span className="text-slate-400 line-through text-[10px]">₹{form.mrp || '0'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-2 space-y-1 text-[11px]">
                    <p><span className="font-bold text-slate-700">Fabric:</span> {form.fabric || 'Not specified'}</p>
                    <p><span className="font-bold text-slate-700">Occasion:</span> {form.occasion || 'Not specified'}</p>
                    <p><span className="font-bold text-slate-700">COD Available:</span> {form.allowCOD ? 'Yes' : 'No'}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Form Quick Action Box */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-2.5">
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full py-3 bg-brand-teal hover:bg-brand-tealDark text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send size={14} /> Publish Product Now
              </button>
              <button
                type="button"
                onClick={() => navigate('/admin/products')}
                className="w-full py-2.5 border border-slate-200 text-slate-600 text-xs font-semibold rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5"
              >
                <Save size={14} /> Save Draft & Exit
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 size={36} />
            </div>
            <div>
              <h3 className="font-sans text-lg font-bold text-slate-800">Product Published!</h3>
              <p className="text-xs text-slate-500 mt-1">
                "{form.name || 'New Product'}" is now live on Suka Fashions catalog.
              </p>
            </div>
            <div className="space-y-2 pt-2">
              <button
                onClick={() => navigate('/admin/products')}
                className="w-full py-2.5 bg-brand-teal text-white text-xs font-bold rounded-xl shadow-xs hover:bg-brand-tealDark transition-all"
              >
                Go to Products Catalog
              </button>
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  setCurrentStep(1);
                }}
                className="w-full py-2.5 border border-slate-200 text-slate-600 text-xs font-semibold rounded-xl hover:bg-slate-50 transition-colors"
              >
                Add Another Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
