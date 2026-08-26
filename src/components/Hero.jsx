import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import HeroWaves from './HeroWaves';

const slides = [
  {
    id: 1,
    eyebrow: 'HERITAGE LEHENGAS',
    heading: ['Royal', 'Occasions.'],
    subtitle: 'Experience royalty in our signature sequin collections.',
    mainImage: 'https://images.unsplash.com/photo-1596783074918-c84cb06531ca?q=90&w=900&auto=format&fit=crop',
    detailImageLeft: 'https://images.unsplash.com/photo-1610030469668-93535c17b6b3?q=80&w=500&auto=format&fit=crop', // gold jewelry & neck
    detailImageRight: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=500&auto=format&fit=crop', // ethnic detail embroidery
    mainLabel: 'Royal Occasions.',
    leftLabel: { eyebrow: 'DETAILS', title: 'Handcrafted\nembroidery' },
    rightLabel: { eyebrow: 'THE EDIT', title: 'Timeless celebration\nwear' },
    accentBg: '#EBF5F5',
  },
  {
    id: 2,
    eyebrow: 'FESTIVE COUTURE',
    heading: ['Grace in', 'Every Drape.'],
    subtitle: 'Intricate embroideries. Premium organza weaves.',
    mainImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=90&w=900&auto=format&fit=crop', // saree model
    detailImageLeft: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=500&auto=format&fit=crop', // details
    detailImageRight: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=500&auto=format&fit=crop', // pink coord / embroidery
    mainLabel: 'Grace in Every Drape.',
    leftLabel: { eyebrow: 'DETAILS', title: 'Exquisite organza\ndetails' },
    rightLabel: { eyebrow: 'THE EDIT', title: 'Modern festive\nsilhouettes' },
    accentBg: '#E8F3F5',
  },
  {
    id: 3,
    eyebrow: 'TIMELESS WEAVES',
    heading: ['Elegance,', 'Made for You.'],
    subtitle: 'Contemporary style rooted in timeless Indian tradition.',
    mainImage: 'https://images.unsplash.com/photo-1608748010899-18f300247112?q=90&w=900&auto=format&fit=crop', // kurti model
    detailImageLeft: 'https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?q=80&w=500&auto=format&fit=crop', // kurti / embroidery close-up
    detailImageRight: 'https://images.unsplash.com/photo-1610030470224-34537bb26732?q=80&w=500&auto=format&fit=crop', // saree / textile texture
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
      className="relative w-full overflow-hidden min-h-[520px] sm:min-h-[560px] lg:min-h-[620px] lg:h-[650px] flex items-center"
      style={{ background: `linear-gradient(140deg, #FAFAF8 52%, ${slide.accentBg} 100%)` }}
    >
      {/* ── Teal flowing fabric wave background ──────── */}
      <div className="absolute inset-0 z-1 pointer-events-none">
        <HeroWaves />
      </div>

      {/* ── Very subtle top-right accent blob ─────────── */}
      <div
        className="absolute -top-24 -right-24 w-[380px] h-[380px] rounded-full blur-3xl opacity-20 pointer-events-none transition-colors duration-1000 z-0"
        style={{ background: slide.accentBg }}
      />

      {/* ── Main content ─────────────────────────────── */}
      <div className="relative z-10 w-full py-6 lg:py-0">
        <div className="max-w-[1600px] mx-auto px-8 sm:px-10 lg:px-12 xl:px-16 2xl:px-20">

          <div
            key={slide.id}
            className="grid grid-cols-1 lg:grid-cols-[0.82fr_1.18fr] gap-8 lg:gap-10 xl:gap-14 items-center"
            style={{ animation: 'heroFadeIn 0.65s cubic-bezier(0.16,1,0.3,1) both' }}
          >
            {/* ── LEFT: Text (z-10) ───────────────────── */}
            <div className="flex flex-col justify-center text-left max-w-xl z-10">

              {/* Eyebrow */}
              <span className="font-sans text-[10px] sm:text-xs font-bold tracking-[0.32em] text-brand-teal uppercase mb-3.5">
                {slide.eyebrow}
              </span>

              {/* Main heading */}
              <h1 className="font-serif text-5xl sm:text-6xl lg:text-[4.2rem] xl:text-7xl font-normal text-brand-navy leading-[1.05] mb-3">
                {slide.heading.map((line, i) => (
                  <span key={i} className="block">{line}</span>
                ))}
              </h1>

              {/* Decorative teal line */}
              <div className="w-10 h-[2px] bg-brand-teal mb-4" />

              {/* Subtitle */}
              <p className="font-sans text-sm lg:text-[15px] text-brand-navy/55 leading-relaxed font-light mb-7 sm:mb-8 max-w-md">
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
                  <span className="font-sans text-[10px] text-brand-navy/50 tracking-[0.14em] uppercase font-semibold">
                    LOVED BY 10,000+ WOMEN
                  </span>
                </div>
              </div>

            </div>

            {/* ── RIGHT: Layered Editorial Composition ────── */}
            <div className="relative flex justify-center items-center w-full">

              {/* Desktop layout: Left + Main + Right overlapping cards (z-20/z-30) */}
              <div className="relative w-full h-[510px] xl:h-[560px] hidden lg:block select-none">

                {/* 1. LEFT Supporting Card (z-20) */}
                <div
                  className="absolute left-0 top-[55px] xl:top-[110px] w-[175px] xl:w-[205px] h-[290px] xl:h-[340px] z-20 rounded-xl overflow-hidden shadow-xl border border-white/20 bg-white p-1.5 transition-transform duration-500"
                >
                  <img
                    src={slide.detailImageLeft}
                    alt="Craftsmanship detail close-up"
                    className="w-full h-full object-cover rounded-lg"
                  />
                  {/* Editorial label */}
                  <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-sm p-2.5 shadow-md border-l-2 border-brand-teal rounded-r-xs z-40">
                    <span className="font-sans text-[8px] tracking-[0.2em] text-brand-teal uppercase font-bold block mb-0.5">
                      {slide.leftLabel.eyebrow}
                    </span>
                    <span className="font-serif text-[11px] text-brand-navy leading-tight block whitespace-pre-line font-medium">
                      {slide.leftLabel.title}
                    </span>
                  </div>
                </div>

                {/* 2. LARGE Main Fashion Card (z-30) */}
                <div
                  className="absolute left-[125px] xl:left-[145px] top-[10px] w-[370px] xl:w-[480px] h-[480px] xl:h-[540px] z-30 rounded-2xl overflow-hidden shadow-2xl bg-white border border-brand-powder/40 p-2"
                >
                  <img
                    src={slide.mainImage}
                    alt={slide.mainLabel}
                    className="w-full h-full object-cover rounded-xl transition-transform duration-[7000ms] ease-out scale-102 hover:scale-100"
                  />
                  {/* Floating editorial label */}
                  <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm px-4 py-2.5 shadow-xl border-l-[3px] border-brand-teal rounded-r-sm max-w-[210px] z-40">
                    <span className="font-sans text-[8px] tracking-[0.22em] text-brand-teal uppercase font-bold block mb-0.5">
                      NEW COLLECTION
                    </span>
                    <span className="font-serif text-[13px] text-brand-navy leading-snug font-medium block">
                      {slide.mainLabel}
                    </span>
                  </div>
                </div>

                {/* 3. RIGHT Supporting Card (z-20) */}
                <div
                  className="hidden xl:block absolute right-0 top-[80px] xl:top-[90px] w-[200px] xl:w-[220px] h-[330px] xl:h-[380px] z-20 rounded-xl overflow-hidden shadow-xl border border-white/20 bg-white p-1.5"
                >
                  <img
                    src={slide.detailImageRight}
                    alt="Fabric styling detail"
                    className="w-full h-full object-cover rounded-lg"
                  />
                  {/* Editorial label */}
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

              {/* Mobile layout: vertically stacked (hidden lg) */}
              <div className="lg:hidden flex flex-col items-center gap-6 mt-4 w-full max-w-[440px] mx-auto z-20">
                {/* Main Image */}
                <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden shadow-xl bg-white border border-brand-powder/40 p-1.5">
                  <img
                    src={slide.mainImage}
                    alt={slide.mainLabel}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm px-3.5 py-2 shadow-lg border-l-[3px] border-brand-teal rounded-r-sm max-w-[180px]">
                    <span className="font-sans text-[8px] tracking-[0.2em] text-brand-teal uppercase font-bold block">
                      NEW COLLECTION
                    </span>
                    <span className="font-serif text-[12px] text-brand-navy leading-tight block font-medium">
                      {slide.mainLabel}
                    </span>
                  </div>
                </div>

                {/* Supporting Images side-by-side on Mobile */}
                <div className="grid grid-cols-2 gap-4 w-full">
                  <div className="relative aspect-[3/4.5] rounded-lg overflow-hidden shadow-md bg-white p-1 border border-brand-powder/20">
                    <img
                      src={slide.detailImageLeft}
                      alt="Detail left"
                      className="w-full h-full object-cover rounded-md"
                    />
                    <div className="absolute bottom-2 left-2 right-2 bg-white/95 p-2 border-l border-brand-teal rounded-r-xs">
                      <span className="font-sans text-[7px] tracking-wider text-brand-teal uppercase font-bold block">
                        {slide.leftLabel.eyebrow}
                      </span>
                      <span className="font-serif text-[9px] text-brand-navy leading-none block truncate font-medium">
                        {slide.leftLabel.title.replace('\n', ' ')}
                      </span>
                    </div>
                  </div>

                  <div className="relative aspect-[3/4.5] rounded-lg overflow-hidden shadow-md bg-white p-1 border border-brand-powder/20">
                    <img
                      src={slide.detailImageRight}
                      alt="Detail right"
                      className="w-full h-full object-cover rounded-md"
                    />
                    <div className="absolute bottom-2 left-2 right-2 bg-white/95 p-2 border-l border-brand-teal rounded-r-xs">
                      <span className="font-sans text-[7px] tracking-wider text-brand-teal uppercase font-bold block">
                        {slide.rightLabel.eyebrow}
                      </span>
                      <span className="font-serif text-[9px] text-brand-navy leading-none block truncate font-medium">
                        {slide.rightLabel.title.replace('\n', ' ')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>

      {/* ── Prev / Next arrows — outer edges (z-50) ────── */}
      <button
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-50 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/90 hover:bg-white border border-brand-navy/10 text-brand-navy hover:text-brand-teal shadow-md transition-all duration-200 hover:scale-105 flex items-center justify-center"
      >
        <ArrowLeft size={16} strokeWidth={1.8} />
      </button>
      <button
        onClick={next}
        aria-label="Next slide"
        className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-50 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/90 hover:bg-white border border-brand-navy/10 text-brand-navy hover:text-brand-teal shadow-md transition-all duration-200 hover:scale-105 flex items-center justify-center"
      >
        <ArrowRight size={16} strokeWidth={1.8} />
      </button>

      {/* ── Dot indicators — no numbers (z-50) ────────── */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-400 ${i === current ? 'w-7 bg-brand-teal' : 'w-1.5 bg-brand-navy/20 hover:bg-brand-navy/40'
              }`}
          />
        ))}
      </div>

      {/* Keyframe */}
      <style>{`
        @keyframes heroFadeIn {
          from { opacity: 0; transform: translateX(14px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </section>
  );
}
