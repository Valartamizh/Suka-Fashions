import React from 'react';
import { useReveal } from '../hooks/useReveal';

const InstagramSVG = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const images = [
  {
    url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=500&auto=format&fit=crop',
    alt: 'Teal saree editorial shot',
  },
  {
    url: 'https://images.unsplash.com/photo-1608748010899-18f300247112?q=80&w=500&auto=format&fit=crop',
    alt: 'Floral kurti look',
  },
  {
    url: 'https://images.unsplash.com/photo-1596783074918-c84cb06531ca?q=80&w=500&auto=format&fit=crop',
    alt: 'Sequin lehenga detail',
  },
  {
    url: 'https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?q=80&w=500&auto=format&fit=crop',
    alt: 'Anarkali dress fashion editorial',
  },
  {
    url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=500&auto=format&fit=crop',
    alt: 'Bridal lehenga close-up',
  },
  {
    url: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=500&auto=format&fit=crop',
    alt: 'Ivory handloom anarkali',
  },
  {
    url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=500&auto=format&fit=crop',
    alt: 'Blush pink co-ord set',
  },
  {
    url: 'https://images.unsplash.com/photo-1610030470224-34537bb26732?q=80&w=500&auto=format&fit=crop',
    alt: 'Gold Kanchipuram saree',
  },
];

export default function InstagramGallery() {
  const sectionRef = useReveal();

  return (
    <section ref={sectionRef} className="py-16 sm:py-20 bg-white border-b border-brand-powder/30">

      {/* Heading */}
      <div className="text-center mb-8 px-4 reveal">
        <p className="font-sans text-[10px] tracking-[0.28em] text-brand-teal uppercase font-semibold mb-3">
          Instagram
        </p>
        <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-light text-brand-navy tracking-wider uppercase">
          Follow @SukaFashions
        </h2>
        <div className="section-divider" />
        <p className="font-sans text-xs text-brand-navy/45 mt-4">
          Tag us in your looks for a chance to be featured
        </p>
      </div>

      {/* Gallery grid — full width, no horizontal padding */}
      <div className="reveal reveal-delay-1 grid grid-cols-4 lg:grid-cols-8 gap-1 px-1">
        {images.map((img, i) => (
          <a
            key={i}
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block aspect-square overflow-hidden bg-brand-cream"
            aria-label={`View on Instagram: ${img.alt}`}
          >
            <img
              src={img.url}
              alt={img.alt}
              className="w-full h-full object-cover transition-transform duration-600 group-hover:scale-108"
              loading="lazy"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-brand-teal/75 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="transform scale-75 group-hover:scale-100 transition-transform duration-300">
                <InstagramSVG size={26} />
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center mt-8 reveal">
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 font-sans text-[11px] tracking-[0.2em] uppercase font-semibold text-brand-teal border border-brand-teal px-7 py-3 hover:bg-brand-teal hover:text-white transition-all duration-300"
        >
          <InstagramSVG size={14} />
          Follow Us on Instagram
        </a>
      </div>

    </section>
  );
}
