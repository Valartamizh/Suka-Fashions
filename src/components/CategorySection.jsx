import React from 'react';
import { Link } from 'react-router-dom';
import { useReveal } from '../hooks/useReveal';

const categories = [
  {
    id:    'sarees',
    name:  'Sarees',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=500&auto=format&fit=crop',
    link:  '/category/sarees',
  },
  {
    id:    'kurtis',
    name:  'Kurtis',
    image: 'https://images.unsplash.com/photo-1608748010899-18f300247112?q=80&w=500&auto=format&fit=crop',
    link:  '/category/kurtis',
  },
  {
    id:    'lehengas',
    name:  'Lehengas',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=500&auto=format&fit=crop',
    link:  '/category/lehengas',
  },
  {
    id:    'dresses',
    name:  'Dresses',
    image: 'https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?q=80&w=500&auto=format&fit=crop',
    link:  '/category/dresses',
  },
  {
    id:    'coords',
    name:  'Co-ords',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=500&auto=format&fit=crop',
    link:  '/category/coords',
  },
  {
    id:    'dupattas',
    name:  'Dupattas',
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=500&auto=format&fit=crop',
    link:  '/category/dupattas',
  },
  {
    id:    'festive',
    name:  'Festive Wear',
    image: 'https://images.unsplash.com/photo-1596783074918-c84cb06531ca?q=80&w=500&auto=format&fit=crop',
    link:  '/category/occasion',
  },
  {
    id:         'sale',
    name:       'Sale',
    isSale:     true,
    link:       '/category/sale',
  },
];

export default function CategorySection() {
  const sectionRef = useReveal();

  return (
    <section ref={sectionRef} className="py-16 sm:py-20 bg-white border-b border-brand-powder/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">

        {/* Heading */}
        <div className="text-center mb-12 reveal">
          <p className="font-sans text-[10px] tracking-[0.28em] text-brand-teal uppercase font-semibold mb-3">
            Collections
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-light text-brand-navy tracking-wider uppercase">
            Shop By Category
          </h2>
          <div className="section-divider" />
        </div>

        {/* Row */}
        <div className="flex overflow-x-auto lg:grid lg:grid-cols-8 gap-5 sm:gap-7 pb-3 no-scrollbar scroll-smooth snap-x snap-mandatory">
          {categories.map((cat, idx) => (
            <Link
              key={cat.id}
              to={cat.link}
              className={`reveal reveal-delay-${Math.min(idx + 1, 5)} flex-shrink-0 w-[90px] sm:w-[110px] lg:w-auto flex flex-col items-center group snap-start`}
            >
              {/* Circle */}
              <div
                className={`relative w-[82px] h-[82px] sm:w-24 sm:h-24 lg:w-[108px] lg:h-[108px] rounded-full overflow-hidden border-2 transition-all duration-350 ${
                  cat.isSale
                    ? 'border-brand-teal bg-brand-teal shadow-md group-hover:shadow-xl group-hover:scale-105'
                    : 'border-brand-powder bg-brand-cream/30 group-hover:border-brand-teal/50 group-hover:shadow-lg group-hover:scale-105'
                }`}
              >
                {cat.isSale ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-brand-teal">
                    <span className="font-sans text-[7px] tracking-widest text-brand-powder/80 uppercase font-medium mb-0.5">SALE</span>
                    <span className="font-serif text-[11px] sm:text-xs font-bold text-white text-center leading-tight">
                      UP TO<br />50% OFF
                    </span>
                  </div>
                ) : (
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                )}
              </div>

              {/* Label */}
              <span
                className={`mt-3 font-sans text-[10px] sm:text-xs uppercase tracking-[0.16em] font-medium text-center transition-colors duration-200 ${
                  cat.isSale
                    ? 'text-red-500 group-hover:text-red-600'
                    : 'text-brand-navy group-hover:text-brand-teal'
                }`}
              >
                {cat.name}
              </span>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
