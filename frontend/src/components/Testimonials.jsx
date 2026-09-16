import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { useReveal } from '../hooks/useReveal';
import { useContent } from '../context/ContentContext';
import { adminReviews } from '../admin/data/adminReviews';

const AVATAR_FALLBACKS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=120&auto=format&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=120&auto=format&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=120&auto=format&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=120&auto=format&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=120&auto=format&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=120&auto=format&fit=crop&crop=face',
];

export default function Testimonials() {
  const sectionRef = useReveal();
  const { getSectionContent } = useContent();
  const content = getSectionContent('testimonials');

  const eyebrow = content?.eyebrow || 'CLIENT FEEDBACK';
  const title = content?.title || 'REVIEWS';

  const testimonials = useMemo(() => {
    // 1. If explicit custom reviews exist
    if (content?.items && Array.isArray(content.items) && content.items.length > 0) {
      const activeItems = content.items.filter(item => item.enabled !== false && item.active !== false);
      if (activeItems.length > 0) {
        return activeItems.map((item, idx) => ({
          id: item.id || idx,
          author: item.author || item.name || item.customerName || 'Verified Patron',
          location: item.location || item.city || 'India',
          product: item.product || item.productName || item.tag || 'Suka Couture',
          quote: item.quote || item.review || '',
          stars: item.stars || item.rating || 5,
          avatar: item.avatar || AVATAR_FALLBACKS[idx % AVATAR_FALLBACKS.length],
        }));
      }
    }

    // 2. Otherwise resolve from featuredReviewIds against approved adminReviews
    if (content?.featuredReviewIds && Array.isArray(content.featuredReviewIds) && content.featuredReviewIds.length > 0) {
      const resolved = content.featuredReviewIds
        .map((revId, idx) => {
          const found = adminReviews.find(r => r.id === revId && r.status === 'approved');
          if (!found) return null;
          return {
            id: found.id,
            author: found.customerName,
            location: 'Verified Buyer',
            product: found.productName,
            quote: found.review,
            stars: found.rating || 5,
            avatar: found.images?.[0] || AVATAR_FALLBACKS[idx % AVATAR_FALLBACKS.length],
          };
        })
        .filter(Boolean);

      if (resolved.length > 0) return resolved;
    }

    // 3. Default approved homepage reviews from adminReviews
    const approvedHomepage = adminReviews
      .filter(r => r.status === 'approved' && (r.homepageFeatured || r.rating >= 4))
      .slice(0, 6)
      .map((r, idx) => ({
        id: r.id,
        author: r.customerName,
        location: 'Verified Buyer',
        product: r.productName,
        quote: r.review,
        stars: r.rating || 5,
        avatar: r.images?.[0] || AVATAR_FALLBACKS[idx % AVATAR_FALLBACKS.length],
      }));

    return approvedHomepage.length > 0 ? approvedHomepage : [
      {
        id: 'rev-1',
        author: 'Ananya Deshmukh',
        location: 'Mumbai, Maharashtra',
        product: 'Crimson Bridal Lehenga',
        quote: 'The crimson lehenga exceeded all my expectations. The fabric quality and zardozi detailing are magnificent! Suka Fashions is my go-to boutique.',
        stars: 5,
        avatar: AVATAR_FALLBACKS[0],
      },
      {
        id: 'rev-2',
        author: 'Priya Sharma',
        location: 'Bengaluru, Karnataka',
        product: 'Teal Embroidered Organza Saree',
        quote: 'Absolutely stunning saree! The embroidery is so intricate and the fabric quality is exceptional. Packaging was also very premium. Highly recommend!',
        stars: 5,
        avatar: AVATAR_FALLBACKS[1],
      },
      {
        id: 'rev-3',
        author: 'Kavitha Menon',
        location: 'Chennai, Tamil Nadu',
        product: 'Royal Gold Zari Kanchipuram Saree',
        quote: 'This Kanchipuram saree is truly royal! Worth every rupee. The zari work is exquisite and the silk quality is the best I have seen.',
        stars: 5,
        avatar: AVATAR_FALLBACKS[2],
      },
    ];
  }, [content]);

  const [startIndex, setStartIndex] = useState(0);

  const next = useCallback(() => {
    if (testimonials.length <= 1) return;
    setStartIndex((prev) => (prev + 1) % testimonials.length);
  }, [testimonials.length]);

  const prev = useCallback(() => {
    if (testimonials.length <= 1) return;
    setStartIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, [testimonials.length]);

  useEffect(() => {
    if (testimonials.length <= 1) return;
    const timer = setInterval(next, 8000);
    return () => clearInterval(timer);
  }, [next, testimonials.length]);

  const visibleCards = useMemo(() => {
    if (testimonials.length === 0) return [];
    return [
      testimonials[startIndex % testimonials.length],
      testimonials[(startIndex + 1) % testimonials.length],
      testimonials[(startIndex + 2) % testimonials.length],
    ].filter(Boolean);
  }, [testimonials, startIndex]);

  return (
    <section ref={sectionRef} className="py-6 lg:py-8 bg-brand-cream/40 border-b border-brand-powder/30 overflow-hidden relative">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-14 2xl:px-16">

        {/* Header Row */}
        <div className="flex items-end justify-between mb-4 pb-2 border-b border-brand-powder/40 reveal">
          <div>
            <p className="font-sans text-[9.5px] sm:text-[10px] tracking-[0.28em] text-brand-teal uppercase font-semibold mb-1 sm:mb-1.5">
              {eyebrow}
            </p>
            <h2 className="font-serif text-xl sm:text-3xl lg:text-4xl font-light text-brand-navy tracking-wider uppercase">
              {title}
            </h2>
            <div className="section-divider-left mt-1.5 sm:mt-2" />
          </div>

          {/* Overall Rating Badge */}
          <div className="flex items-center">
            <div className="flex items-center gap-2 sm:gap-3 bg-white border border-brand-powder/90 px-3.5 sm:px-5 py-1.5 sm:py-2.5 rounded-full shadow-2xs">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} className="fill-amber-400 text-amber-400 sm:w-[17px] sm:h-[17px]" />
                ))}
              </div>
              <div className="flex items-baseline gap-1">
                <span className="font-serif text-base sm:text-lg font-bold text-brand-navy">4.9</span>
                <span className="font-sans text-[10px] sm:text-xs font-semibold text-brand-navy/60 uppercase tracking-wider">/ 5</span>
              </div>
            </div>
          </div>
        </div>

        {/* Review Cards */}
        <div className="relative px-2 sm:px-4 reveal">
          {testimonials.length > 1 && (
            <button
              type="button"
              onClick={prev}
              aria-label="Previous review"
              className="absolute -left-2 sm:-left-5 lg:-left-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/95 backdrop-blur-md border border-brand-powder shadow-lg text-brand-navy hover:bg-brand-teal hover:text-white hover:scale-110 flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-95"
            >
              <ChevronLeft size={20} strokeWidth={2.5} />
            </button>
          )}

          {testimonials.length > 1 && (
            <button
              type="button"
              onClick={next}
              aria-label="Next review"
              className="absolute -right-2 sm:-right-5 lg:-right-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/95 backdrop-blur-md border border-brand-powder shadow-lg text-brand-navy hover:bg-brand-teal hover:text-white hover:scale-110 flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-95"
            >
              <ChevronRight size={20} strokeWidth={2.5} />
            </button>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
            {visibleCards.map((item, idx) => (
              <div
                key={`${item.id || idx}-${startIndex}`}
                className={`relative bg-white border border-brand-powder/70 rounded-xl p-5 sm:p-7 flex flex-col justify-between shadow-sm hover:shadow-xl transition-all duration-300 group min-h-[260px] ${
                  idx === 0 ? 'flex' : idx === 1 ? 'hidden md:flex' : 'hidden lg:flex'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <div className="flex items-center gap-0.5">
                      {[...Array(item.stars || 5)].map((_, i) => (
                        <Star key={i} size={14} className="fill-amber-400 text-amber-400 sm:w-[15px] sm:h-[15px]" />
                      ))}
                    </div>
                  </div>

                  <blockquote className="font-serif text-sm sm:text-[15px] font-normal text-brand-navy leading-relaxed mb-3 sm:mb-4 text-left">
                    "{item.quote}"
                  </blockquote>

                  {item.product && (
                    <div className="mb-4 sm:mb-5 inline-block bg-brand-cream/60 border border-brand-powder/50 rounded-md px-2.5 py-1 text-left">
                      <span className="font-sans text-[9.5px] sm:text-[10px] text-brand-navy/70 font-medium">
                        Product: <span className="text-brand-teal font-semibold">{item.product}</span>
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 pt-3.5 sm:pt-4 border-t border-brand-powder/40">
                  <img
                    src={item.avatar}
                    alt={item.author}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-brand-powder shadow-2xs flex-shrink-0"
                    loading="lazy"
                  />
                  <div className="text-left flex-1 min-w-0">
                    <cite className="font-sans not-italic text-xs font-bold tracking-wider text-brand-navy uppercase block truncate">
                      {item.author}
                    </cite>
                    <span className="font-sans text-[10px] sm:text-[10.5px] text-brand-navy/50 block truncate">
                      {item.location}
                    </span>
                  </div>
                </div>

                <Quote
                  size={42}
                  className="absolute top-4 right-4 text-brand-teal/5 pointer-events-none group-hover:text-brand-teal/10 transition-colors"
                />
              </div>
            ))}
          </div>

          {testimonials.length > 1 && (
            <div className="flex justify-center items-center gap-2 mt-5">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setStartIndex(i)}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    startIndex === i ? 'w-6 bg-brand-teal' : 'w-2 bg-brand-powder hover:bg-brand-teal/50'
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
