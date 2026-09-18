'use client';

import React from 'react';
import Link from 'next/link';
import { useCanteen } from '@/context/CanteenContext';
import {
  ShoppingBag,
  TrendingUp,
  Clock,
  CheckCircle2,
  Bike,
  ChefHat,
  Package,
  AlertCircle,
  ArrowRight,
  Receipt,
  Utensils,
  Users,
} from 'lucide-react';
import { formatDateTime } from '@/lib/utils';

export default function AdminDashboardPage() {
  const { orders, foods, activeMealInfo } = useCanteen();

  // Financial and Operational Metrics
  const totalRevenue = orders.reduce(
    (sum, o) => (o.paymentStatus === 'PAID' || o.paymentStatus === 'VERIFIED' ? sum + o.total : sum),
    0
  );

  const pendingOrders = orders.filter((o) => o.orderStatus === 'PLACED');
  const preparingOrders = orders.filter((o) => o.orderStatus === 'PREPARING' || o.orderStatus === 'ACCEPTED');
  const packingOrders = orders.filter((o) => o.orderStatus === 'PACKING');
  const readyOrders = orders.filter((o) => o.orderStatus === 'READY');
  const outForDeliveryOrders = orders.filter((o) => o.orderStatus === 'OUT_FOR_DELIVERY');
  const deliveredOrders = orders.filter((o) => o.orderStatus === 'DELIVERED' || o.orderStatus === 'SERVED');
  const cancelledOrders = orders.filter((o) => o.orderStatus === 'CANCELLED' || o.orderStatus === 'REJECTED');

  const deliveryRate =
    orders.length > 0 ? Math.round((deliveredOrders.length / orders.length) * 100) : 100;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-[#1C1C1C] text-white p-6 rounded-3xl relative overflow-hidden shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <p className="text-xs font-bold text-[#E23744] uppercase tracking-wider">
              SAKTHI MESS · Admin Operations Console
            </p>
            <h1 className="text-2xl sm:text-3xl font-black mt-1 tracking-tight">
              Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'} 👋
            </h1>
            <p className="text-xs text-stone-300 mt-1">
              {new Date().toLocaleDateString('en-IN', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <Link
              href="/admin/pos"
              className="px-4 py-2.5 bg-[#E23744] hover:bg-[#B91C2B] text-white text-xs font-black rounded-2xl flex items-center gap-2 shadow-xs transition active:scale-95"
            >
              <Receipt className="w-4 h-4" />
              <span>Quick POS Counter</span>
            </Link>

            <div className="bg-white/10 px-3.5 py-2 rounded-2xl border border-white/15 text-xs">
              <span className="text-[10px] text-stone-400 block uppercase font-bold">Active Meal</span>
              <span className="font-black text-white">{activeMealInfo.name}</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {[
          {
            label: "Today's Revenue",
            value: `₹${totalRevenue.toLocaleString('en-IN')}`,
            sub: 'Online & Cash Received',
            color: 'text-[#E23744]',
            bg: 'bg-rose-50',
          },
          {
            label: "Total Orders",
            value: orders.length,
            sub: 'All lifetime orders',
            color: 'text-[#1C1C1C]',
            bg: 'bg-stone-50',
          },
          {
            label: 'Delivered',
            value: deliveredOrders.length,
            sub: 'Completed doorstep deliveries',
            color: 'text-[#2E9B5B]',
            bg: 'bg-emerald-50',
          },
          {
            label: 'In Kitchen / Transit',
            value: pendingOrders.length + preparingOrders.length + packingOrders.length + outForDeliveryOrders.length,
            sub: 'Active fulfillment queue',
            color: 'text-amber-600',
            bg: 'bg-amber-50',
          },
        ].map((k, idx) => (
          <div
            key={idx}
            className="bg-white rounded-3xl p-5 border border-[#E8E8E8] shadow-card space-y-1"
          >
            <p className="text-[10px] font-black text-[#696969] uppercase tracking-wider">{k.label}</p>
            <p className={`text-3xl font-black ${k.color}`}>{k.value}</p>
            <p className="text-[11px] text-stone-400">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Operational Pipeline Counters */}
      <div className="bg-white rounded-3xl p-5 border border-[#E8E8E8] shadow-card space-y-4">
        <h2 className="text-sm font-black text-[#1C1C1C] flex items-center justify-between">
          <span>Live Fulfillment Pipeline</span>
          <span className="text-xs font-bold text-[#2E9B5B]">Delivery Success: {deliveryRate}%</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-center">
          {[
            { label: 'Pending', count: pendingOrders.length, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Preparing', count: preparingOrders.length, color: 'text-amber-600', bg: 'bg-amber-50' },
            { label: 'Packing', count: packingOrders.length, color: 'text-purple-600', bg: 'bg-purple-50' },
            { label: 'Ready', count: readyOrders.length, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Out for Delivery', count: outForDeliveryOrders.length, color: 'text-rose-600', bg: 'bg-rose-50' },
            { label: 'Cancelled', count: cancelledOrders.length, color: 'text-stone-500', bg: 'bg-stone-50' },
          ].map((pipe, i) => (
            <div key={i} className={`p-3 rounded-2xl border border-stone-200/60 ${pipe.bg} space-y-0.5`}>
              <p className="text-[10px] font-black uppercase text-[#696969]">{pipe.label}</p>
              <p className={`text-2xl font-black ${pipe.color}`}>{pipe.count}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Orders Feed */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E8E8E8] shadow-card space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-black text-[#1C1C1C]">Recent Orders Feed</h2>
            <p className="text-xs text-[#696969]">Real-time incoming orders across all stages</p>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs font-black text-[#E23744] hover:underline flex items-center gap-1"
          >
            <span>View All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-10 text-stone-400 text-xs">No orders yet.</div>
        ) : (
          <div className="space-y-3">
            {orders.slice(0, 5).map((order) => {
              const timeInfo = formatDateTime(order.createdAt);
              return (
                <div
                  key={order.id}
                  className="p-4 rounded-2xl bg-[#F8F8F8] border border-[#E8E8E8] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-sm text-[#1C1C1C]">
                        Order #{order.orderNumber}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-white border border-stone-200">
                        {order.orderStatus.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <p className="text-[#696969]">
                      Customer: <strong className="text-[#1C1C1C]">{order.customerName}</strong> ·{' '}
                      {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                    </p>
                    <p className="text-[11px] text-stone-400">
                      {timeInfo.date} at {timeInfo.time} · Delivering to {order.deliveryAddress?.label}
                    </p>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2">
                    <span className="text-sm font-black text-[#1C1C1C]">₹{order.total}</span>
                    <Link
                      href={`/customer/orders/${order.id}`}
                      className="text-xs font-bold text-[#E23744] hover:underline"
                    >
                      Inspect →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
