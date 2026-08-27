import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Sparkles, Heart, ShieldCheck, Award, ArrowRight, Users, Feather, Compass } from 'lucide-react';
import logo from '../assets/logo.jpg';
import brandStoryImg from '../assets/saree_golden.jpg';

export default function About() {
  return (
    <div className="w-full bg-white text-left">
      
      {/* ─── Hero Header ────────────────────────────────────────────────────────── */}
      <section className="relative bg-brand-cream/60 py-16 sm:py-24 border-b border-brand-powder/60 overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.3em] text-brand-teal font-bold mb-3 block">
            Our Story & Heritage
          </span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif text-brand-navy tracking-wide mb-6">
            Women Based • Women Empowered
          </h1>
          <p className="font-sans text-sm sm:text-base text-brand-navy/70 max-w-2xl mx-auto leading-relaxed font-light">
            Suka Fashions was born out of a deep reverence for Indian textiles and an unwavering commitment to empowering women artisans across India.
          </p>
        </div>
      </section>

      {/* ─── Brand Ethos & Mission ────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <img src={logo} alt="Suka Logo" className="w-12 h-12 rounded-full object-cover border border-brand-powder shadow-sm" />
              <div>
                <h2 className="font-serif text-2xl text-brand-navy uppercase tracking-wider">The Suka Vision</h2>
                <p className="font-sans text-[10px] text-brand-teal font-bold uppercase tracking-[0.2em]">Crafted for the Modern Woman</p>
              </div>
            </div>

            <p className="font-serif text-xl sm:text-2xl text-brand-navy/80 italic leading-relaxed">
              "We believe that true luxury lies in the story behind every weave, the hands that crafted it, and the confidence it brings to the woman wearing it."
            </p>

            <p className="font-sans text-xs sm:text-sm text-brand-navy/70 leading-relaxed font-light">
              Founded with the vision to celebrate timeless Indian elegance, Suka Fashions curates handcrafted sarees, kurtis, lehengas, and occasion wear that effortlessly bridge ancient weaving techniques with contemporary aesthetic appeal.
            </p>

            <p className="font-sans text-xs sm:text-sm text-brand-navy/70 leading-relaxed font-light">
              Every drape from Suka Fashions carries the legacy of master weavers from Banaras, Kanchipuram, Bengal, and Lucknow. By working directly with women artisan clusters, we ensure fair wages, safe working environments, and economic independence for rural families.
            </p>

            <div className="pt-4">
              <RouterLink
                to="/products"
                className="inline-flex items-center gap-3 bg-brand-teal text-white px-8 py-3.5 rounded-sm font-sans text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-brand-tealDark transition-colors shadow-md group"
              >
                Explore The Collection <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </RouterLink>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-[4/5] rounded-sm overflow-hidden shadow-xl border border-brand-powder/50">
              <img src={brandStoryImg} alt="Suka Fashions Craftsmanship" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-brand-navy text-white p-6 rounded-sm max-w-xs shadow-2xl hidden sm:block">
              <p className="font-serif text-3xl font-light text-amber-400 mb-1">100%</p>
              <p className="font-sans text-xs uppercase tracking-wider font-semibold">Authentic Handloom & Sustainable Weaves</p>
            </div>
          </div>

        </div>
      </section>

      {/* ─── 4 Pillars of Excellence ───────────────────────────────────────────── */}
      <section className="bg-brand-cream/40 py-16 sm:py-24 border-y border-brand-powder/50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-brand-teal font-bold mb-2 block">Our Foundations</span>
            <h2 className="text-2xl sm:text-4xl font-serif text-brand-navy uppercase tracking-wider">The Four Pillars</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            
            <div className="bg-white p-8 rounded-sm border border-brand-powder/60 shadow-2xs hover:shadow-md transition-shadow text-left">
              <div className="w-12 h-12 rounded-full bg-brand-powderLight flex items-center justify-center text-brand-teal mb-5">
                <Users size={22} />
              </div>
              <h3 className="font-serif text-lg text-brand-navy mb-2">Artisan Empowerment</h3>
              <p className="font-sans text-xs text-brand-navy/60 leading-relaxed font-light">
                Empowering over 500+ female artisans across rural handloom clusters through fair wages and skill upliftment.
              </p>
            </div>

            <div className="bg-white p-8 rounded-sm border border-brand-powder/60 shadow-2xs hover:shadow-md transition-shadow text-left">
              <div className="w-12 h-12 rounded-full bg-brand-powderLight flex items-center justify-center text-brand-teal mb-5">
                <Feather size={22} />
              </div>
              <h3 className="font-serif text-lg text-brand-navy mb-2">Purity & Quality</h3>
              <p className="font-sans text-xs text-brand-navy/60 leading-relaxed font-light">
                Certified pure silks, organzas, georgettes, and hand-embroidered threads that stand the test of time.
              </p>
            </div>

            <div className="bg-white p-8 rounded-sm border border-brand-powder/60 shadow-2xs hover:shadow-md transition-shadow text-left">
              <div className="w-12 h-12 rounded-full bg-brand-powderLight flex items-center justify-center text-brand-teal mb-5">
                <Compass size={22} />
              </div>
              <h3 className="font-serif text-lg text-brand-navy mb-2">Sustainable Fashion</h3>
              <p className="font-sans text-xs text-brand-navy/60 leading-relaxed font-light">
                Slow, conscious production with minimal chemical dyes and eco-friendly packaging materials.
              </p>
            </div>

            <div className="bg-white p-8 rounded-sm border border-brand-powder/60 shadow-2xs hover:shadow-md transition-shadow text-left">
              <div className="w-12 h-12 rounded-full bg-brand-powderLight flex items-center justify-center text-brand-teal mb-5">
                <Award size={22} />
              </div>
              <h3 className="font-serif text-lg text-brand-navy mb-2">Unmatched Elegance</h3>
              <p className="font-sans text-xs text-brand-navy/60 leading-relaxed font-light">
                Contemporary cuts tailored to accentuate grace, dignity, and regal poise for every festive moment.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ─── Impact Statistics ─────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 bg-brand-navy text-white text-center">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <p className="font-serif text-4xl sm:text-5xl font-light text-brand-powder mb-2">50,000+</p>
            <p className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.2em] text-white/70">Happy Women Worldwide</p>
          </div>
          <div>
            <p className="font-serif text-4xl sm:text-5xl font-light text-brand-powder mb-2">500+</p>
            <p className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.2em] text-white/70">Master Weavers & Artisans</p>
          </div>
          <div>
            <p className="font-serif text-4xl sm:text-5xl font-light text-brand-powder mb-2">100%</p>
            <p className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.2em] text-white/70">Handpicked Luxury Fabrics</p>
          </div>
          <div>
            <p className="font-serif text-4xl sm:text-5xl font-light text-brand-powder mb-2">25+</p>
            <p className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.2em] text-white/70">Global Destination Outlets</p>
          </div>
        </div>
      </section>

    </div>
  );
}
