import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Feather, Compass, Award, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

const PILLARS = [
  {
    num: '01',
    icon: Users,
    tag: '500+ Female Weavers',
    title: 'Artisan Empowerment',
    desc: 'Empowering over 500+ female artisans across rural handloom clusters through fair wages and skill upliftment.',
    gradient: 'from-teal-500/10 to-emerald-500/10',
  },
  {
    num: '02',
    icon: Feather,
    tag: '100% Pure Silks',
    title: 'Purity & Quality',
    desc: 'Certified pure silks, organzas, georgettes, and hand-embroidered threads that stand the test of time.',
    gradient: 'from-amber-500/10 to-orange-500/10',
  },
  {
    num: '03',
    icon: Compass,
    tag: 'Eco-Conscious Craft',
    title: 'Sustainable Fashion',
    desc: 'Slow, conscious production with minimal chemical dyes and eco-friendly packaging materials.',
    gradient: 'from-cyan-500/10 to-blue-500/10',
  },
  {
    num: '04',
    icon: Award,
    tag: 'Bespoke Fit & Poise',
    title: 'Unmatched Elegance',
    desc: 'Contemporary cuts tailored to accentuate grace, dignity, and regal poise for every festive moment.',
    gradient: 'from-purple-500/10 to-pink-500/10',
  },
];

export default function FourPillars() {
  return (
    <section className="w-full py-4 sm:py-6 lg:py-8 bg-gradient-to-b from-brand-cream/40 via-white to-brand-cream/30 border-y border-brand-powder/40">
      <div className="max-w-[1600px] mx-auto px-3.5 sm:px-6 lg:px-10 xl:px-14">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-4 sm:mb-6 lg:mb-8">
          
          {/* Branded Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-teal text-white shadow-xs mb-2 select-none">
            <Sparkles size={11} className="text-amber-300 animate-pulse" />
            <span className="font-sans text-[9px] sm:text-[10.5px] font-bold uppercase tracking-[0.24em]">
              ABOUT US
            </span>
          </div>

          {/* Main Title */}
          <h2 className="font-serif text-xl sm:text-3xl lg:text-4xl text-brand-navy tracking-wider uppercase font-light mb-1">
            THE FOUR PILLARS
          </h2>
          
          <div className="w-10 h-0.5 bg-brand-teal mx-auto mb-2" />

          {/* Short Description */}
          <p className="font-sans text-[11px] sm:text-xs lg:text-sm text-brand-navy/70 font-light leading-relaxed">
            A luxury women's fashion house celebrating femininity, empowering women artisans, and keeping traditional weaves alive for the modern woman.
          </p>
        </div>

        {/* 4 Pillars Aligned in 2x2 Grid on Mobile, 4 Cols on Desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-6">
          {PILLARS.map(({ num, icon: Icon, tag, title, desc, gradient }) => (
            <div
              key={title}
              className="relative bg-white border border-brand-powder/70 hover:border-brand-teal/60 rounded-lg sm:rounded-xl p-3.5 sm:p-5 lg:p-6 text-left shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group overflow-hidden"
            >
              {/* Subtle Ambient Hover Glow */}
              <div className={`absolute -right-8 -top-8 w-24 h-24 rounded-full bg-gradient-to-br ${gradient} blur-xl group-hover:scale-150 transition-transform duration-500 pointer-events-none`} />

              <div>
                {/* Header Row: Icon & Editorial Number */}
                <div className="flex items-center justify-between mb-2.5 sm:mb-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-brand-teal to-[#008D96] text-white shadow-xs flex items-center justify-center group-hover:scale-105 transition-all duration-300">
                    <Icon size={15} strokeWidth={2} className="sm:w-[18px] sm:h-[18px]" />
                  </div>
                  <span className="font-serif text-sm sm:text-lg font-light text-brand-navy/30 group-hover:text-brand-teal/60 transition-colors">
                    {num}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-serif text-[12.5px] sm:text-base font-semibold text-brand-navy mb-1 sm:mb-2 tracking-wide group-hover:text-brand-teal transition-colors line-clamp-1 sm:line-clamp-none">
                  {title}
                </h3>

                {/* Description */}
                <p className="font-sans text-[10.5px] sm:text-xs text-brand-navy/65 leading-relaxed font-light mb-2.5 sm:mb-4 line-clamp-3 sm:line-clamp-none">
                  {desc}
                </p>
              </div>

              {/* Micro Trust Tag */}
              <div className="pt-2 sm:pt-3 border-t border-brand-powder/50 flex items-center gap-1">
                <CheckCircle2 size={12} className="text-brand-teal flex-shrink-0" />
                <span className="font-sans text-[9px] sm:text-[10px] font-semibold text-brand-navy/75 uppercase tracking-wider truncate">
                  {tag}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Read Full Story Link */}
        <div className="text-center mt-3.5 sm:mt-5 lg:mt-6">
          <Link
            to="/about"
            className="inline-flex items-center gap-1.5 font-sans text-[10px] sm:text-xs font-bold uppercase tracking-[0.18em] text-brand-teal hover:text-brand-tealDark transition-colors group/link"
          >
            <span>DISCOVER OUR FULL STORY</span>
            <ArrowRight size={13} className="group-hover/link:translate-x-1 transition-transform duration-200" />
          </Link>
        </div>

      </div>
    </section>
  );
}
