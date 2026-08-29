import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Sparkles, Heart, ShieldCheck, Award, ArrowRight, Users, Feather, Compass, ChevronLeft, ChevronRight } from 'lucide-react';
import logo from '../assets/logo.jpg';
import sareeGolden from '../assets/saree_golden.jpg';
import lehengaRed from '../assets/lehenga_red.jpg';
import sareeBeigePink from '../assets/saree_beige_pink.jpg';
import lehengaMint from '../assets/lehenga_mint.jpg';

const BRAND_SLIDES = [
  {
    image: sareeGolden,
    title: 'Heritage Silk Sarees',
    subtitle: 'Woven by master artisans in Banaras & Kanchi',
  },
  {
    image: lehengaRed,
    title: 'Royal Bridal Lehengas',
    subtitle: 'Intricate hand embroidery and timeless zardozi',
  },
  {
    image: sareeBeigePink,
    title: 'Pure Handloom Weaves',
    subtitle: 'Sustainably crafted with natural dyes & fibers',
  },
  {
    image: lehengaMint,
    title: 'Modern Festive Couture',
    subtitle: 'Bridging timeless tradition with contemporary grace',
  },
];

export default function About() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % BRAND_SLIDES.length);
    }, 3800);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setActiveSlide((prev) => (prev + 1) % BRAND_SLIDES.length);
  const prevSlide = () => setActiveSlide((prev) => (prev - 1 + BRAND_SLIDES.length) % BRAND_SLIDES.length);

  return (
    <div className="w-full bg-white text-left">
      
      {/* ─── Mobile Hero: Full-Bleed Background Slideshow Banner (< lg) ─── */}
      <section className="lg:hidden relative w-full h-[460px] overflow-hidden bg-brand-navy text-white flex flex-col justify-between p-5">
        {/* Absolute Background Slides */}
        {BRAND_SLIDES.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === activeSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover object-top"
            />
            {/* Dark Vignette Overlay for Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/95 via-brand-navy/60 to-black/35" />
          </div>
        ))}

        {/* Top Tag & Slide Counter */}
        <div className="relative z-10 flex items-center justify-between">
          <span className="font-sans text-[9px] uppercase tracking-[0.25em] text-brand-teal font-bold bg-white/95 backdrop-blur-xs px-3 py-1 rounded-full shadow-xs">
            Our Story & Heritage
          </span>
          <span className="font-sans text-[10px] text-white/80 bg-black/40 backdrop-blur-xs px-2.5 py-0.5 rounded-full">
            {activeSlide + 1} / {BRAND_SLIDES.length}
          </span>
        </div>

        {/* Bottom Hero Content */}
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2">
            <img src={logo} alt="Suka Logo" className="w-7 h-7 rounded-full object-cover border border-white/40 shadow-xs" />
            <span className="font-sans text-[9px] text-brand-powder font-bold uppercase tracking-[0.2em]">Women Based • Women Empowered</span>
          </div>

          <h1 className="font-serif text-2xl font-light text-white tracking-wide leading-tight">
            {BRAND_SLIDES[activeSlide].title}
          </h1>

          <p className="font-sans text-[11px] text-white/80 font-light leading-relaxed">
            {BRAND_SLIDES[activeSlide].subtitle}. Empowering over 500+ female artisans across rural handloom clusters.
          </p>

          <div className="pt-2 flex items-center justify-between">
            <RouterLink
              to="/products"
              className="inline-flex items-center gap-2 bg-brand-teal text-white px-5 py-2 rounded-xs font-sans text-[9.5px] uppercase tracking-[0.18em] font-bold shadow-md hover:bg-brand-tealDark transition-colors"
            >
              Explore Collection <ArrowRight size={12} />
            </RouterLink>

            {/* Dot Indicators */}
            <div className="flex items-center gap-1.5">
              {BRAND_SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveSlide(idx)}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    idx === activeSlide ? 'w-4 bg-amber-400' : 'w-1.5 bg-white/60'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Desktop Hero Header (lg:) ────────────────────────────────────────────────────────── */}
      <section className="hidden lg:block relative bg-brand-cream/60 py-8 border-b border-brand-powder/60 overflow-hidden">
        <div className="w-full max-w-[1720px] mx-auto px-6 lg:px-8 xl:px-10 text-center relative z-10">
          <span className="font-sans text-xs uppercase tracking-[0.3em] text-brand-teal font-bold mb-1.5 block">
            Our Story & Heritage
          </span>
          <h1 className="text-4xl lg:text-5xl font-serif text-brand-navy tracking-wide mb-3">
            Women Based • Women Empowered
          </h1>
          <p className="font-sans text-sm text-brand-navy/70 max-w-2xl mx-auto leading-relaxed font-light">
            Suka Fashions was born out of a deep reverence for Indian textiles and an unwavering commitment to empowering women artisans across India.
          </p>
        </div>
      </section>

      {/* ─── Desktop Brand Ethos & Mission (lg:) ────────────────────────────────────────────── */}
      <section className="hidden lg:block pt-6 pb-8 w-full max-w-[1720px] mx-auto px-6 lg:px-8 xl:px-10">
        <div className="grid grid-cols-12 gap-10 items-center">
          
          {/* Left Text Content (7 Cols) */}
          <div className="col-span-7 space-y-4">
            <div className="flex items-center gap-3">
              <img src={logo} alt="Suka Logo" className="w-10 h-10 rounded-full object-cover border border-brand-powder shadow-sm" />
              <div>
                <h2 className="font-serif text-xl text-brand-navy uppercase tracking-wider">The Suka Vision</h2>
                <p className="font-sans text-[9px] text-brand-teal font-bold uppercase tracking-[0.2em]">Crafted for the Modern Woman</p>
              </div>
            </div>

            <p className="font-serif text-lg text-brand-navy/90 italic leading-relaxed border-l-2 border-brand-teal pl-3.5">
              "We believe that true luxury lies in the story behind every weave, the hands that crafted it, and the confidence it brings to the woman wearing it."
            </p>

            <p className="font-sans text-xs text-brand-navy/70 leading-relaxed font-light">
              Founded with the vision to celebrate timeless Indian elegance, Suka Fashions curates handcrafted sarees, kurtis, lehengas, and occasion wear that effortlessly bridge ancient weaving techniques with contemporary aesthetic appeal.
            </p>

            <p className="font-sans text-xs text-brand-navy/70 leading-relaxed font-light">
              Every drape from Suka Fashions carries the legacy of master weavers from Banaras, Kanchipuram, Bengal, and Lucknow. By working directly with women artisan clusters, we ensure fair wages, safe working environments, and economic independence for rural families.
            </p>

            <div className="pt-1 flex flex-wrap items-center gap-4">
              <RouterLink
                to="/products"
                className="inline-flex items-center gap-2.5 bg-brand-teal text-white px-6 py-2.5 rounded-sm font-sans text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-brand-tealDark transition-colors shadow-sm group"
              >
                Explore The Collection <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </RouterLink>

              <div className="flex items-center gap-3 text-brand-navy/60 font-sans text-[11px]">
                <span className="flex items-center gap-1"><Sparkles size={12} className="text-amber-500" /> 100% Authentic</span>
                <span>•</span>
                <span className="flex items-center gap-1"><Heart size={12} className="text-rose-500" /> Artisan Handcrafted</span>
              </div>
            </div>
          </div>

          {/* Right Transitioning Image Carousel (5 Cols) */}
          <div className="col-span-5 flex flex-col items-center">
            <div className="relative w-full max-w-[340px] aspect-[4/5] rounded-sm overflow-hidden shadow-md border border-brand-powder/60 group bg-brand-cream/30">
              
              {/* Slides */}
              {BRAND_SLIDES.map((slide, idx) => (
                <div
                  key={idx}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                    idx === activeSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                  }`}
                >
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/80 via-transparent to-black/10" />
                  <div className="absolute bottom-0 left-0 right-0 p-3.5 text-white z-20">
                    <p className="font-serif text-sm font-medium tracking-wide drop-shadow-sm">
                      {slide.title}
                    </p>
                    <p className="font-sans text-[10px] text-white/80 font-light drop-shadow-xs">
                      {slide.subtitle}
                    </p>
                  </div>
                </div>
              ))}

              {/* Prev / Next Arrows */}
              <button
                type="button"
                onClick={prevSlide}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-white/80 backdrop-blur-xs hover:bg-white text-brand-navy flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm cursor-pointer"
                aria-label="Previous image"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                type="button"
                onClick={nextSlide}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-white/80 backdrop-blur-xs hover:bg-white text-brand-navy flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm cursor-pointer"
                aria-label="Next image"
              >
                <ChevronRight size={14} />
              </button>

              {/* Dot Indicators */}
              <div className="absolute bottom-2.5 right-3.5 z-20 flex items-center gap-1">
                {BRAND_SLIDES.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveSlide(idx)}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      idx === activeSlide ? 'w-4 bg-amber-400' : 'w-1.5 bg-white/60 hover:bg-white'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>

            </div>

            {/* Quick Tag Below Image */}
            <div className="mt-2 w-full max-w-[340px] flex items-center justify-between px-3 py-1.5 bg-brand-cream/40 border border-brand-powder/50 rounded-sm">
              <span className="font-sans text-[9.5px] uppercase tracking-wider font-bold text-brand-teal flex items-center gap-1.5">
                <Sparkles size={11} /> Handloom Weaves
              </span>
              <span className="font-sans text-[9.5px] text-brand-navy/60">
                {activeSlide + 1} / {BRAND_SLIDES.length}
              </span>
            </div>

          </div>

        </div>
      </section>

      {/* ─── 4 Pillars of Excellence (Aligned 2x2 Grid on Mobile, 4 Cols on Desktop) ─── */}
      <section className="bg-brand-cream/40 py-5 sm:py-8 lg:py-10 border-y border-brand-powder/50">
        <div className="w-full max-w-[1720px] mx-auto px-3.5 sm:px-6 lg:px-8 xl:px-10">
          
          <div className="text-center max-w-xl mx-auto mb-4 sm:mb-8 lg:mb-10">
            <span className="font-sans text-[9px] sm:text-[10px] uppercase tracking-[0.25em] text-brand-teal font-bold mb-1 block">Our Foundations</span>
            <h2 className="text-lg sm:text-2xl font-serif text-brand-navy uppercase tracking-wider">The Four Pillars</h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6 lg:gap-8">
            
            <div className="bg-white p-3.5 sm:p-6 lg:p-8 rounded-lg sm:rounded-sm border border-brand-powder/60 shadow-2xs hover:shadow-md transition-shadow text-left">
              <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-brand-powderLight flex items-center justify-center text-brand-teal mb-2.5 sm:mb-5">
                <Users size={16} className="sm:w-[22px] sm:h-[22px]" />
              </div>
              <h3 className="font-serif text-xs sm:text-lg text-brand-navy mb-1 sm:mb-2 font-semibold">Artisan Empowerment</h3>
              <p className="font-sans text-[10px] sm:text-xs text-brand-navy/65 leading-relaxed font-light line-clamp-3 sm:line-clamp-none">
                Empowering over 500+ female artisans across rural handloom clusters through fair wages and skill upliftment.
              </p>
            </div>

            <div className="bg-white p-3.5 sm:p-6 lg:p-8 rounded-lg sm:rounded-sm border border-brand-powder/60 shadow-2xs hover:shadow-md transition-shadow text-left">
              <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-brand-powderLight flex items-center justify-center text-brand-teal mb-2.5 sm:mb-5">
                <Feather size={16} className="sm:w-[22px] sm:h-[22px]" />
              </div>
              <h3 className="font-serif text-xs sm:text-lg text-brand-navy mb-1 sm:mb-2 font-semibold">Purity & Quality</h3>
              <p className="font-sans text-[10px] sm:text-xs text-brand-navy/65 leading-relaxed font-light line-clamp-3 sm:line-clamp-none">
                Certified pure silks, organzas, georgettes, and hand-embroidered threads that stand the test of time.
              </p>
            </div>

            <div className="bg-white p-3.5 sm:p-6 lg:p-8 rounded-lg sm:rounded-sm border border-brand-powder/60 shadow-2xs hover:shadow-md transition-shadow text-left">
              <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-brand-powderLight flex items-center justify-center text-brand-teal mb-2.5 sm:mb-5">
                <Compass size={16} className="sm:w-[22px] sm:h-[22px]" />
              </div>
              <h3 className="font-serif text-xs sm:text-lg text-brand-navy mb-1 sm:mb-2 font-semibold">Sustainable Fashion</h3>
              <p className="font-sans text-[10px] sm:text-xs text-brand-navy/65 leading-relaxed font-light line-clamp-3 sm:line-clamp-none">
                Slow, conscious production with minimal chemical dyes and eco-friendly packaging materials.
              </p>
            </div>

            <div className="bg-white p-3.5 sm:p-6 lg:p-8 rounded-lg sm:rounded-sm border border-brand-powder/60 shadow-2xs hover:shadow-md transition-shadow text-left">
              <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-brand-powderLight flex items-center justify-center text-brand-teal mb-2.5 sm:mb-5">
                <Award size={16} className="sm:w-[22px] sm:h-[22px]" />
              </div>
              <h3 className="font-serif text-xs sm:text-lg text-brand-navy mb-1 sm:mb-2 font-semibold">Unmatched Elegance</h3>
              <p className="font-sans text-[10px] sm:text-xs text-brand-navy/65 leading-relaxed font-light line-clamp-3 sm:line-clamp-none">
                Contemporary cuts tailored to accentuate grace, dignity, and regal poise for every festive moment.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ─── Impact Statistics ─────────────────────────────────────────────────── */}
      <section className="py-10 sm:py-14 bg-brand-navy text-white text-center">
        <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          <div>
            <p className="font-serif text-4xl sm:text-5xl font-light text-brand-powder mb-2">50,000+</p>
            <p className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.2em] text-white/70">Happy Women Worldwide</p>
          </div>
          <div>
            <p className="font-serif text-4xl sm:text-5xl font-light text-brand-powder mb-2">500+</p>
            <p className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.2em] text-white/70">Master Weavers & Artisans</p>
          </div>
          <div>
            <p className="font-serif text-4xl sm:text-5xl font-light text-brand-powder mb-2">100%</p>
            <p className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.2em] text-white/70">Handpicked Luxury Fabrics</p>
          </div>
          <div>
            <p className="font-serif text-4xl sm:text-5xl font-light text-brand-powder mb-2">25+</p>
            <p className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.2em] text-white/70">Global Destination Outlets</p>
          </div>
        </div>
      </section>

    </div>
  );
}
