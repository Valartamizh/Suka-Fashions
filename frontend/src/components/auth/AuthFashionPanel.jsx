import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.jpg';

const FASHION_SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=90&w=900&auto=format&fit=crop',
    tag: 'HERITAGE SAREES',
    title: 'Elegance, Made for You.',
    subtitle: 'Timeless handcrafted sarees designed for life\'s grandest celebrations.'
  },
  {
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=90&w=900&auto=format&fit=crop',
    tag: 'ROYAL LEHENGAS',
    title: 'Grace in Every Detail.',
    subtitle: 'Exquisite zari work and rich fabrics that make every event unforgettable.'
  },
  {
    image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?q=90&w=900&auto=format&fit=crop',
    tag: 'DESIGNER KURTIS',
    title: 'Everyday Sophistication.',
    subtitle: 'Breathable cottons & opulent silks tailored for effortless daily charm.'
  },
  {
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=90&w=900&auto=format&fit=crop',
    tag: 'FUSION COLLECTION',
    title: 'Modern Royal Silhouettes.',
    subtitle: 'Contemporary fusion dresses crafted with traditional artisanal weaves.'
  }
];

export default function AuthFashionPanel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-rotate slideshow every 3.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % FASHION_SLIDES.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const currentSlide = FASHION_SLIDES[currentIndex];

  return (
    <div className="hidden md:flex md:w-1/2 lg:w-[48%] relative bg-slate-950 overflow-hidden group min-h-[560px] lg:min-h-[640px] select-none self-stretch">
      
      {/* Background Images Cross-Fade Slideshow */}
      {FASHION_SLIDES.map((slide, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            idx === currentIndex ? 'opacity-100 z-0' : 'opacity-0 -z-10'
          }`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover transform scale-105 transition-transform duration-[6000ms] ease-out"
            loading={idx === 0 ? 'eager' : 'lazy'}
          />
        </div>
      ))}

      {/* High-Contrast Gradient Overlays for Guaranteed Text Legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/30 z-10" />

      {/* Prominent Brand Logo pill at top */}
      <div className="absolute top-8 left-8 z-20">
        <Link to="/" className="flex items-center gap-3.5 bg-white/85 backdrop-blur-md px-4.5 py-2.5 rounded-full border border-white/70 shadow-xl hover:bg-white/95 transition-all">
          <img src={logo} alt="Suka Logo" className="w-11 h-11 rounded-full object-cover border-2 border-brand-teal/20 shadow-md" />
          <div className="flex flex-col text-left leading-none">
            <span className="font-serif font-bold text-brand-navy text-xl tracking-wider">Suka</span>
            <span className="font-sans text-[8.5px] tracking-[0.35em] text-brand-teal font-extrabold uppercase mt-1">FASHIONS</span>
          </div>
        </Link>
      </div>

      {/* High-Visibility Editorial Content Overlay */}
      <div className="absolute bottom-10 left-8 right-8 z-20 text-white text-left animate-in fade-in duration-500">
        <span className="font-sans text-[10px] uppercase tracking-[0.3em] font-extrabold text-white bg-brand-teal px-3.5 py-1.5 rounded-full inline-block mb-3 shadow-lg border border-white/20">
          {currentSlide.tag}
        </span>

        <h2 className="font-serif text-3xl lg:text-4xl font-normal text-white leading-snug mb-2 drop-shadow-lg tracking-wide">
          {currentSlide.title}
        </h2>

        <p className="font-sans text-xs sm:text-sm text-white/95 font-normal tracking-wide max-w-sm drop-shadow-md leading-relaxed mb-6">
          {currentSlide.subtitle}
        </p>

        {/* Carousel Indicators / Dots */}
        <div className="flex items-center gap-2">
          {FASHION_SLIDES.map((_, dotIdx) => (
            <button
              key={dotIdx}
              onClick={() => setCurrentIndex(dotIdx)}
              aria-label={`Go to slide ${dotIdx + 1}`}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                dotIdx === currentIndex ? 'w-8 bg-brand-teal shadow-md' : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      </div>

    </div>
  );
}
