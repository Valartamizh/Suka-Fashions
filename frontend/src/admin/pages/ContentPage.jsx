// ContentPage.jsx — /admin/content (Comprehensive Suka Fashions CMS & Live Storefront Controller)
import React, { useState, useMemo, useEffect } from 'react';
import {
  Layers, ImagePlay, Grid3x3, Sparkles, TrendingUp,
  Image, ShoppingBag, Palette, BookOpen, Scissors, Star,
  Instagram, Gift, Mail, Edit, ExternalLink, X, Save, Check,
  RotateCcw, Plus, Trash2, Search, Eye, EyeOff,
  CheckCircle2, ChevronRight, Filter,
  Tag, SlidersHorizontal, ArrowRight, ArrowUp, ArrowDown, Upload, RefreshCw, History,
  Send, AlertTriangle, ShieldCheck, Copy, Phone, Clock, Link as LinkIcon,
  Globe, LayoutTemplate, HelpCircle, CheckCircle, ChevronDown, ChevronUp, Lock
} from 'lucide-react';
import AdminPageHeader from '../components/ui/AdminPageHeader';
import ConfirmModal from '../components/ui/ConfirmModal';
import { useContent } from '../../context/ContentContext';
import { useProducts } from '../../context/ProductContext';
import { useCategories } from '../../context/CategoryContext';
import { useAdminAuth } from '../context/AdminAuthContext';
import { adminReviews } from '../data/adminReviews';
import AppLoader from '../../components/common/AppLoader';

// Local asset fallbacks
import sareeGolden from '../../assets/saree_golden.jpg';
import sareeBeigePink from '../../assets/saree_beige_pink.jpg';
import sareeBeigeMaroon from '../../assets/saree_beige_maroon.jpg';
import sareeBeigeMaroonFull from '../../assets/saree_beige_maroon_full.jpg';
import sareeBeigeMaroonFull2 from '../../assets/saree_beige_maroon_full2.jpg';
import sareeBeigeOrange from '../../assets/saree_beige_orange.jpg';
import lehengaRed from '../../assets/lehenga_red.jpg';
import lehengaPink from '../../assets/lehenga_pink.jpg';
import lehengaMint from '../../assets/lehenga_mint.jpg';
import kurtiTealPrinted from '../../assets/kurti_teal_printed.jpg';
import kurtiPurplePrinted from '../../assets/kurti_purple_printed.jpg';
import kurtiBrownPrinted from '../../assets/kurti_brown_printed.jpg';
import anarkaliBlack from '../../assets/anarkali_black.jpg';
import anarkaliBlackMulti from '../../assets/anarkali_black_multicolor.jpg';
import coordSet from '../../assets/coord_set.jpg';
import festiveSuit from '../../assets/festive_suit.jpg';
import dressNavy from '../../assets/dress_navy.jpg';
import dressWhite from '../../assets/dress_white.jpg';
import dupattaSilk from '../../assets/dupatta_silk.jpg';

const ASSET_LIBRARY = [
  { name: 'Gold Banarasi Saree', url: sareeGolden },
  { name: 'Blush Pink Saree', url: sareeBeigePink },
  { name: 'Maroon Zari Saree', url: sareeBeigeMaroon },
  { name: 'Maroon Heritage Full', url: sareeBeigeMaroonFull },
  { name: 'Maroon Wedding Edit', url: sareeBeigeMaroonFull2 },
  { name: 'Festive Orange Saree', url: sareeBeigeOrange },
  { name: 'Crimson Velvet Lehenga', url: lehengaRed },
  { name: 'Blush Pink Lehenga', url: lehengaPink },
  { name: 'Mint Pastel Lehenga', url: lehengaMint },
  { name: 'Teal Printed Kurti', url: kurtiTealPrinted },
  { name: 'Purple Bandhani Kurti', url: kurtiPurplePrinted },
  { name: 'Brown Floral Kurti', url: kurtiBrownPrinted },
  { name: 'Black Handloom Anarkali', url: anarkaliBlack },
  { name: 'Multicolor Anarkali', url: anarkaliBlackMulti },
  { name: 'Modern Coord Set', url: coordSet },
  { name: 'Festive Banarasi Suit', url: festiveSuit },
  { name: 'Navy Midi Dress', url: dressNavy },
  { name: 'Ivory Comfort Dress', url: dressWhite },
  { name: 'Pure Silk Dupatta', url: dupattaSilk },
];

const CATEGORY_THEMES = [
  { name: 'Orange Gradient', color: '#F97316' },
  { name: 'Soft Pink', color: '#EC4899' },
  { name: 'Mint Green', color: '#10B981' },
  { name: 'Lavender Purple', color: '#8B5CF6' },
  { name: 'Soft Gold', color: '#F59E0B' },
  { name: 'Sky Blue', color: '#0EA5E9' },
  { name: 'Teal Elegance', color: '#14B8A6' },
];

const HERO_BG_PRESETS = [
  { name: 'Soft Teal', color: '#EBF5F5' },
  { name: 'Powder Blue', color: '#E8F3F5' },
  { name: 'Soft Rose', color: '#FDF2F4' },
  { name: 'Warm Gold', color: '#FEF9EE' },
  { name: 'Mint Fresh', color: '#F0FDF4' },
  { name: 'Lavender', color: '#F5F3FF' },
  { name: 'Neutral Cream', color: '#F9F8F6' },
];

export default function ContentPage() {
  const {
    sections,
    draftSections,
    status,
    lastPublishedAt,
    lastPublishedBy,
    versionHistory,
    isLoading,
    toggleSection,
    updateSectionContent,
    reorderSections,
    deleteSection,
    saveDraft,
    publishChanges,
    restoreVersion,
    resetContent,
  } = useContent();

  const { products } = useProducts();
  const { categories } = useCategories();
  const { admin } = useAdminAuth();

  // Role authorization check (Super Admin, Admin, Content Manager)
  const isAuthorized = useMemo(() => {
    if (!admin) return true;
    const role = admin.role || 'SUPER_ADMIN';
    return ['SUPER_ADMIN', 'ADMIN', 'CONTENT_MANAGER'].includes(role);
  }, [admin]);

  // Top Tabs
  const [activeTab, setActiveTab] = useState('layout'); // 'layout' | section id

  // Modals & UI States
  const [toast, setToast] = useState(null);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [confirmModal, setConfirmModal] = useState(null);
  const [productPickerModal, setProductPickerModal] = useState(null); // { sectionId, selectedIds }
  const [pickerSearch, setPickerSearch] = useState('');
  const [pickerCategory, setPickerCategory] = useState('All');
  const [imageModal, setImageModal] = useState(null); // { title, currentUrl, onSelect }
  const [addSlideModal, setAddSlideModal] = useState(null); // Form state for new hero slide popup
  const [addCategoryTileModal, setAddCategoryTileModal] = useState(null);
  const [editCategoryTileModal, setEditCategoryTileModal] = useState(null);
  const [addPromoBannerModal, setAddPromoBannerModal] = useState(null);
  const [editPromoBannerModal, setEditPromoBannerModal] = useState(null);
  const [addInstagramModal, setAddInstagramModal] = useState(null);
  const [addSpotlightModal, setAddSpotlightModal] = useState(null);
  const [addOccasionModal, setAddOccasionModal] = useState(null);
  const [addCollectionModal, setAddCollectionModal] = useState(null);

  // Drag and drop state for layout reordering
  const [draggedIdx, setDraggedIdx] = useState(null);
  const [dragOverIdx, setDragOverIdx] = useState(null);

  // Hero Slider editing state
  const [activeHeroSlideIdx, setActiveHeroSlideIdx] = useState(0);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const currentSection = useMemo(() => {
    return draftSections.find(s => s.id === activeTab);
  }, [draftSections, activeTab]);

  // STRUCTURAL tabs always shown regardless of visibility
  const STRUCTURAL_TAB_IDS = useMemo(() => new Set(['layout']), []);

  // Build visible tabs dynamically: always show Layout, then only ENABLED sections
  const topTabs = useMemo(() => {
    const sectionTabMap = {
      announcement:  { label: 'Announcement Bar',      icon: LayoutTemplate },
      hero:          { label: 'Hero Slider',            icon: ImagePlay },
      categories:    { label: 'Shop By Category',       icon: Grid3x3 },
      'new-arrivals':{ label: 'New Arrivals',           icon: Sparkles },
      'best-sellers':{ label: 'Best Sellers',           icon: TrendingUp },
      'promo-banners':{ label: 'Promo Banners',         icon: Image },
      'promo-banner-1':{ label: 'Promo Banner 1',       icon: Image },
      'promo-banner-3':{ label: 'Promo Banner 3',       icon: Image },
      'promo-banner-2':{ label: 'Promo Banner 2',       icon: Image },
      trending:      { label: 'Trending Now',           icon: TrendingUp },
      occasion:      { label: 'Shop By Occasion',       icon: ShoppingBag },

      testimonials:  { label: 'Testimonials',           icon: Star },
      instagram:     { label: 'Instagram',              icon: Instagram },
      'four-pillars':{ label: 'Benefits & Four Pillars',icon: Gift },
      footer:        { label: 'Footer',                 icon: Phone },
    };

    const enabledCount = draftSections.filter(s => s.enabled !== false && s.active !== false).length;
    const layoutTab = {
      id: 'layout',
      label: 'Homepage Layout & Order',
      icon: Layers,
      badge: `${enabledCount} Active`,
    };

    // Section tabs: only sections that are enabled
    const sectionTabs = draftSections
      .filter(s => s.enabled !== false && s.active !== false)
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .map(s => ({
        id: s.id,
        label: sectionTabMap[s.id]?.label || s.label,
        icon: sectionTabMap[s.id]?.icon || Layers,
      }))
      .filter(t => sectionTabMap[t.id]); // only known section ids

    return [layoutTab, ...sectionTabs];
  }, [draftSections]);

  // Count of hidden sections for the hint
  const hiddenSectionCount = useMemo(
    () => draftSections.filter(s => s.enabled === false || s.active === false).length,
    [draftSections]
  );

  // If the active tab's section gets hidden, fall back to the Layout overview
  useEffect(() => {
    if (activeTab === 'layout') return;
    const validIds = new Set(topTabs.map(t => t.id));
    if (!validIds.has(activeTab)) {
      setActiveTab('layout');
    }
  }, [topTabs, activeTab]);

  // ── Actions ──
  const handleSaveDraft = async () => {
    const res = await saveDraft();
    if (res.success) {
      showToast('Draft content saved successfully.');
    } else {
      showToast('Failed to save draft.');
    }
  };

  const handlePreviewStore = async (e) => {
    if (e) e.preventDefault();
    await saveDraft();
    window.open('/?preview=true', '_blank');
  };

  const handlePublish = async () => {
    const publisher = admin?.name || 'Aditi Sharma';
    const res = await publishChanges(publisher);
    setIsPublishModalOpen(false);
    if (res.success) {
      showToast('Homepage changes published successfully.');
    } else {
      showToast('Failed to publish changes.');
    }
  };

  const handlePromptReset = () => {
    setConfirmModal({
      title: 'Reset Homepage Content',
      message: 'Are you sure you want to reset all 16 homepage sections back to the initial default state? All unpublished drafts will be discarded.',
      confirmLabel: 'Reset Defaults',
      variant: 'danger',
      onConfirm: async () => {
        await resetContent();
        showToast('Homepage content reset to defaults successfully.');
      },
    });
  };

  const handleAddHeroSlide = () => {
    const heroSec = draftSections.find(s => s.id === 'hero');
    const existingSlides = heroSec?.content?.slides || [];
    const newSlideNum = existingSlides.length + 1;

    const slidePresets = [
      {
        eyebrow: 'NEW COLLECTION',
        headingLine1: 'Grace in',
        headingLine2: 'Every Drape.',
        subtitle: 'Intricate embroideries, premium organza, and festive silk collections.',
        mainImage: sareeGolden,
        detailImageLeft: sareeBeigeMaroon,
        detailImageRight: sareeBeigeOrange,
        accentBg: '#EBF5F5',
      },
      {
        eyebrow: 'HERITAGE LEHENGAS',
        headingLine1: 'Royal',
        headingLine2: 'Celebrations.',
        subtitle: 'Experience royalty in our signature sequin & velvet bridal lehengas.',
        mainImage: lehengaRed,
        detailImageLeft: lehengaPink,
        detailImageRight: lehengaMint,
        accentBg: '#FDF2F4',
      },
      {
        eyebrow: 'FESTIVE EDIT',
        headingLine1: 'Contemporary',
        headingLine2: 'Silhouettes.',
        subtitle: 'Modern cuts rooted in Indian tradition, designed for everyday and festive celebrations.',
        mainImage: kurtiTealPrinted,
        detailImageLeft: kurtiPurplePrinted,
        detailImageRight: kurtiBrownPrinted,
        accentBg: '#F4F7F6',
      },
      {
        eyebrow: 'BRIDAL LUXURY',
        headingLine1: 'Handcrafted',
        headingLine2: 'Elegance.',
        subtitle: 'Exclusive heritage drapes and bespoke festive suits crafted to perfection.',
        mainImage: sareeBeigePink,
        detailImageLeft: sareeBeigeMaroonFull,
        detailImageRight: sareeBeigeMaroonFull2,
        accentBg: '#FFF7ED',
      },
    ];

    const preset = slidePresets[(newSlideNum - 1) % slidePresets.length];

    setAddSlideModal({
      eyebrow: preset.eyebrow,
      headingLine1: preset.headingLine1,
      headingLine2: preset.headingLine2,
      subtitle: preset.subtitle,
      ctaText: 'SHOP NOW',
      ctaLink: '/products',
      secondaryCtaText: 'VIEW ALL',
      secondaryCtaLink: '/products',
      mainImage: preset.mainImage,
      detailImageLeft: preset.detailImageLeft,
      detailImageRight: preset.detailImageRight,
      accentBg: preset.accentBg,
    });
  };

  const handleConfirmAddSlide = () => {
    if (!addSlideModal) return;
    const heroSec = draftSections.find(s => s.id === 'hero');
    const existingSlides = heroSec?.content?.slides || [];

    const newSlide = {
      id: Date.now(),
      eyebrow: addSlideModal.eyebrow?.trim() || 'NEW COLLECTION',
      headingLine1: addSlideModal.headingLine1?.trim() || 'Grace in',
      headingLine2: addSlideModal.headingLine2?.trim() || 'Every Drape.',
      subtitle: addSlideModal.subtitle?.trim() || 'Intricate embroideries, premium organza, and festive silk collections.',
      ctaText: addSlideModal.ctaText?.trim() || 'SHOP NOW',
      ctaLink: addSlideModal.ctaLink?.trim() || '/products',
      secondaryCtaText: addSlideModal.secondaryCtaText?.trim() || '',
      secondaryCtaLink: addSlideModal.secondaryCtaLink?.trim() || '/products',
      mainImage: addSlideModal.mainImage || sareeGolden,
      detailImageLeft: addSlideModal.detailImageLeft || sareeBeigeMaroon,
      detailImageRight: addSlideModal.detailImageRight || sareeBeigeOrange,
      mainLabel: `${addSlideModal.headingLine1 || ''} ${addSlideModal.headingLine2 || ''}`.trim() || 'New Collection',
      leftEyebrow: 'DETAILS',
      leftTitle: 'Handcrafted\ndetails',
      rightEyebrow: 'THE EDIT',
      rightTitle: 'Festive\nsilhouettes',
      accentBg: addSlideModal.accentBg || '#EBF5F5',
      enabled: true,
    };

    const queuedSlides = [...existingSlides, newSlide];
    updateSectionContent('hero', { slides: queuedSlides });
    setActiveHeroSlideIdx(queuedSlides.length - 1);
    setAddSlideModal(null);
    showToast(`Slide #${queuedSlides.length} added successfully!`);
  };

  const handleSaveEditPromoBanner = () => {
    if (!editPromoBannerModal) return;
    const { bannerId, bannerNum, title, subtitle, ctaText, ctaLink, description, image } = editPromoBannerModal;
    const fields = {
      title,
      headline: title,
      subtitle,
      ctaText,
      ctaLink,
      description,
      image,
    };
    updateSectionContent(bannerId, fields);

    const legacySec = draftSections.find((s) => s.id === 'promo-banners');
    if (legacySec && (bannerNum === 1 || bannerNum === 2)) {
      const curBanners = legacySec.content?.banners || [];
      const updated = [...curBanners];
      updated[bannerNum - 1] = { ...(updated[bannerNum - 1] || {}), ...fields };
      updateSectionContent('promo-banners', { banners: updated });
    }

    setEditPromoBannerModal(null);
    showToast(`Promo Banner ${bannerNum} updated successfully.`);
  };

  // Drag & drop handlers for layout overview (Footer is locked and non-movable)
  const handleDragStart = (e, index) => {
    if (draftSections[index]?.id === 'footer') {
      e.preventDefault();
      return;
    }
    setDraggedIdx(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draftSections[index]?.id === 'footer') return;
    setDragOverIdx(index);
  };

  const handleDrop = (e, index) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === index) return;
    if (draftSections[draggedIdx]?.id === 'footer' || draftSections[index]?.id === 'footer') return;
    const reordered = [...draftSections];
    const [moved] = reordered.splice(draggedIdx, 1);
    reordered.splice(index, 0, moved);
    reorderSections(reordered);
    setDraggedIdx(null);
    setDragOverIdx(null);
    showToast('Section order updated.');
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-12">
        <AppLoader minHeight="min-h-[360px]" message="Loading storefront content & section configurations..." />
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="bg-white rounded-2xl border border-rose-200 p-8 text-center space-y-4 shadow-sm">
        <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
          <AlertTriangle size={24} />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Content Management Access Restricted</h2>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Your current administrative role does not have permission to modify storefront content. Please contact a Super Admin or Content Manager.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative pb-20 font-sans">
      {/* ── Toast Notification ── */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-slate-900 text-white px-5 py-3.5 rounded-xl shadow-2xl border border-slate-700 animate-[fadeInUp_0.25s_ease-out]">
          <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
            <Check size={14} />
          </div>
          <span className="text-xs font-semibold">{toast}</span>
        </div>
      )}

      {/* ── Page Header with Status & Top Actions ── */}
      <AdminPageHeader
        title="Content Management"
        subtitle="Manage the content shown across the Suka Fashions storefront."
      >
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          {/* Status Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border bg-white shadow-2xs">
            <span
              className={`w-2 h-2 rounded-full ${
                status === 'DRAFT' ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'
              }`}
            />
            <div className="text-[11px] leading-tight">
              <span className="font-bold text-slate-800">
                {status === 'DRAFT' ? 'DRAFT CHANGES' : 'PUBLISHED'}
              </span>
              <span className="text-[10px] text-slate-400 block">
                Last: {lastPublishedAt}
              </span>
            </div>
          </div>

          {/* Version History Button */}
          <button
            onClick={() => setIsHistoryModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-50 transition-colors shadow-2xs bg-white cursor-pointer"
            title="View content version history"
          >
            <History size={13} /> History
          </button>

          {/* Preview Store Button */}
          <button
            type="button"
            onClick={handlePreviewStore}
            className="flex items-center gap-1.5 px-3.5 py-2 border border-brand-teal/40 text-xs font-bold text-brand-teal bg-brand-powder/40 hover:bg-brand-powder rounded-xl transition-all shadow-2xs cursor-pointer"
            title="Preview latest unpublished draft changes on storefront"
          >
            <Eye size={13} /> Preview Store
          </button>

          {/* Open Live Store Button */}
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 border border-slate-200 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-50 transition-colors shadow-2xs bg-white"
          >
            <ExternalLink size={13} /> Live Store
          </a>

          {/* Save Draft Button */}
          <button
            onClick={handleSaveDraft}
            className="flex items-center gap-1.5 px-3.5 py-2 border border-slate-300 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 rounded-xl transition-all shadow-2xs cursor-pointer"
          >
            <Save size={13} /> Save Draft
          </button>

          {/* Publish Changes Button */}
          <button
            onClick={() => setIsPublishModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm hover:shadow cursor-pointer"
          >
            <Send size={13} /> Publish Changes
          </button>
        </div>
      </AdminPageHeader>

      {/* ── Navigation Tabs Grid (wraps naturally, no horizontal scroll) ── */}
      <div className="flex flex-wrap gap-2">
        {topTabs.map((tab) => {
          const TabIcon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white text-slate-700 border border-slate-200/80 hover:bg-slate-50 hover:border-slate-300 shadow-2xs'
              }`}
            >
              <TabIcon size={14} className={isActive ? 'text-emerald-400' : 'text-slate-500'} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  isActive ? 'bg-slate-800 text-emerald-300' : 'bg-slate-100 text-slate-600'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Hidden sections hint */}
        {hiddenSectionCount > 0 && (
          <button
            onClick={() => setActiveTab('layout')}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-medium whitespace-nowrap bg-slate-50 text-slate-400 border border-dashed border-slate-200 hover:border-slate-300 hover:text-slate-600 transition-all cursor-pointer"
            title="Hidden sections are not shown here. Open Homepage Layout to enable them."
          >
            <EyeOff size={13} />
            <span>{hiddenSectionCount} section{hiddenSectionCount > 1 ? 's' : ''} hidden — enable in Layout</span>
          </button>
        )}
      </div>

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* ─── TAB: HOMEPAGE LAYOUT & SECTION ORDER OVERVIEW ─── */}
      {/* ════════════════════════════════════════════════════════════════ */}
      {activeTab === 'layout' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">Homepage Sections & Display Order</h2>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                  {draftSections.length} Manageable Sections
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 max-w-2xl">
                Enable or disable sections, then click Edit to customize individual section content.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={handlePromptReset}
                className="flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 text-xs font-semibold text-slate-600 hover:text-red-600 hover:border-red-200 rounded-xl hover:bg-red-50/50 transition-colors shadow-2xs cursor-pointer bg-white"
              >
                <RotateCcw size={13} /> Reset Defaults
              </button>
            </div>
          </div>

          {/* Section List Table / Cards */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="divide-y divide-slate-100">
              {draftSections.map((sec, idx) => {
                const isEnabled = sec.enabled !== false && sec.active !== false;
                const isFixed = sec.id === 'footer';

                return (
                  <div
                    key={sec.id}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:bg-slate-50/50"
                  >
                    {/* Left: Order Number, Title & Info */}
                    <div className="flex items-center gap-3.5 min-w-0">

                      {/* Order Badge */}
                      <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center flex-shrink-0">
                        {idx + 1}
                      </div>

                      {/* Section Info */}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-sm text-slate-900">{sec.label}</span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                              isEnabled
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-slate-100 text-slate-500 border border-slate-200'
                            }`}
                          >
                            {isEnabled ? 'Active' : 'Hidden'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 truncate mt-0.5">{sec.desc}</p>
                      </div>
                    </div>

                    {/* Right: Visibility Toggle & Edit Button */}
                    <div className="flex items-center gap-2 sm:gap-3 self-end sm:self-center flex-shrink-0">

                      {/* Visibility Toggle Button (hidden for fixed footer) */}
                      {!isFixed && (
                        <button
                          onClick={() => {
                            toggleSection(sec.id);
                            showToast(`"${sec.label}" visibility toggled.`);
                          }}
                          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                            isEnabled
                              ? 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                              : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          {isEnabled ? <Eye size={13} /> : <EyeOff size={13} />}
                          <span>{isEnabled ? 'Visible on Store' : 'Hidden'}</span>
                        </button>
                      )}

                      {/* Remove Section Button (hidden for fixed footer) */}
                      {!isFixed && (
                        <button
                          type="button"
                          onClick={() => {
                            setConfirmModal({
                              title: `Remove "${sec.label}" Section`,
                              message: `Are you sure you want to remove the "${sec.label}" section from the homepage?`,
                              confirmLabel: 'Remove Section',
                              variant: 'danger',
                              onConfirm: () => {
                                deleteSection(sec.id);
                                showToast(`"${sec.label}" section removed.`);
                              },
                            });
                          }}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                          title="Remove Section"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}

                      {/* Edit Section Button */}
                      <button
                        onClick={() => setActiveTab(sec.id)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-all shadow-xs cursor-pointer"
                      >
                        <Edit size={12} /> Edit
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* ─── TAB: ANNOUNCEMENT BAR (SECTION 1) ─── */}
      {/* ════════════════════════════════════════════════════════════════ */}
      {activeTab === 'announcement' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Announcement Bar Settings</h2>
              <p className="text-xs text-slate-500 mt-0.5">Control header alert messages, speed, and brand-safe color theme.</p>
            </div>
            <button
              onClick={() => toggleSection('announcement')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border cursor-pointer ${
                currentSection?.enabled !== false ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'
              }`}
            >
              {currentSection?.enabled !== false ? 'Enabled' : 'Disabled'}
            </button>
          </div>

          <div className="max-w-md">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Color Theme Preset
            </label>
            <select
              value={currentSection?.content?.theme || 'default'}
              onChange={(e) => updateSectionContent('announcement', { theme: e.target.value })}
              className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 bg-white focus:outline-none focus:border-brand-teal"
            >
              <option value="default">Default Teal (Brand Signature)</option>
              <option value="light">Light (Soft Cream & Navy)</option>
              <option value="dark">Dark (Deep Midnight Navy)</option>
            </select>
          </div>

          <div className="space-y-4 pt-2">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Announcement Messages (3 Max)</h3>
            {(currentSection?.content?.items || []).map((item, idx) => (
              <div key={item.id || idx} className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <span className="text-xs font-bold text-slate-400 w-6">#{idx + 1}</span>
                <input
                  type="text"
                  value={item.text}
                  onChange={(e) => {
                    const newItems = [...(currentSection?.content?.items || [])];
                    newItems[idx] = { ...newItems[idx], text: e.target.value };
                    updateSectionContent('announcement', { items: newItems });
                  }}
                  className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 font-medium"
                  placeholder="e.g. FREE SHIPPING ABOVE ₹1999"
                />
                <select
                  value={item.icon || 'Truck'}
                  onChange={(e) => {
                    const newItems = [...(currentSection?.content?.items || [])];
                    newItems[idx] = { ...newItems[idx], icon: e.target.value };
                    updateSectionContent('announcement', { items: newItems });
                  }}
                  className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800"
                >
                  <option value="Truck">Truck (Delivery)</option>
                  <option value="RefreshCcw">RefreshCcw (Returns)</option>
                  <option value="Banknote">Banknote (Cash on Delivery)</option>
                  <option value="Sparkles">Sparkles (Festive Offer)</option>
                  <option value="Tag">Tag (Discount)</option>
                  <option value="Award">Award (Quality)</option>
                </select>
                <button
                  type="button"
                  onClick={() => {
                    const newItems = [...(currentSection?.content?.items || [])];
                    newItems[idx] = { ...newItems[idx], enabled: !newItems[idx].enabled };
                    updateSectionContent('announcement', { items: newItems });
                  }}
                  className={`px-3 py-2 rounded-lg text-xs font-bold border cursor-pointer ${
                    item.enabled !== false ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-500 border-slate-200'
                  }`}
                >
                  {item.enabled !== false ? 'Active' : 'Disabled'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* ─── TAB: HERO SLIDER (SECTION 2 WITH LIVE PREVIEW) ─── */}
      {/* ════════════════════════════════════════════════════════════════ */}
      {activeTab === 'hero' && (
        <div className="space-y-6">
          {/* Header & Controls */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Hero Slider Editor & Live Preview</h2>
                <p className="text-xs text-slate-500 mt-0.5">Customize hero slides, imagery, and button actions with real-time preview.</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleAddHeroSlide}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer active:scale-95"
                  title="Add a new hero slide"
                >
                  <Plus size={13} /> Add Slide
                </button>
              </div>
            </div>

            {/* Slide Selection Pills (Stack Order: Slide 1 is Top of Stack) */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {(currentSection?.content?.slides || []).map((slide, sIdx) => (
                <button
                  key={slide.id || sIdx}
                  onClick={() => setActiveHeroSlideIdx(sIdx)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    activeHeroSlideIdx === sIdx
                      ? 'bg-brand-teal text-white shadow-sm ring-2 ring-brand-teal/20'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <span>Slide {sIdx + 1}</span>
                  <span className={`w-2 h-2 rounded-full ${slide.enabled !== false ? 'bg-emerald-300' : 'bg-rose-300'}`} />
                </button>
              ))}
            </div>
          </div>

          {/* ── LIVE HERO PREVIEW COMPONENT ── */}
          {(() => {
            const currentSlides = currentSection?.content?.slides || [];
            const slide = currentSlides[activeHeroSlideIdx] || currentSlides[0] || {};
            const headingLines = slide.headingLine1 || slide.headingLine2
              ? [slide.headingLine1 || '', slide.headingLine2 || '']
              : ['Grace in', 'Every Drape.'];

            return (
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2 text-indigo-900 text-xs font-bold uppercase tracking-wider">
                    <Sparkles size={14} className="text-indigo-600" />
                    <span>LIVE HERO PREVIEW (SLIDE {activeHeroSlideIdx + 1})</span>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                    Live Reactive
                  </span>
                </div>

                {/* Scaled Preview Box */}
                <div
                  className="rounded-xl border border-slate-200 overflow-hidden relative p-6 sm:p-8"
                  style={{ background: `linear-gradient(140deg, #FAFAF8 52%, ${slide.accentBg || '#EBF5F5'} 100%)` }}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-6 items-center">
                    {/* Left text */}
                    <div className="space-y-3">
                      <span className="text-[10px] font-bold tracking-[0.25em] text-brand-teal uppercase block">
                        {slide.eyebrow || 'FESTIVE COUTURE'}
                      </span>
                      <h3 className="font-serif text-2xl sm:text-4xl text-brand-navy leading-tight">
                        {headingLines.join(' ')}
                      </h3>
                      <p className="text-xs text-brand-navy/70 leading-relaxed max-w-sm">
                        {slide.subtitle || 'Experience exquisite weaves and handcrafted bridal luxury.'}
                      </p>
                      <div className="flex items-center gap-2 pt-2 min-h-[34px]">
                        {slide.ctaText?.trim() ? (
                          <span className="bg-brand-teal text-white text-[10px] font-bold uppercase tracking-wider py-2 px-4 rounded-sm">
                            {slide.ctaText}
                          </span>
                        ) : null}
                        {slide.secondaryCtaText?.trim() ? (
                          <span className="border border-brand-navy/30 text-brand-navy text-[10px] font-bold uppercase tracking-wider py-2 px-3 rounded-sm bg-white/60">
                            {slide.secondaryCtaText}
                          </span>
                        ) : null}
                      </div>
                    </div>

                    {/* Right Card Trio Preview */}
                    <div className="flex items-center justify-center gap-2 relative h-48 sm:h-56">
                      <img
                        src={slide.detailImageLeft || sareeBeigeMaroon}
                        alt="Left detail"
                        className="w-20 h-32 object-cover rounded-lg shadow-md border border-white"
                      />
                      <img
                        src={slide.mainImage || sareeGolden}
                        alt="Main preview"
                        className="w-32 h-48 object-cover rounded-xl shadow-xl border-2 border-white z-10 scale-105"
                      />
                      <img
                        src={slide.detailImageRight || sareeBeigeOrange}
                        alt="Right detail"
                        className="w-20 h-32 object-cover rounded-lg shadow-md border border-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* ── CURRENT SLIDE FORM EDITOR ── */}
          {(() => {
            const currentSlides = currentSection?.content?.slides || [];
            const slide = currentSlides[activeHeroSlideIdx];
            if (!slide) return null;

            const updateCurrentSlide = (fields) => {
              const updatedSlides = currentSlides.map((s, idx) =>
                idx === activeHeroSlideIdx ? { ...s, ...fields } : s
              );
              updateSectionContent('hero', { slides: updatedSlides });
            };

            return (
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2.5">
                    <h3 className="font-bold text-slate-900 text-sm">Editing Slide #{activeHeroSlideIdx + 1}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Slide Reordering Controls */}
                    {currentSlides.length > 1 && (
                      <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white shadow-2xs mr-1">
                        <button
                          type="button"
                          disabled={activeHeroSlideIdx === 0}
                          onClick={() => {
                            const newSlides = [...currentSlides];
                            const [moved] = newSlides.splice(activeHeroSlideIdx, 1);
                            newSlides.splice(activeHeroSlideIdx - 1, 0, moved);
                            updateSectionContent('hero', { slides: newSlides });
                            setActiveHeroSlideIdx(activeHeroSlideIdx - 1);
                            showToast('Slide order updated.');
                          }}
                          className="p-1.5 hover:bg-slate-100 text-slate-600 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                          title="Move Up"
                        >
                          <ArrowUp size={13} />
                        </button>
                        <div className="w-px h-4 bg-slate-200" />
                        <button
                          type="button"
                          disabled={activeHeroSlideIdx === currentSlides.length - 1}
                          onClick={() => {
                            const newSlides = [...currentSlides];
                            const [moved] = newSlides.splice(activeHeroSlideIdx, 1);
                            newSlides.splice(activeHeroSlideIdx + 1, 0, moved);
                            updateSectionContent('hero', { slides: newSlides });
                            setActiveHeroSlideIdx(activeHeroSlideIdx + 1);
                            showToast('Slide order updated.');
                          }}
                          className="p-1.5 hover:bg-slate-100 text-slate-600 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                          title="Move Down"
                        >
                          <ArrowDown size={13} />
                        </button>
                      </div>
                    )}

                    <button
                      onClick={() => updateCurrentSlide({ enabled: slide.enabled === false ? true : false })}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border cursor-pointer ${
                        slide.enabled !== false ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-500 border-slate-200'
                      }`}
                    >
                      {slide.enabled !== false ? 'Slide Active' : 'Slide Hidden'}
                    </button>
                    {currentSlides.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const slideTitle = slide.headingLine1 || slide.eyebrow || `Slide #${activeHeroSlideIdx + 1}`;
                          setConfirmModal({
                            title: `Delete Slide #${activeHeroSlideIdx + 1}`,
                            message: `Are you sure you want to delete "${slideTitle}"? This slide will be removed from your homepage slider.`,
                            confirmLabel: 'Delete Slide',
                            variant: 'danger',
                            onConfirm: () => {
                              const filtered = currentSlides.filter((_, idx) => idx !== activeHeroSlideIdx);
                              updateSectionContent('hero', { slides: filtered });
                              setActiveHeroSlideIdx(Math.max(0, activeHeroSlideIdx - 1));
                              showToast('Slide deleted successfully.');
                            },
                          });
                        }}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete Slide"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Form Fields Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Eyebrow Tag
                    </label>
                    <input
                      type="text"
                      value={slide.eyebrow || ''}
                      onChange={(e) => updateCurrentSlide({ eyebrow: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 bg-white"
                      placeholder="e.g. FESTIVE COUTURE"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Social Proof Text
                    </label>
                    <input
                      type="text"
                      value={currentSection?.content?.socialProofText || 'Loved by 10,000+ Women'}
                      onChange={(e) => updateSectionContent('hero', { socialProofText: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Heading Line 1
                    </label>
                    <input
                      type="text"
                      value={slide.headingLine1 || ''}
                      onChange={(e) => updateCurrentSlide({ headingLine1: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 bg-white"
                      placeholder="e.g. Grace in"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Heading Line 2
                    </label>
                    <input
                      type="text"
                      value={slide.headingLine2 || ''}
                      onChange={(e) => updateCurrentSlide({ headingLine2: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 bg-white"
                      placeholder="e.g. Every Drape."
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Subtitle / Description
                    </label>
                    <textarea
                      rows={2}
                      value={slide.subtitle || ''}
                      onChange={(e) => updateCurrentSlide({ subtitle: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 bg-white"
                      placeholder="Enter editorial description..."
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                      <span>Primary Button Text</span>
                      <span className="text-[10px] font-normal text-slate-400 lowercase">(clear to remove button)</span>
                    </label>
                    <input
                      type="text"
                      value={slide.ctaText || ''}
                      onChange={(e) => updateCurrentSlide({ ctaText: e.target.value })}
                      placeholder="e.g. SHOP NEW ARRIVALS"
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Primary Button Link
                    </label>
                    <input
                      type="text"
                      value={slide.ctaLink || ''}
                      onChange={(e) => updateCurrentSlide({ ctaLink: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 bg-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                      <span>Secondary Button Text</span>
                      <span className="text-[10px] font-normal text-slate-400 lowercase">(clear to remove button)</span>
                    </label>
                    <input
                      type="text"
                      value={slide.secondaryCtaText || ''}
                      onChange={(e) => updateCurrentSlide({ secondaryCtaText: e.target.value })}
                      placeholder="e.g. EXPLORE SAREES"
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Secondary Button Link
                    </label>
                    <input
                      type="text"
                      value={slide.secondaryCtaLink || ''}
                      onChange={(e) => updateCurrentSlide({ secondaryCtaLink: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 bg-white font-mono"
                    />
                  </div>
                </div>

                {/* ── Images Selection Row with Dimensions Guidance ── */}
                <div className="pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Hero Slide Images</h4>
                    <span className="text-[11px] text-slate-500 font-medium">Recommended aspect ratio: Portrait 4:5</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Main Image */}
                    <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
                      <span className="text-[11px] font-bold text-slate-700 block">Main Center Image (1200×1500)</span>
                      <div className="aspect-[3/4] rounded-lg overflow-hidden border border-slate-200 bg-white">
                        <img src={slide.mainImage} alt="Main" className="w-full h-full object-cover" />
                      </div>
                      <button
                        onClick={() => setImageModal({
                          title: 'Select Main Hero Image',
                          currentUrl: slide.mainImage,
                          onSelect: (url) => updateCurrentSlide({ mainImage: url }),
                        })}
                        className="w-full py-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50 cursor-pointer shadow-2xs"
                      >
                        Change Image
                      </button>
                    </div>

                    {/* Left Detail Image */}
                    <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
                      <span className="text-[11px] font-bold text-slate-700 block">Left Supporting (800×1000)</span>
                      <div className="aspect-[3/4] rounded-lg overflow-hidden border border-slate-200 bg-white">
                        <img src={slide.detailImageLeft} alt="Left" className="w-full h-full object-cover" />
                      </div>
                      <button
                        onClick={() => setImageModal({
                          title: 'Select Left Supporting Image',
                          currentUrl: slide.detailImageLeft,
                          onSelect: (url) => updateCurrentSlide({ detailImageLeft: url }),
                        })}
                        className="w-full py-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50 cursor-pointer shadow-2xs"
                      >
                        Change Image
                      </button>
                    </div>

                    {/* Right Detail Image */}
                    <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
                      <span className="text-[11px] font-bold text-slate-700 block">Right Supporting (800×1000)</span>
                      <div className="aspect-[3/4] rounded-lg overflow-hidden border border-slate-200 bg-white">
                        <img src={slide.detailImageRight} alt="Right" className="w-full h-full object-cover" />
                      </div>
                      <button
                        onClick={() => setImageModal({
                          title: 'Select Right Supporting Image',
                          currentUrl: slide.detailImageRight,
                          onSelect: (url) => updateCurrentSlide({ detailImageRight: url }),
                        })}
                        className="w-full py-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50 cursor-pointer shadow-2xs"
                      >
                        Change Image
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* ─── TAB: SHOP BY CATEGORY (SECTION 3) ─── */}
      {/* ════════════════════════════════════════════════════════════════ */}
      {activeTab === 'categories' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Shop By Category Configuration</h2>
              <p className="text-xs text-slate-500 mt-0.5">Manage circular category bubbles, titles, images, and target routes.</p>
            </div>
            <button
              onClick={() => {
                setAddCategoryTileModal({
                  name: '',
                  link: '',
                  image: '',
                  themeColor: 'Teal Elegance',
                });
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
            >
              <Plus size={13} /> Add Category Tile
            </button>
          </div>

          {/* Tiles Grid / Table */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {(currentSection?.content?.tiles || []).map((tile, tIdx) => (
              <div key={tile.id || tIdx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400">#{tIdx + 1}</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        const updated = (currentSection?.content?.tiles || []).map((t, idx) =>
                          idx === tIdx ? { ...t, enabled: t.enabled === false ? true : false } : t
                        );
                        updateSectionContent('categories', { tiles: updated });
                      }}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border cursor-pointer ${
                        tile.enabled !== false ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-500 border-slate-200'
                      }`}
                    >
                      {tile.enabled !== false ? 'Active' : 'Hidden'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditCategoryTileModal({
                          index: tIdx,
                          id: tile.id,
                          name: tile.name || '',
                          link: tile.link || '',
                          image: tile.image || sareeGolden,
                          themeColor: tile.themeColor || 'Teal Elegance',
                        });
                      }}
                      className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded transition-colors cursor-pointer"
                      title="Edit Category Tile"
                    >
                      <Edit size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setConfirmModal({
                          title: `Delete Category "${tile.name || `Tile #${tIdx + 1}`}"`,
                          message: `Are you sure you want to delete this category tile? This action cannot be undone.`,
                          confirmLabel: 'Delete Tile',
                          variant: 'danger',
                          onConfirm: () => {
                            const filtered = (currentSection?.content?.tiles || []).filter((_, idx) => idx !== tIdx);
                            updateSectionContent('categories', { tiles: filtered });
                            showToast('Category tile deleted.');
                          },
                        });
                      }}
                      className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors cursor-pointer"
                      title="Delete Category Tile"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                {/* Circle Image & Selector */}
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full overflow-hidden border border-slate-200 bg-white flex-shrink-0">
                    <img src={tile.image} alt={tile.name} className="w-full h-full object-cover" />
                  </div>
                  <button
                    onClick={() => setImageModal({
                      title: `Select Image for ${tile.name}`,
                      currentUrl: tile.image,
                      onSelect: (url) => {
                        const updated = (currentSection?.content?.tiles || []).map((t, idx) =>
                          idx === tIdx ? { ...t, image: url } : t
                        );
                        updateSectionContent('categories', { tiles: updated });
                      }
                    })}
                    className="text-xs font-semibold text-brand-teal hover:underline"
                  >
                    Change Image
                  </button>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Display Name</label>
                  <input
                    type="text"
                    value={tile.name}
                    onChange={(e) => {
                      const updated = (currentSection?.content?.tiles || []).map((t, idx) =>
                        idx === tIdx ? { ...t, name: e.target.value } : t
                      );
                      updateSectionContent('categories', { tiles: updated });
                    }}
                    className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 bg-white font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Target Route</label>
                  <input
                    type="text"
                    value={tile.link || ''}
                    onChange={(e) => {
                      const updated = (currentSection?.content?.tiles || []).map((t, idx) =>
                        idx === tIdx ? { ...t, link: e.target.value } : t
                      );
                      updateSectionContent('categories', { tiles: updated });
                    }}
                    className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 bg-white font-mono"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* ─── TAB: NEW ARRIVALS & BEST SELLERS (SECTIONS 4 & 5) ─── */}
      {/* ════════════════════════════════════════════════════════════════ */}
      {(activeTab === 'new-arrivals' || activeTab === 'best-sellers') && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {activeTab === 'new-arrivals' ? 'New Arrivals Showcase' : 'Best Sellers Showcase'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Switch between Automatic (catalog flag driven) and Manual (specific curated product IDs).
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleSection(activeTab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border cursor-pointer ${
                  currentSection?.enabled !== false ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}
              >
                {currentSection?.enabled !== false ? 'Section Visible' : 'Section Hidden'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Section Eyebrow
              </label>
              <input
                type="text"
                value={currentSection?.content?.eyebrow || ''}
                onChange={(e) => updateSectionContent(activeTab, { eyebrow: e.target.value })}
                className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Section Heading
              </label>
              <input
                type="text"
                value={currentSection?.content?.title || ''}
                onChange={(e) => updateSectionContent(activeTab, { title: e.target.value })}
                className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Data Mode
              </label>
              <select
                value={currentSection?.content?.dataMode || 'Automatic'}
                onChange={(e) => updateSectionContent(activeTab, { dataMode: e.target.value })}
                className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 bg-white font-bold"
              >
                <option value="Automatic">Automatic (Live isNew / isBestSeller flag)</option>
                <option value="Manual">Manual (Select Specific Product IDs)</option>
              </select>
            </div>
          </div>

          {/* Product Picker & ID List */}
          <div className="pt-4 border-t border-slate-100 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Selected Catalog Products</h3>
                <p className="text-xs text-slate-500">
                  {currentSection?.content?.dataMode === 'Automatic'
                    ? 'In Automatic mode, products marked with appropriate badges in Product Catalog will automatically display.'
                    : 'Curate exact product order for this showcase.'}
                </p>
              </div>

              <button
                onClick={() => setProductPickerModal({
                  sectionId: activeTab,
                  selectedIds: currentSection?.content?.selectedProductIds || [],
                })}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
              >
                <Plus size={13} /> Select Products
              </button>
            </div>

            {/* Product IDs Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
              {(currentSection?.content?.selectedProductIds || []).map((pId) => {
                const pObj = products.find(p => p.id === pId || p.slug === pId);
                const imgSrc = pObj?.colors?.[0]?.images?.[0]?.url || sareeGolden;

                return (
                  <div key={pId} className="p-3 rounded-xl border border-slate-200 bg-slate-50/60 relative group">
                    <div className="aspect-[3/4] rounded-lg overflow-hidden bg-white mb-2 border border-slate-200">
                      <img src={imgSrc} alt={pObj?.name || pId} className="w-full h-full object-cover" />
                    </div>
                    <span className="text-xs font-bold text-slate-800 block truncate">{pObj?.name || pId}</span>
                    <span className="text-[10px] text-slate-400 block font-mono">{pId}</span>
                    <button
                      onClick={() => {
                        const filtered = (currentSection?.content?.selectedProductIds || []).filter(id => id !== pId);
                        updateSectionContent(activeTab, { selectedProductIds: filtered });
                      }}
                      className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/90 text-red-600 shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <X size={12} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB: PROMOTIONAL BANNERS (2 INDEPENDENT SECTIONS) ─── */}
      {/* ════════════════════════════════════════════════════════════════ */}
      {(activeTab === 'promo-banners' || activeTab === 'promo-banner-1' || activeTab === 'promo-banner-2' || activeTab === 'promo-banner-3') && (() => {
        const isBanner3Tab = activeTab === 'promo-banner-3';
        const isBanner2Tab = activeTab === 'promo-banner-2';
        const activeBannerId = isBanner3Tab ? 'promo-banner-3' : isBanner2Tab ? 'promo-banner-2' : 'promo-banner-1';
        const bannerNum = isBanner3Tab ? 3 : isBanner2Tab ? 2 : 1;

        const bannerSection = draftSections.find(s => s.id === activeBannerId);
        const legacySec = draftSections.find(s => s.id === 'promo-banners');
        const bannerSecIdx = draftSections.findIndex(s => s.id === activeBannerId);

        // Fallback banner defaults
        const defaultBannerMap = {
          1: {
            title: 'Royal Heritage Silks',
            subtitle: 'Handcrafted Pure Kanchipuram & Organza',
            ctaText: 'SHOP SAREES',
            ctaLink: '/category/sarees',
            description: 'Explore authentic handwoven pure silk & organza sarees at up to 40% off.',
            image: sareeGolden,
          },
          2: {
            title: 'Festive Celebration Sets',
            subtitle: 'Handcrafted Silhouettes & Festive Elegance',
            ctaText: 'EXPLORE KURTIS',
            ctaLink: '/category/kurtis',
            description: 'Discover handcrafted silhouettes and embroidered kurta sets designed for every celebration.',
            image: anarkaliBlackMulti,
          },
          3: {
            title: 'Bridal & Festive Couture',
            subtitle: 'Exclusive Zardozi & Velvet Lehengas',
            ctaText: 'EXPLORE LEHENGAS',
            ctaLink: '/category/lehengas',
            description: 'Luxury bridal ensembles with intricate handcrafted dori, sequins and cutdana work.',
            image: lehengaRed,
          },
        };

        const defaults = defaultBannerMap[bannerNum];
        const b = bannerSection?.content || (legacySec?.content?.banners?.[bannerNum - 1]) || {};
        const bActive = bannerSection ? (bannerSection.enabled !== false && bannerSection.active !== false) : true;
        const bTitle = b.headline || b.title || defaults.title;
        const bSubtitle = b.subtitle || defaults.subtitle;
        const bCtaText = b.ctaText || defaults.ctaText;
        const bCtaLink = b.ctaLink || defaults.ctaLink;
        const bDesc = b.description || defaults.description;
        const bImage = b.image || defaults.image;

        const updateActiveBanner = (fields) => {
          updateSectionContent(activeBannerId, fields);
          if (legacySec && (bannerNum === 1 || bannerNum === 2)) {
            const curBanners = legacySec.content?.banners || [];
            const updated = [...curBanners];
            updated[bannerNum - 1] = { ...(updated[bannerNum - 1] || {}), ...fields };
            updateSectionContent('promo-banners', { banners: updated });
          }
        };
        const updateBanner = updateActiveBanner;

        return (
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2.5">
                  <h2 className="text-lg font-bold text-slate-900">Promo Banner {bannerNum}</h2>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-brand-powder text-brand-teal border border-brand-teal/20">
                    Position #{bannerSecIdx >= 0 ? bannerSecIdx + 1 : (bannerNum === 1 ? 4 : bannerNum === 2 ? 6 : 10)} on Homepage
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Customize the imagery, headline, CTA button, and narrative copy for Promotional Banner {bannerNum}.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    toggleSection(activeBannerId);
                    showToast(`Promo Banner ${bannerNum} ${bActive ? 'hidden' : 'activated'}.`);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border cursor-pointer transition-all ${
                    bActive ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  {bActive ? 'Banner Active' : 'Banner Hidden'}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setEditPromoBannerModal({
                      bannerId: activeBannerId,
                      bannerNum,
                      title: bTitle,
                      subtitle: bSubtitle,
                      ctaText: bCtaText,
                      ctaLink: bCtaLink,
                      description: bDesc,
                      image: bImage,
                    })
                  }
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer active:scale-95"
                  title={`Edit Promo Banner ${bannerNum}`}
                >
                  <Edit size={13} /> Edit
                </button>
              </div>
            </div>

            {/* ── BANNER CARD ── */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-brand-teal text-white shadow-2xs">
                    Section {bannerNum}
                  </span>
                  <span className="text-xs font-bold text-slate-800">
                    {bTitle}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
                <div className="min-h-[220px] md:min-h-[240px] rounded-xl overflow-hidden border border-slate-200 relative group bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200 flex items-center justify-center">
                  <img
                    src={bImage}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full object-cover blur-md opacity-25 scale-110 pointer-events-none"
                  />
                  <img
                    src={bImage}
                    alt={bTitle}
                    className="relative z-10 max-h-[220px] md:max-h-[240px] max-w-full object-contain p-2 drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute top-2.5 left-2.5 z-20 bg-slate-900/70 backdrop-blur-xs text-white text-[9.5px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shadow-2xs">
                    Full Image
                  </div>
                  <button
                    type="button"
                    onClick={() => setImageModal({
                      title: `Select Image for Promo Banner ${bannerNum}`,
                      currentUrl: bImage,
                      onSelect: (url) => updateActiveBanner({ image: url }),
                    })}
                    className="absolute inset-0 z-30 bg-slate-900/60 text-white text-xs font-bold opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                  >
                    Change Image
                  </button>
                </div>

                <div className="md:col-span-2 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Headline</label>
                      <input
                        type="text"
                        value={b.title || b.headline || ''}
                        onChange={(e) => updateActiveBanner({ title: e.target.value, headline: e.target.value })}
                        className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 bg-white font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Subtitle</label>
                      <input
                        type="text"
                        value={b.subtitle || ''}
                        onChange={(e) => updateActiveBanner({ subtitle: e.target.value })}
                        className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">CTA Text</label>
                      <input
                        type="text"
                        value={b.ctaText || ''}
                        onChange={(e) => updateActiveBanner({ ctaText: e.target.value })}
                        className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">CTA Link</label>
                      <input
                        type="text"
                        value={b.ctaLink || ''}
                        onChange={(e) => updateActiveBanner({ ctaLink: e.target.value })}
                        className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 bg-white font-mono"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Description / Narrative</label>
                      <textarea
                        rows={2}
                        value={b.description || ''}
                        onChange={(e) => updateActiveBanner({ description: e.target.value })}
                        className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 bg-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* ─── TAB: TESTIMONIALS (SECTION 12 INTEGRATED WITH ADMIN REVIEWS) ─── */}
      {/* ════════════════════════════════════════════════════════════════ */}
      {activeTab === 'testimonials' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Homepage Testimonials & Client Reviews</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Directly connected to the Admin Reviews system. Select which verified reviews appear on the homepage.
              </p>
            </div>
            <button
              onClick={() => toggleSection('testimonials')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border cursor-pointer ${
                currentSection?.enabled !== false ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'
              }`}
            >
              {currentSection?.enabled !== false ? 'Section Active' : 'Section Hidden'}
            </button>
          </div>

          {/* Approved Reviews Selector */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Approved Client Reviews ({adminReviews.filter(r => r.status === 'approved').length} Available)
            </h3>

            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white">
              {adminReviews.filter(r => r.status === 'approved').map((rev) => {
                const currentFeaturedIds = currentSection?.content?.featuredReviewIds || [];
                const isFeatured = currentFeaturedIds.includes(rev.id);

                return (
                  <div key={rev.id} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">{rev.customerName}</span>
                        <div className="flex text-amber-400">
                          {[...Array(rev.rating || 5)].map((_, i) => (
                            <Star key={i} size={11} className="fill-amber-400" />
                          ))}
                        </div>
                        <span className="text-[10px] text-slate-400">· {rev.productName}</span>
                      </div>
                      <p className="text-xs text-slate-600 truncate mt-1 max-w-xl">"{rev.review}"</p>
                    </div>

                    <button
                      onClick={() => {
                        const nextIds = isFeatured
                          ? currentFeaturedIds.filter(id => id !== rev.id)
                          : [...currentFeaturedIds, rev.id];
                        updateSectionContent('testimonials', { featuredReviewIds: nextIds });
                        showToast(isFeatured ? 'Review removed from homepage' : 'Review featured on homepage');
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer whitespace-nowrap ${
                        isFeatured
                          ? 'bg-brand-powder text-brand-teal border-brand-teal/40'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {isFeatured ? 'Featured on Home' : '+ Feature Review'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* ─── TAB: INSTAGRAM MARQUEE (SECTION 13) ─── */}
      {/* ════════════════════════════════════════════════════════════════ */}
      {activeTab === 'instagram' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Instagram Marquee & Social Feed</h2>
              <p className="text-xs text-slate-500 mt-0.5">Control the continuous infinite scrolling marquee images and handle settings.</p>
            </div>
            <button
              onClick={() => {
                setAddInstagramModal({
                  url: '',
                  alt: '',
                });
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
            >
              <Plus size={13} /> Add Instagram Image
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Instagram Handle</label>
              <input
                type="text"
                value={currentSection?.content?.handle || '@sukafashions'}
                onChange={(e) => updateSectionContent('instagram', { handle: e.target.value })}
                className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Profile URL</label>
              <input
                type="text"
                value={currentSection?.content?.url || 'https://instagram.com/sukafashions'}
                onChange={(e) => updateSectionContent('instagram', { url: e.target.value })}
                className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 bg-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Marquee Speed</label>
              <select
                value={currentSection?.content?.marqueeSpeed || 'Normal'}
                onChange={(e) => updateSectionContent('instagram', { marqueeSpeed: e.target.value })}
                className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 bg-white font-bold"
              >
                <option value="Slow">Slow (Gentle scroll - 50s)</option>
                <option value="Normal">Normal (Smooth cadence - 32s)</option>
                <option value="Fast">Fast (Energetic - 20s)</option>
              </select>
            </div>
          </div>

          {/* Marquee Images Grid */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Marquee Image Track ({(currentSection?.content?.images || []).length} Images)
                </h3>
                <span className="text-[11px] text-slate-400">Square 1:1 or 4:5 recommended (1000×1000)</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  const currentImages = currentSection?.content?.images || [];
                  updateSectionContent('instagram', { images: [...currentImages, sareeGolden] });
                  showToast('New Photo added to Instagram Marquee.');
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-teal text-white rounded-xl text-xs font-bold hover:bg-brand-tealDark transition shadow-xs cursor-pointer active:scale-95"
              >
                <Plus size={13} /> Add Photo
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
              {(currentSection?.content?.images || []).map((img, iIdx) => {
                const imgUrl = typeof img === 'string' ? img : img.url;
                return (
                  <div key={img.id || iIdx} className="p-2 rounded-xl border border-slate-200 bg-slate-50/60 relative group">
                    <div className="aspect-[3/4] rounded-lg overflow-hidden bg-white mb-2 border border-slate-200">
                      <img src={imgUrl} alt="Instagram thumb" className="w-full h-full object-cover" />
                    </div>
                    <button
                      onClick={() => setImageModal({
                        title: 'Select Instagram Photo',
                        currentUrl: imgUrl,
                        onSelect: (url) => {
                          const updated = (currentSection?.content?.images || []).map((item, idx) =>
                            idx === iIdx ? (typeof item === 'string' ? url : { ...item, url }) : item
                          );
                          updateSectionContent('instagram', { images: updated });
                        }
                      })}
                      className="w-full py-1 bg-white border border-slate-200 text-[10px] font-bold text-slate-700 rounded hover:bg-slate-50 shadow-2xs"
                    >
                      Change
                    </button>
                    <button
                      onClick={() => {
                        const filtered = (currentSection?.content?.images || []).filter((_, idx) => idx !== iIdx);
                        updateSectionContent('instagram', { images: filtered });
                      }}
                      className="absolute top-2 right-2 w-5 h-5 rounded-full bg-white text-red-600 shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={11} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* ─── TAB: OTHER SECTIONS (BRAND STORY, CRAFTSMANSHIP, ETC.) ─── */}
      {/* ════════════════════════════════════════════════════════════════ */}
      {['trending', 'occasion', 'collections', 'brand-story', 'craftsmanship', 'four-pillars', 'newsletter', 'footer'].includes(activeTab) && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">{currentSection?.label || 'Section Editor'}</h2>
              <p className="text-xs text-slate-500 mt-0.5">{currentSection?.desc}</p>
            </div>
            <button
              onClick={() => toggleSection(activeTab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border cursor-pointer ${
                currentSection?.enabled !== false ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'
              }`}
            >
              {currentSection?.enabled !== false ? 'Section Visible' : 'Section Hidden'}
            </button>
          </div>

          {/* Section Dynamic Forms */}
          {/* ── 1. Trending Now Editor ── */}
          {activeTab === 'trending' && (() => {
            const tc = currentSection?.content || {};
            const items = tc.items || [];
            const updateField = (k, v) => updateSectionContent('trending', { [k]: v });
            const updateItems = (newItems) => updateSectionContent('trending', { items: newItems });

            return (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50/70 p-4 rounded-xl border border-slate-200/80">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Eyebrow Tagline
                    </label>
                    <input
                      type="text"
                      value={tc.eyebrow ?? ''}
                      onChange={(e) => updateField('eyebrow', e.target.value)}
                      placeholder="e.g. IN THE SPOTLIGHT"
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 bg-white focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Section Title
                    </label>
                    <input
                      type="text"
                      value={tc.title ?? ''}
                      onChange={(e) => updateField('title', e.target.value)}
                      placeholder="e.g. TRENDING NOW"
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 bg-white focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal outline-none transition"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">Spotlight Cards ({items.length})</h3>
                    <p className="text-xs text-slate-500">Feature top curated trends with custom photos, titles, and links</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setAddSpotlightModal({
                        title: '',
                        subtitle: '',
                        link: '',
                        image: '',
                      });
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-brand-teal text-white rounded-xl text-xs font-bold hover:bg-brand-tealDark transition shadow-xs cursor-pointer active:scale-95"
                  >
                    <Plus size={14} /> Add Card
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {items.map((item, idx) => (
                    <div
                      key={item.id || idx}
                      className={`p-4 rounded-xl border transition-all ${
                        item.enabled !== false ? 'bg-white border-slate-200 shadow-2xs' : 'bg-slate-50 border-slate-200 opacity-60'
                      }`}
                    >
                      <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-slate-100 border border-slate-200 mb-3 group">
                        {item.image ? (
                          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">No image</div>
                        )}
                        <button
                          type="button"
                          onClick={() => setImageModal({
                            title: `Select Image for ${item.title || 'Spotlight Card'}`,
                            currentUrl: item.image,
                            onSelect: (url) => {
                              const updated = items.map((it, i) => i === idx ? { ...it, image: url } : it);
                              updateItems(updated);
                            }
                          })}
                          className="absolute inset-0 bg-black/40 text-white font-bold text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        >
                          <Upload size={14} className="mr-1.5" /> Change Photo
                        </button>
                      </div>

                      <div className="space-y-2.5">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Title</label>
                          <input
                            type="text"
                            value={item.title || ''}
                            onChange={(e) => {
                              const updated = items.map((it, i) => i === idx ? { ...it, title: e.target.value } : it);
                              updateItems(updated);
                            }}
                            className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 bg-white font-semibold"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Subtitle</label>
                          <input
                            type="text"
                            value={item.subtitle || ''}
                            onChange={(e) => {
                              const updated = items.map((it, i) => i === idx ? { ...it, subtitle: e.target.value } : it);
                              updateItems(updated);
                            }}
                            className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Link URL</label>
                          <input
                            type="text"
                            value={item.link || ''}
                            onChange={(e) => {
                              const updated = items.map((it, i) => i === idx ? { ...it, link: e.target.value } : it);
                              updateItems(updated);
                            }}
                            placeholder="/category/kurtis"
                            className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 bg-white font-mono"
                          />
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                          <button
                            type="button"
                            onClick={() => {
                              const updated = items.map((it, i) => i === idx ? { ...it, enabled: it.enabled === false ? true : false } : it);
                              updateItems(updated);
                            }}
                            className={`flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded cursor-pointer ${
                              item.enabled !== false ? 'text-emerald-700 bg-emerald-50' : 'text-slate-500 bg-slate-100'
                            }`}
                          >
                            {item.enabled !== false ? <Eye size={12} /> : <EyeOff size={12} />}
                            {item.enabled !== false ? 'Active' : 'Hidden'}
                          </button>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => {
                                const copy = [...items];
                                [copy[idx - 1], copy[idx]] = [copy[idx], copy[idx - 1]];
                                updateItems(copy);
                              }}
                              className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 cursor-pointer"
                              title="Move Left"
                            >
                              <ArrowUp size={14} className="-rotate-90" />
                            </button>
                            <button
                              type="button"
                              disabled={idx === items.length - 1}
                              onClick={() => {
                                const copy = [...items];
                                [copy[idx + 1], copy[idx]] = [copy[idx], copy[idx + 1]];
                                updateItems(copy);
                              }}
                              className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 cursor-pointer"
                              title="Move Right"
                            >
                              <ArrowDown size={14} className="-rotate-90" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setConfirmModal({
                                  title: `Delete Card "${item.title || 'Spotlight Card'}"`,
                                  message: `Are you sure you want to delete this trending spotlight card? This action cannot be undone.`,
                                  confirmLabel: 'Delete Card',
                                  variant: 'danger',
                                  onConfirm: () => {
                                    updateItems(items.filter((_, i) => i !== idx));
                                    showToast('Card removed.');
                                  },
                                });
                              }}
                              className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded cursor-pointer"
                              title="Delete Card"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* ── 2. Shop By Occasion Editor ── */}
          {activeTab === 'occasion' && (() => {
            const oc = currentSection?.content || {};
            const items = oc.items || [];
            const updateField = (k, v) => updateSectionContent('occasion', { [k]: v });
            const updateItems = (newItems) => updateSectionContent('occasion', { items: newItems });
            const availableIcons = ['Gem', 'Sparkles', 'Music2', 'Coffee', 'Briefcase', 'Flower2', 'Heart', 'Tag', 'Gift', 'ShoppingBag'];

            return (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50/70 p-4 rounded-xl border border-slate-200/80">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Eyebrow Tagline
                    </label>
                    <input
                      type="text"
                      value={oc.eyebrow ?? ''}
                      onChange={(e) => updateField('eyebrow', e.target.value)}
                      placeholder="e.g. STYLE FOR EVERY MOMENT"
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 bg-white focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Section Title
                    </label>
                    <input
                      type="text"
                      value={oc.title ?? ''}
                      onChange={(e) => updateField('title', e.target.value)}
                      placeholder="e.g. SHOP BY OCCASION"
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 bg-white focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal outline-none transition"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">Occasions List ({items.length})</h3>
                    <p className="text-xs text-slate-500">Define curated occasions with custom photos, icons, and category destinations</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const newOccasion = {
                        id: `occasion-${Date.now()}`,
                        name: 'New Occasion',
                        subtitle: 'Curated for celebrations.',
                        icon: 'Sparkles',
                        link: '/category/occasion',
                        image: sareeBeigePink,
                        order: items.length + 1,
                        enabled: true,
                      };
                      updateItems([...items, newOccasion]);
                      showToast('New Occasion added.');
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-brand-teal text-white rounded-xl text-xs font-bold hover:bg-brand-tealDark transition shadow-xs cursor-pointer active:scale-95"
                  >
                    <Plus size={14} /> Add Occasion
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {items.map((item, idx) => (
                    <div
                      key={item.id || idx}
                      className={`p-4 rounded-xl border transition-all ${
                        item.enabled !== false ? 'bg-white border-slate-200 shadow-2xs' : 'bg-slate-50 border-slate-200 opacity-60'
                      }`}
                    >
                      <div className="relative aspect-[16/9] rounded-lg overflow-hidden bg-slate-100 border border-slate-200 mb-3 group">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">No image</div>
                        )}
                        <button
                          type="button"
                          onClick={() => setImageModal({
                            title: `Select Photo for ${item.name || 'Occasion'}`,
                            currentUrl: item.image,
                            onSelect: (url) => {
                              const updated = items.map((it, i) => i === idx ? { ...it, image: url } : it);
                              updateItems(updated);
                            }
                          })}
                          className="absolute inset-0 bg-black/40 text-white font-bold text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        >
                          <Upload size={14} className="mr-1.5" /> Change Photo
                        </button>
                      </div>

                      <div className="space-y-2.5">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Name</label>
                            <input
                              type="text"
                              value={item.name || ''}
                              onChange={(e) => {
                                const updated = items.map((it, i) => i === idx ? { ...it, name: e.target.value } : it);
                                updateItems(updated);
                              }}
                              className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 bg-white font-semibold"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Icon</label>
                            <select
                              value={item.icon || 'Sparkles'}
                              onChange={(e) => {
                                const updated = items.map((it, i) => i === idx ? { ...it, icon: e.target.value } : it);
                                updateItems(updated);
                              }}
                              className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 bg-white"
                            >
                              {availableIcons.map(ic => (
                                <option key={ic} value={ic}>{ic}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Subtitle</label>
                          <input
                            type="text"
                            value={item.subtitle || ''}
                            onChange={(e) => {
                              const updated = items.map((it, i) => i === idx ? { ...it, subtitle: e.target.value } : it);
                              updateItems(updated);
                            }}
                            className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Target Link</label>
                          <input
                            type="text"
                            value={item.link || ''}
                            onChange={(e) => {
                              const updated = items.map((it, i) => i === idx ? { ...it, link: e.target.value } : it);
                              updateItems(updated);
                            }}
                            className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 bg-white font-mono"
                          />
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                          <button
                            type="button"
                            onClick={() => {
                              const updated = items.map((it, i) => i === idx ? { ...it, enabled: it.enabled === false ? true : false } : it);
                              updateItems(updated);
                            }}
                            className={`flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded cursor-pointer ${
                              item.enabled !== false ? 'text-emerald-700 bg-emerald-50' : 'text-slate-500 bg-slate-100'
                            }`}
                          >
                            {item.enabled !== false ? <Eye size={12} /> : <EyeOff size={12} />}
                            {item.enabled !== false ? 'Active' : 'Hidden'}
                          </button>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => {
                                const copy = [...items];
                                [copy[idx - 1], copy[idx]] = [copy[idx], copy[idx - 1]];
                                updateItems(copy);
                              }}
                              className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 cursor-pointer"
                              title="Move Left"
                            >
                              <ArrowUp size={14} className="-rotate-90" />
                            </button>
                            <button
                              type="button"
                              disabled={idx === items.length - 1}
                              onClick={() => {
                                const copy = [...items];
                                [copy[idx + 1], copy[idx]] = [copy[idx], copy[idx + 1]];
                                updateItems(copy);
                              }}
                              className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 cursor-pointer"
                              title="Move Right"
                            >
                              <ArrowDown size={14} className="-rotate-90" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setConfirmModal({
                                  title: `Delete "${item.title || 'Occasion'}"`,
                                  message: `Are you sure you want to delete this occasion? This action cannot be undone.`,
                                  confirmLabel: 'Delete Occasion',
                                  variant: 'danger',
                                  onConfirm: () => {
                                    updateItems(items.filter((_, i) => i !== idx));
                                    showToast('Occasion removed.');
                                  },
                                });
                              }}
                              className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded cursor-pointer"
                              title="Delete Occasion"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* ── 3. Curated Collections Editor ── */}
          {activeTab === 'collections' && (() => {
            const cc = currentSection?.content || {};
            const items = cc.items || [];
            const updateField = (k, v) => updateSectionContent('collections', { [k]: v });
            const updateItems = (newItems) => updateSectionContent('collections', { items: newItems });

            return (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-slate-50/70 p-4 rounded-xl border border-slate-200/80">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Eyebrow</label>
                    <input
                      type="text"
                      value={cc.eyebrow ?? ''}
                      onChange={(e) => updateField('eyebrow', e.target.value)}
                      placeholder="HANDPICKED FOR YOU"
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Title</label>
                    <input
                      type="text"
                      value={cc.title ?? ''}
                      onChange={(e) => updateField('title', e.target.value)}
                      placeholder="CURATED COLLECTIONS"
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Button Text</label>
                    <input
                      type="text"
                      value={cc.ctaText ?? ''}
                      onChange={(e) => updateField('ctaText', e.target.value)}
                      placeholder="DISCOVER ALL"
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Button Link</label>
                    <input
                      type="text"
                      value={cc.ctaLink ?? ''}
                      onChange={(e) => updateField('ctaLink', e.target.value)}
                      placeholder="/products"
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 bg-white font-mono"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">Collections Cards ({items.length})</h3>
                    <p className="text-xs text-slate-500">Edit thematic collections like Under ₹1999, New Season, Wedding Guest</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const newCollection = {
                        id: `collection-${Date.now()}`,
                        title: 'New Collection Edit',
                        subtitle: 'Handpicked luxury selections.',
                        image: sareeBeigeMaroon,
                        link: '/products',
                        order: items.length + 1,
                        enabled: true,
                      };
                      updateItems([...items, newCollection]);
                      showToast('New Collection Card added.');
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-brand-teal text-white rounded-xl text-xs font-bold hover:bg-brand-tealDark transition shadow-xs cursor-pointer active:scale-95"
                  >
                    <Plus size={14} /> Add Card
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {items.map((item, idx) => (
                    <div key={item.id || idx} className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-3">
                      <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-slate-100 border border-slate-200 group">
                        {item.image ? (
                          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">No image</div>
                        )}
                        <button
                          type="button"
                          onClick={() => setImageModal({
                            title: `Select Image for ${item.title || 'Collection'}`,
                            currentUrl: item.image,
                            onSelect: (url) => {
                              const updated = items.map((it, i) => i === idx ? { ...it, image: url } : it);
                              updateItems(updated);
                            }
                          })}
                          className="absolute inset-0 bg-black/40 text-white font-bold text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        >
                          <Upload size={14} className="mr-1.5" /> Change Photo
                        </button>
                      </div>

                      <div className="space-y-2">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Title</label>
                          <input
                            type="text"
                            value={item.title || ''}
                            onChange={(e) => {
                              const updated = items.map((it, i) => i === idx ? { ...it, title: e.target.value } : it);
                              updateItems(updated);
                            }}
                            className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 bg-white font-semibold"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Subtitle</label>
                          <input
                            type="text"
                            value={item.subtitle || ''}
                            onChange={(e) => {
                              const updated = items.map((it, i) => i === idx ? { ...it, subtitle: e.target.value } : it);
                              updateItems(updated);
                            }}
                            className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Link URL</label>
                          <input
                            type="text"
                            value={item.link || ''}
                            onChange={(e) => {
                              const updated = items.map((it, i) => i === idx ? { ...it, link: e.target.value } : it);
                              updateItems(updated);
                            }}
                            className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 bg-white font-mono"
                          />
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                          <button
                            type="button"
                            onClick={() => {
                              const updated = items.map((it, i) => i === idx ? { ...it, enabled: it.enabled === false ? true : false } : it);
                              updateItems(updated);
                            }}
                            className={`flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded cursor-pointer ${
                              item.enabled !== false ? 'text-emerald-700 bg-emerald-50' : 'text-slate-500 bg-slate-100'
                            }`}
                          >
                            {item.enabled !== false ? <Eye size={12} /> : <EyeOff size={12} />}
                            {item.enabled !== false ? 'Active' : 'Hidden'}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setConfirmModal({
                                title: `Delete "${item.title || 'Collection'}"`,
                                message: `Are you sure you want to delete this collection card? This action cannot be undone.`,
                                confirmLabel: 'Delete Collection',
                                variant: 'danger',
                                onConfirm: () => {
                                  updateItems(items.filter((_, i) => i !== idx));
                                  showToast('Collection removed.');
                                },
                              });
                            }}
                            className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded cursor-pointer"
                            title="Delete Collection"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* ── 4. Four Pillars & Benefits Editor ── */}
          {activeTab === 'four-pillars' && (() => {
            const fp = currentSection?.content || {};
            const items = fp.items || [];
            const updateField = (k, v) => updateSectionContent('four-pillars', { [k]: v });
            const updateItems = (newItems) => updateSectionContent('four-pillars', { items: newItems });
            const pillarIcons = ['Users', 'Feather', 'Compass', 'Award', 'ShieldCheck', 'Sparkles', 'Heart', 'CheckCircle2'];

            return (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50/70 p-4 rounded-xl border border-slate-200/80">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Eyebrow</label>
                    <input
                      type="text"
                      value={fp.eyebrow ?? ''}
                      onChange={(e) => updateField('eyebrow', e.target.value)}
                      placeholder="THE SUKA PROMISE"
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Section Title</label>
                    <input
                      type="text"
                      value={fp.title ?? ''}
                      onChange={(e) => updateField('title', e.target.value)}
                      placeholder="THE FOUR PILLARS"
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Subtitle</label>
                    <input
                      type="text"
                      value={fp.subtitle ?? ''}
                      onChange={(e) => updateField('subtitle', e.target.value)}
                      placeholder="A luxury women's fashion house..."
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 bg-white"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <h3 className="text-sm font-bold text-slate-800">Brand Value Pillars ({items.length})</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {items.map((item, idx) => (
                    <div key={item.id || idx} className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-brand-teal px-2 py-0.5 bg-brand-teal/10 rounded-full font-mono">
                          {item.num || `0${idx + 1}`}
                        </span>
                        <select
                          value={item.icon || 'Award'}
                          onChange={(e) => {
                            const updated = items.map((it, i) => i === idx ? { ...it, icon: e.target.value } : it);
                            updateItems(updated);
                          }}
                          className="border border-slate-200 rounded-lg px-2 py-1 text-[11px] text-slate-700 bg-white"
                        >
                          {pillarIcons.map(ic => (
                            <option key={ic} value={ic}>{ic}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 uppercase mb-0.5">Highlight Tag</label>
                          <input
                            type="text"
                            value={item.tag || ''}
                            onChange={(e) => {
                              const updated = items.map((it, i) => i === idx ? { ...it, tag: e.target.value } : it);
                              updateItems(updated);
                            }}
                            className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 uppercase mb-0.5">Pillar Name</label>
                          <input
                            type="text"
                            value={item.title || ''}
                            onChange={(e) => {
                              const updated = items.map((it, i) => i === idx ? { ...it, title: e.target.value } : it);
                              updateItems(updated);
                            }}
                            className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800 bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 uppercase mb-0.5">Description</label>
                          <textarea
                            rows={3}
                            value={item.desc || ''}
                            onChange={(e) => {
                              const updated = items.map((it, i) => i === idx ? { ...it, desc: e.target.value } : it);
                              updateItems(updated);
                            }}
                            className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 bg-white resize-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}

          {activeTab === 'brand-story' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Eyebrow</label>
                  <input
                    type="text"
                    value={currentSection?.content?.eyebrow || ''}
                    onChange={(e) => updateSectionContent('brand-story', { eyebrow: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Heading Line 1</label>
                  <input
                    type="text"
                    value={currentSection?.content?.headingLine1 || ''}
                    onChange={(e) => updateSectionContent('brand-story', { headingLine1: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Heading Line 2</label>
                  <input
                    type="text"
                    value={currentSection?.content?.headingLine2 || ''}
                    onChange={(e) => updateSectionContent('brand-story', { headingLine2: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Button Text</label>
                  <input
                    type="text"
                    value={currentSection?.content?.ctaText || ''}
                    onChange={(e) => updateSectionContent('brand-story', { ctaText: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Paragraph 1</label>
                <textarea
                  rows={2}
                  value={currentSection?.content?.paragraph1 || ''}
                  onChange={(e) => updateSectionContent('brand-story', { paragraph1: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Paragraph 2</label>
                <textarea
                  rows={2}
                  value={currentSection?.content?.paragraph2 || ''}
                  onChange={(e) => updateSectionContent('brand-story', { paragraph2: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 bg-white"
                />
              </div>
            </div>
          )}

          {activeTab === 'craftsmanship' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Section Eyebrow</label>
                  <input
                    type="text"
                    value={currentSection?.content?.eyebrow || ''}
                    onChange={(e) => updateSectionContent('craftsmanship', { eyebrow: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Section Title</label>
                  <input
                    type="text"
                    value={currentSection?.content?.title || ''}
                    onChange={(e) => updateSectionContent('craftsmanship', { title: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                {(currentSection?.content?.items || []).map((item, cIdx) => (
                  <div key={item.id || cIdx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                    <span className="text-xs font-bold text-slate-800">Pillar #{cIdx + 1}</span>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => {
                        const updated = (currentSection?.content?.items || []).map((p, idx) =>
                          idx === cIdx ? { ...p, title: e.target.value } : p
                        );
                        updateSectionContent('craftsmanship', { items: updated });
                      }}
                      className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 bg-white font-bold"
                    />
                    <textarea
                      rows={3}
                      value={item.description}
                      onChange={(e) => {
                        const updated = (currentSection?.content?.items || []).map((p, idx) =>
                          idx === cIdx ? { ...p, description: e.target.value } : p
                        );
                        updateSectionContent('craftsmanship', { items: updated });
                      }}
                      className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-700 bg-white"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'newsletter' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Eyebrow</label>
                <input
                  type="text"
                  value={currentSection?.content?.eyebrow || ''}
                  onChange={(e) => updateSectionContent('newsletter', { eyebrow: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Title</label>
                <input
                  type="text"
                  value={currentSection?.content?.title || ''}
                  onChange={(e) => updateSectionContent('newsletter', { title: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 bg-white"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Subtitle / Benefits</label>
                <textarea
                  rows={2}
                  value={currentSection?.content?.subtitle || ''}
                  onChange={(e) => updateSectionContent('newsletter', { subtitle: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 bg-white"
                />
              </div>
            </div>
          )}

          {activeTab === 'footer' && (() => {
            const fc = currentSection?.content || {};
            const sl = fc.socialLinks || {};
            const field = (key, val) => updateSectionContent('footer', { [key]: val });
            const social = (key, val) => updateSectionContent('footer', {
              socialLinks: { ...sl, [key]: val },
            });

            return (
              <div className="space-y-6">

                {/* ── Brand Identity ── */}
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4">
                  <div className="flex items-center gap-2 pb-1 border-b border-slate-200">
                    <div className="w-7 h-7 rounded-lg bg-brand-tealDark/10 flex items-center justify-center">
                      <BookOpen size={14} className="text-brand-tealDark" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-800">Brand Identity</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">Brand Tagline</label>
                      <input
                        type="text"
                        value={fc.brandTagline || 'Women Based • Women Empowered'}
                        onChange={(e) => field('brandTagline', e.target.value)}
                        placeholder="Women Based • Women Empowered"
                        className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 bg-white focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal outline-none transition"
                      />
                      <p className="text-[10px] text-slate-400 mt-1">Shown under the logo in bold caps</p>
                    </div>
                    <div className="sm:col-span-1">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">Brand Description</label>
                      <textarea
                        rows={3}
                        value={fc.brandDescription || ''}
                        onChange={(e) => field('brandDescription', e.target.value)}
                        placeholder="A luxury women's clothing brand dedicated to celebrating femininity..."
                        className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 bg-white focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal outline-none transition resize-none"
                      />
                      <p className="text-[10px] text-slate-400 mt-1">Short blurb shown below the tagline</p>
                    </div>
                  </div>
                </div>

                {/* ── Customer Care ── */}
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4">
                  <div className="flex items-center gap-2 pb-1 border-b border-slate-200">
                    <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center">
                      <Phone size={14} className="text-emerald-600" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-800">Customer Care</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                        📞 Support Phone
                      </label>
                      <input
                        type="tel"
                        value={fc.supportPhone || '+91 9488463850'}
                        onChange={(e) => field('supportPhone', e.target.value)}
                        placeholder="+91 9488463850"
                        className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 bg-white focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal outline-none transition"
                      />
                      <p className="text-[10px] text-slate-400 mt-1">Clickable tel: link in footer</p>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                        ✉️ Support Email
                      </label>
                      <input
                        type="email"
                        value={fc.supportEmail || 'care@sukafashions.com'}
                        onChange={(e) => field('supportEmail', e.target.value)}
                        placeholder="care@sukafashions.com"
                        className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 bg-white focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal outline-none transition"
                      />
                      <p className="text-[10px] text-slate-400 mt-1">Clickable mailto: link in footer</p>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                        🕐 Working Hours
                      </label>
                      <input
                        type="text"
                        value={fc.workingHours || 'Mon–Sat, 10 AM – 7 PM'}
                        onChange={(e) => field('workingHours', e.target.value)}
                        placeholder="Mon–Sat, 10 AM – 7 PM"
                        className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 bg-white focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal outline-none transition"
                      />
                      <p className="text-[10px] text-slate-400 mt-1">Shown as availability info</p>
                    </div>
                  </div>
                </div>

                {/* ── Social Media Links ── */}
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4">
                  <div className="flex items-center gap-2 pb-1 border-b border-slate-200">
                    <div className="w-7 h-7 rounded-lg bg-pink-50 flex items-center justify-center">
                      <Instagram size={14} className="text-pink-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-800">Social Media Links</h3>
                      <p className="text-[10px] text-slate-400">Enter full URLs (e.g. https://instagram.com/yourhandle). Used for footer icons and Customer Care DM link.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

                    {/* Instagram */}
                    <div>
                      <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                        <span className="w-5 h-5 rounded bg-gradient-to-br from-pink-500 to-orange-400 flex items-center justify-center text-white text-[9px]">
                          <Instagram size={11} />
                        </span>
                        Instagram URL
                      </label>
                      <input
                        type="url"
                        value={sl.instagram || ''}
                        onChange={(e) => social('instagram', e.target.value)}
                        placeholder="https://instagram.com/sukafashions"
                        className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 bg-white focus:ring-2 focus:ring-pink-200 focus:border-pink-400 outline-none transition"
                      />
                    </div>

                    {/* Facebook */}
                    <div>
                      <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                        <span className="w-5 h-5 rounded bg-blue-600 flex items-center justify-center text-white text-[9px] font-bold">f</span>
                        Facebook URL
                      </label>
                      <input
                        type="url"
                        value={sl.facebook || ''}
                        onChange={(e) => social('facebook', e.target.value)}
                        placeholder="https://facebook.com/sukafashions"
                        className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 bg-white focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none transition"
                      />
                    </div>

                    {/* YouTube */}
                    <div>
                      <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                        <span className="w-5 h-5 rounded bg-red-500 flex items-center justify-center text-white text-[8px] font-bold">▶</span>
                        YouTube URL
                      </label>
                      <input
                        type="url"
                        value={sl.youtube || ''}
                        onChange={(e) => social('youtube', e.target.value)}
                        placeholder="https://youtube.com/@sukafashions"
                        className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 bg-white focus:ring-2 focus:ring-red-200 focus:border-red-400 outline-none transition"
                      />
                    </div>

                    {/* WhatsApp */}
                    <div>
                      <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                        <span className="w-5 h-5 rounded bg-green-500 flex items-center justify-center text-white text-[9px] font-bold">W</span>
                        WhatsApp Link
                      </label>
                      <input
                        type="url"
                        value={sl.whatsapp || ''}
                        onChange={(e) => social('whatsapp', e.target.value)}
                        placeholder="https://wa.me/919488463850"
                        className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 bg-white focus:ring-2 focus:ring-green-200 focus:border-green-400 outline-none transition"
                      />
                      <p className="text-[10px] text-slate-400 mt-1">Format: https://wa.me/91XXXXXXXXXX</p>
                    </div>

                  </div>

                  {/* Live preview of footer social icons */}
                  <div className="pt-3 border-t border-slate-200">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Live Preview — Footer Social Icons</p>
                    <div className="flex items-center gap-2">
                      {[
                        { label: 'Instagram', url: sl.instagram || 'https://instagram.com/sukafashions', bg: 'bg-gradient-to-br from-pink-500 to-orange-400' },
                        { label: 'Facebook',  url: sl.facebook  || 'https://facebook.com/sukafashions',  bg: 'bg-blue-600' },
                        { label: 'YouTube',   url: sl.youtube   || 'https://youtube.com/sukafashions',    bg: 'bg-red-500' },
                        { label: 'WhatsApp',  url: sl.whatsapp  || 'https://wa.me/919488463850',          bg: 'bg-green-500' },
                      ].map(({ label, url, bg }) => (
                        <a
                          key={label}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={`${label}: ${url}`}
                          className={`w-8 h-8 rounded-full ${bg} text-white flex items-center justify-center text-[9px] font-bold hover:scale-110 transition-transform shadow-sm`}
                        >
                          {label.charAt(0)}
                        </a>
                      ))}
                      <span className="text-[10px] text-slate-400 ml-1">Hover to preview URL</span>
                    </div>
                  </div>
                </div>

              </div>
            );
          })()}
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* ─── MODALS ─── */}
      {/* ════════════════════════════════════════════════════════════════ */}

      {/* 1. Publish Confirmation Modal */}
      {isPublishModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-[scaleIn_0.2s_ease-out]">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <Send size={24} />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold text-slate-900">Publish Homepage Changes?</h3>
              <p className="text-xs text-slate-500 mt-1">
                These changes will immediately become live and visible to all customers visiting the Suka Fashions website.
              </p>
            </div>
            <div className="flex items-center gap-3 pt-3">
              <button
                onClick={() => setIsPublishModalOpen(false)}
                className="flex-1 py-2.5 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handlePublish}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md"
              >
                Publish Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Version History Modal */}
      {isHistoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8 shadow-2xl space-y-5 animate-[scaleIn_0.2s_ease-out]">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                  <History size={20} className="text-slate-700" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Content Version History</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Restore a previous published version of the homepage</p>
                </div>
              </div>
              <button onClick={() => setIsHistoryModalOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="divide-y divide-slate-100 max-h-[65vh] overflow-y-auto pr-2">
              {(versionHistory.length > 0 ? versionHistory : [
                { versionId: 'v12', publishedAt: '11 Sep 2026, 09:15 AM', publishedBy: 'Aditi Sharma', status: 'Current' },
                { versionId: 'v11', publishedAt: '08 Sep 2026, 05:40 PM', publishedBy: 'Aditi Sharma', status: 'Archived' },
                { versionId: 'v10', publishedAt: '01 Sep 2026, 11:20 AM', publishedBy: 'Super Admin', status: 'Archived' },
              ]).map((v) => (
                <div key={v.versionId} className="py-4 flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <span className="font-bold text-sm text-slate-900">{v.versionId}</span>
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                        v.status === 'Current' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500 border border-slate-200'
                      }`}>
                        {v.status}
                      </span>
                    </div>
                    <span className="text-sm text-slate-500 block mt-1">
                      {v.publishedAt} · {v.publishedBy}
                    </span>
                  </div>

                  {v.status !== 'Current' && (
                    <button
                      onClick={async () => {
                        await restoreVersion(v.versionId, admin?.name || 'Aditi Sharma');
                        setIsHistoryModalOpen(false);
                        showToast(`Restored version ${v.versionId} successfully.`);
                      }}
                      className="px-5 py-2 text-sm font-bold text-brand-teal hover:bg-brand-powder rounded-xl transition-colors border border-brand-teal/30 whitespace-nowrap"
                    >
                      Restore
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2.5 Add Hero Slide Modal (Pop-up asking all slide info with stack methodology) */}
      {addSlideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/65 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl space-y-6 my-auto max-h-[92vh] overflow-y-auto animate-[scaleIn_0.2s_ease-out]">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2.5">
                  <h3 className="text-lg font-bold text-slate-900">Add New Hero Slide</h3>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-brand-powder/60 text-brand-teal border border-brand-teal/20 flex items-center gap-1">
                    <Plus size={11} /> Queue Methodology
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Enter all slide copy, call-to-action buttons, background color, and imagery.
                </p>
              </div>
              <button
                onClick={() => setAddSlideModal(null)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body Form */}
            <div className="space-y-6">
              {/* 1. Live Miniature Preview Box */}
              <div className="rounded-xl border border-slate-200 overflow-hidden bg-slate-50 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <Sparkles size={11} /> Live Preview
                  </span>
                  <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Auto-updating
                  </span>
                </div>
                <div
                  className="rounded-lg p-5 border border-slate-200/80 transition-colors"
                  style={{ background: `linear-gradient(140deg, #FAFAF8 52%, ${addSlideModal.accentBg || '#EBF5F5'} 100%)` }}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4 items-center">
                    <div className="space-y-1.5 min-w-0">
                      {addSlideModal.eyebrow?.trim() && (
                        <span className="text-[9px] font-bold tracking-[0.25em] text-brand-teal uppercase block truncate">
                          {addSlideModal.eyebrow}
                        </span>
                      )}
                      <h4 className="font-serif text-xl sm:text-2xl text-brand-navy leading-tight truncate">
                        {(addSlideModal.headingLine1 || addSlideModal.headingLine2)
                          ? `${addSlideModal.headingLine1 || ''} ${addSlideModal.headingLine2 || ''}`.trim()
                          : <span className="text-slate-300 italic">Slide Heading</span>}
                      </h4>
                      {addSlideModal.subtitle?.trim() ? (
                        <p className="text-[11px] text-brand-navy/70 line-clamp-2 max-w-md">
                          {addSlideModal.subtitle}
                        </p>
                      ) : (
                        <p className="text-[11px] text-slate-300 italic line-clamp-2 max-w-md">
                          Slide subtitle or narrative copy...
                        </p>
                      )}
                      <div className="flex items-center gap-2 pt-1.5 min-h-[30px]">
                        {addSlideModal.ctaText?.trim() ? (
                          <span className="bg-brand-teal text-white text-[9px] font-bold tracking-wider uppercase py-1.5 px-3 rounded-xs shadow-xs">
                            {addSlideModal.ctaText}
                          </span>
                        ) : null}
                        {addSlideModal.secondaryCtaText?.trim() ? (
                          <span className="border border-brand-navy/30 bg-white/70 text-brand-navy text-[9px] font-bold tracking-wider uppercase py-1.5 px-2.5 rounded-xs">
                            {addSlideModal.secondaryCtaText}
                          </span>
                        ) : null}
                      </div>
                    </div>
                    {/* Image Trio Preview */}
                    <div className="flex items-center gap-1.5 justify-end">
                      {addSlideModal.detailImageLeft ? (
                        <img
                          src={addSlideModal.detailImageLeft}
                          alt="Left"
                          className="w-12 h-20 object-cover rounded shadow border border-white"
                        />
                      ) : (
                        <div className="w-12 h-20 rounded border border-dashed border-slate-300 bg-white/60 flex items-center justify-center text-[8px] text-slate-400">Left</div>
                      )}
                      {addSlideModal.mainImage ? (
                        <img
                          src={addSlideModal.mainImage}
                          alt="Main"
                          className="w-20 h-28 object-cover rounded-lg shadow-lg border-2 border-white scale-105"
                        />
                      ) : (
                        <div className="w-20 h-28 rounded-lg border-2 border-dashed border-slate-300 bg-white/70 flex items-center justify-center text-[9px] text-slate-400 font-semibold text-center px-1">Main Image</div>
                      )}
                      {addSlideModal.detailImageRight ? (
                        <img
                          src={addSlideModal.detailImageRight}
                          alt="Right"
                          className="w-12 h-20 object-cover rounded shadow border border-white"
                        />
                      ) : (
                        <div className="w-12 h-20 rounded border border-dashed border-slate-300 bg-white/60 flex items-center justify-center text-[8px] text-slate-400">Right</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Content & Copy Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Eyebrow Badge / Tag <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={addSlideModal.eyebrow}
                    onChange={(e) => setAddSlideModal(prev => ({ ...prev, eyebrow: e.target.value }))}
                    placeholder="e.g. HERITAGE LEHENGAS"
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 bg-white focus:outline-none focus:border-brand-teal"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Accent Background Tint
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={addSlideModal.accentBg || '#EBF5F5'}
                      onChange={(e) => setAddSlideModal(prev => ({ ...prev, accentBg: e.target.value }))}
                      className="w-9 h-8 rounded-lg border border-slate-200 cursor-pointer p-0.5 bg-white"
                      title="Custom Color"
                    />
                    <div className="flex items-center gap-1.5 overflow-x-auto flex-1">
                      {HERO_BG_PRESETS.map((p) => (
                        <button
                          key={p.color}
                          type="button"
                          onClick={() => setAddSlideModal(prev => ({ ...prev, accentBg: p.color }))}
                          style={{ backgroundColor: p.color }}
                          className={`w-7 h-7 rounded-lg border flex-shrink-0 transition-transform cursor-pointer ${
                            addSlideModal.accentBg === p.color ? 'ring-2 ring-brand-teal scale-110 border-brand-teal' : 'border-slate-300 hover:scale-105'
                          }`}
                          title={p.name}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Heading Line 1 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={addSlideModal.headingLine1}
                    onChange={(e) => setAddSlideModal(prev => ({ ...prev, headingLine1: e.target.value }))}
                    placeholder="e.g. Royal"
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 bg-white focus:outline-none focus:border-brand-teal"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Heading Line 2 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={addSlideModal.headingLine2}
                    onChange={(e) => setAddSlideModal(prev => ({ ...prev, headingLine2: e.target.value }))}
                    placeholder="e.g. Occasions."
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 bg-white focus:outline-none focus:border-brand-teal"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Subtitle / Narrative <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    value={addSlideModal.subtitle}
                    onChange={(e) => setAddSlideModal(prev => ({ ...prev, subtitle: e.target.value }))}
                    placeholder="Experience royalty in our signature sequin & velvet lehenga collections..."
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 bg-white focus:outline-none focus:border-brand-teal"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                    <span>Primary Button Text</span>
                    <span className="text-[10px] font-normal text-slate-400 lowercase">(clear to remove button)</span>
                  </label>
                  <input
                    type="text"
                    value={addSlideModal.ctaText}
                    onChange={(e) => setAddSlideModal(prev => ({ ...prev, ctaText: e.target.value }))}
                    placeholder="e.g. SHOP NEW ARRIVALS"
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 bg-white focus:outline-none focus:border-brand-teal"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Primary Button Link
                  </label>
                  <input
                    type="text"
                    value={addSlideModal.ctaLink}
                    onChange={(e) => setAddSlideModal(prev => ({ ...prev, ctaLink: e.target.value }))}
                    placeholder="/products"
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 bg-white font-mono focus:outline-none focus:border-brand-teal"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                    <span>Secondary Button Text</span>
                    <span className="text-[10px] font-normal text-slate-400 lowercase">(clear to remove button)</span>
                  </label>
                  <input
                    type="text"
                    value={addSlideModal.secondaryCtaText}
                    onChange={(e) => setAddSlideModal(prev => ({ ...prev, secondaryCtaText: e.target.value }))}
                    placeholder="e.g. EXPLORE SAREES"
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 bg-white focus:outline-none focus:border-brand-teal"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Secondary Button Link
                  </label>
                  <input
                    type="text"
                    value={addSlideModal.secondaryCtaLink}
                    onChange={(e) => setAddSlideModal(prev => ({ ...prev, secondaryCtaLink: e.target.value }))}
                    placeholder="/category/sarees"
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 bg-white font-mono focus:outline-none focus:border-brand-teal"
                  />
                </div>
              </div>

              {/* 3. Three Editorial Images */}
              <div className="pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Editorial Trio Images</h4>
                  <span className="text-[11px] text-slate-400 font-medium">Portrait 4:5 ratio recommended</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Main Center Image */}
                  <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                    <span className="text-[11px] font-bold text-slate-700 block">Main Image (Center 1200×1500)</span>
                    <div className="aspect-[3/4] rounded-lg overflow-hidden border border-slate-200 bg-white flex items-center justify-center">
                      {addSlideModal.mainImage ? (
                        <img src={addSlideModal.mainImage} alt="Main" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[10px] text-slate-400">No image selected</span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => setImageModal({
                        title: 'Select Main Hero Image',
                        currentUrl: addSlideModal.mainImage,
                        onSelect: (url) => setAddSlideModal(prev => ({ ...prev, mainImage: url })),
                      })}
                      className="w-full py-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-100 transition-colors cursor-pointer shadow-2xs"
                    >
                      Choose from Library
                    </button>
                  </div>

                  {/* Left Supporting Image */}
                  <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                    <span className="text-[11px] font-bold text-slate-700 block">Left Supporting (800×1000)</span>
                    <div className="aspect-[3/4] rounded-lg overflow-hidden border border-slate-200 bg-white flex items-center justify-center">
                      {addSlideModal.detailImageLeft ? (
                        <img src={addSlideModal.detailImageLeft} alt="Left" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[10px] text-slate-400">No image selected</span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => setImageModal({
                        title: 'Select Left Supporting Image',
                        currentUrl: addSlideModal.detailImageLeft,
                        onSelect: (url) => setAddSlideModal(prev => ({ ...prev, detailImageLeft: url })),
                      })}
                      className="w-full py-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-100 transition-colors cursor-pointer shadow-2xs"
                    >
                      Choose from Library
                    </button>
                  </div>

                  {/* Right Supporting Image */}
                  <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                    <span className="text-[11px] font-bold text-slate-700 block">Right Supporting (800×1000)</span>
                    <div className="aspect-[3/4] rounded-lg overflow-hidden border border-slate-200 bg-white flex items-center justify-center">
                      {addSlideModal.detailImageRight ? (
                        <img src={addSlideModal.detailImageRight} alt="Right" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[10px] text-slate-400">No image selected</span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => setImageModal({
                        title: 'Select Right Supporting Image',
                        currentUrl: addSlideModal.detailImageRight,
                        onSelect: (url) => setAddSlideModal(prev => ({ ...prev, detailImageRight: url })),
                      })}
                      className="w-full py-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-100 transition-colors cursor-pointer shadow-2xs"
                    >
                      Choose from Library
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <span className="text-xs text-slate-500">
                Appends to slide queue as <strong>Slide #{(currentSection?.content?.slides || []).length + 1}</strong>.
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setAddSlideModal(null)}
                  className="px-5 py-2.5 border border-slate-200 text-xs font-bold text-slate-700 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const heroSec = draftSections.find(s => s.id === 'hero');
                    const currentSlides = heroSec?.content?.slides || [];
                    const newSlideNum = currentSlides.length + 1;
                    const h1 = addSlideModal.headingLine1?.trim() || `Slide ${newSlideNum}`;
                    const h2 = addSlideModal.headingLine2?.trim() || 'Collection.';
                    const newSlide = {
                      id: Date.now(),
                      ...addSlideModal,
                      eyebrow: addSlideModal.eyebrow?.trim() || 'NEW ARRIVAL',
                      headingLine1: h1,
                      headingLine2: h2,
                      subtitle: addSlideModal.subtitle?.trim() || 'Discover handcrafted luxury and modern festive silhouettes.',
                      ctaText: addSlideModal.ctaText?.trim() || 'SHOP NOW',
                      ctaLink: addSlideModal.ctaLink?.trim() || '/products',
                      secondaryCtaText: addSlideModal.secondaryCtaText?.trim() || 'VIEW ALL',
                      secondaryCtaLink: addSlideModal.secondaryCtaLink?.trim() || '/products',
                      mainImage: addSlideModal.mainImage || sareeGolden,
                      detailImageLeft: addSlideModal.detailImageLeft || sareeBeigeMaroon,
                      detailImageRight: addSlideModal.detailImageRight || sareeBeigeOrange,
                      mainLabel: `${h1} ${h2}`,
                      accentBg: addSlideModal.accentBg || '#EBF5F5',
                      enabled: true,
                    };
                    // Queue methodology: append to end of queue
                    const queuedSlides = [...currentSlides, newSlide];
                    updateSectionContent('hero', { slides: queuedSlides });
                    setActiveHeroSlideIdx(queuedSlides.length - 1);
                    setAddSlideModal(null);
                    showToast(`Slide ${newSlideNum} added successfully.`);
                  }}
                  className="flex items-center gap-2 px-6 py-2.5 bg-brand-teal hover:bg-brand-tealDark text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
                >
                  <Plus size={14} /> Add Slide
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal: Add Category Tile (Queue Methodology) ── */}
      {addCategoryTileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5 animate-[scaleIn_0.2s_ease-out] my-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">Add New Category Tile</h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">Appends to the category list as Category Tile #{(currentSection?.content?.tiles || []).length + 1}.</p>
              </div>
              <button
                type="button"
                onClick={() => setAddCategoryTileModal(null)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Live Preview */}
            <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200 flex flex-col items-center justify-center gap-2">
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-brand-teal shadow-md bg-slate-100 flex items-center justify-center">
                {addCategoryTileModal.image ? (
                  <img src={addCategoryTileModal.image} alt={addCategoryTileModal.name || 'Category'} className="w-full h-full object-cover" />
                ) : (
                  <Grid3x3 size={24} className="text-slate-400" />
                )}
              </div>
              <span className="text-xs font-bold text-slate-800">{addCategoryTileModal.name || <span className="text-slate-400 italic">Category Name</span>}</span>
              <span className="text-[10px] text-slate-400 font-mono">{addCategoryTileModal.link || '/category/...'}</span>
            </div>

            {/* Inputs */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={addCategoryTileModal.name}
                  onChange={(e) => setAddCategoryTileModal(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Kanjivaram Sarees"
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 bg-white focus:outline-none focus:border-brand-teal"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Destination Link
                </label>
                <input
                  type="text"
                  value={addCategoryTileModal.link}
                  onChange={(e) => setAddCategoryTileModal(prev => ({ ...prev, link: e.target.value }))}
                  placeholder="/category/sarees"
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 bg-white font-mono focus:outline-none focus:border-brand-teal"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Category Tile Image
                </label>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center flex-shrink-0">
                    {addCategoryTileModal.image ? (
                      <img src={addCategoryTileModal.image} alt="Category" className="w-full h-full object-cover" />
                    ) : (
                      <Grid3x3 size={16} className="text-slate-400" />
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setImageModal({
                      title: 'Select Category Tile Image',
                      currentUrl: addCategoryTileModal.image,
                      onSelect: (url) => setAddCategoryTileModal(prev => ({ ...prev, image: url })),
                    })}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50 transition cursor-pointer"
                  >
                    <Upload size={12} /> Choose from Library
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <span className="text-xs text-slate-500">Appends to queue as <strong>Category Tile #{(currentSection?.content?.tiles || []).length + 1}</strong></span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setAddCategoryTileModal(null)}
                  className="px-4 py-2 border border-slate-200 text-xs font-bold text-slate-700 rounded-xl hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!addCategoryTileModal.name?.trim()) {
                      showToast('Please enter a category name.');
                      return;
                    }
                    const currentTiles = currentSection?.content?.tiles || [];
                    const newTile = {
                      id: `cat-${Date.now()}`,
                      categoryId: `CAT-${Date.now().toString().slice(-4)}`,
                      name: addCategoryTileModal.name.trim(),
                      link: addCategoryTileModal.link?.trim() || '/products',
                      image: addCategoryTileModal.image || sareeGolden,
                      themeColor: addCategoryTileModal.themeColor || 'Teal Elegance',
                      order: 1,
                      enabled: true,
                    };
                    // Stack methodology: new category tile placed at the top (order 1)
                    const updatedTiles = [newTile, ...currentTiles].map((t, idx) => ({ ...t, order: idx + 1 }));
                    updateSectionContent('categories', { tiles: updatedTiles });
                    setAddCategoryTileModal(null);
                    showToast('New category tile added to top of stack.');
                  }}
                  className="flex items-center gap-1.5 px-5 py-2 bg-brand-teal hover:bg-brand-tealDark text-white text-xs font-bold rounded-xl shadow-md transition cursor-pointer"
                >
                  <Plus size={13} /> Add Category
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal: Edit Category Tile ── */}
      {editCategoryTileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5 animate-[scaleIn_0.2s_ease-out] my-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Edit Category Tile</h3>
                <p className="text-xs text-slate-500 mt-0.5">Modify category name, image, and destination link.</p>
              </div>
              <button
                type="button"
                onClick={() => setEditCategoryTileModal(null)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Live Preview */}
            <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200 flex flex-col items-center justify-center gap-2">
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-brand-teal shadow-md">
                <img src={editCategoryTileModal.image || sareeGolden} alt={editCategoryTileModal.name} className="w-full h-full object-cover" />
              </div>
              <span className="text-xs font-bold text-slate-800">{editCategoryTileModal.name || 'Category Name'}</span>
              <span className="text-[10px] text-slate-400 font-mono">{editCategoryTileModal.link || '/products'}</span>
            </div>

            {/* Inputs */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editCategoryTileModal.name}
                  onChange={(e) => setEditCategoryTileModal(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Kanjivaram Sarees"
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 bg-white focus:outline-none focus:border-brand-teal"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Destination Link
                </label>
                <input
                  type="text"
                  value={editCategoryTileModal.link}
                  onChange={(e) => setEditCategoryTileModal(prev => ({ ...prev, link: e.target.value }))}
                  placeholder="/category/sarees"
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 bg-white font-mono focus:outline-none focus:border-brand-teal"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Category Tile Image
                </label>
                <div className="flex items-center gap-3">
                  <img src={editCategoryTileModal.image || sareeGolden} alt="Category" className="w-12 h-12 rounded-full object-cover border border-slate-200" />
                  <button
                    type="button"
                    onClick={() => setImageModal({
                      title: 'Select Category Tile Image',
                      currentUrl: editCategoryTileModal.image,
                      onSelect: (url) => setEditCategoryTileModal(prev => ({ ...prev, image: url })),
                    })}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50 transition cursor-pointer"
                  >
                    <Upload size={12} /> Choose from Library
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditCategoryTileModal(null)}
                className="px-4 py-2 border border-slate-200 text-xs font-bold text-slate-700 rounded-xl hover:bg-slate-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!editCategoryTileModal.name?.trim()) {
                    showToast('Please enter a category name.');
                    return;
                  }
                  const currentTiles = currentSection?.content?.tiles || [];
                  const updatedTiles = currentTiles.map((t, idx) => {
                    if (idx === editCategoryTileModal.index) {
                      return {
                        ...t,
                        name: editCategoryTileModal.name.trim(),
                        link: editCategoryTileModal.link?.trim() || '/products',
                        image: editCategoryTileModal.image || sareeGolden,
                        themeColor: editCategoryTileModal.themeColor || t.themeColor || 'Teal Elegance',
                      };
                    }
                    return t;
                  });
                  updateSectionContent('categories', { tiles: updatedTiles });
                  setEditCategoryTileModal(null);
                  showToast('Category tile updated successfully.');
                }}
                className="flex items-center gap-1.5 px-5 py-2 bg-brand-teal hover:bg-brand-tealDark text-white text-xs font-bold rounded-xl shadow-md transition cursor-pointer"
              >
                <Save size={13} /> Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal: Add Promotional Banner (Queue Methodology) ── */}
      {addPromoBannerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 animate-[scaleIn_0.2s_ease-out] my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">Add Promotional Banner</h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">Appends to the banner list as Banner #{(currentSection?.content?.banners || []).length + 1}.</p>
              </div>
              <button
                type="button"
                onClick={() => setAddPromoBannerModal(null)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Live Banner Preview */}
            <div className="relative rounded-xl overflow-hidden border border-slate-200 h-36 bg-slate-900 flex items-center p-5 text-white">
              {addPromoBannerModal.image && (
                <img src={addPromoBannerModal.image} alt="Banner" className="absolute inset-0 w-full h-full object-cover opacity-40" />
              )}
              <div className="relative z-10 space-y-1 max-w-md">
                <span className="text-[10px] font-bold text-brand-teal tracking-widest uppercase block">{addPromoBannerModal.type || 'PROMOTION'}</span>
                <h4 className="font-serif text-lg font-bold leading-tight">{addPromoBannerModal.title || <span className="text-white/40 italic">Campaign Title</span>}</h4>
                <p className="text-xs text-white/80 line-clamp-1">{addPromoBannerModal.subtitle || <span className="text-white/40 italic">Campaign subtitle</span>}</p>
                {addPromoBannerModal.ctaText?.trim() ? (
                  <div className="pt-1">
                    <span className="bg-brand-teal text-white text-[9px] font-bold uppercase tracking-wider py-1 px-2.5 rounded shadow">
                      {addPromoBannerModal.ctaText}
                    </span>
                  </div>
                ) : null}
              </div>
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Banner Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={addPromoBannerModal.title}
                  onChange={(e) => setAddPromoBannerModal(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g. Grand Festive Sale"
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 bg-white focus:outline-none focus:border-brand-teal"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Subtitle</label>
                <input
                  type="text"
                  value={addPromoBannerModal.subtitle}
                  onChange={(e) => setAddPromoBannerModal(prev => ({ ...prev, subtitle: e.target.value }))}
                  placeholder="e.g. Flat 25% Off Pure Silks"
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 bg-white focus:outline-none focus:border-brand-teal"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Banner Type</label>
                <select
                  value={addPromoBannerModal.type}
                  onChange={(e) => setAddPromoBannerModal(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 bg-white focus:outline-none focus:border-brand-teal"
                >
                  <option value="PROMOTION">PROMOTION</option>
                  <option value="SEASONAL">SEASONAL</option>
                  <option value="CLEARANCE">CLEARANCE</option>
                  <option value="EVENT">EVENT</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Description Narrative</label>
                <textarea
                  rows={2}
                  value={addPromoBannerModal.description}
                  onChange={(e) => setAddPromoBannerModal(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Detailed promotion copy..."
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 bg-white focus:outline-none focus:border-brand-teal"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center justify-between">
                  <span>CTA Button Text</span>
                  <span className="text-[10px] font-normal text-slate-400 lowercase">(clear to remove button)</span>
                </label>
                <input
                  type="text"
                  value={addPromoBannerModal.ctaText}
                  onChange={(e) => setAddPromoBannerModal(prev => ({ ...prev, ctaText: e.target.value }))}
                  placeholder="e.g. SHOP NOW"
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 bg-white focus:outline-none focus:border-brand-teal"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">CTA Button Link</label>
                <input
                  type="text"
                  value={addPromoBannerModal.ctaLink}
                  onChange={(e) => setAddPromoBannerModal(prev => ({ ...prev, ctaLink: e.target.value }))}
                  placeholder="/products"
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 bg-white font-mono focus:outline-none focus:border-brand-teal"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Banner Background Image</label>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-10 rounded overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center flex-shrink-0">
                    {addPromoBannerModal.image ? (
                      <img src={addPromoBannerModal.image} alt="Banner" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[9px] text-slate-400">None</span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setImageModal({
                      title: 'Select Banner Background Image',
                      currentUrl: addPromoBannerModal.image,
                      onSelect: (url) => setAddPromoBannerModal(prev => ({ ...prev, image: url })),
                    })}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50 transition cursor-pointer"
                  >
                    <Upload size={12} /> Choose from Library
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <span className="text-xs text-slate-500">Configures as <strong>Section {((currentSection?.content?.banners || []).slice(0, 2).length) + 1} of 2</strong></span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setAddPromoBannerModal(null)}
                  className="px-4 py-2 border border-slate-200 text-xs font-bold text-slate-700 rounded-xl hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!addPromoBannerModal.title?.trim()) {
                      showToast('Please enter a banner title.');
                      return;
                    }
                    const currentBanners = (currentSection?.content?.banners || []).slice(0, 2);
                    if (currentBanners.length >= 2) {
                      showToast('Maximum 2 promotional banner sections allowed.');
                      return;
                    }
                    const newB = {
                      id: `promo-${Date.now()}`,
                      order: currentBanners.length + 1,
                      title: addPromoBannerModal.title.trim(),
                      subtitle: addPromoBannerModal.subtitle?.trim() || '',
                      description: addPromoBannerModal.description?.trim() || '',
                      type: addPromoBannerModal.type || (currentBanners.length === 0 ? 'PROMOTION' : 'COLLECTION'),
                      ctaText: addPromoBannerModal.ctaText?.trim() || 'SHOP NOW',
                      ctaLink: addPromoBannerModal.ctaLink?.trim() || '/products',
                      image: addPromoBannerModal.image || (currentBanners.length === 0 ? sareeGolden : lehengaRed),
                      enabled: true,
                    };
                    updateSectionContent('promo-banners', { banners: [...currentBanners, newB] });
                    setAddPromoBannerModal(null);
                    showToast(`Section ${currentBanners.length + 1} promotional banner added.`);
                  }}
                  className="flex items-center gap-1.5 px-5 py-2 bg-brand-teal hover:bg-brand-tealDark text-white text-xs font-bold rounded-xl shadow-md transition cursor-pointer"
                >
                  <Plus size={13} /> Add Banner
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal: Add Instagram Photo (Stack Methodology) ── */}
      {addInstagramModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-[scaleIn_0.2s_ease-out] my-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">Add Instagram Photo</h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">Appends to marquee as Photo #{(currentSection?.content?.images || []).length + 1}.</p>
              </div>
              <button
                type="button"
                onClick={() => setAddInstagramModal(null)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Live Preview */}
            <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-xl border border-slate-200 gap-2">
              <div className="w-28 h-28 rounded-xl overflow-hidden border border-slate-300 shadow bg-slate-100 flex items-center justify-center">
                {addInstagramModal.url ? (
                  <img src={addInstagramModal.url} alt={addInstagramModal.alt || 'Instagram'} className="w-full h-full object-cover" />
                ) : (
                  <Instagram size={32} className="text-slate-400" />
                )}
              </div>
              <span className="text-xs text-slate-600 font-medium line-clamp-1">{addInstagramModal.alt || <span className="text-slate-400 italic">Caption preview</span>}</span>
            </div>

            {/* Inputs */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Caption / Alt Tag <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={addInstagramModal.alt}
                  onChange={(e) => setAddInstagramModal(prev => ({ ...prev, alt: e.target.value }))}
                  placeholder="e.g. Spotted in Suka regal bridal lehenga"
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 bg-white focus:outline-none focus:border-brand-teal"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Photo Asset</label>
                <button
                  type="button"
                  onClick={() => setImageModal({
                    title: 'Select Instagram Photo',
                    currentUrl: addInstagramModal.url,
                    onSelect: (url) => setAddInstagramModal(prev => ({ ...prev, url })),
                  })}
                  className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50 transition cursor-pointer"
                >
                  <Upload size={13} /> Choose from Suka Asset Library
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <span className="text-xs text-slate-500">Appends to queue as <strong>Photo #{(currentSection?.content?.images || []).length + 1}</strong></span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setAddInstagramModal(null)}
                  className="px-4 py-2 border border-slate-200 text-xs font-bold text-slate-700 rounded-xl hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const currentImages = currentSection?.content?.images || [];
                    const newImg = {
                      id: `ig-${Date.now()}`,
                      url: addInstagramModal.url || sareeGolden,
                      alt: addInstagramModal.alt?.trim() || 'Suka fashion look',
                      enabled: true,
                    };
                    updateSectionContent('instagram', { images: [...currentImages, newImg] });
                    setAddInstagramModal(null);
                    showToast('New Instagram image added to queue.');
                  }}
                  className="flex items-center gap-1.5 px-5 py-2 bg-brand-teal hover:bg-brand-tealDark text-white text-xs font-bold rounded-xl shadow-md transition cursor-pointer"
                >
                  <Plus size={13} /> Add Photo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal: Add Spotlight Card (Stack Methodology) ── */}
      {addSpotlightModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-[scaleIn_0.2s_ease-out] my-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">Add Spotlight Card</h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">Appends to cards as Card #{(currentSection?.content?.items || []).length + 1}.</p>
              </div>
              <button
                type="button"
                onClick={() => setAddSpotlightModal(null)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Live Card Preview */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="aspect-[4/3] rounded-lg overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center">
                {addSpotlightModal.image ? (
                  <img src={addSpotlightModal.image} alt="Spotlight" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs text-slate-400">No image chosen</span>
                )}
              </div>
              <h4 className="text-xs font-bold text-slate-800">{addSpotlightModal.title || <span className="text-slate-400 italic">Card Title</span>}</h4>
              <p className="text-[11px] text-slate-500 line-clamp-1">{addSpotlightModal.subtitle || <span className="text-slate-400 italic">Card subtitle narrative</span>}</p>
            </div>

            {/* Inputs */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Card Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={addSpotlightModal.title}
                  onChange={(e) => setAddSpotlightModal(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g. Royal Velvet Edit"
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 bg-white focus:outline-none focus:border-brand-teal"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Subtitle</label>
                <input
                  type="text"
                  value={addSpotlightModal.subtitle}
                  onChange={(e) => setAddSpotlightModal(prev => ({ ...prev, subtitle: e.target.value }))}
                  placeholder="e.g. Handcrafted for celebratory moments"
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 bg-white focus:outline-none focus:border-brand-teal"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Destination Link</label>
                <input
                  type="text"
                  value={addSpotlightModal.link}
                  onChange={(e) => setAddSpotlightModal(prev => ({ ...prev, link: e.target.value }))}
                  placeholder="/category/sarees"
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 bg-white font-mono focus:outline-none focus:border-brand-teal"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Card Image</label>
                <button
                  type="button"
                  onClick={() => setImageModal({
                    title: 'Select Spotlight Card Image',
                    currentUrl: addSpotlightModal.image,
                    onSelect: (url) => setAddSpotlightModal(prev => ({ ...prev, image: url })),
                  })}
                  className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50 transition cursor-pointer"
                >
                  <Upload size={13} /> Choose from Library
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <span className="text-xs text-slate-500">Appends to queue as <strong>Card #{(currentSection?.content?.items || []).length + 1}</strong></span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setAddSpotlightModal(null)}
                  className="px-4 py-2 border border-slate-200 text-xs font-bold text-slate-700 rounded-xl hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!addSpotlightModal.title?.trim()) {
                      showToast('Please enter a spotlight card title.');
                      return;
                    }
                    const items = currentSection?.content?.items || [];
                    const newItem = {
                      id: `trend-${Date.now()}`,
                      title: addSpotlightModal.title.trim(),
                      subtitle: addSpotlightModal.subtitle?.trim() || '',
                      image: addSpotlightModal.image || ASSET_LIBRARY[0]?.url || sareeGolden,
                      link: addSpotlightModal.link?.trim() || '/category/sarees',
                      order: items.length + 1,
                      enabled: true,
                    };
                    updateSectionContent('trending', { items: [...items, newItem] });
                    setAddSpotlightModal(null);
                    showToast('New spotlight card added to queue.');
                  }}
                  className="flex items-center gap-1.5 px-5 py-2 bg-brand-teal hover:bg-brand-tealDark text-white text-xs font-bold rounded-xl shadow-md transition cursor-pointer"
                >
                  <Plus size={13} /> Add Card
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal: Add Occasion (Stack Methodology) ── */}
      {addOccasionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-[scaleIn_0.2s_ease-out] my-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">Add Curated Occasion</h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">Appends to occasions as Occasion #{(currentSection?.content?.items || []).length + 1}.</p>
              </div>
              <button
                type="button"
                onClick={() => setAddOccasionModal(null)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Live Occasion Preview */}
            <div className="relative aspect-[16/9] rounded-xl overflow-hidden border border-slate-200 bg-slate-950 flex items-end p-4 text-white">
              {addOccasionModal.image && (
                <img src={addOccasionModal.image} alt="Occasion" className="absolute inset-0 w-full h-full object-cover" />
              )}
              {/* High-contrast gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/20 pointer-events-none" />

              <div className="relative z-10 space-y-1 text-left">
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-black/50 px-2 py-0.5 rounded-md backdrop-blur-xs border border-white/10 shadow-xs">
                  <Sparkles size={11} className="text-amber-300" /> {addOccasionModal.icon || 'Sparkles'}
                </span>
                <h4 className="font-serif text-lg font-bold text-white leading-tight drop-shadow-md">
                  {addOccasionModal.name || <span className="text-white/50 italic">Occasion Name</span>}
                </h4>
                <p className="text-xs text-white/90 font-medium line-clamp-1 drop-shadow-xs">
                  {addOccasionModal.subtitle || <span className="text-white/50 italic">Curated Celebrations</span>}
                </p>
              </div>
            </div>

            {/* Inputs */}
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={addOccasionModal.name}
                    onChange={(e) => setAddOccasionModal(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Royal Wedding"
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 bg-white focus:outline-none focus:border-brand-teal font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Icon</label>
                  <select
                    value={addOccasionModal.icon}
                    onChange={(e) => setAddOccasionModal(prev => ({ ...prev, icon: e.target.value }))}
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 bg-white focus:outline-none focus:border-brand-teal"
                  >
                    {['Sparkles', 'Star', 'Gift', 'ShoppingBag', 'Tag', 'Palette'].map(ic => (
                      <option key={ic} value={ic}>{ic}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Subtitle</label>
                <input
                  type="text"
                  value={addOccasionModal.subtitle}
                  onChange={(e) => setAddOccasionModal(prev => ({ ...prev, subtitle: e.target.value }))}
                  placeholder="e.g. Timeless Celebration Silks"
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 bg-white focus:outline-none focus:border-brand-teal"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Destination Link</label>
                <input
                  type="text"
                  value={addOccasionModal.link}
                  onChange={(e) => setAddOccasionModal(prev => ({ ...prev, link: e.target.value }))}
                  placeholder="/category/occasion"
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 bg-white font-mono focus:outline-none focus:border-brand-teal"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Occasion Photo</label>
                <button
                  type="button"
                  onClick={() => setImageModal({
                    title: 'Select Occasion Photo',
                    currentUrl: addOccasionModal.image,
                    onSelect: (url) => setAddOccasionModal(prev => ({ ...prev, image: url })),
                  })}
                  className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50 transition cursor-pointer"
                >
                  <Upload size={13} /> Choose from Library
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <span className="text-xs text-slate-500">Positioned as <strong>Occasion #1 (Top of Stack)</strong></span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setAddOccasionModal(null)}
                  className="px-4 py-2 border border-slate-200 text-xs font-bold text-slate-700 rounded-xl hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!addOccasionModal.name?.trim()) {
                      showToast('Please enter an occasion name.');
                      return;
                    }
                    const items = currentSection?.content?.items || [];
                    const newItem = {
                      id: `occ-${Date.now()}`,
                      name: addOccasionModal.name.trim(),
                      subtitle: addOccasionModal.subtitle?.trim() || '',
                      icon: addOccasionModal.icon || 'Sparkles',
                      link: addOccasionModal.link?.trim() || '/category/occasion',
                      image: addOccasionModal.image || ASSET_LIBRARY[1]?.url || sareeGolden,
                      order: 1,
                      enabled: true,
                    };
                    const updatedItems = [newItem, ...items].map((it, idx) => ({ ...it, order: idx + 1 }));
                    updateSectionContent('occasion', { items: updatedItems });
                    setAddOccasionModal(null);
                    showToast(`New occasion "${newItem.name}" added to top of stack!`);
                  }}
                  className="flex items-center gap-1.5 px-5 py-2 bg-brand-teal hover:bg-brand-tealDark text-white text-xs font-bold rounded-xl shadow-md transition cursor-pointer active:scale-95"
                >
                  <Plus size={13} /> Add Occasion
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal: Add Collection Card (Stack Methodology) ── */}
      {addCollectionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-[scaleIn_0.2s_ease-out] my-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">Add Collection Card</h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">Positioned at top of stack (Card #1).</p>
              </div>
              <button
                type="button"
                onClick={() => setAddCollectionModal(null)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Live Collection Preview */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="aspect-[4/3] rounded-lg overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center">
                {addCollectionModal.image ? (
                  <img src={addCollectionModal.image} alt="Collection" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs text-slate-400">No image chosen</span>
                )}
              </div>
              <h4 className="text-xs font-bold text-slate-800">{addCollectionModal.title || <span className="text-slate-400 italic">Collection Title</span>}</h4>
              <p className="text-[11px] text-slate-500 line-clamp-1">{addCollectionModal.subtitle || <span className="text-slate-400 italic">Curated edit</span>}</p>
            </div>

            {/* Inputs */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Collection Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={addCollectionModal.title}
                  onChange={(e) => setAddCollectionModal(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g. Under ₹1999 Luxury"
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 bg-white focus:outline-none focus:border-brand-teal"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Subtitle</label>
                <input
                  type="text"
                  value={addCollectionModal.subtitle}
                  onChange={(e) => setAddCollectionModal(prev => ({ ...prev, subtitle: e.target.value }))}
                  placeholder="e.g. Handcrafted Perfection"
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 bg-white focus:outline-none focus:border-brand-teal"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Destination Link</label>
                <input
                  type="text"
                  value={addCollectionModal.link}
                  onChange={(e) => setAddCollectionModal(prev => ({ ...prev, link: e.target.value }))}
                  placeholder="/products"
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 bg-white font-mono focus:outline-none focus:border-brand-teal"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Collection Image</label>
                <button
                  type="button"
                  onClick={() => setImageModal({
                    title: 'Select Collection Image',
                    currentUrl: addCollectionModal.image,
                    onSelect: (url) => setAddCollectionModal(prev => ({ ...prev, image: url })),
                  })}
                  className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50 transition cursor-pointer"
                >
                  <Upload size={13} /> Choose from Library
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <span className="text-xs text-slate-500">Positioned as <strong>Card #1 (Top of Stack)</strong></span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setAddCollectionModal(null)}
                  className="px-4 py-2 border border-slate-200 text-xs font-bold text-slate-700 rounded-xl hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!addCollectionModal.title?.trim()) {
                      showToast('Please enter a collection title.');
                      return;
                    }
                    const items = currentSection?.content?.items || [];
                    const newItem = {
                      id: `col-${Date.now()}`,
                      title: addCollectionModal.title.trim(),
                      subtitle: addCollectionModal.subtitle?.trim() || '',
                      image: addCollectionModal.image || ASSET_LIBRARY[2]?.url || sareeGolden,
                      link: addCollectionModal.link?.trim() || '/products',
                      order: 1,
                      enabled: true,
                    };
                    const updatedItems = [newItem, ...items].map((it, idx) => ({ ...it, order: idx + 1 }));
                    updateSectionContent('collections', { items: updatedItems });
                    setAddCollectionModal(null);
                    showToast('New collection card added to top of stack.');
                  }}
                  className="flex items-center gap-1.5 px-5 py-2 bg-brand-teal hover:bg-brand-tealDark text-white text-xs font-bold rounded-xl shadow-md transition cursor-pointer active:scale-95"
                >
                  <Plus size={13} /> Add Card
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal: Add Spotlight Card for Trending Now (Stack Methodology) ── */}
      {addSpotlightModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-[scaleIn_0.2s_ease-out] my-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-brand-teal/10 text-brand-teal flex items-center justify-center">
                  <Sparkles size={16} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Add Trending Spotlight Card</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Appends to Trending Now at the top (Stack order).</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAddSpotlightModal(null)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Live Spotlight Card Preview */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="aspect-[4/3] rounded-lg overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center">
                {addSpotlightModal.image ? (
                  <img src={addSpotlightModal.image} alt="Spotlight" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs text-slate-400">No image selected</span>
                )}
              </div>
              <h4 className="text-xs font-bold text-slate-800">
                {addSpotlightModal.title || <span className="text-slate-400 italic">Spotlight Title (e.g. Modern Classics)</span>}
              </h4>
              <p className="text-[11px] text-slate-500 line-clamp-1">
                {addSpotlightModal.subtitle || <span className="text-slate-400 italic">Everyday styles reimagined.</span>}
              </p>
            </div>

            {/* Inputs */}
            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Card Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={addSpotlightModal.title}
                  onChange={(e) => setAddSpotlightModal(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g. Modern Classics / Royal Couture"
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 bg-white focus:outline-none focus:border-brand-teal font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Subtitle / Tagline</label>
                <input
                  type="text"
                  value={addSpotlightModal.subtitle}
                  onChange={(e) => setAddSpotlightModal(prev => ({ ...prev, subtitle: e.target.value }))}
                  placeholder="e.g. Everyday styles reimagined."
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 bg-white focus:outline-none focus:border-brand-teal"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Destination Link / Category Route</label>
                <input
                  type="text"
                  value={addSpotlightModal.link}
                  onChange={(e) => setAddSpotlightModal(prev => ({ ...prev, link: e.target.value }))}
                  placeholder="/category/kurtis or /products"
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 bg-white font-mono focus:outline-none focus:border-brand-teal"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Spotlight Image</label>
                <div className="space-y-2">
                  <select
                    value={ASSET_LIBRARY.find(a => a.url === addSpotlightModal.image)?.name || ''}
                    onChange={(e) => {
                      const matched = ASSET_LIBRARY.find(a => a.name === e.target.value);
                      if (matched) setAddSpotlightModal(prev => ({ ...prev, image: matched.url }));
                    }}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 bg-white focus:outline-none focus:border-brand-teal"
                  >
                    <option value="">-- Select from Asset Library --</option>
                    {ASSET_LIBRARY.map((asset) => (
                      <option key={asset.name} value={asset.name}>
                        {asset.name}
                      </option>
                    ))}
                  </select>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={addSpotlightModal.image || ''}
                      onChange={(e) => setAddSpotlightModal(prev => ({ ...prev, image: e.target.value }))}
                      placeholder="Or enter image URL..."
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 font-mono focus:outline-none focus:border-brand-teal"
                    />
                    <label className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all shrink-0 active:scale-95 shadow-2xs">
                      <Upload size={13} />
                      <span>Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              if (event.target?.result) {
                                setAddSpotlightModal(prev => ({ ...prev, image: event.target.result }));
                                showToast('Image uploaded.');
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <span className="text-xs text-slate-500">
                Positioned as <strong>Card #1 (Top of Stack)</strong>
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setAddSpotlightModal(null)}
                  className="px-4 py-2 border border-slate-200 text-xs font-bold text-slate-700 rounded-xl hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!addSpotlightModal.title?.trim()) {
                      showToast('Please enter a card title.');
                      return;
                    }
                    const items = currentSection?.content?.items || [];
                    const newItem = {
                      id: `trend-${Date.now()}`,
                      title: addSpotlightModal.title.trim(),
                      subtitle: addSpotlightModal.subtitle?.trim() || '',
                      link: addSpotlightModal.link?.trim() || '/category/kurtis',
                      image: addSpotlightModal.image || kurtiTealPrinted,
                      order: 1,
                      enabled: true,
                    };
                    const updatedItems = [newItem, ...items].map((it, idx) => ({
                      ...it,
                      order: idx + 1,
                    }));
                    updateSectionContent('trending', { items: updatedItems });
                    setAddSpotlightModal(null);
                    showToast(`Spotlight card "${newItem.title}" added to Trending Now!`);
                  }}
                  className="flex items-center gap-1.5 px-5 py-2 bg-brand-teal hover:bg-brand-tealDark text-white text-xs font-bold rounded-xl shadow-md transition cursor-pointer active:scale-95"
                >
                  <Plus size={13} /> Add Card
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Image Library & Upload Modal */}
      {imageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-4xl w-full p-8 shadow-2xl space-y-5 animate-[scaleIn_0.2s_ease-out]">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">{imageModal.title}</h3>
                <p className="text-sm text-slate-400 mt-0.5">Select from verified Suka high-resolution assets</p>
              </div>
              <button onClick={() => setImageModal(null)} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 max-h-[60vh] overflow-y-auto p-1">
                {/* Upload Custom File Tile */}
                <label className="group flex flex-col items-center justify-center gap-1.5 p-2 rounded-xl border-2 border-dashed border-slate-300 hover:border-brand-teal hover:bg-brand-powder/20 transition-all text-center cursor-pointer aspect-[3/4]">
                  <div className="w-10 h-10 rounded-full bg-brand-powder/60 text-brand-teal flex items-center justify-center mb-0.5 group-hover:scale-110 transition-transform shadow-2xs">
                    <Upload size={18} />
                  </div>
                  <span className="text-xs font-bold text-slate-700">Upload Image</span>
                  <span className="text-[9.5px] text-slate-400">JPG, PNG, WebP</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          if (event.target?.result) {
                            imageModal.onSelect(event.target.result);
                            setImageModal(null);
                            showToast('Image uploaded & applied.');
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="hidden"
                  />
                </label>

                {ASSET_LIBRARY.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => {
                      imageModal.onSelect(item.url);
                      setImageModal(null);
                      showToast('Image selected.');
                    }}
                    className="group flex flex-col items-center gap-2 p-2 rounded-xl border border-slate-200 hover:border-brand-teal hover:shadow-md transition-all text-left cursor-pointer"
                  >
                    <div className="aspect-[3/4] w-full rounded-lg overflow-hidden bg-slate-100">
                      <img src={item.url} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    </div>
                    <span className="text-xs font-medium text-slate-700 truncate w-full text-center">{item.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Product Picker Modal */}
      {productPickerModal && (() => {
        // Build list of product categories
        const categoryTabs = ['All', 'Sarees', 'Kurtis', 'Lehengas', 'Suits', 'Dresses', 'Coords', 'Dupattas'];
        products.forEach(p => {
          if (p.category) {
            const raw = p.category.trim();
            const formatted = raw.charAt(0).toUpperCase() + raw.slice(1);
            if (!categoryTabs.some(c => c.toLowerCase() === raw.toLowerCase())) {
              categoryTabs.push(formatted);
            }
          }
        });

        const isCategoryMatch = (p, target) => {
          if (!target || target === 'All') return true;
          const pCat = (p.category || '').toLowerCase().trim();
          const t = target.toLowerCase().trim();
          if (pCat === t) return true;
          if (pCat.includes(t) || t.includes(pCat)) return true;
          if (t === 'kurtis' || t === 'kurti' || t === 'kurthi') {
            return pCat.includes('kurti') || pCat.includes('kurthi') || pCat.includes('anarkali');
          }
          if (t === 'sarees' || t === 'saree') {
            return pCat.includes('saree');
          }
          if (t === 'lehengas' || t === 'lehenga') {
            return pCat.includes('lehenga');
          }
          if (t === 'suits' || t === 'suit') {
            return pCat.includes('suit') || pCat.includes('anarkali');
          }
          if (t === 'dresses' || t === 'dress') {
            return pCat.includes('dress');
          }
          if (t === 'coords' || t === 'coord') {
            return pCat.includes('coord');
          }
          if (t === 'dupattas' || t === 'dupatta') {
            return pCat.includes('dupatta');
          }
          return false;
        };

        const getCount = (cat) => {
          if (cat === 'All') return products.length;
          return products.filter(p => isCategoryMatch(p, cat)).length;
        };

        const filteredProducts = products.filter(p => {
          if (!isCategoryMatch(p, pickerCategory)) return false;
          if (pickerSearch.trim()) {
            const q = pickerSearch.toLowerCase().trim();
            const matchesName = (p.name || '').toLowerCase().includes(q);
            const matchesId = (p.id || '').toLowerCase().includes(q);
            const matchesCategory = (p.category || '').toLowerCase().includes(q);
            const matchesSubcat = (p.subcategory || '').toLowerCase().includes(q);
            if (!matchesName && !matchesId && !matchesCategory && !matchesSubcat) return false;
          }
          return true;
        });

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/60 backdrop-blur-xs">
            <div className="bg-white rounded-2xl max-w-5xl w-full p-8 shadow-2xl space-y-5 animate-[scaleIn_0.2s_ease-out]">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Product Picker</h3>
                  <p className="text-sm text-slate-500 mt-0.5">Select catalog products to include in this showcase.</p>
                </div>
                <button
                  onClick={() => setProductPickerModal(null)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Filter Bar with Search, Type Dropdown, and Quick Category Buttons */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  {/* Search Input */}
                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 flex-1 focus-within:border-brand-teal focus-within:ring-2 focus-within:ring-brand-teal/10 transition-all">
                    <Search size={16} className="text-slate-400 shrink-0" />
                    <input
                      type="text"
                      value={pickerSearch}
                      onChange={(e) => setPickerSearch(e.target.value)}
                      placeholder="Search products by name, SKU, or category..."
                      className="bg-transparent text-sm text-slate-800 outline-none w-full placeholder:text-slate-400"
                    />
                    {pickerSearch && (
                      <button
                        type="button"
                        onClick={() => setPickerSearch('')}
                        className="text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>

                  {/* Type Selection Dropdown Button */}
                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 shrink-0 focus-within:border-brand-teal focus-within:ring-2 focus-within:ring-brand-teal/10 transition-all">
                    <Filter size={15} className="text-brand-teal shrink-0" />
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-wider shrink-0">Type:</span>
                    <select
                      value={pickerCategory}
                      onChange={(e) => setPickerCategory(e.target.value)}
                      className="bg-transparent text-xs font-bold text-slate-800 outline-none cursor-pointer pr-1"
                    >
                      {categoryTabs.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat === 'All' ? 'All Product Types' : cat} ({getCount(cat)})
                        </option>
                      ))}
                    </select>
                    {pickerCategory !== 'All' && (
                      <button
                        type="button"
                        onClick={() => setPickerCategory('All')}
                        title="Reset to All Types"
                        className="text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer ml-0.5"
                      >
                        <X size={13} />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Product List */}
              {filteredProducts.length === 0 ? (
                <div className="py-16 text-center border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                  <p className="text-sm font-bold text-slate-700">No products found</p>
                  <p className="text-xs text-slate-400 mt-1">No products match "{pickerSearch || pickerCategory}"</p>
                  <button
                    type="button"
                    onClick={() => {
                      setPickerSearch('');
                      setPickerCategory('All');
                    }}
                    className="mt-3 px-3.5 py-1.5 text-xs font-bold text-brand-teal bg-brand-teal/10 rounded-lg hover:bg-brand-teal/20 transition cursor-pointer"
                  >
                    Show All Products
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-h-[60vh] overflow-y-auto p-1">
                  {filteredProducts.map((p) => {
                    const pId = p.id || p.slug;
                    const currentSelected = productPickerModal.selectedIds;
                    const isSelected = currentSelected.includes(pId);
                    const imgSrc = p.image || p.colors?.[0]?.images?.[0]?.url || p.colors?.[0]?.images?.[0] || sareeGolden;

                    return (
                      <div
                        key={pId}
                        onClick={() => {
                          const nextIds = isSelected
                            ? currentSelected.filter(id => id !== pId)
                            : [...currentSelected, pId];
                          setProductPickerModal(prev => ({ ...prev, selectedIds: nextIds }));
                        }}
                        className={`p-3 rounded-xl border-2 transition-all cursor-pointer ${
                          isSelected
                            ? 'border-brand-teal bg-brand-powder/30 shadow-sm'
                            : 'border-slate-200 hover:border-slate-300 bg-white hover:shadow-sm'
                        }`}
                      >
                        <div className="aspect-[3/4] rounded-lg overflow-hidden bg-slate-50 mb-2.5 relative">
                          <img src={imgSrc} alt={p.name} className="w-full h-full object-cover" />
                          {isSelected && (
                            <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-brand-teal text-white flex items-center justify-center shadow-md">
                              <Check size={14} strokeWidth={3} />
                            </div>
                          )}
                          {p.category && (
                            <span className="absolute bottom-2 left-2 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-black/60 text-white backdrop-blur-xs">
                              {p.category}
                            </span>
                          )}
                        </div>
                        <span className="text-sm font-bold text-slate-800 block truncate" title={p.name}>{p.name}</span>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-slate-500 font-mono">₹{p.price}</span>
                          <span className={`text-[10px] font-bold ${isSelected ? 'text-brand-teal' : 'text-slate-400'}`}>
                            {isSelected ? 'Selected' : 'Click to add'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Modal Footer Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-slate-700">
                    <strong className="text-brand-teal font-bold">{productPickerModal.selectedIds.length}</strong> Products Selected
                  </span>
                  {productPickerModal.selectedIds.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setProductPickerModal(prev => ({ ...prev, selectedIds: [] }))}
                      className="text-xs text-red-500 hover:text-red-700 hover:underline font-semibold cursor-pointer"
                    >
                      Clear Selection
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setProductPickerModal(null)}
                    className="px-5 py-2.5 border border-slate-200 text-sm font-bold text-slate-700 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      updateSectionContent(productPickerModal.sectionId, {
                        selectedProductIds: productPickerModal.selectedIds,
                      });
                      setProductPickerModal(null);
                      showToast('Selected products saved.');
                    }}
                    className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-xl shadow-sm transition-colors cursor-pointer"
                  >
                    Save Selection
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ─── ADD HERO SLIDE POPUP MODAL ─── */}
      {addSlideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-brand-teal/10 text-brand-teal flex items-center justify-center">
                  <Sparkles size={16} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Add New Hero Slide</h3>
                  <p className="text-xs text-slate-500">Configure headlines, buttons, background theme, and imagery.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAddSlideModal(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form Body */}
            <div className="p-6 overflow-y-auto space-y-5 flex-1 text-left">
              {/* Eyebrow & Theme */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Eyebrow Tag
                  </label>
                  <input
                    type="text"
                    value={addSlideModal.eyebrow}
                    onChange={(e) => setAddSlideModal(prev => ({ ...prev, eyebrow: e.target.value }))}
                    placeholder="e.g. FESTIVE COUTURE"
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-brand-teal"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Background Color Theme
                  </label>
                  <div className="flex items-center gap-2 flex-wrap pt-0.5">
                    {HERO_BG_PRESETS.map((preset) => (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => setAddSlideModal(prev => ({ ...prev, accentBg: preset.color }))}
                        title={preset.name}
                        className={`w-7 h-7 rounded-full border transition-all cursor-pointer flex items-center justify-center ${
                          addSlideModal.accentBg === preset.color
                            ? 'ring-2 ring-brand-teal ring-offset-2 scale-110'
                            : 'border-slate-300 hover:scale-105'
                        }`}
                        style={{ backgroundColor: preset.color }}
                      >
                        {addSlideModal.accentBg === preset.color && <Check size={11} className="text-brand-navy" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Headings */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Heading Line 1
                  </label>
                  <input
                    type="text"
                    value={addSlideModal.headingLine1}
                    onChange={(e) => setAddSlideModal(prev => ({ ...prev, headingLine1: e.target.value }))}
                    placeholder="e.g. Grace in"
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-brand-teal"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Heading Line 2
                  </label>
                  <input
                    type="text"
                    value={addSlideModal.headingLine2}
                    onChange={(e) => setAddSlideModal(prev => ({ ...prev, headingLine2: e.target.value }))}
                    placeholder="e.g. Every Drape."
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-brand-teal"
                  />
                </div>
              </div>

              {/* Subtitle */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Subtitle / Editorial Narrative
                </label>
                <textarea
                  rows={2}
                  value={addSlideModal.subtitle}
                  onChange={(e) => setAddSlideModal(prev => ({ ...prev, subtitle: e.target.value }))}
                  placeholder="Enter narrative description..."
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-brand-teal"
                />
              </div>

              {/* Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Primary CTA Button
                  </label>
                  <input
                    type="text"
                    value={addSlideModal.ctaText}
                    onChange={(e) => setAddSlideModal(prev => ({ ...prev, ctaText: e.target.value }))}
                    placeholder="Button text (e.g. SHOP NOW)"
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-brand-teal"
                  />
                  <input
                    type="text"
                    value={addSlideModal.ctaLink}
                    onChange={(e) => setAddSlideModal(prev => ({ ...prev, ctaLink: e.target.value }))}
                    placeholder="Link URL (e.g. /products)"
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 font-mono focus:outline-none focus:border-brand-teal"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Secondary CTA Button
                  </label>
                  <input
                    type="text"
                    value={addSlideModal.secondaryCtaText}
                    onChange={(e) => setAddSlideModal(prev => ({ ...prev, secondaryCtaText: e.target.value }))}
                    placeholder="Button text (e.g. EXPLORE SAREES)"
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-brand-teal"
                  />
                  <input
                    type="text"
                    value={addSlideModal.secondaryCtaLink}
                    onChange={(e) => setAddSlideModal(prev => ({ ...prev, secondaryCtaLink: e.target.value }))}
                    placeholder="Link URL (e.g. /category/sarees)"
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 font-mono focus:outline-none focus:border-brand-teal"
                  />
                </div>
              </div>

              {/* Slide Images Picker */}
              <div className="pt-2 border-t border-slate-100 space-y-3">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Select Slide Imagery
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {/* Main Center Image */}
                  <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                    <span className="text-[10px] font-bold text-slate-700 block truncate">Main Center</span>
                    <div className="aspect-[3/4] rounded-lg overflow-hidden border border-slate-200 bg-white">
                      <img src={addSlideModal.mainImage} alt="Main" className="w-full h-full object-cover" />
                    </div>
                    <select
                      value={ASSET_LIBRARY.find(a => a.url === addSlideModal.mainImage)?.name || ''}
                      onChange={(e) => {
                        const matched = ASSET_LIBRARY.find(a => a.name === e.target.value);
                        if (matched) setAddSlideModal(prev => ({ ...prev, mainImage: matched.url }));
                      }}
                      className="w-full text-[10px] font-bold border border-slate-200 rounded-lg p-1 bg-white truncate"
                    >
                      {ASSET_LIBRARY.map((asset) => (
                        <option key={asset.name} value={asset.name}>{asset.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Left Detail Image */}
                  <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                    <span className="text-[10px] font-bold text-slate-700 block truncate">Left Supporting</span>
                    <div className="aspect-[3/4] rounded-lg overflow-hidden border border-slate-200 bg-white">
                      <img src={addSlideModal.detailImageLeft} alt="Left" className="w-full h-full object-cover" />
                    </div>
                    <select
                      value={ASSET_LIBRARY.find(a => a.url === addSlideModal.detailImageLeft)?.name || ''}
                      onChange={(e) => {
                        const matched = ASSET_LIBRARY.find(a => a.name === e.target.value);
                        if (matched) setAddSlideModal(prev => ({ ...prev, detailImageLeft: matched.url }));
                      }}
                      className="w-full text-[10px] font-bold border border-slate-200 rounded-lg p-1 bg-white truncate"
                    >
                      {ASSET_LIBRARY.map((asset) => (
                        <option key={asset.name} value={asset.name}>{asset.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Right Detail Image */}
                  <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                    <span className="text-[10px] font-bold text-slate-700 block truncate">Right Supporting</span>
                    <div className="aspect-[3/4] rounded-lg overflow-hidden border border-slate-200 bg-white">
                      <img src={addSlideModal.detailImageRight} alt="Right" className="w-full h-full object-cover" />
                    </div>
                    <select
                      value={ASSET_LIBRARY.find(a => a.url === addSlideModal.detailImageRight)?.name || ''}
                      onChange={(e) => {
                        const matched = ASSET_LIBRARY.find(a => a.name === e.target.value);
                        if (matched) setAddSlideModal(prev => ({ ...prev, detailImageRight: matched.url }));
                      }}
                      className="w-full text-[10px] font-bold border border-slate-200 rounded-lg p-1 bg-white truncate"
                    >
                      {ASSET_LIBRARY.map((asset) => (
                        <option key={asset.name} value={asset.name}>{asset.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50">
              <button
                type="button"
                onClick={() => setAddSlideModal(null)}
                className="px-4 py-2 border border-slate-200 text-xs font-bold text-slate-700 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmAddSlide}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer active:scale-95"
              >
                <Plus size={14} />
                <span>Add Slide to Hero Slider</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── EDIT PROMO BANNER POPUP MODAL ─── */}
      {editPromoBannerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-brand-teal/10 text-brand-teal flex items-center justify-center">
                  <Image size={16} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Edit Promo Banner {editPromoBannerModal.bannerNum}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Modify headline, subtitle, call to action, narrative copy, and banner image.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditPromoBannerModal(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form Body */}
            <div className="p-6 overflow-y-auto space-y-5 flex-1 text-left">
              {/* Headline & Subtitle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Headline
                  </label>
                  <input
                    type="text"
                    value={editPromoBannerModal.title || ''}
                    onChange={(e) =>
                      setEditPromoBannerModal((prev) => ({ ...prev, title: e.target.value }))
                    }
                    placeholder="e.g. Royal Heritage Silks"
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-brand-teal font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    value={editPromoBannerModal.subtitle || ''}
                    onChange={(e) =>
                      setEditPromoBannerModal((prev) => ({ ...prev, subtitle: e.target.value }))
                    }
                    placeholder="e.g. Handcrafted Pure Kanchipuram & Organza"
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-brand-teal"
                  />
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    CTA Button Text
                  </label>
                  <input
                    type="text"
                    value={editPromoBannerModal.ctaText || ''}
                    onChange={(e) =>
                      setEditPromoBannerModal((prev) => ({ ...prev, ctaText: e.target.value }))
                    }
                    placeholder="e.g. SHOP SAREES"
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-brand-teal font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    CTA Target Link
                  </label>
                  <input
                    type="text"
                    value={editPromoBannerModal.ctaLink || ''}
                    onChange={(e) =>
                      setEditPromoBannerModal((prev) => ({ ...prev, ctaLink: e.target.value }))
                    }
                    placeholder="e.g. /category/sarees"
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 font-mono focus:outline-none focus:border-brand-teal"
                  />
                </div>
              </div>

              {/* Description / Narrative */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Description / Narrative Copy
                </label>
                <textarea
                  rows={3}
                  value={editPromoBannerModal.description || ''}
                  onChange={(e) =>
                    setEditPromoBannerModal((prev) => ({ ...prev, description: e.target.value }))
                  }
                  placeholder="Enter detailed marketing narrative or offer details..."
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-brand-teal"
                />
              </div>

              {/* Banner Image Selection */}
              <div className="pt-2 border-t border-slate-100 space-y-3">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Banner Imagery
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-4 items-center">
                  <div className="h-36 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center p-2 relative shadow-2xs">
                    <img
                      src={editPromoBannerModal.image}
                      alt="Banner Preview"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div className="space-y-3">
                    <div>
                      <span className="text-[11px] font-bold text-slate-600 block mb-1">
                        Select from Asset Library
                      </span>
                      <select
                        value={
                          ASSET_LIBRARY.find((a) => a.url === editPromoBannerModal.image)?.name || ''
                        }
                        onChange={(e) => {
                          const matched = ASSET_LIBRARY.find((a) => a.name === e.target.value);
                          if (matched) {
                            setEditPromoBannerModal((prev) => ({ ...prev, image: matched.url }));
                          }
                        }}
                        className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 bg-white focus:outline-none focus:border-brand-teal"
                      >
                        <option value="">-- Choose Asset Image --</option>
                        {ASSET_LIBRARY.map((asset) => (
                          <option key={asset.name} value={asset.name}>
                            {asset.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-slate-600 block mb-1">
                        Or Image URL & Local Upload
                      </span>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editPromoBannerModal.image || ''}
                          onChange={(e) =>
                            setEditPromoBannerModal((prev) => ({ ...prev, image: e.target.value }))
                          }
                          placeholder="https://... or /assets/..."
                          className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 font-mono focus:outline-none focus:border-brand-teal"
                        />
                        <label className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all shrink-0 active:scale-95 shadow-2xs">
                          <Upload size={13} />
                          <span>Upload Image</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (event) => {
                                  if (event.target?.result) {
                                    setEditPromoBannerModal((prev) => ({
                                      ...prev,
                                      image: event.target.result,
                                    }));
                                    showToast('Image uploaded successfully.');
                                  }
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50">
              <button
                type="button"
                onClick={() => setEditPromoBannerModal(null)}
                className="px-4 py-2 border border-slate-200 text-xs font-bold text-slate-700 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveEditPromoBanner}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer active:scale-95"
              >
                <Save size={14} />
                <span>Save Banner Changes</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── ADD SPOTLIGHT CARD POPUP MODAL ─── */}
      {addSpotlightModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-brand-teal/10 text-brand-teal flex items-center justify-center">
                  <Sparkles size={16} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Add New Spotlight Card
                  </h3>
                  <p className="text-xs text-slate-500">
                    Fill in card details, select a photo, and specify destination link.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAddSpotlightModal(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form Body */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1 text-left">
              {/* Title & Subtitle */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Card Title *
                </label>
                <input
                  type="text"
                  required
                  value={addSpotlightModal.title || ''}
                  onChange={(e) =>
                    setAddSpotlightModal((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="e.g. Modern Classics"
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-brand-teal font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Subtitle
                </label>
                <input
                  type="text"
                  value={addSpotlightModal.subtitle || ''}
                  onChange={(e) =>
                    setAddSpotlightModal((prev) => ({ ...prev, subtitle: e.target.value }))
                  }
                  placeholder="e.g. Everyday styles reimagined."
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-brand-teal"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Destination Link URL
                </label>
                <input
                  type="text"
                  value={addSpotlightModal.link || ''}
                  onChange={(e) =>
                    setAddSpotlightModal((prev) => ({ ...prev, link: e.target.value }))
                  }
                  placeholder="e.g. /category/kurtis or /products"
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-mono focus:outline-none focus:border-brand-teal"
                />
                {/* Quick Link Category Pills */}
                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                  <span className="text-[10px] text-slate-400 font-semibold">Quick links:</span>
                  {['/category/sarees', '/category/kurtis', '/category/lehengas', '/category/dresses', '/category/occasion', '/products'].map((catLink) => (
                    <button
                      key={catLink}
                      type="button"
                      onClick={() => setAddSpotlightModal(prev => ({ ...prev, link: catLink }))}
                      className="px-2 py-0.5 rounded-md text-[10px] bg-slate-100 hover:bg-brand-teal hover:text-white text-slate-600 font-mono transition-colors cursor-pointer"
                    >
                      {catLink}
                    </button>
                  ))}
                </div>
              </div>

              {/* Photo Selection */}
              <div className="pt-2 border-t border-slate-100 space-y-3">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Card Photo
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-4 items-center">
                  <div className="h-32 aspect-[3/4] rounded-xl overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center p-1 relative shadow-2xs">
                    {addSpotlightModal.image ? (
                      <img
                        src={addSpotlightModal.image}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="text-center p-2 text-slate-400">
                        <Image size={24} className="mx-auto mb-1 opacity-50" />
                        <span className="text-[10px] block">No Photo</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2.5">
                    <div>
                      <span className="text-[11px] font-bold text-slate-600 block mb-1">
                        Select from Asset Library
                      </span>
                      <select
                        value={
                          ASSET_LIBRARY.find((a) => a.url === addSpotlightModal.image)?.name || ''
                        }
                        onChange={(e) => {
                          const matched = ASSET_LIBRARY.find((a) => a.name === e.target.value);
                          if (matched) {
                            setAddSpotlightModal((prev) => ({ ...prev, image: matched.url }));
                          }
                        }}
                        className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 bg-white focus:outline-none focus:border-brand-teal"
                      >
                        <option value="">-- Choose Asset Image --</option>
                        {ASSET_LIBRARY.map((asset) => (
                          <option key={asset.name} value={asset.name}>
                            {asset.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <span className="text-[11px] font-bold text-slate-600 block mb-1">
                        Or Upload / Custom Image URL
                      </span>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={addSpotlightModal.image || ''}
                          onChange={(e) =>
                            setAddSpotlightModal((prev) => ({ ...prev, image: e.target.value }))
                          }
                          placeholder="https://... or choose above"
                          className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 font-mono focus:outline-none focus:border-brand-teal"
                        />
                        <label className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all shrink-0 active:scale-95 shadow-2xs">
                          <Upload size={13} />
                          <span>Upload</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (event) => {
                                  if (event.target?.result) {
                                    setAddSpotlightModal((prev) => ({
                                      ...prev,
                                      image: event.target.result,
                                    }));
                                    showToast('Photo uploaded.');
                                  }
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50">
              <button
                type="button"
                onClick={() => setAddSpotlightModal(null)}
                className="px-4 py-2 border border-slate-200 text-xs font-bold text-slate-700 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const currentTrending = draftSections.find(s => s.id === 'trending')?.content || {};
                  const currentItems = currentTrending.items || [];
                  const newCard = {
                    id: `trend-${Date.now()}`,
                    title: addSpotlightModal.title?.trim() || 'Curated Edit',
                    subtitle: addSpotlightModal.subtitle?.trim() || '',
                    image: addSpotlightModal.image || sareeGolden,
                    link: addSpotlightModal.link?.trim() || '/category/kurtis',
                    order: currentItems.length + 1,
                    enabled: true,
                  };
                  updateSectionContent('trending', { items: [...currentItems, newCard] });
                  setAddSpotlightModal(null);
                  showToast('Spotlight Card added successfully.');
                }}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-brand-teal hover:bg-brand-tealDark text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer active:scale-95"
              >
                <Plus size={14} />
                <span>Add Spotlight Card</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. General Confirmation Modal */}
      {confirmModal && (
        <ConfirmModal
          isOpen={!!confirmModal}
          onClose={() => setConfirmModal(null)}
          onConfirm={() => {
            confirmModal.onConfirm();
            setConfirmModal(null);
          }}
          title={confirmModal.title}
          message={confirmModal.message}
          confirmLabel={confirmModal.confirmLabel}
          variant={confirmModal.variant}
        />
      )}
    </div>
  );
}
