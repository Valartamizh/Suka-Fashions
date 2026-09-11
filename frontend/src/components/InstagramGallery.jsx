import React, { useMemo } from 'react';
import { useReveal } from '../hooks/useReveal';
import { useContent } from '../context/ContentContext';

import sareeGolden from '../assets/saree_golden.jpg';
import lehengaRed from '../assets/lehenga_red.jpg';
import lehengaPink from '../assets/lehenga_pink.jpg';
import anarkaliBlack from '../assets/anarkali_black.jpg';
import coordSet from '../assets/coord_set.jpg';
import dressNavy from '../assets/dress_navy.jpg';
import dupattaSilk from '../assets/dupatta_silk.jpg';
import festiveSuit from '../assets/festive_suit.jpg';

const InstagramSVG = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const defaultInstagramImages = [
  { id: 'ig-1', url: sareeGolden, alt: 'Teal saree editorial — Suka Fashions' },
  { id: 'ig-2', url: lehengaRed, alt: 'Bridal lehenga close-up — Suka Fashions' },
  { id: 'ig-3', url: anarkaliBlack, alt: 'Ivory handloom anarkali — Suka Fashions' },
  { id: 'ig-4', url: lehengaPink, alt: 'Blush pink co-ord set — Suka Fashions' },
  { id: 'ig-5', url: dressNavy, alt: 'Elegant kurta look — Suka Fashions' },
  { id: 'ig-6', url: coordSet, alt: 'Traditional ethnic wear — Suka Fashions' },
  { id: 'ig-7', url: dupattaSilk, alt: 'Embroidered dupatta — Suka Fashions' },
  { id: 'ig-8', url: festiveSuit, alt: 'Indian fashion editorial — Suka Fashions' },
];

function MarqueeImage({ img, handle, url }) {
  const targetUrl = url || `https://instagram.com/${handle.replace('@', '')}`;
  return (
    <a
      href={targetUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`View on Instagram: ${img.alt || 'Suka Fashions'}`}
      className="group relative flex-shrink-0 mx-1.5 overflow-hidden rounded-sm bg-brand-cream"
      style={{ width: 'clamp(170px, 18vw, 290px)', height: 'clamp(200px, 22vw, 340px)' }}
    >
      <img
        src={img.url}
        alt={img.alt || 'Suka Look'}
        loading="lazy"
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
      />
      <div className="absolute inset-0 bg-brand-navy/55 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="text-white transform scale-90 group-hover:scale-100 transition-transform duration-300 mb-2">
          <InstagramSVG size={28} />
        </div>
        <span className="font-sans text-[10px] text-white/90 uppercase tracking-[0.18em] font-semibold">
          View on Instagram
        </span>
      </div>
    </a>
  );
}

export default function InstagramGallery() {
  const sectionRef = useReveal();
  const { getSectionContent } = useContent();
  const content = getSectionContent('instagram');

  const handle = content?.handle || '@sukafashions';
  const url = content?.url || 'https://instagram.com/sukafashions';
  const title = content?.title || `Follow ${handle}`;
  const subtitle = content?.subtitle || 'Tag us in your looks for a chance to be featured';
  const followButtonText = content?.followButtonText || `Follow ${handle}`;
  const speed = content?.marqueeSpeed || 'Normal'; // 'Slow' | 'Normal' | 'Fast'

  const speedDuration = useMemo(() => {
    switch (speed) {
      case 'Slow': return '50s';
      case 'Fast': return '20s';
      case 'Normal':
      default: return '32s';
    }
  }, [speed]);

  const rawImages = useMemo(() => {
    if (content?.images && Array.isArray(content.images) && content.images.length > 0) {
      const activeOnly = content.images.filter(img => img.enabled !== false && img.active !== false);
      if (activeOnly.length > 0) {
        return activeOnly.map((img, i) => ({
          url: typeof img === 'string' ? img : img.url,
          alt: (typeof img === 'object' && img.alt) ? img.alt : `Suka Look ${i + 1}`,
        }));
      }
    }
    return defaultInstagramImages;
  }, [content]);

  // Duplicate for seamless infinite marquee loop
  const trackImages = useMemo(() => {
    return [...rawImages, ...rawImages];
  }, [rawImages]);

  return (
    <section ref={sectionRef} className="pt-4 pb-3 sm:py-6 lg:py-8 bg-white border-b border-brand-powder/30 overflow-hidden">

      {/* ── Section Heading ───────────────────────── */}
      <div className="text-center mb-3 sm:mb-4 px-4 reveal">
        <p className="font-sans text-[9.5px] sm:text-[10px] tracking-[0.28em] text-brand-teal uppercase font-semibold mb-1 sm:mb-2">
          {content?.eyebrow || 'Instagram Community'}
        </p>
        <h2 className="font-serif text-xl sm:text-3xl lg:text-4xl font-light text-brand-navy tracking-wider uppercase">
          {title}
        </h2>
        <div className="section-divider mt-1.5 sm:mt-2" />
        <p className="font-sans text-[11px] sm:text-xs text-brand-navy/55 mt-2 sm:mt-3">
          {subtitle}
        </p>
      </div>

      {/* ── Marquee Track — Full Width ─────────────── */}
      <div className="relative w-full">

        <div
          className="absolute left-0 top-0 bottom-0 z-10 pointer-events-none"
          style={{ width: '80px', background: 'linear-gradient(to right, white 0%, transparent 100%)' }}
          aria-hidden="true"
        />

        <div
          className="absolute right-0 top-0 bottom-0 z-10 pointer-events-none"
          style={{ width: '80px', background: 'linear-gradient(to left, white 0%, transparent 100%)' }}
          aria-hidden="true"
        />

        <div className="marquee-viewport w-full overflow-hidden cursor-pointer">
          <div
            className="marquee-track py-1"
            style={{ animationDuration: speedDuration }}
            aria-label="Instagram fashion gallery — scroll pauses on hover"
          >
            {trackImages.map((img, i) => (
              <MarqueeImage key={i} img={img} handle={handle} url={url} />
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA Button ──────────────────────────── */}
      <div className="text-center mt-3.5 sm:mt-6 reveal">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 font-sans text-[10px] sm:text-[11px] tracking-[0.2em] uppercase font-semibold text-brand-teal border border-brand-teal px-6 sm:px-8 py-2.5 sm:py-3 hover:bg-brand-teal hover:text-white transition-all duration-300 rounded-sm"
        >
          <InstagramSVG size={13} />
          {followButtonText}
        </a>
      </div>

    </section>
  );
}
