'use client';

import React from 'react';
import Image from 'next/image';

interface MobileSplashProps {
  isVisible: boolean;
}

export function MobileSplash({ isVisible }: MobileSplashProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-white md:hidden">
      {/* Centered SAKTHI MESS logo and typography */}
      <div className="flex flex-col items-center justify-center text-center">
        <div className="relative w-28 h-28 rounded-full overflow-hidden shadow-card border border-stone-100">
          <Image
            src="/logo-icon.png"
            alt="SAKTHI MESS"
            fill
            priority
            sizes="112px"
            className="object-contain"
          />
        </div>

        <div className="mt-4 flex items-baseline tracking-tight leading-none font-black">
          <span className="text-3xl text-[#1C1C1C]">SAKTHI</span>
          <span className="text-3xl text-[#E23744] ml-2">MESS</span>
        </div>
      </div>

      {/* Bottom animated loading dots: . .. ... */}
      <div className="absolute bottom-12 inset-x-0 z-20 flex items-center justify-center pointer-events-none">
        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/95 backdrop-blur-md border border-stone-200/80 shadow-md">
          <span className="w-2.5 h-2.5 rounded-full bg-[#E23744] animate-bounce [animation-delay:-0.3s]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#E23744] animate-bounce [animation-delay:-0.15s]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#E23744] animate-bounce" />
        </div>
      </div>
    </div>
  );
}
