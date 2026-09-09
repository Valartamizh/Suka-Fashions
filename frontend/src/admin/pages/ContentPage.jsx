// ContentPage — /admin/content (Comprehensive Homepage & Landing Page Content Engine)
import React, { useState, useMemo } from 'react';
import {
  LayoutTemplate, ImagePlay, Grid3x3, Sparkles, TrendingUp,
  Image, ShoppingBag, Palette, BookOpen, Scissors, Star,
  Instagram, Gift, Mail, Edit, ExternalLink, X, Save, Check,
  RotateCcw, Plus, Trash2, Search, Eye, EyeOff, GripVertical,
  ArrowUp, ArrowDown, CheckCircle2, ChevronRight, Filter,
  Tag, SlidersHorizontal, Layers, ArrowRight, Upload, RefreshCw
} from 'lucide-react';
import AdminPageHeader from '../components/ui/AdminPageHeader';
import ConfirmModal from '../components/ui/ConfirmModal';
import { useContent } from '../../context/ContentContext';
import { useProducts } from '../../context/ProductContext';
import { useCategories } from '../../context/CategoryContext';

// Local asset fallbacks
import sareeGolden from '../../assets/saree_golden.jpg';
import sareeBeigePink from '../../assets/saree_beige_pink.jpg';
import sareeBeigeMaroon from '../../assets/saree_beige_maroon.jpg';
import sareeBeigeOrange from '../../assets/saree_beige_orange.jpg';
import lehengaRed from '../../assets/lehenga_red.jpg';
import lehengaPink from '../../assets/lehenga_pink.jpg';
import lehengaMint from '../../assets/lehenga_mint.jpg';
import kurtiTealPrinted from '../../assets/kurti_teal_printed.jpg';
import kurtiPurplePrinted from '../../assets/kurti_purple_printed.jpg';
import kurtiBrownPrinted from '../../assets/kurti_brown_printed.jpg';
import anarkaliBlackMulti from '../../assets/anarkali_black_multicolor.jpg';
import coordSet from '../../assets/coord_set.jpg';
import festiveSuit from '../../assets/festive_suit.jpg';
import dressNavy from '../../assets/dress_navy.jpg';

// Map icon types to appropriate Lucide components
const ICON_MAP = {
  announcement: LayoutTemplate,
  hero: ImagePlay,
  categories: Grid3x3,
  'promo-banners': Image,
  'new-arrivals': Sparkles,
  'best-sellers': TrendingUp,
  'four-pillars': Gift,
  trending: TrendingUp,
  occasion: ShoppingBag,
  collections: Palette,
  'brand-story': BookOpen,
  craftsmanship: Scissors,
  testimonials: Star,
  instagram: Instagram,
  newsletter: Mail,
};

// Section badge definitions
const SECTION_BADGES = {
  hero: 'Hero Showcase',
  categories: 'Category Grid',
  'promo-banners': 'Promo Banner • Promotion',
  'new-arrivals': 'Fresh Drops',
  'best-sellers': 'Most Loved',
  'four-pillars': 'Trust Badges',
  trending: 'Curated Highlights',
  occasion: 'Occasion Edit',
  collections: 'Curated Edit',
  testimonials: 'Client Reviews',
  instagram: 'Social Grid',
  'brand-story': 'Brand Story',
  announcement: 'Header Bar',
  newsletter: 'Email Signup',
};

// Theme presets for Category Tiles
const CATEGORY_THEMES = [
  {
    name: 'Orange Gradient',
    bgGradient: 'from-amber-200/90 via-orange-100 to-amber-100/80',
    borderColor: 'border-orange-200/80',
    textColor: 'text-amber-950',
    dotColor: '#F97316',
    previewBg: 'bg-orange-100 text-orange-800',
  },
  {
    name: 'Mint Green',
    bgGradient: 'from-emerald-100/90 via-teal-100/80 to-green-100/80',
    borderColor: 'border-emerald-200/80',
    textColor: 'text-emerald-950',
    dotColor: '#10B981',
    previewBg: 'bg-emerald-100 text-emerald-800',
  },
  {
    name: 'Soft Pink',
    bgGradient: 'from-rose-100/90 via-pink-100 to-rose-100/80',
    borderColor: 'border-pink-200/80',
    textColor: 'text-rose-950',
    dotColor: '#EC4899',
    previewBg: 'bg-pink-100 text-pink-800',
  },
  {
    name: 'Lavender Purple',
    bgGradient: 'from-purple-100/90 via-violet-100 to-indigo-100/80',
    borderColor: 'border-purple-200/80',
    textColor: 'text-purple-950',
    dotColor: '#8B5CF6',
    previewBg: 'bg-purple-100 text-purple-800',
  },
  {
    name: 'Soft Gold',
    bgGradient: 'from-amber-100/90 via-yellow-100/80 to-amber-100/70',
    borderColor: 'border-amber-200/80',
    textColor: 'text-amber-950',
    dotColor: '#F59E0B',
    previewBg: 'bg-amber-100 text-amber-800',
  },
  {
    name: 'Sky Blue',
    bgGradient: 'from-sky-100/90 via-blue-100/80 to-cyan-100/80',
    borderColor: 'border-sky-200/80',
    textColor: 'text-sky-950',
    dotColor: '#0EA5E9',
    previewBg: 'bg-sky-100 text-sky-800',
  },
  {
    name: 'Teal Elegance',
    bgGradient: 'from-teal-100/90 via-cyan-100 to-emerald-100/80',
    borderColor: 'border-teal-200/80',
    textColor: 'text-teal-950',
    dotColor: '#14B8A6',
    previewBg: 'bg-teal-100 text-teal-800',
  },
];

export default function ContentPage() {
  const {
    sections,
    toggleSection,
    updateSectionContent,
    reorderSections,
    moveSection,
    resetContent
  } = useContent();

  const { products } = useProducts();
  const { categories: storeCategories } = useCategories();

  // Active top navigation tab
  const [activeTab, setActiveTab] = useState('categories'); // 'layout' | 'categories' | 'hero' | 'promo-banners' | 'new-arrivals' | 'best-sellers' | etc.

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modals state
  const [categoryModal, setCategoryModal] = useState(null); // { mode: 'add'|'edit', data: {...} }
  const [bannerModal, setBannerModal] = useState(null); // { mode: 'add'|'edit', data: {...} }
  const [productPickerModal, setProductPickerModal] = useState(null); // { targetSection: 'new-arrivals'|'best-sellers' }
  const [selectedProductIdsInPicker, setSelectedProductIdsInPicker] = useState([]);
  const [pickerCategoryFilter, setPickerCategoryFilter] = useState('All');
  const [pickerSearch, setPickerSearch] = useState('');

  // Hero slide modal / state
  const [heroSlideModal, setHeroSlideModal] = useState(null);
  const [activeHeroSlideIdx, setActiveHeroSlideIdx] = useState(0);

  // General Edit Modal for other sections
  const [genericEditModal, setGenericEditModal] = useState(null);
  const [genericEditForm, setGenericEditForm] = useState({});

  // Confirmation modal & Toast
  const [confirmModal, setConfirmModal] = useState(null);
  const [toast, setToast] = useState(null);

  // Drag-and-drop state
  const [draggedIdx, setDraggedIdx] = useState(null);
  const [dragOverIdx, setDragOverIdx] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  // ── Top Navigation Tabs Bar ──
  const topTabs = [
    { id: 'layout', label: 'Homepage Layout', icon: Layers },
    { id: 'categories', label: 'Shop by Category', icon: Grid3x3 },
    { id: 'hero', label: 'Hero Slides', icon: ImagePlay },
    { id: 'promo-banners', label: 'Promo Banners', icon: Image },
    { id: 'new-arrivals', label: 'New Arrivals', icon: Sparkles },
    { id: 'best-sellers', label: 'Best Sellers', icon: TrendingUp },
    { id: 'four-pillars', label: 'Four Pillars', icon: Gift },
    { id: 'collections', label: 'Curated Collections', icon: Palette },
    { id: 'testimonials', label: 'Testimonials', icon: Star },
    { id: 'instagram', label: 'Instagram', icon: Instagram },
    { id: 'newsletter', label: 'Newsletter', icon: Mail },
  ];

  // Helper getters for current section
  const currentSection = sections.find(s => s.id === activeTab);
  const categoriesSection = sections.find(s => s.id === 'categories');
  const promoSection = sections.find(s => s.id === 'promo-banners');
  const newArrivalsSection = sections.find(s => s.id === 'new-arrivals');
  const bestSellersSection = sections.find(s => s.id === 'best-sellers');
  const heroSection = sections.find(s => s.id === 'hero');

  // Categories tiles array
  const categoryTiles = categoriesSection?.content?.tiles || [];
  // Promo banners array
  const promoBanners = promoSection?.content?.banners || [];
  // New Arrivals custom items / products
  const newArrivalsItems = newArrivalsSection?.content?.customItems || [];
  // Best Sellers custom items / products
  const bestSellersItems = bestSellersSection?.content?.customItems || [];
  // Hero slides array
  const heroSlides = heroSection?.content?.slides || [];

  // Reset all content back to defaults
  const promptReset = () => {
    setConfirmModal({
      title: 'Reset Homepage Content',
      message: 'Are you sure you want to reset all homepage categories, promo banners, new arrivals, best sellers, hero slides, and layout back to the initial default state?',
      confirmLabel: 'Reset Defaults',
      variant: 'danger',
      onConfirm: () => {
        resetContent();
        showToast('Homepage content reset to defaults successfully.');
      },
    });
  };

  // ════════════════════════════════════════════════════════════════
  // ─── CATEGORY TILES HANDLERS ───
  // ════════════════════════════════════════════════════════════════
  const handleOpenAddCategory = () => {
    setCategoryModal({
      mode: 'add',
      data: {
        id: `cat-${Date.now()}`,
        name: '',
        link: '/category/sarees',
        targetRoute: 'sarees',
        themeColor: 'Orange Gradient',
        bgGradient: 'from-amber-200/90 via-orange-100 to-amber-100/80',
        borderColor: 'border-orange-200/80',
        textColor: 'text-amber-950',
        image: sareeGolden,
        order: categoryTiles.length + 1,
        active: true,
      }
    });
  };

  const handleOpenEditCategory = (tile) => {
    setCategoryModal({
      mode: 'edit',
      data: { ...tile }
    });
  };

  const handleSaveCategory = (data) => {
    let updatedTiles;
    if (categoryModal.mode === 'add') {
      const newTile = {
        ...data,
        id: data.id || `cat-${Date.now()}`,
        order: categoryTiles.length + 1,
      };
      updatedTiles = [...categoryTiles, newTile];
      showToast(`Category tile "${data.name}" added successfully.`);
    } else {
      updatedTiles = categoryTiles.map(t => (t.id === data.id ? { ...t, ...data } : t));
      showToast(`Category tile "${data.name}" updated successfully.`);
    }
    updateSectionContent('categories', { tiles: updatedTiles });
    setCategoryModal(null);
  };

  const handleDeleteCategory = (tileId) => {
    const target = categoryTiles.find(t => t.id === tileId);
    setConfirmModal({
      title: 'Delete Category Tile',
      message: `Are you sure you want to remove the category tile "${target?.name || 'Selected Tile'}"?`,
      confirmLabel: 'Delete Tile',
      variant: 'danger',
      onConfirm: () => {
        const filtered = categoryTiles.filter(t => t.id !== tileId).map((t, i) => ({ ...t, order: i + 1 }));
        updateSectionContent('categories', { tiles: filtered });
        showToast('Category tile removed.');
      }
    });
  };

  const handleToggleCategoryActive = (tileId) => {
    const updated = categoryTiles.map(t => (t.id === tileId ? { ...t, active: !t.active } : t));
    updateSectionContent('categories', { tiles: updated });
    const target = updated.find(t => t.id === tileId);
    showToast(`"${target.name}" is now ${target.active ? 'visible on' : 'hidden from'} storefront.`);
  };

  const handleReorderCategoryTiles = (dragIndex, dropIndex) => {
    if (dragIndex === dropIndex) return;
    const newTiles = [...categoryTiles];
    const [moved] = newTiles.splice(dragIndex, 1);
    newTiles.splice(dropIndex, 0, moved);
    const reindexed = newTiles.map((t, idx) => ({ ...t, order: idx + 1 }));
    updateSectionContent('categories', { tiles: reindexed });
    showToast('Category display order updated.');
  };

  // ════════════════════════════════════════════════════════════════
  // ─── PROMO BANNERS HANDLERS ───
  // ════════════════════════════════════════════════════════════════
  const handleOpenAddBanner = () => {
    setBannerModal({
      mode: 'add',
      data: {
        id: `promo-${Date.now()}`,
        order: promoBanners.length + 1,
        title: '',
        subtitle: '',
        description: '',
        type: 'PROMOTION',
        ctaText: 'shop now',
        ctaLink: '/products',
        targetRoute: 'sarees',
        image: sareeGolden,
        active: true,
      }
    });
  };

  const handleOpenEditBanner = (banner) => {
    setBannerModal({
      mode: 'edit',
      data: { ...banner }
    });
  };

  const handleSaveBanner = (data) => {
    let updated;
    if (bannerModal.mode === 'add') {
      const newBanner = {
        ...data,
        id: data.id || `promo-${Date.now()}`,
        order: promoBanners.length + 1,
      };
      updated = [...promoBanners, newBanner];
      showToast(`Promo banner "${data.title}" created.`);
    } else {
      updated = promoBanners.map(b => (b.id === data.id ? { ...b, ...data } : b));
      showToast(`Promo banner "${data.title}" updated.`);
    }
    updateSectionContent('promo-banners', { banners: updated });
    setBannerModal(null);
  };

  const handleDeleteBanner = (bannerId) => {
    const target = promoBanners.find(b => b.id === bannerId);
    setConfirmModal({
      title: 'Delete Promo Banner',
      message: `Are you sure you want to delete the banner "${target?.title || 'Selected Banner'}"?`,
      confirmLabel: 'Delete Banner',
      variant: 'danger',
      onConfirm: () => {
        const filtered = promoBanners.filter(b => b.id !== bannerId).map((b, i) => ({ ...b, order: i + 1 }));
        updateSectionContent('promo-banners', { banners: filtered });
        showToast('Promo banner deleted.');
      }
    });
  };

  const handleToggleBannerActive = (bannerId) => {
    const updated = promoBanners.map(b => (b.id === bannerId ? { ...b, active: !b.active } : b));
    updateSectionContent('promo-banners', { banners: updated });
    const target = updated.find(b => b.id === bannerId);
    showToast(`Banner "${target.title}" is now ${target.active ? 'active on' : 'hidden from'} storefront.`);
  };

  const handleReorderPromoBanners = (dragIndex, dropIndex) => {
    if (dragIndex === dropIndex) return;
    const newBanners = [...promoBanners];
    const [moved] = newBanners.splice(dragIndex, 1);
    newBanners.splice(dropIndex, 0, moved);
    const reindexed = newBanners.map((b, idx) => ({ ...b, order: idx + 1 }));
    updateSectionContent('promo-banners', { banners: reindexed });
    showToast('Promo banner order updated.');
  };

  // ════════════════════════════════════════════════════════════════
  // ─── PRODUCT LIST SECTION HANDLERS (NEW ARRIVALS / BEST SELLERS) ───
  // ════════════════════════════════════════════════════════════════
  const handleOpenProductPicker = (targetSection) => {
    const currentList = targetSection === 'new-arrivals' ? newArrivalsItems : bestSellersItems;
    const currentIds = currentList.map(item => item.productId || item.id);
    setSelectedProductIdsInPicker(currentIds);
    setPickerSearch('');
    setPickerCategoryFilter('All');
    setProductPickerModal({ targetSection });
  };

  const handleToggleProductInPicker = (prodId) => {
    setSelectedProductIdsInPicker(prev =>
      prev.includes(prodId) ? prev.filter(id => id !== prodId) : [...prev, prodId]
    );
  };

  const handleSavePickedProducts = () => {
    if (!productPickerModal) return;
    const { targetSection } = productPickerModal;
    const currentList = targetSection === 'new-arrivals' ? newArrivalsItems : bestSellersItems;

    // Build the new customItems list
    const newItems = selectedProductIdsInPicker.map((prodId, idx) => {
      const existing = currentList.find(item => item.productId === prodId || item.id === prodId);
      const productObj = products.find(p => p.id === prodId || p.slug === prodId);

      if (existing) {
        return {
          ...existing,
          order: idx + 1,
        };
      }

      return {
        id: productObj?.slug || prodId.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        productId: prodId,
        name: productObj?.name || 'Store Product',
        category: productObj?.category || 'Category',
        price: productObj?.price || 4999,
        image: productObj?.colors?.[0]?.images?.[0]?.url || sareeGolden,
        order: idx + 1,
        active: true,
      };
    });

    updateSectionContent(targetSection, {
      customItems: newItems,
      selectedProductIds: selectedProductIdsInPicker,
      maxItems: newItems.length,
    });

    const label = targetSection === 'new-arrivals' ? 'New Arrivals' : 'Best Sellers';
    showToast(`${label} updated with ${newItems.length} products.`);
    setProductPickerModal(null);
  };

  const handleToggleSectionProductActive = (sectionId, itemId) => {
    const currentList = sectionId === 'new-arrivals' ? newArrivalsItems : bestSellersItems;
    const updated = currentList.map(item => (item.id === itemId ? { ...item, active: !item.active } : item));
    updateSectionContent(sectionId, { customItems: updated });
    const target = updated.find(item => item.id === itemId);
    showToast(`"${target.name}" is now ${target.active ? 'active' : 'hidden'}.`);
  };

  const handleDeleteSectionProduct = (sectionId, itemId) => {
    const currentList = sectionId === 'new-arrivals' ? newArrivalsItems : bestSellersItems;
    const target = currentList.find(item => item.id === itemId);

    setConfirmModal({
      title: 'Remove Product from Section',
      message: `Are you sure you want to remove "${target?.name || 'this product'}" from this showcase section? (It will remain in your store catalog).`,
      confirmLabel: 'Remove Product',
      variant: 'danger',
      onConfirm: () => {
        const filtered = currentList.filter(item => item.id !== itemId).map((item, i) => ({ ...item, order: i + 1 }));
        const newIds = filtered.map(item => item.productId || item.id);
        updateSectionContent(sectionId, {
          customItems: filtered,
          selectedProductIds: newIds,
          maxItems: filtered.length,
        });
        showToast('Product removed from section.');
      }
    });
  };

  const handleReorderSectionProducts = (sectionId, dragIndex, dropIndex) => {
    if (dragIndex === dropIndex) return;
    const currentList = sectionId === 'new-arrivals' ? [...newArrivalsItems] : [...bestSellersItems];
    const [moved] = currentList.splice(dragIndex, 1);
    currentList.splice(dropIndex, 0, moved);
    const reindexed = currentList.map((item, idx) => ({ ...item, order: idx + 1 }));
    const newIds = reindexed.map(item => item.productId || item.id);
    updateSectionContent(sectionId, {
      customItems: reindexed,
      selectedProductIds: newIds,
    });
    showToast('Display order updated.');
  };

  // ════════════════════════════════════════════════════════════════
  // ─── FILTERED DATA CALCULATIONS ───
  // ════════════════════════════════════════════════════════════════
  // Filtered categories
  const filteredCategories = useMemo(() => {
    return categoryTiles.filter(t => {
      const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) ||
        (t.link || '').toLowerCase().includes(search.toLowerCase()) ||
        (t.themeColor || '').toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'All' ? true : statusFilter === 'Active' ? t.active : !t.active;
      return matchSearch && matchStatus;
    });
  }, [categoryTiles, search, statusFilter]);

  // Filtered promo banners
  const filteredBanners = useMemo(() => {
    return promoBanners.filter(b => {
      const matchSearch = b.title.toLowerCase().includes(search.toLowerCase()) ||
        (b.subtitle || '').toLowerCase().includes(search.toLowerCase()) ||
        (b.description || '').toLowerCase().includes(search.toLowerCase()) ||
        (b.type || '').toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'All' ? true : statusFilter === 'Active' ? b.active : !b.active;
      return matchSearch && matchStatus;
    });
  }, [promoBanners, search, statusFilter]);

  // Filtered new arrivals
  const filteredNewArrivals = useMemo(() => {
    return newArrivalsItems.filter(item => {
      const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
        (item.id || '').toLowerCase().includes(search.toLowerCase()) ||
        (item.category || '').toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'All' ? true : statusFilter === 'Active' ? item.active : !item.active;
      return matchSearch && matchStatus;
    });
  }, [newArrivalsItems, search, statusFilter]);

  // Filtered best sellers
  const filteredBestSellers = useMemo(() => {
    return bestSellersItems.filter(item => {
      const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
        (item.id || '').toLowerCase().includes(search.toLowerCase()) ||
        (item.category || '').toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'All' ? true : statusFilter === 'Active' ? item.active : !item.active;
      return matchSearch && matchStatus;
    });
  }, [bestSellersItems, search, statusFilter]);

  // Available catalog products for picker modal
  const pickerFilteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchCat = pickerCategoryFilter === 'All' ? true : p.category === pickerCategoryFilter;
      const matchSearch = p.name.toLowerCase().includes(pickerSearch.toLowerCase()) ||
        (p.id || '').toLowerCase().includes(pickerSearch.toLowerCase()) ||
        (p.category || '').toLowerCase().includes(pickerSearch.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [products, pickerCategoryFilter, pickerSearch]);

  // Unique categories list with counts for picker
  const pickerCategories = useMemo(() => {
    const catMap = {};
    products.forEach(p => {
      const c = p.category || 'Other';
      catMap[c] = (catMap[c] || 0) + 1;
    });
    return Object.entries(catMap).map(([name, count]) => ({ name, count }));
  }, [products]);

  // Catalog total products count
  const totalStoreProducts = products.length > 0 ? products.length : 70;

  return (
    <div className="space-y-6 relative pb-16 font-sans">
      {/* Toast notification */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-slate-900 text-white px-5 py-3.5 rounded-xl shadow-2xl border border-slate-700 animate-[fadeInUp_0.25s_ease-out]">
          <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
            <Check size={14} />
          </div>
          <span className="text-xs font-semibold">{toast}</span>
        </div>
      )}

      {/* Page Header */}
      <AdminPageHeader
        title="Homepage Content"
        subtitle="Manage and customize your storefront homepage — control layout, promotional banners, hero slides, and featured sections from one place."
      >
        <div className="flex items-center gap-2.5">
          <button
            onClick={promptReset}
            className="flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 text-xs font-semibold text-slate-600 hover:text-red-600 hover:border-red-200 rounded-xl hover:bg-red-50/50 transition-colors shadow-2xs cursor-pointer bg-white"
          >
            <RotateCcw size={13} /> Reset Defaults
          </button>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition-all shadow-sm hover:shadow"
          >
            <ExternalLink size={13} /> View Live Store
          </a>
        </div>
      </AdminPageHeader>

      {/* Top Navigation Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none no-scrollbar">
        {topTabs.map((tab) => {
          const TabIcon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setSearch('');
                setStatusFilter('All');
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white text-slate-700 border border-slate-200/80 hover:bg-slate-50 hover:border-slate-300 shadow-2xs'
              }`}
            >
              <TabIcon size={14} className={isActive ? 'text-emerald-400' : 'text-slate-500'} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* ─── TAB 1: SHOP BY CATEGORY (IMAGE 5) ─── */}
      {/* ════════════════════════════════════════════════════════════════ */}
      {activeTab === 'categories' && (
        <div className="space-y-6">
          {/* Section Header */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">Shop By Category Management</h2>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                  {categoryTiles.length} Tiles
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 max-w-3xl">
                Configure the categories and collection cards displayed in the "Shop By Category" section of the homepage. Customise tile labels, routing, colors, background gradients, and imagery in real-time.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={promptReset}
                className="flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-xl transition-all cursor-pointer bg-white shadow-2xs"
              >
                <RotateCcw size={13} /> Reset Defaults
              </button>
              <button
                onClick={handleOpenAddCategory}
                className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all shadow-sm hover:shadow cursor-pointer"
              >
                <Plus size={14} /> Add Category Tile
              </button>
            </div>
          </div>

          {/* LIVE STOREFRONT PREVIEW CONTAINER (IMAGE 5) */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-indigo-900 text-xs font-bold uppercase tracking-wider">
                <Sparkles size={14} className="text-indigo-600" />
                <span>LIVE STOREFRONT PREVIEW</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Customer View Synchronized</span>
              </div>
            </div>

            {/* Live Storefront Component Preview Box */}
            <div className="p-6 sm:p-8 bg-white rounded-2xl border border-slate-200/80 shadow-inner overflow-hidden">
              {/* Landing Page Category Heading */}
              <div className="text-center mb-5 sm:mb-6">
                <p className="font-sans text-[9.5px] sm:text-[10.5px] tracking-[0.28em] text-brand-teal uppercase font-semibold mb-1 sm:mb-1.5">
                  {categoriesSection?.content?.eyebrow || 'COLLECTIONS'}
                </p>
                <h3 className="font-serif text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light text-brand-navy tracking-wider uppercase">
                  {categoriesSection?.content?.title || 'SHOP BY CATEGORY'}
                </h3>
                <div className="w-9 h-[2px] bg-brand-teal mx-auto mt-2" />
              </div>

              {/* Circular Categories Row (Exact Match to Landing Page) */}
              <div className="flex items-start justify-start sm:justify-center gap-3 min-[390px]:gap-4 sm:gap-6 md:gap-7 lg:gap-8 pb-3 px-2 overflow-x-auto no-scrollbar scroll-smooth">
                {categoryTiles.map((tile) => (
                  <button
                    key={tile.id}
                    type="button"
                    onClick={() => handleOpenEditCategory(tile)}
                    title={`Click to edit "${tile.name}"`}
                    className={`flex-shrink-0 w-[74px] min-[390px]:w-[80px] sm:w-[95px] md:w-[105px] lg:w-[115px] flex flex-col items-center group cursor-pointer transition-all ${
                      tile.active ? 'opacity-100' : 'opacity-45 hover:opacity-80'
                    }`}
                  >
                    {/* Circle Container */}
                    <div className="relative w-[70px] h-[70px] min-[390px]:w-[76px] min-[390px]:h-[76px] sm:w-[92px] sm:h-[92px] md:w-[102px] md:h-[102px] lg:w-[112px] lg:h-[112px] rounded-full overflow-hidden border-2 border-brand-powder bg-brand-cream/30 shadow-xs group-hover:border-brand-teal group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
                      <img
                        src={tile.image}
                        alt={tile.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>

                    {/* Category Name */}
                    <span className="mt-2.5 font-sans text-[9px] min-[390px]:text-[10px] sm:text-xs uppercase tracking-[0.12em] sm:tracking-[0.14em] font-medium text-brand-navy group-hover:text-brand-teal text-center leading-tight transition-colors line-clamp-2 px-0.5">
                      {tile.name}
                    </span>

                    {/* Hidden Badge if Inactive */}
                    {!tile.active && (
                      <span className="mt-1 text-[8.5px] sm:text-[9px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-100">
                        Hidden
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 4 KPI STAT CARDS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs flex flex-col justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">TOTAL CATEGORIES</span>
              <div className="mt-3">
                <span className="text-3xl font-black text-slate-900 tracking-tight">{categoryTiles.length}</span>
                <p className="text-[11px] text-slate-400 mt-1">Configured for storefront</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs flex flex-col justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">ACTIVE & VISIBLE</span>
              <div className="mt-3">
                <span className="text-3xl font-black text-emerald-600 tracking-tight">
                  {categoryTiles.filter(t => t.active).length}
                </span>
                <p className="text-[11px] text-slate-400 mt-1">Shown to customers</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs flex flex-col justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">HIDDEN / INACTIVE</span>
              <div className="mt-3">
                <span className="text-3xl font-black text-rose-600 tracking-tight">
                  {categoryTiles.filter(t => !t.active).length}
                </span>
                <p className="text-[11px] text-slate-400 mt-1">Not shown on homepage</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs flex flex-col justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">DISPLAY ORDER</span>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-2xl font-bold text-indigo-900 flex items-center gap-1.5">
                  <span className="font-mono">≡</span> Drag
                </span>
                <span className="text-[10px] bg-indigo-50 text-indigo-700 font-semibold px-2 py-0.5 rounded-md border border-indigo-100">
                  Live
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Grab handle to reorder</p>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-4 flex flex-wrap gap-3 items-center justify-between">
            <div className="flex items-center gap-2.5 bg-slate-50/80 border border-slate-200/80 rounded-xl px-3.5 py-2 flex-1 min-w-[220px] max-w-md focus-within:bg-white focus-within:border-emerald-600 transition-all">
              <Search size={14} className="text-slate-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search categories..."
                className="bg-transparent text-xs text-slate-800 placeholder-slate-400 outline-none w-full"
              />
              {search && (
                <button onClick={() => setSearch('')} className="text-slate-400 hover:text-slate-600">
                  <X size={13} />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-600">
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-700 bg-white focus:outline-none focus:border-emerald-600 shadow-2xs font-medium"
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* CATEGORY TILES TABLE */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/60 text-[11px] font-bold text-indigo-900 uppercase tracking-wider">
                    <th className="py-3.5 px-4 w-16 text-center">#</th>
                    <th className="py-3.5 px-4">PREVIEW</th>
                    <th className="py-3.5 px-4">CATEGORY NAME</th>
                    <th className="py-3.5 px-4">DESTINATION ROUTE</th>
                    <th className="py-3.5 px-4">THEME / COLOR</th>
                    <th className="py-3.5 px-4">STATUS</th>
                    <th className="py-3.5 px-4 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredCategories.map((tile, idx) => {
                    const actualIdx = categoryTiles.findIndex(t => t.id === tile.id);
                    const isDragging = draggedIdx === actualIdx;
                    const isDragOver = dragOverIdx === actualIdx;

                    return (
                      <tr
                        key={tile.id}
                        draggable
                        onDragStart={(e) => {
                          setDraggedIdx(actualIdx);
                          e.dataTransfer.setData('text/plain', actualIdx);
                        }}
                        onDragOver={(e) => {
                          e.preventDefault();
                          if (dragOverIdx !== actualIdx) setDragOverIdx(actualIdx);
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          if (draggedIdx !== null) handleReorderCategoryTiles(draggedIdx, actualIdx);
                          setDraggedIdx(null);
                          setDragOverIdx(null);
                        }}
                        onDragEnd={() => {
                          setDraggedIdx(null);
                          setDragOverIdx(null);
                        }}
                        className={`hover:bg-slate-50/70 transition-colors ${
                          isDragging ? 'opacity-30 bg-indigo-50' : isDragOver ? 'bg-indigo-50/80' : ''
                        }`}
                      >
                        {/* Drag Handle & Order */}
                        <td className="py-3.5 px-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <div className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-700 p-1">
                              <GripVertical size={14} />
                            </div>
                            <span className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-700 font-bold text-[11px] flex items-center justify-center">
                              #{actualIdx + 1}
                            </span>
                          </div>
                        </td>

                        {/* Preview Thumbnail */}
                        <td className="py-3.5 px-4">
                          <div className="w-11 h-11 rounded-full border-2 border-brand-powder/80 bg-brand-cream/30 overflow-hidden shadow-2xs flex items-center justify-center p-0.5">
                            <img src={tile.image} alt={tile.name} className="w-full h-full object-cover rounded-full" />
                          </div>
                        </td>

                        {/* Category Name */}
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-slate-900 text-xs sm:text-sm">
                            {tile.name}
                          </span>
                        </td>

                        {/* Destination Route */}
                        <td className="py-3.5 px-4 text-slate-600 font-mono text-xs">
                          {tile.link || `/category/${tile.targetRoute || tile.name.toLowerCase()}`}
                        </td>

                        {/* Theme / Color Badge */}
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold border border-slate-200">
                            <span
                              className="w-2.5 h-2.5 rounded-full"
                              style={{
                                backgroundColor:
                                  CATEGORY_THEMES.find(ct => ct.name === tile.themeColor)?.dotColor || '#F97316'
                              }}
                            />
                            <span>{tile.themeColor || 'Orange Gradient'}</span>
                          </span>
                        </td>

                        {/* Status Toggle Pill */}
                        <td className="py-3.5 px-4">
                          <button
                            onClick={() => handleToggleCategoryActive(tile.id)}
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                              tile.active
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                            }`}
                          >
                            <CheckCircle2 size={12} className={tile.active ? 'text-emerald-600' : 'text-slate-400'} />
                            <span>{tile.active ? 'Active' : 'Inactive'}</span>
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenEditCategory(tile)}
                              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50/50 transition-colors cursor-pointer"
                              title="Edit Tile"
                            >
                              <Edit size={13} />
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(tile.id)}
                              className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                              title="Delete Tile"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredCategories.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-10 text-center text-slate-400">
                        No categories match your search or filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* ─── TAB 2: PROMO BANNERS (IMAGE 1) ─── */}
      {/* ════════════════════════════════════════════════════════════════ */}
      {activeTab === 'promo-banners' && (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Promo Banners</h2>
              <p className="text-xs text-slate-500 mt-1">
                Manage promotional banners and special offer campaigns displayed on the homepage.
              </p>
            </div>

            <button
              onClick={handleOpenAddBanner}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm hover:shadow cursor-pointer"
            >
              <Plus size={14} /> Add Promo Banner
            </button>
          </div>

          {/* 4 KPI Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs flex flex-col justify-between">
              <span className="text-xs font-semibold text-slate-500">Total</span>
              <div className="mt-3">
                <span className="text-3xl font-black text-slate-900 tracking-tight">{promoBanners.length}</span>
                <p className="text-[11px] text-slate-400 mt-1">Configured in system</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs flex flex-col justify-between">
              <span className="text-xs font-semibold text-slate-500">Active</span>
              <div className="mt-3">
                <span className="text-3xl font-black text-emerald-600 tracking-tight">
                  {promoBanners.filter(b => b.active).length}
                </span>
                <p className="text-[11px] text-slate-400 mt-1">Live on storefront</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs flex flex-col justify-between">
              <span className="text-xs font-semibold text-slate-500">Inactive</span>
              <div className="mt-3">
                <span className="text-3xl font-black text-rose-600 tracking-tight">
                  {promoBanners.filter(b => !b.active).length}
                </span>
                <p className="text-[11px] text-slate-400 mt-1">Hidden from customers</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Types</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
                  Manage Types
                </span>
              </div>
              <div className="mt-3">
                <span className="text-3xl font-black text-indigo-950 tracking-tight">4</span>
                <p className="text-[11px] text-slate-400 mt-1">Offer, New Arrival, Promotion, Collection</p>
              </div>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-4 flex flex-wrap gap-3 items-center justify-between">
            <div className="flex items-center gap-2.5 bg-slate-50/80 border border-slate-200/80 rounded-xl px-3.5 py-2 flex-1 min-w-[220px] max-w-md focus-within:bg-white focus-within:border-emerald-600 transition-all">
              <Search size={14} className="text-slate-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search promo banners..."
                className="bg-transparent text-xs text-slate-800 placeholder-slate-400 outline-none w-full"
              />
              {search && (
                <button onClick={() => setSearch('')} className="text-slate-400 hover:text-slate-600">
                  <X size={13} />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-600">
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-700 bg-white focus:outline-none focus:border-emerald-600 shadow-2xs font-medium"
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* PROMO BANNERS TABLE */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/60 text-[11px] font-bold text-indigo-900 uppercase tracking-wider">
                    <th className="py-3.5 px-4 w-12 text-center">::</th>
                    <th className="py-3.5 px-4 text-center">ORDER</th>
                    <th className="py-3.5 px-4">PREVIEW</th>
                    <th className="py-3.5 px-4">DETAILS</th>
                    <th className="py-3.5 px-4">TYPE</th>
                    <th className="py-3.5 px-4">CTA</th>
                    <th className="py-3.5 px-4">STATUS</th>
                    <th className="py-3.5 px-4 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredBanners.map((banner, idx) => {
                    const actualIdx = promoBanners.findIndex(b => b.id === banner.id);
                    const isDragging = draggedIdx === actualIdx;
                    const isDragOver = dragOverIdx === actualIdx;

                    return (
                      <tr
                        key={banner.id}
                        draggable
                        onDragStart={(e) => {
                          setDraggedIdx(actualIdx);
                          e.dataTransfer.setData('text/plain', actualIdx);
                        }}
                        onDragOver={(e) => {
                          e.preventDefault();
                          if (dragOverIdx !== actualIdx) setDragOverIdx(actualIdx);
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          if (draggedIdx !== null) handleReorderPromoBanners(draggedIdx, actualIdx);
                          setDraggedIdx(null);
                          setDragOverIdx(null);
                        }}
                        onDragEnd={() => {
                          setDraggedIdx(null);
                          setDragOverIdx(null);
                        }}
                        className={`hover:bg-slate-50/70 transition-colors ${
                          isDragging ? 'opacity-30 bg-indigo-50' : isDragOver ? 'bg-indigo-50/80' : ''
                        }`}
                      >
                        {/* Drag Handle */}
                        <td className="py-3.5 px-4 text-center">
                          <div className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-700 p-1 flex justify-center">
                            <GripVertical size={15} />
                          </div>
                        </td>

                        {/* Order Badge */}
                        <td className="py-3.5 px-4 text-center">
                          <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-bold text-[11px]">
                            #{actualIdx + 1}
                          </span>
                        </td>

                        {/* Preview Image */}
                        <td className="py-3.5 px-4">
                          <div className="w-16 h-11 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                            <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
                          </div>
                        </td>

                        {/* Details */}
                        <td className="py-3.5 px-4 max-w-xs">
                          <h4 className="font-bold text-indigo-950 text-xs sm:text-sm">{banner.title}</h4>
                          {banner.subtitle && (
                            <p className="text-slate-600 text-xs mt-0.5">{banner.subtitle}</p>
                          )}
                          {banner.description && (
                            <p className="text-slate-400 text-[11px] line-clamp-1 mt-0.5">{banner.description}</p>
                          )}
                        </td>

                        {/* Type Pill */}
                        <td className="py-3.5 px-4">
                          <span className="inline-block font-bold text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 border border-amber-200/80">
                            {banner.type || 'PROMOTION'}
                          </span>
                        </td>

                        {/* CTA */}
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900 text-xs">{banner.ctaText || 'shop now'}</div>
                          <div className="text-slate-500 text-[11px] mt-0.5">
                            → {banner.targetRoute || banner.ctaLink || 'mattress'}
                          </div>
                        </td>

                        {/* Status Badge */}
                        <td className="py-3.5 px-4">
                          <button
                            onClick={() => handleToggleBannerActive(banner.id)}
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                              banner.active
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                            }`}
                          >
                            <CheckCircle2 size={12} className={banner.active ? 'text-emerald-600' : 'text-slate-400'} />
                            <span>{banner.active ? 'Active' : 'Inactive'}</span>
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenEditBanner(banner)}
                              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50/50 transition-colors cursor-pointer"
                              title="Edit Banner"
                            >
                              <Edit size={13} />
                            </button>
                            <button
                              onClick={() => handleDeleteBanner(banner.id)}
                              className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                              title="Delete Banner"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredBanners.length === 0 && (
                    <tr>
                      <td colSpan={8} className="py-10 text-center text-slate-400">
                        No promo banners match your search or filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* ─── TAB 3: NEW ARRIVALS (IMAGE 2) ─── */}
      {/* ════════════════════════════════════════════════════════════════ */}
      {activeTab === 'new-arrivals' && (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">New Arrivals</h2>
              <p className="text-xs text-slate-500 mt-1">
                Select store products to showcase in the homepage New Arrivals section, set display order, and toggle storefront visibility.
              </p>
            </div>

            <button
              onClick={() => handleOpenProductPicker('new-arrivals')}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm hover:shadow cursor-pointer"
            >
              <Plus size={14} /> Add New Arrival
            </button>
          </div>

          {/* 4 KPI Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs flex flex-col justify-between">
              <span className="text-xs font-semibold text-slate-500">Total New Arrivals</span>
              <div className="mt-3">
                <span className="text-3xl font-black text-slate-900 tracking-tight">{newArrivalsItems.length}</span>
                <p className="text-[11px] text-slate-400 mt-1">Configured for section</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs flex flex-col justify-between">
              <span className="text-xs font-semibold text-slate-500">Active Products</span>
              <div className="mt-3">
                <span className="text-3xl font-black text-emerald-600 tracking-tight">
                  {newArrivalsItems.filter(p => p.active).length}
                </span>
                <p className="text-[11px] text-slate-400 mt-1">Live on storefront</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs flex flex-col justify-between">
              <span className="text-xs font-semibold text-slate-500">Inactive Products</span>
              <div className="mt-3">
                <span className="text-3xl font-black text-rose-600 tracking-tight">
                  {newArrivalsItems.filter(p => !p.active).length}
                </span>
                <p className="text-[11px] text-slate-400 mt-1">Hidden from customers</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs flex flex-col justify-between">
              <span className="text-xs font-semibold text-slate-500">Store Catalog</span>
              <div className="mt-3">
                <span className="text-3xl font-black text-indigo-950 tracking-tight">{totalStoreProducts}</span>
                <p className="text-[11px] text-slate-400 mt-1">Total store products</p>
              </div>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-4 flex flex-wrap gap-3 items-center justify-between">
            <div className="flex items-center gap-2.5 bg-slate-50/80 border border-slate-200/80 rounded-xl px-3.5 py-2 flex-1 min-w-[220px] max-w-md focus-within:bg-white focus-within:border-emerald-600 transition-all">
              <Search size={14} className="text-slate-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search new arrivals..."
                className="bg-transparent text-xs text-slate-800 placeholder-slate-400 outline-none w-full"
              />
              {search && (
                <button onClick={() => setSearch('')} className="text-slate-400 hover:text-slate-600">
                  <X size={13} />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-600">
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-700 bg-white focus:outline-none focus:border-emerald-600 shadow-2xs font-medium"
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* NEW ARRIVALS TABLE */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/60 text-[11px] font-bold text-indigo-900 uppercase tracking-wider">
                    <th className="py-3.5 px-4 w-12 text-center">::</th>
                    <th className="py-3.5 px-4 text-center">ORDER</th>
                    <th className="py-3.5 px-4">PREVIEW</th>
                    <th className="py-3.5 px-4">PRODUCT DETAILS</th>
                    <th className="py-3.5 px-4">CATEGORY</th>
                    <th className="py-3.5 px-4">PRICE</th>
                    <th className="py-3.5 px-4">STATUS</th>
                    <th className="py-3.5 px-4 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredNewArrivals.map((item, idx) => {
                    const actualIdx = newArrivalsItems.findIndex(p => p.id === item.id);
                    const isDragging = draggedIdx === actualIdx;
                    const isDragOver = dragOverIdx === actualIdx;

                    return (
                      <tr
                        key={item.id}
                        draggable
                        onDragStart={(e) => {
                          setDraggedIdx(actualIdx);
                          e.dataTransfer.setData('text/plain', actualIdx);
                        }}
                        onDragOver={(e) => {
                          e.preventDefault();
                          if (dragOverIdx !== actualIdx) setDragOverIdx(actualIdx);
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          if (draggedIdx !== null) handleReorderSectionProducts('new-arrivals', draggedIdx, actualIdx);
                          setDraggedIdx(null);
                          setDragOverIdx(null);
                        }}
                        onDragEnd={() => {
                          setDraggedIdx(null);
                          setDragOverIdx(null);
                        }}
                        className={`hover:bg-slate-50/70 transition-colors ${
                          isDragging ? 'opacity-30 bg-indigo-50' : isDragOver ? 'bg-indigo-50/80' : ''
                        }`}
                      >
                        {/* Drag Handle */}
                        <td className="py-3.5 px-4 text-center">
                          <div className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-700 p-1 flex justify-center">
                            <GripVertical size={15} />
                          </div>
                        </td>

                        {/* Order Badge */}
                        <td className="py-3.5 px-4 text-center">
                          <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-bold text-[11px]">
                            #{actualIdx + 1}
                          </span>
                        </td>

                        {/* Product Image */}
                        <td className="py-3.5 px-4">
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                            <img src={item.image || sareeGolden} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                        </td>

                        {/* Product Details */}
                        <td className="py-3.5 px-4">
                          <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{item.name}</h4>
                          <p className="text-slate-400 text-[11px] mt-0.5">Product ID: {item.id}</p>
                        </td>

                        {/* Category */}
                        <td className="py-3.5 px-4 text-slate-700 font-medium">
                          {item.category}
                        </td>

                        {/* Price */}
                        <td className="py-3.5 px-4 font-bold text-emerald-700">
                          ₹{Number(item.price || 0).toLocaleString('en-IN')}
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4">
                          <button
                            onClick={() => handleToggleSectionProductActive('new-arrivals', item.id)}
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                              item.active
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                            }`}
                          >
                            <CheckCircle2 size={12} className={item.active ? 'text-emerald-600' : 'text-slate-400'} />
                            <span>{item.active ? 'Active' : 'Inactive'}</span>
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenProductPicker('new-arrivals')}
                              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50/50 transition-colors cursor-pointer"
                              title="Edit Section Selection"
                            >
                              <Edit size={13} />
                            </button>
                            <button
                              onClick={() => handleDeleteSectionProduct('new-arrivals', item.id)}
                              className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                              title="Remove Product"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredNewArrivals.length === 0 && (
                    <tr>
                      <td colSpan={8} className="py-10 text-center text-slate-400">
                        No products configured for New Arrivals. Click "+ Add New Arrival" to select products.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* ─── TAB 4: BEST SELLERS (IMAGE 3) ─── */}
      {/* ════════════════════════════════════════════════════════════════ */}
      {activeTab === 'best-sellers' && (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Best Sellers</h2>
              <p className="text-xs text-slate-500 mt-1">
                Select store products to showcase in the homepage Best Sellers section, set display order, and toggle storefront visibility.
              </p>
            </div>

            <button
              onClick={() => handleOpenProductPicker('best-sellers')}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm hover:shadow cursor-pointer"
            >
              <Plus size={14} /> Add Best Seller
            </button>
          </div>

          {/* 4 KPI Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs flex flex-col justify-between">
              <span className="text-xs font-semibold text-slate-500">Total Best Sellers</span>
              <div className="mt-3">
                <span className="text-3xl font-black text-slate-900 tracking-tight">{bestSellersItems.length}</span>
                <p className="text-[11px] text-slate-400 mt-1">Configured for section</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs flex flex-col justify-between">
              <span className="text-xs font-semibold text-slate-500">Active Products</span>
              <div className="mt-3">
                <span className="text-3xl font-black text-emerald-600 tracking-tight">
                  {bestSellersItems.filter(p => p.active).length}
                </span>
                <p className="text-[11px] text-slate-400 mt-1">Live on storefront</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs flex flex-col justify-between">
              <span className="text-xs font-semibold text-slate-500">Inactive Products</span>
              <div className="mt-3">
                <span className="text-3xl font-black text-rose-600 tracking-tight">
                  {bestSellersItems.filter(p => !p.active).length}
                </span>
                <p className="text-[11px] text-slate-400 mt-1">Hidden from customers</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs flex flex-col justify-between">
              <span className="text-xs font-semibold text-slate-500">Store Catalog</span>
              <div className="mt-3">
                <span className="text-3xl font-black text-indigo-950 tracking-tight">{totalStoreProducts}</span>
                <p className="text-[11px] text-slate-400 mt-1">Total store products</p>
              </div>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-4 flex flex-wrap gap-3 items-center justify-between">
            <div className="flex items-center gap-2.5 bg-slate-50/80 border border-slate-200/80 rounded-xl px-3.5 py-2 flex-1 min-w-[220px] max-w-md focus-within:bg-white focus-within:border-emerald-600 transition-all">
              <Search size={14} className="text-slate-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search best sellers..."
                className="bg-transparent text-xs text-slate-800 placeholder-slate-400 outline-none w-full"
              />
              {search && (
                <button onClick={() => setSearch('')} className="text-slate-400 hover:text-slate-600">
                  <X size={13} />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-600">
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-700 bg-white focus:outline-none focus:border-emerald-600 shadow-2xs font-medium"
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* BEST SELLERS TABLE */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/60 text-[11px] font-bold text-indigo-900 uppercase tracking-wider">
                    <th className="py-3.5 px-4 w-12 text-center">::</th>
                    <th className="py-3.5 px-4 text-center">ORDER</th>
                    <th className="py-3.5 px-4">PREVIEW</th>
                    <th className="py-3.5 px-4">PRODUCT DETAILS</th>
                    <th className="py-3.5 px-4">CATEGORY</th>
                    <th className="py-3.5 px-4">PRICE</th>
                    <th className="py-3.5 px-4">STATUS</th>
                    <th className="py-3.5 px-4 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredBestSellers.map((item, idx) => {
                    const actualIdx = bestSellersItems.findIndex(p => p.id === item.id);
                    const isDragging = draggedIdx === actualIdx;
                    const isDragOver = dragOverIdx === actualIdx;

                    return (
                      <tr
                        key={item.id}
                        draggable
                        onDragStart={(e) => {
                          setDraggedIdx(actualIdx);
                          e.dataTransfer.setData('text/plain', actualIdx);
                        }}
                        onDragOver={(e) => {
                          e.preventDefault();
                          if (dragOverIdx !== actualIdx) setDragOverIdx(actualIdx);
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          if (draggedIdx !== null) handleReorderSectionProducts('best-sellers', draggedIdx, actualIdx);
                          setDraggedIdx(null);
                          setDragOverIdx(null);
                        }}
                        onDragEnd={() => {
                          setDraggedIdx(null);
                          setDragOverIdx(null);
                        }}
                        className={`hover:bg-slate-50/70 transition-colors ${
                          isDragging ? 'opacity-30 bg-indigo-50' : isDragOver ? 'bg-indigo-50/80' : ''
                        }`}
                      >
                        {/* Drag Handle */}
                        <td className="py-3.5 px-4 text-center">
                          <div className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-700 p-1 flex justify-center">
                            <GripVertical size={15} />
                          </div>
                        </td>

                        {/* Order Badge */}
                        <td className="py-3.5 px-4 text-center">
                          <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-bold text-[11px]">
                            #{actualIdx + 1}
                          </span>
                        </td>

                        {/* Product Image */}
                        <td className="py-3.5 px-4">
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                            <img src={item.image || sareeGolden} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                        </td>

                        {/* Product Details */}
                        <td className="py-3.5 px-4">
                          <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{item.name}</h4>
                          <p className="text-slate-400 text-[11px] mt-0.5">Product ID: {item.id}</p>
                        </td>

                        {/* Category */}
                        <td className="py-3.5 px-4 text-slate-700 font-medium">
                          {item.category}
                        </td>

                        {/* Price */}
                        <td className="py-3.5 px-4 font-bold text-emerald-700">
                          ₹{Number(item.price || 0).toLocaleString('en-IN')}
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4">
                          <button
                            onClick={() => handleToggleSectionProductActive('best-sellers', item.id)}
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                              item.active
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                            }`}
                          >
                            <CheckCircle2 size={12} className={item.active ? 'text-emerald-600' : 'text-slate-400'} />
                            <span>{item.active ? 'Active' : 'Inactive'}</span>
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenProductPicker('best-sellers')}
                              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50/50 transition-colors cursor-pointer"
                              title="Edit Section Selection"
                            >
                              <Edit size={13} />
                            </button>
                            <button
                              onClick={() => handleDeleteSectionProduct('best-sellers', item.id)}
                              className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                              title="Remove Product"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredBestSellers.length === 0 && (
                    <tr>
                      <td colSpan={8} className="py-10 text-center text-slate-400">
                        No products configured for Best Sellers. Click "+ Add Best Seller" to select products.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* ─── TAB 5: HERO SLIDES ─── */}
      {/* ════════════════════════════════════════════════════════════════ */}
      {activeTab === 'hero' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Hero Showcase Slides</h2>
              <p className="text-xs text-slate-500 mt-1">
                Customize the high-impact rotating hero slideshow banners displayed at the top of your homepage.
              </p>
            </div>

            <button
              onClick={() => {
                const newSlide = {
                  id: Date.now(),
                  eyebrow: 'NEW COLLECTION',
                  headingLine1: 'Signature',
                  headingLine2: 'Celebration.',
                  subtitle: 'Handpicked couture crafted with pure heritage silks and intricate embroidery.',
                  ctaText: 'SHOP COLLECTION',
                  ctaLink: '/products',
                  secondaryCtaText: 'EXPLORE ALL',
                  secondaryCtaLink: '/products',
                  mainImage: sareeGolden,
                  detailImageLeft: lehengaPink,
                  detailImageRight: kurtiPurplePrinted,
                  accentBg: '#EBF5F5',
                  active: true,
                };
                const updated = [...heroSlides, newSlide];
                updateSectionContent('hero', { slides: updated });
                showToast('New hero slide added.');
              }}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm hover:shadow cursor-pointer"
            >
              <Plus size={14} /> Add Hero Slide
            </button>
          </div>

          {/* Hero KPI Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs flex flex-col justify-between">
              <span className="text-xs font-semibold text-slate-500">Total Slides</span>
              <div className="mt-3">
                <span className="text-3xl font-black text-slate-900 tracking-tight">{heroSlides.length}</span>
                <p className="text-[11px] text-slate-400 mt-1">Slides in rotation</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs flex flex-col justify-between">
              <span className="text-xs font-semibold text-slate-500">Active Slides</span>
              <div className="mt-3">
                <span className="text-3xl font-black text-emerald-600 tracking-tight">{heroSlides.filter(s => s.active).length}</span>
                <p className="text-[11px] text-slate-400 mt-1">Live on storefront</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs flex flex-col justify-between">
              <span className="text-xs font-semibold text-slate-500">Autoplay Interval</span>
              <div className="mt-3">
                <span className="text-3xl font-black text-indigo-950 tracking-tight">7s</span>
                <p className="text-[11px] text-slate-400 mt-1">Rotation delay</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs flex flex-col justify-between">
              <span className="text-xs font-semibold text-slate-500">Display Order</span>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-2xl font-bold text-indigo-900">≡ Drag</span>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded-md">Live</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Reorder slides</p>
            </div>
          </div>

          {/* Hero Slides Table */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/60 text-[11px] font-bold text-indigo-900 uppercase tracking-wider">
                    <th className="py-3.5 px-4 w-12 text-center">::</th>
                    <th className="py-3.5 px-4 text-center">ORDER</th>
                    <th className="py-3.5 px-4">PREVIEW</th>
                    <th className="py-3.5 px-4">HEADLINES & SUBTITLE</th>
                    <th className="py-3.5 px-4">CTA BUTTONS</th>
                    <th className="py-3.5 px-4">STATUS</th>
                    <th className="py-3.5 px-4 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {heroSlides.map((slide, idx) => (
                    <tr key={slide.id || idx} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 text-center">
                        <div className="cursor-grab text-slate-400 hover:text-slate-700 p-1 flex justify-center">
                          <GripVertical size={15} />
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-bold text-[11px]">
                          #{idx + 1}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="w-16 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                          <img src={slide.mainImage} alt="Slide Preview" className="w-full h-full object-cover" />
                        </div>
                      </td>
                      <td className="py-3.5 px-4 max-w-sm">
                        <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
                          {slide.eyebrow}
                        </span>
                        <h4 className="font-bold text-slate-900 text-sm">
                          {slide.headingLine1} {slide.headingLine2}
                        </h4>
                        <p className="text-slate-500 text-xs line-clamp-1 mt-0.5">{slide.subtitle}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800 text-xs">{slide.ctaText}</div>
                        <div className="text-slate-400 text-[11px]">{slide.ctaLink}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => {
                            const updated = heroSlides.map((s, i) => (i === idx ? { ...s, active: !s.active } : s));
                            updateSectionContent('hero', { slides: updated });
                            showToast(`Slide ${idx + 1} status updated.`);
                          }}
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                            slide.active
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                              : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                          }`}
                        >
                          <CheckCircle2 size={12} className={slide.active ? 'text-emerald-600' : 'text-slate-400'} />
                          <span>{slide.active ? 'Active' : 'Inactive'}</span>
                        </button>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setHeroSlideModal({ slide, idx });
                            }}
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50/50 transition-colors cursor-pointer"
                            title="Edit Slide"
                          >
                            <Edit size={13} />
                          </button>
                          <button
                            onClick={() => {
                              if (heroSlides.length <= 1) {
                                showToast('Hero slider must have at least one slide.');
                                return;
                              }
                              const updated = heroSlides.filter((_, i) => i !== idx);
                              updateSectionContent('hero', { slides: updated });
                              showToast('Hero slide removed.');
                            }}
                            className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                            title="Delete Slide"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* ─── TAB 6: HOMEPAGE LAYOUT (REORDERABLE SECTIONS) ─── */}
      {/* ════════════════════════════════════════════════════════════════ */}
      {activeTab === 'layout' && (
        <div className="space-y-6">
          {/* Summary Stat Cards Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs flex flex-col justify-between">
              <span className="text-xs font-semibold text-slate-500">Total Sections</span>
              <div className="mt-3">
                <span className="text-3xl font-black text-slate-900 tracking-tight">{sections.length}</span>
                <p className="text-[11px] text-slate-400 mt-1">Homepage sections configured</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs flex flex-col justify-between">
              <span className="text-xs font-semibold text-slate-500">Visible Sections</span>
              <div className="mt-3">
                <span className="text-3xl font-black text-emerald-600 tracking-tight">
                  {sections.filter(s => s.active).length}
                </span>
                <p className="text-[11px] text-slate-400 mt-1">Shown to customers</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs flex flex-col justify-between">
              <span className="text-xs font-semibold text-slate-500">Hidden Sections</span>
              <div className="mt-3">
                <span className="text-3xl font-black text-rose-600 tracking-tight">
                  {sections.filter(s => !s.active).length}
                </span>
                <p className="text-[11px] text-slate-400 mt-1">Not displayed on homepage</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs flex flex-col justify-between">
              <span className="text-xs font-semibold text-slate-500">Drag to Reorder</span>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-2xl font-bold text-indigo-900 font-mono">☰</span>
                <span className="text-[10px] bg-indigo-50 text-indigo-700 font-semibold px-2 py-0.5 rounded-md">Live Sync</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Grab handle to change order</p>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-4 flex flex-wrap gap-3 items-center justify-between">
            <div className="flex items-center gap-2.5 bg-slate-50/80 border border-slate-200/80 rounded-xl px-3.5 py-2 flex-1 min-w-[220px] max-w-md focus-within:bg-white focus-within:border-emerald-600 transition-all">
              <Search size={14} className="text-slate-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search homepage sections..."
                className="bg-transparent text-xs text-slate-800 placeholder-slate-400 outline-none w-full"
              />
              {search && (
                <button onClick={() => setSearch('')} className="text-slate-400 hover:text-slate-600">
                  <X size={13} />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-600">
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-700 bg-white focus:outline-none focus:border-emerald-600 shadow-2xs font-medium"
              >
                <option value="All">All Sections ({sections.length})</option>
                <option value="Active">Visible ({sections.filter(s => s.active).length})</option>
                <option value="Hidden">Hidden ({sections.filter(s => !s.active).length})</option>
              </select>
            </div>
          </div>

          {/* Reorderable Section Card List */}
          <div className="space-y-3">
            {sections
              .filter(sec => {
                const matchSearch = sec.label.toLowerCase().includes(search.toLowerCase()) ||
                  (sec.desc || '').toLowerCase().includes(search.toLowerCase()) ||
                  sec.id.toLowerCase().includes(search.toLowerCase());
                const matchStatus = statusFilter === 'All' ? true : statusFilter === 'Active' ? sec.active : !sec.active;
                return matchSearch && matchStatus;
              })
              .map((section) => {
                const actualIdx = sections.findIndex(s => s.id === section.id);
                const IconComponent = ICON_MAP[section.id] || LayoutTemplate;
                const badgeText = SECTION_BADGES[section.id];
                const isDragging = draggedIdx === actualIdx;
                const isDragOver = dragOverIdx === actualIdx;

                return (
                  <div
                    key={section.id}
                    draggable
                    onDragStart={(e) => {
                      setDraggedIdx(actualIdx);
                      e.dataTransfer.setData('text/plain', actualIdx);
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      if (dragOverIdx !== actualIdx) setDragOverIdx(actualIdx);
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      if (draggedIdx !== null && draggedIdx !== actualIdx) {
                        const newSections = [...sections];
                        const [moved] = newSections.splice(draggedIdx, 1);
                        newSections.splice(actualIdx, 0, moved);
                        reorderSections(newSections);
                        showToast('Section order updated.');
                      }
                      setDraggedIdx(null);
                      setDragOverIdx(null);
                    }}
                    onDragEnd={() => {
                      setDraggedIdx(null);
                      setDragOverIdx(null);
                    }}
                    className={`bg-white rounded-2xl border transition-all duration-150 shadow-xs hover:shadow-md flex items-center justify-between p-3.5 sm:p-4 gap-3 ${
                      isDragging
                        ? 'opacity-40 border-dashed border-emerald-600 bg-emerald-50/20 scale-[0.99]'
                        : isDragOver
                        ? 'border-emerald-600 ring-2 ring-emerald-600/20 bg-emerald-50/10'
                        : section.active
                        ? 'border-slate-100'
                        : 'border-slate-200/70 bg-slate-50/50 opacity-75'
                    }`}
                  >
                    <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                      <div className="cursor-grab active:cursor-grabbing p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors">
                        <GripVertical size={16} />
                      </div>

                      <div className="w-7 h-7 rounded-xl bg-indigo-50 text-indigo-700 font-bold text-xs flex items-center justify-center flex-shrink-0 border border-indigo-100">
                        {actualIdx + 1}
                      </div>

                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-slate-100 text-slate-700">
                        <IconComponent size={18} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-slate-900 text-sm leading-snug">
                            {section.label}
                          </h3>
                          {badgeText && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100">
                              {badgeText}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 truncate mt-0.5">{section.desc}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 flex-shrink-0">
                      <button
                        onClick={() => setActiveTab(section.id)}
                        className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-indigo-900 hover:text-white text-slate-700 text-xs font-semibold rounded-xl transition-all shadow-2xs cursor-pointer"
                      >
                        <Edit size={12} /> Manage Content
                      </button>

                      <button
                        onClick={() => {
                          toggleSection(section.id);
                          showToast(`"${section.label}" is now ${!section.active ? 'visible' : 'hidden'}.`);
                        }}
                        className={`flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-full border transition-all cursor-pointer shadow-2xs ${
                          section.active
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                        }`}
                      >
                        {section.active ? (
                          <>
                            <Eye size={13} className="text-emerald-600" />
                            <span>Visible</span>
                          </>
                        ) : (
                          <>
                            <EyeOff size={13} className="text-slate-400" />
                            <span>Hidden</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* ─── TAB 7+: OTHER SPECIALIZED SECTIONS (FOUR PILLARS, ETC.) ─── */}
      {/* ════════════════════════════════════════════════════════════════ */}
      {!['categories', 'promo-banners', 'new-arrivals', 'best-sellers', 'hero', 'layout'].includes(activeTab) && currentSection && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
                {React.createElement(ICON_MAP[currentSection.id] || LayoutTemplate, { size: 18 })}
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">{currentSection.label}</h3>
                <p className="text-xs text-slate-500">{currentSection.desc}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  toggleSection(currentSection.id);
                  showToast(`"${currentSection.label}" updated.`);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border ${
                  currentSection.active ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {currentSection.active ? <Eye size={13} /> : <EyeOff size={13} />}
                <span>{currentSection.active ? 'Visible' : 'Hidden'}</span>
              </button>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl text-xs text-slate-600 space-y-3">
            <p className="font-medium text-slate-800">Direct Section Properties:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Section Title</label>
                <input
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-indigo-600"
                  value={currentSection.content?.title || ''}
                  onChange={(e) => updateSectionContent(currentSection.id, { title: e.target.value })}
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Eyebrow Tag</label>
                <input
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-indigo-600"
                  value={currentSection.content?.eyebrow || ''}
                  onChange={(e) => updateSectionContent(currentSection.id, { eyebrow: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* ─── MODAL 1: PRODUCT SELECTION MODAL (IMAGE 4) ─── */}
      {/* ════════════════════════════════════════════════════════════════ */}
      {productPickerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden animate-[fadeInUp_0.2s_ease-out]">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <div>
                <h3 className="font-black text-slate-900 text-lg">
                  {productPickerModal.targetSection === 'new-arrivals' ? 'Select New Arrivals' : 'Select Best Sellers'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Choose products from the store catalog or create a new product.</p>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href="/admin/products/add"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  <Plus size={13} /> Create New Product
                </a>
                <button
                  onClick={() => setProductPickerModal(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Modal Search & Filter Bar */}
            <div className="px-6 pt-4 pb-2 flex gap-3 items-center">
              <div className="flex-1 flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs">
                <Search size={14} className="text-slate-400" />
                <input
                  value={pickerSearch}
                  onChange={e => setPickerSearch(e.target.value)}
                  placeholder="Search store products..."
                  className="bg-transparent outline-none w-full text-slate-800 placeholder-slate-400"
                />
              </div>

              <select
                value={pickerCategoryFilter}
                onChange={e => setPickerCategoryFilter(e.target.value)}
                className="border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 bg-white font-medium outline-none"
              >
                <option value="All">All Categories ({products.length})</option>
                {pickerCategories.map(cat => (
                  <option key={cat.name} value={cat.name}>
                    {cat.name} ({cat.count})
                  </option>
                ))}
              </select>
            </div>

            {/* Modal Product Items List */}
            <div className="flex-1 overflow-y-auto px-6 py-3 space-y-2.5">
              {pickerFilteredProducts.map((prod) => {
                const isSelected = selectedProductIdsInPicker.includes(prod.id);
                const prodImage = prod.colors?.[0]?.images?.[0]?.url || sareeGolden;

                return (
                  <div
                    key={prod.id}
                    onClick={() => handleToggleProductInPicker(prod.id)}
                    className={`flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/50 shadow-2xs'
                        : 'border-slate-200/80 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Checkbox */}
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}} // Handled by container click
                        className="w-4 h-4 rounded text-indigo-600 accent-indigo-600 cursor-pointer"
                      />

                      {/* Thumbnail */}
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0">
                        <img src={prodImage} alt={prod.name} className="w-full h-full object-cover" />
                      </div>

                      {/* Title & Info */}
                      <div>
                        <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{prod.name}</h4>
                        <p className="text-slate-500 text-[11px] mt-0.5">
                          {prod.category} • ₹{Number(prod.price || 0).toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>

                    {/* Selected Badge */}
                    {isSelected && (
                      <span className="text-xs font-bold text-indigo-700 pr-2">
                        Selected
                      </span>
                    )}
                  </div>
                );
              })}

              {pickerFilteredProducts.length === 0 && (
                <div className="py-12 text-center text-slate-400 text-xs">
                  No products found matching your search.
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/50">
              <button
                onClick={() => setProductPickerModal(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePickedProducts}
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all shadow-md cursor-pointer"
              >
                Add Selected ({selectedProductIdsInPicker.length})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* ─── MODAL 2: CATEGORY TILE ADD / EDIT MODAL ─── */}
      {/* ════════════════════════════════════════════════════════════════ */}
      {categoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-[fadeInUp_0.2s_ease-out]">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">
                {categoryModal.mode === 'add' ? 'Add Category Tile' : 'Edit Category Tile'}
              </h3>
              <button onClick={() => setCategoryModal(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Category Name
                </label>
                <input
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-bold outline-none focus:bg-white focus:border-indigo-600"
                  value={categoryModal.data.name}
                  onChange={e => setCategoryModal({
                    ...categoryModal,
                    data: { ...categoryModal.data, name: e.target.value }
                  })}
                  placeholder="e.g. Hybrid, Sarees, Lehengas, Pillows"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Destination Route / Link
                </label>
                <input
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 outline-none focus:bg-white focus:border-indigo-600"
                  value={categoryModal.data.link}
                  onChange={e => setCategoryModal({
                    ...categoryModal,
                    data: { ...categoryModal.data, link: e.target.value }
                  })}
                  placeholder="/category/sarees"
                />
              </div>

              {/* Theme Color Presets */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                  Theme & Gradient Color Preset
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {CATEGORY_THEMES.map(theme => {
                    const isSelected = categoryModal.data.themeColor === theme.name;
                    return (
                      <div
                        key={theme.name}
                        onClick={() => setCategoryModal({
                          ...categoryModal,
                          data: {
                            ...categoryModal.data,
                            themeColor: theme.name,
                            bgGradient: theme.bgGradient,
                            borderColor: theme.borderColor,
                            textColor: theme.textColor,
                          }
                        })}
                        className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50/60 ring-1 ring-indigo-600'
                            : 'border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <span className="w-3.5 h-3.5 rounded-full flex-shrink-0" style={{ backgroundColor: theme.dotColor }} />
                        <span className="font-semibold text-slate-800 text-[11px] truncate">{theme.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Thumbnail Image */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Tile Image URL / Preset
                </label>
                <div className="flex gap-2">
                  <input
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 outline-none focus:bg-white focus:border-indigo-600"
                    value={categoryModal.data.image}
                    onChange={e => setCategoryModal({
                      ...categoryModal,
                      data: { ...categoryModal.data, image: e.target.value }
                    })}
                  />
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0">
                    <img src={categoryModal.data.image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <span className="font-semibold text-slate-700">Display on Storefront</span>
                <button
                  type="button"
                  onClick={() => setCategoryModal({
                    ...categoryModal,
                    data: { ...categoryModal.data, active: !categoryModal.data.active }
                  })}
                  className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                    categoryModal.data.active ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {categoryModal.data.active ? 'Active & Visible' : 'Hidden'}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/50">
              <button
                onClick={() => setCategoryModal(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSaveCategory(categoryModal.data)}
                disabled={!categoryModal.data.name.trim()}
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition-all shadow-md cursor-pointer"
              >
                Save Category Tile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* ─── MODAL 3: PROMO BANNER ADD / EDIT MODAL ─── */}
      {/* ════════════════════════════════════════════════════════════════ */}
      {bannerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-[fadeInUp_0.2s_ease-out]">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">
                {bannerModal.mode === 'add' ? 'Add Promo Banner' : 'Edit Promo Banner'}
              </h3>
              <button onClick={() => setBannerModal(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Banner Title</label>
                  <input
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-bold outline-none focus:bg-white focus:border-indigo-600"
                    value={bannerModal.data.title}
                    onChange={e => setBannerModal({
                      ...bannerModal,
                      data: { ...bannerModal.data, title: e.target.value }
                    })}
                    placeholder="e.g. Classic Comfort"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Campaign Type</label>
                  <select
                    value={bannerModal.data.type || 'PROMOTION'}
                    onChange={e => setBannerModal({
                      ...bannerModal,
                      data: { ...bannerModal.data, type: e.target.value }
                    })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-bold outline-none"
                  >
                    <option value="PROMOTION">PROMOTION</option>
                    <option value="OFFER">OFFER</option>
                    <option value="NEW ARRIVAL">NEW ARRIVAL</option>
                    <option value="COLLECTION">COLLECTION</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Subtitle / Highlight</label>
                <input
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 outline-none focus:bg-white focus:border-indigo-600"
                  value={bannerModal.data.subtitle}
                  onChange={e => setBannerModal({
                    ...bannerModal,
                    data: { ...bannerModal.data, subtitle: e.target.value }
                  })}
                  placeholder="e.g. Limited Mattress Event"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Body Description</label>
                <textarea
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 outline-none focus:bg-white focus:border-indigo-600 resize-none"
                  value={bannerModal.data.description}
                  onChange={e => setBannerModal({
                    ...bannerModal,
                    data: { ...bannerModal.data, description: e.target.value }
                  })}
                  placeholder="Handcrafted memory foam & hybrid mattresses at up to 60% off."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">CTA Button Text</label>
                  <input
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 outline-none focus:bg-white focus:border-indigo-600"
                    value={bannerModal.data.ctaText}
                    onChange={e => setBannerModal({
                      ...bannerModal,
                      data: { ...bannerModal.data, ctaText: e.target.value }
                    })}
                    placeholder="e.g. shop now"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Target Route Label</label>
                  <input
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 outline-none focus:bg-white focus:border-indigo-600"
                    value={bannerModal.data.targetRoute}
                    onChange={e => setBannerModal({
                      ...bannerModal,
                      data: { ...bannerModal.data, targetRoute: e.target.value }
                    })}
                    placeholder="e.g. mattress, sarees"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Banner Image URL / Preset</label>
                <div className="flex gap-2">
                  <input
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 outline-none focus:bg-white focus:border-indigo-600"
                    value={bannerModal.data.image}
                    onChange={e => setBannerModal({
                      ...bannerModal,
                      data: { ...bannerModal.data, image: e.target.value }
                    })}
                  />
                  <div className="w-12 h-10 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0">
                    <img src={bannerModal.data.image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/50">
              <button
                onClick={() => setBannerModal(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSaveBanner(bannerModal.data)}
                disabled={!bannerModal.data.title.trim()}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition-all shadow-md cursor-pointer"
              >
                Save Banner
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* ─── MODAL 4: HERO SLIDE EDIT MODAL ─── */}
      {/* ════════════════════════════════════════════════════════════════ */}
      {heroSlideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-[fadeInUp_0.2s_ease-out]">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Edit Hero Slide #{heroSlideModal.idx + 1}</h3>
              <button onClick={() => setHeroSlideModal(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-3.5 text-xs max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Eyebrow Tag</label>
                  <input
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 outline-none"
                    value={heroSlideModal.slide.eyebrow || ''}
                    onChange={e => setHeroSlideModal({
                      ...heroSlideModal,
                      slide: { ...heroSlideModal.slide, eyebrow: e.target.value }
                    })}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Accent Background Tint</label>
                  <input
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 outline-none"
                    value={heroSlideModal.slide.accentBg || '#EBF5F5'}
                    onChange={e => setHeroSlideModal({
                      ...heroSlideModal,
                      slide: { ...heroSlideModal.slide, accentBg: e.target.value }
                    })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Heading Line 1</label>
                  <input
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 font-bold outline-none"
                    value={heroSlideModal.slide.headingLine1 || ''}
                    onChange={e => setHeroSlideModal({
                      ...heroSlideModal,
                      slide: { ...heroSlideModal.slide, headingLine1: e.target.value }
                    })}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Heading Line 2</label>
                  <input
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 font-bold outline-none"
                    value={heroSlideModal.slide.headingLine2 || ''}
                    onChange={e => setHeroSlideModal({
                      ...heroSlideModal,
                      slide: { ...heroSlideModal.slide, headingLine2: e.target.value }
                    })}
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Subtitle / Story</label>
                <textarea
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 outline-none resize-none"
                  value={heroSlideModal.slide.subtitle || ''}
                  onChange={e => setHeroSlideModal({
                    ...heroSlideModal,
                    slide: { ...heroSlideModal.slide, subtitle: e.target.value }
                  })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Primary CTA Text</label>
                  <input
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 outline-none"
                    value={heroSlideModal.slide.ctaText || ''}
                    onChange={e => setHeroSlideModal({
                      ...heroSlideModal,
                      slide: { ...heroSlideModal.slide, ctaText: e.target.value }
                    })}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Primary CTA Link</label>
                  <input
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 outline-none"
                    value={heroSlideModal.slide.ctaLink || ''}
                    onChange={e => setHeroSlideModal({
                      ...heroSlideModal,
                      slide: { ...heroSlideModal.slide, ctaLink: e.target.value }
                    })}
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Main Image URL / Asset</label>
                <input
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 outline-none"
                  value={heroSlideModal.slide.mainImage || ''}
                  onChange={e => setHeroSlideModal({
                    ...heroSlideModal,
                    slide: { ...heroSlideModal.slide, mainImage: e.target.value }
                  })}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/50">
              <button
                onClick={() => setHeroSlideModal(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const updated = heroSlides.map((s, i) => (i === heroSlideModal.idx ? { ...heroSlideModal.slide } : s));
                  updateSectionContent('hero', { slides: updated });
                  showToast('Hero slide saved.');
                  setHeroSlideModal(null);
                }}
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all shadow-md cursor-pointer"
              >
                Save Slide
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
