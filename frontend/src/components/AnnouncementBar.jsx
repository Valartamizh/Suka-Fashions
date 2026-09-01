import React, { useState, useEffect, useMemo } from 'react';
import { Truck, RefreshCcw, Banknote } from 'lucide-react';
import { useContent } from '../context/ContentContext';

const DEFAULT_ICONS = [Truck, RefreshCcw, Banknote];

export default function AnnouncementBar() {
  const { getSectionContent } = useContent();
  const content = getSectionContent('announcement');

  const items = useMemo(() => {
    const rawItems = [];
    if (content?.item1) rawItems.push(content.item1);
    if (content?.item2) rawItems.push(content.item2);
    if (content?.item3) rawItems.push(content.item3);

    if (rawItems.length === 0) {
      return [
        { icon: Truck, text: 'FREE SHIPPING ABOVE ₹1999' },
        { icon: RefreshCcw, text: 'EASY RETURNS & EXCHANGES' },
        { icon: Banknote, text: 'COD AVAILABLE ACROSS INDIA' },
      ];
    }

    return rawItems.map((text, idx) => ({
      icon: DEFAULT_ICONS[idx % DEFAULT_ICONS.length] || Truck,
      text,
    }));
  }, [content]);

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = (content?.speedSeconds || 4) * 1000;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, interval);
    return () => clearInterval(timer);
  }, [items.length, content?.speedSeconds]);

  if (items.length === 0) return null;

  return (
    <div className="hidden sm:block bg-brand-tealDark text-white z-50 relative border-b border-white/10" style={{ minHeight: 34 }}>
      <div className="max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-10 xl:px-14 2xl:px-16 h-[34px] flex items-center">

        {/* Desktop: all items evenly distributed */}
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
          const activeItem = items[currentIndex] || items[0];
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
