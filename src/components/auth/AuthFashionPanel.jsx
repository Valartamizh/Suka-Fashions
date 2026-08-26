import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.jpg';

export default function AuthFashionPanel() {
  return (
    <div className="hidden md:flex md:w-1/2 lg:w-[48%] relative bg-brand-cream overflow-hidden group border-r border-brand-powder/50 min-h-[500px] lg:min-h-[540px]">
      <img
        src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=90&w=900&auto=format&fit=crop"
        alt="Suka Fashions featured ethnic wear"
        className="w-full h-full object-cover transition-transform duration-[8000ms] group-hover:scale-105"
        loading="eager"
      />
      {/* Soft teal/dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/85 via-brand-teal/20 to-transparent opacity-90" />

      {/* Brand logo top left */}
      <div className="absolute top-6 left-6 z-10">
        <Link to="/" className="flex items-center gap-2.5">
          <img src={logo} alt="Suka Logo" className="w-9 h-9 rounded-full border border-white/40 shadow-sm" />
          <span className="font-serif font-bold text-white text-lg tracking-wider">Suka</span>
        </Link>
      </div>

      {/* Editorial overlay content at bottom */}
      <div className="absolute bottom-8 left-8 right-8 z-10 text-white text-left">
        <span className="font-sans text-[9px] uppercase tracking-[0.28em] font-semibold text-brand-powder block mb-2">
          SUKA FASHIONS
        </span>
        <h2 className="font-serif text-2xl lg:text-3xl font-light leading-tight mb-2">
          Elegance, Made for You.
        </h2>
        <p className="font-sans text-xs text-white/75 font-light tracking-wide">
          Timeless styles crafted for every woman.
        </p>
      </div>
    </div>
  );
}
