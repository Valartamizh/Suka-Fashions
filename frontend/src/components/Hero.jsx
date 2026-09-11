import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ArrowLeft, ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import HeroWaves from './HeroWaves';
import { useContent } from '../context/ContentContext';

import lehengaRed from '../assets/lehenga_red.jpg';
import lehengaPink from '../assets/lehenga_pink.jpg';
import lehengaMint from '../assets/lehenga_mint.jpg';
import sareeGolden from '../assets/saree_golden.jpg';
import sareeBeigeMaroon from '../assets/saree_beige_maroon.jpg';
import sareeBeigeOrange from '../assets/saree_beige_orange.jpg';
import anarkaliBlackMulti from '../assets/anarkali_black_multicolor.jpg';
import kurtiPurplePrinted from '../assets/kurti_purple_printed.jpg';
import coordSet from '../assets/coord_set.jpg';

const defaultSlides = [
  {
    id: 1,
    eyebrow: 'HERITAGE LEHENGAS',
    headingLine1: 'Royal',
    headingLine2: 'Occasions.',
    subtitle: 'Experience royalty in our signature sequin & velvet lehenga collections.',
    mainImage: lehengaRed,
    detailImageLeft: lehengaPink,
    detailImageRight: lehengaMint,
    mainLabel: 'Royal Occasions.',
    leftEyebrow: 'DETAILS',
    leftTitle: 'Handcrafted\nembroidery',
    rightEyebrow: 'THE EDIT',
    rightTitle: 'Timeless celebration\nwear',
    ctaText: 'SHOP NEW ARRIVALS',
    ctaLink: '/products',
    secondaryCtaText: 'EXPLORE SAREES',
    secondaryCtaLink: '/category/sarees',
    accentBg: '#EBF5F5',
    enabled: true,
  },
  {
    id: 2,
    eyebrow: 'FESTIVE COUTURE',
    headingLine1: 'Grace in',
    headingLine2: 'Every Drape.',
    subtitle: 'Intricate embroideries. Premium organza & Kanchipuram silk drapes.',
    mainImage: sareeGolden,
    detailImageLeft: sareeBeigeMaroon,
    detailImageRight: sareeBeigeOrange,
    mainLabel: 'Grace in Every Drape.',
    leftEyebrow: 'DETAILS',
    leftTitle: 'Exquisite organza\ndetails',
    rightEyebrow: 'THE EDIT',
    rightTitle: 'Modern festive\nsilhouettes',
    ctaText: 'EXPLORE SAREES',
    ctaLink: '/category/sarees',
    secondaryCtaText: 'NEW ARRIVALS',
    secondaryCtaLink: '/products',
    accentBg: '#E8F3F5',
    enabled: true,
  },
  {
    id: 3,
    eyebrow: 'TIMELESS WEAVES',
    headingLine1: 'Elegance,',
    headingLine2: 'Made for You.',
    subtitle: 'Contemporary silhouettes rooted in timeless Indian tradition.',
    mainImage: anarkaliBlackMulti,
    detailImageLeft: kurtiPurplePrinted,
    detailImageRight: coordSet,
    mainLabel: 'Elegance, Made for You.',
    leftEyebrow: 'DETAILS',
    leftTitle: 'Traditional zardozi\ncraft',
    rightEyebrow: 'THE EDIT',
    rightTitle: 'Heritage premium\nweaves',
    ctaText: 'DISCOVER ALL',
    ctaLink: '/products',
    secondaryCtaText: 'VIEW ALL',
    secondaryCtaLink: '/products',
    accentBg: '#EBF4F5',
    enabled: true,
  },
];

const AVATAR_URLS = [
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=80&auto=format&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=80&auto=format&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=80&auto=format&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=80&auto=format&fit=crop&crop=face',
];

export default function Hero() {
  const { getSectionContent } = useContent();
  const heroContent = getSectionContent('hero');

  const slides = useMemo(() => {
    if (heroContent?.slides && Array.isArray(heroContent.slides) && heroContent.slides.length > 0) {
      const activeOnly = heroContent.slides.filter(s => s.enabled !== false && s.active !== false);
      if (activeOnly.length > 0) {
        return activeOnly.map((s, idx) => {
          const def = defaultSlides[idx % defaultSlides.length];
          return {
            ...def,
            ...s,
            mainImage: s.mainImage || def.mainImage,
            detailImageLeft: s.detailImageLeft || def.detailImageLeft,
            detailImageRight: s.detailImageRight || def.detailImageRight,
          };
        });
      }
    }
    return defaultSlides;
  }, [heroContent]);

  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  // Guard if current index is out of range
  useEffect(() => {
    if (current >= slides.length) {
      setCurrent(0);
    }
  }, [slides.length, current]);

  const goTo = useCallback((idx) => {
    if (animating || slides.length <= 1) return;
    setAnimating(true);
    setTimeout(() => setAnimating(false), 700);
    setCurrent(idx);
  }, [animating, slides.length]);

  const next = useCallback(() => {
    if (slides.length <= 1) return;
    goTo((current + 1) % slides.length);
  }, [current, goTo, slides.length]);

  const prev = useCallback(() => {
    if (slides.length <= 1) return;
    goTo((current - 1 + slides.length) % slides.length);
  }, [current, goTo, slides.length]);

  // Touch / swipe support for mobile
  const touchStartX = React.useRef(null);
  const touchEndX = React.useRef(null);
  const SWIPE_THRESHOLD = 50;

  const handleTouchStart = useCallback((e) => {
    touchStartX.current = e.changedTouches[0].clientX;
    touchEndX.current = null;
  }, []);

  const handleTouchMove = useCallback((e) => {
    touchEndX.current = e.changedTouches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const delta = touchStartX.current - touchEndX.current;
    if (Math.abs(delta) >= SWIPE_THRESHOLD) {
      if (delta > 0) next(); // swiped left → next slide
      else prev();            // swiped right → prev slide
    }
    touchStartX.current = null;
    touchEndX.current = null;
  }, [next, prev]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const intervalSeconds = (heroContent?.autoplayInterval || 7) * 1000;
    const t = setInterval(next, intervalSeconds);
    return () => clearInterval(t);
  }, [next, heroContent?.autoplayInterval, slides.length]);

  const slide = slides[current] || defaultSlides[0];

  const headingLines = useMemo(() => {
    if (slide.heading && Array.isArray(slide.heading)) return slide.heading;
    const lines = [];
    if (slide.headingLine1) lines.push(slide.headingLine1);
    if (slide.headingLine2) lines.push(slide.headingLine2);
    if (lines.length > 0) return lines;
    if (slide.heading && typeof slide.heading === 'string') return slide.heading.split('\n');
    return ['Grace in', 'Every Drape.'];
  }, [slide]);

  return (
    <>
      {/* ── MOBILE / TABLET HERO (Background Image with Overlay) (< lg) ── */}
      <div
        className="relative lg:hidden w-full h-[380px] min-[375px]:h-[400px] min-[390px]:h-[425px] min-[430px]:h-[450px] sm:h-[490px] overflow-hidden flex items-end"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Background Image with smooth transition */}
        <div className="absolute inset-0 z-0">
          <img
            key={slide.id || current}
            src={slide.mainImage}
            alt={slide.mainLabel || 'Suka Fashions'}
            className="w-full h-full object-cover object-top transition-transform duration-1000 scale-105"
            style={{ animation: 'heroFadeIn 0.6s cubic-bezier(0.16,1,0.3,1) both' }}
          />
          {/* Rich luxury gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/95 via-brand-navy/60 to-black/25" />
        </div>

        {/* Content positioned on top of background image */}
        <div className="relative z-10 w-full p-4 min-[390px]:p-5 sm:p-8 text-left text-white" key={slide.id || current} style={{ animation: 'heroFadeIn 0.5s ease-out both' }}>
          {/* Eyebrow */}
          <span className="inline-block font-sans text-[8.5px] min-[390px]:text-[9px] sm:text-[10px] font-bold tracking-[0.3em] text-amber-300 uppercase mb-1 drop-shadow-xs">
            {slide.eyebrow}
          </span>

          {/* Heading */}
          <h1 className="font-serif text-xl min-[375px]:text-2xl sm:text-4xl text-white font-normal leading-tight mb-1.5 drop-shadow-sm">
            {headingLines.join(' ')}
          </h1>

          {/* Subtitle */}
          <p className="font-sans text-[11px] min-[390px]:text-[11.5px] sm:text-xs text-white/90 leading-relaxed font-light mb-3 min-[390px]:mb-3.5 max-w-sm drop-shadow-xs line-clamp-2">
            {slide.subtitle}
          </p>

          {/* CTA Buttons */}
          <div className="flex items-center gap-2 mb-3 min-[390px]:mb-3.5">
            <Link
              to={slide.ctaLink || '/products'}
              className="bg-brand-teal hover:bg-brand-tealDark text-white font-sans text-[9.5px] min-[390px]:text-[10px] sm:text-xs font-bold tracking-[0.18em] uppercase py-2.5 px-4 min-[390px]:px-5 transition-all shadow-md rounded-sm whitespace-nowrap"
            >
              {slide.ctaText || 'Shop Collection'}
            </Link>
            <Link
              to={slide.secondaryCtaLink || '/category/sarees'}
              className="border border-white/40 bg-white/10 backdrop-blur-xs text-white hover:bg-white/20 font-sans text-[9.5px] min-[390px]:text-[10px] sm:text-xs font-bold tracking-[0.18em] uppercase py-2.5 px-3.5 min-[390px]:px-4 transition-all rounded-sm whitespace-nowrap"
            >
              {slide.secondaryCtaText || 'Explore'}
            </Link>
          </div>

          {/* Bottom Bar: Social proof + Dot indicators */}
          <div className="flex items-center justify-between pt-2.5 min-[390px]:pt-3 border-t border-white/20">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {AVATAR_URLS.slice(0, 3).map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt="Customer"
                    className="w-6 h-6 rounded-full border border-white object-cover"
                  />
                ))}
              </div>
              <div className="flex items-center gap-1">
                <div className="flex items-center text-amber-400">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={9} className="fill-amber-400" />
                  ))}
                </div>
                <span className="font-sans text-[8.5px] uppercase tracking-wider text-white/80 font-medium">
                  {heroContent?.socialProofText || '10k+ Loved'}
                </span>
              </div>
            </div>

            {/* Pagination Dots */}
            {slides.length > 1 && (
              <div className="flex items-center gap-1.5">
                {slides.map((s, idx) => (
                  <button
                    key={s.id || idx}
                    onClick={() => goTo(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                      idx === current ? 'w-5 bg-amber-400' : 'w-1.5 bg-white/50 hover:bg-white'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── DESKTOP HERO (2-column editorial with HeroWaves) (lg:flex) ── */}
      <section
        className="hidden lg:flex relative w-full overflow-hidden min-h-[500px] sm:min-h-[540px] lg:min-h-[580px] items-center py-6 lg:py-8"
        style={{ background: `linear-gradient(140deg, #FAFAF8 52%, ${slide.accentBg || '#EBF5F5'} 100%)` }}
      >
        {/* Teal flowing fabric wave background */}
        <div className="absolute inset-0 z-1 pointer-events-none">
          <HeroWaves />
        </div>

        {/* Top-right accent glow */}
        <div
          className="absolute -top-24 -right-24 w-[380px] h-[380px] rounded-full blur-3xl opacity-20 pointer-events-none transition-colors duration-1000 z-0"
          style={{ background: slide.accentBg || '#EBF5F5' }}
        />

        {/* Main content */}
        <div className="relative z-10 w-full">
          <div className="max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-12 xl:px-16 2xl:px-20">

            <div
              key={slide.id || current}
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
                  {headingLines.map((line, i) => (
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
                    to={slide.ctaLink || '/products'}
                    className="bg-brand-teal hover:bg-brand-tealDark text-white font-sans text-[11px] sm:text-xs font-bold tracking-[0.22em] uppercase py-3.5 px-8 transition-all duration-300 shadow-md hover:shadow-lg rounded-sm"
                  >
                    {slide.ctaText || 'SHOP NEW ARRIVALS'}
                  </Link>
                  <Link
                    to={slide.secondaryCtaLink || '/category/sarees'}
                    className="border border-brand-navy/25 text-brand-navy hover:border-brand-teal hover:text-brand-teal font-sans text-[11px] sm:text-xs font-bold tracking-[0.22em] uppercase py-3.5 px-7 transition-all duration-300 rounded-sm bg-white/60"
                  >
                    {slide.secondaryCtaText || 'EXPLORE'}
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
                      {heroContent?.socialProofText ? heroContent.socialProofText.toUpperCase() : 'LOVED BY 10,000+ WOMEN'}
                    </span>
                  </div>
                </div>

              </div>

              {/* ── RIGHT: Editorial Image Composition ────── */}
              <div className="relative w-full flex items-center justify-center">

                {/* Desktop composition (lg:flex) */}
                <div className="relative flex items-center justify-center w-full h-[480px] xl:h-[530px] select-none">
                  
                  {/* 1. LEFT Detail Card */}
                  <div className="absolute left-0 top-[60px] xl:top-[80px] w-[160px] xl:w-[195px] h-[280px] xl:h-[330px] z-20 rounded-xl overflow-hidden shadow-xl border border-white/40 bg-white p-1.5 transition-transform duration-500">
                    <img
                      src={slide.detailImageLeft}
                      alt="Craftsmanship detail"
                      className="w-full h-full object-cover object-top rounded-lg"
                    />
                    <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-sm p-2.5 shadow-md border-l-2 border-brand-teal rounded-r-xs z-40">
                      <span className="font-sans text-[8px] tracking-[0.2em] text-brand-teal uppercase font-bold block mb-0.5">
                        {slide.leftEyebrow || 'DETAILS'}
                      </span>
                      <span className="font-serif text-[11px] text-brand-navy leading-tight block whitespace-pre-line font-medium">
                        {slide.leftTitle || 'Handcrafted embroidery'}
                      </span>
                    </div>
                  </div>

                  {/* 2. MAIN Fashion Card (Center) */}
                  <div className="relative z-30 w-[310px] xl:w-[380px] h-[450px] xl:h-[510px] rounded-2xl overflow-hidden shadow-2xl bg-white border border-brand-powder/40 p-2 transform hover:scale-[1.01] transition-transform duration-500">
                    <img
                      src={slide.mainImage}
                      alt={slide.mainLabel || 'New Collection'}
                      className="w-full h-full object-cover object-top rounded-xl"
                    />
                    <div className="absolute bottom-5 left-5 bg-white/95 backdrop-blur-sm px-4 py-2.5 shadow-xl border-l-[3px] border-brand-teal rounded-r-sm max-w-[210px] z-40">
                      <span className="font-sans text-[8px] tracking-[0.22em] text-brand-teal uppercase font-bold block mb-0.5">
                        NEW COLLECTION
                      </span>
                      <span className="font-serif text-[13px] text-brand-navy leading-snug font-medium block">
                        {slide.mainLabel || headingLines.join(' ')}
                      </span>
                    </div>
                  </div>

                  {/* 3. RIGHT Detail Card */}
                  <div className="absolute right-0 top-[70px] xl:top-[90px] w-[165px] xl:w-[200px] h-[290px] xl:h-[340px] z-20 rounded-xl overflow-hidden shadow-xl border border-white/40 bg-white p-1.5 transition-transform duration-500">
                    <img
                      src={slide.detailImageRight}
                      alt="Fabric styling detail"
                      className="w-full h-full object-cover object-top rounded-lg"
                    />
                    <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-sm p-2.5 shadow-md border-l-2 border-brand-teal rounded-r-xs z-40">
                      <span className="font-sans text-[8px] tracking-[0.2em] text-brand-teal uppercase font-bold block mb-0.5">
                        {slide.rightEyebrow || 'THE EDIT'}
                      </span>
                      <span className="font-serif text-[11px] text-brand-navy leading-tight block whitespace-pre-line font-medium">
                        {slide.rightTitle || 'Timeless celebration wear'}
                      </span>
                    </div>
                  </div>

                </div>

              </div>

            </div>

            {/* Slide Navigation Controls */}
            {slides.length > 1 && (
              <div className="flex items-center justify-between mt-6 lg:mt-8 pt-4 border-t border-brand-navy/10 z-20">
                <div className="flex items-center gap-2">
                  {slides.map((s, idx) => (
                    <button
                      key={s.id || idx}
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
                    className="w-9 h-9 rounded-full border border-brand-navy/20 flex items-center justify-center text-brand-navy hover:bg-brand-teal hover:text-white hover:border-brand-teal transition-all duration-200 cursor-pointer"
                    aria-label="Previous slide"
                  >
                    <ArrowLeft size={15} />
                  </button>
                  <button
                    onClick={next}
                    className="w-9 h-9 rounded-full border border-brand-navy/20 flex items-center justify-center text-brand-navy hover:bg-brand-teal hover:text-white hover:border-brand-teal transition-all duration-200 cursor-pointer"
                    aria-label="Next slide"
                  >
                    <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </section>
    </>
  );
}
