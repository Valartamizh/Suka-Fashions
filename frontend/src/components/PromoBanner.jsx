import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useReveal } from '../hooks/useReveal';
import { useContent } from '../context/ContentContext';

// Import local high-resolution fallback assets
import sareeGolden from '../assets/saree_golden.jpg';
import lehengaRed from '../assets/lehenga_red.jpg';
import anarkaliBlackMulti from '../assets/anarkali_black_multicolor.jpg';

export default function PromoBanner({ sectionId, bannerIndex = 0 }) {
  const sectionRef = useReveal();
  const { getSectionContent } = useContent();

  // If a specific sectionId is requested (e.g. promo-banner-1, promo-banner-2, or promo-banner-3)
  if (sectionId) {
    const directContent = getSectionContent(sectionId);
    let banner = directContent;

    // Fallback if legacy promo-banners still has it
    if (!banner || (!banner.title && !banner.headline && !banner.image)) {
      const legacyContent = getSectionContent('promo-banners');
      if (legacyContent?.banners?.[bannerIndex]) {
        banner = legacyContent.banners[bannerIndex];
      }
    }

    if (!banner || banner.enabled === false) return null;

    const isSecond = bannerIndex === 1 || sectionId === 'promo-banner-2';
    const isThird = bannerIndex === 2 || sectionId === 'promo-banner-3';

    const bgImage = banner.image || (isSecond ? anarkaliBlackMulti : isThird ? lehengaRed : sareeGolden);
    const eyebrow = banner.type || banner.eyebrow || (isSecond ? 'FESTIVE EDIT' : isThird ? 'EXCLUSIVE COUTURE' : 'FEATURED COLLECTION');
    const title = banner.headline || banner.title || (isSecond ? 'Festive Celebration Sets' : isThird ? 'Bridal & Festive Couture' : 'Royal Heritage Silks');
    const subtitle = banner.subtitle || (isSecond ? 'Handcrafted Silhouettes & Festive Elegance' : isThird ? 'Exclusive Zardozi & Velvet Lehengas' : 'Handcrafted Pure Kanchipuram & Organza');
    const description = banner.description || (isSecond
      ? 'Discover handcrafted silhouettes and embroidered kurta sets designed for every celebration.'
      : isThird
      ? 'Luxury bridal ensembles with intricate handcrafted dori, sequins and cutdana work.'
      : 'Explore our handwoven pure silk & organza sarees and effortlessly chic printed sets.');
    const ctaText = banner.ctaText || (isSecond ? 'EXPLORE KURTIS' : isThird ? 'EXPLORE LEHENGAS' : 'SHOP SAREES');
    const ctaLink = banner.ctaLink || (isSecond ? '/category/kurtis' : isThird ? '/category/lehengas' : '/category/sarees');

    const ctaButtonClasses = 'bg-brand-teal hover:bg-brand-tealDark text-white';

    const overlayGradient = isSecond
      ? 'from-[#03201D]/95 via-[#06332E]/80 to-black/40 sm:to-black/30'
      : isThird
      ? 'from-[#220712]/95 via-[#330A1D]/80 to-black/40 sm:to-black/30'
      : 'from-[#022326]/95 via-[#03363B]/80 to-black/40 sm:to-black/30';

    return (
      <div ref={sectionRef} className="py-1 sm:py-2.5 lg:py-4 bg-brand-cream/20">
        <section className="w-full max-w-[1720px] mx-auto px-3 sm:px-6 lg:px-8 xl:px-10">
          <div className="reveal group relative overflow-hidden rounded-xl sm:rounded-3xl min-h-[190px] sm:min-h-[250px] lg:min-h-[300px] flex items-center shadow-md transition-all duration-500 hover:shadow-xl">

            {/* Full background image */}
            <img
              src={bgImage}
              alt={title}
              className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-[2000ms] ease-out group-hover:scale-105 pointer-events-none"
              loading="lazy"
            />

            {/* Gradient overlay for readability */}
            <div className={`absolute inset-0 bg-gradient-to-r ${overlayGradient} pointer-events-none`} />

            {/* Content */}
            <div className="relative z-10 w-full px-4 sm:px-8 lg:px-12 py-3.5 sm:py-6 lg:py-8 text-left max-w-xl">
              {eyebrow && (
                <div className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-md border border-white/25 px-2 sm:px-2.5 py-0.5 rounded-full mb-1 sm:mb-2">
                  <Sparkles size={10} className={isSecond ? 'text-rose-300' : 'text-amber-300'} />
                  <span className="font-sans text-[8px] sm:text-[9.5px] tracking-[0.22em] text-white uppercase font-bold">
                    {eyebrow}
                  </span>
                </div>
              )}

              <h2 className="font-serif text-base sm:text-2xl lg:text-3xl font-normal text-white tracking-wide uppercase leading-tight mb-1 sm:mb-1.5">
                {title}
              </h2>

              {subtitle && (
                <p className="font-serif text-[11px] sm:text-sm lg:text-base italic text-white/90 font-light mb-1 sm:mb-1.5 line-clamp-1">
                  {subtitle}
                </p>
              )}

              {description && (
                <p className="font-sans text-[10px] sm:text-xs text-white/80 font-light leading-relaxed mb-2.5 sm:mb-3.5 max-w-md line-clamp-1 sm:line-clamp-2">
                  {description}
                </p>
              )}

              {ctaText?.trim() && (
                <Link
                  to={ctaLink}
                  className={`inline-flex items-center gap-1.5 ${ctaButtonClasses} font-sans text-[9px] sm:text-[10.5px] tracking-[0.16em] sm:tracking-[0.18em] uppercase font-bold px-3.5 sm:px-5 py-1.5 sm:py-2.5 rounded-sm shadow-md hover:shadow-lg transition-all duration-300 group/btn`}
                >
                  <span>{ctaText}</span>
                  <ArrowRight size={12} strokeWidth={2.2} className="transform transition-transform duration-200 group-hover/btn:translate-x-1" />
                </Link>
              )}
            </div>
          </div>
        </section>
      </div>
    );
  }

  // Fallback: legacy bundled rendering
  const content = getSectionContent('promo-banners');
  const banners = (content?.banners || []).filter(b => b.enabled !== false).slice(0, 2);

  if (!banners || banners.length === 0) return null;

  return (
    <div ref={sectionRef} className="space-y-6 sm:space-y-10 py-2 sm:py-4 lg:py-6 bg-brand-cream/20">
      {banners.map((banner, index) => {
        const isSecond = index === 1;
        const bgImage = banner.image || (isSecond ? lehengaRed : sareeGolden);
        const eyebrow = banner.type || (isSecond ? 'EXCLUSIVE COUTURE' : 'FEATURED COLLECTION');
        const title = banner.title || (isSecond ? 'Bridal & Festive Couture' : 'Royal Heritage Silks');
        const subtitle = banner.subtitle || (isSecond ? 'Exclusive Zardozi & Velvet Lehengas' : 'Handcrafted Pure Kanchipuram & Organza');
        const description = banner.description || (isSecond
          ? 'Luxury bridal ensembles with intricate handcrafted dori, sequins and cutdana work.'
          : 'Explore our handwoven pure silk & organza sarees and effortlessly chic printed sets.');
        const ctaText = banner.ctaText || (isSecond ? 'EXPLORE LEHENGAS' : 'SHOP SAREES');
        const ctaLink = banner.ctaLink || (isSecond ? '/category/lehengas' : '/category/sarees');

        const ctaButtonClasses = 'bg-brand-teal hover:bg-brand-tealDark text-white';

        const overlayGradient = isSecond
          ? 'from-[#220712]/95 via-[#330A1D]/80 to-black/40 sm:to-black/30'
          : 'from-[#022326]/95 via-[#03363B]/80 to-black/40 sm:to-black/30';

        return (
          <section key={banner.id || index} className="w-full max-w-[1720px] mx-auto px-3 sm:px-6 lg:px-8 xl:px-10">
            <div className="reveal group relative overflow-hidden rounded-xl sm:rounded-3xl min-h-[190px] sm:min-h-[250px] lg:min-h-[300px] flex items-center shadow-md transition-all duration-500 hover:shadow-xl">

              {/* Full background image */}
              <img
                src={bgImage}
                alt={title}
                className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-[2000ms] ease-out group-hover:scale-105 pointer-events-none"
                loading="lazy"
              />

              {/* Gradient overlay for readability */}
              <div className={`absolute inset-0 bg-gradient-to-r ${overlayGradient} pointer-events-none`} />

              {/* Content */}
              <div className="relative z-10 w-full px-4 sm:px-8 lg:px-12 py-3.5 sm:py-6 lg:py-8 text-left max-w-xl">
                {eyebrow && (
                  <div className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-md border border-white/25 px-2 sm:px-2.5 py-0.5 rounded-full mb-1 sm:mb-2">
                    <Sparkles size={10} className={isSecond ? 'text-rose-300' : 'text-amber-300'} />
                    <span className="font-sans text-[8px] sm:text-[9.5px] tracking-[0.22em] text-white uppercase font-bold">
                      {eyebrow}
                    </span>
                  </div>
                )}

                <h2 className="font-serif text-base sm:text-2xl lg:text-3xl font-normal text-white tracking-wide uppercase leading-tight mb-1 sm:mb-1.5">
                  {title}
                </h2>

                {subtitle && (
                  <p className="font-serif text-[11px] sm:text-sm lg:text-base italic text-white/90 font-light mb-1 sm:mb-1.5 line-clamp-1">
                    {subtitle}
                  </p>
                )}

                {description && (
                  <p className="font-sans text-[10px] sm:text-xs text-white/80 font-light leading-relaxed mb-2.5 sm:mb-3.5 max-w-md line-clamp-1 sm:line-clamp-2">
                    {description}
                  </p>
                )}

                {ctaText?.trim() && (
                  <Link
                    to={ctaLink}
                    className={`inline-flex items-center gap-1.5 ${ctaButtonClasses} font-sans text-[9px] sm:text-[10.5px] tracking-[0.16em] sm:tracking-[0.18em] uppercase font-bold px-3.5 sm:px-5 py-1.5 sm:py-2.5 rounded-sm shadow-md hover:shadow-lg transition-all duration-300 group/btn`}
                  >
                    <span>{ctaText}</span>
                    <ArrowRight size={12} strokeWidth={2.2} className="transform transition-transform duration-200 group-hover/btn:translate-x-1" />
                  </Link>
                )}
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
