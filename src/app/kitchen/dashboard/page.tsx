'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCanteen } from '@/context/CanteenContext';
import {
  ChefHat,
  Package,
  CheckCircle2,
  Clock,
  Sparkles,
  Flame,
  AlertCircle,
  Tv,
  ArrowRight,
} from 'lucide-react';
import { OrderStatus } from '@/types';
import { formatDateTime } from '@/lib/utils';

export default function KitchenDashboardPage() {
  const {
    orders,
    acceptOrder,
    startPreparingOrder,
    startPackingOrder,
    markOrderReady,
  } = useCanteen();

  const [filterTab, setFilterTab] = useState<
    'ALL' | 'NEW' | 'ACCEPTED' | 'PREPARING' | 'PACKING' | 'READY' | 'COMPLETED'
  >('ALL');

  // Statistics counters
  const newOrders = orders.filter((o) => o.orderStatus === 'PLACED');
  const acceptedOrders = orders.filter((o) => o.orderStatus === 'ACCEPTED');
  const preparingOrders = orders.filter((o) => o.orderStatus === 'PREPARING');
  const packingOrders = orders.filter((o) => o.orderStatus === 'PACKING');
  const readyOrders = orders.filter((o) => o.orderStatus === 'READY');
  const completedOrders = orders.filter(
    (o) => o.orderStatus === 'OUT_FOR_DELIVERY' || o.orderStatus === 'DELIVERED'
  );

  const filteredOrders = orders.filter((o) => {
    if (filterTab === 'NEW') return o.orderStatus === 'PLACED';
    if (filterTab === 'ACCEPTED') return o.orderStatus === 'ACCEPTED';
    if (filterTab === 'PREPARING') return o.orderStatus === 'PREPARING';
    if (filterTab === 'PACKING') return o.orderStatus === 'PACKING';
    if (filterTab === 'READY') return o.orderStatus === 'READY';
    if (filterTab === 'COMPLETED')
      return o.orderStatus === 'OUT_FOR_DELIVERY' || o.orderStatus === 'DELIVERED';
    return true; // ALL
  });

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-[#1C1C1C] text-white p-6 rounded-3xl relative overflow-hidden shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2E9B5B] animate-pulse" />
              <p className="text-xs font-bold text-rose-300 uppercase tracking-wider">
                Kitchen Operations Live
              </p>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black mt-1 tracking-tight">
              Kitchen Staff Console 👨‍🍳
            </h1>
            <p className="text-xs text-stone-300 mt-1">
              Real-time kitchen order preparation and packing pipeline for SAKTHI MESS
            </p>
          </div>

          <Link
            href="/kitchen/kds"
            className="self-start sm:self-auto px-4 py-2.5 bg-[#E23744] hover:bg-[#B91C2B] text-white font-black text-xs rounded-2xl flex items-center gap-2 shadow-xs transition active:scale-95"
          >
            <Tv className="w-4 h-4" />
            <span>Launch Kitchen TV Mode</span>
          </Link>
        </div>
      </div>

      {/* Main Statistics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: 'NEW ORDERS', count: newOrders.length, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
          { label: 'PREPARING', count: preparingOrders.length + acceptedOrders.length, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
          { label: 'PACKING', count: packingOrders.length, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' },
          { label: 'READY', count: readyOrders.length, color: 'text-[#2E9B5B]', bg: 'bg-emerald-50', border: 'border-emerald-200' },
          { label: 'TODAY TOTAL', count: orders.length, color: 'text-[#1C1C1C]', bg: 'bg-white', border: 'border-[#E8E8E8]' },
        ].map((stat, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-3xl border ${stat.bg} ${stat.border} shadow-2xs space-y-1`}
          >
            <p className="text-[10px] font-black uppercase tracking-wider text-[#696969]">
              {stat.label}
            </p>
            <p className={`text-2xl sm:text-3xl font-black ${stat.color}`}>
              {stat.count}
            </p>
          </div>
        ))}
      </div>

      {/* Order Board Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {[
          { id: 'ALL', label: `All (${orders.length})` },
          { id: 'NEW', label: `New (${newOrders.length})` },
          { id: 'ACCEPTED', label: `Accepted (${acceptedOrders.length})` },
          { id: 'PREPARING', label: `Preparing (${preparingOrders.length})` },
          { id: 'PACKING', label: `Packing (${packingOrders.length})` },
          { id: 'READY', label: `Ready (${readyOrders.length})` },
          { id: 'COMPLETED', label: `Completed (${completedOrders.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterTab(tab.id as any)}
            className={`px-4 py-2 rounded-2xl text-xs font-black whitespace-nowrap transition ${
              filterTab === tab.id
                ? 'bg-[#E23744] text-white shadow-xs'
                : 'bg-white text-[#696969] border border-[#E8E8E8] hover:bg-stone-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Order Cards Grid */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-[#E8E8E8] p-8 space-y-3">
          <ChefHat className="w-12 h-12 text-stone-300 mx-auto" />
          <h2 className="text-base font-black text-[#1C1C1C]">No orders in this stage</h2>
          <p className="text-xs text-[#696969]">Orders will automatically appear here when placed by customers.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredOrders.map((order) => {
            const timeInfo = formatDateTime(order.createdAt);

            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl p-5 border border-[#E8E8E8] shadow-card flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  {/* Top line: Order # and Status */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-black text-base text-[#1C1C1C]">
                        Order #{order.orderNumber}
                      </span>
                      <p className="text-[11px] text-[#696969] flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3 text-stone-400" />
                        <span>{timeInfo.time}</span>
                      </p>
                    </div>

                    <span
                      className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full ${
                        order.orderStatus === 'PLACED'
                          ? 'bg-blue-100 text-blue-800'
                          : order.orderStatus === 'ACCEPTED'
                          ? 'bg-amber-100 text-amber-800'
                          : order.orderStatus === 'PREPARING'
                          ? 'bg-rose-100 text-rose-800 animate-pulse'
                          : order.orderStatus === 'PACKING'
                          ? 'bg-purple-100 text-purple-800'
                          : order.orderStatus === 'READY'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-stone-100 text-stone-600'
                      }`}
                    >
                      {order.orderStatus.replace(/_/g, ' ')}
                    </span>
                  </div>

                  {/* Customer name */}
                  <div className="text-xs">
                    <span className="text-[#696969]">Customer: </span>
                    <strong className="text-[#1C1C1C] font-black">
                      {order.customerName || order.userName || 'Guest Customer'}
                    </strong>
                  </div>

                  {/* Items list with quantities */}
                  <div className="p-3 bg-[#F8F8F8] rounded-2xl border border-[#E8E8E8] text-xs space-y-1.5">
                    <p className="text-[10px] font-black uppercase text-[#696969] tracking-wider">
                      Food Items:
                    </p>
                    {order.items.map((it, idx) => (
                      <div key={idx} className="flex justify-between items-center text-[#1C1C1C]">
                        <span className="font-extrabold">{it.name}</span>
                        <span className="font-black text-sm bg-white px-2 py-0.5 rounded-lg border border-stone-200 text-[#E23744]">
                          × {it.quantity}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Special Instructions */}
                  {order.specialInstructions && (
                    <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 font-bold flex items-start gap-2">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] uppercase font-black block">Special Note:</span>
                        <span>{order.specialInstructions}</span>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-xs pt-1 border-t border-stone-100">
                    <span className="text-[#696969]">Total Amount:</span>
                    <span className="text-sm font-black text-[#1C1C1C]">₹{order.total}</span>
                  </div>
                </div>

                {/* Status Action Buttons */}
                <div className="pt-2">
                  {order.orderStatus === 'PLACED' && (
                    <button
                      onClick={() => acceptOrder(order.id)}
                      className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-xs transition active:scale-95"
                    >
                      ACCEPT ORDER
                    </button>
                  )}

                  {order.orderStatus === 'ACCEPTED' && (
                    <button
                      onClick={() => startPreparingOrder(order.id)}
                      className="w-full py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs shadow-xs transition active:scale-95"
                    >
                      START PREPARING 🍳
                    </button>
                  )}

                  {order.orderStatus === 'PREPARING' && (
                    <button
                      onClick={() => startPackingOrder(order.id)}
                      className="w-full py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs shadow-xs transition active:scale-95"
                    >
                      START PACKING 📦
                    </button>
                  )}

                  {order.orderStatus === 'PACKING' && (
                    <button
                      onClick={() => markOrderReady(order.id)}
                      className="w-full py-3 rounded-2xl bg-[#2E9B5B] hover:bg-emerald-700 text-white font-black text-xs shadow-xs transition active:scale-95"
                    >
                      MARK READY FOR PICKUP ✓
                    </button>
                  )}

                  {order.orderStatus === 'READY' && (
                    <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-center text-xs font-bold text-emerald-800">
                      ✓ Ready · Awaiting Delivery Partner
                    </div>
                  )}

                  {(order.orderStatus === 'OUT_FOR_DELIVERY' ||
                    order.orderStatus === 'DELIVERED') && (
                    <div className="p-2.5 rounded-xl bg-stone-100 border border-stone-200 text-center text-xs font-bold text-stone-600">
                      {order.orderStatus === 'OUT_FOR_DELIVERY'
                        ? '🛵 Out for Delivery'
                        : '✓ Delivered'}
                    </div>
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
