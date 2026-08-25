import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const slides = [
  {
    id: 1,
    eyebrow:  'TIMELESS WEAVES. MODERN YOU.',
    heading:  ['Elegance,', 'Made for You.'],
    subtitle: 'Contemporary Style. Timeless Tradition.',
    image:    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=90&w=900&auto=format&fit=crop',
    accentBg: '#E8F5F6',
  },
  {
    id: 2,
    eyebrow:  'FESTIVE COUTURE',
    heading:  ['Grace in', 'Every Drape.'],
    subtitle: 'Intricate embroideries. Premium organza weaves.',
    image:    'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=90&w=900&auto=format&fit=crop',
    accentBg: '#F7EFF5',
  },
  {
    id: 3,
    eyebrow:  'HERITAGE LEHENGAS',
    heading:  ['Royal', 'Occasions.'],
    subtitle: 'Experience royalty in our signature sequin collections.',
    image:    'https://images.unsplash.com/photo-1596783074918-c84cb06531ca?q=90&w=900&auto=format&fit=crop',
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
  const [current,   setCurrent]   = useState(0);
  const [animating, setAnimating] = useState(false);

  const goTo = useCallback((idx) => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => setAnimating(false), 700);
    setCurrent(idx);
  }, [animating]);

  const next = useCallback(() => goTo((current + 1) % slides.length),              [current, goTo]);
  const prev = useCallback(() => goTo((current - 1 + slides.length) % slides.length), [current, goTo]);

  useEffect(() => {
    const t = setInterval(next, 7000);
    return () => clearInterval(t);
  }, [next]);

  const slide = slides[current];

  return (
    <section
      className="relative w-full overflow-hidden bg-brand-cream min-h-[580px] sm:min-h-[640px] lg:min-h-[680px] flex items-center"
      style={{ background: `linear-gradient(135deg, #FAF9F6 55%, ${slide.accentBg} 100%)` }}
    >
      {/* ── Decorative blobs ──────────────────────────────── */}
      <div
        className="absolute -top-20 -right-20 w-[420px] h-[420px] rounded-full blur-3xl opacity-50 pointer-events-none transition-colors duration-1000"
        style={{ background: slide.accentBg }}
      />
      <div className="absolute -bottom-10 -left-16 w-[340px] h-[340px] rounded-full blur-3xl opacity-30 bg-brand-powder pointer-events-none" />

      {/* ── Subtle fabric arc decoration ─────────────────── */}
      <div className="absolute right-[38%] top-1/3 w-64 h-80 border border-brand-powder/40 rounded-[40%_60%_65%_35%] pointer-events-none rotate-12 scale-125 opacity-30" />

      {/* ── Main content ─────────────────────────────────── */}
      <div className="relative z-10 w-full py-12 lg:py-0">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">

          {/* Content transitions */}
          <div
            key={slide.id}
            className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center"
            style={{ animation: 'heroFadeIn 0.65s cubic-bezier(0.16,1,0.3,1) both' }}
          >
            {/* ── LEFT: Text ─────────────────────────────── */}
            <div className="flex flex-col justify-center text-left max-w-lg">

              {/* Eyebrow */}
              <span className="font-sans text-[10px] sm:text-xs font-semibold tracking-[0.32em] text-brand-teal uppercase mb-5">
                {slide.eyebrow}
              </span>

              {/* Main heading */}
              <h1 className="font-serif text-[2.6rem] sm:text-5xl lg:text-[4.2rem] font-light text-brand-navy leading-[1.08] mb-5">
                {slide.heading.map((line, i) => (
                  <span key={i} className="block">{line}</span>
                ))}
              </h1>

              {/* Decorative line */}
              <div className="w-10 h-[1.5px] bg-brand-teal mb-5" />

              {/* Subtitle */}
              <p className="font-sans text-sm sm:text-base text-brand-navy/60 leading-relaxed font-light mb-8">
                {slide.subtitle}
              </p>

              {/* CTA buttons */}
              <div className="flex flex-wrap items-center gap-4 mb-9">
                <Link
                  to="/products"
                  className="bg-brand-teal hover:bg-brand-tealDark text-white font-sans text-[10px] sm:text-xs font-semibold tracking-[0.22em] uppercase py-4 px-9 transition-all duration-300 shadow-md hover:shadow-lg rounded-sm"
                >
                  SHOP NEW ARRIVALS
                </Link>
                <Link
                  to="/category/sarees"
                  className="border border-brand-navy/20 text-brand-navy hover:border-brand-teal hover:text-brand-teal font-sans text-[10px] sm:text-xs font-semibold tracking-[0.22em] uppercase py-4 px-7 transition-all duration-300 rounded-sm"
                >
                  EXPLORE
                </Link>
              </div>

              {/* Social proof */}
              <div className="flex items-center gap-3 pt-4 border-t border-brand-navy/8">
                <div className="flex -space-x-2.5">
                  {AVATAR_URLS.map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt="Happy customer"
                      className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-sm"
                      loading="lazy"
                    />
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-0.5 mb-0.5">
                    {[1,2,3,4,5].map((s) => (
                      <Star key={s} size={10} className="fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="font-sans text-[10px] text-brand-navy/55 tracking-wider uppercase font-medium">
                    Loved by 10,000+ Women
                  </span>
                </div>
              </div>

            </div>

            {/* ── RIGHT: Fashion Photography ─────────────── */}
            <div className="relative flex justify-center lg:justify-end items-center">
              {/* Soft glow behind image */}
              <div
                className="absolute inset-4 rounded-[50%_50%_40%_60%] blur-2xl opacity-40 transition-colors duration-1000"
                style={{ background: slide.accentBg }}
              />

              {/* Image frame */}
              <div className="relative w-full max-w-[400px] lg:max-w-[440px] aspect-[3/4] overflow-hidden shadow-2xl rounded-sm bg-white border border-brand-powder/40 p-2">
                <img
                  src={slide.image}
                  alt="Suka Fashions featured ethnic wear"
                  className="w-full h-full object-cover transition-transform duration-[7000ms] ease-out scale-105 hover:scale-100"
                  loading="eager"
                />

                {/* Floating label */}
                <div className="absolute bottom-5 left-5 bg-white/90 backdrop-blur-sm px-4 py-2.5 shadow-lg border-l-2 border-brand-teal">
                  <span className="font-sans text-[9px] tracking-[0.2em] text-brand-teal uppercase font-semibold block">
                    New Collection
                  </span>
                  <span className="font-serif text-sm text-brand-navy">
                    {slide.heading.join(' ')}
                  </span>
                </div>
              </div>

              {/* Slide counter */}
              <div className="absolute top-4 right-0 lg:-right-2 flex flex-col items-end gap-1">
                <span className="font-sans text-xs font-bold text-brand-teal">
                  0{current + 1}
                </span>
                <div className="w-8 h-[1px] bg-brand-navy/20" />
                <span className="font-sans text-[10px] text-brand-navy/30">
                  0{slides.length}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── Prev / Next arrows ───────────────────────────── */}
      <button
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-3 sm:left-5 z-20 p-2.5 rounded-full bg-white/80 hover:bg-white border border-brand-navy/8 text-brand-navy hover:text-brand-teal shadow-md transition-all duration-200 hover:scale-105"
      >
        <ArrowLeft size={15} strokeWidth={1.8} />
      </button>
      <button
        onClick={next}
        aria-label="Next slide"
        className="absolute right-3 sm:right-5 z-20 p-2.5 rounded-full bg-white/80 hover:bg-white border border-brand-navy/8 text-brand-navy hover:text-brand-teal shadow-md transition-all duration-200 hover:scale-105"
      >
        <ArrowRight size={15} strokeWidth={1.8} />
      </button>

      {/* ── Dot indicators ───────────────────────────────── */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Slide ${i + 1}`}
            className={`h-1 rounded-full transition-all duration-400 ${
              i === current ? 'w-8 bg-brand-teal' : 'w-2 bg-brand-navy/20 hover:bg-brand-navy/40'
            }`}
          />
        ))}
      </div>

      {/* ── Keyframe for slide transition ─────────────────── */}
      <style>{`
        @keyframes heroFadeIn {
          from { opacity: 0; transform: translateX(16px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </section>
  );
}
