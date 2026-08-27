import React, { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { Filter, ChevronDown, X, SlidersHorizontal, Sparkles, Check, RefreshCw, Star, Percent, Tag, Award } from 'lucide-react';
import { products } from '../data/products';
import ProductCard from '../components/ProductCard';

const SORT_OPTIONS = [
  { id: 'recommended', label: 'Recommended' },
  { id: 'newest', label: 'Newest Arrivals' },
  { id: 'price-low', label: 'Price: Low to High' },
  { id: 'price-high', label: 'Price: High to Low' },
];

const COLOR_FILTER_OPTIONS = [
  { id: 'all', name: 'All Colors', hex: null },
  { id: 'teal', name: 'Teal', hex: '#006B70' },
  { id: 'gold', name: 'Gold / Zari', hex: '#D4AF37' },
  { id: 'pink', name: 'Blush Pink', hex: '#F8C8DC' },
  { id: 'navy', name: 'Navy Blue', hex: '#0F1E2E' },
  { id: 'black', name: 'Midnight Black', hex: '#000000' },
  { id: 'maroon', name: 'Maroon', hex: '#800000' },
  { id: 'yellow', name: 'Mustard Yellow', hex: '#FFDB58' },
  { id: 'white', name: 'Pure White / Ivory', hex: '#FFFFFF' },
  { id: 'green', name: 'Emerald Green', hex: '#50C878' },
  { id: 'red', name: 'Crimson Red', hex: '#DC143C' },
];

const SIZE_OPTIONS = ['all', 'Free Size', 'S', 'M', 'L', 'XL', 'XXL', 'Custom'];
const OCCASION_OPTIONS = ['all', 'Wedding', 'Festive', 'Party', 'Casual', 'Office', 'Haldi / Mehendi'];

const DISCOUNT_OPTIONS = [
  { id: 'all', label: 'All Discounts' },
  { id: '30-plus', label: '30% OFF & Above' },
  { id: '20-plus', label: '20% OFF & Above' },
  { id: '10-plus', label: '10% OFF & Above' },
  { id: 'on-sale', label: 'On Special Sale' },
];

const RATING_OPTIONS = [
  { id: 'all', label: 'All Ratings' },
  { id: '4.8', label: '4.8★ & Above' },
  { id: '4.5', label: '4.5★ & Above' },
  { id: '4.0', label: '4.0★ & Above' },
];

const PATTERN_OPTIONS = ['all', 'Floral', 'Embroidered', 'Zari Work', 'Chikankari', 'Printed', 'Handloom', 'Solid'];

const TAG_OPTIONS = [
  { id: 'all', label: 'All Collection' },
  { id: 'new', label: 'New Arrivals ✨' },
  { id: 'bestseller', label: 'Best Sellers 🔥' },
];

export default function ProductList() {
  const { categoryName } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const searchQuery = searchParams.get('search') || '';
  const fabricParam = searchParams.get('fabric') || 'all';
  const subParam = searchParams.get('sub') || 'all';
  const occasionParam = searchParams.get('occasion') || 'all';
  const colorParam = searchParams.get('color') || 'all';
  const sizeParam = searchParams.get('size') || 'all';
  const discountParam = searchParams.get('discount') || 'all';
  const ratingParam = searchParams.get('rating') || 'all';
  const patternParam = searchParams.get('pattern') || 'all';
  const tagParam = searchParams.get('tag') || 'all';
  const inStockParam = searchParams.get('inStock') === 'true';
  const categoryQuery = searchParams.get('category');

  const [selectedCategory, setSelectedCategory] = useState(categoryName || categoryQuery || 'all');
  const [selectedFabric, setSelectedFabric] = useState(fabricParam);
  const [selectedSub, setSelectedSub] = useState(subParam);
  const [selectedOccasion, setSelectedOccasion] = useState(occasionParam);
  const [selectedColor, setSelectedColor] = useState(colorParam);
  const [selectedSize, setSelectedSize] = useState(sizeParam);
  const [selectedDiscount, setSelectedDiscount] = useState(discountParam);
  const [selectedRating, setSelectedRating] = useState(ratingParam);
  const [selectedPattern, setSelectedPattern] = useState(patternParam);
  const [selectedTag, setSelectedTag] = useState(tagParam);
  const [inStockOnly, setInStockOnly] = useState(inStockParam);
  const [priceRange, setPriceRange] = useState('all');

  const [sortOpen, setSortOpen] = useState(false);
  const [activeSort, setActiveSort] = useState('recommended');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  useEffect(() => {
    setSelectedCategory(categoryName || categoryQuery || 'all');
    setSelectedFabric(searchParams.get('fabric') || 'all');
    setSelectedSub(searchParams.get('sub') || 'all');
    setSelectedOccasion(searchParams.get('occasion') || 'all');
    setSelectedColor(searchParams.get('color') || 'all');
    setSelectedSize(searchParams.get('size') || 'all');
    setSelectedDiscount(searchParams.get('discount') || 'all');
    setSelectedRating(searchParams.get('rating') || 'all');
    setSelectedPattern(searchParams.get('pattern') || 'all');
    setSelectedTag(searchParams.get('tag') || 'all');
    setInStockOnly(searchParams.get('inStock') === 'true');
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [categoryName, searchParams]);

  // Filter Pipeline
  let displayProducts = [...products];

  // 1. Category Filter
  if (selectedCategory && selectedCategory !== 'all') {
    if (selectedCategory.toLowerCase() === 'sale') {
      displayProducts = displayProducts.filter(p => p.oldPrice || p.discount);
    } else if (selectedCategory.toLowerCase() !== 'occasion') {
      displayProducts = displayProducts.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase());
    }
  }

  // 2. Fabric Filter
  if (selectedFabric && selectedFabric !== 'all') {
    const f = selectedFabric.toLowerCase();
    displayProducts = displayProducts.filter(p => 
      (p.fabric && p.fabric.toLowerCase().includes(f)) ||
      p.name.toLowerCase().includes(f) ||
      p.description.toLowerCase().includes(f)
    );
  }

  // 3. Subcategory Filter
  if (selectedSub && selectedSub !== 'all') {
    const s = selectedSub.toLowerCase();
    displayProducts = displayProducts.filter(p => 
      p.name.toLowerCase().includes(s) ||
      p.description.toLowerCase().includes(s) ||
      (p.fabric && p.fabric.toLowerCase().includes(s))
    );
  }

  // 4. Occasion Filter
  if (selectedOccasion && selectedOccasion !== 'all') {
    const o = selectedOccasion.toLowerCase();
    displayProducts = displayProducts.filter(p => 
      (p.occasion && p.occasion.toLowerCase().includes(o)) ||
      p.name.toLowerCase().includes(o) ||
      p.description.toLowerCase().includes(o)
    );
  }

  // 5. Color Filter
  if (selectedColor && selectedColor !== 'all') {
    const targetColorObj = COLOR_FILTER_OPTIONS.find(c => c.id === selectedColor);
    if (targetColorObj && targetColorObj.hex) {
      const targetHex = targetColorObj.hex.toUpperCase();
      displayProducts = displayProducts.filter(p => {
        if (!p.colors || p.colors.length === 0) return false;
        return p.colors.some(c => c.toUpperCase() === targetHex) ||
               p.name.toLowerCase().includes(targetColorObj.id) ||
               p.description.toLowerCase().includes(targetColorObj.id);
      });
    }
  }

  // 6. Size Filter
  if (selectedSize && selectedSize !== 'all') {
    displayProducts = displayProducts.filter(p => 
      p.sizes && p.sizes.some(s => s.toLowerCase() === selectedSize.toLowerCase())
    );
  }

  // 7. Stock Availability Filter
  if (inStockOnly) {
    displayProducts = displayProducts.filter(p => p.stock > 0);
  }

  // 8. Discount Filter
  if (selectedDiscount && selectedDiscount !== 'all') {
    displayProducts = displayProducts.filter(p => {
      if (selectedDiscount === 'on-sale') return p.oldPrice || p.discount;
      if (!p.discount) return false;
      const numMatch = p.discount.match(/\d+/);
      const discountPct = numMatch ? parseInt(numMatch[0], 10) : 0;
      if (selectedDiscount === '30-plus') return discountPct >= 30;
      if (selectedDiscount === '20-plus') return discountPct >= 20;
      if (selectedDiscount === '10-plus') return discountPct >= 10;
      return true;
    });
  }

  // 9. Customer Rating Filter
  if (selectedRating && selectedRating !== 'all') {
    const minRating = parseFloat(selectedRating);
    displayProducts = displayProducts.filter(p => p.rating && p.rating >= minRating);
  }

  // 10. Pattern / Work Type Filter
  if (selectedPattern && selectedPattern !== 'all') {
    const pat = selectedPattern.toLowerCase();
    displayProducts = displayProducts.filter(p =>
      p.name.toLowerCase().includes(pat) ||
      p.description.toLowerCase().includes(pat) ||
      (p.fabric && p.fabric.toLowerCase().includes(pat))
    );
  }

  // 11. Collection Highlights Tag Filter
  if (selectedTag && selectedTag !== 'all') {
    if (selectedTag === 'new') {
      displayProducts = displayProducts.filter(p => p.isNew);
    } else if (selectedTag === 'bestseller') {
      displayProducts = displayProducts.filter(p => p.isBestSeller);
    }
  }

  // 12. Smart Search Query
  if (searchQuery) {
    const rawQuery = searchQuery.toLowerCase().trim();
    const terms = rawQuery.split(/\s+/).filter(Boolean);
    
    displayProducts = displayProducts.filter(p => {
      const fullText = `${p.name} ${p.category} ${p.fabric || ''} ${p.occasion || ''} ${p.description}`.toLowerCase();
      return terms.every(t => fullText.includes(t)) || terms.some(t => t.length >= 3 && fullText.includes(t));
    });
  }

  // 13. Price Range
  if (priceRange === 'under-2000') {
    displayProducts = displayProducts.filter(p => p.price < 2000);
  } else if (priceRange === '2000-5000') {
    displayProducts = displayProducts.filter(p => p.price >= 2000 && p.price <= 5000);
  } else if (priceRange === 'above-5000') {
    displayProducts = displayProducts.filter(p => p.price > 5000);
  }

  // 14. Sort
  if (activeSort === 'newest') {
    displayProducts.sort((a, b) => (b.isNew === a.isNew ? 0 : b.isNew ? 1 : -1));
  } else if (activeSort === 'price-low') {
    displayProducts.sort((a, b) => a.price - b.price);
  } else if (activeSort === 'price-high') {
    displayProducts.sort((a, b) => b.price - a.price);
  }

  const categoriesList = ['all', 'sarees', 'kurtis', 'lehengas', 'dresses'];

  const fabricOptions = {
    sarees: ['all', 'Silk', 'Organza', 'Georgette', 'Cotton', 'Banarasi'],
    kurtis: ['all', 'Cotton', 'Silk', 'Rayon', 'Georgette'],
    lehengas: ['all', 'Organza', 'Net', 'Raw Silk', 'Georgette'],
    dresses: ['all', 'Cotton Silk', 'Georgette', 'Velvet', 'Cotton'],
    all: ['all', 'Silk', 'Cotton', 'Organza', 'Georgette', 'Banarasi'],
  };

  const currentFabrics = fabricOptions[selectedCategory] || fabricOptions.all;

  const updateParam = (key, val) => {
    const newParams = new URLSearchParams(searchParams);
    if (!val || val === 'all' || val === false) {
      newParams.delete(key);
    } else {
      newParams.set(key, val);
    }
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    setSelectedCategory('all');
    setSelectedFabric('all');
    setSelectedSub('all');
    setSelectedOccasion('all');
    setSelectedColor('all');
    setSelectedSize('all');
    setSelectedDiscount('all');
    setSelectedRating('all');
    setSelectedPattern('all');
    setSelectedTag('all');
    setInStockOnly(false);
    setPriceRange('all');
    setSearchParams({});
  };

  const hasActiveFilters = 
    selectedCategory !== 'all' || 
    selectedFabric !== 'all' || 
    selectedSub !== 'all' || 
    selectedOccasion !== 'all' || 
    selectedColor !== 'all' || 
    selectedSize !== 'all' || 
    selectedDiscount !== 'all' || 
    selectedRating !== 'all' || 
    selectedPattern !== 'all' || 
    selectedTag !== 'all' || 
    inStockOnly || 
    priceRange !== 'all' || 
    searchQuery;

  return (
    <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 pt-6 sm:pt-8 pb-12 lg:pb-16 text-left">
      
      {/* Breadcrumbs */}
      <nav className="text-[10px] font-sans text-brand-navy/50 uppercase tracking-[0.2em] mb-4 flex items-center flex-wrap gap-2">
        <Link to="/" className="hover:text-brand-teal transition-colors">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-brand-teal transition-colors">Shop</Link>
        <span>/</span>
        {searchQuery ? (
          <span className="text-brand-navy font-semibold">Search Results</span>
        ) : (
          <span className="text-brand-navy font-semibold capitalize">
            {selectedCategory === 'all' ? 'All Collections' : selectedCategory}
          </span>
        )}
      </nav>

      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 pb-4 border-b border-brand-powder/60">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-light text-brand-navy tracking-wider uppercase leading-tight mb-1">
            {searchQuery ? `Results for "${searchQuery}"` : (selectedCategory === 'all' ? 'The Collections' : selectedCategory)}
          </h1>
          <p className="font-sans text-[11px] text-brand-navy/60 font-medium uppercase tracking-[0.18em]">
            Showing {displayProducts.length} Premium Pieces
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-4 mt-6 md:mt-0">
          
          {/* Mobile Filter Button */}
          <button 
            onClick={() => setFilterDrawerOpen(true)}
            className="lg:hidden flex items-center gap-2 border border-brand-powder px-4 py-2.5 rounded-sm text-brand-navy font-sans text-[10px] uppercase tracking-[0.2em] font-semibold hover:border-brand-teal hover:text-brand-teal transition-colors bg-white shadow-2xs"
          >
            <SlidersHorizontal size={14} /> Filters {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-brand-teal" />}
          </button>

          {/* Sort Dropdown */}
          <div className="relative z-20">
            <button 
              onClick={() => setSortOpen(!sortOpen)}
              className="flex items-center gap-2 border border-brand-powder px-5 py-2.5 rounded-sm text-brand-navy font-sans text-[10px] uppercase tracking-[0.2em] font-semibold hover:border-brand-teal hover:text-brand-teal transition-colors bg-white w-48 justify-between shadow-2xs"
            >
              <span className="truncate">{SORT_OPTIONS.find(o => o.id === activeSort)?.label}</span>
              <ChevronDown size={14} className={`transition-transform duration-200 ${sortOpen ? 'rotate-180 text-brand-teal' : ''}`} />
            </button>
            
            {sortOpen && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-brand-powder/60 shadow-xl rounded-sm py-2 origin-top-right animate-in fade-in zoom-in-95 z-30">
                {SORT_OPTIONS.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => { setActiveSort(opt.id); setSortOpen(false); }}
                    className={`w-full text-left px-5 py-2.5 font-sans text-[11px] tracking-wider transition-colors ${
                      activeSort === opt.id ? 'text-brand-teal bg-brand-powderLight font-semibold' : 'text-brand-navy/70 hover:text-brand-teal hover:bg-brand-powderLight'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Active Filter Badges Bar */}
      {hasActiveFilters && (
        <div className="mb-6 p-3.5 bg-brand-cream/40 border border-brand-powder/60 rounded-sm flex items-center flex-wrap gap-2">
          <span className="font-sans text-[10px] tracking-[0.2em] font-bold uppercase text-brand-navy/60 mr-1">Active Filters:</span>
          
          {selectedCategory !== 'all' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-brand-powder text-brand-navy text-xs rounded-full font-medium shadow-2xs">
              Category: <strong className="capitalize">{selectedCategory}</strong>
              <button onClick={() => updateParam('category', 'all')} className="hover:text-red-500 ml-1"><X size={12} /></button>
            </span>
          )}

          {selectedTag !== 'all' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-brand-powder text-brand-navy text-xs rounded-full font-medium shadow-2xs">
              Tag: <strong>{TAG_OPTIONS.find(t => t.id === selectedTag)?.label}</strong>
              <button onClick={() => updateParam('tag', 'all')} className="hover:text-red-500 ml-1"><X size={12} /></button>
            </span>
          )}

          {selectedRating !== 'all' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-brand-powder text-brand-navy text-xs rounded-full font-medium shadow-2xs">
              Rating: <strong>{RATING_OPTIONS.find(r => r.id === selectedRating)?.label}</strong>
              <button onClick={() => updateParam('rating', 'all')} className="hover:text-red-500 ml-1"><X size={12} /></button>
            </span>
          )}

          {selectedDiscount !== 'all' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-900 text-xs rounded-full font-medium shadow-2xs">
              Discount: <strong>{DISCOUNT_OPTIONS.find(d => d.id === selectedDiscount)?.label}</strong>
              <button onClick={() => updateParam('discount', 'all')} className="hover:text-red-500 ml-1"><X size={12} /></button>
            </span>
          )}

          {selectedColor !== 'all' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-brand-powder text-brand-navy text-xs rounded-full font-medium shadow-2xs">
              Color: <strong>{COLOR_FILTER_OPTIONS.find(c => c.id === selectedColor)?.name}</strong>
              <button onClick={() => updateParam('color', 'all')} className="hover:text-red-500 ml-1"><X size={12} /></button>
            </span>
          )}

          {selectedPattern !== 'all' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-brand-powder text-brand-navy text-xs rounded-full font-medium shadow-2xs">
              Pattern: <strong>{selectedPattern}</strong>
              <button onClick={() => updateParam('pattern', 'all')} className="hover:text-red-500 ml-1"><X size={12} /></button>
            </span>
          )}

          {selectedFabric !== 'all' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-brand-powder text-brand-navy text-xs rounded-full font-medium shadow-2xs">
              Fabric: <strong>{selectedFabric}</strong>
              <button onClick={() => updateParam('fabric', 'all')} className="hover:text-red-500 ml-1"><X size={12} /></button>
            </span>
          )}

          {selectedOccasion !== 'all' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-brand-powder text-brand-navy text-xs rounded-full font-medium shadow-2xs">
              Occasion: <strong>{selectedOccasion}</strong>
              <button onClick={() => updateParam('occasion', 'all')} className="hover:text-red-500 ml-1"><X size={12} /></button>
            </span>
          )}

          {selectedSize !== 'all' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-brand-powder text-brand-navy text-xs rounded-full font-medium shadow-2xs">
              Size: <strong>{selectedSize}</strong>
              <button onClick={() => updateParam('size', 'all')} className="hover:text-red-500 ml-1"><X size={12} /></button>
            </span>
          )}

          {inStockOnly && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-full font-medium shadow-2xs">
              In Stock Only
              <button onClick={() => updateParam('inStock', false)} className="hover:text-red-500 ml-1"><X size={12} /></button>
            </span>
          )}

          {priceRange !== 'all' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-brand-powder text-brand-navy text-xs rounded-full font-medium shadow-2xs">
              Price: <strong>{priceRange}</strong>
              <button onClick={() => setPriceRange('all')} className="hover:text-red-500 ml-1"><X size={12} /></button>
            </span>
          )}

          <button
            onClick={clearAllFilters}
            className="text-xs font-sans text-brand-teal hover:underline font-bold ml-auto pl-2 uppercase tracking-wider"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Grid Layout Container */}
      <div className="flex gap-8 lg:gap-10 items-start">
        
        {/* Desktop Sidebar (Sticky & Scrollable to the very end) */}
        <aside className="hidden lg:block w-64 xl:w-72 flex-shrink-0 sticky top-24 max-h-[calc(100vh-6.5rem)] overflow-y-auto pr-2 space-y-6 bg-white p-5 border border-brand-powder/50 rounded-sm shadow-2xs">
          
          {/* Section Header */}
          <div className="flex items-center justify-between border-b border-brand-powder/60 pb-3">
            <span className="font-sans text-xs uppercase tracking-[0.2em] font-bold text-brand-navy flex items-center gap-2">
              <SlidersHorizontal size={14} className="text-brand-teal" /> Filter Catalog
            </span>
            {hasActiveFilters && (
              <button onClick={clearAllFilters} className="font-sans text-[10px] uppercase font-bold text-brand-teal hover:underline">
                Reset
              </button>
            )}
          </div>

          {/* 1. Main Categories */}
          <div>
            <h3 className="font-sans text-[10px] uppercase tracking-[0.2em] font-semibold text-brand-navy mb-3">
              Category
            </h3>
            <div className="flex flex-col gap-2">
              {categoriesList.map(cat => (
                <Link
                  key={cat}
                  to={cat === 'all' ? '/products' : `/category/${cat}`}
                  className={`font-sans text-xs tracking-wider capitalize transition-colors flex items-center justify-between py-1 px-2 rounded-xs ${
                    selectedCategory.toLowerCase() === cat.toLowerCase()
                      ? 'text-brand-teal font-bold bg-brand-powderLight'
                      : 'text-brand-navy/70 hover:text-brand-teal hover:bg-brand-powderLight/40'
                  }`}
                >
                  <span>{cat === 'all' ? 'All Products' : cat}</span>
                  <span className="text-[10px] text-brand-navy/40 font-normal">
                    ({cat === 'all' ? products.length : products.filter(p => p.category.toLowerCase() === cat).length})
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* 2. Collection Highlights / Tags */}
          <div className="border-t border-brand-powder/50 pt-5">
            <h3 className="font-sans text-[10px] uppercase tracking-[0.2em] font-semibold text-brand-navy mb-3 flex items-center gap-1.5">
              <Sparkles size={13} className="text-amber-500" /> Highlights
            </h3>
            <div className="flex flex-col gap-2">
              {TAG_OPTIONS.map(tg => (
                <button
                  key={tg.id}
                  onClick={() => updateParam('tag', selectedTag === tg.id ? 'all' : tg.id)}
                  className={`w-full text-left px-3 py-1.5 font-sans text-xs rounded-sm border transition-all flex items-center justify-between ${
                    selectedTag === tg.id
                      ? 'bg-amber-500 text-white border-amber-500 font-semibold shadow-2xs'
                      : 'bg-white text-brand-navy/75 border-brand-powder hover:border-amber-400 hover:text-amber-600'
                  }`}
                >
                  <span>{tg.label}</span>
                  {selectedTag === tg.id && <Check size={12} />}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Customer Rating */}
          <div className="border-t border-brand-powder/50 pt-5">
            <h3 className="font-sans text-[10px] uppercase tracking-[0.2em] font-semibold text-brand-navy mb-3 flex items-center gap-1.5">
              <Star size={13} className="text-amber-400 fill-amber-400" /> Customer Rating
            </h3>
            <div className="flex flex-col gap-2">
              {RATING_OPTIONS.map(rt => (
                <button
                  key={rt.id}
                  onClick={() => updateParam('rating', selectedRating === rt.id ? 'all' : rt.id)}
                  className={`w-full text-left px-3 py-1.5 font-sans text-xs rounded-sm border transition-all flex items-center justify-between ${
                    selectedRating === rt.id
                      ? 'bg-brand-navy text-white border-brand-navy font-semibold shadow-2xs'
                      : 'bg-white text-brand-navy/75 border-brand-powder hover:border-brand-teal hover:text-brand-teal'
                  }`}
                >
                  <span>{rt.label}</span>
                  {selectedRating === rt.id && <Check size={12} />}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Discount & Special Deals */}
          <div className="border-t border-brand-powder/50 pt-5">
            <h3 className="font-sans text-[10px] uppercase tracking-[0.2em] font-semibold text-brand-navy mb-3 flex items-center gap-1.5">
              <Percent size={13} className="text-brand-teal" /> Discount & Deals
            </h3>
            <div className="flex flex-col gap-2">
              {DISCOUNT_OPTIONS.map(dc => (
                <button
                  key={dc.id}
                  onClick={() => updateParam('discount', selectedDiscount === dc.id ? 'all' : dc.id)}
                  className={`w-full text-left px-3 py-1.5 font-sans text-xs rounded-sm border transition-all flex items-center justify-between ${
                    selectedDiscount === dc.id
                      ? 'bg-brand-teal text-white border-brand-teal font-semibold shadow-2xs'
                      : 'bg-white text-brand-navy/75 border-brand-powder hover:border-brand-teal hover:text-brand-teal'
                  }`}
                >
                  <span>{dc.label}</span>
                  {selectedDiscount === dc.id && <Check size={12} />}
                </button>
              ))}
            </div>
          </div>

          {/* 5. Color Availability Swatches */}
          <div className="border-t border-brand-powder/50 pt-5">
            <h3 className="font-sans text-[10px] uppercase tracking-[0.2em] font-semibold text-brand-navy mb-3 flex items-center justify-between">
              <span>Color Availability</span>
              {selectedColor !== 'all' && <span className="text-[10px] text-brand-teal font-bold capitalize">{selectedColor}</span>}
            </h3>
            <div className="grid grid-cols-5 gap-2.5">
              {COLOR_FILTER_OPTIONS.map(c => {
                if (c.id === 'all') return null;
                const isWhite = c.hex.toUpperCase() === '#FFFFFF';
                const isSelected = selectedColor === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => updateParam('color', isSelected ? 'all' : c.id)}
                    title={c.name}
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                      isSelected ? 'ring-2 ring-brand-teal ring-offset-2 scale-110 shadow-md' : 'ring-1 ring-slate-300 hover:ring-brand-teal hover:scale-105'
                    }`}
                  >
                    <span
                      className={`w-8 h-8 rounded-full shadow-2xs flex items-center justify-center ${
                        isWhite ? 'border-2 border-slate-300 bg-white' : 'border border-black/10'
                      }`}
                      style={{ backgroundColor: c.hex }}
                    >
                      {isSelected && <Check size={12} className={isWhite ? 'text-black' : 'text-white'} strokeWidth={3} />}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 6. Pattern & Work Type */}
          <div className="border-t border-brand-powder/50 pt-5">
            <h3 className="font-sans text-[10px] uppercase tracking-[0.2em] font-semibold text-brand-navy mb-3">
              Pattern / Work Type
            </h3>
            <div className="flex flex-wrap gap-2">
              {PATTERN_OPTIONS.map(pat => (
                <button
                  key={pat}
                  onClick={() => updateParam('pattern', selectedPattern === pat ? 'all' : pat)}
                  className={`px-3 py-1 font-sans text-[11px] tracking-wider rounded-sm border transition-all ${
                    selectedPattern.toLowerCase() === pat.toLowerCase()
                      ? 'bg-brand-navy text-white border-brand-navy font-semibold shadow-2xs'
                      : 'bg-white text-brand-navy/75 border-brand-powder hover:border-brand-teal hover:text-brand-teal'
                  }`}
                >
                  {pat === 'all' ? 'All Work' : pat}
                </button>
              ))}
            </div>
          </div>

          {/* 7. Availability / Stock Filter */}
          <div className="border-t border-brand-powder/50 pt-5">
            <h3 className="font-sans text-[10px] uppercase tracking-[0.2em] font-semibold text-brand-navy mb-3">
              Availability
            </h3>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => updateParam('inStock', e.target.checked)}
                className="w-4 h-4 text-brand-teal border-brand-powder rounded-xs focus:ring-brand-teal cursor-pointer"
              />
              <span className={`font-sans text-xs tracking-wider transition-colors ${inStockOnly ? 'text-brand-teal font-semibold' : 'text-brand-navy/70 group-hover:text-brand-teal'}`}>
                In Stock Only
              </span>
            </label>
          </div>

          {/* 8. Size Availability */}
          <div className="border-t border-brand-powder/50 pt-5">
            <h3 className="font-sans text-[10px] uppercase tracking-[0.2em] font-semibold text-brand-navy mb-3">
              Size
            </h3>
            <div className="flex flex-wrap gap-2">
              {SIZE_OPTIONS.map(sz => (
                <button
                  key={sz}
                  onClick={() => updateParam('size', selectedSize === sz ? 'all' : sz)}
                  className={`px-3 py-1 font-sans text-xs tracking-wider rounded-sm border transition-all ${
                    selectedSize === sz
                      ? 'bg-brand-navy text-white border-brand-navy font-semibold shadow-2xs'
                      : 'bg-white text-brand-navy/75 border-brand-powder hover:border-brand-teal hover:text-brand-teal'
                  }`}
                >
                  {sz === 'all' ? 'All' : sz}
                </button>
              ))}
            </div>
          </div>

          {/* 9. Fabric / Weave */}
          <div className="border-t border-brand-powder/50 pt-5">
            <h3 className="font-sans text-[10px] uppercase tracking-[0.2em] font-semibold text-brand-navy mb-3">
              Fabric / Weave
            </h3>
            <div className="flex flex-wrap gap-2">
              {currentFabrics.map(fab => (
                <button
                  key={fab}
                  onClick={() => updateParam('fabric', selectedFabric === fab ? 'all' : fab)}
                  className={`px-3 py-1 font-sans text-[11px] tracking-wider rounded-sm border transition-all ${
                    selectedFabric.toLowerCase() === fab.toLowerCase()
                      ? 'bg-brand-teal text-white border-brand-teal font-semibold shadow-2xs'
                      : 'bg-white text-brand-navy/75 border-brand-powder hover:border-brand-teal hover:text-brand-teal'
                  }`}
                >
                  {fab === 'all' ? 'All Fabrics' : fab}
                </button>
              ))}
            </div>
          </div>

          {/* 10. Occasion */}
          <div className="border-t border-brand-powder/50 pt-5">
            <h3 className="font-sans text-[10px] uppercase tracking-[0.2em] font-semibold text-brand-navy mb-3">
              Occasion
            </h3>
            <div className="flex flex-wrap gap-2">
              {OCCASION_OPTIONS.map(occ => (
                <button
                  key={occ}
                  onClick={() => updateParam('occasion', selectedOccasion === occ ? 'all' : occ)}
                  className={`px-2.5 py-1 font-sans text-[11px] tracking-wider rounded-sm border transition-all ${
                    selectedOccasion.toLowerCase() === occ.toLowerCase()
                      ? 'bg-brand-teal text-white border-brand-teal font-semibold shadow-2xs'
                      : 'bg-white text-brand-navy/75 border-brand-powder hover:border-brand-teal hover:text-brand-teal'
                  }`}
                >
                  {occ === 'all' ? 'All' : occ}
                </button>
              ))}
            </div>
          </div>

          {/* 11. Price Range */}
          <div className="border-t border-brand-powder/50 pt-5">
            <h3 className="font-sans text-[10px] uppercase tracking-[0.2em] font-semibold text-brand-navy mb-3">
              Price Range
            </h3>
            <div className="flex flex-col gap-2.5">
              {[
                { id: 'all', label: 'All Prices' },
                { id: 'under-2000', label: 'Under ₹2000' },
                { id: '2000-5000', label: '₹2000 - ₹5000' },
                { id: 'above-5000', label: 'Above ₹5000' },
              ].map(pr => (
                <label key={pr.id} className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="radio" 
                    name="price" 
                    checked={priceRange === pr.id}
                    onChange={() => setPriceRange(pr.id)}
                    className="w-3.5 h-3.5 text-brand-teal border-brand-powder focus:ring-brand-teal cursor-pointer"
                  />
                  <span className={`font-sans text-xs tracking-wider transition-colors ${priceRange === pr.id ? 'text-brand-teal font-semibold' : 'text-brand-navy/70 group-hover:text-brand-teal'}`}>
                    {pr.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

        </aside>

        {/* Main Product Grid Container */}
        <div className="flex-1 w-full">
          {displayProducts.length === 0 ? (
            <div className="text-center py-20 bg-brand-cream/30 border border-brand-powder/40 rounded-sm">
              <Filter size={32} strokeWidth={1} className="mx-auto text-brand-navy/20 mb-4" />
              <p className="font-serif text-2xl text-brand-navy/70 mb-2">Nothing found matching your active filters.</p>
              <p className="font-sans text-xs text-brand-navy/50 tracking-wider mb-6">Try broadening your color, rating, or price selection.</p>
              <button 
                onClick={clearAllFilters}
                className="border border-brand-teal bg-brand-teal text-white px-7 py-3 font-sans text-[10px] uppercase tracking-widest font-bold hover:bg-brand-tealDark transition-colors rounded-sm shadow-sm"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 animate-in fade-in duration-500">
              {displayProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Mobile Filter Drawer */}
      <div className={`fixed inset-0 z-50 bg-brand-navy/60 backdrop-blur-xs lg:hidden transition-opacity duration-300 ${filterDrawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={() => setFilterDrawerOpen(false)} />
      <div className={`fixed top-0 right-0 bottom-0 z-50 w-80 sm:w-96 bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out lg:hidden ${filterDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between p-5 border-b border-brand-powder/50">
          <span className="font-sans text-xs uppercase tracking-[0.2em] font-bold text-brand-navy flex items-center gap-2">
            <SlidersHorizontal size={14} className="text-brand-teal" /> Filter Catalog
          </span>
          <button onClick={() => setFilterDrawerOpen(false)} className="p-2 text-brand-navy/50 hover:text-brand-navy bg-brand-powderLight rounded-full"><X size={18} /></button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-7 text-left">
          
          {/* Mobile Categories */}
          <div>
            <h3 className="font-sans text-[10px] uppercase tracking-[0.2em] font-semibold text-brand-navy mb-3">Categories</h3>
            <div className="flex flex-col gap-2">
              {categoriesList.map(cat => (
                <Link
                  key={cat}
                  to={cat === 'all' ? '/products' : `/category/${cat}`}
                  onClick={() => setFilterDrawerOpen(false)}
                  className={`font-sans text-xs tracking-wider capitalize ${selectedCategory.toLowerCase() === cat.toLowerCase() ? 'text-brand-teal font-bold' : 'text-brand-navy/70'}`}
                >
                  {cat === 'all' ? 'All Products' : cat}
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile Highlights */}
          <div className="border-t border-brand-powder/50 pt-5">
            <h3 className="font-sans text-[10px] uppercase tracking-[0.2em] font-semibold text-brand-navy mb-3">Collection Highlights</h3>
            <div className="flex flex-col gap-2">
              {TAG_OPTIONS.map(tg => (
                <button
                  key={tg.id}
                  onClick={() => updateParam('tag', selectedTag === tg.id ? 'all' : tg.id)}
                  className={`w-full text-left px-3 py-1.5 font-sans text-xs rounded-sm border ${selectedTag === tg.id ? 'bg-amber-500 text-white border-amber-500 font-semibold' : 'bg-white text-brand-navy/75 border-brand-powder'}`}
                >
                  {tg.label}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Rating */}
          <div className="border-t border-brand-powder/50 pt-5">
            <h3 className="font-sans text-[10px] uppercase tracking-[0.2em] font-semibold text-brand-navy mb-3">Customer Rating</h3>
            <div className="flex flex-col gap-2">
              {RATING_OPTIONS.map(rt => (
                <button
                  key={rt.id}
                  onClick={() => updateParam('rating', selectedRating === rt.id ? 'all' : rt.id)}
                  className={`w-full text-left px-3 py-1.5 font-sans text-xs rounded-sm border ${selectedRating === rt.id ? 'bg-brand-navy text-white border-brand-navy font-semibold' : 'bg-white text-brand-navy/75 border-brand-powder'}`}
                >
                  {rt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Discount */}
          <div className="border-t border-brand-powder/50 pt-5">
            <h3 className="font-sans text-[10px] uppercase tracking-[0.2em] font-semibold text-brand-navy mb-3">Discount & Deals</h3>
            <div className="flex flex-col gap-2">
              {DISCOUNT_OPTIONS.map(dc => (
                <button
                  key={dc.id}
                  onClick={() => updateParam('discount', selectedDiscount === dc.id ? 'all' : dc.id)}
                  className={`w-full text-left px-3 py-1.5 font-sans text-xs rounded-sm border ${selectedDiscount === dc.id ? 'bg-brand-teal text-white border-brand-teal font-semibold' : 'bg-white text-brand-navy/75 border-brand-powder'}`}
                >
                  {dc.label}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Colors */}
          <div className="border-t border-brand-powder/50 pt-5">
            <h3 className="font-sans text-[10px] uppercase tracking-[0.2em] font-semibold text-brand-navy mb-3">Color Availability</h3>
            <div className="grid grid-cols-5 gap-2.5">
              {COLOR_FILTER_OPTIONS.map(c => {
                if (c.id === 'all') return null;
                const isWhite = c.hex.toUpperCase() === '#FFFFFF';
                const isSelected = selectedColor === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => updateParam('color', isSelected ? 'all' : c.id)}
                    title={c.name}
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                      isSelected ? 'ring-2 ring-brand-teal ring-offset-2 scale-110 shadow-md' : 'ring-1 ring-slate-300'
                    }`}
                  >
                    <span
                      className={`w-8 h-8 rounded-full shadow-2xs flex items-center justify-center ${
                        isWhite ? 'border-2 border-slate-300 bg-white' : 'border border-black/10'
                      }`}
                      style={{ backgroundColor: c.hex }}
                    >
                      {isSelected && <Check size={12} className={isWhite ? 'text-black' : 'text-white'} strokeWidth={3} />}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mobile Pattern */}
          <div className="border-t border-brand-powder/50 pt-5">
            <h3 className="font-sans text-[10px] uppercase tracking-[0.2em] font-semibold text-brand-navy mb-3">Pattern / Work Type</h3>
            <div className="flex flex-wrap gap-2">
              {PATTERN_OPTIONS.map(pat => (
                <button
                  key={pat}
                  onClick={() => updateParam('pattern', selectedPattern === pat ? 'all' : pat)}
                  className={`px-3 py-1 font-sans text-xs tracking-wider rounded-sm border ${selectedPattern.toLowerCase() === pat.toLowerCase() ? 'bg-brand-navy text-white border-brand-navy font-semibold' : 'bg-white text-brand-navy/70 border-brand-powder'}`}
                >
                  {pat === 'all' ? 'All Work' : pat}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Stock */}
          <div className="border-t border-brand-powder/50 pt-5">
            <h3 className="font-sans text-[10px] uppercase tracking-[0.2em] font-semibold text-brand-navy mb-3">Stock Availability</h3>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={inStockOnly} onChange={(e) => updateParam('inStock', e.target.checked)} className="w-4 h-4 text-brand-teal border-brand-powder focus:ring-brand-teal" />
              <span className="font-sans text-xs tracking-wider text-brand-navy">In Stock Only</span>
            </label>
          </div>

          {/* Mobile Sizes */}
          <div className="border-t border-brand-powder/50 pt-5">
            <h3 className="font-sans text-[10px] uppercase tracking-[0.2em] font-semibold text-brand-navy mb-3">Sizes</h3>
            <div className="flex flex-wrap gap-2">
              {SIZE_OPTIONS.map(sz => (
                <button
                  key={sz}
                  onClick={() => updateParam('size', selectedSize === sz ? 'all' : sz)}
                  className={`px-3 py-1 font-sans text-xs tracking-wider rounded-sm border ${
                    selectedSize === sz ? 'bg-brand-navy text-white border-brand-navy font-semibold' : 'bg-white text-brand-navy/70 border-brand-powder'
                  }`}
                >
                  {sz === 'all' ? 'All' : sz}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Fabrics */}
          <div className="border-t border-brand-powder/50 pt-5">
            <h3 className="font-sans text-[10px] uppercase tracking-[0.2em] font-semibold text-brand-navy mb-3">Fabrics</h3>
            <div className="flex flex-wrap gap-2">
              {currentFabrics.map(fab => (
                <button
                  key={fab}
                  onClick={() => updateParam('fabric', selectedFabric === fab ? 'all' : fab)}
                  className={`px-3 py-1.5 font-sans text-xs tracking-wider rounded-sm border ${
                    selectedFabric.toLowerCase() === fab.toLowerCase() ? 'bg-brand-teal text-white border-brand-teal font-semibold' : 'bg-white text-brand-navy/70 border-brand-powder'
                  }`}
                >
                  {fab === 'all' ? 'All Fabrics' : fab}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Price */}
          <div className="border-t border-brand-powder/50 pt-5">
            <h3 className="font-sans text-[10px] uppercase tracking-[0.2em] font-semibold text-brand-navy mb-3">Price Range</h3>
            <div className="flex flex-col gap-3">
              {[
                { id: 'all', label: 'All Prices' },
                { id: 'under-2000', label: 'Under ₹2000' },
                { id: '2000-5000', label: '₹2000 - ₹5000' },
                { id: 'above-5000', label: 'Above ₹5000' },
              ].map(pr => (
                <label key={pr.id} className="flex items-center gap-3 cursor-pointer">
                  <input type="radio" name="mobile_price" checked={priceRange === pr.id} onChange={() => setPriceRange(pr.id)} className="w-4 h-4 text-brand-teal border-brand-powder focus:ring-brand-teal" />
                  <span className={`font-sans text-xs tracking-wider ${priceRange === pr.id ? 'text-brand-teal font-medium' : 'text-brand-navy/70'}`}>{pr.label}</span>
                </label>
              ))}
            </div>
          </div>

        </div>

        <div className="p-5 border-t border-brand-powder/50 bg-brand-cream/30 flex gap-3">
          <button onClick={clearAllFilters} className="w-1/3 border border-slate-300 text-slate-700 py-3.5 font-sans text-[10px] uppercase tracking-[0.18em] font-bold rounded-sm">
            Reset
          </button>
          <button onClick={() => setFilterDrawerOpen(false)} className="w-2/3 bg-brand-teal text-white py-3.5 font-sans text-[10px] uppercase tracking-[0.18em] font-bold hover:bg-brand-tealDark transition-colors rounded-sm shadow-md">
            View {displayProducts.length} Items
          </button>
        </div>
      </div>

    </div>
  );
}

