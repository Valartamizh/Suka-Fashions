import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { useReveal } from '../hooks/useReveal';
import { useContent } from '../context/ContentContext';

const defaultTestimonials = [
  {
    id: 1,
    quote: 'The quality, the fit, the elegance — absolutely love every piece from Suka Fashions! The saree fabric feels so rich.',
    author: 'Radhika S.',
    name: 'Radhika S.',
    location: 'Mumbai, Maharashtra',
    city: 'Mumbai',
    tag: 'Pure Silk Saree',
    product: 'Blush Pink Pure Silk Saree',
    stars: 5,
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=120&auto=format&fit=crop&crop=face',
    date: '3 days ago',
  },
  {
    id: 2,
    quote: 'The organza saree is incredibly lightweight and looks so luxurious. Got so many compliments at my cousin\'s wedding!',
    author: 'Priyanka K.',
    name: 'Priyanka K.',
    location: 'Bengaluru, Karnataka',
    city: 'Bengaluru',
    tag: 'Organza Drape',
    product: 'Teal Embroidered Organza Saree',
    stars: 5,
    avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=120&auto=format&fit=crop&crop=face',
    date: '1 week ago',
  },
  {
    id: 3,
    quote: 'Extremely fast shipping and the cotton kurti fabric is perfect for everyday wear. Truly a premium and delightful experience.',
    author: 'Anjali M.',
    name: 'Anjali M.',
    location: 'New Delhi, Delhi',
    city: 'New Delhi',
    tag: 'Bridal Edit',
    product: 'Floral Printed Cotton Kurti Set',
    stars: 5,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=120&auto=format&fit=crop&crop=face',
    date: '2 weeks ago',
  },
];

const AVATAR_FALLBACKS = [
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=120&auto=format&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=120&auto=format&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=120&auto=format&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=120&auto=format&fit=crop&crop=face',
];

export default function Testimonials() {
  const sectionRef = useReveal();
  const { getSectionContent } = useContent();
  const content = getSectionContent('testimonials');

  const eyebrow = content?.eyebrow || 'What They Say';
  const title = content?.title || 'Customer Love';

  const testimonials = useMemo(() => {
    if (content?.items && Array.isArray(content.items) && content.items.length > 0) {
      return content.items.map((item, idx) => ({
        ...item,
        author: item.author || item.name || 'Verified Client',
        location: item.location || item.city || 'India',
        product: item.product || item.tag || 'Suka Couture',
        avatar: item.avatar || AVATAR_FALLBACKS[idx % AVATAR_FALLBACKS.length],
        stars: item.stars || 5,
        date: item.date || 'Verified Customer',
      }));
    }
    return defaultTestimonials;
  }, [content]);

  const [startIndex, setStartIndex] = useState(0);

  const next = useCallback(() => {
    setStartIndex((prev) => (prev + 1) % testimonials.length);
  }, [testimonials.length]);

  const prev = useCallback(() => {
    setStartIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, [testimonials.length]);

  useEffect(() => {
    const timer = setInterval(next, 7000);
    return () => clearInterval(timer);
  }, [next]);

  const visibleCards = useMemo(() => {
    if (testimonials.length === 0) return [];
    return [
      testimonials[startIndex % testimonials.length],
      testimonials[(startIndex + 1) % testimonials.length],
      testimonials[(startIndex + 2) % testimonials.length],
    ].filter(Boolean);
  }, [testimonials, startIndex]);

  return (
    <section ref={sectionRef} className="py-6 lg:py-8 bg-brand-cream/40 border-b border-brand-powder/30 overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-10 xl:px-14 2xl:px-16">

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

          {/* Prominent Overall Rating Badge */}
          <div className="flex items-center gap-2 sm:gap-3 bg-white border border-brand-powder/90 px-3.5 sm:px-5 py-1.5 sm:py-2.5 rounded-full shadow-2xs">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} className="fill-amber-400 text-amber-400 sm:w-[18px] sm:h-[18px]" />
              ))}
            </div>
            <div className="flex items-baseline gap-1">
              <span className="font-serif text-base sm:text-xl font-bold text-brand-navy">4.9</span>
              <span className="font-sans text-[10px] sm:text-xs font-semibold text-brand-navy/60 uppercase tracking-wider">/ 5</span>
            </div>
          </div>
        </div>

        {/* Review Cards */}
        <div className="relative reveal">
          {testimonials.length > 3 && (
            <>
              <button
                type="button"
                onClick={prev}
                aria-label="Previous review"
                className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white border border-brand-powder/80 shadow-md text-brand-navy hover:bg-brand-teal hover:text-white flex items-center justify-center transition-all cursor-pointer active:scale-90"
              >
                <ChevronLeft size={18} strokeWidth={2} />
              </button>

              <button
                type="button"
                onClick={next}
                aria-label="Next review"
                className="absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white border border-brand-powder/80 shadow-md text-brand-navy hover:bg-brand-teal hover:text-white flex items-center justify-center transition-all cursor-pointer active:scale-90"
              >
                <ChevronRight size={18} strokeWidth={2} />
              </button>
            </>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
            {visibleCards.map((item, idx) => (
              <div
                key={`${item.id || idx}-${startIndex}`}
                className={`relative bg-white border border-brand-powder/70 rounded-xl p-5 sm:p-7 flex flex-col justify-between shadow-sm hover:shadow-xl transition-all duration-300 group ${
                  idx === 0 ? 'flex' : idx === 1 ? 'hidden md:flex' : 'hidden lg:flex'
                }`}
              >
                {/* Top Row: Stars */}
                <div>
                  <div className="flex items-center justify-between mb-3.5 sm:mb-4">
                    <div className="flex items-center gap-0.5">
                      {[...Array(item.stars || 5)].map((_, i) => (
                        <Star key={i} size={14} className="fill-amber-400 text-amber-400 sm:w-[15px] sm:h-[15px]" />
                      ))}
                    </div>
                  </div>

                  {/* Quote Text */}
                  <blockquote className="font-serif text-sm sm:text-[15px] font-normal text-brand-navy leading-relaxed mb-3 sm:mb-4 text-left">
                    "{item.quote}"
                  </blockquote>

                  {/* Purchased Product Tag */}
                  {item.product && (
                    <div className="mb-4 sm:mb-5 inline-block bg-brand-cream/60 border border-brand-powder/50 rounded-md px-2.5 py-1 text-left">
                      <span className="font-sans text-[9.5px] sm:text-[10px] text-brand-navy/70 font-medium">
                        Collection: <span className="text-brand-teal font-semibold">{item.product}</span>
                      </span>
                    </div>
                  )}
                </div>

                {/* Bottom Author Row */}
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

                {/* Quote Watermark Accent */}
                <Quote
                  size={42}
                  className="absolute top-4 right-4 text-brand-teal/5 pointer-events-none group-hover:text-brand-teal/10 transition-colors"
                />
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
