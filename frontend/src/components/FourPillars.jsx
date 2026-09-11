import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Users, Feather, Compass, Award, Sparkles, ArrowRight, CheckCircle2, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { useContent } from '../context/ContentContext';

const ICON_MAP = {
  Users,
  Feather,
  Compass,
  Award,
  ShieldCheck,
  Truck,
  RotateCcw,
};

const DEFAULT_PILLARS = [
  {
    num: '01',
    icon: Users,
    tag: 'Certified Pure Weaves',
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
    tag: 'Complimentary Express',
    title: 'Complimentary Express',
    desc: 'Secure doorstep express delivery across all pin codes in India with reliable tracking.',
    gradient: 'from-cyan-500/10 to-blue-500/10',
  },
  {
    num: '04',
    icon: Award,
    tag: 'Easy 7-Day Exchange',
    title: 'Easy 7-Day Returns',
    desc: 'Hassle-free exchange and returns guarantee for complete peace of mind on every festive purchase.',
    gradient: 'from-purple-500/10 to-pink-500/10',
  },
];

export default function FourPillars() {
  const { getSectionContent } = useContent();
  const content = getSectionContent('four-pillars') || getSectionContent('benefits');

  const eyebrow = content?.eyebrow || 'The Suka Promise';
  const title = content?.title || 'THE FOUR PILLARS';
  const subtitle = content?.subtitle || "A luxury women's fashion house celebrating femininity, empowering women artisans, and keeping traditional weaves alive for the modern woman.";

  const pillars = useMemo(() => {
    if (content?.items && Array.isArray(content.items) && content.items.length > 0) {
      const activeOnly = content.items.filter(item => item.enabled !== false && item.active !== false);
      if (activeOnly.length > 0) {
        return activeOnly.map((item, idx) => {
          const IconComp = (typeof item.icon === 'string' ? ICON_MAP[item.icon] : item.icon) || Award;
          const gradients = [
            'from-teal-500/10 to-emerald-500/10',
            'from-amber-500/10 to-orange-500/10',
            'from-cyan-500/10 to-blue-500/10',
            'from-purple-500/10 to-pink-500/10',
            'from-rose-500/10 to-indigo-500/10',
          ];
          return {
            num: item.num || `0${idx + 1}`,
            icon: IconComp,
            tag: item.tag || item.title,
            title: item.title,
            desc: item.desc || item.description || '',
            gradient: gradients[idx % gradients.length],
          };
        });
      }
    }
    return DEFAULT_PILLARS;
  }, [content]);

  return (
    <section className="w-full py-4 sm:py-6 lg:py-8 bg-gradient-to-b from-brand-cream/40 via-white to-brand-cream/30 border-y border-brand-powder/40">
      <div className="max-w-[1600px] mx-auto px-3.5 sm:px-6 lg:px-10 xl:px-14">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-4 sm:mb-6 lg:mb-8">
          
          <p className="font-sans text-[10px] sm:text-[11.5px] font-extrabold uppercase tracking-[0.32em] text-brand-teal mb-2">
            ABOUT US
          </p>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-teal text-white shadow-xs mb-2 select-none">
            <Sparkles size={11} className="text-amber-300 animate-pulse" />
            <span className="font-sans text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.24em]">
              {eyebrow}
            </span>
          </div>

          <h2 className="font-serif text-xl sm:text-3xl lg:text-4xl text-brand-navy tracking-wider uppercase font-light mb-1">
            {title}
          </h2>
          
          <div className="w-10 h-0.5 bg-brand-teal mx-auto mb-2" />

          {subtitle && (
            <p className="font-sans text-[11px] sm:text-xs lg:text-sm text-brand-navy/70 font-light leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {/* Pillars Grid */}
        <div className={`grid grid-cols-2 lg:grid-cols-${Math.min(pillars.length, 4)} gap-2.5 sm:gap-4 lg:gap-6`}>
          {pillars.map(({ num, icon: Icon, tag, title: pTitle, desc, gradient }) => (
            <div
              key={num}
              className="relative bg-white border border-brand-powder/70 hover:border-brand-teal/60 rounded-lg sm:rounded-xl p-3.5 sm:p-5 lg:p-6 text-left shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group overflow-hidden"
            >
              <div className={`absolute -right-8 -top-8 w-24 h-24 rounded-full bg-gradient-to-br ${gradient} blur-xl group-hover:scale-150 transition-transform duration-500 pointer-events-none`} />

              <div>
                <div className="flex items-center justify-between mb-2.5 sm:mb-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-brand-teal to-[#008D96] text-white shadow-xs flex items-center justify-center group-hover:scale-105 transition-all duration-300">
                    <Icon size={15} strokeWidth={2} className="sm:w-[18px] sm:h-[18px]" />
                  </div>
                  <span className="font-serif text-sm sm:text-lg font-light text-brand-navy/30 group-hover:text-brand-teal/60 transition-colors">
                    {num}
                  </span>
                </div>

                <h3 className="font-serif text-[12.5px] sm:text-base font-semibold text-brand-navy mb-1 sm:mb-2 tracking-wide group-hover:text-brand-teal transition-colors line-clamp-1 sm:line-clamp-none">
                  {pTitle}
                </h3>

                <p className="font-sans text-[10.5px] sm:text-xs text-brand-navy/65 leading-relaxed font-light mb-2.5 sm:mb-4 line-clamp-3 sm:line-clamp-none">
                  {desc}
                </p>
              </div>

              <div className="pt-2 sm:pt-3 border-t border-brand-powder/50 flex items-center gap-1">
                <CheckCircle2 size={12} className="text-brand-teal flex-shrink-0" />
                <span className="font-sans text-[9px] sm:text-[10px] font-semibold text-brand-navy/75 uppercase tracking-wider truncate">
                  {tag}
                </span>
              </div>
            </div>
          ))}
        </div>

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
