import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-brand-cream/20 py-20 px-4">
      <div className="text-center max-w-lg mx-auto">
        
        <h1 className="font-serif text-[8rem] sm:text-[10rem] font-light text-brand-powder/50 leading-none select-none relative -mb-12 sm:-mb-16">
          404
        </h1>
        
        <div className="relative z-10">
          <p className="font-sans text-[10px] tracking-[0.3em] text-brand-teal uppercase font-semibold mb-4">
            Page Not Found
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl text-brand-navy mb-6">
            Lost in the details?
          </h2>
          <p className="font-sans text-sm text-brand-navy/60 font-light leading-relaxed mb-10">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable. 
          </p>
          
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-brand-navy text-white px-8 py-3.5 font-sans text-[10px] uppercase tracking-[0.2em] font-semibold hover:bg-brand-teal transition-colors rounded-sm shadow-md"
          >
            <Home size={14} /> Back to Homepage
          </Link>
        </div>

      </div>
    </div>
  );
}
