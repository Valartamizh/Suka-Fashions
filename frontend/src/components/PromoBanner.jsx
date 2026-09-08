import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useReveal } from '../hooks/useReveal';
import { useContent } from '../context/ContentContext';

// Import local high-resolution fallback asset
import sareeGolden from '../assets/saree_golden.jpg';

export default function PromoBanner() {
  const sectionRef = useReveal();
  const { getSectionContent } = useContent();
  const content = getSectionContent('promo-banners');

  const activeBanner = (content?.banners && content.banners.length > 0)
    ? (content.banners.find(b => b.active) || content.banners[0])
    : null;

  const eyebrow = activeBanner?.type || content?.eyebrow || 'Featured Collections';
  const title = activeBanner?.title || content?.title || 'Curated For You';
  const subtitle = activeBanner?.subtitle || content?.subtitle || 'Grace in Every Drape • Comfort in Every Stitch';
  const description = activeBanner?.description || content?.description || 'Explore our handwoven pure silk & organza sarees and effortlessly chic printed sets.';
  const ctaText = activeBanner?.ctaText || content?.ctaText || 'EXPLORE ALL';
  const ctaLink = activeBanner?.ctaLink || content?.ctaLink || '/products';
  const bgImage = activeBanner?.image || content?.image || sareeGolden;

  return (
    <section ref={sectionRef} className="py-2 sm:py-4 lg:py-5 bg-brand-cream/20">
      <div className="w-full max-w-[1720px] mx-auto px-3 sm:px-6 lg:px-8 xl:px-10">

        {/* ── Single Wide Background Banner Card with Smooth Rounded Edges ── */}
        <div className="reveal group relative overflow-hidden rounded-2xl sm:rounded-3xl min-h-[260px] sm:min-h-[290px] lg:min-h-[320px] flex items-center shadow-xl border border-brand-teal/20 transition-all duration-500 hover:shadow-2xl">

          {/* 1. Background Image */}
          <img
            src={bgImage}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover object-[center_25%] transition-transform duration-1000 ease-out group-hover:scale-105"
            loading="lazy"
          />

          {/* 2. Cinematic Gradient Overlay (Darker on the left for legible text, revealing the model on the right) */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#022326]/95 via-[#03363B]/80 sm:via-[#03363B]/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 sm:hidden" />

          {/* 3. Banner Content Layer */}
          <div className="relative z-10 w-full px-6 sm:px-10 lg:px-12 py-5 sm:py-7 lg:py-8 text-left max-w-2xl">

            {/* Eyebrow Pill */}
            {eyebrow && (
              <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/25 px-3 py-1 rounded-full mb-2.5">
                <Sparkles size={11} className="text-amber-300" />
                <span className="font-sans text-[9px] sm:text-[10px] tracking-[0.28em] text-white uppercase font-bold">
                  {eyebrow}
                </span>
              </div>
            )}

            {/* Headline */}
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-white tracking-wide uppercase leading-tight mb-1.5">
              {title}
            </h2>

            {/* Subtitle */}
            {subtitle && (
              <p className="font-serif text-base sm:text-lg italic text-brand-powder/95 font-light mb-2">
                {subtitle}
              </p>
            )}

            {/* Body copy */}
            {description && (
              <p className="font-sans text-xs sm:text-sm text-white/80 font-light leading-relaxed mb-4 max-w-lg">
                {description}
              </p>
            )}

            {/* CTA Button */}
            <div>
              <Link
                to={ctaLink}
                className="inline-flex items-center gap-2.5 bg-brand-teal hover:bg-brand-tealDark text-white font-sans text-xs tracking-[0.2em] uppercase font-bold px-7 py-3 rounded-sm shadow-lg hover:shadow-xl transition-all duration-300 group/btn"
              >
                <span>{ctaText}</span>
                <ArrowRight size={14} strokeWidth={2.2} className="transform transition-transform duration-200 group-hover/btn:translate-x-1" />
              </Link>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
