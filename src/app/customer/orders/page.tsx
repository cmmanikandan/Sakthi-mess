'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCanteen } from '@/context/CanteenContext';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { Order } from '@/types';
import {
  ShoppingBag,
  ArrowRight,
  CheckCircle2,
  Clock,
  MapPin,
  RefreshCw,
  Bike,
} from 'lucide-react';
import { formatDateTime } from '@/lib/utils';

export default function CustomerOrdersPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { orders } = useCanteen();
  const { addToCart } = useCart();
  const [tab, setTab] = useState<'all' | 'active' | 'completed' | 'cancelled'>('all');

  // Filter orders for the user
  const myOrders = orders.filter((o) => {
    if (!user) return true;
    return (
      o.userId === user.id ||
      o.customerEmail === user.email ||
      o.userEmail === user.email ||
      o.userId === 'cust-online'
    );
  });

  const activeOrders = myOrders.filter((o) =>
    ['PLACED', 'ACCEPTED', 'PREPARING', 'PACKING', 'READY', 'OUT_FOR_DELIVERY'].includes(
      o.orderStatus
    )
  );

  const completedOrders = myOrders.filter((o) =>
    ['DELIVERED', 'SERVED'].includes(o.orderStatus)
  );

  const cancelledOrders = myOrders.filter((o) =>
    ['CANCELLED', 'REJECTED'].includes(o.orderStatus)
  );

  const displayOrders =
    tab === 'active'
      ? activeOrders
      : tab === 'completed'
      ? completedOrders
      : tab === 'cancelled'
      ? cancelledOrders
      : myOrders;

  const handleReorder = (order: Order) => {
    order.items.forEach((it) => {
      addToCart(
        {
          id: it.foodId,
          name: it.name,
          price: it.price,
          category: 'all',
          availableMeals: ['all'],
          imageUrl: it.imageUrl || '/land-image-1.png',
          isAvailable: true,
          isVisible: true,
          isVeg: true,
          rating: 4.8,
          ratingCount: 100,
          description: '',
        },
        it.quantity,
        it.notes
      );
    });
    router.push('/customer/cart');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'DELIVERED':
      case 'SERVED':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'OUT_FOR_DELIVERY':
        return 'bg-blue-100 text-blue-800 border-blue-200 animate-pulse';
      case 'READY':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'PREPARING':
      case 'PACKING':
      case 'ACCEPTED':
        return 'bg-rose-50 text-[#E23744] border-rose-200';
      case 'CANCELLED':
      case 'REJECTED':
        return 'bg-stone-100 text-stone-600 border-stone-200';
      default:
        return 'bg-stone-100 text-stone-700 border-stone-200';
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#1C1C1C] tracking-tight">
          My Orders
        </h1>
        <p className="text-xs sm:text-sm text-[#696969] mt-0.5">
          Track active orders and view past delivery history
        </p>
      </div>

      {/* Tabs */}
      <div className="flex bg-[#F8F8F8] p-1 rounded-2xl border border-[#E8E8E8] max-w-md overflow-x-auto no-scrollbar">
        {[
          { id: 'all', label: `All (${myOrders.length})` },
          { id: 'active', label: `Active (${activeOrders.length})` },
          { id: 'completed', label: `Delivered (${completedOrders.length})` },
          { id: 'cancelled', label: `Cancelled (${cancelledOrders.length})` },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as any)}
            className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl transition whitespace-nowrap ${
              tab === t.id
                ? 'bg-[#E23744] text-white shadow-xs'
                : 'text-[#696969] hover:text-[#1C1C1C]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {displayOrders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-[#E8E8E8] p-8 space-y-3">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-[#E23744] flex items-center justify-center mx-auto text-2xl">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-base font-black text-[#1C1C1C]">No orders yet</h2>
          <p className="text-xs text-[#696969] max-w-sm mx-auto">
            Your next delicious meal from SAKTHI MESS is waiting.
          </p>
          <div className="pt-2">
            <Link
              href="/customer/menu"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#E23744] hover:bg-[#B91C2B] text-white text-xs font-black rounded-xl shadow-xs transition"
            >
              <span>Order Food</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {displayOrders.map((ord) => {
            const timeInfo = formatDateTime(ord.createdAt);
            const isActive = [
              'PLACED',
              'ACCEPTED',
              'PREPARING',
              'PACKING',
              'READY',
              'OUT_FOR_DELIVERY',
            ].includes(ord.orderStatus);

            return (
              <div
                key={ord.id}
                className="bg-white rounded-3xl p-5 border border-[#E8E8E8] shadow-card hover:border-stone-300 transition space-y-3.5"
              >
                {/* Header Row */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-sm text-[#1C1C1C]">
                        Order #{ord.orderNumber}
                      </span>
                      <span
                        className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border ${getStatusBadge(
                          ord.orderStatus
                        )}`}
                      >
                        {ord.orderStatus.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-[#696969] mt-0.5 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-stone-400" />
                      <span>{timeInfo.date} at {timeInfo.time}</span>
                    </p>
                  </div>

                  <span className="font-black text-base text-[#1C1C1C]">
                    ₹{ord.total}
                  </span>
                </div>

                {/* Items Summary */}
                <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200/60 text-xs space-y-1">
                  {ord.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between text-[#1C1C1C]">
                      <span>
                        {it.name} <strong className="text-[#E23744]">× {it.quantity}</strong>
                      </span>
                      <span className="text-[#696969]">₹{it.price * it.quantity}</span>
                    </div>
                  ))}
                  {ord.specialInstructions && (
                    <p className="text-[11px] text-amber-800 pt-1 border-t border-stone-200/50">
                      Note: {ord.specialInstructions}
                    </p>
                  )}
                </div>

                {/* Delivery Address Summary */}
                <div className="text-[11px] text-[#696969] flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#E23744] shrink-0" />
                  <span className="truncate">
                    Delivered to {ord.deliveryAddress?.label}: {ord.deliveryAddress?.addressLine1}, {ord.deliveryAddress?.city}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-1 border-t border-stone-100">
                  <Link
                    href={`/customer/orders/${ord.id}`}
                    className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-black text-center transition flex items-center justify-center gap-1.5 ${
                      isActive
                        ? 'bg-[#E23744] hover:bg-[#B91C2B] text-white shadow-xs'
                        : 'bg-stone-100 hover:bg-stone-200 text-[#1C1C1C]'
                    }`}
                  >
                    <span>{isActive ? 'Track Live Progress →' : 'View Order Details'}</span>
                  </Link>

                  <button
                    onClick={() => handleReorder(ord)}
                    className="py-2.5 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-[#1C1C1C] text-xs font-bold transition flex items-center gap-1.5"
                    title="Add all items to cart again"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Reorder</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
