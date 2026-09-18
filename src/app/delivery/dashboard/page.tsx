'use client';

import React, { useState } from 'react';
import { useCanteen } from '@/context/CanteenContext';
import {
  Bike,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  ExternalLink,
  Package,
  ShoppingBag,
} from 'lucide-react';
import { formatDateTime } from '@/lib/utils';

export default function DeliveryDashboardPage() {
  const {
    orders,
    startDelivery,
    markOrderDelivered,
  } = useCanteen();

  const [activeTab, setActiveTab] = useState<'READY' | 'OUT_FOR_DELIVERY' | 'DELIVERED'>('READY');

  // Categories
  const readyOrders = orders.filter((o) => o.orderStatus === 'READY');
  const outForDeliveryOrders = orders.filter((o) => o.orderStatus === 'OUT_FOR_DELIVERY');
  const deliveredOrders = orders.filter((o) => o.orderStatus === 'DELIVERED' || o.orderStatus === 'SERVED');

  const displayedOrders =
    activeTab === 'READY'
      ? readyOrders
      : activeTab === 'OUT_FOR_DELIVERY'
      ? outForDeliveryOrders
      : deliveredOrders;

  const openGoogleMaps = (addr: any) => {
    const query = encodeURIComponent(
      `${addr.addressLine1}, ${addr.city}, ${addr.pincode}`
    );
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#1C1C1C] text-white p-6 rounded-3xl shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2E9B5B] animate-pulse" />
            <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Rider Dispatch Live
            </p>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black mt-1 tracking-tight">
            Delivery Staff Console 🛵
          </h1>
          <p className="text-xs text-stone-300 mt-0.5">
            Pickup ready meals from SAKTHI MESS kitchen and deliver to customer doorsteps
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 rounded-2xl bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-black">
            {outForDeliveryOrders.length} In Transit
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-white p-1 rounded-2xl border border-[#E8E8E8] shadow-2xs">
        <button
          onClick={() => setActiveTab('READY')}
          className={`flex-1 py-2.5 text-xs font-black rounded-xl transition flex items-center justify-center gap-1.5 ${
            activeTab === 'READY'
              ? 'bg-[#E23744] text-white shadow-xs'
              : 'text-[#696969] hover:text-[#1C1C1C]'
          }`}
        >
          <span>Ready for Pickup</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20">
            {readyOrders.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('OUT_FOR_DELIVERY')}
          className={`flex-1 py-2.5 text-xs font-black rounded-xl transition flex items-center justify-center gap-1.5 ${
            activeTab === 'OUT_FOR_DELIVERY'
              ? 'bg-[#E23744] text-white shadow-xs'
              : 'text-[#696969] hover:text-[#1C1C1C]'
          }`}
        >
          <span>Out for Delivery</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20">
            {outForDeliveryOrders.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('DELIVERED')}
          className={`flex-1 py-2.5 text-xs font-black rounded-xl transition flex items-center justify-center gap-1.5 ${
            activeTab === 'DELIVERED'
              ? 'bg-[#E23744] text-white shadow-xs'
              : 'text-[#696969] hover:text-[#1C1C1C]'
          }`}
        >
          <span>Delivered</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20">
            {deliveredOrders.length}
          </span>
        </button>
      </div>

      {/* Orders List */}
      {displayedOrders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-[#E8E8E8] p-8 space-y-3">
          <Bike className="w-12 h-12 text-stone-300 mx-auto" />
          <h2 className="text-base font-black text-[#1C1C1C]">No deliveries in this section</h2>
          <p className="text-xs text-[#696969]">
            {activeTab === 'READY'
              ? 'When kitchen marks an order READY, it will appear here for pickup.'
              : 'No orders currently in transit.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayedOrders.map((order) => {
            const timeInfo = formatDateTime(order.createdAt);

            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E8E8E8] shadow-card space-y-4"
              >
                {/* Header */}
                <div className="flex items-start justify-between border-b border-stone-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-black text-[#1C1C1C]">
                        Order #{order.orderNumber}
                      </span>
                      <span
                        className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                          order.orderStatus === 'READY'
                            ? 'bg-amber-100 text-amber-800'
                            : order.orderStatus === 'OUT_FOR_DELIVERY'
                            ? 'bg-blue-100 text-blue-800 animate-pulse'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {order.orderStatus.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-[#696969] mt-0.5 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-stone-400" />
                      <span>{timeInfo.time}</span>
                    </p>
                  </div>

                  <span className="text-base font-black text-[#1C1C1C]">
                    ₹{order.total}
                  </span>
                </div>

                {/* Customer Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-[#F8F8F8] rounded-2xl border border-[#E8E8E8] space-y-1">
                    <p className="text-[10px] uppercase font-black text-[#696969] tracking-wider">
                      Customer:
                    </p>
                    <p className="text-sm font-black text-[#1C1C1C]">
                      {order.customerName || order.userName || 'Customer'}
                    </p>
                    <p className="text-[#696969] font-bold flex items-center gap-1 pt-1">
                      <Phone className="w-3 h-3 text-[#E23744]" />
                      <span>{order.deliveryAddress?.phone || order.customerPhone || '+91 98765 43210'}</span>
                    </p>
                  </div>

                  <div className="p-3 bg-[#F8F8F8] rounded-2xl border border-[#E8E8E8] space-y-1">
                    <p className="text-[10px] uppercase font-black text-[#696969] tracking-wider">
                      Delivery Address:
                    </p>
                    <p className="font-extrabold text-[#1C1C1C] flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#E23744] shrink-0" />
                      <span>{order.deliveryAddress?.label} · {order.deliveryAddress?.addressLine1}</span>
                    </p>
                    {order.deliveryAddress?.landmark && (
                      <p className="text-[#696969]">Landmark: {order.deliveryAddress.landmark}</p>
                    )}
                    <p className="text-[#696969]">
                      {order.deliveryAddress?.city} - {order.deliveryAddress?.pincode}
                    </p>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-3 bg-stone-50 rounded-2xl text-xs space-y-1">
                  <p className="text-[10px] font-black uppercase text-[#696969]">Dishes to Deliver:</p>
                  {order.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between text-[#1C1C1C]">
                      <span className="font-bold">{it.name}</span>
                      <span className="font-black text-[#E23744]">× {it.quantity}</span>
                    </div>
                  ))}
                </div>

                {/* Actions Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-stone-100">
                  {/* View Address on Map */}
                  <button
                    onClick={() => openGoogleMaps(order.deliveryAddress)}
                    className="py-2.5 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-[#1C1C1C] text-xs font-bold transition flex items-center justify-center gap-1"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>View Address</span>
                  </button>

                  {/* Call Customer */}
                  <a
                    href={`tel:${order.deliveryAddress?.phone || order.customerPhone || ''}`}
                    className="py-2.5 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-[#1C1C1C] text-xs font-bold transition flex items-center justify-center gap-1"
                  >
                    <Phone className="w-3.5 h-3.5 text-blue-600" />
                    <span>Call Customer</span>
                  </a>

                  {/* Delivery Flow Action Button */}
                  {order.orderStatus === 'READY' && (
                    <button
                      onClick={() => startDelivery(order.id)}
                      className="col-span-2 py-2.5 px-4 rounded-xl bg-[#E23744] hover:bg-[#B91C2B] text-white text-xs font-black transition shadow-xs flex items-center justify-center gap-1"
                    >
                      <Bike className="w-4 h-4" />
                      <span>START DELIVERY</span>
                    </button>
                  )}

                  {order.orderStatus === 'OUT_FOR_DELIVERY' && (
                    <button
                      onClick={() => markOrderDelivered(order.id)}
                      className="col-span-2 py-2.5 px-4 rounded-xl bg-[#2E9B5B] hover:bg-emerald-700 text-white text-xs font-black transition shadow-xs flex items-center justify-center gap-1"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>MARK DELIVERED ✓</span>
                    </button>
                  )}

                  {order.orderStatus === 'DELIVERED' && (
                    <div className="col-span-2 py-2.5 px-4 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-black text-center">
                      ✓ Delivered to Customer
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
