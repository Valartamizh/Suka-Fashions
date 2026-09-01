// ContentPage — /admin/content (Full-featured Landing Page Editor with Slide Manager & Section Editors)
import React, { useState } from 'react';
import {
  LayoutTemplate, ImagePlay, Grid3x3, Sparkles, TrendingUp,
  Image, ShoppingBag, Palette, BookOpen, Scissors, Star,
  Instagram, Gift, Mail, Edit, ToggleLeft, ToggleRight,
  ExternalLink, X, Save, Check, RotateCcw, Plus, Trash2,
  Sliders, MoveUp, MoveDown, Layers, Search
} from 'lucide-react';
import AdminPageHeader from '../components/ui/AdminPageHeader';
import ConfirmModal from '../components/ui/ConfirmModal';
import { useContent } from '../../context/ContentContext';

const ICON_MAP = {
  announcement: LayoutTemplate,
  hero: ImagePlay,
  categories: Grid3x3,
  'new-arrivals': Sparkles,
  'best-sellers': TrendingUp,
  'four-pillars': Gift,
  'promo-banners': Image,
  trending: TrendingUp,
  occasion: ShoppingBag,
  collections: Palette,
  'brand-story': BookOpen,
  craftsmanship: Scissors,
  testimonials: Star,
  instagram: Instagram,
  newsletter: Mail,
};

export default function ContentPage() {
  const { sections, toggleSection, updateSectionContent, resetContent } = useContent();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [editSection, setEditSection] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [confirmModal, setConfirmModal] = useState(null);
  const [toast, setToast] = useState(null);

  // Selected sub-tab for complex sections (like hero slides or collections)
  const [activeSlideIdx, setActiveSlideIdx] = useState(0);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const handleOpenEdit = (section) => {
    setEditSection(section);
    setEditForm(JSON.parse(JSON.stringify(section.content || {})));
    setActiveSlideIdx(0);
  };

  const promptToggleSection = (section) => {
    const willActive = !section.active;
    setConfirmModal({
      title: willActive ? 'Enable Section' : 'Hide Section',
      message: `Are you sure you want to ${willActive ? 'enable and display' : 'hide'} "${section.label}" on the storefront homepage?`,
      confirmLabel: willActive ? 'Enable Section' : 'Hide Section',
      variant: 'brand',
      onConfirm: () => {
        toggleSection(section.id);
        showToast(`"${section.label}" ${willActive ? 'enabled' : 'hidden'}. Changes are live on homepage.`);
      },
    });
  };

  const promptSaveEdit = () => {
    if (!editSection) return;
    updateSectionContent(editSection.id, editForm);
    showToast(`"${editSection.label}" updated successfully! Changes are live on homepage.`);
    setEditSection(null);
  };

  const promptReset = () => {
    setConfirmModal({
      title: 'Reset Landing Page Content',
      message: 'Are you sure you want to reset all homepage sections, headlines, hero slides, and banners back to the initial default design?',
      confirmLabel: 'Reset Defaults',
      variant: 'danger',
      onConfirm: () => {
        resetContent();
        showToast('Homepage content reset to defaults.');
      },
    });
  };

  // ─── Hero Slide Helpers ───
  const handleAddSlide = () => {
    const slides = editForm.slides || [];
    const newSlide = {
      id: Date.now(),
      eyebrow: 'NEW COLLECTION',
      headingLine1: 'Exclusive',
      headingLine2: 'Celebration.',
      subtitle: 'Handpicked bridal and festive couture crafted with pure heritage silks.',
      ctaText: 'SHOP COLLECTION',
      ctaLink: '/products',
      secondaryCtaText: 'EXPLORE ALL',
      secondaryCtaLink: '/products',
      mainImage: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=600&auto=format&fit=crop',
      detailImageLeft: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=400&auto=format&fit=crop',
      detailImageRight: 'https://images.unsplash.com/photo-1617501706025-6ab51a2f9634?q=80&w=400&auto=format&fit=crop',
      mainLabel: 'Exclusive Celebration.',
      leftEyebrow: 'DETAILS',
      leftTitle: 'Handcrafted\nzari work',
      rightEyebrow: 'THE EDIT',
      rightTitle: 'Modern festive\nsilhouettes',
      accentBg: '#EBF5F5',
      active: true,
    };
    const updatedSlides = [...slides, newSlide];
    setEditForm({ ...editForm, slides: updatedSlides });
    setActiveSlideIdx(updatedSlides.length - 1);
  };

  const handleDeleteSlide = (idx) => {
    const slides = editForm.slides || [];
    if (slides.length <= 1) {
      showToast('Hero slider must have at least one slide.');
      return;
    }
    const updatedSlides = slides.filter((_, i) => i !== idx);
    setEditForm({ ...editForm, slides: updatedSlides });
    setActiveSlideIdx(Math.max(0, idx - 1));
  };

  const handleUpdateCurrentSlide = (field, val) => {
    const slides = [...(editForm.slides || [])];
    if (slides[activeSlideIdx]) {
      slides[activeSlideIdx] = {
        ...slides[activeSlideIdx],
        [field]: val,
      };
      setEditForm({ ...editForm, slides });
    }
  };

  // ─── Filter sections ───
  const filteredSections = sections.filter(sec => {
    const matchSearch = sec.label.toLowerCase().includes(search.toLowerCase()) ||
      sec.desc.toLowerCase().includes(search.toLowerCase()) ||
      sec.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' ? true : statusFilter === 'Active' ? sec.active : !sec.active;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-5 relative">
      {/* Toast notification */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 animate-[fadeInUp_0.25s_ease-out]">
          <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
            <Check size={14} />
          </div>
          <span className="text-xs font-semibold">{toast}</span>
        </div>
      )}

      <AdminPageHeader title="Landing Page Content" subtitle="Fully customize all storefront homepage sections, hero slides, headlines, and banners.">
        <div className="flex items-center gap-2">
          <button
            onClick={promptReset}
            className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 text-xs font-semibold text-slate-500 hover:text-red-600 hover:border-red-200 rounded-lg hover:bg-red-50 transition-colors shadow-sm"
          >
            <RotateCcw size={13} /> Reset Defaults
          </button>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-brand-teal hover:bg-brand-tealDark text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
          >
            <ExternalLink size={13} /> View Live Store
          </a>
        </div>
      </AdminPageHeader>

      {/* Info banner */}
      <div className="bg-brand-powder/50 border border-brand-teal/20 rounded-2xl p-4 flex items-start gap-3.5 shadow-2xs">
        <div className="w-9 h-9 rounded-xl bg-brand-teal text-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
          <Sparkles size={18} />
        </div>
        <div>
          <p className="text-xs font-bold text-brand-navy mb-0.5">Live Storefront Content Engine</p>
          <p className="text-xs text-slate-600 leading-relaxed">
            Every section below is fully editable. You can toggle sections on/off, manage hero slides, modify promo headlines, rearrange collections, edit testimonials, and update trust pillars. All edits instantly sync with the customer-facing storefront!
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex flex-wrap gap-3 items-center justify-between">
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 flex-1 min-w-[200px] max-w-md">
          <Search size={14} className="text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search homepage sections..."
            className="bg-transparent text-xs text-slate-700 placeholder-slate-400 outline-none w-full"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>Filter:</span>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-700 bg-white focus:outline-none focus:border-brand-teal"
          >
            <option value="All">All Sections ({sections.length})</option>
            <option value="Active">Active ({sections.filter(s => s.active).length})</option>
            <option value="Hidden">Hidden ({sections.filter(s => !s.active).length})</option>
          </select>
        </div>
      </div>

      {/* Section cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSections.map((section) => {
          const IconComponent = ICON_MAP[section.id] || LayoutTemplate;
          return (
            <div
              key={section.id}
              className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all hover:shadow-md flex flex-col justify-between ${
                section.active ? 'border-slate-100' : 'border-slate-200/60 opacity-65 bg-slate-50/50'
              }`}
            >
              <div className="p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        section.active ? 'bg-brand-powder text-brand-teal' : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      <IconComponent size={18} />
                    </div>
                    <div>
                      <h3 className="font-sans font-bold text-slate-800 text-sm leading-tight">{section.label}</h3>
                      <p className="text-[10.5px] text-slate-400 mt-0.5">{section.desc}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => promptToggleSection(section)}
                    className={`flex-shrink-0 mt-0.5 transition-colors cursor-pointer ${
                      section.active ? 'text-brand-teal' : 'text-slate-300 hover:text-slate-400'
                    }`}
                    title={section.active ? 'Click to hide section' : 'Click to show section'}
                  >
                    {section.active ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                  </button>
                </div>

                {/* Quick preview content snippet */}
                <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-100 my-2 line-clamp-2">
                  {section.id === 'hero' && `${section.content?.slides?.length || 3} Hero Slides configured with dynamic typography & CTAs.`}
                  {section.id === 'announcement' && `Item 1: "${section.content?.item1 || ''}"`}
                  {section.id === 'promo-banners' && `Title: "${section.content?.title || ''}"`}
                  {section.id === 'collections' && `${section.content?.items?.length || 4} Handpicked cards active.`}
                  {section.id === 'testimonials' && `${section.content?.items?.length || 3} Client reviews featured.`}
                  {section.id === 'four-pillars' && `Pillar 1: "${section.content?.item1Title || ''}"`}
                  {section.id === 'instagram' && `Handle: ${section.content?.handle || '@sukafashions'}`}
                  {section.id === 'newsletter' && `Headline: "${section.content?.title || ''}"`}
                  {['categories', 'new-arrivals', 'best-sellers', 'trending', 'occasion', 'brand-story', 'craftsmanship'].includes(section.id) &&
                    `Title: "${section.content?.title || ''}" • Tag: "${section.content?.eyebrow || ''}"`}
                </div>
              </div>

              <div className="flex items-center justify-between px-5 py-3 bg-slate-50/50 border-t border-slate-100">
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    section.active ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-200/70 text-slate-500'
                  }`}
                >
                  {section.active ? 'Active on Store' : 'Hidden'}
                </span>
                <button
                  onClick={() => handleOpenEdit(section)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-powder hover:bg-brand-teal text-brand-teal hover:text-white text-xs font-semibold rounded-lg transition-all shadow-2xs"
                >
                  <Edit size={12} /> Edit Section
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ─── Comprehensive Edit Modal ─── */}
      {editSection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={() => setEditSection(null)} />
          <div
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-[fadeInUp_0.2s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-brand-powder rounded-xl flex items-center justify-center text-brand-teal font-bold shadow-2xs">
                  {React.createElement(ICON_MAP[editSection.id] || LayoutTemplate, { size: 18 })}
                </div>
                <div>
                  <h3 className="font-sans font-bold text-slate-800 text-sm">Edit {editSection.label}</h3>
                  <p className="text-[10.5px] text-slate-400">Live customization for storefront homepage</p>
                </div>
              </div>
              <button onClick={() => setEditSection(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <X size={18} />
              </button>
            </div>

            {/* Modal Body with section-specific editors */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
              
              {/* 1. HERO SLIDER EDITOR */}
              {editSection.id === 'hero' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <p className="text-xs font-bold text-slate-800">Slides Manager</p>
                      <p className="text-[10px] text-slate-400">Add, edit, and organize rotating hero slides</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddSlide}
                      className="flex items-center gap-1 px-3 py-1.5 bg-brand-powder text-brand-teal hover:bg-brand-teal hover:text-white rounded-lg text-xs font-semibold transition-colors"
                    >
                      <Plus size={13} /> Add Slide
                    </button>
                  </div>

                  {/* Slide Tabs */}
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {(editForm.slides || []).map((s, idx) => (
                      <div
                        key={s.id || idx}
                        onClick={() => setActiveSlideIdx(idx)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition-all ${
                          activeSlideIdx === idx
                            ? 'bg-brand-teal text-white border-brand-teal shadow-xs'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <span>Slide {idx + 1}</span>
                        {(editForm.slides || []).length > 1 && (
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); handleDeleteSlide(idx); }}
                            className={`p-0.5 rounded hover:bg-red-500 hover:text-white transition-colors ${
                              activeSlideIdx === idx ? 'text-white/80' : 'text-slate-400'
                            }`}
                            title="Delete slide"
                          >
                            <Trash2 size={11} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Active Slide Form */}
                  {editForm.slides && editForm.slides[activeSlideIdx] && (
                    <div className="bg-slate-50/60 p-4 rounded-xl border border-slate-200/70 space-y-3 text-xs">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Eyebrow Tag</label>
                          <input
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-700 outline-none focus:border-brand-teal"
                            value={editForm.slides[activeSlideIdx].eyebrow || ''}
                            onChange={(e) => handleUpdateCurrentSlide('eyebrow', e.target.value)}
                            placeholder="e.g. HERITAGE LEHENGAS"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Card Accent Color</label>
                          <input
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-700 outline-none focus:border-brand-teal"
                            value={editForm.slides[activeSlideIdx].accentBg || '#EBF5F5'}
                            onChange={(e) => handleUpdateCurrentSlide('accentBg', e.target.value)}
                            placeholder="e.g. #EBF5F5"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Heading Line 1</label>
                          <input
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-700 outline-none focus:border-brand-teal"
                            value={editForm.slides[activeSlideIdx].headingLine1 || ''}
                            onChange={(e) => handleUpdateCurrentSlide('headingLine1', e.target.value)}
                            placeholder="e.g. Royal"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Heading Line 2</label>
                          <input
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-700 outline-none focus:border-brand-teal"
                            value={editForm.slides[activeSlideIdx].headingLine2 || ''}
                            onChange={(e) => handleUpdateCurrentSlide('headingLine2', e.target.value)}
                            placeholder="e.g. Occasions."
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Subtitle / Paragraph</label>
                        <textarea
                          rows={2}
                          className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-700 outline-none focus:border-brand-teal resize-none"
                          value={editForm.slides[activeSlideIdx].subtitle || ''}
                          onChange={(e) => handleUpdateCurrentSlide('subtitle', e.target.value)}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Primary Button Text</label>
                          <input
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-700 outline-none focus:border-brand-teal"
                            value={editForm.slides[activeSlideIdx].ctaText || ''}
                            onChange={(e) => handleUpdateCurrentSlide('ctaText', e.target.value)}
                            placeholder="e.g. SHOP NEW ARRIVALS"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Primary Button Link</label>
                          <input
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-700 outline-none focus:border-brand-teal"
                            value={editForm.slides[activeSlideIdx].ctaLink || ''}
                            onChange={(e) => handleUpdateCurrentSlide('ctaLink', e.target.value)}
                            placeholder="e.g. /products"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Secondary Button Text</label>
                          <input
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-700 outline-none focus:border-brand-teal"
                            value={editForm.slides[activeSlideIdx].secondaryCtaText || ''}
                            onChange={(e) => handleUpdateCurrentSlide('secondaryCtaText', e.target.value)}
                            placeholder="e.g. EXPLORE SAREES"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Secondary Button Link</label>
                          <input
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-700 outline-none focus:border-brand-teal"
                            value={editForm.slides[activeSlideIdx].secondaryCtaLink || ''}
                            onChange={(e) => handleUpdateCurrentSlide('secondaryCtaLink', e.target.value)}
                            placeholder="e.g. /category/sarees"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Main Center Image URL / Path</label>
                        <input
                          className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-700 outline-none focus:border-brand-teal"
                          value={editForm.slides[activeSlideIdx].mainImage || ''}
                          onChange={(e) => handleUpdateCurrentSlide('mainImage', e.target.value)}
                          placeholder="Image URL or /src/assets/..."
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 2. ANNOUNCEMENT BAR EDITOR */}
              {editSection.id === 'announcement' && (
                <div className="space-y-3">
                  <p className="text-xs text-slate-500">Edit top announcement bar ticker messages:</p>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Message 1</label>
                    <input
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 outline-none focus:border-brand-teal"
                      value={editForm.item1 || ''}
                      onChange={(e) => setEditForm({ ...editForm, item1: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Message 2</label>
                    <input
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 outline-none focus:border-brand-teal"
                      value={editForm.item2 || ''}
                      onChange={(e) => setEditForm({ ...editForm, item2: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Message 3</label>
                    <input
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 outline-none focus:border-brand-teal"
                      value={editForm.item3 || ''}
                      onChange={(e) => setEditForm({ ...editForm, item3: e.target.value })}
                    />
                  </div>
                </div>
              )}

              {/* 3. PROMOTIONAL BANNER EDITOR */}
              {editSection.id === 'promo-banners' && (
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Eyebrow Pill Tag</label>
                    <input
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 outline-none focus:border-brand-teal"
                      value={editForm.eyebrow || ''}
                      onChange={(e) => setEditForm({ ...editForm, eyebrow: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Headline</label>
                    <input
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 outline-none focus:border-brand-teal"
                      value={editForm.title || ''}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Italic Subtitle</label>
                    <input
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 outline-none focus:border-brand-teal"
                      value={editForm.subtitle || ''}
                      onChange={(e) => setEditForm({ ...editForm, subtitle: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Body Description</label>
                    <textarea
                      rows={2}
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 outline-none focus:border-brand-teal resize-none"
                      value={editForm.description || ''}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Button Text</label>
                      <input
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 outline-none focus:border-brand-teal"
                        value={editForm.ctaText || ''}
                        onChange={(e) => setEditForm({ ...editForm, ctaText: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Button Link</label>
                      <input
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 outline-none focus:border-brand-teal"
                        value={editForm.ctaLink || ''}
                        onChange={(e) => setEditForm({ ...editForm, ctaLink: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Background Image URL / Path</label>
                    <input
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 outline-none focus:border-brand-teal"
                      value={editForm.image || ''}
                      onChange={(e) => setEditForm({ ...editForm, image: e.target.value })}
                    />
                  </div>
                </div>
              )}

              {/* 4. FOUR PILLARS / BENEFITS EDITOR */}
              {editSection.id === 'four-pillars' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Eyebrow</label>
                      <input
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 outline-none focus:border-brand-teal"
                        value={editForm.eyebrow || ''}
                        onChange={(e) => setEditForm({ ...editForm, eyebrow: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Title</label>
                      <input
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 outline-none focus:border-brand-teal"
                        value={editForm.title || ''}
                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 border-t border-slate-100 pt-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Pillar 1 Title</label>
                      <input
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 outline-none focus:border-brand-teal"
                        value={editForm.item1Title || ''}
                        onChange={(e) => setEditForm({ ...editForm, item1Title: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Pillar 1 Description</label>
                      <input
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 outline-none focus:border-brand-teal"
                        value={editForm.item1Desc || ''}
                        onChange={(e) => setEditForm({ ...editForm, item1Desc: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Pillar 2 Title</label>
                      <input
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 outline-none focus:border-brand-teal"
                        value={editForm.item2Title || ''}
                        onChange={(e) => setEditForm({ ...editForm, item2Title: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Pillar 2 Description</label>
                      <input
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 outline-none focus:border-brand-teal"
                        value={editForm.item2Desc || ''}
                        onChange={(e) => setEditForm({ ...editForm, item2Desc: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Pillar 3 Title</label>
                      <input
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 outline-none focus:border-brand-teal"
                        value={editForm.item3Title || ''}
                        onChange={(e) => setEditForm({ ...editForm, item3Title: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Pillar 3 Description</label>
                      <input
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 outline-none focus:border-brand-teal"
                        value={editForm.item3Desc || ''}
                        onChange={(e) => setEditForm({ ...editForm, item3Desc: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Pillar 4 Title</label>
                      <input
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 outline-none focus:border-brand-teal"
                        value={editForm.item4Title || ''}
                        onChange={(e) => setEditForm({ ...editForm, item4Title: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Pillar 4 Description</label>
                      <input
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 outline-none focus:border-brand-teal"
                        value={editForm.item4Desc || ''}
                        onChange={(e) => setEditForm({ ...editForm, item4Desc: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 5. TESTIMONIALS & REVIEWS EDITOR */}
              {editSection.id === 'testimonials' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Eyebrow</label>
                      <input
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 outline-none focus:border-brand-teal"
                        value={editForm.eyebrow || ''}
                        onChange={(e) => setEditForm({ ...editForm, eyebrow: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Title</label>
                      <input
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 outline-none focus:border-brand-teal"
                        value={editForm.title || ''}
                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      />
                    </div>
                  </div>

                  <p className="text-xs font-bold text-slate-700 border-t border-slate-100 pt-3">Featured Reviews ({editForm.items?.length || 0}):</p>
                  <div className="space-y-3">
                    {(editForm.items || []).map((review, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                        <div className="grid grid-cols-3 gap-2">
                          <input
                            placeholder="Client Name"
                            className="bg-white border border-slate-200 rounded px-2 py-1 text-slate-700"
                            value={review.name || ''}
                            onChange={(e) => {
                              const items = [...editForm.items];
                              items[idx] = { ...items[idx], name: e.target.value };
                              setEditForm({ ...editForm, items });
                            }}
                          />
                          <input
                            placeholder="City / Location"
                            className="bg-white border border-slate-200 rounded px-2 py-1 text-slate-700"
                            value={review.city || ''}
                            onChange={(e) => {
                              const items = [...editForm.items];
                              items[idx] = { ...items[idx], city: e.target.value };
                              setEditForm({ ...editForm, items });
                            }}
                          />
                          <input
                            placeholder="Tag (e.g. Bridal Edit)"
                            className="bg-white border border-slate-200 rounded px-2 py-1 text-slate-700"
                            value={review.tag || ''}
                            onChange={(e) => {
                              const items = [...editForm.items];
                              items[idx] = { ...items[idx], tag: e.target.value };
                              setEditForm({ ...editForm, items });
                            }}
                          />
                        </div>
                        <textarea
                          rows={2}
                          placeholder="Review quote..."
                          className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-slate-700 resize-none"
                          value={review.quote || ''}
                          onChange={(e) => {
                            const items = [...editForm.items];
                            items[idx] = { ...items[idx], quote: e.target.value };
                            setEditForm({ ...editForm, items });
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 6. CURATED COLLECTIONS EDITOR */}
              {editSection.id === 'collections' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Eyebrow</label>
                      <input
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 outline-none focus:border-brand-teal"
                        value={editForm.eyebrow || ''}
                        onChange={(e) => setEditForm({ ...editForm, eyebrow: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Title</label>
                      <input
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 outline-none focus:border-brand-teal"
                        value={editForm.title || ''}
                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      />
                    </div>
                  </div>

                  <p className="text-xs font-bold text-slate-700 border-t border-slate-100 pt-3">Curated Collection Cards:</p>
                  <div className="space-y-3">
                    {(editForm.items || []).map((col, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[9px] font-bold text-slate-400 uppercase">Card Title</label>
                            <input
                              className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-slate-700"
                              value={col.title || ''}
                              onChange={(e) => {
                                const items = [...editForm.items];
                                items[idx] = { ...items[idx], title: e.target.value };
                                setEditForm({ ...editForm, items });
                              }}
                            />
                          </div>
                          <div>
                            <label className="text-[9px] font-bold text-slate-400 uppercase">Card Subtitle / Badge</label>
                            <input
                              className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-slate-700"
                              value={col.subtitle || ''}
                              onChange={(e) => {
                                const items = [...editForm.items];
                                items[idx] = { ...items[idx], subtitle: e.target.value };
                                setEditForm({ ...editForm, items });
                              }}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-[9px] font-bold text-slate-400 uppercase">Destination Link</label>
                          <input
                            className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-slate-700"
                            value={col.link || ''}
                            onChange={(e) => {
                              const items = [...editForm.items];
                              items[idx] = { ...items[idx], link: e.target.value };
                              setEditForm({ ...editForm, items });
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 7. INSTAGRAM COMMUNITY EDITOR */}
              {editSection.id === 'instagram' && (
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Instagram Handle</label>
                    <input
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 outline-none focus:border-brand-teal"
                      value={editForm.handle || ''}
                      onChange={(e) => setEditForm({ ...editForm, handle: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Section Title</label>
                    <input
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 outline-none focus:border-brand-teal"
                      value={editForm.title || ''}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Subtitle / Callout</label>
                    <input
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 outline-none focus:border-brand-teal"
                      value={editForm.subtitle || ''}
                      onChange={(e) => setEditForm({ ...editForm, subtitle: e.target.value })}
                    />
                  </div>
                </div>
              )}

              {/* 8. NEWSLETTER EDITOR */}
              {editSection.id === 'newsletter' && (
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Eyebrow Tag</label>
                    <input
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 outline-none focus:border-brand-teal"
                      value={editForm.eyebrow || ''}
                      onChange={(e) => setEditForm({ ...editForm, eyebrow: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Headline</label>
                    <input
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 outline-none focus:border-brand-teal"
                      value={editForm.title || ''}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Subtitle</label>
                    <textarea
                      rows={2}
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 outline-none focus:border-brand-teal resize-none"
                      value={editForm.subtitle || ''}
                      onChange={(e) => setEditForm({ ...editForm, subtitle: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Button Label</label>
                    <input
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 outline-none focus:border-brand-teal"
                      value={editForm.buttonText || ''}
                      onChange={(e) => setEditForm({ ...editForm, buttonText: e.target.value })}
                    />
                  </div>
                </div>
              )}

              {/* 9. BRAND STORY EDITOR */}
              {editSection.id === 'brand-story' && (
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Eyebrow</label>
                    <input
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 outline-none focus:border-brand-teal"
                      value={editForm.eyebrow || ''}
                      onChange={(e) => setEditForm({ ...editForm, eyebrow: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Headline</label>
                    <input
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 outline-none focus:border-brand-teal"
                      value={editForm.title || ''}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Story Paragraph</label>
                    <textarea
                      rows={3}
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 outline-none focus:border-brand-teal resize-none"
                      value={editForm.paragraph || ''}
                      onChange={(e) => setEditForm({ ...editForm, paragraph: e.target.value })}
                    />
                  </div>
                </div>
              )}

              {/* 10. GENERAL HEADINGS (Categories, New Arrivals, Best Sellers, Trending, Occasions, Craftsmanship) */}
              {['categories', 'new-arrivals', 'best-sellers', 'trending', 'occasion', 'craftsmanship'].includes(editSection.id) && (
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Eyebrow / Tagline</label>
                    <input
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 outline-none focus:border-brand-teal"
                      value={editForm.eyebrow || ''}
                      onChange={(e) => setEditForm({ ...editForm, eyebrow: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Section Title</label>
                    <input
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 outline-none focus:border-brand-teal"
                      value={editForm.title || ''}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    />
                  </div>
                  {editForm.viewAllText !== undefined && (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">View All Button Label</label>
                        <input
                          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 outline-none focus:border-brand-teal"
                          value={editForm.viewAllText || ''}
                          onChange={(e) => setEditForm({ ...editForm, viewAllText: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">View All Link</label>
                        <input
                          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 outline-none focus:border-brand-teal"
                          value={editForm.viewAllLink || ''}
                          onChange={(e) => setEditForm({ ...editForm, viewAllLink: e.target.value })}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/50">
              <button
                type="button"
                onClick={() => setEditSection(null)}
                className="flex-1 border border-slate-200 rounded-lg py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={promptSaveEdit}
                className="flex-1 flex items-center justify-center gap-2 bg-brand-teal hover:bg-brand-tealDark text-white rounded-lg py-2.5 text-xs font-semibold transition-colors shadow-sm"
              >
                <Save size={14} /> Save Live Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmModal && (
        <ConfirmModal
          isOpen={!!confirmModal}
          onClose={() => setConfirmModal(null)}
          onConfirm={confirmModal.onConfirm}
          title={confirmModal.title}
          message={confirmModal.message}
          confirmLabel={confirmModal.confirmLabel}
          variant={confirmModal.variant}
        />
      )}
    </div>
  );
}
