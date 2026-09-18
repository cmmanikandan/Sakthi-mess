'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock, Utensils, Award, Sparkles, CheckCircle2, ShieldCheck, Heart } from 'lucide-react';
import { BrandLogo } from '@/components/common/BrandLogo';

export default function SakthiMessStandardsPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-neutral-900">
      {/* Top Header */}
      <header className="border-b border-neutral-200 bg-white/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition">
            <BrandLogo size="sm" />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-neutral-200 text-xs font-bold text-neutral-700 hover:bg-neutral-50 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#E23744]" />
            <span>Back to Home</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-8">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 text-[#E23744] rounded-full text-xs font-bold">
            <Award className="w-3.5 h-3.5" />
            <span>Quality & Food Safety Standards</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-neutral-900">
            Kitchen Standards & Service Timings
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500">
            SAKTHI MESS Quality Commitment, Fresh Preparation & Timely Delivery
          </p>
        </div>

        <div className="prose prose-stone max-w-none space-y-6 text-sm leading-relaxed text-neutral-600">
          <section className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-xs space-y-3">
            <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#E23744]" />
              <span>1. Meal Service Schedules</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200">
                <span className="font-bold text-xs text-neutral-900 block">🌅 Breakfast</span>
                <span className="text-xs text-[#E23744] font-semibold">07:00 AM – 10:30 AM</span>
                <p className="text-[11px] text-neutral-500 mt-0.5">Hot Idli, Crispy Dosa, Pongal, Vada & Filter Coffee</p>
              </div>
              <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200">
                <span className="font-bold text-xs text-neutral-900 block">☀️ Lunch</span>
                <span className="text-xs text-[#E23744] font-semibold">11:30 AM – 03:30 PM</span>
                <p className="text-[11px] text-neutral-500 mt-0.5">Chicken Biryani, South Indian Meals, Parotta & Starters</p>
              </div>
              <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200">
                <span className="font-bold text-xs text-neutral-900 block">🍪 Evening Snacks</span>
                <span className="text-xs text-[#E23744] font-semibold">04:00 PM – 06:30 PM</span>
                <p className="text-[11px] text-neutral-500 mt-0.5">Hot Samosas, Bajji, Filter Coffee & Refreshments</p>
              </div>
              <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200">
                <span className="font-bold text-xs text-neutral-900 block">🌙 Dinner</span>
                <span className="text-xs text-[#E23744] font-semibold">07:00 PM – 10:30 PM</span>
                <p className="text-[11px] text-neutral-500 mt-0.5">Bun Parotta, Kothu Parotta, Kari Dosa, Fried Rice</p>
              </div>
            </div>
          </section>

          <section className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-xs space-y-3">
            <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#E23744]" />
              <span>2. 100% Fresh Preparation Guarantee</span>
            </h2>
            <p>
              We cook in small fresh batches using authentic Chettinad and South Indian spices, pure cold-pressed oils, and farm-fresh meat and vegetables. No artificial taste enhancers or harmful coloring.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
