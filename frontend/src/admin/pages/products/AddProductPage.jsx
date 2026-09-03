// AddProductPage — /admin/products/add & /admin/products/edit/:id
// Rich Color Variant Management with Per-Color Image Galleries, Size/Stock Matrix, and Dynamic Live Customer Preview

import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams, Link } from 'react-router-dom';
import {
  ChevronDown, Plus, X, Upload, Save, Eye, Send, ImagePlus,
  Sparkles, Check, RefreshCw, Layers, ShieldCheck, Tag, ShoppingBag,
  Percent, Info, ArrowRight, ArrowLeft, CheckCircle2, Sliders, AlertCircle,
  HelpCircle, Palette, Box, Trash2, Copy, Star, CheckCircle, ExternalLink
} from 'lucide-react';
import AdminPageHeader from '../../components/ui/AdminPageHeader';
import { useProducts } from '../../../context/ProductContext';

// Assets for Sample Library selector
import sareeGolden from '../../../assets/saree_golden.jpg';
import sareeBeigePink from '../../../assets/saree_beige_pink.jpg';
import sareeBeigeMaroon from '../../../assets/saree_beige_maroon.jpg';
import sareeBeigeOrange from '../../../assets/saree_beige_orange.jpg';
import sareeBeigeMaroonFull from '../../../assets/saree_beige_maroon_full.jpg';
import lehengaRed from '../../../assets/lehenga_red.jpg';
import lehengaPink from '../../../assets/lehenga_pink.jpg';
import lehengaMint from '../../../assets/lehenga_mint.jpg';
import anarkaliBlack from '../../../assets/anarkali_black.jpg';
import kurtiTealPrinted from '../../../assets/kurti_teal_printed.jpg';
import kurtiPurplePrinted from '../../../assets/kurti_purple_printed.jpg';
import kurtiPurpleMaroon from '../../../assets/kurti_purple_maroon.jpg';
import dressNavy from '../../../assets/dress_navy.jpg';
import coordSet from '../../../assets/coord_set.jpg';
import festiveSuit from '../../../assets/festive_suit.jpg';
import dupattaSilk from '../../../assets/dupatta_silk.jpg';

const SAMPLE_IMAGES = [
  { name: 'Golden Zari Saree', url: sareeGolden },
  { name: 'Beige Pink Saree', url: sareeBeigePink },
  { name: 'Beige Maroon Saree', url: sareeBeigeMaroon },
  { name: 'Orange Festive Saree', url: sareeBeigeOrange },
  { name: 'Pink Saree Drape', url: sareeBeigeMaroonFull },
  { name: 'Red Bridal Lehenga', url: lehengaRed },
  { name: 'Pink Party Lehenga', url: lehengaPink },
  { name: 'Mint Pastel Lehenga', url: lehengaMint },
  { name: 'Black Anarkali Suit', url: anarkaliBlack },
  { name: 'Teal Printed Kurti', url: kurtiTealPrinted },
  { name: 'Purple Printed Kurti', url: kurtiPurplePrinted },
  { name: 'Purple Maroon Kurti', url: kurtiPurpleMaroon },
  { name: 'Navy Blue Dress', url: dressNavy },
  { name: 'Teal Co-ord Set', url: coordSet },
  { name: 'Mustard Festive Suit', url: festiveSuit },
  { name: 'Silk Dupatta', url: dupattaSilk },
];

const CATEGORIES = ['Sarees', 'Lehengas', 'Kurtis', 'Dresses', 'Co-ords', 'Dupattas', 'Festive Wear'];
const SUBCATEGORIES = {
  Sarees: ['Organza Sarees', 'Silk Sarees', 'Cotton Sarees', 'Georgette Sarees', 'Wedding Sarees', 'Festive Sarees'],
  Lehengas: ['Bridal Lehengas', 'Party Lehengas', 'Festive Lehengas', 'Designer Lehengas'],
  Kurtis: ['Anarkali Suits', 'Straight Suits', 'Party Wear Kurtis', 'Kurta Sets', 'Palazzo Sets'],
  Dresses: ['Midi Dresses', 'Maxi Dresses', 'Wrap Dresses', 'Bodycon Dresses'],
  'Co-ords': ['Printed Sets', 'Solid Sets', 'Embroidered Sets'],
  Dupattas: ['Silk Dupattas', 'Chiffon Dupattas', 'Banarasi Dupattas'],
  'Festive Wear': ['Suits', 'Sharara Sets', 'Gharara Sets'],
};
const FABRICS = ['Pure Organza', 'Pure Mulberry Silk', 'Chanderi Silk', 'Georgette', 'Micro Velvet', 'Modal Silk', 'Rayon', 'Net', 'Banarasi Silk', 'Kanchipuram Silk'];
const OCCASIONS = ['Wedding / Festive', 'Bridal Wedding', 'Party / Cocktail', 'Casual Festive', 'Office / Elegant', 'Pooja / Celebration'];
const COMMON_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size', 'Semi-Stitched'];
const COLOR_PRESETS = [
  { name: 'Teal', hex: '#006B70' },
  { name: 'Gold Zari', hex: '#D4AF37' },
  { name: 'Crimson Red', hex: '#DC143C' },
  { name: 'Navy Blue', hex: '#0F1E2E' },
  { name: 'Blush Pink', hex: '#F8C8DC' },
  { name: 'Emerald Green', hex: '#10B981' },
  { name: 'Midnight Black', hex: '#0F172A' },
  { name: 'Royal Purple', hex: '#581845' },
  { name: 'Mint Green', hex: '#98FF98' },
  { name: 'Mustard Yellow', hex: '#FFDB58' },
  { name: 'Pure White', hex: '#FFFFFF' },
];

const WIZARD_STEPS = [
  { id: 1, title: 'Basic Details', icon: Info, desc: 'Name, category & description' },
  { id: 2, title: 'Color Variants & Images', icon: ImagePlus, desc: 'Per-color galleries & primary covers' },
  { id: 3, title: 'Sizes, Pricing & Stock', icon: Box, desc: 'Price & stock per color variant' },
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

const inputClass = "w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/10 transition-all bg-white";
const textareaClass = `${inputClass} resize-none`;
const selectClass = `${inputClass} cursor-pointer`;

export default function AddProductPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const duplicateId = searchParams.get('duplicate');
  const targetId = id || duplicateId;
  const isEditMode = Boolean(id);

  const { products, addProduct, editProduct, getProductById } = useProducts();

  const [viewMode, setViewMode] = useState('wizard'); // 'wizard' | 'single'
  const [currentStep, setCurrentStep] = useState(1);
  const [showSamplePickerForColor, setShowSamplePickerForColor] = useState(null); // color index
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdProductId, setCreatedProductId] = useState('');
  const [previewTab, setPreviewTab] = useState('card'); // 'card' | 'page'
  const [previewColorIdx, setPreviewColorIdx] = useState(0);
  const [imageUrlInput, setImageUrlInput] = useState('');

  // Initial unique ID
  const initialNewId = useMemo(() => `PRD-${Math.floor(1000 + Math.random() * 9000)}`, []);

  // Form State
  const [form, setForm] = useState({
    id: initialNewId,
    name: '',
    tagline: '',
    slug: '',
    description: '',
    shortDescription: '',
    category: 'Sarees',
    subcategory: 'Organza Sarees',
    brand: 'Suka Fashions',
    sku: 'SUK-SAR-001',
    status: 'ACTIVE',
    fabric: 'Pure Organza',
    occasion: 'Festive / Wedding',
    work: 'Hand Embroidered Zari',
    pattern: 'Floral Motifs',
    fit: 'Graceful Drape',
    sleeve: 'Unstitched Blouse Piece Included',
    careInstructions: 'Dry clean only',
    countryOfOrigin: 'India',
    badge: 'new',
    isNew: true,
    isBestSeller: false,
    featured: true,
    isTrending: false,
    allowCOD: true,
    returnable: true,
  });

  // Color Variants State: Each color contains its own images and size variants
  const [colors, setColors] = useState([
    {
      id: 'CLR-TEAL',
      name: 'Teal',
      hex: '#006B70',
      images: [
        { id: 'IMG-1', url: sareeGolden, isPrimary: true, alt: 'Teal front view' },
        { id: 'IMG-2', url: sareeBeigeMaroon, isPrimary: false, alt: 'Teal pallu detail' },
      ],
      variants: [
        { size: 'Free Size', sellingPrice: '3499', mrp: '4999', stock: '10', sku: 'SUK-SAR-001-TEAL-FS' },
      ],
    },
  ]);

  const [customBadges, setCustomBadges] = useState([]);

  // Load existing product if editing or duplicating
  useEffect(() => {
    if (targetId) {
      const existing = (getProductById && getProductById(targetId)) || products.find(p => p.id === targetId || p.slug === targetId);
      if (existing) {
        setForm({
          id: duplicateId ? `PRD-${Math.floor(1000 + Math.random() * 9000)}` : existing.id,
          name: duplicateId ? `${existing.name} (Copy)` : existing.name,
          tagline: existing.tagline || existing.shortDescription || '',
          slug: duplicateId ? `${existing.slug}-copy` : existing.slug,
          description: existing.description || '',
          shortDescription: existing.shortDescription || '',
          category: existing.category || 'Sarees',
          subcategory: existing.subcategory || '',
          brand: existing.brand || 'Suka Fashions',
          sku: duplicateId ? `${existing.sku || 'SUK'}-COPY` : (existing.sku || existing.id),
          status: existing.status || 'ACTIVE',
          fabric: existing.attributes?.fabric || existing.fabric || '',
          occasion: existing.attributes?.occasion || existing.occasion || '',
          work: existing.attributes?.work || existing.work || '',
          pattern: existing.attributes?.pattern || existing.pattern || '',
          fit: existing.attributes?.fit || existing.fit || '',
          sleeve: existing.attributes?.sleeve || existing.sleeve || '',
          careInstructions: existing.attributes?.careInstructions || existing.careInstructions || 'Dry clean only',
          countryOfOrigin: existing.attributes?.countryOfOrigin || 'India',
          badge: existing.isNew ? 'new' : existing.isBestSeller ? 'bestSeller' : existing.featured ? 'featured' : 'standard',
          isNew: existing.isNew ?? true,
          isBestSeller: existing.isBestSeller ?? false,
          featured: existing.featured ?? true,
          isTrending: existing.isTrending ?? false,
          allowCOD: true,
          returnable: true,
        });

        if (existing.colors && existing.colors.length > 0) {
          setColors(existing.colors.map((c, cIdx) => ({
            id: c.id || `CLR-${cIdx + 1}`,
            name: c.name || `Color ${cIdx + 1}`,
            hex: c.hex || '#006B70',
            images: (c.images && c.images.length > 0)
              ? c.images.map((img, iIdx) => ({
                  id: img.id || `IMG-${cIdx}-${iIdx}`,
                  url: img.url || img,
                  isPrimary: Boolean(img.isPrimary || iIdx === 0),
                  alt: img.alt || `${c.name || 'Product'} view`,
                }))
              : [{ id: `IMG-${cIdx}-0`, url: existing.image || sareeGolden, isPrimary: true, alt: 'Primary view' }],
            variants: (c.variants && c.variants.length > 0)
              ? c.variants.map(v => ({
                  size: v.size || 'Free Size',
                  sellingPrice: v.sellingPrice ? v.sellingPrice.toString() : (existing.price ? existing.price.toString() : '2999'),
                  mrp: v.mrp ? v.mrp.toString() : (existing.mrp ? existing.mrp.toString() : '3999'),
                  stock: v.stock !== undefined ? v.stock.toString() : '10',
                  sku: v.sku || `${existing.id}-${c.name || 'CLR'}-${v.size}`,
                }))
              : [{ size: 'Free Size', sellingPrice: (existing.price || 2999).toString(), mrp: (existing.mrp || 3999).toString(), stock: '10', sku: `${existing.id}-FS` }],
          })));
        }
      }
    }
  }, [targetId, duplicateId, products, getProductById]);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  // Color Variant Management Functions
  const addColorVariant = () => {
    const newIdx = colors.length;
    const preset = COLOR_PRESETS[newIdx % COLOR_PRESETS.length];
    const prevColor = colors[newIdx - 1];

    const newColor = {
      id: `CLR-${Date.now()}-${newIdx}`,
      name: preset.name,
      hex: preset.hex,
      images: [
        { id: `IMG-${Date.now()}-1`, url: SAMPLE_IMAGES[newIdx % SAMPLE_IMAGES.length].url, isPrimary: true, alt: `${preset.name} front view` }
      ],
      variants: prevColor
        ? prevColor.variants.map(v => ({ ...v, sku: `${form.sku || 'SUK'}-${preset.name.toUpperCase()}-${v.size}` }))
        : [{ size: 'Free Size', sellingPrice: '3499', mrp: '4999', stock: '10', sku: `${form.sku || 'SUK'}-${preset.name.toUpperCase()}-FS` }],
    };

    setColors(prev => [...prev, newColor]);
    setPreviewColorIdx(colors.length);
  };

  const removeColorVariant = (colorIdx) => {
    if (colors.length <= 1) return;
    setColors(prev => prev.filter((_, idx) => idx !== colorIdx));
    if (previewColorIdx >= colors.length - 1) {
      setPreviewColorIdx(Math.max(0, colors.length - 2));
    }
  };

  const updateColorField = (colorIdx, key, val) => {
    setColors(prev => prev.map((c, idx) => idx === colorIdx ? { ...c, [key]: val } : c));
  };

  // Image Management per Color
  const addImageToColor = (colorIdx, imgObj) => {
    setColors(prev => prev.map((c, idx) => {
      if (idx !== colorIdx) return c;
      const isFirst = c.images.length === 0;
      return {
        ...c,
        images: [...c.images, { ...imgObj, isPrimary: isFirst || Boolean(imgObj.isPrimary) }],
      };
    }));
  };

  const removeImageFromColor = (colorIdx, imgIdx) => {
    setColors(prev => prev.map((c, idx) => {
      if (idx !== colorIdx) return c;
      const filtered = c.images.filter((_, i) => i !== imgIdx);
      // Ensure at least one image is primary if images exist
      if (filtered.length > 0 && !filtered.some(img => img.isPrimary)) {
        filtered[0].isPrimary = true;
      }
      return { ...c, images: filtered };
    }));
  };

  const setColorPrimaryImage = (colorIdx, imgIdx) => {
    setColors(prev => prev.map((c, idx) => {
      if (idx !== colorIdx) return c;
      return {
        ...c,
        images: c.images.map((img, i) => ({ ...img, isPrimary: i === imgIdx })),
      };
    }));
  };

  const handleFileUploadForColor = (colorIdx, e) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file, i) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        addImageToColor(colorIdx, {
          id: `IMG-${Date.now()}-${i}`,
          url: reader.result,
          isPrimary: false,
          alt: file.name,
        });
      };
      reader.readAsDataURL(file);
    });
  };

  // Size / Stock Matrix per Color
  const addSizeToColor = (colorIdx, sizeName = '') => {
    setColors(prev => prev.map((c, idx) => {
      if (idx !== colorIdx) return c;
      const prevVariant = c.variants[c.variants.length - 1];
      return {
        ...c,
        variants: [
          ...c.variants,
          {
            size: sizeName || '',
            sellingPrice: prevVariant?.sellingPrice || '3499',
            mrp: prevVariant?.mrp || '4999',
            stock: '10',
            sku: `${form.sku || 'SUK'}-${c.name.toUpperCase()}-${sizeName || 'SZ'}`,
          },
        ],
      };
    }));
  };

  const removeSizeFromColor = (colorIdx, sizeIdx) => {
    setColors(prev => prev.map((c, idx) => {
      if (idx !== colorIdx) return c;
      if (c.variants.length <= 1) return c;
      return {
        ...c,
        variants: c.variants.filter((_, i) => i !== sizeIdx),
      };
    }));
  };

  const updateColorVariantField = (colorIdx, sizeIdx, key, val) => {
    setColors(prev => prev.map((c, idx) => {
      if (idx !== colorIdx) return c;
      return {
        ...c,
        variants: c.variants.map((v, i) => i === sizeIdx ? { ...v, [key]: val } : v),
      };
    }));
  };

  const applyPriceToAllSizes = (colorIdx, sellingPrice, mrp) => {
    setColors(prev => prev.map((c, idx) => {
      if (idx !== colorIdx) return c;
      return {
        ...c,
        variants: c.variants.map(v => ({ ...v, sellingPrice, mrp })),
      };
    }));
  };

  const copyPricingAndSizesFromPrevious = (colorIdx) => {
    if (colorIdx <= 0) return;
    const prevColor = colors[colorIdx - 1];
    setColors(prev => prev.map((c, idx) => {
      if (idx !== colorIdx) return c;
      return {
        ...c,
        variants: prevColor.variants.map(v => ({
          ...v,
          sku: `${form.sku || 'SUK'}-${c.name.toUpperCase()}-${v.size}`,
        })),
      };
    }));
  };

  const bulkSetStockForColor = (colorIdx, stockQty) => {
    setColors(prev => prev.map((c, idx) => {
      if (idx !== colorIdx) return c;
      return {
        ...c,
        variants: c.variants.map(v => ({ ...v, stock: stockQty.toString() })),
      };
    }));
  };

  // Badge Management
  const handleBadgeSelect = (badgeId) => {
    setForm(f => ({
      ...f,
      badge: badgeId,
      isNew: badgeId === 'new',
      isBestSeller: badgeId === 'bestSeller',
      featured: badgeId === 'featured',
      isTrending: badgeId === 'trending',
    }));
  };

  // Live Preview Calculations
  const activePreviewColor = colors[previewColorIdx] || colors[0] || {};
  const activePreviewPrimaryImage = activePreviewColor.images?.find(img => img.isPrimary)?.url || activePreviewColor.images?.[0]?.url || sareeGolden;
  const previewStartingPrice = activePreviewColor.variants?.[0]?.sellingPrice || '3499';
  const previewMrp = activePreviewColor.variants?.[0]?.mrp || '4999';
  const previewDiscount = parseFloat(previewMrp) > parseFloat(previewStartingPrice)
    ? Math.round(((parseFloat(previewMrp) - parseFloat(previewStartingPrice)) / parseFloat(previewMrp)) * 100)
    : 0;

  const totalCatalogStock = useMemo(() => {
    return colors.reduce((total, c) => total + c.variants.reduce((cTotal, v) => cTotal + (Number(v.stock) || 0), 0), 0);
  }, [colors]);

  // Form Submit / Publish
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    if (!form.name.trim()) {
      alert('Please enter a Product Name before publishing.');
      setCurrentStep(1);
      return;
    }

    if (colors.length === 0) {
      alert('Please configure at least one color variant.');
      setCurrentStep(2);
      return;
    }

    // Build payload
    const slug = form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const cleanColors = colors.map((c, cIdx) => ({
      id: c.id || `CLR-${cIdx + 1}`,
      name: c.name || `Color ${cIdx + 1}`,
      hex: c.hex || '#006B70',
      images: c.images.length > 0 ? c.images : [{ id: `IMG-${cIdx}-1`, url: sareeGolden, isPrimary: true, alt: `${c.name} view` }],
      variants: c.variants.map((v, vIdx) => ({
        size: v.size || 'Free Size',
        sellingPrice: Number(v.sellingPrice) || 2999,
        mrp: Number(v.mrp) || 3999,
        stock: Number(v.stock) || 0,
        sku: v.sku || `${form.sku || 'SUK'}-${c.name}-${v.size || vIdx}`,
      })),
    }));

    const primaryColorImg = cleanColors[0]?.images?.find(i => i.isPrimary)?.url || cleanColors[0]?.images?.[0]?.url || sareeGolden;
    const startPrice = Number(cleanColors[0]?.variants?.[0]?.sellingPrice) || 2999;
    const startMrp = Number(cleanColors[0]?.variants?.[0]?.mrp) || 3999;

    const payload = {
      ...form,
      slug,
      price: startPrice,
      mrp: startMrp,
      stock: totalCatalogStock,
      image: primaryColorImg,
      colors: cleanColors,
      attributes: {
        fabric: form.fabric,
        occasion: form.occasion,
        work: form.work,
        pattern: form.pattern,
        fit: form.fit,
        sleeve: form.sleeve,
        careInstructions: form.careInstructions,
        countryOfOrigin: form.countryOfOrigin,
      },
    };

    try {
      if (isEditMode) {
        await editProduct(targetId, payload);
      } else {
        await addProduct(payload);
      }
      setCreatedProductId(slug || form.id);
      setShowSuccessModal(true);
    } catch (err) {
      console.error('Failed to save product:', err);
      alert('Error saving product: ' + err.message);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-brand-powder text-brand-teal p-1.5 rounded-lg">
                <Sparkles size={18} />
              </span>
              <h1 className="font-sans text-xl font-bold text-slate-800">
                {isEditMode ? 'Edit Product Catalog' : 'Add New Product'}
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Configure per-color variant image galleries, sizes, pricing, and stock matrices in real-time.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Wizard vs Single Page Mode Toggle */}
            <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setViewMode('wizard')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  viewMode === 'wizard' ? 'bg-white text-brand-teal shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Step Wizard
              </button>
              <button
                type="button"
                onClick={() => setViewMode('single')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  viewMode === 'single' ? 'bg-white text-brand-teal shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Single Page
              </button>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              className="px-4 py-2 bg-brand-teal hover:bg-brand-tealDark text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Save size={14} /> {isEditMode ? 'Save Changes' : 'Publish Product'}
            </button>
          </div>
        </div>

        {/* Wizard Step Tabs */}
        {viewMode === 'wizard' && (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-5 pt-4 border-t border-slate-100">
            {WIZARD_STEPS.map((step) => {
              const StepIcon = step.icon;
              const isActive = currentStep === step.id;
              const isPast = currentStep > step.id;
              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => setCurrentStep(step.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
                    isActive
                      ? 'border-brand-teal bg-brand-powder/20 shadow-xs'
                      : isPast
                      ? 'border-emerald-200 bg-emerald-50/50'
                      : 'border-slate-100 bg-slate-50 hover:bg-white'
                  }`}
                >
                  <div className={`p-1.5 rounded-lg ${
                    isActive ? 'bg-brand-teal text-white' : isPast ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {isPast ? <Check size={14} /> : <StepIcon size={14} />}
                  </div>
                  <div className="min-w-0">
                    <p className={`text-xs font-bold truncate ${isActive ? 'text-brand-teal' : isPast ? 'text-emerald-700' : 'text-slate-700'}`}>
                      {step.title}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">{step.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Main Grid: 2 Columns on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left 2 Columns: Forms & Color Variant Cards */}
        <div className="lg:col-span-2 space-y-6">

          {/* STEP 1: BASIC DETAILS */}
          {(viewMode === 'single' || currentStep === 1) && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-brand-powder text-brand-teal rounded-lg"><Info size={16} /></span>
                  <h2 className="font-sans font-bold text-slate-800 text-sm">1. Basic Product Details</h2>
                </div>
                <span className="text-[11px] font-mono text-slate-400 font-bold">ID: #{form.id}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Product Title" required hint="The primary name displayed on cards and search.">
                  <input
                    type="text"
                    className={inputClass}
                    placeholder="e.g. Teal Embroidered Organza Saree"
                    value={form.name}
                    onChange={e => {
                      set('name', e.target.value);
                      if (!isEditMode) {
                        set('slug', e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
                      }
                    }}
                  />
                </FormField>

                <FormField label="Tagline / Short Subtitle" hint="Displayed under product title for luxury flair.">
                  <input
                    type="text"
                    className={inputClass}
                    placeholder="e.g. Handcrafted Zari & Scalloped Borders"
                    value={form.tagline}
                    onChange={e => set('tagline', e.target.value)}
                  />
                </FormField>

                <FormField label="Category" required>
                  <select
                    className={selectClass}
                    value={form.category}
                    onChange={e => {
                      const newCat = e.target.value;
                      set('category', newCat);
                      if (SUBCATEGORIES[newCat] && SUBCATEGORIES[newCat][0]) {
                        set('subcategory', SUBCATEGORIES[newCat][0]);
                      }
                    }}
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </FormField>

                <FormField label="Subcategory">
                  <select
                    className={selectClass}
                    value={form.subcategory}
                    onChange={e => set('subcategory', e.target.value)}
                  >
                    {(SUBCATEGORIES[form.category] || []).map(sc => <option key={sc} value={sc}>{sc}</option>)}
                  </select>
                </FormField>

                <FormField label="Base SKU Code" hint="Identifier prefix used for variant inventory tracking.">
                  <input
                    type="text"
                    className={inputClass}
                    placeholder="e.g. SUK-SAR-001"
                    value={form.sku}
                    onChange={e => set('sku', e.target.value)}
                  />
                </FormField>

                <FormField label="URL Slug" hint="Storefront link: /product/:slug">
                  <input
                    type="text"
                    className={inputClass}
                    placeholder="e.g. teal-embroidered-organza-saree"
                    value={form.slug}
                    onChange={e => set('slug', e.target.value)}
                  />
                </FormField>
              </div>

              <FormField label="Detailed Product Description">
                <textarea
                  rows={4}
                  className={textareaClass}
                  placeholder="Describe the fabric weave, craftsmanship, styling advice, and package inclusions..."
                  value={form.description}
                  onChange={e => set('description', e.target.value)}
                />
              </FormField>
            </div>
          )}

          {/* STEP 2: COLOR VARIANTS & IMAGE GALLERIES */}
          {(viewMode === 'single' || currentStep === 2) && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-brand-powder text-brand-teal rounded-lg"><ImagePlus size={16} /></span>
                  <div>
                    <h2 className="font-sans font-bold text-slate-800 text-sm">2. Color Variants & Dedicated Image Galleries</h2>
                    <p className="text-[11px] text-slate-400">Each color variant holds its own photo gallery with a designated Primary Cover.</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={addColorVariant}
                  className="px-3 py-1.5 bg-brand-teal text-white text-xs font-bold rounded-xl shadow-xs hover:bg-brand-tealDark transition-all flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
                >
                  <Plus size={14} /> Add Color Variant
                </button>
              </div>

              {/* Color Variant Cards List */}
              <div className="space-y-6">
                {colors.map((color, colorIdx) => (
                  <div
                    key={color.id || colorIdx}
                    className={`rounded-2xl border p-5 transition-all space-y-4 ${
                      previewColorIdx === colorIdx ? 'border-brand-teal/80 ring-2 ring-brand-teal/15 bg-slate-50/40' : 'border-slate-200 bg-white'
                    }`}
                  >
                    {/* Color Header Row */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-3 flex-1 min-w-[240px]">
                        <div className="relative flex items-center">
                          <input
                            type="color"
                            value={color.hex}
                            onChange={e => updateColorField(colorIdx, 'hex', e.target.value)}
                            className="w-9 h-9 rounded-full cursor-pointer border border-slate-300 shadow-xs p-0 overflow-hidden"
                            title="Pick swatch color"
                          />
                        </div>

                        <div className="flex-1">
                          <input
                            type="text"
                            value={color.name}
                            onChange={e => updateColorField(colorIdx, 'name', e.target.value)}
                            placeholder="Color Name (e.g. Teal, Blush Pink, Gold Zari)"
                            className="text-sm font-bold text-slate-800 border-b border-slate-200 focus:border-brand-teal focus:outline-none w-full py-1 bg-transparent"
                          />
                        </div>
                      </div>

                      {/* Quick Color Presets & Actions */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                          {COLOR_PRESETS.slice(0, 6).map((preset) => (
                            <button
                              key={preset.name}
                              type="button"
                              onClick={() => {
                                updateColorField(colorIdx, 'name', preset.name);
                                updateColorField(colorIdx, 'hex', preset.hex);
                              }}
                              className="w-4 h-4 rounded-full border border-slate-300 shadow-2xs hover:scale-110 transition-transform cursor-pointer"
                              style={{ backgroundColor: preset.hex }}
                              title={`Set to ${preset.name}`}
                            />
                          ))}
                        </div>

                        <button
                          type="button"
                          onClick={() => setPreviewColorIdx(colorIdx)}
                          className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                            previewColorIdx === colorIdx
                              ? 'bg-brand-teal text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          <Eye size={12} /> Preview
                        </button>

                        {colors.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeColorVariant(colorIdx)}
                            className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                            title="Remove Color Variant"
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Image Gallery Section for this Color */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                          <span>Gallery Photos for <strong>"{color.name}"</strong></span>
                          <span className="text-[10px] text-slate-400 font-normal">({color.images.length} images)</span>
                        </label>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setShowSamplePickerForColor(showSamplePickerForColor === colorIdx ? null : colorIdx)}
                            className="text-[11px] font-bold text-brand-teal hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <Layers size={12} /> Choose from Library
                          </button>
                        </div>
                      </div>

                      {/* Sample Library Picker Dropdown for this Color */}
                      {showSamplePickerForColor === colorIdx && (
                        <div className="bg-slate-50 border border-brand-teal/30 rounded-xl p-3 space-y-2 animate-in fade-in-50">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-slate-700">Select sample luxury image:</span>
                            <button
                              type="button"
                              onClick={() => setShowSamplePickerForColor(null)}
                              className="text-slate-400 hover:text-slate-700"
                            >
                              <X size={14} />
                            </button>
                          </div>
                          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                            {SAMPLE_IMAGES.map((sample, sIdx) => (
                              <div
                                key={sIdx}
                                onClick={() => {
                                  addImageToColor(colorIdx, {
                                    id: `IMG-${Date.now()}-${sIdx}`,
                                    url: sample.url,
                                    isPrimary: color.images.length === 0,
                                    alt: `${color.name} ${sample.name}`,
                                  });
                                  setShowSamplePickerForColor(null);
                                }}
                                className="aspect-[3/4] rounded-lg overflow-hidden border border-slate-200 hover:border-brand-teal cursor-pointer group relative"
                              >
                                <img src={sample.url} alt={sample.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                                  <Plus size={14} />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Image Tiles Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                        {color.images.map((img, imgIdx) => (
                          <div
                            key={img.id || imgIdx}
                            className={`relative aspect-[3/4] rounded-xl overflow-hidden border bg-slate-50 group transition-all ${
                              img.isPrimary ? 'ring-2 ring-brand-teal border-brand-teal shadow-xs' : 'border-slate-200'
                            }`}
                          >
                            <img src={img.url} alt={img.alt || 'Variant'} className="w-full h-full object-cover" />

                            {/* PRIMARY BADGE */}
                            {img.isPrimary ? (
                              <span className="absolute top-1.5 left-1.5 bg-brand-teal text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded shadow-xs tracking-wider">
                                PRIMARY
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setColorPrimaryImage(colorIdx, imgIdx)}
                                className="absolute top-1.5 left-1.5 bg-black/60 hover:bg-brand-teal text-white text-[8px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                              >
                                Set Primary
                              </button>
                            )}

                            {/* Remove Image Button */}
                            <button
                              type="button"
                              onClick={() => removeImageFromColor(colorIdx, imgIdx)}
                              className="absolute top-1.5 right-1.5 p-1 bg-red-600/80 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                              title="Delete photo"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}

                        {/* Upload Tile */}
                        <label className="aspect-[3/4] rounded-xl border-2 border-dashed border-slate-300 hover:border-brand-teal bg-slate-50/60 hover:bg-brand-powder/20 flex flex-col items-center justify-center p-3 text-center transition-all cursor-pointer">
                          <Upload size={20} className="text-slate-400 group-hover:text-brand-teal mb-1" />
                          <span className="text-[10px] font-bold text-slate-600">Upload Photos</span>
                          <span className="text-[8px] text-slate-400">JPG, PNG, WebP</span>
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={e => handleFileUploadForColor(colorIdx, e)}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={addColorVariant}
                  className="w-full py-3.5 border-2 border-dashed border-brand-teal/40 hover:border-brand-teal bg-brand-powder/10 hover:bg-brand-powder/30 rounded-2xl font-bold text-brand-teal text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Plus size={16} /> + ADD ANOTHER COLOR VARIANT
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: SIZES, PRICING & STOCK MATRIX */}
          {(viewMode === 'single' || currentStep === 3) && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-brand-powder text-brand-teal rounded-lg"><Box size={16} /></span>
                  <div>
                    <h2 className="font-sans font-bold text-slate-800 text-sm">3. Size Variants, Pricing & Stock Matrix</h2>
                    <p className="text-[11px] text-slate-400">Manage individual selling price, MRP, and stock units for each color variant.</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Catalog Units</span>
                  <span className="font-mono text-sm font-bold text-brand-teal">{totalCatalogStock} Units</span>
                </div>
              </div>

              {/* Color-by-Color Size Matrix Tables */}
              <div className="space-y-6">
                {colors.map((color, colorIdx) => (
                  <div key={color.id || colorIdx} className="bg-slate-50/60 border border-slate-200 rounded-2xl p-5 space-y-4">
                    {/* Matrix Header for this Color */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
                      <div className="flex items-center gap-2.5">
                        <span className="w-4 h-4 rounded-full border border-slate-300 shadow-2xs" style={{ backgroundColor: color.hex }} />
                        <span className="font-bold text-sm text-slate-800">{color.name}</span>
                        <span className="text-xs text-slate-400 font-mono">({color.variants.length} sizes)</span>
                      </div>

                      {/* Convenience Quick Action Buttons */}
                      <div className="flex items-center gap-2 flex-wrap">
                        {colorIdx > 0 && (
                          <button
                            type="button"
                            onClick={() => copyPricingAndSizesFromPrevious(colorIdx)}
                            className="px-2.5 py-1 text-[10px] font-bold text-slate-600 bg-white border border-slate-200 hover:border-brand-teal rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                            title="Copy pricing & sizes from previous color"
                          >
                            <Copy size={11} /> Copy from Previous Color
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            const first = color.variants[0];
                            if (first) applyPriceToAllSizes(colorIdx, first.sellingPrice, first.mrp);
                          }}
                          className="px-2.5 py-1 text-[10px] font-bold text-brand-teal bg-white border border-slate-200 hover:border-brand-teal rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                        >
                          Apply Price to All Sizes
                        </button>
                      </div>
                    </div>

                    {/* Variant Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                            <th className="pb-2 w-36">Size</th>
                            <th className="pb-2 w-32">Selling Price (₹)</th>
                            <th className="pb-2 w-32">MRP (₹)</th>
                            <th className="pb-2 w-28">Stock Units</th>
                            <th className="pb-2">SKU Code</th>
                            <th className="pb-2 text-right w-12">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {color.variants.map((variant, sizeIdx) => (
                            <tr key={sizeIdx} className="hover:bg-white/80 transition-colors">
                              <td className="py-2 pr-3">
                                <input
                                  type="text"
                                  value={variant.size}
                                  onChange={e => updateColorVariantField(colorIdx, sizeIdx, 'size', e.target.value)}
                                  placeholder="e.g. S, M, Free Size"
                                  className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800 focus:border-brand-teal focus:outline-none"
                                />
                              </td>
                              <td className="py-2 pr-3">
                                <input
                                  type="number"
                                  value={variant.sellingPrice}
                                  onChange={e => updateColorVariantField(colorIdx, sizeIdx, 'sellingPrice', e.target.value)}
                                  placeholder="3499"
                                  className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-brand-teal focus:border-brand-teal focus:outline-none font-mono"
                                />
                              </td>
                              <td className="py-2 pr-3">
                                <input
                                  type="number"
                                  value={variant.mrp}
                                  onChange={e => updateColorVariantField(colorIdx, sizeIdx, 'mrp', e.target.value)}
                                  placeholder="4999"
                                  className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-500 focus:border-brand-teal focus:outline-none font-mono"
                                />
                              </td>
                              <td className="py-2 pr-3">
                                <input
                                  type="number"
                                  value={variant.stock}
                                  onChange={e => updateColorVariantField(colorIdx, sizeIdx, 'stock', e.target.value)}
                                  placeholder="10"
                                  className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800 focus:border-brand-teal focus:outline-none font-mono"
                                />
                              </td>
                              <td className="py-2 pr-3">
                                <input
                                  type="text"
                                  value={variant.sku}
                                  onChange={e => updateColorVariantField(colorIdx, sizeIdx, 'sku', e.target.value)}
                                  placeholder="SKU-001"
                                  className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-[11px] font-mono text-slate-600 focus:border-brand-teal focus:outline-none"
                                />
                              </td>
                              <td className="py-2 text-right">
                                {color.variants.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => removeSizeFromColor(colorIdx, sizeIdx)}
                                    className="text-slate-400 hover:text-red-500 p-1 cursor-pointer"
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

                    {/* Add Size Row */}
                    <div className="flex items-center gap-2 pt-1 flex-wrap">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Quick Add Size:</span>
                      {COMMON_SIZES.map((sz) => (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => addSizeToColor(colorIdx, sz)}
                          className="px-2 py-1 text-[10px] font-bold bg-white border border-slate-200 hover:border-brand-teal hover:text-brand-teal rounded-md transition-all cursor-pointer"
                        >
                          + {sz}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: ATTRIBUTES & BADGES */}
          {(viewMode === 'single' || currentStep === 4) && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-brand-powder text-brand-teal rounded-lg"><Sliders size={16} /></span>
                  <h2 className="font-sans font-bold text-slate-800 text-sm">4. Material Attributes & Badges</h2>
                </div>
              </div>

              {/* Badges Selector */}
              <div>
                <p className="text-xs font-bold text-slate-700 mb-2">Merchandising Badge</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { id: 'new', label: 'New Arrival', color: 'bg-brand-teal' },
                    { id: 'bestSeller', label: 'Bestseller', color: 'bg-amber-600' },
                    { id: 'featured', label: 'Featured', color: 'bg-purple-600' },
                    { id: 'trending', label: 'Trending', color: 'bg-rose-600' },
                  ].map((b) => {
                    const isSelected = form.badge === b.id;
                    return (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => handleBadgeSelect(b.id)}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected ? 'border-brand-teal bg-brand-powder/20 ring-2 ring-brand-teal/15 font-bold text-brand-teal' : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <span className={`${b.color} text-white text-[8px] font-bold px-2 py-0.5 rounded shadow-2xs uppercase block w-fit mb-1`}>
                          {b.label}
                        </span>
                        <span className="text-xs text-slate-800">{b.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Material & Occasion Attributes */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <FormField label="Fabric Material">
                  <select className={selectClass} value={form.fabric} onChange={e => set('fabric', e.target.value)}>
                    {FABRICS.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </FormField>

                <FormField label="Occasion">
                  <select className={selectClass} value={form.occasion} onChange={e => set('occasion', e.target.value)}>
                    {OCCASIONS.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </FormField>

                <FormField label="Work / Craft">
                  <input
                    type="text"
                    className={inputClass}
                    placeholder="e.g. Zari Embroidery & Mirror Work"
                    value={form.work}
                    onChange={e => set('work', e.target.value)}
                  />
                </FormField>
              </div>
            </div>
          )}

          {/* STEP 5: REVIEW & PUBLISH */}
          {(viewMode === 'single' || currentStep === 5) && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-brand-powder text-brand-teal rounded-lg"><CheckCircle2 size={16} /></span>
                  <h2 className="font-sans font-bold text-slate-800 text-sm">5. Review & Catalog Summary</h2>
                </div>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-xl flex items-center gap-1 shadow-2xs">
                  <Check size={13} /> Ready to Publish
                </span>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Product Title</span>
                  <span className="font-bold text-slate-800 text-sm block mt-0.5">{form.name || 'Untitled'}</span>
                  <span className="text-[11px] text-brand-teal font-semibold block">{form.category} • {form.subcategory}</span>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Starting Price & Discount</span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="font-mono text-base font-bold text-brand-navy">₹{parseInt(previewStartingPrice).toLocaleString('en-IN')}</span>
                    <span className="font-mono text-xs text-slate-400 line-through">₹{parseInt(previewMrp).toLocaleString('en-IN')}</span>
                  </div>
                  {previewDiscount > 0 && <span className="text-[10px] font-bold text-emerald-700">{previewDiscount}% OFF</span>}
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Inventory</span>
                  <span className="font-mono text-base font-bold text-slate-800 block mt-0.5">{totalCatalogStock} Units</span>
                  <span className="text-[11px] text-slate-500">{colors.length} Color Variant{colors.length > 1 ? 's' : ''}</span>
                </div>
              </div>

              {/* Color Variants Breakdown */}
              <div className="space-y-3">
                <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Color Galleries & Stock Breakdown</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {colors.map((c, i) => (
                    <div key={i} className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex gap-3 items-center">
                      <div className="w-14 aspect-[3/4] bg-white rounded-lg overflow-hidden border border-slate-200 flex-shrink-0">
                        <img
                          src={c.images.find(img => img.isPrimary)?.url || c.images[0]?.url || sareeGolden}
                          alt={c.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="w-3 h-3 rounded-full border border-slate-300" style={{ backgroundColor: c.hex }} />
                          <span className="font-bold text-xs text-slate-800 truncate">{c.name}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1">{c.images.length} photos • {c.variants.reduce((sum, v) => sum + (Number(v.stock) || 0), 0)} units</p>
                        <p className="text-[10px] text-brand-teal font-mono font-semibold">Sizes: {c.variants.map(v => v.size).join(', ')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Action Footer for Step 5 */}
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
                  <Send size={14} /> {isEditMode ? 'Save & Update Storefront' : 'Publish Product to Storefront'}
                </button>
              </div>
            </div>
          )}

          {/* Stepper Navigation Buttons */}
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
            {/* Live Customer Preview Card */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 overflow-hidden">
              <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-slate-800">Live Customer Preview</span>
                </div>
                <div className="flex gap-1 bg-slate-100 p-0.5 rounded-lg text-[10px] font-bold">
                  <button
                    type="button"
                    onClick={() => setPreviewTab('card')}
                    className={`px-2 py-1 rounded-md transition-all ${
                      previewTab === 'card' ? 'bg-white text-brand-teal shadow-xs' : 'text-slate-500'
                    }`}
                  >
                    Card View
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewTab('page')}
                    className={`px-2 py-1 rounded-md transition-all ${
                      previewTab === 'page' ? 'bg-white text-brand-teal shadow-xs' : 'text-slate-500'
                    }`}
                  >
                    Detail View
                  </button>
                </div>
              </div>

              {/* Color Switcher within Live Preview */}
              {colors.length > 1 && (
                <div className="mb-3 p-2 bg-slate-50 rounded-xl flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Preview Color:</span>
                  <div className="flex items-center gap-1.5">
                    {colors.map((c, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setPreviewColorIdx(i)}
                        className={`w-5 h-5 rounded-full border transition-all cursor-pointer ${
                          previewColorIdx === i ? 'ring-2 ring-brand-teal scale-110' : 'border-slate-300'
                        }`}
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* CARD PREVIEW MODE */}
              {previewTab === 'card' ? (
                <div className="bg-white border border-brand-powder/60 rounded-xl overflow-hidden shadow-md max-w-xs mx-auto group text-left">
                  {/* Image Box */}
                  <div className="relative aspect-[3/4] bg-slate-100 overflow-hidden">
                    <img
                      src={activePreviewPrimaryImage}
                      alt="Preview"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Badge */}
                    {form.isNew && (
                      <span className="absolute top-2 left-2 bg-brand-teal text-white text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded shadow-xs">
                        NEW
                      </span>
                    )}
                    {!form.isNew && form.isBestSeller && (
                      <span className="absolute top-2 left-2 bg-amber-600 text-white text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded shadow-xs">
                        BESTSELLER
                      </span>
                    )}

                    {previewDiscount > 0 && (
                      <span className="absolute top-2 right-2 bg-red-600 text-white text-[8.5px] font-bold px-1.5 py-0.5 rounded shadow-xs">
                        {previewDiscount}% OFF
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-3.5 space-y-1">
                    <p className="text-[9px] font-bold text-brand-teal uppercase tracking-widest">
                      SUKA FASHIONS • {form.category?.toUpperCase()}
                    </p>

                    <h4 className="font-serif text-xs font-bold text-brand-navy truncate">
                      {form.name || 'Untitled Product'}
                    </h4>

                    {form.tagline && (
                      <p className="text-[10px] text-slate-500 italic truncate font-sans">
                        {form.tagline}
                      </p>
                    )}

                    {/* Color dots */}
                    {colors.length > 0 && (
                      <div className="flex items-center gap-1.5 pt-1">
                        {colors.map((c, i) => (
                          <span
                            key={i}
                            className={`w-2.5 h-2.5 rounded-full border ${
                              previewColorIdx === i ? 'ring-1 ring-brand-teal scale-110' : 'border-slate-300'
                            }`}
                            style={{ backgroundColor: c.hex }}
                            title={c.name}
                          />
                        ))}
                      </div>
                    )}

                    <div className="flex items-baseline gap-2 pt-1.5">
                      <span className="font-sans text-sm font-bold text-brand-navy font-mono">
                        ₹{parseInt(previewStartingPrice).toLocaleString('en-IN')}
                      </span>
                      {parseFloat(previewMrp) > parseFloat(previewStartingPrice) && (
                        <span className="font-sans text-xs text-brand-navy/40 line-through font-mono">
                          ₹{parseInt(previewMrp).toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                /* DETAIL PAGE PREVIEW MODE */
                <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 text-xs text-left">
                  <div className="flex gap-3">
                    <div className="w-20 h-24 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={activePreviewPrimaryImage} className="w-full h-full object-cover" />
                    </div>
                    <div className="space-y-1 min-w-0 flex-1">
                      <p className="text-[9px] font-bold text-brand-teal uppercase tracking-wider">{form.category}</p>
                      <h4 className="font-bold text-slate-800 leading-tight truncate">{form.name || 'Product Title'}</h4>
                      <p className="text-[10px] text-slate-500 italic truncate">{form.tagline || form.description?.slice(0, 50)}</p>
                      <div className="flex items-center gap-2 pt-1 font-mono">
                        <span className="font-bold text-brand-navy">₹{parseInt(previewStartingPrice).toLocaleString('en-IN')}</span>
                        <span className="text-slate-400 line-through text-[10px]">₹{parseInt(previewMrp).toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Active Color & Gallery Thumbnails */}
                  <div className="border-t border-slate-100 pt-2 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-600">Color: {activePreviewColor.name}</span>
                      <span className="text-[10px] text-slate-400">{activePreviewColor.images?.length || 1} images</span>
                    </div>

                    <div className="flex gap-1.5 overflow-x-auto pb-1">
                      {(activePreviewColor.images || []).map((img, i) => (
                        <div key={i} className="w-10 h-12 rounded border border-slate-200 overflow-hidden flex-shrink-0">
                          <img src={img.url} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-2 space-y-1 text-[11px]">
                    <p><span className="font-bold text-slate-700">Fabric:</span> {form.fabric || '—'}</p>
                    <p><span className="font-bold text-slate-700">Occasion:</span> {form.occasion || '—'}</p>
                    <p><span className="font-bold text-slate-700">Total Stock:</span> {totalCatalogStock} Units</p>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Action Box */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-2.5">
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full py-3 bg-brand-teal hover:bg-brand-tealDark text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send size={14} /> {isEditMode ? 'Update Product' : 'Publish Product to Store'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/admin/products')}
                className="w-full py-2.5 border border-slate-200 text-slate-600 text-xs font-semibold rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Save size={14} /> Back to Products
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
                "{form.name || 'New Product'}" is now active and synchronized across the admin catalog and customer storefront.
              </p>
            </div>
            <div className="space-y-2 pt-2">
              <Link
                to={`/product/${createdProductId || form.slug || form.id}`}
                target="_blank"
                className="w-full py-2.5 bg-brand-navy text-white text-xs font-bold rounded-xl shadow-xs hover:bg-black transition-all flex items-center justify-center gap-1.5"
              >
                <ExternalLink size={13} /> View on Live Store
              </Link>
              <button
                onClick={() => navigate('/admin/products')}
                className="w-full py-2.5 bg-brand-teal text-white text-xs font-bold rounded-xl shadow-xs hover:bg-brand-tealDark transition-all cursor-pointer"
              >
                Go to Products Catalog
              </button>
              <button
                onClick={() => {
                  setShowSuccessModal(false);
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
