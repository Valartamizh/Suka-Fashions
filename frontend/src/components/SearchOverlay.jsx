import React, { useState, useEffect, useRef } from 'react';
import { X, Search as SearchIcon, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const trendingSearches = [
  'Silk Sarees', 'Wedding Lehenga', 'Kurti Sets', 'Organza', 'Anarkali'
];

const recommendedCategories = [
  { name: 'New Arrivals', path: '/products', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=200&auto=format&fit=crop' },
  { name: 'Sarees', path: '/category/sarees', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=200&auto=format&fit=crop' },
  { name: 'Wedding', path: '/category/occasion', image: 'https://images.unsplash.com/photo-1596783074918-c84cb06531ca?q=80&w=200&auto=format&fit=crop' },
];

export default function SearchOverlay({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Slight delay to allow animation to finish before focusing
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = '';
      setQuery('');
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onClose();
      navigate(`/products?search=${encodeURIComponent(query)}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-white/95 backdrop-blur-md transition-all duration-300 animate-in fade-in zoom-in-95">
      
      {/* Top Bar */}
      <div className="w-full flex items-center justify-between px-6 py-6 lg:px-12 border-b border-brand-powder/50 bg-white">
        <span className="font-sans text-[10px] tracking-[0.2em] font-semibold text-brand-teal uppercase hidden sm:block">
          What are you looking for?
        </span>
        <button onClick={onClose} className="p-2 ml-auto text-brand-navy hover:text-brand-teal transition-colors rounded-full hover:bg-brand-powder/50">
          <X size={24} strokeWidth={1.5} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-12 lg:py-20">
          
          {/* Search Input Form */}
          <form onSubmit={handleSubmit} className="relative mb-16">
            <SearchIcon size={28} strokeWidth={1.5} className="absolute left-0 top-1/2 -translate-y-1/2 text-brand-navy/30" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for products, categories..."
              className="w-full bg-transparent border-b-2 border-brand-navy/15 focus:border-brand-teal py-4 pl-12 pr-12 text-2xl sm:text-4xl font-serif text-brand-navy placeholder:text-brand-navy/20 focus:outline-none transition-colors"
            />
            {query && (
              <button 
                type="button" 
                onClick={() => setQuery('')}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-brand-navy/40 hover:text-brand-navy p-2"
              >
                <X size={20} />
              </button>
            )}
          </form>

          {/* Search Suggestions Area */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
            
            {/* Trending */}
            <div className="fade-in-up" style={{ animationDelay: '0.1s' }}>
              <h3 className="font-sans text-[11px] tracking-[0.15em] uppercase font-semibold text-brand-navy/50 mb-6">
                Trending Searches
              </h3>
              <div className="flex flex-wrap gap-3">
                {trendingSearches.map(term => (
                  <button
                    key={term}
                    onClick={() => { setQuery(term); inputRef.current?.focus(); }}
                    className="font-sans text-xs sm:text-sm text-brand-navy border border-brand-powder hover:border-brand-teal hover:bg-brand-powderLight px-4 py-2.5 rounded-sm transition-all"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>

            {/* Recommended Categories */}
            <div className="fade-in-up" style={{ animationDelay: '0.2s' }}>
              <h3 className="font-sans text-[11px] tracking-[0.15em] uppercase font-semibold text-brand-navy/50 mb-6">
                Recommended
              </h3>
              <div className="space-y-4">
                {recommendedCategories.map(cat => (
                  <Link
                    key={cat.name}
                    to={cat.path}
                    onClick={onClose}
                    className="group flex items-center gap-4 p-2 -ml-2 rounded-sm hover:bg-brand-powderLight transition-colors"
                  >
                    <img src={cat.image} alt={cat.name} className="w-12 h-12 object-cover rounded-sm border border-brand-powder/50" />
                    <span className="font-sans text-sm font-medium text-brand-navy group-hover:text-brand-teal transition-colors">
                      {cat.name}
                    </span>
                    <ArrowRight size={14} className="ml-auto text-brand-navy/0 group-hover:text-brand-teal transform -translate-x-4 group-hover:translate-x-0 transition-all" />
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
