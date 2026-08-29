import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';
import { products } from '../data/products';
import { useReveal } from '../hooks/useReveal';

export default function BestSellers() {
  const sectionRef = useReveal();
  const scrollContainerRef = useRef(null);
  const bestSellers = products.filter(p => p.isBestSeller).slice(0, 8); // Take top 8

  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  // Check scroll position to show/hide arrows
  const checkScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10); // 10px buffer
  };

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (el) {
      checkScroll();
      el.addEventListener('scroll', checkScroll);
      return () => el.removeEventListener('scroll', checkScroll);
    }
  }, []);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.75;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (bestSellers.length === 0) return null;

  return (
    <section ref={sectionRef} className="pt-3 pb-2 sm:pt-5 sm:pb-5 lg:py-8 bg-brand-cream/30 border-b border-brand-powder/30 relative overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-10 xl:px-14 2xl:px-16">

        {/* Header row */}
        <div className="flex justify-between items-end mb-3 sm:mb-4 pb-2 border-b border-brand-powder/40 reveal">
          <div>
            <p className="font-sans text-[9.5px] sm:text-[10px] tracking-[0.28em] text-brand-teal uppercase font-semibold mb-1 sm:mb-1.5">
              Loved by our customers
            </p>
            <h2 className="font-serif text-xl sm:text-3xl lg:text-4xl font-light text-brand-navy tracking-wider uppercase">
              Best Sellers
            </h2>
            <div className="section-divider-left mt-1.5 sm:mt-2" />
          </div>
          
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              to="/products?sort=best-selling"
              className="flex items-center gap-1 sm:gap-2 font-sans text-[9.5px] sm:text-[11px] tracking-[0.16em] sm:tracking-[0.18em] uppercase text-brand-teal hover:text-brand-tealDark font-bold transition-colors duration-200 group sm:mr-4 whitespace-nowrap"
            >
              <span>View More</span>
              <ArrowRight size={13} strokeWidth={2} className="transform transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
            
            {/* Custom Navigation Arrows */}
            <div className="hidden sm:flex gap-2">
              <button 
                onClick={() => scroll('left')}
                disabled={!showLeftArrow}
                className={`p-2 border rounded-sm transition-all duration-300 ${showLeftArrow ? 'border-brand-navy/20 text-brand-navy hover:bg-brand-navy hover:text-white' : 'border-brand-powder text-brand-powder/50 cursor-not-allowed'}`}
                aria-label="Scroll left"
              >
                <ChevronLeft size={18} strokeWidth={1.5} />
              </button>
              <button 
                onClick={() => scroll('right')}
                disabled={!showRightArrow}
                className={`p-2 border rounded-sm transition-all duration-300 ${showRightArrow ? 'border-brand-navy/20 text-brand-navy hover:bg-brand-navy hover:text-white' : 'border-brand-powder text-brand-powder/50 cursor-not-allowed'}`}
                aria-label="Scroll right"
              >
                <ChevronRight size={18} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>

        {/* Product Slider */}
        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto gap-3.5 sm:gap-6 lg:gap-7 pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 no-scrollbar snap-x snap-mandatory"
        >
          {bestSellers.map((product, idx) => (
            <div 
              key={product.id} 
              className={`reveal reveal-delay-${Math.min(idx + 1, 5)} flex-none w-[240px] sm:w-[280px] lg:w-[calc(25%-1.3rem)] snap-start`}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
