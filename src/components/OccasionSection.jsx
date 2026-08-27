import React from 'react';
import { Link } from 'react-router-dom';
import { Gem, Sparkles, Music2, Coffee, Briefcase, Flower2 } from 'lucide-react';
import { useReveal } from '../hooks/useReveal';

// Import local assets for 100% reliable image loading
import lehengaRed from '../assets/lehenga_red.jpg';
import sareeGolden from '../assets/saree_golden.jpg';
import sareeBeigeMaroon from '../assets/saree_beige_maroon.jpg';
import kurtiPurplePrinted from '../assets/kurti_purple_printed.jpg';
import dressNavy from '../assets/dress_navy.jpg';
import lehengaMint from '../assets/lehenga_mint.jpg';

const occasions = [
  {
    name: 'Wedding',
    subtitle: 'Bridal & Trousseau',
    icon: Gem,
    path: '/category/occasion',
    image: lehengaRed,
  },
  {
    name: 'Festive',
    subtitle: 'Puja & Celebrations',
    icon: Sparkles,
    path: '/category/occasion',
    image: sareeGolden,
  },
  {
    name: 'Party',
    subtitle: 'Cocktail & Evening',
    icon: Music2,
    path: '/category/occasion',
    image: sareeBeigeMaroon,
  },
  {
    name: 'Casual',
    subtitle: 'Chic Daily Comfort',
    icon: Coffee,
    path: '/category/occasion',
    image: kurtiPurplePrinted,
  },
  {
    name: 'Office',
    subtitle: 'Formal Elegance',
    icon: Briefcase,
    path: '/category/occasion',
    image: dressNavy,
  },
  {
    name: 'Haldi & Mehendi',
    subtitle: 'Vibrant Yellows',
    icon: Flower2,
    path: '/category/occasion',
    image: lehengaMint,
  },
];

export default function OccasionSection() {
  const sectionRef = useReveal();

  return (
    <section ref={sectionRef} className="py-12 lg:py-16 bg-white border-b border-brand-powder/30">
      <div className="max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-10 xl:px-14 2xl:px-16">

        {/* Heading */}
        <div className="text-center mb-10 reveal">
          <p className="font-sans text-[10px] tracking-[0.28em] text-brand-teal uppercase font-semibold mb-2">
            Style For Every Moment
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-light text-brand-navy tracking-wider uppercase">
            Shop By Occasion
          </h2>
          <div className="section-divider" />
        </div>

        {/* Grid of Occasion Image Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {occasions.map((occ, idx) => {
            const Icon = occ.icon;
            return (
              <Link
                key={occ.name}
                to={occ.path}
                className={`reveal reveal-delay-${Math.min(idx + 1, 5)} group relative block aspect-[3/4] overflow-hidden rounded-md border border-brand-powder/50 bg-brand-cream shadow-sm hover:shadow-xl transition-all duration-300`}
              >
                {/* Background Fashion Image (object-top positioning) */}
                <img
                  src={occ.image}
                  alt={occ.name}
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />

                {/* Dark Gradient Overlay for legible text */}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/90 via-brand-navy/35 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

                {/* Top Badge Icon */}
                <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-brand-teal shadow-md transition-transform duration-300 group-hover:scale-110">
                  <Icon size={16} strokeWidth={1.8} />
                </div>

                {/* Bottom Content */}
                <div className="absolute inset-x-0 bottom-0 p-4 flex flex-col justify-end text-left">
                  <span className="font-sans text-[9px] tracking-widest text-brand-powder/80 uppercase font-medium mb-0.5">
                    {occ.subtitle}
                  </span>
                  <h3 className="font-serif text-base sm:text-lg font-medium text-white leading-tight group-hover:text-brand-powder transition-colors">
                    {occ.name}
                  </h3>
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}
