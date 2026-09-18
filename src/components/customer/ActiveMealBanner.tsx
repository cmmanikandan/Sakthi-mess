'use client';

import React from 'react';
import { useCanteen } from '@/context/CanteenContext';
import { Clock, Sparkles, Bike } from 'lucide-react';

export function ActiveMealBanner() {
  const { activeMealInfo, restaurantConfig } = useCanteen();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-rose-50 via-white to-rose-50 border border-rose-100 rounded-3xl p-4 sm:p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-white shadow-xs border border-rose-100 flex items-center justify-center text-2xl shrink-0">
            {activeMealInfo?.icon || '🍽️'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#E23744] uppercase tracking-wider flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#2E9B5B] animate-pulse" />
                Live Ordering
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-[#1C1C1C] tracking-tight mt-0.5">
              {activeMealInfo?.name || 'SAKTHI MESS'} Specials
            </h2>
            <p className="text-xs text-[#696969] flex items-center gap-1.5 mt-0.5" suppressHydrationWarning>
              <Clock className="w-3.5 h-3.5 text-[#E23744]" />
              <span>{mounted ? activeMealInfo?.statusText : 'Fresh & Hot Delivery'}</span>
            </p>
          </div>
        </div>

        <div className="self-start sm:self-center flex items-center gap-2 bg-white/95 backdrop-blur-xs px-3.5 py-2 rounded-2xl border border-rose-200/80 text-xs font-bold text-[#E23744] shadow-xs">
          <Bike className="w-4 h-4 text-[#2E9B5B]" />
          <span>Doorstep Delivery in {restaurantConfig.estimatedDeliveryTimeRange}</span>
        </div>
      </div>
    </div>
  );
}
