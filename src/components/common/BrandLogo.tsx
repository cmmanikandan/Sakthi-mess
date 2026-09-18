'use client';

import React from 'react';
import Image from 'next/image';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  layout?: 'horizontal' | 'vertical';
  variant?: 'default' | 'white';
  className?: string;
  iconOnly?: boolean;
}

export function BrandLogo({
  size = 'md',
  layout = 'horizontal',
  variant = 'default',
  className = '',
  iconOnly = false,
}: BrandLogoProps) {
  const isWhite = variant === 'white';
  const sakthiColor = isWhite ? 'text-white' : 'text-[#1C1C1C]';
  const messColor = 'text-[#E23744]';

  // Dimension tokens tailored for SAKTHI MESS
  // Desktop brand width: ~120-150px, Mobile: ~105-125px
  const dimensions = {
    sm: {
      iconSize: 'w-7 h-7 sm:w-8 sm:h-8',
      iconPixels: 32,
      fontSize: 'text-sm sm:text-base font-black tracking-tight leading-none',
      messMargin: 'ml-1 sm:ml-1.5',
      gap: 'gap-2',
    },
    md: {
      iconSize: 'w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11',
      iconPixels: 44,
      fontSize: 'text-base sm:text-lg md:text-xl font-black tracking-tight leading-none',
      messMargin: 'ml-1.5',
      gap: 'gap-2 sm:gap-2.5',
    },
    lg: {
      iconSize: 'w-12 h-12 sm:w-14 sm:h-14',
      iconPixels: 56,
      fontSize: 'text-xl sm:text-2xl font-black tracking-tight leading-none',
      messMargin: 'ml-2',
      gap: 'gap-3',
    },
    xl: {
      iconSize: 'w-16 h-16 sm:w-20 sm:h-20',
      iconPixels: 80,
      fontSize: 'text-2xl sm:text-3xl font-black tracking-tight leading-none',
      messMargin: 'ml-2.5',
      gap: 'gap-3.5',
    },
  }[size];

  if (iconOnly) {
    return (
      <div className={`relative ${dimensions.iconSize} shrink-0 drop-shadow-sm rounded-full overflow-hidden ${className}`}>
        <Image
          src="/logo-icon.png"
          alt="SAKTHI MESS Emblem"
          fill
          sizes={`${dimensions.iconPixels}px`}
          priority
          className="object-contain"
        />
      </div>
    );
  }

  if (layout === 'vertical') {
    return (
      <div className={`flex flex-col items-center text-center ${dimensions.gap} ${className}`}>
        <div className={`relative ${dimensions.iconSize} shrink-0 drop-shadow-sm rounded-full overflow-hidden`}>
          <Image
            src="/logo-icon.png"
            alt="SAKTHI MESS"
            fill
            sizes={`${dimensions.iconPixels}px`}
            priority
            className="object-contain"
          />
        </div>

        <div className="flex flex-col items-center">
          <div className="flex items-baseline tracking-tight leading-none select-none font-extrabold">
            <span className={`${dimensions.fontSize} ${sakthiColor}`}>
              SAKTHI
            </span>
            <span className={`${dimensions.fontSize} ${messColor} ${dimensions.messMargin}`}>
              MESS
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center ${dimensions.gap} ${className}`}>
      {/* Official SAKTHI MESS Icon Emblem */}
      <div className={`relative ${dimensions.iconSize} shrink-0 drop-shadow-xs rounded-full overflow-hidden`}>
        <Image
          src="/logo-icon.png"
          alt="SAKTHI MESS Logo"
          fill
          sizes={`${dimensions.iconPixels}px`}
          priority
          className="object-contain"
        />
      </div>

      {/* SAKTHI MESS Separate HTML/CSS Wordmark */}
      <div className="flex flex-col justify-center select-none font-extrabold">
        <div className="flex items-baseline tracking-tight leading-none">
          <span className={`${dimensions.fontSize} ${sakthiColor}`}>
            SAKTHI
          </span>
          <span className={`${dimensions.fontSize} ${messColor} ${dimensions.messMargin}`}>
            MESS
          </span>
        </div>
      </div>
    </div>
  );
}
