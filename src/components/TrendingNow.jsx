import React from 'react';
import { Link } from 'react-router-dom';
import { useReveal } from '../hooks/useReveal';

const trending = [
  {
    id: 1,
    title: 'Modern Classics',
    subtitle: 'Everyday styles reimagined.',
    image: 'https://images.unsplash.com/photo-1608748010899-18f300247112?q=80&w=600&auto=format&fit=crop',
    link: '/category/kurtis'
  },
  {
    id: 2,
    title: 'Wedding Edit',
    subtitle: 'The bridal trousseau.',
    image: 'https://images.unsplash.com/photo-1596783074918-c84cb06531ca?q=80&w=600&auto=format&fit=crop',
    link: '/category/occasion'
  },
  {
    id: 3,
    title: 'Festive Essentials',
    subtitle: 'Celebrate in style.',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=600&auto=format&fit=crop',
    link: '/category/occasion'
  }
];

export default function TrendingNow() {
  const sectionRef = useReveal();

  return (
    <section ref={sectionRef} className="py-16 sm:py-20 bg-white border-b border-brand-powder/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">

        {/* Header */}
        <div className="text-center mb-12 reveal">
          <p className="font-sans text-[10px] tracking-[0.28em] text-brand-teal uppercase font-semibold mb-3">
            In The Spotlight
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-light text-brand-navy tracking-wider uppercase">
            Trending Now
          </h2>
          <div className="section-divider" />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {trending.map((item, index) => (
            <Link 
              key={item.id} 
              to={item.link}
              className={`reveal reveal-delay-${index + 1} group relative block w-full aspect-[4/5] sm:aspect-[3/4] overflow-hidden rounded-sm bg-brand-cream border border-brand-powder/50`}
            >
              <img 
                src={item.image} 
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-105"
                loading="lazy"
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />

              {/* Text Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-6 lg:p-8">
                <span className="font-sans text-[10px] tracking-widest text-brand-powder uppercase mb-2 block transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  Explore Collection
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-medium text-white mb-1 leading-tight transform group-hover:-translate-y-1 transition-transform duration-300">
                  {item.title}
                </h3>
                <p className="font-sans text-xs text-white/70 font-light transform group-hover:-translate-y-1 transition-transform duration-300 delay-75">
                  {item.subtitle}
                </p>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
