import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useReveal } from '../hooks/useReveal';
import { useCategories } from '../context/CategoryContext';
import { useContent } from '../context/ContentContext';

export default function CategorySection() {
  const sectionRef = useReveal();
  const { homepageCategories } = useCategories();
  const { getSectionContent } = useContent();
  const content = getSectionContent('categories');

  const eyebrow = content?.eyebrow || 'Collections';
  const title = content?.title || 'Shop By Category';

  const displayList = (content?.tiles && content.tiles.length > 0)
    ? content.tiles.filter(t => t.active !== false && t.enabled !== false)
    : homepageCategories.filter(c => c.id !== 'sale');

  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 6);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 6);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      checkScroll();
      el.addEventListener('scroll', checkScroll, { passive: true });
      window.addEventListener('resize', checkScroll);
      return () => {
        el.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, [checkScroll, displayList]);

  return (
    <section ref={sectionRef} className="py-5 sm:py-6 lg:py-8 bg-white border-b border-brand-powder/30 overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-10 xl:px-14 2xl:px-16">

        {/* Heading */}
        <div className="text-center mb-3 sm:mb-5 reveal">
          <p className="font-sans text-[9.5px] sm:text-[10px] tracking-[0.28em] text-brand-teal uppercase font-semibold mb-1 sm:mb-2">
            {eyebrow}
          </p>
          <h2 className="font-serif text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light text-brand-navy tracking-wider uppercase">
            {title}
          </h2>
          <div className="section-divider" />
        </div>

        {/* Carousel with Edge Fades */}
        <div className="relative -mx-3 sm:mx-0">
          {/* Left Edge Gradient Fade */}
          <div
            className={`pointer-events-none absolute left-0 top-0 bottom-0 w-6 sm:w-10 bg-gradient-to-r from-white via-white/80 to-transparent z-10 transition-opacity duration-300 ${
              canScrollLeft ? 'opacity-100' : 'opacity-0'
            }`}
          />

          {/* Right Edge Gradient Fade */}
          <div
            className={`pointer-events-none absolute right-0 top-0 bottom-0 w-8 sm:w-12 bg-gradient-to-l from-white via-white/80 to-transparent z-10 transition-opacity duration-300 ${
              canScrollRight ? 'opacity-100' : 'opacity-0'
            }`}
          />

          {/* Categories Row */}
          <div
            ref={scrollRef}
            className="flex items-start justify-start sm:justify-center gap-2.5 min-[390px]:gap-3.5 sm:gap-5 lg:gap-7 xl:gap-8 pb-3 px-3.5 sm:px-0 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory"
          >
            {displayList.map((cat, idx) => (
              <Link
                key={cat.id}
                to={cat.link || `/category/${cat.id}`}
                className={`reveal reveal-delay-${Math.min(idx + 1, 5)} flex-shrink-0 w-[74px] min-[390px]:w-[80px] min-[430px]:w-[86px] sm:w-[100px] md:w-[110px] lg:w-[120px] flex flex-col items-center group snap-start`}
              >
                {/* Circle */}
                <div
                  className={`relative w-[70px] h-[70px] min-[390px]:w-[76px] min-[390px]:h-[76px] min-[430px]:w-[82px] min-[430px]:h-[82px] sm:w-[95px] sm:h-[95px] md:w-[105px] md:h-[105px] lg:w-[115px] lg:h-[115px] rounded-full overflow-hidden border-2 transition-all duration-350 ${
                    cat.isSaleBadge
                      ? 'border-brand-teal bg-brand-teal shadow-md group-hover:shadow-xl group-hover:scale-105'
                      : 'border-brand-powder bg-brand-cream/30 group-hover:border-brand-teal/50 group-hover:shadow-lg group-hover:scale-105'
                  }`}
                >
                  {cat.isSaleBadge ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-brand-teal">
                      <span className="font-sans text-[7px] tracking-widest text-brand-powder/80 uppercase font-medium mb-0.5">SALE</span>
                      <span className="font-serif text-[10px] sm:text-xs font-bold text-white text-center leading-tight">
                        UP TO<br />50% OFF
                      </span>
                    </div>
                  ) : (
                    <img
                      src={cat.image || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=80'}
                      alt={cat.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                  )}
                </div>

                {/* Label */}
                <span
                  className={`mt-2 font-sans text-[9px] min-[390px]:text-[10px] sm:text-xs uppercase tracking-[0.1em] sm:tracking-[0.14em] font-medium text-center transition-colors duration-200 leading-tight w-full line-clamp-2 px-0.5 ${
                    cat.isSaleBadge
                      ? 'text-brand-teal font-bold'
                      : 'text-brand-navy group-hover:text-brand-teal'
                  }`}
                >
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
