import React from 'react';
import { Link } from 'react-router-dom';
import { Gem, Sparkles, Music2, Coffee, Briefcase, Flower2, Tag } from 'lucide-react';
import { useReveal } from '../hooks/useReveal';
import { useContent } from '../context/ContentContext';

// Import local assets for 100% reliable image loading
import lehengaRed from '../assets/lehenga_red.jpg';
import sareeGolden from '../assets/saree_golden.jpg';
import sareeBeigeMaroon from '../assets/saree_beige_maroon.jpg';
import kurtiPurplePrinted from '../assets/kurti_purple_printed.jpg';
import dressNavy from '../assets/dress_navy.jpg';
import lehengaMint from '../assets/lehenga_mint.jpg';

// Map stored icon name strings → Lucide components
const ICON_MAP = {
  Gem,
  Sparkles,
  Music2,
  Coffee,
  Briefcase,
  Flower2,
  Tag,
};

const defaultOccasions = [
  { id: 'occ-1', name: 'Wedding',       subtitle: 'Bridal & Trousseau',     icon: 'Gem',       link: '/category/occasion', image: lehengaRed },
  { id: 'occ-2', name: 'Festive',       subtitle: 'Puja & Celebrations',    icon: 'Sparkles',  link: '/category/occasion', image: sareeGolden },
  { id: 'occ-3', name: 'Party',         subtitle: 'Cocktail & Evening',     icon: 'Music2',    link: '/category/occasion', image: sareeBeigeMaroon },
  { id: 'occ-4', name: 'Casual',        subtitle: 'Chic Daily Comfort',     icon: 'Coffee',    link: '/category/occasion', image: kurtiPurplePrinted },
  { id: 'occ-5', name: 'Office',        subtitle: 'Formal Elegance',        icon: 'Briefcase', link: '/category/occasion', image: dressNavy },
  { id: 'occ-6', name: 'Haldi & Mehendi', subtitle: 'Vibrant Yellows',      icon: 'Flower2',   link: '/category/occasion', image: lehengaMint },
];

export default function OccasionSection() {
  const sectionRef = useReveal();
  const { getSectionContent } = useContent();
  const content = getSectionContent('occasion');

  const eyebrow = content?.eyebrow || 'Style For Every Moment';
  const title   = content?.title   || 'Shop By Occasion';

  // Use CMS items if available, fall back to hardcoded defaults
  const cmsItems = (content?.items || [])
    .filter(i => i.enabled !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));
  const occasions = cmsItems.length > 0 ? cmsItems : defaultOccasions;

  return (
    <section ref={sectionRef} className="py-6 lg:py-8 bg-white border-b border-brand-powder/30">
      <div className="max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-10 xl:px-14 2xl:px-16">

        {/* Heading */}
        <div className="text-center mb-4 reveal">
          <p className="font-sans text-[10px] tracking-[0.28em] text-brand-teal uppercase font-semibold mb-2">
            {eyebrow}
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-light text-brand-navy tracking-wider uppercase">
            {title}
          </h2>
          <div className="section-divider" />
        </div>

        {/* Occasion Cards Slider / Grid */}
        <div className="flex overflow-x-auto lg:grid lg:grid-cols-6 gap-3 sm:gap-5 lg:gap-6 pb-3 -mx-4 px-4 sm:mx-0 sm:px-0 no-scrollbar snap-x snap-mandatory">
          {occasions.map((occ, idx) => {
            const Icon = ICON_MAP[occ.icon] || Tag;
            return (
              <Link
                key={occ.id || occ.name}
                to={occ.link || occ.path || '/category/occasion'}
                className={`reveal reveal-delay-${Math.min(idx + 1, 5)} flex-none w-[160px] sm:w-[200px] lg:w-auto snap-start group relative block aspect-[3/4] overflow-hidden rounded-md border border-brand-powder/50 bg-brand-cream shadow-xs hover:shadow-xl transition-all duration-300`}
              >
                {/* Background Fashion Image */}
                <img
                  src={occ.image}
                  alt={occ.name}
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/90 via-brand-navy/35 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

                {/* Top Badge Icon */}
                <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-brand-teal shadow-md transition-transform duration-300 group-hover:scale-110">
                  <Icon size={15} strokeWidth={1.8} />
                </div>

                {/* Bottom Content */}
                <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 flex flex-col justify-end text-left">
                  <span className="font-sans text-[8.5px] sm:text-[9px] tracking-widest text-brand-powder/80 uppercase font-medium mb-0.5">
                    {occ.subtitle}
                  </span>
                  <h3 className="font-serif text-sm sm:text-base lg:text-lg font-medium text-white leading-tight group-hover:text-brand-powder transition-colors">
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
