import React, { useEffect } from 'react';
import sukaLoaderGif from '../../assets/suka-loader.gif';

/**
 * AppLoader — The official Suka Fashions loading animation component.
 *
 * Supports:
 * - Full-screen initial app / route initialization
 * - Responsive sizing (Mobile: 100-120px, Tablet: 120-140px, Desktop: 140-170px for fullScreen)
 * - Inline page / section / component data loading (60-90px for compact views)
 * - Accessibility (role="status", aria-live="polite", descriptive alt)
 * - Scroll-lock during full-screen presentation
 * - Respects prefers-reduced-motion
 */
export default function AppLoader({
  fullScreen = false,
  size = 'md', // 'sm' | 'md' | 'lg'
  message = null,
  subtitle = 'Women Based • Women Empowered',
  showBrandText = undefined,
  minHeight = 'min-h-[280px]',
  className = '',
}) {
  // Brand text defaults to true on fullScreen, false on inline unless explicitly requested
  const displayBrandText = showBrandText !== undefined ? showBrandText : fullScreen;

  // Lock scroll when full-screen loader is displayed
  useEffect(() => {
    if (!fullScreen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [fullScreen]);

  // Determine GIF responsive dimension classes
  let sizeClasses = 'w-20 sm:w-24'; // Default 'md' inline (approx 80-96px)

  if (fullScreen || size === 'lg') {
    // Full-screen responsive spec:
    // Mobile: 100px - 120px (w-28 = 112px)
    // Tablet: 120px - 140px (sm:w-32 = 128px)
    // Desktop: 140px - 170px (md:w-36 = 144px, lg:w-40 = 160px)
    sizeClasses = 'w-28 sm:w-32 md:w-36 lg:w-40 max-w-[170px]';
  } else if (size === 'sm') {
    // Mini inline loader (approx 60-75px)
    sizeClasses = 'w-16 sm:w-18';
  } else if (size === 'md') {
    // Standard section inline loader (approx 80-100px)
    sizeClasses = 'w-20 sm:w-24';
  }

  const content = (
    <div className="flex flex-col items-center justify-center text-center p-4 select-none">
      {/* Official Suka Fashions GIF Animation */}
      <div className="relative flex items-center justify-center">
        <img
          src={sukaLoaderGif || '/suka-loader.gif'}
          alt="Suka Fashions loading"
          className={`${sizeClasses} h-auto object-contain pointer-events-none transition-transform duration-200`}
          loading="eager"
        />
      </div>

      {/* Brand Identification */}
      {displayBrandText && (
        <div className="mt-3.5 sm:mt-4 space-y-1 animate-in fade-in duration-300">
          <h2 className="font-serif text-sm sm:text-base font-bold text-brand-navy tracking-[0.28em] uppercase">
            SUKA FASHIONS
          </h2>
          {subtitle && (
            <p className="font-sans text-[10.5px] sm:text-xs text-brand-navy/60 font-medium tracking-wider">
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* Optional contextual operation message */}
      {message && (
        <p className="font-sans text-xs text-slate-500 font-medium tracking-wide mt-2.5">
          {message}
        </p>
      )}

      {/* Visually hidden text for screen readers */}
      <span className="sr-only">Loading Suka Fashions...</span>
    </div>
  );

  // Full Screen Presentation
  if (fullScreen) {
    return (
      <div
        role="status"
        aria-live="polite"
        className={`fixed inset-0 z-[9999] flex items-center justify-center bg-[#ECF0F1] transition-opacity duration-300 ${className}`}
      >
        {content}
      </div>
    );
  }

  // Inline / Component-Level Presentation
  return (
    <div
      role="status"
      aria-live="polite"
      className={`w-full flex items-center justify-center ${minHeight} ${className}`}
    >
      {content}
    </div>
  );
}
