import React, { useState, useEffect } from 'react';
import { Truck, RefreshCcw, Banknote } from 'lucide-react';

const items = [
  { icon: Truck,       text: 'FREE SHIPPING ABOVE ₹1999' },
  { icon: RefreshCcw,  text: 'EASY RETURNS & EXCHANGES'  },
  { icon: Banknote,    text: 'COD AVAILABLE ACROSS INDIA' },
];

export default function AnnouncementBar() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="hidden sm:block bg-brand-tealDark text-white z-50 relative border-b border-white/10" style={{ minHeight: 34 }}>
      <div className="max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-10 xl:px-14 2xl:px-16 h-[34px] flex items-center">

        {/* Desktop: all three evenly distributed */}
        <div className="hidden sm:flex items-center justify-between w-full">
          {items.map(({ icon: Icon, text }, i) => (
            <span key={i} className="flex items-center gap-1.5 font-sans text-[9.5px] uppercase tracking-[0.22em] font-medium text-white/90">
              <Icon size={11} strokeWidth={1.8} className="text-brand-powder/80 flex-shrink-0" />
              {text}
            </span>
          ))}
        </div>

        {/* Mobile: rotate */}
        {(() => {
          const activeItem = items[currentIndex];
          const Icon = activeItem.icon;
          return (
            <div className="sm:hidden flex items-center justify-center w-full gap-1.5">
              <Icon size={11} strokeWidth={1.8} className="text-brand-powder/80" />
              <span className="font-sans text-[9px] uppercase tracking-[0.2em] font-medium">
                {activeItem.text}
              </span>
            </div>
          );
        })()}

      </div>
    </div>
  );
}
