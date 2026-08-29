import React from 'react';
import { Link } from 'react-router-dom';
import { useReveal } from '../hooks/useReveal';
import { useCategories } from '../context/CategoryContext';

export default function CategorySection() {
  const sectionRef = useReveal();
  const { homepageCategories } = useCategories();

  const displayList = homepageCategories.filter(c => c.id !== 'sale');

  return (
    <section ref={sectionRef} className="py-6 lg:py-8 bg-white border-b border-brand-powder/30">
      <div className="max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-10 xl:px-14 2xl:px-16">

        {/* Heading */}
        <div className="text-center mb-4 reveal">
          <p className="font-sans text-[10px] tracking-[0.28em] text-brand-teal uppercase font-semibold mb-2">
            Collections
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-light text-brand-navy tracking-wider uppercase">
            Shop By Category
          </h2>
          <div className="section-divider" />
        </div>

        {/* Row */}
        <div className="flex overflow-x-auto lg:flex lg:flex-wrap lg:justify-center gap-4 sm:gap-6 pb-2 no-scrollbar scroll-smooth snap-x snap-mandatory">
          {displayList.map((cat, idx) => (
            <Link
              key={cat.id}
              to={cat.link || `/category/${cat.id}`}
              className={`reveal reveal-delay-${Math.min(idx + 1, 5)} flex-shrink-0 w-[95px] sm:w-[115px] lg:w-[125px] flex flex-col items-center group snap-start`}
            >
              {/* Circle */}
              <div
                className={`relative w-[90px] h-[90px] sm:w-[110px] sm:h-[110px] lg:w-[120px] lg:h-[120px] rounded-full overflow-hidden border-2 transition-all duration-350 ${
                  cat.isSaleBadge
                    ? 'border-brand-teal bg-brand-teal shadow-md group-hover:shadow-xl group-hover:scale-105'
                    : 'border-brand-powder bg-brand-cream/30 group-hover:border-brand-teal/50 group-hover:shadow-lg group-hover:scale-105'
                }`}
              >
                {cat.isSaleBadge ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-brand-teal">
                    <span className="font-sans text-[7px] tracking-widest text-brand-powder/80 uppercase font-medium mb-0.5">SALE</span>
                    <span className="font-serif text-[11px] sm:text-xs font-bold text-white text-center leading-tight">
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
                className={`mt-2.5 font-sans text-[10px] sm:text-xs uppercase tracking-[0.16em] font-medium text-center transition-colors duration-200 ${
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
    </section>
  );
}

