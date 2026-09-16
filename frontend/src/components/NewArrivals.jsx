import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';
import { useProducts } from '../context/ProductContext';
import { useReveal } from '../hooks/useReveal';
import { useContent } from '../context/ContentContext';

export default function NewArrivals() {
  const sectionRef = useReveal();
  const { activeProducts, products } = useProducts();
  const { getSectionContent } = useContent();
  const content = getSectionContent('new-arrivals');

  const eyebrow = content?.eyebrow || 'Fresh Drops';
  const title = content?.title || 'New Arrivals';
  const viewAllText = content?.viewAllText || 'View All';
  const viewAllLink = content?.viewAllLink || '/products?sort=newest';
  const maxItems = content?.maxItems || 12;

  const scrollContainerRef = useRef(null);
  
  // Ensure we provide plenty of items so the slider is always scrollable
  const displayItems = React.useMemo(() => {
    const list = (activeProducts && activeProducts.length > 0) ? activeProducts : (products || []);

    if (content?.dataMode === 'Manual' && content?.selectedProductIds && content.selectedProductIds.length > 0) {
      const manualItems = content.selectedProductIds
        .map(id => list.find(p => p.id === id || p.slug === id))
        .filter(Boolean);
      if (manualItems.length > 0) return manualItems.slice(0, maxItems);
    }

    if (content?.customItems && content.customItems.length > 0) {
      const activeCustom = content.customItems.filter(item => item.active !== false);
      const mapped = activeCustom.map(item => {
        const found = list.find(p => p.id === item.productId || p.slug === item.productId || p.id === item.id);
        if (found) return found;
        return {
          id: item.id || item.productId,
          name: item.name,
          category: item.category,
          price: item.price,
          mrp: Math.round((item.price || 4999) * 1.4),
          colors: [{ id: 'c1', name: 'Default', hex: '#000', images: [{ url: item.image, isPrimary: true }] }],
          rating: 4.8,
          isNew: true,
        };
      });
      if (mapped.length > 0) return mapped.slice(0, maxItems);
    }

    const newItems = list.filter((p) => p.isNew);
    const otherItems = list.filter((p) => !p.isNew);
    const combined = [...newItems, ...otherItems];
    return combined.slice(0, maxItems);
  }, [activeProducts, products, maxItems, content?.customItems, content?.dataMode, content?.selectedProductIds]);

  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  // Check scroll position to update arrow states
  const checkScroll = useCallback(() => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setShowLeftArrow(scrollLeft > 10);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 15);
  }, []);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (el) {
      checkScroll();
      el.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
      return () => {
        el.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, [checkScroll, displayItems]);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const cardWidth = container.firstElementChild?.clientWidth || 300;
      const scrollAmount = cardWidth * 1.5;
      
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
      setTimeout(checkScroll, 400);
    }
  };

  return (
    <section ref={sectionRef} className="pt-2 pb-1.5 sm:pt-4 sm:pb-3 lg:pt-5 lg:pb-3.5 bg-white border-b border-brand-powder/30 relative overflow-hidden group/section">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-10 xl:px-14 2xl:px-16">

        {/* Header row */}
        <div className="flex justify-between items-end mb-2.5 sm:mb-3 pb-1.5 border-b border-brand-powder/40">
          <div>
            <p className="font-sans text-[9.5px] sm:text-[10px] tracking-[0.28em] text-brand-teal uppercase font-semibold mb-1 sm:mb-1.5">
              {eyebrow}
            </p>
            <h2 className="font-serif text-xl sm:text-3xl lg:text-4xl font-light text-brand-navy tracking-wider uppercase">
              {title}
            </h2>
            <div className="section-divider-left mt-1.5 sm:mt-2" />
          </div>

          <div className="flex items-center">
            <Link
              to={viewAllLink}
              className="flex items-center gap-1 sm:gap-2 font-sans text-[9.5px] sm:text-[11px] tracking-[0.16em] sm:tracking-[0.18em] uppercase text-brand-teal hover:text-brand-tealDark font-bold transition-colors duration-200 group whitespace-nowrap"
            >
              <span>{viewAllText}</span>
              <ArrowRight size={13} strokeWidth={2} className="transform transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Product Slider Container with Side Floating Arrows */}
        <div className="relative">
          {/* Side Floating Left Arrow */}
          <button
            type="button"
            onClick={() => scroll('left')}
            aria-label="Previous products"
            className={`hidden md:flex absolute -left-3 lg:-left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/95 backdrop-blur-md border border-brand-powder shadow-lg text-brand-navy hover:bg-brand-teal hover:text-white hover:scale-105 items-center justify-center transition-all cursor-pointer ${
              showLeftArrow ? 'opacity-90 hover:opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <ChevronLeft size={20} strokeWidth={2.5} />
          </button>

          {/* Side Floating Right Arrow */}
          <button
            type="button"
            onClick={() => scroll('right')}
            aria-label="Next products"
            className={`hidden md:flex absolute -right-3 lg:-right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/95 backdrop-blur-md border border-brand-powder shadow-lg text-brand-navy hover:bg-brand-teal hover:text-white hover:scale-105 items-center justify-center transition-all cursor-pointer ${
              showRightArrow ? 'opacity-90 hover:opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <ChevronRight size={20} strokeWidth={2.5} />
          </button>

          {/* Scrollable Track */}
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto gap-3.5 sm:gap-6 lg:gap-7 pb-3 -mx-4 px-4 sm:mx-0 sm:px-0 no-scrollbar snap-x snap-mandatory scroll-smooth"
          >
            {displayItems.map((product) => (
              <div
                key={product.id}
                className="flex-none w-[240px] sm:w-[280px] lg:w-[calc(25%-1.3rem)] snap-start"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
