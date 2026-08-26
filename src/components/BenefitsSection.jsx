import React from 'react';
import { Award, RotateCcw, ShieldCheck, Truck } from 'lucide-react';
import { useReveal } from '../hooks/useReveal';

const benefits = [
  {
    icon:  Award,
    title: 'Premium Quality',
    desc:  'Finest fabrics & craftsmanship',
  },
  {
    icon:  RotateCcw,
    title: 'Easy Returns',
    desc:  'Hassle-free returns & exchanges',
  },
  {
    icon:  ShieldCheck,
    title: 'Secure Payments',
    desc:  '100% safe & secure checkout',
  },
  {
    icon:  Truck,
    title: 'Fast Delivery',
    desc:  'Express delivery across India',
  },
];

export default function BenefitsSection() {
  const sectionRef = useReveal();

  return (
    <section ref={sectionRef} className="py-8 lg:py-10 bg-[#F5FAFB] border-y border-brand-powder/50">
      <div className="max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-10 xl:px-14 2xl:px-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {benefits.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className={`reveal reveal-delay-${i + 1} flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left`}
              >
                {/* Icon wrapper */}
                <div className="flex-shrink-0 w-11 h-11 rounded-full bg-brand-powder flex items-center justify-center">
                  <Icon size={20} strokeWidth={1.5} className="text-brand-teal" />
                </div>

                {/* Text */}
                <div>
                  <h4 className="font-serif text-[13px] sm:text-sm font-semibold text-brand-navy tracking-wide mb-0.5">
                    {item.title}
                  </h4>
                  <p className="font-sans text-[11px] text-brand-navy/55 font-light leading-snug">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
