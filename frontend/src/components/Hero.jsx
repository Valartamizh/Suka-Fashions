import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Star } from 'lucide-react';
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

const SOCIAL_AVATAR_INITIALS = [
  { initial: 'S', bg: 'bg-brand-teal text-white' },
  { initial: 'A', bg: 'bg-[#B28756] text-white' },
  { initial: 'P', bg: 'bg-brand-navy text-white' },
  { initial: 'K', bg: 'bg-[#8B5A68] text-white' },
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

  // Preload all slide images for buttery-smooth zero-flicker transitions
  useEffect(() => {
    slides.forEach((s) => {
      if (s.mainImage) {
        const img = new Image();
        img.src = s.mainImage;
      }
      if (s.detailImageLeft) {
        const img = new Image();
        img.src = s.detailImageLeft;
      }
      if (s.detailImageRight) {
        const img = new Image();
        img.src = s.detailImageRight;
      }
    });
  }, [slides]);

  // Guard if current index is out of range
  useEffect(() => {
    if (current >= slides.length && slides.length > 0) {
      setCurrent(0);
    }
  }, [slides.length, current]);

  const goTo = useCallback((idx) => {
    if (animating || slides.length <= 1) return;
    setAnimating(true);
    setCurrent(idx);
    setTimeout(() => setAnimating(false), 500);
  }, [animating, slides.length]);

  const next = useCallback(() => {
    if (slides.length <= 1) return;
    setCurrent((prevIdx) => (prevIdx + 1) % slides.length);
  }, [slides.length]);

  const prev = useCallback(() => {
    if (slides.length <= 1) return;
    setCurrent((prevIdx) => (prevIdx - 1 + slides.length) % slides.length);
  }, [slides.length]);

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
          {(Boolean(slide.ctaText?.trim()) || Boolean(slide.secondaryCtaText?.trim())) && (
            <div className="flex items-center gap-2 mb-3 min-[390px]:mb-3.5">
              {Boolean(slide.ctaText?.trim()) && (
                <Link
                  to={slide.ctaLink || '/products'}
                  className="bg-brand-teal hover:bg-brand-tealDark text-white font-sans text-[9.5px] min-[390px]:text-[10px] sm:text-xs font-bold tracking-[0.18em] uppercase py-2.5 px-4 min-[390px]:px-5 transition-all shadow-md rounded-sm whitespace-nowrap"
                >
                  {slide.ctaText.trim()}
                </Link>
              )}
              {Boolean(slide.secondaryCtaText?.trim()) && (
                <Link
                  to={slide.secondaryCtaLink || '/category/sarees'}
                  className="border border-white/40 bg-white/10 backdrop-blur-xs text-white hover:bg-white/20 font-sans text-[9.5px] min-[390px]:text-[10px] sm:text-xs font-bold tracking-[0.18em] uppercase py-2.5 px-3.5 min-[390px]:px-4 transition-all rounded-sm whitespace-nowrap"
                >
                  {slide.secondaryCtaText.trim()}
                </Link>
              )}
            </div>
          )}

          {/* Bottom Bar: Social proof + Dot indicators */}
          <div className="flex items-center justify-between pt-2.5 min-[390px]:pt-3 border-t border-white/20">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-1.5">
                {SOCIAL_AVATAR_INITIALS.slice(0, 3).map((item, i) => (
                  <div
                    key={i}
                    className={`w-6 h-6 rounded-full border border-white flex items-center justify-center font-serif text-[9px] font-bold shadow-xs select-none ${item.bg}`}
                  >
                    {item.initial}
                  </div>
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
        className="hidden lg:flex relative w-full overflow-hidden min-h-[520px] lg:min-h-[580px] xl:min-h-[640px] 2xl:min-h-[680px] items-center py-6 lg:py-8 2xl:py-12"
        style={{ background: `linear-gradient(140deg, #FAFAF8 52%, ${slide.accentBg || '#EBF5F5'} 100%)` }}
      >
        {/* Teal flowing fabric wave background */}
        <div className="absolute inset-0 z-1 pointer-events-none">
          <HeroWaves />
        </div>

        {/* Top-right accent glow */}
        <div
          className="absolute -top-24 -right-24 w-[380px] 2xl:w-[480px] h-[380px] 2xl:h-[480px] rounded-full blur-3xl opacity-20 pointer-events-none transition-colors duration-1000 z-0"
          style={{ background: slide.accentBg || '#EBF5F5' }}
        />

        {/* Main content */}
        <div className="relative z-10 w-full">
          <div className="max-w-[1720px] mx-auto px-6 sm:px-8 lg:px-12 xl:px-16 2xl:px-20">

            <div
              key={slide.id || current}
              className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] xl:grid-cols-[0.85fr_1.15fr] 2xl:grid-cols-[1fr_1.2fr] gap-8 lg:gap-10 xl:gap-14 2xl:gap-20 items-center"
              style={{ animation: 'heroFadeIn 0.65s cubic-bezier(0.16,1,0.3,1) both' }}
            >
              {/* ── LEFT: Text Content ───────────────────── */}
              <div className="flex flex-col justify-center text-left max-w-xl 2xl:max-w-2xl z-10">

                {/* Eyebrow */}
                <span className="font-sans text-[10px] sm:text-xs 2xl:text-sm font-bold tracking-[0.32em] text-brand-teal uppercase mb-3.5">
                  {slide.eyebrow}
                </span>

                {/* Main heading */}
                <h1 className="font-serif text-4xl sm:text-5xl lg:text-[3.6rem] xl:text-6xl 2xl:text-7xl font-normal text-brand-navy leading-[1.08] mb-3">
                  {headingLines.map((line, i) => (
                    <span key={i} className="block">{line}</span>
                  ))}
                </h1>

                {/* Decorative line */}
                <div className="w-10 2xl:w-14 h-[2px] bg-brand-teal mb-4" />

                {/* Subtitle */}
                <p className="font-sans text-sm lg:text-[15px] 2xl:text-base text-brand-navy/65 leading-relaxed font-light mb-7 sm:mb-8 max-w-md 2xl:max-w-lg">
                  {slide.subtitle}
                </p>

                {/* CTA Buttons */}
                {(Boolean(slide.ctaText?.trim()) || Boolean(slide.secondaryCtaText?.trim())) && (
                  <div className="flex flex-wrap items-center gap-3.5 mb-8">
                    {Boolean(slide.ctaText?.trim()) && (
                      <Link
                        to={slide.ctaLink || '/products'}
                        className="bg-brand-teal hover:bg-brand-tealDark text-white font-sans text-[11px] sm:text-xs 2xl:text-sm font-bold tracking-[0.22em] uppercase py-3.5 2xl:py-4 px-8 2xl:px-10 transition-all duration-300 shadow-md hover:shadow-lg rounded-sm"
                      >
                        {slide.ctaText.trim()}
                      </Link>
                    )}
                    {Boolean(slide.secondaryCtaText?.trim()) && (
                      <Link
                        to={slide.secondaryCtaLink || '/category/sarees'}
                        className="border border-brand-navy/25 text-brand-navy hover:border-brand-teal hover:text-brand-teal font-sans text-[11px] sm:text-xs 2xl:text-sm font-bold tracking-[0.22em] uppercase py-3.5 2xl:py-4 px-7 2xl:px-9 transition-all duration-300 rounded-sm bg-white/60"
                      >
                        {slide.secondaryCtaText.trim()}
                      </Link>
                    )}
                  </div>
                )}

                {/* Social proof */}
                <div className="flex items-center gap-3.5 pt-3.5 border-t border-brand-navy/10 max-w-md 2xl:max-w-lg">
                  <div className="flex -space-x-2">
                    {SOCIAL_AVATAR_INITIALS.map((item, i) => (
                      <div
                        key={i}
                        className={`w-8 h-8 sm:w-9 sm:h-9 2xl:w-10 2xl:h-10 rounded-full border-2 border-white flex items-center justify-center font-serif text-xs sm:text-sm 2xl:text-base font-bold shadow-sm select-none ${item.bg}`}
                      >
                        {item.initial}
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="flex items-center gap-0.5 mb-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} size={11} className="fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="font-sans text-[10px] 2xl:text-xs text-brand-navy/60 tracking-[0.14em] uppercase font-semibold">
                      {heroContent?.socialProofText ? heroContent.socialProofText.toUpperCase() : 'LOVED BY 10,000+ WOMEN'}
                    </span>
                  </div>
                </div>

              </div>

              {/* ── RIGHT: Editorial Image Composition ────── */}
              <div className="relative w-full flex items-center justify-center lg:justify-end">

                {/* Desktop composition (lg:flex) */}
                <div className="relative flex items-center justify-center w-full max-w-[560px] xl:max-w-[620px] 2xl:max-w-[720px] h-[480px] xl:h-[530px] 2xl:h-[600px] select-none mx-auto lg:mr-0">
                  
                  {/* 1. LEFT Detail Card */}
                  <div className="absolute left-1 xl:left-0 top-[60px] xl:top-[80px] 2xl:top-[90px] w-[150px] lg:w-[160px] xl:w-[195px] 2xl:w-[230px] h-[270px] lg:h-[280px] xl:h-[330px] 2xl:h-[390px] z-20 rounded-xl overflow-hidden shadow-xl border border-white/40 bg-white p-1.5 transition-transform duration-500 hover:scale-105">
                    <img
                      src={slide.detailImageLeft}
                      alt="Craftsmanship detail"
                      className="w-full h-full object-cover object-top rounded-lg"
                    />
                  </div>

                  {/* 2. MAIN Fashion Card (Center) */}
                  <div className="relative z-30 w-[290px] lg:w-[310px] xl:w-[370px] 2xl:w-[430px] h-[430px] lg:h-[450px] xl:h-[510px] 2xl:h-[580px] rounded-2xl overflow-hidden shadow-2xl bg-white border border-brand-powder/40 p-2 transform hover:scale-[1.02] transition-transform duration-500">
                    <img
                      src={slide.mainImage}
                      alt={slide.mainLabel || 'New Collection'}
                      className="w-full h-full object-cover object-top rounded-xl"
                    />
                  </div>

                  {/* 3. RIGHT Detail Card */}
                  <div className="absolute right-1 xl:right-0 top-[70px] xl:top-[90px] 2xl:top-[100px] w-[155px] lg:w-[165px] xl:w-[200px] 2xl:w-[235px] h-[280px] lg:h-[290px] xl:h-[340px] 2xl:h-[400px] z-20 rounded-xl overflow-hidden shadow-xl border border-white/40 bg-white p-1.5 transition-transform duration-500 hover:scale-105">
                    <img
                      src={slide.detailImageRight}
                      alt="Fabric styling detail"
                      className="w-full h-full object-cover object-top rounded-lg"
                    />
                  </div>

                </div>

              </div>

            </div>

            {/* Slide Navigation Controls */}
            {slides.length > 1 && (
              <div className="flex items-center justify-start mt-6 lg:mt-8 pt-4 border-t border-brand-navy/10 z-20">
                <div className="flex items-center gap-2">
                  {slides.map((s, idx) => (
                    <button
                      key={s.id || idx}
                      onClick={() => goTo(idx)}
                      className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                        idx === current ? 'w-8 bg-brand-teal' : 'w-2 bg-brand-navy/20 hover:bg-brand-navy/40'
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </section>
    </>
  );
}
