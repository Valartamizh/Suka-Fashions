import React from 'react';

/**
 * HeroWaves — translucent flowing fabric/organza-style SVG background
 * Positioned absolute at the bottom of the hero section.
 * Uses multiple layered paths with varying opacity for a soft chiffon look.
 */
export default function HeroWaves() {
  return (
    <div
      className="absolute inset-x-0 bottom-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
      style={{ height: '62%' }}
    >
      <svg
        viewBox="0 0 1440 400"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 w-full h-full"
      >
        {/* Layer 1 — wide gentle base wave */}
        <path
          d="M0,260 C180,180 360,320 540,240 C720,160 900,300 1080,220 C1260,140 1380,240 1440,200 L1440,400 L0,400 Z"
          fill="#E1F2F4"
          fillOpacity="0.22"
        />

        {/* Layer 2 — flowing mid wave */}
        <path
          d="M0,300 C120,240 280,360 460,280 C640,200 800,340 980,270 C1160,200 1320,300 1440,260 L1440,400 L0,400 Z"
          fill="#006B70"
          fillOpacity="0.07"
        />

        {/* Layer 3 — tighter ripple detail */}
        <path
          d="M0,330 C100,300 200,360 340,320 C480,280 580,350 720,310 C860,270 960,340 1100,305 C1240,270 1360,320 1440,295 L1440,400 L0,400 Z"
          fill="#E1F2F4"
          fillOpacity="0.30"
        />

        {/* Layer 4 — soft aqua top edge stroke */}
        <path
          d="M0,280 C200,210 400,330 600,260 C800,190 1000,310 1200,240 C1320,205 1400,240 1440,230"
          fill="none"
          stroke="#006B70"
          strokeWidth="1.2"
          strokeOpacity="0.12"
        />

        {/* Layer 5 — very light filler near bottom */}
        <path
          d="M0,350 C180,330 360,370 540,345 C720,320 900,365 1080,342 C1260,318 1380,348 1440,336 L1440,400 L0,400 Z"
          fill="#F3FAFB"
          fillOpacity="0.45"
        />

        {/* Layer 6 — softest highlight stroke */}
        <path
          d="M0,310 C160,280 320,340 520,300 C720,260 880,330 1080,290 C1200,268 1340,300 1440,285"
          fill="none"
          stroke="#B2DDE2"
          strokeWidth="1.5"
          strokeOpacity="0.18"
        />
      </svg>
    </div>
  );
}
