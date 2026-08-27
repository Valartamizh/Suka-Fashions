import React from 'react';
import { useReveal } from '../hooks/useReveal';
import { Feather, Scissors, Sparkles } from 'lucide-react';

// Import local assets for 100% reliable image loading
import dupattaSilk from '../assets/dupatta_silk.jpg';
import sareeBeigeMaroon from '../assets/saree_beige_maroon.jpg';
import dressWhite from '../assets/dress_white.jpg';

const craftsmanshipData = [
  {
    id: 1,
    icon: Feather,
    title: 'Thoughtful Fabrics',
    description: 'We source only the finest pure silks, breathable cottons, and lightweight organzas to ensure every piece feels as beautiful as it looks.',
    image: dupattaSilk
  },
  {
    id: 2,
    icon: Scissors,
    title: 'Fine Craftsmanship',
    description: 'Every stitch, sequin, and zari weave is carefully placed by skilled artisans who have perfected their craft over generations.',
    image: sareeBeigeMaroon
  },
  {
    id: 3,
    icon: Sparkles,
    title: 'Designed for Comfort',
    description: 'True elegance means never compromising on comfort. Our silhouettes are tailored to flatter and move with you gracefully.',
    image: dressWhite
  }
];

export default function Craftsmanship() {
  const sectionRef = useReveal();

  return (
    <section ref={sectionRef} className="py-12 lg:py-16 bg-white border-y border-brand-powder/50">
      <div className="max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-10 xl:px-14 2xl:px-16">

        {/* Section Heading */}
        <div className="text-center mb-10 reveal">
          <p className="font-sans text-[10px] tracking-[0.3em] text-brand-teal uppercase font-semibold mb-3">
            The Suka Standard
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-light text-brand-navy tracking-wider uppercase mb-4">
            Crafted With Care
          </h2>
          <div className="w-16 h-[1.5px] bg-brand-teal mx-auto" />
          <p className="mt-4 font-sans text-xs sm:text-sm text-brand-navy/60 font-light max-w-2xl mx-auto leading-relaxed">
            Our commitment to quality goes beyond the surface. It's woven into every fiber of our collections.
          </p>
        </div>

        {/* 3-Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {craftsmanshipData.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={item.id} className={`reveal reveal-delay-${index + 1} flex flex-col items-center text-center group`}>
                
                {/* Image Circle (object-top positioning) */}
                <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-full overflow-hidden mb-5 border border-brand-powder shadow-sm relative">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-brand-navy/10 group-hover:bg-transparent transition-colors duration-500" />
                  
                  {/* Floating Icon */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg text-brand-teal group-hover:text-brand-tealDark transition-colors duration-300">
                    <Icon size={22} strokeWidth={1.5} />
                  </div>
                </div>

                {/* Text Content */}
                <h3 className="font-serif text-xl sm:text-2xl font-medium text-brand-navy mb-4">
                  {item.title}
                </h3>
                <p className="font-sans text-sm text-brand-navy/65 leading-relaxed font-light">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
