import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useReveal } from '../hooks/useReveal';
import { useContent } from '../context/ContentContext';
import sareeBeigeMaroonFull from '../assets/saree_beige_maroon_full.jpg';

export default function BrandStory() {
  const sectionRef = useReveal();
  const { getSectionContent } = useContent();
  const content = getSectionContent('brand-story');

  const eyebrow = content?.eyebrow || 'OUR PURPOSE';
  const headingLine1 = content?.headingLine1 || 'MORE THAN FASHION,';
  const headingLine2 = content?.headingLine2 || "IT'S A MOVEMENT.";
  const paragraph1 = content?.paragraph1 || 'At Suka Fashions, we celebrate femininity, empower women artisans, and create fashion that makes a difference.';
  const paragraph2 = content?.paragraph2 || 'Each weave carries the legacy of traditional Indian craftsmanship — blended with contemporary sensibility for the independent, confident woman of today.';
  const ctaText = content?.ctaText || 'OUR STORY';
  const ctaLink = content?.ctaLink || '/about';
  const image = content?.image || sareeBeigeMaroonFull;
  const stats = content?.stats && Array.isArray(content.stats) ? content.stats : [
    { value: '10K+', label: 'Happy Customers' },
    { value: '200+', label: 'Artisan Families' },
    { value: '5★', label: 'Avg. Rating' },
  ];

  return (
    <section ref={sectionRef} className="py-6 lg:py-8 bg-white border-b border-brand-powder/30 overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-10 xl:px-14 2xl:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center">

          {/* ── Left: Photography ──────────────────────── */}
          <div className="reveal relative">
            <div className="absolute -top-4 -left-4 w-full h-full border border-brand-teal/15 rounded-sm pointer-events-none z-0" />

            <div className="relative z-10 aspect-[3/4] sm:aspect-[4/5] max-h-[560px] mx-auto overflow-hidden rounded-sm shadow-xl border border-brand-powder/40 bg-brand-cream">
              <div className="absolute inset-0 bg-brand-teal/5 z-10 pointer-events-none" />
              <img
                src={image}
                alt="Women artisans weaving premium Indian fabric at Suka Fashions"
                className="w-full h-full object-cover object-top transition-transform duration-[6s] hover:scale-105"
                loading="lazy"
              />
            </div>

            {/* Stat badge */}
            <div className="absolute bottom-6 -right-4 lg:-right-6 bg-brand-tealDark text-white px-5 py-3 shadow-xl z-20 rounded-sm">
              <span className="font-serif text-xl sm:text-2xl font-bold text-brand-powder block">{stats[0]?.value || '10K+'}</span>
              <span className="font-sans text-[9px] tracking-[0.18em] uppercase text-white/70">{stats[0]?.label || 'Happy Women'}</span>
            </div>
          </div>

          {/* ── Right: Content ────────────────────────── */}
          <div className="flex flex-col justify-center items-start reveal reveal-delay-2">
            <span className="font-sans text-[10px] tracking-[0.3em] text-brand-teal uppercase font-semibold mb-3">
              {eyebrow}
            </span>

            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-light text-brand-navy leading-tight uppercase mb-4">
              {headingLine1}<br />
              <span className="italic font-medium">{headingLine2}</span>
            </h2>

            {paragraph1 && (
              <p className="font-sans text-xs sm:text-sm text-brand-navy/60 leading-relaxed font-light mb-3 max-w-lg">
                {paragraph1}
              </p>
            )}
            {paragraph2 && (
              <p className="font-sans text-xs sm:text-sm text-brand-navy/50 leading-relaxed font-light mb-6 max-w-lg">
                {paragraph2}
              </p>
            )}

            {/* Stats row */}
            <div className="flex items-center gap-6 sm:gap-8 mb-6 pb-5 border-b border-brand-powder/60 w-full">
              {stats.map((stat) => (
                <div key={stat.label} className="flex flex-col">
                  <span className="font-serif text-lg sm:text-xl font-bold text-brand-teal">{stat.value}</span>
                  <span className="font-sans text-[9px] tracking-wider text-brand-navy/50 uppercase">{stat.label}</span>
                </div>
              ))}
            </div>

            <Link
              to={ctaLink}
              className="inline-flex items-center gap-2.5 bg-brand-navy hover:bg-brand-tealDark text-white font-sans text-[10px] tracking-[0.22em] uppercase font-semibold py-3.5 px-7 transition-all duration-300 rounded-sm group"
            >
              {ctaText}
              <ArrowRight size={13} strokeWidth={2} className="group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
