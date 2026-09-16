import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useReveal } from '../hooks/useReveal';
import { useContent } from '../context/ContentContext';

// Import local assets for fallback
import kurtiTealPrinted from '../assets/kurti_teal_printed.jpg';
import sareeBeigeMaroonFull2 from '../assets/saree_beige_maroon_full2.jpg';
import festiveSuit from '../assets/festive_suit.jpg';

const defaultTrending = [
  {
    id: 1,
    title: 'Modern Classics',
    subtitle: 'Everyday styles reimagined.',
    image: kurtiTealPrinted,
    link: '/category/kurtis'
  },
  {
    id: 2,
    title: 'Wedding Edit',
    subtitle: 'The bridal trousseau.',
    image: sareeBeigeMaroonFull2,
    link: '/category/occasion'
  },
  {
    id: 3,
    title: 'Festive Essentials',
    subtitle: 'Celebrate in style.',
    image: festiveSuit,
    link: '/category/occasion'
  }
];

export default function TrendingNow() {
  const sectionRef = useReveal();
  const { getSectionContent } = useContent();
  const content = getSectionContent('trending');

  const eyebrow = content?.eyebrow || 'In The Spotlight';
  const title = content?.title || 'Trending Now';

  const cmsItems = (content?.items || []).filter(i => i.enabled !== false && i.active !== false);
  const items = cmsItems.length > 0 ? cmsItems : defaultTrending;

  // Grid fill mode for 4 or fewer items, carousel for 5+
  const fitsOnScreen = items.length <= 4;

  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 15);
  }, []);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (el) {
      checkScroll();
      el.addEventListener('scroll', checkScroll, { passive: true });
      window.addEventListener('resize', checkScroll);
      return () => {
        el.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, [checkScroll, items]);

  const scroll = (direction) => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const cardWidth = container.firstElementChild?.clientWidth || 360;
    const scrollAmount = cardWidth + 24;
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
    setTimeout(checkScroll, 350);
  };

  return (
    <section ref={sectionRef} className="py-6 sm:py-8 lg:py-10 bg-white border-b border-brand-powder/30 relative overflow-hidden group/section">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-10 xl:px-14 2xl:px-16">

        <div className="flex items-end justify-between mb-4 sm:mb-6 pb-2 border-b border-brand-powder/40 reveal">
          <div>
            <p className="font-sans text-[9.5px] sm:text-[10px] tracking-[0.28em] text-brand-teal uppercase font-semibold mb-1 sm:mb-1.5">
              {eyebrow}
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-light text-brand-navy tracking-wider uppercase">
              {title}
            </h2>
            <div className="section-divider-left mt-1.5 sm:mt-2" />
          </div>
        </div>

        {fitsOnScreen ? (
          <div className="relative -mx-4 px-4 sm:mx-0 sm:px-0">
            <div
              className="flex sm:grid gap-3.5 sm:gap-6 lg:gap-8 overflow-x-auto sm:overflow-visible pb-3 sm:pb-0 no-scrollbar snap-x snap-mandatory sm:snap-none"
              style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}
            >
              {items.map((item, index) => (
                <Link
                  key={item.id || index}
                  to={item.link || '/category/kurtis'}
                  className={`reveal reveal-delay-${(index % 4) + 1} group relative block w-[72vw] max-w-[280px] flex-shrink-0 snap-start sm:w-auto sm:max-w-none sm:flex-shrink aspect-[3/4] overflow-hidden rounded-xl bg-brand-cream border border-brand-powder/60 shadow-sm hover:shadow-xl transition-all duration-500`}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover object-top transition-transform duration-[2000ms] ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-85 group-hover:opacity-95 transition-opacity duration-500" />
                  <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6 lg:p-7 text-left">
                    <span className="font-sans text-[9px] sm:text-[10px] tracking-widest text-brand-powder uppercase mb-1 sm:mb-2 block transform sm:translate-y-3 sm:opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      Explore Collection
                    </span>
                    <h3 className="font-serif text-lg sm:text-2xl lg:text-3xl font-medium text-white mb-0.5 sm:mb-1 leading-tight transform group-hover:-translate-y-1 transition-transform duration-300">
                      {item.title}
                    </h3>
                    <p className="font-sans text-[11px] sm:text-xs text-white/75 font-light transform group-hover:-translate-y-1 transition-transform duration-300 delay-75 line-clamp-2">
                      {item.subtitle}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="relative -mx-4 px-4 sm:mx-0 sm:px-0">
            <div
              className={`pointer-events-none absolute left-0 top-0 bottom-0 w-8 sm:w-12 bg-gradient-to-r from-white via-white/80 to-transparent z-10 transition-opacity duration-300 ${
                canScrollLeft ? 'opacity-100' : 'opacity-0'
              }`}
            />
            <div
              className={`pointer-events-none absolute right-0 top-0 bottom-0 w-8 sm:w-12 bg-gradient-to-l from-white via-white/80 to-transparent z-10 transition-opacity duration-300 ${
                canScrollRight ? 'opacity-100' : 'opacity-0'
              }`}
            />
            <div
              ref={scrollContainerRef}
              className="flex items-stretch gap-4 sm:gap-6 lg:gap-8 pb-3 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory"
            >
              {items.map((item, index) => (
                <Link
                  key={item.id || index}
                  to={item.link || '/category/kurtis'}
                  className={`reveal reveal-delay-${(index % 4) + 1} group relative block w-[75vw] max-w-[290px] sm:max-w-[340px] md:w-[360px] lg:w-[410px] flex-shrink-0 snap-start aspect-[3/4] overflow-hidden rounded-xl bg-brand-cream border border-brand-powder/60 shadow-sm hover:shadow-xl transition-all duration-500`}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover object-top transition-transform duration-[2000ms] ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-85 group-hover:opacity-95 transition-opacity duration-500" />
                  <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6 lg:p-7 text-left">
                    <span className="font-sans text-[9px] sm:text-[10px] tracking-widest text-brand-powder uppercase mb-1 sm:mb-2 block transform sm:translate-y-3 sm:opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      Explore Collection
                    </span>
                    <h3 className="font-serif text-lg sm:text-2xl lg:text-3xl font-medium text-white mb-0.5 sm:mb-1 leading-tight transform group-hover:-translate-y-1 transition-transform duration-300">
                      {item.title}
                    </h3>
                    <p className="font-sans text-[11px] sm:text-xs text-white/75 font-light transform group-hover:-translate-y-1 transition-transform duration-300 delay-75 line-clamp-2">
                      {item.subtitle}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
