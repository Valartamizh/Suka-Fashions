import React from 'react';
import { Link } from 'react-router-dom';
import { Gem, Sparkles, Music2, Coffee, Briefcase, Flower2 } from 'lucide-react';
import { useReveal } from '../hooks/useReveal';

const occasions = [
  { name: 'Wedding',        icon: Gem,       path: '/category/occasion' },
  { name: 'Festive',        icon: Sparkles,  path: '/category/occasion' },
  { name: 'Party',          icon: Music2,    path: '/category/occasion' },
  { name: 'Casual',         icon: Coffee,    path: '/category/occasion' },
  { name: 'Office',         icon: Briefcase, path: '/category/occasion' },
  { name: 'Haldi / Mehendi', icon: Flower2,  path: '/category/occasion' },
];

export default function OccasionSection() {
  const sectionRef = useReveal();

  return (
    <section ref={sectionRef} className="py-16 sm:py-20 bg-white border-b border-brand-powder/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">

        {/* Heading */}
        <div className="text-center mb-12 reveal">
          <p className="font-sans text-[10px] tracking-[0.28em] text-brand-teal uppercase font-semibold mb-3">
            Style For Every Moment
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-light text-brand-navy tracking-wider uppercase">
            Shop By Occasion
          </h2>
          <div className="section-divider" />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
          {occasions.map((occ, idx) => {
            const Icon = occ.icon;
            return (
              <Link
                key={occ.name}
                to={occ.path}
                className={`reveal reveal-delay-${Math.min(idx + 1, 5)} group flex flex-col items-center py-7 px-4 border border-brand-powder/40 bg-brand-powderLight/30 rounded-sm hover:border-brand-teal/40 hover:bg-brand-powderLight hover:shadow-md transition-all duration-300`}
              >
                {/* Icon circle */}
                <div className="w-13 h-13 flex items-center justify-center rounded-full border border-brand-teal/20 bg-white mb-4 group-hover:border-brand-teal/50 group-hover:bg-brand-powder/40 transition-all duration-300 group-hover:scale-110">
                  <Icon size={24} strokeWidth={1.3} className="text-brand-teal" />
                </div>

                {/* Label */}
                <span className="font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.16em] font-medium text-brand-navy group-hover:text-brand-teal transition-colors duration-200 text-center leading-tight">
                  {occ.name}
                </span>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}
