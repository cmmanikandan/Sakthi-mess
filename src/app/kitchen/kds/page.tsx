'use client';

import React from 'react';
import Link from 'next/link';
import { useCanteen } from '@/context/CanteenContext';
import { formatDateTime } from '@/lib/utils';
import { ArrowLeft, Clock, Tv, AlertCircle } from 'lucide-react';

export default function KitchenKdsPage() {
  const {
    orders,
    acceptOrder,
    startPreparingOrder,
    startPackingOrder,
    markOrderReady,
  } = useCanteen();

  // Show active kitchen orders only (PLACED, ACCEPTED, PREPARING, PACKING)
  const activeOrders = orders.filter((o) =>
    ['PLACED', 'ACCEPTED', 'PREPARING', 'PACKING'].includes(o.orderStatus)
  );

  return (
    <div className="min-h-screen bg-[#111111] text-white p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Top KDS Bar */}
      <div className="flex items-center justify-between border-b border-stone-800 pb-4">
        <div className="flex items-center gap-4">
          <Link
            href="/kitchen/dashboard"
            className="p-2.5 rounded-2xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition flex items-center gap-2 text-xs font-black"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Exit KDS Mode</span>
          </Link>

          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <Tv className="w-6 h-6 text-[#E23744]" />
              SAKTHI MESS — Kitchen Display System
            </h1>
            <p className="text-xs text-stone-400">
              Large screen TV / Tablet layout for high-volume mess operations
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-stone-900 border border-stone-800 rounded-2xl text-right">
            <p className="text-[10px] font-bold text-stone-400 uppercase">Live Queue</p>
            <p className="text-xl font-black text-[#E23744]">{activeOrders.length} Pending</p>
          </div>
        </div>
      </div>

      {/* Grid of Large Order Cards */}
      {activeOrders.length === 0 ? (
        <div className="text-center py-28 text-stone-500 space-y-3">
          <p className="text-5xl">🍳</p>
          <h2 className="text-2xl font-black text-white">All orders cleared!</h2>
          <p className="text-sm">Kitchen display is ready for new incoming orders.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {activeOrders.map((ord) => {
            const timeInfo = formatDateTime(ord.createdAt);

            return (
              <div
                key={ord.id}
                className="bg-stone-900 rounded-3xl p-6 border-2 border-stone-800 flex flex-col justify-between space-y-5 shadow-2xl hover:border-stone-700 transition"
              >
                <div className="space-y-4">
                  {/* Card Header */}
                  <div className="flex items-start justify-between border-b border-stone-800 pb-3">
                    <div>
                      <span className="text-xl font-black text-[#E23744]">
                        ORDER #{ord.orderNumber}
                      </span>
                      <p className="text-xs text-stone-400 mt-0.5">
                        Customer: <strong className="text-white">{ord.customerName}</strong>
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-stone-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-stone-400" />
                        <span>{timeInfo.time}</span>
                      </span>
                    </div>
                  </div>

                  {/* Items List (Large Typography) */}
                  <div className="space-y-2.5">
                    {ord.items.map((it, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-baseline text-base sm:text-lg font-black text-white p-2.5 rounded-2xl bg-stone-800/80 border border-stone-700/60"
                      >
                        <span className="truncate mr-2">{it.name}</span>
                        <span className="text-[#E23744] text-xl font-black shrink-0">
                          × {it.quantity}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Special Instructions Note */}
                  {ord.specialInstructions && (
                    <div className="p-3 bg-amber-950/60 border border-amber-500/40 rounded-2xl text-amber-200 text-xs font-bold space-y-0.5">
                      <span className="text-[10px] uppercase font-black tracking-wider text-amber-400 block">
                        NOTE:
                      </span>
                      <p className="text-sm">{ord.specialInstructions}</p>
                    </div>
                  )}
                </div>

                {/* Large Action CTA */}
                <div className="pt-2">
                  {ord.orderStatus === 'PLACED' && (
                    <button
                      onClick={() => acceptOrder(ord.id)}
                      className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-base shadow-lg transition active:scale-95 uppercase tracking-wide"
                    >
                      [ ACCEPT ]
                    </button>
                  )}

                  {ord.orderStatus === 'ACCEPTED' && (
                    <button
                      onClick={() => startPreparingOrder(ord.id)}
                      className="w-full py-4 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-black text-base shadow-lg transition active:scale-95 uppercase tracking-wide"
                    >
                      [ START PREPARING ]
                    </button>
                  )}

                  {ord.orderStatus === 'PREPARING' && (
                    <button
                      onClick={() => startPackingOrder(ord.id)}
                      className="w-full py-4 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-black text-base shadow-lg transition active:scale-95 uppercase tracking-wide"
                    >
                      [ START PACKING ]
                    </button>
                  )}

                  {ord.orderStatus === 'PACKING' && (
                    <button
                      onClick={() => markOrderReady(ord.id)}
                      className="w-full py-4 rounded-2xl bg-[#2E9B5B] hover:bg-emerald-600 text-white font-black text-base shadow-lg transition active:scale-95 uppercase tracking-wide"
                    >
                      [ MARK READY ]
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
