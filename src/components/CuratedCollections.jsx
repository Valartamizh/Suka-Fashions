import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useReveal } from '../hooks/useReveal';

const collections = [
  {
    id: 'under-1999',
    title: 'Under ₹1999',
    image: 'https://images.unsplash.com/photo-1608748010899-18f300247112?q=80&w=600&auto=format&fit=crop',
    link: '/products?price=under-2000'
  },
  {
    id: 'new-season',
    title: 'New Season',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=600&auto=format&fit=crop',
    link: '/products?sort=newest'
  },
  {
    id: 'wedding-guest',
    title: 'Wedding Guest',
    image: 'https://images.unsplash.com/photo-1596783074918-c84cb06531ca?q=80&w=600&auto=format&fit=crop',
    link: '/category/occasion'
  },
  {
    id: 'everyday-essentials',
    title: 'Everyday Essentials',
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=600&auto=format&fit=crop',
    link: '/category/kurtis'
  }
];

export default function CuratedCollections() {
  const sectionRef = useReveal();

  return (
    <section ref={sectionRef} className="py-10 lg:py-14 bg-brand-cream/40 border-b border-brand-powder/30">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {collections.map((col, index) => (
            <Link
              key={col.id}
              to={col.link}
              className={`reveal reveal-delay-${index + 1} group block relative aspect-[4/5] overflow-hidden rounded-sm bg-white shadow-sm hover:shadow-xl transition-all duration-400`}
            >
              <div className="absolute inset-0 overflow-hidden">
                <img
                  src={col.image}
                  alt={col.title}
                  className="w-full h-full object-cover transition-transform duration-[1500ms] ease-out group-hover:scale-110"
                  loading="lazy"
                />
              </div>
              
              {/* Very soft gradient just to make text legible */}
              <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/60 via-transparent to-transparent opacity-60" />

              <div className="absolute inset-0 flex items-end p-6">
                <div className="w-full flex items-center justify-between bg-white/95 backdrop-blur-sm p-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="font-serif text-[15px] sm:text-base text-brand-navy font-medium">
                    {col.title}
                  </h3>
                  <div className="w-8 h-8 rounded-full bg-brand-powder flex items-center justify-center text-brand-teal group-hover:bg-brand-teal group-hover:text-white transition-colors duration-300">
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
