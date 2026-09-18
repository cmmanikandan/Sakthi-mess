'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCanteen } from '@/context/CanteenContext';
import {
  Search,
  ShoppingBag,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  Receipt,
  ExternalLink,
} from 'lucide-react';
import { formatDateTime } from '@/lib/utils';
import { OrderStatus } from '@/types';

export default function AdminOrdersPage() {
  const { orders, updateOrderStatus } = useCanteen();
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [search, setSearch] = useState('');

  const filtered = orders.filter((o) => {
    if (filterStatus !== 'ALL' && o.orderStatus !== filterStatus) return false;
    if (
      search &&
      !o.orderNumber.toLowerCase().includes(search.toLowerCase()) &&
      !o.customerName.toLowerCase().includes(search.toLowerCase()) &&
      !(o.customerPhone || '').includes(search)
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1C1C1C] tracking-tight">
            Orders Management
          </h1>
          <p className="text-xs sm:text-sm text-[#696969] mt-0.5">
            Monitor and manage live doorstep delivery orders across all lifecycle stages
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/pos"
            className="px-4 py-2 rounded-2xl bg-[#E23744] hover:bg-[#B91C2B] text-white text-xs font-black shadow-xs transition"
          >
            + Quick POS Order
          </Link>
          <span className="bg-white border border-[#E8E8E8] px-3.5 py-2 rounded-2xl text-xs font-black text-[#1C1C1C]">
            {orders.length} Total
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-[#E8E8E8] shadow-card flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Order #, customer name, or phone..."
            className="w-full pl-10 pr-4 py-2 text-xs border border-stone-200 rounded-xl bg-stone-50 text-[#1C1C1C]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {[
            'ALL',
            'PLACED',
            'ACCEPTED',
            'PREPARING',
            'PACKING',
            'READY',
            'OUT_FOR_DELIVERY',
            'DELIVERED',
            'CANCELLED',
          ].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition ${
                filterStatus === st
                  ? 'bg-[#E23744] text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {st.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Grid/List */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-[#E8E8E8] p-8 space-y-2">
          <p className="text-base font-black text-[#1C1C1C]">No matching orders</p>
          <p className="text-xs text-[#696969]">Try clearing filters or search keywords.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((ord) => {
            const timeInfo = formatDateTime(ord.createdAt);

            return (
              <div
                key={ord.id}
                className="bg-white rounded-3xl p-5 border border-[#E8E8E8] shadow-card space-y-3.5"
              >
                {/* Top Line */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-base text-[#1C1C1C]">
                        Order #{ord.orderNumber}
                      </span>
                      <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-rose-50 text-[#E23744] border border-rose-200">
                        {ord.orderStatus.replace(/_/g, ' ')}
                      </span>
                      <span className="text-[10px] font-bold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md">
                        {ord.paymentMethod === 'ONLINE_RAZORPAY' ? 'Online Paid' : 'Cash On Delivery'}
                      </span>
                    </div>
                    <p className="text-xs text-[#696969] mt-0.5">
                      Placed at {timeInfo.date} · {timeInfo.time}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-base font-black text-[#1C1C1C]">
                      ₹{ord.total}
                    </span>
                    <Link
                      href={`/customer/orders/${ord.id}`}
                      className="text-xs font-bold text-[#E23744] hover:underline flex items-center gap-1"
                    >
                      <span>Track</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Body details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  {/* Customer and Delivery Address */}
                  <div className="p-3 bg-[#F8F8F8] rounded-2xl border border-[#E8E8E8] space-y-1">
                    <p className="text-[10px] uppercase font-black text-[#696969]">Deliver To:</p>
                    <p className="font-extrabold text-[#1C1C1C]">
                      {ord.customerName} ({ord.customerPhone})
                    </p>
                    <p className="text-[#696969]">
                      {ord.deliveryAddress?.label}: {ord.deliveryAddress?.addressLine1}
                      {ord.deliveryAddress?.addressLine2 ? `, ${ord.deliveryAddress.addressLine2}` : ''}
                    </p>
                    <p className="text-[#696969]">
                      {ord.deliveryAddress?.city} - {ord.deliveryAddress?.pincode}
                    </p>
                    {ord.specialInstructions && (
                      <p className="text-amber-800 font-medium pt-1">
                        Note: {ord.specialInstructions}
                      </p>
                    )}
                  </div>

                  {/* Food items */}
                  <div className="p-3 bg-[#F8F8F8] rounded-2xl border border-[#E8E8E8] space-y-1">
                    <p className="text-[10px] uppercase font-black text-[#696969]">Items:</p>
                    {ord.items.map((it, idx) => (
                      <div key={idx} className="flex justify-between text-[#1C1C1C]">
                        <span>{it.name} <strong className="text-[#E23744]">× {it.quantity}</strong></span>
                        <span className="font-bold">₹{it.price * it.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Status Override Dropdown for Admin */}
                <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
                  <span className="text-[#696969]">Update Order Status:</span>
                  <select
                    value={ord.orderStatus}
                    onChange={(e) => updateOrderStatus(ord.id, e.target.value as OrderStatus)}
                    className="px-3 py-1.5 rounded-xl border border-stone-200 bg-white font-bold text-xs focus:border-[#E23744] focus:outline-none"
                  >
                    <option value="PLACED">Placed</option>
                    <option value="ACCEPTED">Accepted</option>
                    <option value="PREPARING">Preparing</option>
                    <option value="PACKING">Packing</option>
                    <option value="READY">Ready</option>
                    <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
