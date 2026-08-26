import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ProductCard from './ProductCard';
import { products } from '../data/products';
import { useReveal } from '../hooks/useReveal';

export default function NewArrivals() {
  const sectionRef = useReveal();
  const newArrivals = products.filter((p) => p.isNew).slice(0, 4);

  return (
    <section ref={sectionRef} className="py-12 lg:py-16 bg-white border-b border-brand-powder/30">
      <div className="max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-10 xl:px-14 2xl:px-16">

        {/* Header row */}
        <div className="flex justify-between items-end mb-7 pb-3 border-b border-brand-powder/40 reveal">
          <div>
            <p className="font-sans text-[10px] tracking-[0.28em] text-brand-teal uppercase font-semibold mb-1.5">
              Just In
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-light text-brand-navy tracking-wider uppercase">
              New Arrivals
            </h2>
            <div className="section-divider-left mt-2" />
          </div>
          <Link
            to="/products"
            className="hidden sm:flex items-center gap-2 font-sans text-[11px] tracking-[0.18em] uppercase text-brand-teal hover:text-brand-tealDark font-semibold transition-colors duration-200 group"
          >
            <span>View All</span>
            <ArrowRight size={14} strokeWidth={2} className="transform transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-7">
          {newArrivals.map((product, idx) => (
            <div key={product.id} className={`reveal reveal-delay-${idx + 1}`}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Mobile: View All button */}
        <div className="mt-8 text-center sm:hidden reveal">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 font-sans text-[11px] tracking-[0.18em] uppercase text-brand-teal border border-brand-teal px-6 py-3 hover:bg-brand-teal hover:text-white transition-all duration-300"
          >
            View All New Arrivals
            <ArrowRight size={13} strokeWidth={2} />
          </Link>
        </div>

      </div>
    </section>
  );
}
