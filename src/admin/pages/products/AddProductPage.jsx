// AddProductPage — /admin/products/add
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Plus, X, Upload, Save, Eye, Send, ImagePlus } from 'lucide-react';
import AdminPageHeader from '../../components/ui/AdminPageHeader';

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
const COLORS_PRESETS = [
  { name: 'Teal', hex: '#006B70' },
  { name: 'Navy', hex: '#1E3A5F' },
  { name: 'Crimson', hex: '#DC143C' },
  { name: 'Gold', hex: '#D4AF37' },
  { name: 'Blush Pink', hex: '#F8C8DC' },
  { name: 'Ivory', hex: '#FFFFF0' },
  { name: 'Purple', hex: '#7B2FBE' },
  { name: 'Emerald', hex: '#10B981' },
];

function SectionCard({ title, subtitle, children, collapsible = false, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
      <button
        type="button"
        onClick={() => collapsible && setOpen(o => !o)}
        className={`w-full flex items-center justify-between px-5 py-4 border-b border-slate-100 ${collapsible ? 'cursor-pointer hover:bg-slate-50/50' : 'cursor-default'}`}
      >
        <div>
          <h3 className="font-sans font-bold text-slate-800 text-sm text-left">{title}</h3>
          {subtitle && <p className="text-xs text-slate-400 mt-0.5 text-left">{subtitle}</p>}
        </div>
        {collapsible && <ChevronDown size={16} className={`text-slate-400 transition-transform ${open ? '' : '-rotate-90'}`} />}
      </button>
      {open && <div className="p-5">{children}</div>}
    </div>
  );
}

function FormField({ label, required, children, hint }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-600 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {hint && <p className="text-[10px] text-slate-400 mt-1">{hint}</p>}
    </div>
  );
}

function Toggle({ checked, onChange, label }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <div
        onClick={() => onChange(!checked)}
        className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer flex-shrink-0 ${checked ? 'bg-brand-teal' : 'bg-slate-200'}`}
      >
        <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${checked ? 'translate-x-5' : 'translate-x-0.5'}`} />
      </div>
      <span className="text-sm text-slate-700 group-hover:text-slate-900">{label}</span>
    </label>
  );
}

const inputClass = "w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/10 transition-all";
const textareaClass = `${inputClass} resize-none`;
const selectClass = `${inputClass} bg-white`;

export default function AddProductPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    shortDescription: '',
    category: '',
    subcategory: '',
    brand: 'Suka Fashions',
    sku: '',
    sellingPrice: '',
    mrp: '',
    costPrice: '',
    gst: '5',
    fabric: '',
    occasion: '',
    work: '',
    pattern: '',
    fit: '',
    sleeve: '',
    neck: '',
    careInstructions: '',
    countryOfOrigin: 'India',
    metaTitle: '',
    metaDescription: '',
    isNew: true,
    isBestSeller: false,
    isFeatured: false,
    isTrending: false,
    showOnHomepage: false,
    allowCOD: true,
    returnable: true,
  });

  const [variants, setVariants] = useState([
    { color: 'Teal', colorHex: '#006B70', sizes: SIZES.slice(1, 5).map(s => ({ size: s, stock: '', sku: '' })) },
  ]);

  const [images, setImages] = useState([]);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const autoSlug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

  const discountPercent = form.mrp && form.sellingPrice
    ? Math.round(((form.mrp - form.sellingPrice) / form.mrp) * 100)
    : 0;

  const addVariant = () => {
    setVariants(v => [...v, {
      color: '',
      colorHex: '#006B70',
      sizes: SIZES.slice(1, 5).map(s => ({ size: s, stock: '', sku: '' })),
    }]);
  };

  const removeVariant = (i) => setVariants(v => v.filter((_, idx) => idx !== i));

  const updateVariant = (vi, key, val) => {
    setVariants(v => v.map((variant, i) => i === vi ? { ...variant, [key]: val } : variant));
  };

  const updateVariantSize = (vi, si, key, val) => {
    setVariants(v => v.map((variant, i) => i !== vi ? variant : {
      ...variant,
      sizes: variant.sizes.map((s, j) => j !== si ? s : { ...s, [key]: val }),
    }));
  };

  const handleImageDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer?.files || e.target?.files || []);
    const urls = files.map(f => ({ name: f.name, url: URL.createObjectURL(f), primary: images.length === 0 }));
    setImages(imgs => [...imgs, ...urls]);
  };

  return (
    <div className="space-y-5">
      <AdminPageHeader title="Add Product" subtitle="Products / Add Product">
        <button
          type="button"
          onClick={() => navigate('/admin/products')}
          className="px-4 py-2.5 border border-slate-200 text-xs font-semibold text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
        >
          Cancel
        </button>
      </AdminPageHeader>

      <form className="space-y-5" onSubmit={e => { e.preventDefault(); navigate('/admin/products'); }}>
        {/* 2-column layout */}
        <div className="grid lg:grid-cols-3 gap-5">
          {/* Main column */}
          <div className="lg:col-span-2 space-y-5">
            {/* Basic Info */}
            <SectionCard title="Basic Information" subtitle="Core product details">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <FormField label="Product Name" required>
                    <input
                      className={inputClass}
                      placeholder="e.g. Teal Embroidered Organza Saree"
                      value={form.name}
                      onChange={e => { set('name', e.target.value); set('slug', autoSlug(e.target.value)); }}
                    />
                  </FormField>
                </div>
                <div className="col-span-2">
                  <FormField label="URL Slug" hint="Auto-generated from product name. You can edit it.">
                    <input
                      className={inputClass}
                      value={form.slug}
                      onChange={e => set('slug', e.target.value)}
                      placeholder="teal-embroidered-organza-saree"
                    />
                  </FormField>
                </div>
                <div className="col-span-2">
                  <FormField label="Description">
                    <textarea
                      className={textareaClass}
                      rows={3}
                      placeholder="Describe the product in detail..."
                      value={form.description}
                      onChange={e => set('description', e.target.value)}
                    />
                  </FormField>
                </div>
                <div className="col-span-2">
                  <FormField label="Short Description" hint="Shown below product title on listing pages.">
                    <input
                      className={inputClass}
                      placeholder="Brief compelling summary..."
                      value={form.shortDescription}
                      onChange={e => set('shortDescription', e.target.value)}
                    />
                  </FormField>
                </div>
                <FormField label="Category" required>
                  <select className={selectClass} value={form.category} onChange={e => set('category', e.target.value)}>
                    <option value="">Select category</option>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </FormField>
                <FormField label="Subcategory">
                  <select className={selectClass} value={form.subcategory} onChange={e => set('subcategory', e.target.value)} disabled={!form.category}>
                    <option value="">Select subcategory</option>
                    {(SUBCATEGORIES[form.category] || []).map(s => <option key={s}>{s}</option>)}
                  </select>
                </FormField>
                <FormField label="Brand">
                  <input className={inputClass} value={form.brand} onChange={e => set('brand', e.target.value)} />
                </FormField>
                <FormField label="SKU" required hint="Unique product identifier">
                  <input
                    className={inputClass}
                    placeholder="e.g. SUK-SAR-001"
                    value={form.sku}
                    onChange={e => set('sku', e.target.value)}
                  />
                </FormField>
              </div>
            </SectionCard>

            {/* Images */}
            <SectionCard title="Product Images" subtitle="Upload up to 8 images. First image is the primary.">
              <div
                onDrop={handleImageDrop}
                onDragOver={e => e.preventDefault()}
                className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-brand-teal hover:bg-brand-powder/20 transition-all cursor-pointer group mb-4"
                onClick={() => document.getElementById('img-upload').click()}
              >
                <input id="img-upload" type="file" multiple accept="image/*" className="hidden" onChange={handleImageDrop} />
                <ImagePlus size={28} className="mx-auto text-slate-300 group-hover:text-brand-teal mb-3 transition-colors" />
                <p className="text-sm font-semibold text-slate-600 mb-1">Drop images here or click to upload</p>
                <p className="text-xs text-slate-400">PNG, JPG, WEBP up to 5MB each</p>
              </div>

              {images.length > 0 && (
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                  {images.map((img, i) => (
                    <div key={i} className="relative group aspect-square">
                      <img src={img.url} alt={img.name} className="w-full h-full object-cover rounded-lg border border-slate-200" />
                      {img.primary && (
                        <span className="absolute bottom-1 left-1 bg-brand-teal text-white text-[8px] font-bold px-1.5 py-0.5 rounded">PRIMARY</span>
                      )}
                      <button
                        type="button"
                        onClick={() => setImages(imgs => imgs.filter((_, j) => j !== i))}
                        className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </SectionCard>

            {/* Pricing */}
            <SectionCard title="Pricing" subtitle="Set product pricing and tax details">
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Selling Price (₹)" required>
                  <input
                    type="number"
                    className={inputClass}
                    placeholder="3499"
                    value={form.sellingPrice}
                    onChange={e => set('sellingPrice', e.target.value)}
                  />
                </FormField>
                <FormField label="MRP (₹)" required>
                  <input
                    type="number"
                    className={inputClass}
                    placeholder="4999"
                    value={form.mrp}
                    onChange={e => set('mrp', e.target.value)}
                  />
                </FormField>
                <FormField label="Cost Price (₹)" hint="Not shown to customers">
                  <input
                    type="number"
                    className={inputClass}
                    placeholder="1800"
                    value={form.costPrice}
                    onChange={e => set('costPrice', e.target.value)}
                  />
                </FormField>
                <FormField label="GST (%)">
                  <select className={selectClass} value={form.gst} onChange={e => set('gst', e.target.value)}>
                    {['0', '5', '12', '18', '28'].map(g => <option key={g} value={g}>{g}%</option>)}
                  </select>
                </FormField>
              </div>
              {discountPercent > 0 && (
                <div className="mt-3 bg-emerald-50 border border-emerald-100 rounded-lg px-4 py-2.5 flex items-center gap-2">
                  <span className="text-emerald-600 font-bold text-sm">{discountPercent}% OFF</span>
                  <span className="text-xs text-emerald-600">will be shown on product</span>
                </div>
              )}
            </SectionCard>

            {/* Variants */}
            <SectionCard title="Variants" subtitle="Manage colors and sizes with individual stock">
              <div className="space-y-5">
                {variants.map((variant, vi) => (
                  <div key={vi} className="border border-slate-100 rounded-xl p-4 bg-slate-50/30">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-6 h-6 rounded-full border-2 border-white shadow-sm cursor-pointer"
                          style={{ backgroundColor: variant.colorHex }}
                        />
                        <input
                          className="border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 bg-white focus:outline-none focus:border-brand-teal w-28"
                          value={variant.color}
                          onChange={e => updateVariant(vi, 'color', e.target.value)}
                          placeholder="Color name"
                        />
                        <input
                          type="color"
                          value={variant.colorHex}
                          onChange={e => updateVariant(vi, 'colorHex', e.target.value)}
                          className="w-8 h-8 rounded-lg border border-slate-200 cursor-pointer p-0.5"
                          title="Pick color"
                        />
                      </div>
                      {variants.length > 1 && (
                        <button type="button" onClick={() => removeVariant(vi)} className="text-slate-400 hover:text-red-500 transition-colors">
                          <X size={15} />
                        </button>
                      )}
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b border-slate-200">
                            <th className="pb-2 text-left font-semibold text-slate-500 w-16">Size</th>
                            <th className="pb-2 text-left font-semibold text-slate-500">Stock Qty</th>
                            <th className="pb-2 text-left font-semibold text-slate-500">SKU</th>
                          </tr>
                        </thead>
                        <tbody>
                          {variant.sizes.map((s, si) => (
                            <tr key={s.size} className="border-b border-slate-100 last:border-0">
                              <td className="py-2 pr-3">
                                <span className="font-bold text-slate-700">{s.size}</span>
                              </td>
                              <td className="py-2 pr-3">
                                <input
                                  type="number"
                                  min="0"
                                  value={s.stock}
                                  onChange={e => updateVariantSize(vi, si, 'stock', e.target.value)}
                                  placeholder="0"
                                  className="w-20 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 bg-white focus:outline-none focus:border-brand-teal"
                                />
                              </td>
                              <td className="py-2">
                                <input
                                  value={s.sku}
                                  onChange={e => updateVariantSize(vi, si, 'sku', e.target.value)}
                                  placeholder={`${form.sku || 'SKU'}-${s.size}`}
                                  className="w-36 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 font-mono bg-white focus:outline-none focus:border-brand-teal"
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
                onClick={addVariant}
                className="mt-4 flex items-center gap-2 text-xs font-semibold text-brand-teal hover:text-brand-tealDark border border-dashed border-brand-teal/40 hover:border-brand-teal px-4 py-2 rounded-lg transition-all w-full justify-center"
              >
                <Plus size={13} /> Add Colour Variant
              </button>
            </SectionCard>

            {/* Product Attributes */}
            <SectionCard title="Product Attributes">
              <div className="grid grid-cols-2 gap-4">
                {[
                  ['Fabric', 'fabric', FABRICS],
                  ['Occasion', 'occasion', OCCASIONS],
                  ['Work / Embroidery', 'work', ['Embroidered', 'Printed', 'Zari', 'Plain', 'Sequin', 'Handwork']],
                  ['Pattern', 'pattern', ['Solid', 'Floral', 'Paisley', 'Geometric', 'Abstract', 'Brocade']],
                  ['Fit', 'fit', ['Regular', 'Slim', 'Flared', 'Wrap', 'Straight']],
                  ['Sleeve', 'sleeve', ['Sleeveless', 'Short', '3/4 Sleeve', 'Full Sleeve', 'Cap Sleeve']],
                  ['Neck', 'neck', ['Round', 'V-Neck', 'Square', 'Sweetheart', 'Halter', 'N/A']],
                  ['Country of Origin', 'countryOfOrigin', ['India', 'Bangladesh', 'China']],
                ].map(([label, key, options]) => (
                  <FormField key={key} label={label}>
                    <select className={selectClass} value={form[key]} onChange={e => set(key, e.target.value)}>
                      <option value="">Select {label}</option>
                      {options.map(o => <option key={o}>{o}</option>)}
                    </select>
                  </FormField>
                ))}
                <div className="col-span-2">
                  <FormField label="Care Instructions">
                    <input
                      className={inputClass}
                      placeholder="e.g. Dry clean only"
                      value={form.careInstructions}
                      onChange={e => set('careInstructions', e.target.value)}
                    />
                  </FormField>
                </div>
              </div>
            </SectionCard>
          </div>

          {/* Right column — flags, SEO */}
          <div className="space-y-5">
            {/* Product Flags */}
            <SectionCard title="Product Flags">
              <div className="space-y-3.5">
                {[
                  ['New Arrival', 'isNew'],
                  ['Best Seller', 'isBestSeller'],
                  ['Featured', 'isFeatured'],
                  ['Trending', 'isTrending'],
                  ['Show on Homepage', 'showOnHomepage'],
                  ['Allow COD', 'allowCOD'],
                  ['Returnable', 'returnable'],
                ].map(([label, key]) => (
                  <Toggle
                    key={key}
                    label={label}
                    checked={form[key]}
                    onChange={val => set(key, val)}
                  />
                ))}
              </div>
            </SectionCard>

            {/* SEO */}
            <SectionCard title="SEO" subtitle="Search engine optimization" collapsible defaultOpen={false}>
              <div className="space-y-4">
                <FormField label="Meta Title">
                  <input
                    className={inputClass}
                    placeholder="Product name | Suka Fashions"
                    value={form.metaTitle}
                    onChange={e => set('metaTitle', e.target.value)}
                  />
                </FormField>
                <FormField label="Meta Description">
                  <textarea
                    className={textareaClass}
                    rows={3}
                    placeholder="Compelling meta description..."
                    value={form.metaDescription}
                    onChange={e => set('metaDescription', e.target.value)}
                  />
                </FormField>
              </div>
            </SectionCard>

            {/* Form actions */}
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 space-y-2.5">
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-brand-teal hover:bg-brand-tealDark text-white text-sm font-semibold py-3 rounded-lg transition-colors shadow-sm"
              >
                <Send size={14} /> Publish Product
              </button>
              <button
                type="button"
                className="w-full flex items-center justify-center gap-2 border border-slate-200 text-slate-600 text-sm font-semibold py-2.5 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <Save size={14} /> Save as Draft
              </button>
              <button
                type="button"
                className="w-full flex items-center justify-center gap-2 border border-dashed border-slate-200 text-slate-500 text-sm py-2.5 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <Eye size={14} /> Preview
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
