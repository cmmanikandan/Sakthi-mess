'use client';

import React, { useState } from 'react';
import { useCanteen } from '@/context/CanteenContext';
import { useAuth } from '@/context/AuthContext';
import { Clock, ChevronDown, ChevronUp, Sparkles, Utensils, ChefHat, Bike, Shield } from 'lucide-react';
import Link from 'next/link';

export function TimeShiftSimulator() {
  const { simulatedTime, setSimulatedTime, currentTimeStr, activeMealInfo } = useCanteen();
  const { role, loginAs } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <aside
      aria-label="Simulator & quick switch bar"
      className="bg-[#1C1C1C] text-neutral-200 text-xs px-3 py-1.5 border-b border-neutral-800 sticky top-0 z-50 transition-all"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="flex items-center gap-1.5 font-medium text-red-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Active Service:</span>
          </span>
          <span className="bg-neutral-800 px-2 py-0.5 rounded text-white font-semibold">
            {activeMealInfo.icon} {activeMealInfo.name}
          </span>
          <span className="text-neutral-400 hidden md:inline">({activeMealInfo.statusText})</span>
          <span className="text-neutral-400">
            Time: <span className="text-white font-mono">{currentTimeStr}</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1 text-neutral-300 hover:text-white bg-neutral-800 px-2 py-0.5 rounded transition"
          >
            <Clock className="w-3 h-3 text-red-400" />
            <span className="hidden sm:inline">Role Switcher & Timing</span>
            {isOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          {/* Quick role badges */}
          <div className="hidden lg:flex items-center gap-1 bg-neutral-900 p-0.5 rounded">
            <Link
              href="/customer/home"
              onClick={() => loginAs('customer')}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition ${
                role === 'customer' ? 'bg-[#E23744] text-white' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Customer
            </Link>
            <Link
              href="/kitchen/dashboard"
              onClick={() => loginAs('kitchen_staff')}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition ${
                role === 'kitchen_staff' ? 'bg-[#E23744] text-white' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Kitchen
            </Link>
            <Link
              href="/delivery/dashboard"
              onClick={() => loginAs('delivery_staff')}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition ${
                role === 'delivery_staff' ? 'bg-[#E23744] text-white' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Delivery
            </Link>
            <Link
              href="/admin/dashboard"
              onClick={() => loginAs('admin')}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition ${
                role === 'admin' ? 'bg-[#E23744] text-white' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Admin
            </Link>
          </div>
        </div>
      </div>

      {/* Expanded Controls Drawer */}
      {isOpen && (
        <div className="max-w-7xl mx-auto pt-2 pb-1 border-t border-neutral-800 mt-1.5 flex flex-wrap items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-neutral-400 font-medium">Test Meal Timings:</span>
            <button
              type="button"
              onClick={() => setSimulatedTime('08:30')}
              className={`px-2 py-1 rounded text-[11px] transition ${
                simulatedTime === '08:30'
                  ? 'bg-[#E23744] text-white font-bold'
                  : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
              }`}
            >
              🌅 08:30 AM (Breakfast)
            </button>
            <button
              type="button"
              onClick={() => setSimulatedTime('13:15')}
              className={`px-2 py-1 rounded text-[11px] transition ${
                simulatedTime === '13:15'
                  ? 'bg-[#E23744] text-white font-bold'
                  : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
              }`}
            >
              ☀️ 01:15 PM (Lunch)
            </button>
            <button
              type="button"
              onClick={() => setSimulatedTime('17:00')}
              className={`px-2 py-1 rounded text-[11px] transition ${
                simulatedTime === '17:00'
                  ? 'bg-[#E23744] text-white font-bold'
                  : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
              }`}
            >
              🍪 05:00 PM (Snacks)
            </button>
            <button
              type="button"
              onClick={() => setSimulatedTime('20:00')}
              className={`px-2 py-1 rounded text-[11px] transition ${
                simulatedTime === '20:00'
                  ? 'bg-[#E23744] text-white font-bold'
                  : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
              }`}
            >
              🌙 08:00 PM (Dinner)
            </button>
            <button
              type="button"
              onClick={() => setSimulatedTime(null)}
              className={`px-2 py-1 rounded text-[11px] transition ${
                simulatedTime === null
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
              }`}
            >
              ⏰ Live Clock
            </button>
          </div>

          <div className="flex items-center gap-2 flex-wrap text-neutral-400">
            <span>Quick Links:</span>
            <Link href="/" className="text-red-400 hover:underline">
              Home
            </Link>
            <span>·</span>
            <Link href="/customer/menu" className="text-red-400 hover:underline">
              Menu
            </Link>
            <span>·</span>
            <Link href="/kitchen/dashboard" className="text-red-400 hover:underline">
              Kitchen
            </Link>
            <span>·</span>
            <Link href="/delivery/dashboard" className="text-red-400 hover:underline">
              Delivery
            </Link>
            <span>·</span>
            <Link href="/admin/dashboard" className="text-red-400 hover:underline">
              Admin
            </Link>
          </div>
        </div>
      )}
    </aside>
  );
}
