import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Tag } from 'lucide-react';
import { useReveal } from '../hooks/useReveal';

// Import local high-resolution asset for 100% reliable background loading
import sareeGolden from '../assets/saree_golden.jpg';

export default function PromoBanner() {
  const sectionRef = useReveal();

  return (
    <section ref={sectionRef} className="py-6 lg:py-8 bg-brand-cream/30 border-b border-brand-powder/30">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-10 xl:px-14 2xl:px-16">

        {/* ── Single Full-Width Background Banner ──────────────────────── */}
        <div className="reveal group relative overflow-hidden rounded-2xl min-h-[380px] sm:min-h-[420px] lg:min-h-[460px] flex items-center shadow-xl border border-brand-teal/20 transition-all duration-500 hover:shadow-2xl">

          {/* 1. Background Image */}
          <img
            src={sareeGolden}
            alt="The Saree Edit - Pure Silk & Organza Sarees"
            className="absolute inset-0 w-full h-full object-cover object-[center_25%] transition-transform duration-1000 ease-out group-hover:scale-105"
            loading="lazy"
          />

          {/* 2. Cinematic Gradient Overlay (Darker on the left for legible text, revealing the model on the right) */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#022326]/95 via-[#03363B]/80 sm:via-[#03363B]/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 sm:hidden" />

          {/* 3. Banner Content Layer */}
          <div className="relative z-10 w-full p-6 sm:p-10 lg:p-14 text-left max-w-2xl">

            {/* Eyebrow Pill */}
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/25 px-3.5 py-1.5 rounded-full mb-4">
              <Sparkles size={12} className="text-amber-300" />
              <span className="font-sans text-[10px] tracking-[0.28em] text-white uppercase font-bold">
                Featured Collections
              </span>
            </div>

            {/* Headline */}
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-white tracking-wide uppercase leading-tight mb-2">
              Curated For You
            </h2>

            {/* Subtitle */}
            <p className="font-serif text-lg sm:text-xl italic text-brand-powder/95 font-light mb-3">
              Grace in Every Drape • Comfort in Every Stitch
            </p>

            {/* Body copy */}
            <p className="font-sans text-xs sm:text-sm text-white/80 font-light leading-relaxed mb-6 max-w-lg">
              Explore our handwoven pure silk & organza sarees and effortlessly chic printed sets — crafted with timeless Indian artistry for every celebration.
            </p>

            {/* Feature Highlights Pills */}
            <div className="flex flex-wrap gap-2 sm:gap-2.5 mb-7">
              <span className="font-sans text-[10px] sm:text-[11px] font-medium text-white bg-white/10 backdrop-blur-xs border border-white/20 px-3 py-1 rounded-full">
                ✨ Pure Silk & Organza
              </span>
              <span className="font-sans text-[10px] sm:text-[11px] font-medium text-white bg-white/10 backdrop-blur-xs border border-white/20 px-3 py-1 rounded-full">
                🪡 Handcrafted Artistry
              </span>
              <span className="font-sans text-[10px] sm:text-[11px] font-medium text-white bg-white/10 backdrop-blur-xs border border-white/20 px-3 py-1 rounded-full">
                🚚 Free Express Shipping
              </span>
            </div>

            {/* CTA Buttons + Promo Offer */}
            <div className="flex flex-wrap items-center gap-3.5">
              <Link
                to="/category/sarees"
                className="inline-flex items-center gap-2.5 bg-brand-teal hover:bg-brand-tealDark text-white font-sans text-xs tracking-[0.2em] uppercase font-bold px-7 py-3.5 rounded-sm shadow-lg hover:shadow-xl transition-all duration-300 group/btn"
              >
                <span>SHOP SAREES</span>
                <ArrowRight size={14} strokeWidth={2.2} className="transform transition-transform duration-200 group-hover/btn:translate-x-1" />
              </Link>

              <Link
                to="/products"
                className="inline-flex items-center gap-2.5 bg-white/15 hover:bg-white/25 text-white border border-white/30 backdrop-blur-sm font-sans text-xs tracking-[0.2em] uppercase font-bold px-6 py-3.5 rounded-sm transition-all duration-300"
              >
                <span>EXPLORE ALL</span>
                <ArrowRight size={14} strokeWidth={2.2} />
              </Link>

              {/* Promo Coupon Tag */}
              {/* <div className="inline-flex items-center gap-2 bg-amber-400/20 border border-amber-300/40 text-amber-200 text-xs font-sans px-3.5 py-2 rounded-sm backdrop-blur-xs">
                <Tag size={13} className="text-amber-300" />
                <span className="font-semibold tracking-wider uppercase text-[10px]">
                  Use Code: <span className="text-white font-mono font-bold">SUKA15</span> for 15% Off
                </span>
              </div> */}
            </div>

          </div>

          {/* Top Right Luxury Floating Badge */}
          {/* <div className="hidden lg:block absolute top-6 right-6 z-10 bg-black/40 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full text-white text-[10px] font-sans tracking-[0.22em] uppercase font-semibold">
            ✦ Authentic Handlooms
          </div> */}

        </div>

      </div>
    </section>
  );
}
