'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { BrandLogo } from '@/components/common/BrandLogo';
import { ChefHat, Tv, ArrowLeft, LogOut, ShieldCheck, Bike, User } from 'lucide-react';

export default function KitchenLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, role, loginAs, logout } = useAuth();

  return (
    <div className="min-h-screen bg-[#F8F8F8] flex flex-col text-[#1C1C1C]">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#E8E8E8] shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/kitchen/dashboard" className="flex items-center gap-2">
              <BrandLogo size="sm" />
              <span className="bg-[#E23744] text-white text-[10px] font-black uppercase px-2 py-0.5 rounded">
                KITCHEN
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* KDS Mode Toggle */}
            <Link
              href="/kitchen/kds"
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                pathname === '/kitchen/kds'
                  ? 'bg-[#1C1C1C] text-white shadow-xs'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-800'
              }`}
            >
              <Tv className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">KDS Display Mode</span>
            </Link>

            {/* Quick Portals for Testing */}
            <button
              onClick={() => {
                loginAs('delivery_staff');
                router.push('/delivery/dashboard');
              }}
              className="hidden md:flex items-center gap-1 text-xs font-bold bg-stone-100 hover:bg-stone-200 px-3 py-1.5 rounded-xl transition"
              title="Switch to Delivery Staff"
            >
              <Bike className="w-3.5 h-3.5 text-[#2E9B5B]" />
              <span>Delivery</span>
            </button>

            <button
              onClick={() => {
                loginAs('admin');
                router.push('/admin/dashboard');
              }}
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
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
