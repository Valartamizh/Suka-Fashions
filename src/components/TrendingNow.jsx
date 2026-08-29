import React from 'react';
import { Link } from 'react-router-dom';
import { useReveal } from '../hooks/useReveal';

// Import local assets for 100% reliable image loading
import kurtiTealPrinted from '../assets/kurti_teal_printed.jpg';
import sareeBeigeMaroonFull2 from '../assets/saree_beige_maroon_full2.jpg';
import festiveSuit from '../assets/festive_suit.jpg';

const trending = [
  {
    id: 1,
    title: 'Modern Classics',
    subtitle: 'Everyday styles reimagined.',
    image: kurtiTealPrinted,
    link: '/category/kurtis'
  },
  {
    id: 2,
    title: 'Wedding Edit',
    subtitle: 'The bridal trousseau.',
    image: sareeBeigeMaroonFull2,
    link: '/category/occasion'
  },
  {
    id: 3,
    title: 'Festive Essentials',
    subtitle: 'Celebrate in style.',
    image: festiveSuit,
    link: '/category/occasion'
  }
];

export default function TrendingNow() {
  const sectionRef = useReveal();

  return (
    <section ref={sectionRef} className="py-6 lg:py-8 bg-white border-b border-brand-powder/30">
      <div className="max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-10 xl:px-14 2xl:px-16">

        {/* Header */}
        <div className="text-center mb-4 reveal">
          <p className="font-sans text-[10px] tracking-[0.28em] text-brand-teal uppercase font-semibold mb-2">
            In The Spotlight
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-light text-brand-navy tracking-wider uppercase">
            Trending Now
          </h2>
          <div className="section-divider" />
        </div>

        {/* Cards: Horizontal Snap Slider on Mobile, 3-Column Grid on Desktop */}
        <div className="flex overflow-x-auto md:grid md:grid-cols-3 gap-3.5 sm:gap-6 lg:gap-8 pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 no-scrollbar snap-x snap-mandatory">
          {trending.map((item, index) => (
            <Link 
              key={item.id} 
              to={item.link}
              className={`reveal reveal-delay-${index + 1} group relative block w-[75vw] max-w-[280px] md:max-w-none md:w-full flex-shrink-0 snap-start aspect-[3/4] overflow-hidden rounded-md bg-brand-cream border border-brand-powder/50 shadow-xs`}
            >
              <img 
                src={item.image} 
                alt={item.title}
                className="w-full h-full object-cover object-top transition-transform duration-[2000ms] ease-out group-hover:scale-105"
                loading="lazy"
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-85 group-hover:opacity-90 transition-opacity duration-500" />

              {/* Text Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6 lg:p-8 text-left">
                <span className="font-sans text-[9px] sm:text-[10px] tracking-widest text-brand-powder uppercase mb-1 sm:mb-2 block transform sm:translate-y-4 sm:opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  Explore Collection
                </span>
                <h3 className="font-serif text-lg sm:text-2xl lg:text-3xl font-medium text-white mb-0.5 sm:mb-1 leading-tight transform group-hover:-translate-y-1 transition-transform duration-300">
                  {item.title}
                </h3>
                <p className="font-sans text-[11px] sm:text-xs text-white/75 font-light transform group-hover:-translate-y-1 transition-transform duration-300 delay-75">
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
