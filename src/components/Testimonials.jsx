import React, { useState, useEffect, useCallback } from 'react';
import { Star, ChevronLeft, ChevronRight, CheckCircle2, Quote } from 'lucide-react';
import { useReveal } from '../hooks/useReveal';

const testimonials = [
  {
    id: 1,
    quote: 'The quality, the fit, the elegance — absolutely love every piece from Suka Fashions! The saree fabric feels so rich.',
    author: 'Radhika S.',
    location: 'Mumbai, Maharashtra',
    product: 'Blush Pink Pure Silk Saree',
    stars: 5,
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=120&auto=format&fit=crop&crop=face',
    date: '3 days ago',
  },
  {
    id: 2,
    quote: 'The organza saree is incredibly lightweight and looks so luxurious. Got so many compliments at my cousin\'s wedding!',
    author: 'Priyanka K.',
    location: 'Bengaluru, Karnataka',
    product: 'Teal Embroidered Organza Saree',
    stars: 5,
    avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=120&auto=format&fit=crop&crop=face',
    date: '1 week ago',
  },
  {
    id: 3,
    quote: 'Extremely fast shipping and the cotton kurti fabric is perfect for everyday wear. Truly a premium and delightful experience.',
    author: 'Anjali M.',
    location: 'New Delhi, Delhi',
    product: 'Floral Printed Cotton Kurti Set',
    stars: 5,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=120&auto=format&fit=crop&crop=face',
    date: '2 weeks ago',
  },
  {
    id: 4,
    quote: 'Finally a brand that makes sarees feel accessible and modern. Beautifully crafted, vibrant colors, and delivered right on time.',
    author: 'Meera T.',
    location: 'Chennai, Tamil Nadu',
    product: 'Mustard Yellow Handloom Saree',
    stars: 5,
    avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=120&auto=format&fit=crop&crop=face',
    date: '2 weeks ago',
  },
  {
    id: 5,
    quote: 'The velvet lehenga exceeded my expectations! The intricate embroidery and fit were completely bridal-ready. Highly recommend!',
    author: 'Kavita R.',
    location: 'Hyderabad, Telangana',
    product: 'Crimson Velvet Bridal Lehenga',
    stars: 5,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=120&auto=format&fit=crop&crop=face',
    date: '3 weeks ago',
  },
  {
    id: 6,
    quote: 'The craftsmanship on the borders is flawless. Fabric breathes easily and looks like couture. I will definitely be ordering again.',
    author: 'Sneha P.',
    location: 'Pune, Maharashtra',
    product: 'Golden Embroidered Festive Drape',
    stars: 5,
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=120&auto=format&fit=crop&crop=face',
    date: '1 month ago',
  },
];

export default function Testimonials() {
  const sectionRef = useReveal();
  const [startIndex, setStartIndex] = useState(0);

  // Maximum items visible per page on desktop is 3
  const itemsPerPage = 3;
  const maxIndex = testimonials.length - itemsPerPage;

  const next = useCallback(() => {
    setStartIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const prev = useCallback(() => {
    setStartIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  // Auto rotate testimonials
  useEffect(() => {
    const timer = setInterval(next, 7000);
    return () => clearInterval(timer);
  }, [next]);

  // Get currently visible 3 cards
  const visibleCards = [
    testimonials[startIndex % testimonials.length],
    testimonials[(startIndex + 1) % testimonials.length],
    testimonials[(startIndex + 2) % testimonials.length],
  ];

  return (
    <section ref={sectionRef} className="py-6 lg:py-8 bg-brand-cream/40 border-b border-brand-powder/30 overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-10 xl:px-14 2xl:px-16">

        {/* Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-5 pb-2 border-b border-brand-powder/40 reveal">
          <div>
            <p className="font-sans text-[10px] tracking-[0.28em] text-brand-teal uppercase font-semibold mb-1.5">
              What They Say
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-light text-brand-navy tracking-wider uppercase">
              Customer Love
            </h2>
            <div className="section-divider-left mt-2" />
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center gap-2 mt-4 sm:mt-0">
            <button
              onClick={prev}
              aria-label="Previous reviews"
              className="w-9 h-9 rounded-full border border-brand-navy/20 bg-white flex items-center justify-center text-brand-navy hover:border-brand-teal hover:bg-brand-teal hover:text-white transition-all duration-200 shadow-2xs cursor-pointer"
            >
              <ChevronLeft size={16} strokeWidth={2} />
            </button>
            <button
              onClick={next}
              aria-label="Next reviews"
              className="w-9 h-9 rounded-full border border-brand-navy/20 bg-white flex items-center justify-center text-brand-navy hover:border-brand-teal hover:bg-brand-teal hover:text-white transition-all duration-200 shadow-2xs cursor-pointer"
            >
              <ChevronRight size={16} strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* Review Cards (1 on Mobile, 2 on Tablet, 3 on Desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 reveal">
          {visibleCards.map((item, idx) => (
            <div
              key={`${item.id}-${startIndex}-${idx}`}
              className={`relative bg-white border border-brand-powder/70 rounded-xl p-5 sm:p-7 flex flex-col justify-between shadow-sm hover:shadow-xl transition-all duration-300 group ${
                idx === 0 ? 'flex' : idx === 1 ? 'hidden md:flex' : 'hidden lg:flex'
              }`}
              style={{ animation: 'cardFadeIn 0.35s ease both' }}
            >
              {/* Top Row: Stars + Verified Badge */}
              <div>
                <div className="flex items-center justify-between mb-3.5 sm:mb-4">
                  <div className="flex items-center gap-0.5">
                    {[...Array(item.stars)].map((_, i) => (
                      <Star key={i} size={14} className="fill-amber-400 text-amber-400 sm:w-[15px] sm:h-[15px]" />
                    ))}
                  </div>

                  <span className="inline-flex items-center gap-1 font-sans text-[9.5px] sm:text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-medium">
                    <CheckCircle2 size={10} className="text-emerald-600 sm:w-[11px] sm:h-[11px]" />
                    Verified Buyer
                  </span>
                </div>

                {/* Quote Text */}
                <blockquote className="font-serif text-sm sm:text-[15px] font-normal text-brand-navy leading-relaxed mb-3 sm:mb-4 text-left">
                  "{item.quote}"
                </blockquote>

                {/* Purchased Product Tag */}
                {item.product && (
                  <div className="mb-4 sm:mb-5 inline-block bg-brand-cream/60 border border-brand-powder/50 rounded-md px-2.5 py-1 text-left">
                    <span className="font-sans text-[9.5px] sm:text-[10px] text-brand-navy/70 font-medium">
                      Item: <span className="text-brand-teal font-semibold">{item.product}</span>
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
                <span className="font-sans text-[9px] sm:text-[9.5px] text-brand-navy/40 flex-shrink-0">
                  {item.date}
                </span>
              </div>

              {/* Subtle Quote Watermark Accent */}
              <Quote
                size={42}
                className="absolute top-4 right-4 text-brand-teal/5 pointer-events-none group-hover:text-brand-teal/10 transition-colors"
              />
            </div>
          ))}
        </div>

        {/* Mobile Dot Indicators for Carousel */}
        <div className="flex md:hidden justify-center items-center gap-1.5 mt-3.5">
          {testimonials.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setStartIndex(i)}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                i === (startIndex % testimonials.length)
                  ? 'w-5 bg-brand-teal'
                  : 'w-1.5 bg-brand-powder hover:bg-brand-navy/40'
              }`}
              aria-label={`Go to review ${i + 1}`}
            />
          ))}
        </div>

        {/* All-time Stats Row */}
        <div className="mt-5 sm:mt-7 grid grid-cols-3 gap-2.5 sm:gap-6 text-center reveal reveal-delay-2">
          {[
            { value: '4.9 / 5', label: 'Average Rating' },
            { value: '2,000+', label: 'Verified Reviews' },
            { value: '98%', label: 'Happy Customers' },
          ].map((s) => (
            <div key={s.label} className="py-3.5 sm:py-4 px-2 bg-white border border-brand-powder/60 rounded-xl shadow-2xs">
              <span className="font-serif text-lg sm:text-2xl text-brand-teal font-bold block">{s.value}</span>
              <span className="font-sans text-[9px] sm:text-[10.5px] text-brand-navy/60 tracking-wider uppercase mt-0.5 block">{s.label}</span>
            </div>
          ))}
        </div>

      </div>

      <style>{`
        @keyframes cardFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
