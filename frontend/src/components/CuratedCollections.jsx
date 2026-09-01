import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useReveal } from '../hooks/useReveal';
import { useContent } from '../context/ContentContext';

// Import local fallback assets
import kurtiBrownPrinted from '../assets/kurti_brown_printed.jpg';
import sareeBeigeOrange from '../assets/saree_beige_orange.jpg';
import lehengaPink from '../assets/lehenga_pink.jpg';
import coordSet from '../assets/coord_set.jpg';

const defaultCollections = [
  {
    id: 'under-1999',
    title: 'Under ₹1999',
    subtitle: 'Affordable Luxury',
    image: kurtiBrownPrinted,
    link: '/products?price=under-2000',
  },
  {
    id: 'new-season',
    title: 'New Season',
    subtitle: 'Latest Arrivals',
    image: sareeBeigeOrange,
    link: '/products?sort=newest',
  },
  {
    id: 'wedding-guest',
    title: 'Wedding Guest',
    subtitle: 'Celebration Ready',
    image: lehengaPink,
    link: '/category/occasion',
  },
  {
    id: 'everyday-essentials',
    title: 'Everyday Essentials',
    subtitle: 'Breathable Comfort',
    image: coordSet,
    link: '/category/kurtis',
  },
];

export default function CuratedCollections() {
  const sectionRef = useReveal();
  const { getSectionContent } = useContent();
  const content = getSectionContent('collections');

  const eyebrow = content?.eyebrow || 'Handpicked For You';
  const title = content?.title || 'Curated Collections';
  const ctaText = content?.ctaText || 'DISCOVER ALL';
  const ctaLink = content?.ctaLink || '/products';

  const collections = useMemo(() => {
    if (content?.items && Array.isArray(content.items) && content.items.length > 0) {
      return content.items;
    }
    return defaultCollections;
  }, [content]);

  return (
    <section ref={sectionRef} className="py-6 lg:py-8 bg-brand-cream/40 border-b border-brand-powder/30">
      <div className="max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-10 xl:px-14 2xl:px-16">

        {/* Header */}
        <div className="flex items-end justify-between mb-3 sm:mb-4 pb-2 border-b border-brand-powder/40 reveal">
          <div>
            <p className="font-sans text-[9.5px] sm:text-[10px] tracking-[0.28em] text-brand-teal uppercase font-semibold mb-1 sm:mb-2">
              {eyebrow}
            </p>
            <h2 className="font-serif text-xl sm:text-3xl lg:text-4xl font-light text-brand-navy tracking-wider uppercase">
              {title}
            </h2>
          </div>
          <Link
            to={ctaLink}
            className="inline-flex items-center gap-1.5 sm:gap-2 font-sans text-[9.5px] sm:text-[10px] tracking-[0.16em] sm:tracking-[0.22em] uppercase font-bold text-brand-teal sm:text-brand-navy hover:text-brand-teal pb-1 transition-all duration-300 group whitespace-nowrap"
          >
            <span>{ctaText}</span>
            <ArrowRight size={13} strokeWidth={2} className="transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Grid / Slider */}
        <div className="flex overflow-x-auto lg:grid lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6 pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 no-scrollbar snap-x snap-mandatory">
          {collections.map((col, index) => (
            <Link
              key={col.id || index}
              to={col.link || '/products'}
              className={`reveal reveal-delay-${index + 1} flex-none w-[70vw] max-w-[260px] lg:max-w-none lg:w-full snap-start group block relative aspect-[3/4] overflow-hidden rounded-md bg-white shadow-2xs hover:shadow-xl transition-all duration-400 border border-brand-powder/40`}
            >
              <div className="absolute inset-0 overflow-hidden">
                <img
                  src={col.image || kurtiBrownPrinted}
                  alt={col.title}
                  className="w-full h-full object-cover object-top transition-transform duration-[1200ms] ease-out group-hover:scale-110"
                  loading="lazy"
                />
              </div>
              
              {/* Soft overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/80 via-transparent to-transparent opacity-75 group-hover:opacity-85 transition-opacity" />

              {/* Bottom Badge */}
              <div className="absolute inset-x-2 bottom-2 sm:inset-x-4 sm:bottom-4 z-10">
                <div className="w-full flex items-center justify-between bg-white/95 backdrop-blur-md p-2 sm:p-3.5 rounded-xs sm:rounded-sm shadow-md transition-transform duration-300 group-hover:-translate-y-1">
                  <div className="min-w-0 pr-1">
                    <span className="font-sans text-[7.5px] sm:text-[8px] tracking-[0.16em] text-brand-teal uppercase font-bold block mb-0.5 truncate">
                      {col.subtitle}
                    </span>
                    <h3 className="font-serif text-[11.5px] sm:text-base lg:text-lg text-brand-navy font-medium leading-tight truncate">
                      {col.title}
                    </h3>
                  </div>
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-brand-powder flex items-center justify-center text-brand-teal group-hover:bg-brand-teal group-hover:text-white transition-colors duration-300 flex-shrink-0">
                    <ArrowRight size={11} strokeWidth={2} className="sm:w-[14px] sm:h-[14px]" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
