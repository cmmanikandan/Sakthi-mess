'use client';

import React from 'react';
import Link from 'next/link';
import { BrandLogo } from '@/components/common/BrandLogo';
import { useAuth } from '@/context/AuthContext';
import { Bike, ChefHat, ShieldCheck, User } from 'lucide-react';

export default function DeliveryLayout({ children }: { children: React.ReactNode }) {
  const { loginAs, user } = useAuth();

  return (
    <div className="min-h-screen bg-[#F8F8F8] flex flex-col text-[#1C1C1C]">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#E8E8E8] shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/delivery/dashboard" className="flex items-center gap-2">
              <BrandLogo size="sm" />
              <span className="bg-[#2E9B5B] text-white text-[10px] font-black uppercase px-2 py-0.5 rounded">
                DELIVERY
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Portals for Testing */}
            <button
              onClick={() => loginAs('kitchen_staff')}
              className="hidden md:flex items-center gap-1 text-xs font-bold bg-stone-100 hover:bg-stone-200 px-3 py-1.5 rounded-xl transition"
              title="Switch to Kitchen Staff"
            >
              <ChefHat className="w-3.5 h-3.5 text-[#E23744]" />
              <span>Kitchen</span>
            </button>

            <button
              onClick={() => loginAs('admin')}
              className="hidden md:flex items-center gap-1 text-xs font-bold bg-stone-100 hover:bg-stone-200 px-3 py-1.5 rounded-xl transition"
              title="Switch to Admin"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
              <span>Admin</span>
            </button>

            <Link
              href="/customer/home"
              className="text-xs font-bold text-[#696969] hover:text-[#1C1C1C] px-2 py-1"
            >
              Storefront
            </Link>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
