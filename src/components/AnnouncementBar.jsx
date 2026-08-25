import React, { useState, useEffect } from 'react';

const messages = [
  'Free Shipping Above ₹1999',
  'Easy Returns & Exchanges',
  'COD Available Across India',
];

export default function AnnouncementBar() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 4000); // Change message every 4 seconds
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-brand-navy text-white py-2 sm:py-2.5 px-4 z-50 relative border-b border-white/10">
      <div className="max-w-7xl mx-auto flex justify-center sm:justify-between items-center text-[9px] sm:text-[10px] uppercase font-sans tracking-[0.25em] font-medium">
        
        {/* Desktop: Show all messages separated by bullets */}
        <div className="hidden sm:flex items-center justify-between w-full">
          <span>{messages[0]}</span>
          <span className="text-white/30">•</span>
          <span>{messages[1]}</span>
          <span className="text-white/30">•</span>
          <span>{messages[2]}</span>
        </div>

        {/* Mobile: Rotate messages */}
        <div className="sm:hidden text-center transition-opacity duration-500 ease-in-out">
          <span>{messages[currentIndex]}</span>
        </div>

      </div>
    </div>
  );
}
