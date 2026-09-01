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
  { id: 1, title: 'Basic Details', icon: Info, desc: 'Name, category & brand' },
  { id: 2, title: 'Media & Gallery', icon: ImagePlus, desc: 'Product photos & assets' },
  { id: 3, title: 'Variants & Stock', icon: Box, desc: 'Colors, pricing & stock' },
  { id: 4, title: 'Attributes & Badges', icon: Sliders, desc: 'Fabric, occasion & flags' },
  { id: 5, title: 'Review & Publish', icon: CheckCircle2, desc: 'Complete product review' },
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

  // Generate a fresh unique product ID for new listings
  const initialNewId = useMemo(() => `PRD-${Math.floor(1000 + Math.random() * 9000)}`, []);

  const [form, setForm] = useState({
    id: initialNewId,
    name: '',
    tagline: '',
    slug: '',
    description: '',
    shortDescription: '',
    category: 'Sarees',
    subcategory: 'Silk Sarees',
    brand: 'Suka Fashions',
    sku: '',
    sellingPrice: '',
    mrp: '',
    discount: '',
    costPrice: '',
    gst: '5',
    fabric: '',
    occasion: '',
    work: '',
    pattern: '',
    fit: '',
    sleeve: '',
    neck: '',
    careInstructions: 'Dry clean only',
    countryOfOrigin: 'India',
    metaTitle: '',
    metaDescription: '',
    badge: 'new',
    isNew: true,
    isBestSeller: false,
    isFeatured: false,
    isTrending: false,
    showOnHomepage: false,
    allowCOD: true,
    returnable: true,
  });

  const [variants, setVariants] = useState([
    {
      color: '',
      colorHex: '#006B70',
      sizes: [
        { size: '', price: '', mrp: '', stock: '', sku: '' },
      ],
    },
  ]);

  const [images, setImages] = useState([]);

  const [customBadges, setCustomBadges] = useState([]);

  const addCustomBadge = () => {
    const newId = Date.now();
    setCustomBadges(b => [
      ...b,
      { id: newId, label: 'Exclusive', color: 'bg-brand-teal' },
    ]);
    setForm(f => ({
      ...f,
      badge: `custom_${newId}`,
      isNew: false,
      isBestSeller: false,
      isFeatured: false,
      isTrending: false,
    }));
  };

  const updateCustomBadge = (id, key, val) => {
    setCustomBadges(b => b.map(badge => badge.id === id ? { ...badge, [key]: val } : badge));
  };

  const removeCustomBadge = (id) => {
    setCustomBadges(b => b.filter(badge => badge.id !== id));
    if (form.badge === `custom_${id}`) {
      setForm(f => ({ ...f, badge: 'new', isNew: true, isBestSeller: false, isFeatured: false, isTrending: false }));
    }
  };

  const handleBadgeSelect = (badgeId) => {
    setForm(f => ({
      ...f,
      badge: badgeId,
      isNew: badgeId === 'new',
      isBestSeller: badgeId === 'bestSeller',
      isFeatured: badgeId === 'featured',
      isTrending: badgeId === 'trending',
    }));
  };

  const resetFormToBlank = () => {
    setForm({
      id: `PRD-${Math.floor(1000 + Math.random() * 9000)}`,
      name: '',
      tagline: '',
      slug: '',
      description: '',
      shortDescription: '',
      category: 'Sarees',
      subcategory: 'Silk Sarees',
      brand: 'Suka Fashions',
      sku: '',
      sellingPrice: '',
      mrp: '',
      discount: '',
      costPrice: '',
      gst: '5',
      fabric: '',
      occasion: '',
      work: '',
      pattern: '',
      fit: '',
      sleeve: '',
      neck: '',
      careInstructions: 'Dry clean only',
      countryOfOrigin: 'India',
      metaTitle: '',
      metaDescription: '',
      badge: 'new',
      isNew: true,
      isBestSeller: false,
      isFeatured: false,
      isTrending: false,
      showOnHomepage: false,
      allowCOD: true,
      returnable: true,
    });
    setVariants([
      {
        color: '',
        colorHex: '#006B70',
        sizes: [
          { size: '', price: '', mrp: '', stock: '', sku: '' },
        ],
      },
    ]);
    setImages([]);
    setCustomBadges([]);
  };

  // Pre-populate if editing or duplicating an existing product, or reset to blank
  React.useEffect(() => {
    if (targetId) {
      const existing = adminProducts.find(p => p.id === targetId || p.slug === targetId);
      if (existing) {
        setForm({
          id: duplicateId ? `${existing.id}-COPY` : (existing.id || 'PRD-1029'),
          name: duplicateId ? `${existing.name} (Copy)` : (existing.name || ''),
          tagline: existing.tagline || existing.shortDescription || '',
          slug: duplicateId ? `${existing.slug}-copy` : (existing.slug || ''),
          description: existing.description || '',
          shortDescription: existing.shortDescription || '',
          category: existing.category || 'Sarees',
          subcategory: existing.subcategory || '',
          brand: existing.brand || 'Suka Fashions',
          sku: duplicateId ? `${existing.sku}-COPY` : (existing.sku || ''),
          sellingPrice: existing.price ? existing.price.toString() : (existing.sellingPrice ? existing.sellingPrice.toString() : ''),
          mrp: existing.mrp ? existing.mrp.toString() : '',
          costPrice: existing.costPrice ? existing.costPrice.toString() : '',
          gst: existing.gst ? existing.gst.toString() : '5',
          fabric: existing.attributes?.fabric || existing.fabric || '',
          occasion: existing.attributes?.occasion || existing.occasion || '',
          work: existing.attributes?.work || existing.work || '',
          pattern: existing.attributes?.pattern || existing.pattern || '',
          fit: existing.attributes?.fit || existing.fit || '',
          sleeve: existing.attributes?.sleeve || existing.sleeve || '',
          neck: existing.attributes?.neck || existing.neck || '',
          careInstructions: existing.attributes?.careInstructions || existing.careInstructions || 'Dry clean only',
          countryOfOrigin: existing.attributes?.countryOfOrigin || existing.countryOfOrigin || 'India',
          metaTitle: existing.seo?.metaTitle || '',
          metaDescription: existing.seo?.metaDescription || '',
          isNew: existing.isNew ?? true,
          isBestSeller: existing.isBestSeller ?? false,
          isFeatured: existing.featured ?? existing.isFeatured ?? false,
          isTrending: existing.isTrending ?? false,
          showOnHomepage: existing.showOnHomepage ?? false,
          allowCOD: existing.allowCOD ?? true,
          returnable: existing.returnable ?? true,
        });

        if (existing.variants && existing.variants.length > 0) {
          setVariants(existing.variants.map(v => ({
            color: v.color || '',
            colorHex: v.colorHex || '#006B70',
            sizes: (v.sizes || []).map(s => ({
              size: s.size || '',
              price: s.price !== undefined ? s.price.toString() : '',
              mrp: s.mrp !== undefined ? s.mrp.toString() : '',
              stock: s.stock !== undefined ? s.stock.toString() : '',
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
    } else {
      resetFormToBlank();
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
    if (form.discount) {
      return parseFloat(form.discount) || 0;
    }
    const sp = parseFloat(form.sellingPrice);
    const mrp = parseFloat(form.mrp);
    if (mrp && sp && mrp > sp) {
      return Math.round(((mrp - sp) / mrp) * 100);
    }
    return 0;
  }, [form.discount, form.sellingPrice, form.mrp]);

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

  const BADGE_OPTIONS = [
    { id: 'new', label: 'New Arrival Badge', ribbon: 'NEW', color: 'bg-brand-teal', description: "Show 'NEW' ribbon on product cards", icon: Sparkles },
    { id: 'bestSeller', label: 'Best Seller Badge', ribbon: 'BESTSELLER', color: 'bg-amber-500', description: 'Highlight as top customer favorite', icon: CheckCircle2 },
    { id: 'featured', label: 'Featured Product', ribbon: 'FEATURED', color: 'bg-brand-navy', description: 'Include in featured collections ribbon', icon: Tag },
    { id: 'trending', label: 'Trending Now', ribbon: 'TRENDING', color: 'bg-purple-600', description: 'Show in trending style picks', icon: ShoppingBag },
    { id: 'none', label: 'No Badge / None', ribbon: null, color: 'bg-slate-400', description: 'Do not show any promotional ribbon on the card', icon: X },
  ];

  const activeBadge = useMemo(() => {
    if (form.badge === 'none') return null;
    if (form.badge === 'new' || (!form.badge && form.isNew)) return { label: 'NEW', color: 'bg-brand-teal' };
    if (form.badge === 'bestSeller' || (!form.badge && form.isBestSeller)) return { label: 'BESTSELLER', color: 'bg-amber-500' };
    if (form.badge === 'featured' || (!form.badge && form.isFeatured)) return { label: 'FEATURED', color: 'bg-brand-navy' };
    if (form.badge === 'trending' || (!form.badge && form.isTrending)) return { label: 'TRENDING', color: 'bg-purple-600' };
    if (form.badge?.startsWith('custom_')) {
      const customId = form.badge.replace('custom_', '');
      const cb = customBadges.find(b => b.id.toString() === customId.toString());
      if (cb && cb.label?.trim()) {
        return { label: cb.label.toUpperCase(), color: cb.color || 'bg-brand-teal' };
      }
    }
    return null;
  }, [form.badge, form.isNew, form.isBestSeller, form.isFeatured, form.isTrending, customBadges]);

  const addVariant = (presetColor) => {
    const colorName = presetColor?.name || '';
    const colorHex = presetColor?.hex || '#1e293b';
    const currentDiscount = parseFloat(form.discount) || 0;
    const defaultMrp = form.mrp || '';
    let defaultPrice = form.sellingPrice || '';
    if (defaultMrp && currentDiscount > 0) {
      defaultPrice = Math.round(parseFloat(defaultMrp) - (parseFloat(defaultMrp) * currentDiscount) / 100).toString();
    }
    setVariants(v => [
      ...v,
      {
        color: colorName,
        colorHex: colorHex,
        sizes: [
          { size: '', price: defaultPrice, mrp: defaultMrp, stock: '', sku: '' },
        ],
      },
    ]);
  };

  const removeVariant = (i) => setVariants(v => v.filter((_, idx) => idx !== i));

  const updateVariant = (vi, key, val) => {
    setVariants(v => v.map((variant, i) => (i === vi ? { ...variant, [key]: val } : variant)));
  };

  const handleProductDiscountChange = (discountVal) => {
    set('discount', discountVal);
    const dNum = parseFloat(discountVal) || 0;

    setVariants(vList =>
      vList.map(variant => ({
        ...variant,
        sizes: variant.sizes.map(s => {
          const mrpNum = parseFloat(s.mrp) || 0;
          if (mrpNum > 0) {
            const calculatedPrice = dNum > 0
              ? Math.round(mrpNum - (mrpNum * Math.min(100, Math.max(0, dNum))) / 100).toString()
              : mrpNum.toString();
            return { ...s, price: calculatedPrice };
          }
          return s;
        }),
      }))
    );

    // Update global form selling price if form.mrp exists
    const globalMrpNum = parseFloat(form.mrp) || 0;
    if (globalMrpNum > 0) {
      const calculatedGlobalSp = dNum > 0
        ? Math.round(globalMrpNum - (globalMrpNum * Math.min(100, Math.max(0, dNum))) / 100).toString()
        : globalMrpNum.toString();
      set('sellingPrice', calculatedGlobalSp);
    }
  };

  const handleSizeMrpChange = (vi, si, newMrp) => {
    setVariants(v =>
      v.map((variant, i) => {
        if (i !== vi) return variant;
        const mrpNum = parseFloat(newMrp) || 0;
        const discountNum = parseFloat(form.discount) || 0;
        let newPrice = variant.sizes[si].price;

        if (mrpNum > 0) {
          if (discountNum > 0) {
            newPrice = Math.round(mrpNum - (mrpNum * Math.min(100, discountNum)) / 100).toString();
          } else if (!newPrice) {
            newPrice = newMrp;
          }
        }

        const updatedSizes = variant.sizes.map((s, j) =>
          j !== si ? s : { ...s, mrp: newMrp, price: newPrice }
        );

        if (vi === 0 && si === 0) {
          set('mrp', newMrp);
          if (newPrice) set('sellingPrice', newPrice);
        }

        return { ...variant, sizes: updatedSizes };
      })
    );
  };

  const handleSizePriceChange = (vi, si, newPrice) => {
    setVariants(v =>
      v.map((variant, i) => {
        if (i !== vi) return variant;
        const updatedSizes = variant.sizes.map((s, j) =>
          j !== si ? s : { ...s, price: newPrice }
        );

        if (vi === 0 && si === 0) {
          set('sellingPrice', newPrice);
        }

        return { ...variant, sizes: updatedSizes };
      })
    );
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

  const addSizeToVariant = (vi) => {
    setVariants(v =>
      v.map((variant, i) => {
        if (i !== vi) return variant;
        const prevSize = variant.sizes[variant.sizes.length - 1];
        const defaultMrp = prevSize?.mrp || form.mrp || '';
        const currentDiscount = parseFloat(form.discount) || 0;
        let defaultPrice = prevSize?.price || form.sellingPrice || '';
        if (defaultMrp && currentDiscount > 0) {
          defaultPrice = Math.round(parseFloat(defaultMrp) - (parseFloat(defaultMrp) * currentDiscount) / 100).toString();
        }

        return {
          ...variant,
          sizes: [
            ...variant.sizes,
            {
              size: '',
              mrp: defaultMrp,
              price: defaultPrice,
              stock: '',
              sku: '',
            },
          ],
        };
      })
    );
  };

  const removeSizeFromVariant = (vi, si) => {
    setVariants(v =>
      v.map((variant, i) =>
        i !== vi
          ? variant
          : {
              ...variant,
              sizes: variant.sizes.filter((_, idx) => idx !== si),
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
                    <h2 className="font-sans font-bold text-slate-800 text-base">Basic Details</h2>
                    <p className="text-xs text-slate-400">Core title, category, subcategory and brand information</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Product ID (LEFT) and Product Title (RIGHT) */}
                <FormField label="Product ID" required hint="Permanent catalog identifier">
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-xs text-brand-teal font-mono font-bold">#</span>
                    <input
                      className={`${inputClass} pl-7 font-mono font-bold text-brand-navy uppercase bg-slate-50/70 border-slate-300/80`}
                      placeholder="PRD-1029"
                      value={form.id}
                      onChange={e => set('id', e.target.value)}
                    />
                  </div>
                </FormField>

                <FormField label="Product Title / Name" required toolTip="Displayed as main headline across store">
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

                {/* Product Tagline */}
                <div className="col-span-2">
                  <FormField label="Product Tagline / Catchphrase" hint="Short promotional phrase displayed under product title and on banners">
                    <input
                      className={inputClass}
                      placeholder="e.g. Handcrafted festive elegance with pure zari handloom detailing"
                      value={form.tagline}
                      onChange={e => set('tagline', e.target.value)}
                    />
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

                <div className="col-span-2">
                  <FormField label="Brand">
                    <input className={inputClass} value={form.brand} onChange={e => set('brand', e.target.value)} />
                  </FormField>
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
                    <p className="text-xs text-slate-400">Upload high quality photos for product catalog and zoom view</p>
                  </div>
                </div>
              </div>

              {/* Drag & Drop Upload Zone */}
              <div
                onDrop={handleImageDrop}
                onDragOver={e => e.preventDefault()}
                onClick={() => document.getElementById('img-upload-input').click()}
                className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:border-brand-teal hover:bg-brand-powder/20 transition-all cursor-pointer group bg-slate-50/50"
              >
                <input id="img-upload-input" type="file" multiple accept="image/*" className="hidden" onChange={handleImageDrop} />
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-400 group-hover:text-brand-teal group-hover:border-brand-teal/40 flex items-center justify-center mx-auto mb-2.5 transition-colors shadow-xs">
                  <Upload size={18} />
                </div>
                <p className="text-xs font-bold text-slate-700 group-hover:text-brand-teal transition-colors">
                  Drag & Drop images here or click to browse
                </p>
                <p className="text-[10px] text-slate-400 mt-1">Supports PNG, JPG, WEBP up to 5MB each. First image set as primary cover photo.</p>
              </div>

              {/* Uploaded Gallery Grid (Compact Sized Thumbnails) */}
              {images.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-slate-700 mb-2.5">Gallery ({images.length} photos added)</p>
                  <div className="flex flex-wrap gap-2.5">
                    {images.map((img, i) => (
                      <div
                        key={i}
                        className={`relative group w-20 aspect-[3/4] rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 bg-slate-100 ${
                          img.primary ? 'border-brand-teal ring-2 ring-brand-teal/20 shadow-xs' : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                        
                        {img.primary ? (
                          <span className="absolute top-1 left-1 bg-brand-teal text-white text-[7.5px] font-bold px-1 py-0.2 rounded shadow-2xs">
                            COVER
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setPrimaryImage(i)}
                            className="absolute top-1 left-1 bg-black/60 hover:bg-brand-teal text-white text-[7.5px] font-bold px-1 py-0.2 rounded opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                          >
                            Cover
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => setImages(imgs => imgs.filter((_, j) => j !== i))}
                          className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-2xs cursor-pointer"
                        >
                          <X size={9} />
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

              {/* Single Product Discount Bar */}
              <div className="bg-brand-powder/20 border border-brand-teal/20 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 bg-brand-teal text-white rounded-xl text-xs shadow-xs">
                    <Tag size={16} />
                  </span>
                  <div>
                    <h3 className="text-xs font-bold text-slate-800">Product Discount Percentage</h3>
                    <p className="text-[10px] text-slate-500">Enter a single discount (%) for this product — applied automatically to calculate selling prices for all sizes</p>
                  </div>
                </div>

                {/* Single Product Discount % Input */}
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      placeholder="0"
                      value={form.discount || ''}
                      onChange={(e) => handleProductDiscountChange(e.target.value)}
                      className="w-24 pl-3.5 pr-7 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-brand-teal focus:outline-none focus:border-brand-teal shadow-2xs text-center"
                    />
                    <span className="absolute right-2.5 top-2 text-xs font-bold text-slate-400">%</span>
                  </div>
                </div>
              </div>

              {/* Quick Add Color Presets Bar (Without custom color picker) */}
              <div>
                <p className="text-xs font-semibold text-slate-600 mb-2">Quick Add Color:</p>
                <div className="flex flex-wrap gap-2 items-center">
                  {COLOR_PRESETS.map((cp) => (
                    <button
                      key={cp.name}
                      type="button"
                      onClick={() => addVariant(cp)}
                      className="px-3 py-1.5 bg-slate-50 hover:bg-brand-powder/30 border border-slate-200 hover:border-brand-teal rounded-xl text-xs text-slate-700 font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-2xs"
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

                      {/* Total Stock Display Badge & Apply Button */}
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5 bg-brand-powder/50 border border-brand-teal/20 px-3 py-1 rounded-xl shadow-2xs">
                          <span className="text-[11px] font-semibold text-slate-600">Total Stock:</span>
                          <span className="text-xs font-bold text-brand-teal font-mono">
                            {variant.sizes.reduce((sum, s) => sum + (parseInt(s.stock) || 0), 0)} Units
                          </span>
                        </div>
                        <button
                          type="button"
                          id={`apply-btn-${vi}`}
                          onClick={() => {
                            const btn = document.getElementById(`apply-btn-${vi}`);
                            if (btn) {
                              btn.textContent = 'Applied ✓';
                              setTimeout(() => { btn.textContent = 'Apply'; }, 1500);
                            }
                          }}
                          className="px-3.5 py-1 bg-brand-teal hover:bg-brand-tealDark text-white text-xs font-semibold rounded-xl transition-all cursor-pointer shadow-2xs"
                        >
                          Apply
                        </button>
                        {variants.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeVariant(vi)}
                            className="p-1.5 text-slate-400 hover:text-red-500 transition-colors ml-1 cursor-pointer"
                            title="Remove Variant"
                          >
                            <X size={16} />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Size, Pricing & Stock Table (Cleaned: No discount column, no variant SKU column) */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="text-slate-400 uppercase tracking-wider text-[10px] text-left border-b border-slate-200">
                            <th className="pb-2 font-bold w-32">Size</th>
                            <th className="pb-2 font-bold w-36">Selling Price (₹)</th>
                            <th className="pb-2 font-bold w-36">MRP (₹)</th>
                            <th className="pb-2 font-bold w-28">Stock Qty</th>
                            <th className="pb-2 font-bold text-right pr-2">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {variant.sizes.map((s, si) => (
                            <tr key={si} className="hover:bg-slate-50/50 transition-colors">
                              {/* Size Name */}
                              <td className="py-2.5 pr-3">
                                <input
                                  value={s.size}
                                  onChange={e => updateVariantSize(vi, si, 'size', e.target.value)}
                                  className="border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800 bg-white w-full focus:border-brand-teal focus:outline-none"
                                  placeholder="e.g. S, M, Free Size"
                                />
                              </td>

                              {/* Selling Price (₹) */}
                              <td className="py-2.5 pr-3">
                                <div className="relative">
                                  <span className="absolute left-2.5 top-1.5 text-xs font-bold text-brand-teal">₹</span>
                                  <input
                                    type="number"
                                    min="0"
                                    value={s.price !== undefined ? s.price : form.sellingPrice}
                                    onChange={e => handleSizePriceChange(vi, si, e.target.value)}
                                    className="w-full pl-6 pr-2 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-brand-navy bg-white focus:border-brand-teal focus:outline-none"
                                    placeholder="3499"
                                  />
                                </div>
                              </td>

                              {/* MRP (₹) */}
                              <td className="py-2.5 pr-3">
                                <div className="relative">
                                  <span className="absolute left-2.5 top-1.5 text-xs font-bold text-slate-400">₹</span>
                                  <input
                                    type="number"
                                    min="0"
                                    value={s.mrp !== undefined ? s.mrp : form.mrp}
                                    onChange={e => handleSizeMrpChange(vi, si, e.target.value)}
                                    className="w-full pl-6 pr-2 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 bg-white focus:border-brand-teal focus:outline-none"
                                    placeholder="4999"
                                  />
                                </div>
                              </td>

                              {/* Stock */}
                              <td className="py-2.5 pr-3">
                                <input
                                  type="number"
                                  min="0"
                                  value={s.stock}
                                  onChange={e => updateVariantSize(vi, si, 'stock', e.target.value)}
                                  className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 bg-white font-bold focus:border-brand-teal focus:outline-none"
                                  placeholder="0"
                                />
                              </td>

                              {/* Delete */}
                              <td className="py-2.5 text-right pr-2">
                                {variant.sizes.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => removeSizeFromVariant(vi, si)}
                                    className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg transition-colors cursor-pointer"
                                    title="Delete Size"
                                  >
                                    <X size={14} />
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Add Size Button */}
                    <div className="pt-2 border-t border-slate-100 flex justify-end">
                      <button
                        type="button"
                        onClick={() => addSizeToVariant(vi)}
                        className="px-3.5 py-1.5 border border-dashed border-brand-teal/40 hover:border-brand-teal bg-brand-powder/20 hover:bg-brand-powder/40 text-brand-teal text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                      >
                        <Plus size={13} /> Add Size
                      </button>
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
                  <p className="text-xs text-slate-400">Specify fabric, occasion, craftsmanship and promotional badges</p>
                </div>
              </div>

              {/* Product Badges & Flags Grid with Add Custom Badge Button (Single Choice Option) */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-xs font-bold text-slate-700">Storefront Badges & Visibility</p>
                    <p className="text-[10px] text-slate-400">Select one badge to display on the product card (only one shown on card)</p>
                  </div>
                  <button
                    type="button"
                    onClick={addCustomBadge}
                    className="px-3 py-1.5 bg-brand-powder/40 hover:bg-brand-powder border border-dashed border-brand-teal/40 hover:border-brand-teal text-brand-teal text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Plus size={13} /> Add Custom Badge
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {BADGE_OPTIONS.map((opt) => {
                    const isSelected = form.badge === opt.id || (!form.badge && opt.id === 'new' && form.isNew);
                    const OptIcon = opt.icon;
                    return (
                      <div
                        key={opt.id}
                        onClick={() => handleBadgeSelect(opt.id)}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          isSelected
                            ? 'border-brand-teal bg-brand-powder/20 ring-2 ring-brand-teal/15 shadow-xs'
                            : 'border-slate-100 bg-white hover:border-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${isSelected ? 'bg-brand-teal text-white' : 'bg-slate-100 text-slate-500'}`}>
                            <OptIcon size={16} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className={`text-xs font-bold ${isSelected ? 'text-brand-teal' : 'text-slate-700'}`}>{opt.label}</p>
                              {opt.ribbon && (
                                <span className={`${opt.color} text-white text-[8px] font-extrabold px-1.5 py-0.2 rounded shadow-2xs`}>
                                  {opt.ribbon}
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-slate-400 leading-tight mt-0.5">{opt.description}</p>
                          </div>
                        </div>

                        {/* Radio Selection Indicator */}
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                          isSelected ? 'border-brand-teal bg-brand-teal' : 'border-slate-300 bg-white'
                        }`}>
                          {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Custom Badges Dynamic List */}
                {customBadges.length > 0 && (
                  <div className="mt-3.5 pt-3.5 border-t border-slate-100 space-y-2.5">
                    <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Custom Badges ({customBadges.length})</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {customBadges.map((badge) => {
                        const isCustomSelected = form.badge === `custom_${badge.id}`;
                        return (
                          <div
                            key={badge.id}
                            onClick={() => handleBadgeSelect(`custom_${badge.id}`)}
                            className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2.5 bg-white ${
                              isCustomSelected ? 'border-brand-teal bg-brand-powder/20 ring-2 ring-brand-teal/15 shadow-xs' : 'border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <span className={`w-3 h-3 rounded-full flex-shrink-0 ${badge.color || 'bg-brand-teal'}`} />
                              <input
                                value={badge.label}
                                onClick={(e) => e.stopPropagation()}
                                onChange={e => updateCustomBadge(badge.id, 'label', e.target.value)}
                                placeholder="Badge Label (e.g. Pure Handloom)"
                                className="text-xs font-bold text-slate-800 bg-transparent border-b border-transparent focus:border-brand-teal focus:outline-none w-full truncate"
                              />
                              {/* Color Tag Selector */}
                              <select
                                value={badge.color}
                                onClick={(e) => e.stopPropagation()}
                                onChange={e => updateCustomBadge(badge.id, 'color', e.target.value)}
                                className="text-[10px] font-semibold border border-slate-200 rounded px-1.5 py-0.5 bg-slate-50 text-slate-700 cursor-pointer"
                              >
                                <option value="bg-brand-teal">Teal</option>
                                <option value="bg-amber-500">Gold</option>
                                <option value="bg-rose-500">Rose</option>
                                <option value="bg-purple-600">Purple</option>
                                <option value="bg-emerald-600">Emerald</option>
                                <option value="bg-blue-600">Navy</option>
                                <option value="bg-red-600">Crimson</option>
                              </select>
                            </div>

                            <div className="flex items-center gap-2 flex-shrink-0">
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                                isCustomSelected ? 'border-brand-teal bg-brand-teal' : 'border-slate-300 bg-white'
                              }`}>
                                {isCustomSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                              </div>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeCustomBadge(badge.id);
                                }}
                                className="p-1 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                                title="Delete Badge"
                              >
                                <X size={13} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Spec Attributes (Fabric, Occasion, Work) */}
              <div>
                <p className="text-xs font-bold text-slate-700 mb-3">Material & Design Attributes</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    ['Fabric Material', 'fabric', FABRICS],
                    ['Occasion', 'occasion', OCCASIONS],
                    ['Work / Craft', 'work', ['Embroidered', 'Printed', 'Zari', 'Plain', 'Sequin', 'Handwork']],
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

          {/* STEP 5 / REVIEW & PUBLISH */}
          {(viewMode === 'single' || currentStep === 5) && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-brand-powder text-brand-teal rounded-xl">
                    <CheckCircle2 size={18} />
                  </div>
                  <div>
                    <h2 className="font-sans font-bold text-slate-800 text-base">Product Review & Summary</h2>
                    <p className="text-xs text-slate-400">Review all listing details before publishing to the storefront</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-2xs">
                  <Check size={13} /> Ready to Publish
                </span>
              </div>

              <div className="space-y-4">
                {/* 1. Basic Details Review Card */}
                <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4.5 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="p-1 bg-brand-powder text-brand-teal rounded-md text-xs">
                        <Info size={13} />
                      </span>
                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">1. Basic Details</h3>
                    </div>
                    {viewMode === 'wizard' && (
                      <button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        className="text-[11px] font-bold text-brand-teal hover:underline cursor-pointer"
                      >
                        Edit
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Product ID</span>
                      <span className="font-mono font-bold text-brand-teal bg-white px-2 py-0.5 rounded border border-slate-200 inline-block mt-0.5">
                        #{form.id || 'PRD-1029'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Category</span>
                      <span className="font-semibold text-slate-800 mt-0.5 block">{form.category || '—'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Subcategory</span>
                      <span className="font-semibold text-slate-800 mt-0.5 block">{form.subcategory || '—'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Brand</span>
                      <span className="font-semibold text-slate-800 mt-0.5 block">{form.brand || 'Suka Fashions'}</span>
                    </div>
                  </div>

                  <div className="pt-1 text-xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Product Title</span>
                    <span className="font-bold text-slate-800 text-sm mt-0.5 block">{form.name || 'Untitled Product'}</span>
                  </div>

                  {form.tagline && (
                    <div className="text-xs">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Tagline</span>
                      <p className="text-xs text-slate-600 italic mt-0.5">{form.tagline}</p>
                    </div>
                  )}

                  {form.description && (
                    <div className="text-xs pt-1 border-t border-slate-200/50">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Description</span>
                      <p className="text-xs text-slate-600 mt-1 line-clamp-3 leading-relaxed">{form.description}</p>
                    </div>
                  )}
                </div>

                {/* 2. Media Gallery Review Card */}
                <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4.5 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="p-1 bg-brand-powder text-brand-teal rounded-md text-xs">
                        <ImagePlus size={13} />
                      </span>
                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                        2. Media Gallery ({images.length} Photos)
                      </h3>
                    </div>
                    {viewMode === 'wizard' && (
                      <button
                        type="button"
                        onClick={() => setCurrentStep(2)}
                        className="text-[11px] font-bold text-brand-teal hover:underline cursor-pointer"
                      >
                        Edit
                      </button>
                    )}
                  </div>

                  {images.length > 0 ? (
                    <div className="flex flex-wrap gap-2.5">
                      {images.map((img, i) => (
                        <div
                          key={i}
                          className={`relative w-16 aspect-[3/4] rounded-lg overflow-hidden border bg-white shadow-2xs ${
                            img.primary ? 'ring-2 ring-brand-teal border-brand-teal' : 'border-slate-200'
                          }`}
                        >
                          <img src={img.url} alt="Product" className="w-full h-full object-cover" />
                          {img.primary && (
                            <span className="absolute top-0.5 left-0.5 bg-brand-teal text-white text-[7px] font-bold px-1 rounded">
                              COVER
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">No photos uploaded yet.</p>
                  )}
                </div>

                {/* 3. Variants, Pricing & Stock Matrix Review Card */}
                <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4.5 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="p-1 bg-brand-powder text-brand-teal rounded-md text-xs">
                        <Box size={13} />
                      </span>
                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                        3. Pricing & Color Variants Matrix
                      </h3>
                    </div>
                    {viewMode === 'wizard' && (
                      <button
                        type="button"
                        onClick={() => setCurrentStep(3)}
                        className="text-[11px] font-bold text-brand-teal hover:underline cursor-pointer"
                      >
                        Edit
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-xs pb-1">
                    <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-2xs">
                      <Tag size={13} className="text-brand-teal" />
                      <span className="text-slate-500 font-medium">Product Discount:</span>
                      <span className="font-bold text-brand-teal font-mono">
                        {form.discount ? `${form.discount}% OFF` : '0%'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-2xs">
                      <span className="text-slate-500 font-medium">Total Inventory:</span>
                      <span className="font-bold text-slate-800 font-mono">
                        {variants.reduce((total, v) => total + v.sizes.reduce((sum, s) => sum + (parseInt(s.stock) || 0), 0), 0)} Units
                      </span>
                    </div>
                  </div>

                  {/* Variants Breakdown List */}
                  <div className="space-y-3 pt-1">
                    {variants.map((v, vi) => (
                      <div key={vi} className="bg-white border border-slate-200 rounded-xl p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span
                              className="w-4 h-4 rounded-full border border-slate-300 shadow-2xs"
                              style={{ backgroundColor: v.colorHex }}
                            />
                            <span className="text-xs font-bold text-slate-800">
                              {v.color || `Variant ${vi + 1}`}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-500 font-mono font-semibold">
                            {v.sizes.reduce((sum, s) => sum + (parseInt(s.stock) || 0), 0)} units total
                          </span>
                        </div>

                        {/* Size Table */}
                        <div className="overflow-x-auto">
                          <table className="w-full text-xs">
                            <thead>
                              <tr className="text-slate-400 text-[10px] uppercase font-bold text-left border-b border-slate-100">
                                <th className="pb-1 w-28">Size</th>
                                <th className="pb-1 w-32">Selling Price</th>
                                <th className="pb-1 w-32">MRP</th>
                                <th className="pb-1">Stock</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                              {v.sizes.map((s, si) => (
                                <tr key={si} className="text-slate-700">
                                  <td className="py-1.5 font-bold text-slate-800">{s.size || 'Standard'}</td>
                                  <td className="py-1.5 font-bold text-brand-teal font-mono">
                                    ₹{s.price ? parseInt(s.price).toLocaleString('en-IN') : '—'}
                                  </td>
                                  <td className="py-1.5 text-slate-400 line-through font-mono">
                                    ₹{s.mrp ? parseInt(s.mrp).toLocaleString('en-IN') : '—'}
                                  </td>
                                  <td className="py-1.5 font-semibold text-slate-700 font-mono">
                                    {s.stock || '0'}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. Attributes & Badges Review Card */}
                <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4.5 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="p-1 bg-brand-powder text-brand-teal rounded-md text-xs">
                        <Sliders size={13} />
                      </span>
                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                        4. Attributes & Badges
                      </h3>
                    </div>
                    {viewMode === 'wizard' && (
                      <button
                        type="button"
                        onClick={() => setCurrentStep(4)}
                        className="text-[11px] font-bold text-brand-teal hover:underline cursor-pointer"
                      >
                        Edit
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Fabric Material</span>
                      <span className="font-semibold text-slate-800 mt-0.5 block">{form.fabric || 'Not specified'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Occasion</span>
                      <span className="font-semibold text-slate-800 mt-0.5 block">{form.occasion || 'Not specified'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Work / Craft</span>
                      <span className="font-semibold text-slate-800 mt-0.5 block">{form.work || 'Not specified'}</span>
                    </div>
                  </div>

                  {/* Active Merchandising Badge (Single Badge) */}
                  <div className="pt-2 border-t border-slate-200/50">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                      Active Merchandising Badge
                    </span>
                    <div>
                      {activeBadge ? (
                        <span className={`${activeBadge.color} text-white text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-2xs inline-block`}>
                          {activeBadge.label}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400 italic">No promotional badge selected (Standard Listing).</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Action Footer for Wizard Step 5 */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 text-xs font-semibold rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer"
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

                    {/* Merchandising Ribbon (Single Badge) */}
                    {activeBadge && (
                      <div className="absolute top-2 left-2 z-10">
                        <span className={`${activeBadge.color} text-white text-[9px] font-extrabold uppercase px-2 py-0.5 rounded shadow-xs`}>
                          {activeBadge.label}
                        </span>
                      </div>
                    )}

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
                        {form.category} {form.subcategory ? `· ${form.subcategory}` : ''}
                      </p>
                      <span className="text-[9px] font-mono font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded flex-shrink-0">
                        #{form.id || 'PRD-1029'}
                      </span>
                    </div>

                    <h4 className="font-serif text-xs font-bold text-brand-navy truncate">
                      {form.name || 'Untitled Product'}
                    </h4>

                    {form.tagline && (
                      <p className="text-[10px] text-slate-500 italic truncate font-sans leading-tight">
                        {form.tagline}
                      </p>
                    )}

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
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] font-bold text-brand-teal uppercase tracking-wider">{form.category}</span>
                        <span className="text-[9px] font-mono font-bold text-slate-400 bg-slate-100 px-1 py-0.5 rounded">#{form.id || 'PRD-1029'}</span>
                      </div>
                      <h4 className="font-bold text-slate-800 leading-tight truncate">{form.name || 'Product Title'}</h4>
                      {form.tagline && <p className="text-[10px] text-slate-500 italic truncate">{form.tagline}</p>}
                      <div className="flex items-center gap-1.5 pt-1">
                        <span className="font-bold text-slate-900">₹{form.sellingPrice || '0'}</span>
                        <span className="text-slate-400 line-through text-[10px]">₹{form.mrp || '0'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-2 space-y-1 text-[11px]">
                    <p><span className="font-bold text-slate-700">Fabric:</span> {form.fabric || 'Not specified'}</p>
                    <p><span className="font-bold text-slate-700">Occasion:</span> {form.occasion || 'Not specified'}</p>
                    <p><span className="font-bold text-slate-700">Work/Craft:</span> {form.work || 'Not specified'}</p>
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
                  resetFormToBlank();
                  setCurrentStep(1);
                }}
                className="w-full py-2.5 border border-slate-200 text-slate-600 text-xs font-semibold rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
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
