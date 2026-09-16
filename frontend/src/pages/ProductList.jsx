import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Filter, X, SlidersHorizontal, Sparkles, Check } from 'lucide-react';
import { products } from '../data/products';
import ProductCard from '../components/ProductCard';
import { useFilterCatalog } from '../context/FilterContext';
import { useProducts } from '../context/ProductContext';
import { useCategories } from '../context/CategoryContext';

export default function ProductList() {
  const { filters } = useFilterCatalog();
  const { activeProducts } = useProducts();
  const { categories } = useCategories();
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Dynamic filter facet options from admin Filter Catalog & active products
  const SORT_OPTIONS = (filters.sortOptions || []).filter(o => o.active);
  const PRICE_RANGES = (filters.priceRanges || []).filter(p => p.active);
  const TAG_OPTIONS = [{ id: 'all', label: 'All Collection' }, ...(filters.highlights || []).filter(h => h.active)];
  const SIZE_OPTIONS = ['all', ...(filters.sizes || []).filter(s => s.active).map(s => s.name)];
  
  const COLOR_FILTER_OPTIONS = useMemo(() => {
    const list = [{ id: 'all', name: 'All Colors', hex: null }];
    const seenKeys = new Set();

    // 1. Existing active colors from Filter Catalog
    (filters.colors || []).filter(c => c.active).forEach(c => {
      const key = (c.name || '').toLowerCase().trim();
      if (key && !seenKeys.has(key)) {
        seenKeys.add(key);
        list.push(c);
      }
    });

    // 2. Discover any newly added colors from products
    (activeProducts || []).forEach(p => {
      if (p.colors && Array.isArray(p.colors)) {
        p.colors.forEach(c => {
          const cName = typeof c === 'string' ? c : (c.name || '');
          const cHex = typeof c === 'object' ? (c.hex || '#006B70') : '#006B70';
          const key = cName.toLowerCase().trim();
          if (key && !seenKeys.has(key)) {
            seenKeys.add(key);
            list.push({
              id: key.replace(/[^a-z0-9]+/g, '-'),
              name: cName,
              hex: cHex,
              active: true
            });
          }
        });
      }
    });

    return list;
  }, [filters.colors, activeProducts]);

  const FABRIC_OPTIONS = ['all', ...(filters.fabrics || []).filter(f => f.active).map(f => f.name)];
  const OCCASION_OPTIONS = ['all', ...(filters.occasions || []).filter(o => o.active).map(o => o.name)];
  const PATTERN_OPTIONS = ['all', ...(filters.crafts || []).filter(c => c.active).map(c => c.name)];
  
  const searchQuery = searchParams.get('search') || '';
  const fabricParam = searchParams.get('fabric') || 'all';
  const subParam = searchParams.get('sub') || 'all';
  const occasionParam = searchParams.get('occasion') || 'all';
  const colorParam = searchParams.get('color') || 'all';
  const sizeParam = searchParams.get('size') || 'all';
  const patternParam = searchParams.get('pattern') || 'all';
  const tagParam = searchParams.get('tag') || 'all';
  const categoryQuery = searchParams.get('category');
  const priceParam = searchParams.get('price') || 'all';

  const [selectedCategory, setSelectedCategory] = useState(categoryName || categoryQuery || 'all');
  const [selectedFabric, setSelectedFabric] = useState(fabricParam);
  const [selectedSub, setSelectedSub] = useState(subParam);
  const [selectedOccasion, setSelectedOccasion] = useState(occasionParam);
  const [selectedColor, setSelectedColor] = useState(colorParam);
  const [selectedSize, setSelectedSize] = useState(sizeParam);
  const [selectedPattern, setSelectedPattern] = useState(patternParam);
  const [selectedTag, setSelectedTag] = useState(tagParam);
  const [priceRange, setPriceRange] = useState(priceParam);

  const [activeSort, setActiveSort] = useState('recommended');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  useEffect(() => {
    setSelectedCategory(categoryName || searchParams.get('category') || 'all');
    setSelectedFabric(searchParams.get('fabric') || 'all');
    setSelectedSub(searchParams.get('sub') || 'all');
    setSelectedOccasion(searchParams.get('occasion') || 'all');
    setSelectedColor(searchParams.get('color') || 'all');
    setSelectedSize(searchParams.get('size') || 'all');
    setSelectedPattern(searchParams.get('pattern') || 'all');
    setSelectedTag(searchParams.get('tag') || 'all');
    setPriceRange(searchParams.get('price') || 'all');
  }, [categoryName, searchParams]);

  // Active Category Object for lookup & subcategories
  const activeCategoryObj = useMemo(() => {
    if (!selectedCategory || selectedCategory === 'all') return null;
    return (categories || []).find(c =>
      c.id.toLowerCase() === selectedCategory.toLowerCase() ||
      c.name.toLowerCase() === selectedCategory.toLowerCase() ||
      c.id.toLowerCase().replace(/[^a-z0-9]+/g, '-') === selectedCategory.toLowerCase()
    );
  }, [categories, selectedCategory]);

  const categoriesList = useMemo(() => {
    const list = [{ id: 'all', name: 'All Products' }];
    (categories || []).filter(c => c.active !== false).forEach(c => {
      list.push({ id: c.id, name: c.name, subcategories: c.subcategories || [] });
    });
    return list;
  }, [categories]);

  // Filter Pipeline
  let displayProducts = [...(activeProducts || [])];

  // 1. Category Filter
  if (selectedCategory && selectedCategory !== 'all') {
    if (selectedCategory.toLowerCase() === 'sale') {
      displayProducts = displayProducts.filter(p => p.mrp > p.price || p.oldPrice || p.discount);
    } else if (selectedCategory.toLowerCase() !== 'occasion') {
      const matchCatId = activeCategoryObj?.id?.toLowerCase() || selectedCategory.toLowerCase();
      const matchCatName = activeCategoryObj?.name?.toLowerCase() || selectedCategory.toLowerCase();
      displayProducts = displayProducts.filter(p => {
        const cat = (p.category || '').toLowerCase();
        return cat === matchCatId || cat === matchCatName || cat.replace(/[^a-z0-9]+/g, '-') === matchCatId;
      });
    }
  }

  // 2. Fabric Filter
  if (selectedFabric && selectedFabric !== 'all') {
    const f = selectedFabric.toLowerCase();
    displayProducts = displayProducts.filter(p => 
      (p.attributes?.fabric && p.attributes.fabric.toLowerCase().includes(f)) ||
      (p.fabric && p.fabric.toLowerCase().includes(f)) ||
      p.name.toLowerCase().includes(f) ||
      p.description?.toLowerCase().includes(f)
    );
  }

  // 3. Subcategory Filter
  if (selectedSub && selectedSub !== 'all') {
    const s = selectedSub.toLowerCase();
    displayProducts = displayProducts.filter(p => 
      (p.subcategory && p.subcategory.toLowerCase() === s) ||
      (p.subcategory && p.subcategory.toLowerCase().includes(s)) ||
      (p.name && p.name.toLowerCase().includes(s)) ||
      (p.description && p.description.toLowerCase().includes(s))
    );
  }

  // 4. Occasion Filter
  if (selectedOccasion && selectedOccasion !== 'all') {
    const o = selectedOccasion.toLowerCase();
    displayProducts = displayProducts.filter(p => 
      (p.attributes?.occasion && p.attributes.occasion.toLowerCase().includes(o)) ||
      (p.occasion && p.occasion.toLowerCase().includes(o)) ||
      p.name.toLowerCase().includes(o) ||
      p.description?.toLowerCase().includes(o)
    );
  }

  // 5. Color Filter
  if (selectedColor && selectedColor !== 'all') {
    const targetColorObj = COLOR_FILTER_OPTIONS.find(c => c.id === selectedColor);
    if (targetColorObj) {
      const targetHex = targetColorObj.hex ? targetColorObj.hex.toUpperCase() : null;
      const targetName = (targetColorObj.name || targetColorObj.id).toLowerCase();
      displayProducts = displayProducts.filter(p => {
        if (p.colors && p.colors.length > 0) {
          return p.colors.some(c => 
            (targetHex && c.hex?.toUpperCase() === targetHex) ||
            c.name?.toLowerCase().includes(targetName)
          );
        }
        return p.name.toLowerCase().includes(targetName) || p.description?.toLowerCase().includes(targetName);
      });
    }
  }

  // 6. Size Filter
  if (selectedSize && selectedSize !== 'all') {
    const sLow = selectedSize.toLowerCase();
    displayProducts = displayProducts.filter(p => {
      if (p.colors && p.colors.length > 0) {
        return p.colors.some(c => c.variants?.some(v => v.size?.toLowerCase() === sLow && v.stock > 0));
      }
      return p.sizes && p.sizes.some(s => s.toLowerCase() === sLow);
    });
  }

  // 7. Pattern / Work Type Filter
  if (selectedPattern && selectedPattern !== 'all') {
    const pat = selectedPattern.toLowerCase();
    displayProducts = displayProducts.filter(p =>
      p.name.toLowerCase().includes(pat) ||
      p.description.toLowerCase().includes(pat) ||
      (p.fabric && p.fabric.toLowerCase().includes(pat))
    );
  }

  // 8. Collection Highlights Tag Filter
  if (selectedTag && selectedTag !== 'all') {
    if (selectedTag === 'new') {
      displayProducts = displayProducts.filter(p => p.isNew);
    } else if (selectedTag === 'bestseller') {
      displayProducts = displayProducts.filter(p => p.isBestSeller);
    }
  }

  // 9. Smart Search Query
  if (searchQuery) {
    const rawQuery = searchQuery.toLowerCase().trim();
    const terms = rawQuery.split(/\s+/).filter(Boolean);
    
    displayProducts = displayProducts.filter(p => {
      const fullText = `${p.name} ${p.category} ${p.fabric || ''} ${p.occasion || ''} ${p.description}`.toLowerCase();
      return terms.every(t => fullText.includes(t)) || terms.some(t => t.length >= 3 && fullText.includes(t));
    });
  }

  // 10. Price Range
  if (priceRange && priceRange !== 'all') {
    const matchedRange = PRICE_RANGES.find(r => r.id === priceRange);
    if (matchedRange) {
      displayProducts = displayProducts.filter(p => p.price >= matchedRange.min && p.price <= matchedRange.max);
    } else if (priceRange === 'under-2000') {
      displayProducts = displayProducts.filter(p => p.price < 2000);
    } else if (priceRange === '2000-5000') {
      displayProducts = displayProducts.filter(p => p.price >= 2000 && p.price <= 5000);
    } else if (priceRange === 'above-5000') {
      displayProducts = displayProducts.filter(p => p.price > 5000);
    }
  }

  // 11. Sort
  if (activeSort === 'newest') {
    displayProducts.sort((a, b) => (b.isNew === a.isNew ? 0 : b.isNew ? 1 : -1));
  } else if (activeSort === 'price-low') {
    displayProducts.sort((a, b) => a.price - b.price);
  } else if (activeSort === 'price-high') {
    displayProducts.sort((a, b) => b.price - a.price);
  }

  const currentFabrics = FABRIC_OPTIONS;

  const updateParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === 'all' || value === false || value === '') {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    setSearchParams(newParams);
  };

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    const newParams = new URLSearchParams(searchParams);
    // Reset subcategory on main category change unless 'all'
    newParams.delete('sub');
    setSelectedSub('all');

    if (cat === 'all') {
      newParams.delete('category');
      if (categoryName) {
        navigate(`/products${newParams.toString() ? `?${newParams.toString()}` : ''}`);
      } else {
        setSearchParams(newParams);
      }
    } else {
      newParams.set('category', cat);
      if (categoryName) {
        navigate(`/category/${cat}${newParams.toString() ? `?${newParams.toString()}` : ''}`);
      } else {
        setSearchParams(newParams);
      }
    }
  };

  const clearAllFilters = () => {
    setSelectedCategory('all');
    setSelectedFabric('all');
    setSelectedSub('all');
    setSelectedOccasion('all');
    setSelectedColor('all');
    setSelectedSize('all');
    setSelectedPattern('all');
    setSelectedTag('all');
    setPriceRange('all');
    setActiveSort('recommended');
    if (categoryName) {
      navigate('/products');
    } else {
      setSearchParams({});
    }
  };

  const hasActiveFilters = 
    selectedCategory !== 'all' || 
    priceRange !== 'all' ||
    selectedTag !== 'all' || 
    selectedSize !== 'all' || 
    selectedColor !== 'all' || 
    selectedFabric !== 'all' || 
    selectedOccasion !== 'all' || 
    selectedPattern !== 'all' || 
    activeSort !== 'recommended' ||
    searchQuery;

  return (
    <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 pt-2 sm:pt-3 pb-12 lg:pb-16 text-left">
      
      {/* Mobile Top Controls Bar */}
      <div className="lg:hidden flex items-center justify-between pb-3 mb-3 border-b border-brand-powder/50">
        <span className="font-sans text-xs font-semibold text-brand-navy/80 uppercase tracking-wider">
          {searchQuery ? `Search: "${searchQuery}"` : (selectedCategory === 'all' ? 'All Collections' : selectedCategory)} ({displayProducts.length})
        </span>
        <button 
          onClick={() => setFilterDrawerOpen(true)}
          className="flex items-center gap-2 bg-brand-teal hover:bg-brand-tealDark text-white px-3.5 py-1.5 rounded-sm text-xs font-semibold tracking-wider uppercase shadow-xs transition-colors cursor-pointer"
        >
          <SlidersHorizontal size={13} /> Filters {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-amber-400" />}
        </button>
      </div>

      {/* Active Filter Badges Bar */}
      {hasActiveFilters && (
        <div className="mb-3 sm:mb-4 p-2.5 sm:p-3 bg-brand-cream/40 border border-brand-powder/60 rounded-sm">
          {/* Header Row: Count & Clear All */}
          <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-brand-powder/50">
            <span className="font-sans text-[10px] sm:text-[11px] tracking-[0.18em] font-bold uppercase text-brand-navy/70 flex items-center gap-1.5">
              Active Filters
            </span>
            <button
              type="button"
              onClick={clearAllFilters}
              className="text-[10px] sm:text-xs font-sans text-brand-teal hover:text-brand-tealDark hover:underline font-bold uppercase tracking-wider cursor-pointer"
            >
              Clear All
            </button>
          </div>

          {/* Badges Pills */}
          <div className="flex items-center flex-wrap gap-1.5 sm:gap-2">
            {selectedCategory !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-brand-powder text-brand-navy text-[10px] sm:text-xs rounded-full font-medium shadow-2xs">
                Category: <strong className="capitalize">{activeCategoryObj?.name || selectedCategory}</strong>
                <button type="button" onClick={() => updateParam('category', 'all')} className="hover:text-red-500 transition-colors p-0.5 cursor-pointer" aria-label="Remove category filter"><X size={11} strokeWidth={2} /></button>
              </span>
            )}

            {selectedSub !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-brand-powderLight border border-brand-teal/40 text-brand-teal text-[10px] sm:text-xs rounded-full font-medium shadow-2xs">
                Subcategory: <strong className="capitalize">{selectedSub}</strong>
                <button type="button" onClick={() => updateParam('sub', 'all')} className="hover:text-red-500 transition-colors p-0.5 cursor-pointer" aria-label="Remove subcategory filter"><X size={11} strokeWidth={2} /></button>
              </span>
            )}

            {activeSort !== 'recommended' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-brand-powderLight border border-brand-teal/30 text-brand-teal text-[10px] sm:text-xs rounded-full font-medium shadow-2xs">
                Sort: <strong>{SORT_OPTIONS.find(o => o.id === activeSort)?.label}</strong>
                <button type="button" onClick={() => setActiveSort('recommended')} className="hover:text-red-500 transition-colors p-0.5 cursor-pointer" aria-label="Remove sort filter"><X size={11} strokeWidth={2} /></button>
              </span>
            )}

            {priceRange !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-brand-powder text-brand-navy text-[10px] sm:text-xs rounded-full font-medium shadow-2xs">
                Price: <strong>{PRICE_RANGES.find(p => p.id === priceRange)?.label || priceRange}</strong>
                <button type="button" onClick={() => { setPriceRange('all'); updateParam('price', 'all'); }} className="hover:text-red-500 transition-colors p-0.5 cursor-pointer" aria-label="Remove price filter"><X size={11} strokeWidth={2} /></button>
              </span>
            )}

            {selectedTag !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-brand-powder text-brand-navy text-[10px] sm:text-xs rounded-full font-medium shadow-2xs">
                Highlights: <strong>{TAG_OPTIONS.find(t => t.id === selectedTag)?.label}</strong>
                <button type="button" onClick={() => updateParam('tag', 'all')} className="hover:text-red-500 transition-colors p-0.5 cursor-pointer" aria-label="Remove highlights filter"><X size={11} strokeWidth={2} /></button>
              </span>
            )}

            {selectedSize !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-brand-powder text-brand-navy text-[10px] sm:text-xs rounded-full font-medium shadow-2xs">
                Size: <strong>{selectedSize}</strong>
                <button type="button" onClick={() => updateParam('size', 'all')} className="hover:text-red-500 transition-colors p-0.5 cursor-pointer" aria-label="Remove size filter"><X size={11} strokeWidth={2} /></button>
              </span>
            )}

            {selectedColor !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-brand-powder text-brand-navy text-[10px] sm:text-xs rounded-full font-medium shadow-2xs">
                Color: <strong>{COLOR_FILTER_OPTIONS.find(c => c.id === selectedColor)?.name}</strong>
                <button type="button" onClick={() => updateParam('color', 'all')} className="hover:text-red-500 transition-colors p-0.5 cursor-pointer" aria-label="Remove color filter"><X size={11} strokeWidth={2} /></button>
              </span>
            )}

            {selectedFabric !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-brand-powder text-brand-navy text-[10px] sm:text-xs rounded-full font-medium shadow-2xs">
                Fabric: <strong>{selectedFabric}</strong>
                <button type="button" onClick={() => updateParam('fabric', 'all')} className="hover:text-red-500 transition-colors p-0.5 cursor-pointer" aria-label="Remove fabric filter"><X size={11} strokeWidth={2} /></button>
              </span>
            )}

            {selectedOccasion !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-brand-powder text-brand-navy text-[10px] sm:text-xs rounded-full font-medium shadow-2xs">
                Occasion: <strong>{selectedOccasion}</strong>
                <button type="button" onClick={() => updateParam('occasion', 'all')} className="hover:text-red-500 transition-colors p-0.5 cursor-pointer" aria-label="Remove occasion filter"><X size={11} strokeWidth={2} /></button>
              </span>
            )}

            {selectedPattern !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-brand-powder text-brand-navy text-[10px] sm:text-xs rounded-full font-medium shadow-2xs">
                Work / Craft: <strong>{selectedPattern}</strong>
                <button type="button" onClick={() => updateParam('pattern', 'all')} className="hover:text-red-500 transition-colors p-0.5 cursor-pointer" aria-label="Remove work filter"><X size={11} strokeWidth={2} /></button>
              </span>
            )}
          </div>
        </div>
      )}

      {/* Grid Layout Container */}
      <div className="flex gap-8 lg:gap-10 items-start">
        
        {/* Desktop Sidebar with Integrated Sort By & 8 Filter Categories */}
        <aside className="hidden lg:block w-64 xl:w-72 flex-shrink-0 sticky top-16 max-h-[calc(100vh-4.5rem)] overflow-y-auto pr-2 space-y-6 bg-white p-5 border border-brand-powder/50 rounded-sm shadow-2xs">
          
          {/* Section Header */}
          <div className="flex items-center justify-between border-b border-brand-powder/60 pb-3">
            <span className="font-sans text-xs uppercase tracking-[0.2em] font-bold text-brand-navy flex items-center gap-2">
              <SlidersHorizontal size={14} className="text-brand-teal" /> Filter Catalog
            </span>
            {hasActiveFilters && (
              <button onClick={clearAllFilters} className="font-sans text-[10px] uppercase font-bold text-brand-teal hover:underline cursor-pointer">
                Reset
              </button>
            )}
          </div>

          {/* Sort By Integrated into Filter Catalog */}
          <div className="border-b border-brand-powder/50 pb-5">
            <h3 className="font-sans text-[10px] uppercase tracking-[0.2em] font-semibold text-brand-navy mb-3">
              Sort By
            </h3>
            <div className="flex flex-col gap-2.5">
              {SORT_OPTIONS.map(opt => (
                <label key={opt.id} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="sidebar_sort"
                    checked={activeSort === opt.id}
                    onChange={() => setActiveSort(opt.id)}
                    className="w-3.5 h-3.5 text-brand-teal border-brand-powder focus:ring-brand-teal cursor-pointer"
                  />
                  <span className={`font-sans text-xs tracking-wider transition-colors ${activeSort === opt.id ? 'text-brand-teal font-semibold' : 'text-brand-navy/70 group-hover:text-brand-teal'}`}>
                    {opt.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* 1. Category */}
          <div>
            <h3 className="font-sans text-[10px] uppercase tracking-[0.2em] font-semibold text-brand-navy mb-3">
              Category
            </h3>
            <div className="flex flex-col gap-2">
              {categoriesList.map(cat => {
                const isSelected = selectedCategory.toLowerCase() === cat.id.toLowerCase() ||
                  (activeCategoryObj && activeCategoryObj.id.toLowerCase() === cat.id.toLowerCase());
                
                const catProductCount = cat.id === 'all'
                  ? (activeProducts || []).length
                  : (activeProducts || []).filter(p => {
                      const pc = (p.category || '').toLowerCase();
                      return pc === cat.id.toLowerCase() || pc === cat.name.toLowerCase() || pc.replace(/[^a-z0-9]+/g, '-') === cat.id.toLowerCase();
                    }).length;

                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleCategoryChange(cat.id)}
                    className={`w-full font-sans text-xs tracking-wider capitalize transition-colors flex items-center justify-between py-1 px-2 rounded-xs cursor-pointer text-left ${
                      isSelected
                        ? 'text-brand-teal font-bold bg-brand-powderLight'
                        : 'text-brand-navy/70 hover:text-brand-teal hover:bg-brand-powderLight/40'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="text-[10px] text-brand-navy/40 font-normal">
                      ({catProductCount})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Subcategories (if selected category has subcategories) */}
          {activeCategoryObj && activeCategoryObj.subcategories?.length > 0 && (
            <div className="border-t border-brand-powder/50 pt-4">
              <h3 className="font-sans text-[10px] uppercase tracking-[0.2em] font-semibold text-brand-navy mb-2.5">
                Subcategories
              </h3>
              <div className="flex flex-col gap-1.5">
                <button
                  type="button"
                  onClick={() => updateParam('sub', 'all')}
                  className={`w-full font-sans text-xs tracking-wider capitalize transition-colors flex items-center justify-between py-1 px-2 rounded-xs cursor-pointer text-left ${
                    selectedSub === 'all'
                      ? 'text-brand-teal font-bold bg-brand-powderLight'
                      : 'text-brand-navy/70 hover:text-brand-teal hover:bg-brand-powderLight/40'
                  }`}
                >
                  <span>All Subcategories</span>
                </button>
                {activeCategoryObj.subcategories.map(sub => {
                  const subCount = (activeProducts || []).filter(p => {
                    const pc = (p.category || '').toLowerCase();
                    const matchCat = pc === activeCategoryObj.id.toLowerCase() || pc === activeCategoryObj.name.toLowerCase() || pc.replace(/[^a-z0-9]+/g, '-') === activeCategoryObj.id.toLowerCase();
                    const matchSub = (p.subcategory || '').toLowerCase() === sub.toLowerCase() || (p.name || '').toLowerCase().includes(sub.toLowerCase());
                    return matchCat && matchSub;
                  }).length;

                  return (
                    <button
                      key={sub}
                      type="button"
                      onClick={() => updateParam('sub', sub)}
                      className={`w-full font-sans text-xs tracking-wider capitalize transition-colors flex items-center justify-between py-1 px-2 rounded-xs cursor-pointer text-left ${
                        selectedSub.toLowerCase() === sub.toLowerCase()
                          ? 'text-brand-teal font-bold bg-brand-powderLight'
                          : 'text-brand-navy/70 hover:text-brand-teal hover:bg-brand-powderLight/40'
                      }`}
                    >
                      <span>{sub}</span>
                      <span className="text-[10px] text-brand-navy/40 font-normal">
                        ({subCount})
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 2. Price */}
          <div className="border-t border-brand-powder/50 pt-5">
            <h3 className="font-sans text-[10px] uppercase tracking-[0.2em] font-semibold text-brand-navy mb-3">
              Price
            </h3>
            <div className="flex flex-col gap-2.5">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="radio" 
                  name="price" 
                  checked={priceRange === 'all'} 
                  onChange={() => { setPriceRange('all'); updateParam('price', 'all'); }}
                  className="w-3.5 h-3.5 text-brand-teal border-brand-powder focus:ring-brand-teal cursor-pointer"
                />
                <span className={`font-sans text-xs tracking-wider transition-colors ${priceRange === 'all' ? 'text-brand-teal font-semibold' : 'text-brand-navy/70 group-hover:text-brand-teal'}`}>
                  All Prices
                </span>
              </label>
              {PRICE_RANGES.map(pr => (
                <label key={pr.id} className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="radio" 
                    name="price" 
                    checked={priceRange === pr.id} 
                    onChange={() => { setPriceRange(pr.id); updateParam('price', pr.id); }}
                    className="w-3.5 h-3.5 text-brand-teal border-brand-powder focus:ring-brand-teal cursor-pointer"
                  />
                  <span className={`font-sans text-xs tracking-wider transition-colors ${priceRange === pr.id ? 'text-brand-teal font-semibold' : 'text-brand-navy/70 group-hover:text-brand-teal'}`}>
                    {pr.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* 3. Highlights */}
          <div className="border-t border-brand-powder/50 pt-5">
            <h3 className="font-sans text-[10px] uppercase tracking-[0.2em] font-semibold text-brand-navy mb-3 flex items-center gap-1.5">
              <Sparkles size={13} className="text-amber-500" /> Highlights
            </h3>
            <div className="flex flex-col gap-2">
              {TAG_OPTIONS.map(tg => (
                <button
                  key={tg.id}
                  onClick={() => updateParam('tag', selectedTag === tg.id ? 'all' : tg.id)}
                  className={`w-full text-left px-3 py-1.5 font-sans text-xs rounded-sm border transition-all flex items-center justify-between cursor-pointer ${
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

          {/* 4. Size */}
          <div className="border-t border-brand-powder/50 pt-5">
            <h3 className="font-sans text-[10px] uppercase tracking-[0.2em] font-semibold text-brand-navy mb-3">
              Size
            </h3>
            <div className="flex flex-wrap gap-2">
              {SIZE_OPTIONS.map(sz => (
                <button
                  key={sz}
                  onClick={() => updateParam('size', selectedSize === sz ? 'all' : sz)}
                  className={`px-3 py-1 font-sans text-xs tracking-wider rounded-sm border transition-all cursor-pointer ${
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

          {/* 5. Color */}
          <div className="border-t border-brand-powder/50 pt-5">
            <h3 className="font-sans text-[10px] uppercase tracking-[0.2em] font-semibold text-brand-navy mb-3 flex items-center justify-between">
              <span>Color</span>
              {selectedColor !== 'all' && <span className="text-[10px] text-brand-teal font-bold capitalize">{selectedColor}</span>}
            </h3>
            <div className="grid grid-cols-5 gap-2.5">
              {COLOR_FILTER_OPTIONS.map(c => {
                if (c.id === 'all') return null;
                const isWhite = c.hex ? c.hex.toUpperCase() === '#FFFFFF' : false;
                const isSelected = selectedColor === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => updateParam('color', isSelected ? 'all' : c.id)}
                    title={c.name}
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                      isSelected ? 'ring-2 ring-brand-teal ring-offset-2 scale-110 shadow-md' : 'ring-1 ring-slate-300 hover:ring-brand-teal hover:scale-105'
                    }`}
                  >
                    <span
                      className={`w-8 h-8 rounded-full shadow-2xs flex items-center justify-center ${
                        isWhite ? 'border-2 border-slate-300 bg-white' : 'border border-black/10'
                      }`}
                      style={{ backgroundColor: c.hex || '#006B70' }}
                    >
                      {isSelected && <Check size={12} className={isWhite ? 'text-black' : 'text-white'} strokeWidth={3} />}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 6. Fabric */}
          <div className="border-t border-brand-powder/50 pt-5">
            <h3 className="font-sans text-[10px] uppercase tracking-[0.2em] font-semibold text-brand-navy mb-3">
              Fabric
            </h3>
            <div className="flex flex-wrap gap-2">
              {currentFabrics.map(fab => (
                <button
                  key={fab}
                  onClick={() => updateParam('fabric', selectedFabric === fab ? 'all' : fab)}
                  className={`px-3 py-1 font-sans text-[11px] tracking-wider rounded-sm border transition-all cursor-pointer ${
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

          {/* 7. Occasion */}
          <div className="border-t border-brand-powder/50 pt-5">
            <h3 className="font-sans text-[10px] uppercase tracking-[0.2em] font-semibold text-brand-navy mb-3">
              Occasion
            </h3>
            <div className="flex flex-wrap gap-2">
              {OCCASION_OPTIONS.map(occ => (
                <button
                  key={occ}
                  onClick={() => updateParam('occasion', selectedOccasion === occ ? 'all' : occ)}
                  className={`px-2.5 py-1 font-sans text-[11px] tracking-wider rounded-sm border transition-all cursor-pointer ${
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

          {/* 8. Work / Craft */}
          <div className="border-t border-brand-powder/50 pt-5">
            <h3 className="font-sans text-[10px] uppercase tracking-[0.2em] font-semibold text-brand-navy mb-3">
              Work / Craft
            </h3>
            <div className="flex flex-wrap gap-2">
              {PATTERN_OPTIONS.map(pat => (
                <button
                  key={pat}
                  onClick={() => updateParam('pattern', selectedPattern === pat ? 'all' : pat)}
                  className={`px-3 py-1 font-sans text-[11px] tracking-wider rounded-sm border transition-all cursor-pointer ${
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

        </aside>

        {/* Main Product Grid Container */}
        <div className="flex-1 w-full">
          {displayProducts.length === 0 ? (
            <div className="text-center py-20 bg-brand-cream/30 border border-brand-powder/40 rounded-sm">
              <Filter size={32} strokeWidth={1} className="mx-auto text-brand-navy/20 mb-4" />
              <p className="font-serif text-2xl text-brand-navy/70 mb-2">Nothing found matching your active filters.</p>
              <p className="font-sans text-xs text-brand-navy/50 tracking-wider mb-6">Try broadening your color, fabric, or price selection.</p>
              <button 
                onClick={clearAllFilters}
                className="border border-brand-teal bg-brand-teal text-white px-7 py-3 font-sans text-[10px] uppercase tracking-widest font-bold hover:bg-brand-tealDark transition-colors rounded-sm shadow-sm cursor-pointer"
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
          
          {/* Mobile Sort By */}
          <div>
            <h3 className="font-sans text-[10px] uppercase tracking-[0.2em] font-semibold text-brand-navy mb-3">Sort By</h3>
            <div className="flex flex-col gap-2.5">
              {SORT_OPTIONS.map(opt => (
                <label key={opt.id} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="mobile_sort"
                    checked={activeSort === opt.id}
                    onChange={() => setActiveSort(opt.id)}
                    className="w-4 h-4 text-brand-teal border-brand-powder focus:ring-brand-teal cursor-pointer"
                  />
                  <span className={`font-sans text-xs tracking-wider ${activeSort === opt.id ? 'text-brand-teal font-semibold' : 'text-brand-navy/70'}`}>
                    {opt.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* 1. Mobile Category */}
          <div className="border-t border-brand-powder/50 pt-5">
            <h3 className="font-sans text-[10px] uppercase tracking-[0.2em] font-semibold text-brand-navy mb-3">Category</h3>
            <div className="flex flex-col gap-2">
              {categoriesList.map(cat => {
                const isSelected = selectedCategory.toLowerCase() === cat.id.toLowerCase() ||
                  (activeCategoryObj && activeCategoryObj.id.toLowerCase() === cat.id.toLowerCase());

                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      handleCategoryChange(cat.id);
                      setFilterDrawerOpen(false);
                    }}
                    className={`w-full font-sans text-xs tracking-wider capitalize text-left cursor-pointer py-1 ${isSelected ? 'text-brand-teal font-bold' : 'text-brand-navy/70'}`}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mobile Subcategories */}
          {activeCategoryObj && activeCategoryObj.subcategories?.length > 0 && (
            <div className="border-t border-brand-powder/50 pt-4">
              <h3 className="font-sans text-[10px] uppercase tracking-[0.2em] font-semibold text-brand-navy mb-2.5">Subcategories</h3>
              <div className="flex flex-col gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    updateParam('sub', 'all');
                    setFilterDrawerOpen(false);
                  }}
                  className={`w-full font-sans text-xs tracking-wider capitalize text-left cursor-pointer py-1 ${selectedSub === 'all' ? 'text-brand-teal font-bold' : 'text-brand-navy/70'}`}
                >
                  All Subcategories
                </button>
                {activeCategoryObj.subcategories.map(sub => (
                  <button
                    key={sub}
                    type="button"
                    onClick={() => {
                      updateParam('sub', sub);
                      setFilterDrawerOpen(false);
                    }}
                    className={`w-full font-sans text-xs tracking-wider capitalize text-left cursor-pointer py-1 ${selectedSub.toLowerCase() === sub.toLowerCase() ? 'text-brand-teal font-bold' : 'text-brand-navy/70'}`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 2. Mobile Price */}
          <div className="border-t border-brand-powder/50 pt-5">
            <h3 className="font-sans text-[10px] uppercase tracking-[0.2em] font-semibold text-brand-navy mb-3">Price</h3>
            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="radio" 
                  name="mobile_price" 
                  checked={priceRange === 'all'} 
                  onChange={() => { setPriceRange('all'); updateParam('price', 'all'); }} 
                  className="w-4 h-4 text-brand-teal border-brand-powder focus:ring-brand-teal cursor-pointer" 
                />
                <span className={`font-sans text-xs tracking-wider ${priceRange === 'all' ? 'text-brand-teal font-medium' : 'text-brand-navy/70'}`}>All Prices</span>
              </label>
              {PRICE_RANGES.map(pr => (
                <label key={pr.id} className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="radio" 
                    name="mobile_price" 
                    checked={priceRange === pr.id} 
                    onChange={() => { setPriceRange(pr.id); updateParam('price', pr.id); }} 
                    className="w-4 h-4 text-brand-teal border-brand-powder focus:ring-brand-teal cursor-pointer" 
                  />
                  <span className={`font-sans text-xs tracking-wider ${priceRange === pr.id ? 'text-brand-teal font-medium' : 'text-brand-navy/70'}`}>{pr.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 3. Mobile Highlights */}
          <div className="border-t border-brand-powder/50 pt-5">
            <h3 className="font-sans text-[10px] uppercase tracking-[0.2em] font-semibold text-brand-navy mb-3">Highlights</h3>
            <div className="flex flex-col gap-2">
              {TAG_OPTIONS.map(tg => (
                <button
                  key={tg.id}
                  onClick={() => updateParam('tag', selectedTag === tg.id ? 'all' : tg.id)}
                  className={`w-full text-left px-3 py-1.5 font-sans text-xs rounded-sm border cursor-pointer ${selectedTag === tg.id ? 'bg-amber-500 text-white border-amber-500 font-semibold' : 'bg-white text-brand-navy/75 border-brand-powder'}`}
                >
                  {tg.label}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Mobile Size */}
          <div className="border-t border-brand-powder/50 pt-5">
            <h3 className="font-sans text-[10px] uppercase tracking-[0.2em] font-semibold text-brand-navy mb-3">Size</h3>
            <div className="flex flex-wrap gap-2">
              {SIZE_OPTIONS.map(sz => (
                <button
                  key={sz}
                  onClick={() => updateParam('size', selectedSize === sz ? 'all' : sz)}
                  className={`px-3 py-1 font-sans text-xs tracking-wider rounded-sm border cursor-pointer ${
                    selectedSize === sz ? 'bg-brand-navy text-white border-brand-navy font-semibold' : 'bg-white text-brand-navy/70 border-brand-powder'
                  }`}
                >
                  {sz === 'all' ? 'All' : sz}
                </button>
              ))}
            </div>
          </div>

          {/* 5. Mobile Color */}
          <div className="border-t border-brand-powder/50 pt-5">
            <h3 className="font-sans text-[10px] uppercase tracking-[0.2em] font-semibold text-brand-navy mb-3">Color</h3>
            <div className="grid grid-cols-5 gap-2.5">
              {COLOR_FILTER_OPTIONS.map(c => {
                if (c.id === 'all') return null;
                const isWhite = c.hex ? c.hex.toUpperCase() === '#FFFFFF' : false;
                const isSelected = selectedColor === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => updateParam('color', isSelected ? 'all' : c.id)}
                    title={c.name}
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                      isSelected ? 'ring-2 ring-brand-teal ring-offset-2 scale-110 shadow-md' : 'ring-1 ring-slate-300'
                    }`}
                  >
                    <span
                      className={`w-8 h-8 rounded-full shadow-2xs flex items-center justify-center ${
                        isWhite ? 'border-2 border-slate-300 bg-white' : 'border border-black/10'
                      }`}
                      style={{ backgroundColor: c.hex || '#006B70' }}
                    >
                      {isSelected && <Check size={12} className={isWhite ? 'text-black' : 'text-white'} strokeWidth={3} />}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 6. Mobile Fabric */}
          <div className="border-t border-brand-powder/50 pt-5">
            <h3 className="font-sans text-[10px] uppercase tracking-[0.2em] font-semibold text-brand-navy mb-3">Fabric</h3>
            <div className="flex flex-wrap gap-2">
              {currentFabrics.map(fab => (
                <button
                  key={fab}
                  onClick={() => updateParam('fabric', selectedFabric === fab ? 'all' : fab)}
                  className={`px-3 py-1.5 font-sans text-xs tracking-wider rounded-sm border cursor-pointer ${
                    selectedFabric.toLowerCase() === fab.toLowerCase() ? 'bg-brand-teal text-white border-brand-teal font-semibold' : 'bg-white text-brand-navy/70 border-brand-powder'
                  }`}
                >
                  {fab === 'all' ? 'All Fabrics' : fab}
                </button>
              ))}
            </div>
          </div>

          {/* 7. Mobile Occasion */}
          <div className="border-t border-brand-powder/50 pt-5">
            <h3 className="font-sans text-[10px] uppercase tracking-[0.2em] font-semibold text-brand-navy mb-3">Occasion</h3>
            <div className="flex flex-wrap gap-2">
              {OCCASION_OPTIONS.map(occ => (
                <button
                  key={occ}
                  onClick={() => updateParam('occasion', selectedOccasion === occ ? 'all' : occ)}
                  className={`px-2.5 py-1 font-sans text-xs tracking-wider rounded-sm border cursor-pointer ${
                    selectedOccasion.toLowerCase() === occ.toLowerCase() ? 'bg-brand-teal text-white border-brand-teal font-semibold' : 'bg-white text-brand-navy/70 border-brand-powder'
                  }`}
                >
                  {occ === 'all' ? 'All' : occ}
                </button>
              ))}
            </div>
          </div>

          {/* 8. Mobile Work / Craft */}
          <div className="border-t border-brand-powder/50 pt-5">
            <h3 className="font-sans text-[10px] uppercase tracking-[0.2em] font-semibold text-brand-navy mb-3">Work / Craft</h3>
            <div className="flex flex-wrap gap-2">
              {PATTERN_OPTIONS.map(pat => (
                <button
                  key={pat}
                  onClick={() => updateParam('pattern', selectedPattern === pat ? 'all' : pat)}
                  className={`px-3 py-1 font-sans text-xs tracking-wider rounded-sm border cursor-pointer ${selectedPattern.toLowerCase() === pat.toLowerCase() ? 'bg-brand-navy text-white border-brand-navy font-semibold' : 'bg-white text-brand-navy/70 border-brand-powder'}`}
                >
                  {pat === 'all' ? 'All Work' : pat}
                </button>
              ))}
            </div>
          </div>

        </div>

        <div className="p-5 border-t border-brand-powder/50 bg-brand-cream/30 flex gap-3">
          <button onClick={clearAllFilters} className="w-1/3 border border-slate-300 text-slate-700 py-3.5 font-sans text-[10px] uppercase tracking-[0.18em] font-bold rounded-sm cursor-pointer">
            Reset
          </button>
          <button onClick={() => setFilterDrawerOpen(false)} className="w-2/3 bg-brand-teal text-white py-3.5 font-sans text-[10px] uppercase tracking-[0.18em] font-bold hover:bg-brand-tealDark transition-colors rounded-sm shadow-md cursor-pointer">
            View {displayProducts.length} Items
          </button>
        </div>
      </div>

    </div>
  );
}
