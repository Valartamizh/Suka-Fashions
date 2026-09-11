import React, { useState, useEffect, useMemo } from 'react';
import { Truck, RefreshCcw, Banknote, Sparkles, Tag, ShieldCheck, Award } from 'lucide-react';
import { useContent } from '../context/ContentContext';

const ICON_MAP = {
  Truck,
  RefreshCcw,
  Banknote,
  Sparkles,
  Tag,
  ShieldCheck,
  Award,
};

export default function AnnouncementBar() {
  const { getSectionContent } = useContent();
  const content = getSectionContent('announcement');

  const theme = content?.theme || 'default'; // 'default' (Teal) | 'light' | 'dark'

  const themeClasses = useMemo(() => {
    switch (theme) {
      case 'light':
        return 'bg-brand-cream text-brand-navy border-b border-brand-powder/60';
      case 'dark':
        return 'bg-brand-navy text-white border-b border-white/10';
      case 'default':
      default:
        return 'bg-brand-tealDark text-white border-b border-white/10';
    }
  }, [theme]);

  const items = useMemo(() => {
    if (content?.items && Array.isArray(content.items) && content.items.length > 0) {
      return content.items
        .filter(item => item.enabled !== false)
        .map(item => {
          const IconComp = ICON_MAP[item.icon] || Truck;
          return {
            icon: IconComp,
            text: item.text,
          };
        });
    }

    const fallbackList = [];
    if (content?.item1) fallbackList.push({ icon: Truck, text: content.item1 });
    if (content?.item2) fallbackList.push({ icon: RefreshCcw, text: content.item2 });
    if (content?.item3) fallbackList.push({ icon: Banknote, text: content.item3 });

    if (fallbackList.length > 0) return fallbackList;

    return [
      { icon: Truck, text: 'FREE SHIPPING ABOVE ₹1999' },
      { icon: RefreshCcw, text: 'EASY RETURNS & EXCHANGES' },
      { icon: Banknote, text: 'COD AVAILABLE ACROSS INDIA' },
    ];
  }, [content]);

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (items.length <= 1) return;
    const interval = (content?.speedSeconds || 4) * 1000;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, interval);
    return () => clearInterval(timer);
  }, [items.length, content?.speedSeconds]);

  if (items.length === 0) return null;

  return (
    <div className={`hidden sm:block ${themeClasses} z-50 relative`} style={{ minHeight: 34 }}>
      <div className="max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-10 xl:px-14 2xl:px-16 h-[34px] flex items-center">

        {/* Desktop: all items evenly distributed */}
        <div className="hidden sm:flex items-center justify-between w-full">
          {items.map(({ icon: Icon, text }, i) => (
            <span key={i} className="flex items-center gap-1.5 font-sans text-[9.5px] uppercase tracking-[0.22em] font-medium opacity-90">
              <Icon size={11} strokeWidth={1.8} className="flex-shrink-0 opacity-80" />
              {text}
            </span>
          ))}
        </div>

        {/* Mobile: rotate */}
        {(() => {
          const activeItem = items[currentIndex] || items[0];
          const Icon = activeItem?.icon || Truck;
          return (
            <div className="sm:hidden flex items-center justify-center w-full gap-1.5">
              <Icon size={11} strokeWidth={1.8} className="opacity-80" />
              <span className="font-sans text-[9px] uppercase tracking-[0.2em] font-medium">
                {activeItem?.text}
              </span>
            </div>
          );
        })()}

      </div>
    </div>
  );
}
