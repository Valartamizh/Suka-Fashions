import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import HeroWaves from './HeroWaves';

// Import local assets for 100% reliable image loading
import lehengaRed from '../assets/lehenga_red.jpg';
import lehengaPink from '../assets/lehenga_pink.jpg';
import lehengaMint from '../assets/lehenga_mint.jpg';
import sareeGolden from '../assets/saree_golden.jpg';
import sareeBeigeMaroon from '../assets/saree_beige_maroon.jpg';
import sareeBeigeOrange from '../assets/saree_beige_orange.jpg';
import anarkaliBlackMulti from '../assets/anarkali_black_multicolor.jpg';
import kurtiPurplePrinted from '../assets/kurti_purple_printed.jpg';
import coordSet from '../assets/coord_set.jpg';

const slides = [
  {
    id: 1,
    eyebrow: 'HERITAGE LEHENGAS',
    heading: ['Royal', 'Occasions.'],
    subtitle: 'Experience royalty in our signature sequin & velvet lehenga collections.',
    mainImage: lehengaRed,
    detailImageLeft: lehengaPink,
    detailImageRight: lehengaMint,
    mainLabel: 'Royal Occasions.',
    leftLabel: { eyebrow: 'DETAILS', title: 'Handcrafted\nembroidery' },
    rightLabel: { eyebrow: 'THE EDIT', title: 'Timeless celebration\nwear' },
    accentBg: '#EBF5F5',
  },
  {
    id: 2,
    eyebrow: 'FESTIVE COUTURE',
    heading: ['Grace in', 'Every Drape.'],
    subtitle: 'Intricate embroideries. Premium organza & Kanchipuram silk drapes.',
    mainImage: sareeGolden,
    detailImageLeft: sareeBeigeMaroon,
    detailImageRight: sareeBeigeOrange,
    mainLabel: 'Grace in Every Drape.',
    leftLabel: { eyebrow: 'DETAILS', title: 'Exquisite organza\ndetails' },
    rightLabel: { eyebrow: 'THE EDIT', title: 'Modern festive\nsilhouettes' },
    accentBg: '#E8F3F5',
  },
  {
    id: 3,
    eyebrow: 'TIMELESS WEAVES',
    heading: ['Elegance,', 'Made for You.'],
    subtitle: 'Contemporary silhouettes rooted in timeless Indian tradition.',
    mainImage: anarkaliBlackMulti,
    detailImageLeft: kurtiPurplePrinted,
    detailImageRight: coordSet,
    mainLabel: 'Elegance, Made for You.',
    leftLabel: { eyebrow: 'DETAILS', title: 'Traditional zardozi\ncraft' },
    rightLabel: { eyebrow: 'THE EDIT', title: 'Heritage premium\nweaves' },
    accentBg: '#EBF4F5',
  },
];

const AVATAR_URLS = [
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=80&auto=format&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=80&auto=format&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=80&auto=format&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=80&auto=format&fit=crop&crop=face',
];

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  const goTo = useCallback((idx) => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => setAnimating(false), 700);
    setCurrent(idx);
  }, [animating]);

  const next = useCallback(() => goTo((current + 1) % slides.length), [current, goTo]);
  const prev = useCallback(() => goTo((current - 1 + slides.length) % slides.length), [current, goTo]);

  useEffect(() => {
    const t = setInterval(next, 7000);
    return () => clearInterval(t);
  }, [next]);

  const slide = slides[current];

  return (
    <section
      className="relative w-full overflow-hidden min-h-[560px] sm:min-h-[600px] lg:min-h-[660px] flex items-center py-8 lg:py-12"
      style={{ background: `linear-gradient(140deg, #FAFAF8 52%, ${slide.accentBg} 100%)` }}
    >
      {/* Teal flowing fabric wave background */}
      <div className="absolute inset-0 z-1 pointer-events-none">
        <HeroWaves />
      </div>

      {/* Top-right accent glow */}
      <div
        className="absolute -top-24 -right-24 w-[380px] h-[380px] rounded-full blur-3xl opacity-20 pointer-events-none transition-colors duration-1000 z-0"
        style={{ background: slide.accentBg }}
      />

      {/* Main content */}
      <div className="relative z-10 w-full">
        <div className="max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-12 xl:px-16 2xl:px-20">

          <div
            key={slide.id}
            className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-8 lg:gap-10 xl:gap-14 items-center"
            style={{ animation: 'heroFadeIn 0.65s cubic-bezier(0.16,1,0.3,1) both' }}
          >
            {/* ── LEFT: Text Content ───────────────────── */}
            <div className="flex flex-col justify-center text-left max-w-xl z-10">

              {/* Eyebrow */}
              <span className="font-sans text-[10px] sm:text-xs font-bold tracking-[0.32em] text-brand-teal uppercase mb-3.5">
                {slide.eyebrow}
              </span>

              {/* Main heading */}
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-[3.8rem] xl:text-6xl font-normal text-brand-navy leading-[1.08] mb-3">
                {slide.heading.map((line, i) => (
                  <span key={i} className="block">{line}</span>
                ))}
              </h1>

              {/* Decorative line */}
              <div className="w-10 h-[2px] bg-brand-teal mb-4" />

              {/* Subtitle */}
              <p className="font-sans text-sm lg:text-[15px] text-brand-navy/65 leading-relaxed font-light mb-7 sm:mb-8 max-w-md">
                {slide.subtitle}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 mb-8">
                <Link
                  to="/products"
                  className="bg-brand-teal hover:bg-brand-tealDark text-white font-sans text-[11px] sm:text-xs font-bold tracking-[0.22em] uppercase py-3.5 px-8 transition-all duration-300 shadow-md hover:shadow-lg rounded-sm"
                >
                  SHOP NEW ARRIVALS
                </Link>
                <Link
                  to="/category/sarees"
                  className="border border-brand-navy/25 text-brand-navy hover:border-brand-teal hover:text-brand-teal font-sans text-[11px] sm:text-xs font-bold tracking-[0.22em] uppercase py-3.5 px-7 transition-all duration-300 rounded-sm bg-white/60"
                >
                  EXPLORE
                </Link>
              </div>

              {/* Social proof */}
              <div className="flex items-center gap-3.5 pt-3.5 border-t border-brand-navy/10 max-w-md">
                <div className="flex -space-x-2.5">
                  {AVATAR_URLS.map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt="Happy Suka customer"
                      className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-white object-cover shadow-sm"
                      loading="lazy"
                    />
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-0.5 mb-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={11} className="fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="font-sans text-[10px] text-brand-navy/60 tracking-[0.14em] uppercase font-semibold">
                    LOVED BY 10,000+ WOMEN
                  </span>
                </div>
              </div>

            </div>

            {/* ── RIGHT: Editorial Image Composition ────── */}
            <div className="relative w-full flex items-center justify-center">

              {/* Desktop composition (lg:flex) */}
              <div className="hidden lg:relative lg:flex items-center justify-center w-full h-[480px] xl:h-[530px] select-none">
                
                {/* 1. LEFT Detail Card */}
                <div className="absolute left-0 top-[60px] xl:top-[80px] w-[160px] xl:w-[195px] h-[280px] xl:h-[330px] z-20 rounded-xl overflow-hidden shadow-xl border border-white/40 bg-white p-1.5 transition-transform duration-500">
                  <img
                    src={slide.detailImageLeft}
                    alt="Craftsmanship detail"
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-sm p-2.5 shadow-md border-l-2 border-brand-teal rounded-r-xs z-40">
                    <span className="font-sans text-[8px] tracking-[0.2em] text-brand-teal uppercase font-bold block mb-0.5">
                      {slide.leftLabel.eyebrow}
                    </span>
                    <span className="font-serif text-[11px] text-brand-navy leading-tight block whitespace-pre-line font-medium">
                      {slide.leftLabel.title}
                    </span>
                  </div>
                </div>

                {/* 2. MAIN Fashion Card (Center) */}
                <div className="relative z-30 w-[310px] xl:w-[380px] h-[450px] xl:h-[510px] rounded-2xl overflow-hidden shadow-2xl bg-white border border-brand-powder/40 p-2 transform hover:scale-[1.01] transition-transform duration-500">
                  <img
                    src={slide.mainImage}
                    alt={slide.mainLabel}
                    className="w-full h-full object-cover rounded-xl"
                  />
                  <div className="absolute bottom-5 left-5 bg-white/95 backdrop-blur-sm px-4 py-2.5 shadow-xl border-l-[3px] border-brand-teal rounded-r-sm max-w-[210px] z-40">
                    <span className="font-sans text-[8px] tracking-[0.22em] text-brand-teal uppercase font-bold block mb-0.5">
                      NEW COLLECTION
                    </span>
                    <span className="font-serif text-[13px] text-brand-navy leading-snug font-medium block">
                      {slide.mainLabel}
                    </span>
                  </div>
                </div>

                {/* 3. RIGHT Detail Card */}
                <div className="absolute right-0 top-[70px] xl:top-[90px] w-[165px] xl:w-[200px] h-[290px] xl:h-[340px] z-20 rounded-xl overflow-hidden shadow-xl border border-white/40 bg-white p-1.5 transition-transform duration-500">
                  <img
                    src={slide.detailImageRight}
                    alt="Fabric styling detail"
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-sm p-2.5 shadow-md border-l-2 border-brand-teal rounded-r-xs z-40">
                    <span className="font-sans text-[8px] tracking-[0.2em] text-brand-teal uppercase font-bold block mb-0.5">
                      {slide.rightLabel.eyebrow}
                    </span>
                    <span className="font-serif text-[11px] text-brand-navy leading-tight block whitespace-pre-line font-medium">
                      {slide.rightLabel.title}
                    </span>
                  </div>
                </div>

              </div>

              {/* Mobile/Tablet composition */}
              <div className="lg:hidden flex flex-col items-center gap-4 w-full max-w-[420px] mx-auto z-20">
                {/* Main Hero Card */}
                <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden shadow-xl bg-white border border-brand-powder/40 p-1.5">
                  <img
                    src={slide.mainImage}
                    alt={slide.mainLabel}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm px-3.5 py-2 shadow-lg border-l-[3px] border-brand-teal rounded-r-sm max-w-[190px]">
                    <span className="font-sans text-[8px] tracking-[0.2em] text-brand-teal uppercase font-bold block mb-0.5">
                      NEW COLLECTION
                    </span>
                    <span className="font-serif text-[12px] text-brand-navy leading-tight block font-medium">
                      {slide.mainLabel}
                    </span>
                  </div>
                </div>

                {/* 2 Detail Thumbnails below main image on mobile */}
                <div className="grid grid-cols-2 gap-3 w-full">
                  <div className="relative aspect-[4/3] rounded-lg overflow-hidden border border-white/60 shadow-md p-1 bg-white">
                    <img src={slide.detailImageLeft} alt="Detail" className="w-full h-full object-cover rounded-md" />
                    <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-xs px-2 py-1 rounded-xs text-[9px] font-serif text-brand-navy">
                      {slide.leftLabel.eyebrow}
                    </div>
                  </div>
                  <div className="relative aspect-[4/3] rounded-lg overflow-hidden border border-white/60 shadow-md p-1 bg-white">
                    <img src={slide.detailImageRight} alt="Edit" className="w-full h-full object-cover rounded-md" />
                    <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-xs px-2 py-1 rounded-xs text-[9px] font-serif text-brand-navy">
                      {slide.rightLabel.eyebrow}
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* Slide Navigation Controls */}
          <div className="flex items-center justify-between mt-6 lg:mt-8 pt-4 border-t border-brand-navy/10 z-20">
            <div className="flex items-center gap-2">
              {slides.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => goTo(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === current ? 'w-8 bg-brand-teal' : 'w-2 bg-brand-navy/20 hover:bg-brand-navy/40'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={prev}
                className="w-9 h-9 rounded-full border border-brand-navy/20 flex items-center justify-center text-brand-navy hover:bg-brand-teal hover:text-white hover:border-brand-teal transition-all duration-200"
                aria-label="Previous slide"
              >
                <ArrowLeft size={15} />
              </button>
              <button
                onClick={next}
                className="w-9 h-9 rounded-full border border-brand-navy/20 flex items-center justify-center text-brand-navy hover:bg-brand-teal hover:text-white hover:border-brand-teal transition-all duration-200"
                aria-label="Next slide"
              >
                <ArrowRight size={15} />
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
