import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useReveal } from '../hooks/useReveal';

export default function BrandStory() {
  const sectionRef = useReveal();

  return (
    <section ref={sectionRef} className="py-20 sm:py-24 bg-white border-b border-brand-powder/30 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* ── Left: Photography ──────────────────────── */}
          <div className="reveal relative">
            {/* Offset decorative border */}
            <div className="absolute -top-4 -left-4 w-full h-full border border-brand-teal/15 rounded-sm pointer-events-none z-0" />

            <div className="relative z-10 aspect-[5/4] overflow-hidden rounded-sm shadow-xl border border-brand-powder/40 bg-brand-cream">
              {/* Subtle overlay */}
              <div className="absolute inset-0 bg-brand-teal/5 z-10 pointer-events-none" />
              <img
                src="https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=900&auto=format&fit=crop"
                alt="Women artisans weaving premium Indian fabric at Suka Fashions"
                className="w-full h-full object-cover transition-transform duration-[6s] hover:scale-105"
                loading="lazy"
              />
            </div>

            {/* Stat badge */}
            <div className="absolute bottom-6 -right-4 lg:-right-6 bg-brand-tealDark text-white px-6 py-4 shadow-xl z-20 rounded-sm">
              <span className="font-serif text-2xl font-bold text-brand-powder block">10K+</span>
              <span className="font-sans text-[10px] tracking-[0.18em] uppercase text-white/70">Happy Women</span>
            </div>
          </div>

          {/* ── Right: Content ────────────────────────── */}
          <div className="flex flex-col justify-center items-start reveal reveal-delay-2">
            <span className="font-sans text-[10px] tracking-[0.3em] text-brand-teal uppercase font-semibold mb-5">
              Our Purpose
            </span>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-[2.8rem] font-light text-brand-navy leading-tight uppercase mb-6">
              More than fashion,<br />
              <span className="italic font-medium">it's a movement.</span>
            </h2>

            <p className="font-sans text-sm sm:text-[15px] text-brand-navy/60 leading-loose font-light mb-5 max-w-lg">
              At Suka Fashions, we celebrate femininity, empower women artisans, and create fashion that makes a difference.
            </p>
            <p className="font-sans text-sm text-brand-navy/50 leading-loose font-light mb-9 max-w-lg">
              Each weave carries the legacy of traditional Indian craftsmanship — blended with contemporary sensibility for the independent, confident woman of today.
            </p>

            {/* Stats row */}
            <div className="flex items-center gap-8 mb-9 pb-7 border-b border-brand-powder/60 w-full">
              {[
                { value: '10K+', label: 'Happy Customers' },
                { value: '200+', label: 'Artisan Families' },
                { value: '5★',   label: 'Avg. Rating'      },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col">
                  <span className="font-serif text-xl sm:text-2xl font-bold text-brand-teal">{stat.value}</span>
                  <span className="font-sans text-[10px] tracking-wider text-brand-navy/50 uppercase">{stat.label}</span>
                </div>
              ))}
            </div>

            <Link
              to="/about"
              className="inline-flex items-center gap-2.5 bg-brand-navy hover:bg-brand-tealDark text-white font-sans text-[10px] tracking-[0.22em] uppercase font-semibold py-4 px-8 transition-all duration-300 rounded-sm group"
            >
              OUR STORY
              <ArrowRight size={13} strokeWidth={2} className="group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
