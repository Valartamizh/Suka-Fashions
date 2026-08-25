import React, { useState, useEffect, useCallback } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { useReveal } from '../hooks/useReveal';

const testimonials = [
  {
    quote:    'The quality, the fit, the elegance — absolutely love every piece from Suka Fashions!',
    author:   'Radhika S.',
    location: 'Mumbai',
    stars:    5,
    avatar:   'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=120&auto=format&fit=crop&crop=face',
  },
  {
    quote:    'The organza saree is incredibly lightweight and looks so luxurious. Got so many compliments at my cousin\'s wedding!',
    author:   'Priyanka K.',
    location: 'Bengaluru',
    stars:    5,
    avatar:   'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=120&auto=format&fit=crop&crop=face',
  },
  {
    quote:    'Extremely fast shipping and the cotton kurti fabric is perfect for the weather. Truly a premium experience.',
    author:   'Anjali M.',
    location: 'Delhi',
    stars:    5,
    avatar:   'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=120&auto=format&fit=crop&crop=face',
  },
  {
    quote:    'Finally a brand that makes sarees feel accessible and modern. Beautifully crafted and delivered on time.',
    author:   'Meera T.',
    location: 'Chennai',
    stars:    5,
    avatar:   'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=120&auto=format&fit=crop&crop=face',
  },
];

export default function Testimonials() {
  const sectionRef = useReveal();
  const [active, setActive] = useState(0);

  const next = useCallback(() => setActive((a) => (a + 1) % testimonials.length), []);
  const prev = useCallback(() => setActive((a) => (a - 1 + testimonials.length) % testimonials.length), []);

  useEffect(() => {
    const t = setInterval(next, 6000);
    return () => clearInterval(t);
  }, [next]);

  const t = testimonials[active];

  return (
    <section ref={sectionRef} className="py-16 sm:py-20 bg-brand-cream/50 border-b border-brand-powder/30 overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-10">

        {/* Heading */}
        <div className="text-center mb-12 reveal">
          <p className="font-sans text-[10px] tracking-[0.28em] text-brand-teal uppercase font-semibold mb-3">
            What They Say
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-light text-brand-navy tracking-wider uppercase">
            Customer Love
          </h2>
          <div className="section-divider" />
        </div>

        {/* Testimonial card */}
        <div className="reveal reveal-delay-1">
          <div
            key={active}
            className="relative bg-white border border-brand-powder/60 rounded-sm px-8 sm:px-16 py-12 text-center shadow-sm"
            style={{ animation: 'heroFadeIn 0.5s ease both' }}
          >
            {/* Large decorative quote mark */}
            <div
              className="absolute top-6 left-8 font-serif text-7xl text-brand-teal/10 leading-none select-none pointer-events-none"
              aria-hidden="true"
            >
              "
            </div>

            {/* Stars */}
            <div className="flex justify-center gap-1 mb-6">
              {[...Array(t.stars)].map((_, i) => (
                <Star key={i} size={16} strokeWidth={0} className="fill-amber-400" />
              ))}
            </div>

            {/* Quote */}
            <blockquote className="font-serif text-lg sm:text-2xl font-light text-brand-navy leading-relaxed mb-8 max-w-2xl mx-auto">
              "{t.quote}"
            </blockquote>

            {/* Author */}
            <div className="flex flex-col items-center gap-3">
              <img
                src={t.avatar}
                alt={t.author}
                className="w-12 h-12 rounded-full object-cover border-2 border-brand-powder shadow-sm"
                loading="lazy"
              />
              <div>
                <cite className="font-sans not-italic text-[12px] font-semibold tracking-[0.18em] text-brand-teal uppercase block">
                  {t.author}
                </cite>
                <span className="font-sans text-[10px] text-brand-navy/40 tracking-wider">{t.location}</span>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center items-center gap-5 mt-7">
            <button
              onClick={prev}
              aria-label="Previous testimonial"
              className="p-2 rounded-full border border-brand-navy/15 text-brand-navy hover:border-brand-teal hover:text-brand-teal transition-all duration-200"
            >
              <ChevronLeft size={16} strokeWidth={1.8} />
            </button>

            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  aria-label={`Testimonial ${i + 1}`}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    i === active ? 'w-5 bg-brand-teal' : 'w-1 bg-brand-navy/20'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={next}
              aria-label="Next testimonial"
              className="p-2 rounded-full border border-brand-navy/15 text-brand-navy hover:border-brand-teal hover:text-brand-teal transition-all duration-200"
            >
              <ChevronRight size={16} strokeWidth={1.8} />
            </button>
          </div>
        </div>

        {/* All-time stats */}
        <div className="mt-12 grid grid-cols-3 gap-4 text-center reveal reveal-delay-2">
          {[
            { value: '4.9/5', label: 'Average Rating' },
            { value: '2,000+', label: 'Verified Reviews' },
            { value: '98%', label: 'Happy Customers' },
          ].map((s) => (
            <div key={s.label} className="py-5 bg-white border border-brand-powder/50 rounded-sm">
              <span className="font-serif text-xl sm:text-2xl text-brand-teal font-bold block">{s.value}</span>
              <span className="font-sans text-[10px] text-brand-navy/50 tracking-wider uppercase mt-1 block">{s.label}</span>
            </div>
          ))}
        </div>

      </div>

      <style>{`
        @keyframes heroFadeIn {
          from { opacity: 0; transform: translateX(16px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </section>
  );
}
