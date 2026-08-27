import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useReveal } from '../hooks/useReveal';

// Import local assets for 100% reliable image loading
import kurtiBrownPrinted from '../assets/kurti_brown_printed.jpg';
import sareeBeigeOrange from '../assets/saree_beige_orange.jpg';
import lehengaPink from '../assets/lehenga_pink.jpg';
import coordSet from '../assets/coord_set.jpg';

const collections = [
  {
    id: 'under-1999',
    title: 'Under ₹1999',
    subtitle: 'Affordable Luxury',
    image: kurtiBrownPrinted,
    link: '/products?price=under-2000'
  },
  {
    id: 'new-season',
    title: 'New Season',
    subtitle: 'Latest Arrivals',
    image: sareeBeigeOrange,
    link: '/products?sort=newest'
  },
  {
    id: 'wedding-guest',
    title: 'Wedding Guest',
    subtitle: 'Celebration Ready',
    image: lehengaPink,
    link: '/category/occasion'
  },
  {
    id: 'everyday-essentials',
    title: 'Everyday Essentials',
    subtitle: 'Breathable Comfort',
    image: coordSet,
    link: '/category/kurtis'
  }
];

export default function CuratedCollections() {
  const sectionRef = useReveal();

  return (
    <section ref={sectionRef} className="py-12 lg:py-16 bg-brand-cream/40 border-b border-brand-powder/30">
      <div className="max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-10 xl:px-14 2xl:px-16">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-3 border-b border-brand-powder/40 reveal">
          <div>
            <p className="font-sans text-[10px] tracking-[0.28em] text-brand-teal uppercase font-semibold mb-2">
              Handpicked For You
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-light text-brand-navy tracking-wider uppercase">
              Curated Collections
            </h2>
          </div>
          <Link
            to="/products"
            className="hidden sm:inline-flex items-center gap-2 font-sans text-[10px] tracking-[0.22em] uppercase font-semibold text-brand-navy hover:text-brand-teal pb-1 border-b border-brand-navy/30 hover:border-brand-teal transition-all duration-300 group"
          >
            DISCOVER ALL
            <ArrowRight size={14} strokeWidth={2} className="transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {collections.map((col, index) => (
            <Link
              key={col.id}
              to={col.link}
              className={`reveal reveal-delay-${index + 1} group block relative aspect-[3/4] overflow-hidden rounded-md bg-white shadow-sm hover:shadow-2xl transition-all duration-400 border border-brand-powder/40`}
            >
              <div className="absolute inset-0 overflow-hidden">
                <img
                  src={col.image}
                  alt={col.title}
                  className="w-full h-full object-cover object-top transition-transform duration-[1200ms] ease-out group-hover:scale-110"
                  loading="lazy"
                />
              </div>
              
              {/* Soft overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/70 via-transparent to-transparent opacity-70 group-hover:opacity-80 transition-opacity" />

              {/* Bottom Badge */}
              <div className="absolute inset-x-4 bottom-4 z-10">
                <div className="w-full flex items-center justify-between bg-white/95 backdrop-blur-md p-3.5 sm:p-4 rounded-sm shadow-xl transition-transform duration-300 group-hover:-translate-y-1">
                  <div>
                    <span className="font-sans text-[8px] tracking-[0.2em] text-brand-teal uppercase font-bold block mb-0.5">
                      {col.subtitle}
                    </span>
                    <h3 className="font-serif text-base sm:text-lg text-brand-navy font-medium leading-none">
                      {col.title}
                    </h3>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-brand-powder flex items-center justify-center text-brand-teal group-hover:bg-brand-teal group-hover:text-white transition-colors duration-300 flex-shrink-0">
                    <ArrowRight size={14} strokeWidth={2} />
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
