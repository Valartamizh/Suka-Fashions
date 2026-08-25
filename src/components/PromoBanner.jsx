import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useReveal } from '../hooks/useReveal';

const banners = [
  {
    id:          'saree-edit',
    theme:       'teal',
    eyebrow:     'COLLECTION',
    heading:     'THE SAREE EDIT',
    subheading:  'Grace in every drape.',
    body:        'Handcrafted weaves for modern celebrations. Timeless silk, organza & cotton sarees.',
    cta:         'SHOP SAREES',
    ctaPath:     '/category/sarees',
    image:       'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=700&auto=format&fit=crop',
    imageAlt:    'Elegant woman in premium teal saree',
    bg:          '#EAF5F6',
    border:      '#C8E8EB',
    accentColor: '#006B70',
  },
  {
    id:          'everyday',
    theme:       'blush',
    eyebrow:     'DAILY WEAR',
    heading:     'EVERYDAY ELEGANCE',
    subheading:  'Comfort that looks beautiful.',
    body:        'Premium breathable fabric sets for every occasion — from morning to evening.',
    cta:         'SHOP KURTIS',
    ctaPath:     '/category/kurtis',
    image:       'https://images.unsplash.com/photo-1608748010899-18f300247112?q=80&w=700&auto=format&fit=crop',
    imageAlt:    'Elegant woman in pink kurti set',
    bg:          '#FBF1EE',
    border:      '#F0DDD8',
    accentColor: '#B05A42',
  },
];

export default function PromoBanner() {
  const sectionRef = useReveal();

  return (
    <section ref={sectionRef} className="py-16 sm:py-20 bg-brand-cream/40 border-b border-brand-powder/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">

        {/* Section label */}
        <div className="text-center mb-10 reveal">
          <p className="font-sans text-[10px] tracking-[0.28em] text-brand-teal uppercase font-semibold mb-2">
            Featured Collections
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-light text-brand-navy tracking-wider uppercase">
            Curated For You
          </h2>
          <div className="section-divider" />
        </div>

        {/* Banners grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {banners.map((b, i) => (
            <div
              key={b.id}
              className={`reveal reveal-delay-${i + 1} group relative flex flex-col sm:flex-row overflow-hidden rounded-sm border transition-shadow duration-400 hover:shadow-2xl`}
              style={{ background: b.bg, borderColor: b.border }}
            >
              {/* Text column */}
              <div className="flex flex-col justify-center p-8 sm:p-10 flex-1 z-10">
                <span
                  className="font-sans text-[9px] tracking-[0.3em] uppercase font-semibold mb-3"
                  style={{ color: b.accentColor }}
                >
                  {b.eyebrow}
                </span>

                <h3 className="font-serif text-2xl sm:text-3xl lg:text-[2rem] font-light text-brand-navy leading-tight mb-1">
                  {b.heading}
                </h3>
                <p
                  className="font-serif text-base italic font-light mb-3"
                  style={{ color: b.accentColor }}
                >
                  {b.subheading}
                </p>
                <p className="font-sans text-xs text-brand-navy/55 font-light leading-relaxed mb-7 max-w-[240px]">
                  {b.body}
                </p>

                <Link
                  to={b.ctaPath}
                  className="inline-flex items-center gap-2 font-sans text-[10px] tracking-[0.22em] uppercase font-semibold pb-1 border-b w-fit transition-all duration-200"
                  style={{ color: b.accentColor, borderColor: b.accentColor + '60' }}
                >
                  {b.cta}
                  <ArrowRight size={12} strokeWidth={2.2} className="transform transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </div>

              {/* Image column */}
              <div className="w-full sm:w-[46%] h-64 sm:h-auto overflow-hidden flex-shrink-0">
                <img
                  src={b.image}
                  alt={b.imageAlt}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
