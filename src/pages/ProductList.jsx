import React, { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { Filter, ChevronDown, X, SlidersHorizontal } from 'lucide-react';
import { products } from '../data/products';
import ProductCard from '../components/ProductCard';

const SORT_OPTIONS = [
  { id: 'recommended', label: 'Recommended' },
  { id: 'newest', label: 'Newest Arrivals' },
  { id: 'price-low', label: 'Price: Low to High' },
  { id: 'price-high', label: 'Price: High to Low' },
];

export default function ProductList() {
  const { categoryName } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('search');
  
  const [selectedCategory, setSelectedCategory] = useState(categoryName || 'all');
  const [sortOpen, setSortOpen] = useState(false);
  const [activeSort, setActiveSort] = useState('recommended');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // Filters State
  const [priceRange, setPriceRange] = useState('all');

  useEffect(() => {
    setSelectedCategory(categoryName || 'all');
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [categoryName]);

  // Derived Products List
  let displayProducts = [...products];

  // 1. Filter by Category
  if (selectedCategory !== 'all') {
    displayProducts = displayProducts.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase());
  }

  // 2. Filter by Search Query
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    displayProducts = displayProducts.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  }

  // 3. Filter by Price Range
  if (priceRange === 'under-2000') {
    displayProducts = displayProducts.filter(p => p.price < 2000);
  } else if (priceRange === '2000-5000') {
    displayProducts = displayProducts.filter(p => p.price >= 2000 && p.price <= 5000);
  } else if (priceRange === 'above-5000') {
    displayProducts = displayProducts.filter(p => p.price > 5000);
  }

  // 4. Sort
  if (activeSort === 'newest') {
    displayProducts.sort((a, b) => (b.isNew === a.isNew) ? 0 : b.isNew ? 1 : -1);
  } else if (activeSort === 'price-low') {
    displayProducts.sort((a, b) => a.price - b.price);
  } else if (activeSort === 'price-high') {
    displayProducts.sort((a, b) => b.price - a.price);
  }

  const categoriesList = ['all', 'sarees', 'kurtis', 'lehengas', 'dresses'];

  return (
    <div className="max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-10 xl:px-14 2xl:px-16 pt-6 sm:pt-8 pb-12 lg:pb-16">
      
      {/* Breadcrumbs */}
      <nav className="text-[10px] font-sans text-brand-navy/50 uppercase tracking-[0.2em] mb-4 flex items-center flex-wrap gap-2">
        <Link to="/" className="hover:text-brand-teal transition-colors">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-brand-teal transition-colors">Shop</Link>
        <span>/</span>
        {searchQuery ? (
          <span className="text-brand-navy font-semibold">Search Results</span>
        ) : (
          <span className="text-brand-navy font-semibold">
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
            className="lg:hidden flex items-center gap-2 border border-brand-powder px-4 py-2.5 rounded-sm text-brand-navy font-sans text-[10px] uppercase tracking-[0.2em] font-semibold hover:border-brand-teal hover:text-brand-teal transition-colors"
          >
            <SlidersHorizontal size={14} /> Filters
          </button>

          {/* Sort Dropdown */}
          <div className="relative z-20">
            <button 
              onClick={() => setSortOpen(!sortOpen)}
              className="flex items-center gap-2 border border-brand-powder px-5 py-2.5 rounded-sm text-brand-navy font-sans text-[10px] uppercase tracking-[0.2em] font-semibold hover:border-brand-teal hover:text-brand-teal transition-colors bg-white w-48 justify-between"
            >
              <span className="truncate">{SORT_OPTIONS.find(o => o.id === activeSort)?.label}</span>
              <ChevronDown size={14} className={`transition-transform duration-200 ${sortOpen ? 'rotate-180 text-brand-teal' : ''}`} />
            </button>
            
            {sortOpen && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-brand-powder/60 shadow-xl rounded-sm py-2 origin-top-right animate-in fade-in zoom-in-95">
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

      <div className="flex gap-10 items-start">
        
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 flex-shrink-0 sticky top-28">
          
          {/* Categories */}
          <div className="mb-8">
            <h3 className="font-sans text-[11px] uppercase tracking-[0.2em] font-semibold text-brand-navy border-b border-brand-powder/60 pb-3 mb-4">
              Categories
            </h3>
            <div className="flex flex-col gap-2.5">
              {categoriesList.map(cat => (
                <Link
                  key={cat}
                  to={cat === 'all' ? '/products' : `/category/${cat}`}
                  className={`font-sans text-xs tracking-wider capitalize transition-colors flex items-center gap-2 ${
                    selectedCategory.toLowerCase() === cat.toLowerCase()
                      ? 'text-brand-teal font-semibold'
                      : 'text-brand-navy/70 hover:text-brand-teal'
                  }`}
                >
                  <div className={`w-1.5 h-1.5 rounded-full transition-colors ${selectedCategory.toLowerCase() === cat.toLowerCase() ? 'bg-brand-teal' : 'bg-transparent'}`} />
                  {cat === 'all' ? 'All Products' : cat}
                </Link>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="mb-8">
            <h3 className="font-sans text-[11px] uppercase tracking-[0.2em] font-semibold text-brand-navy border-b border-brand-powder/60 pb-3 mb-4">
              Price
            </h3>
            <div className="flex flex-col gap-3">
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
                  <span className={`font-sans text-xs tracking-wider transition-colors ${priceRange === pr.id ? 'text-brand-teal font-medium' : 'text-brand-navy/70 group-hover:text-brand-teal'}`}>
                    {pr.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

        </aside>

        {/* Product Grid Container */}
        <div className="flex-1 w-full">
          {displayProducts.length === 0 ? (
            <div className="text-center py-24 bg-brand-cream/30 border border-brand-powder/40 rounded-sm">
              <Filter size={32} strokeWidth={1} className="mx-auto text-brand-navy/20 mb-4" />
              <p className="font-serif text-2xl text-brand-navy/60 mb-2">Nothing found here.</p>
              <p className="font-sans text-xs text-brand-navy/40 tracking-wider">Try adjusting your filters or browse another category.</p>
              <button onClick={() => { setPriceRange('all'); setSearchParams({}); }} className="mt-6 border border-brand-teal text-brand-teal px-6 py-2.5 font-sans text-[10px] uppercase tracking-widest font-semibold hover:bg-brand-teal hover:text-white transition-colors">
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 animate-in fade-in duration-500">
              {displayProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Mobile Filter Drawer */}
      <div className={`fixed inset-0 z-50 bg-brand-navy/60 backdrop-blur-sm lg:hidden transition-opacity duration-300 ${filterDrawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={() => setFilterDrawerOpen(false)} />
      <div className={`fixed top-0 right-0 bottom-0 z-50 w-80 bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out lg:hidden ${filterDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between p-5 border-b border-brand-powder/50">
          <span className="font-sans text-xs uppercase tracking-[0.2em] font-bold text-brand-navy">Filter & Sort</span>
          <button onClick={() => setFilterDrawerOpen(false)} className="p-2 text-brand-navy/50 hover:text-brand-navy bg-brand-powderLight rounded-full"><X size={18} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* Mobile Categories */}
          <div>
            <h3 className="font-sans text-[10px] uppercase tracking-[0.2em] font-semibold text-brand-navy mb-4">Categories</h3>
            <div className="flex flex-col gap-3">
              {categoriesList.map(cat => (
                <Link
                  key={cat}
                  to={cat === 'all' ? '/products' : `/category/${cat}`}
                  onClick={() => setFilterDrawerOpen(false)}
                  className={`font-sans text-xs tracking-wider capitalize ${selectedCategory.toLowerCase() === cat.toLowerCase() ? 'text-brand-teal font-semibold' : 'text-brand-navy/70'}`}
                >
                  {cat === 'all' ? 'All Products' : cat}
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile Price */}
          <div>
            <h3 className="font-sans text-[10px] uppercase tracking-[0.2em] font-semibold text-brand-navy mb-4">Price Range</h3>
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
        <div className="p-5 border-t border-brand-powder/50 bg-brand-cream/30">
          <button onClick={() => setFilterDrawerOpen(false)} className="w-full bg-brand-teal text-white py-4 font-sans text-[10px] uppercase tracking-[0.2em] font-semibold hover:bg-brand-tealDark transition-colors rounded-sm shadow-md">
            View {displayProducts.length} Results
          </button>
        </div>
      </div>

    </div>
  );
}
