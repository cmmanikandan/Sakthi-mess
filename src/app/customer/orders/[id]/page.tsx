'use client';

import React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useCanteen } from '@/context/CanteenContext';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  MapPin,
  Bike,
  ChefHat,
  Package,
  Phone,
  ShoppingBag,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import { OrderStatus } from '@/types';
import { formatDateTime } from '@/lib/utils';

export default function CustomerOrderTrackingPage() {
  const { id } = useParams();
  const router = useRouter();
  const { orders } = useCanteen();

  const order = orders.find((o) => o.id === id || o.orderNumber === id);

  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-rose-50 text-[#E23744] flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-black text-[#1C1C1C]">Order Not Found</h2>
        <p className="text-xs text-[#696969]">
          We could not locate an order matching ID &ldquo;{id}&rdquo;.
        </p>
        <Link
          href="/customer/orders"
          className="inline-block px-5 py-2.5 bg-[#E23744] text-white text-xs font-bold rounded-xl"
        >
          View All Orders
        </Link>
      </div>
    );
  }

  // Canonical Delivery Lifecycle Steps
  const STEPS: { status: OrderStatus; label: string; icon: any; desc: string }[] = [
    {
      status: 'PLACED',
      label: 'Order Placed',
      icon: ShoppingBag,
      desc: 'Order received and confirmed',
    },
    {
      status: 'ACCEPTED',
      label: 'Order Accepted',
      icon: CheckCircle2,
      desc: 'Kitchen has accepted your order',
    },
    {
      status: 'PREPARING',
      label: 'Preparing Food',
      icon: ChefHat,
      desc: 'Chefs are preparing your dishes fresh',
    },
    {
      status: 'PACKING',
      label: 'Packing Order',
      icon: Package,
      desc: 'Packing food hot in eco-friendly containers',
    },
    {
      status: 'READY',
      label: 'Ready for Pickup',
      icon: Sparkles,
      desc: 'Handover to delivery partner',
    },
    {
      status: 'OUT_FOR_DELIVERY',
      label: 'Out for Delivery',
      icon: Bike,
      desc: 'Rider is on the way to your doorstep',
    },
    {
      status: 'DELIVERED',
      label: 'Delivered',
      icon: CheckCircle2,
      desc: 'Delivered to your address. Enjoy your meal!',
    },
  ];

  const STATUS_ORDER: Record<OrderStatus, number> = {
    PLACED: 1,
    ACCEPTED: 2,
    PREPARING: 3,
    PACKING: 4,
    READY: 5,
    OUT_FOR_DELIVERY: 6,
    DELIVERED: 7,
    CANCELLED: -1,
    REJECTED: -1,
    CREATED: 1,
    PAYMENT_PENDING: 1,
    PAID: 1,
    SERVED: 7,
  };

  const currentStepIndex = STATUS_ORDER[order.orderStatus] || 1;
  const isCancelled = order.orderStatus === 'CANCELLED' || order.orderStatus === 'REJECTED';

  const orderTime = formatDateTime(order.createdAt);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-20 space-y-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/customer/orders')}
            className="p-2 -ml-2 rounded-full text-[#696969] hover:text-[#1C1C1C] hover:bg-stone-100 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-[#E23744]">
              LIVE ORDER TRACKING
            </span>
            <h1 className="text-2xl font-black text-[#1C1C1C] tracking-tight">
              Order #{order.orderNumber}
            </h1>
          </div>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
            order.orderStatus === 'DELIVERED'
              ? 'bg-emerald-100 text-emerald-800'
              : isCancelled
              ? 'bg-rose-100 text-rose-800'
              : 'bg-rose-50 text-[#E23744] border border-rose-200'
          }`}
        >
          {order.orderStatus.replace(/_/g, ' ')}
        </span>
      </div>

      {/* ETA Banner */}
      <div className="bg-gradient-to-r from-rose-500 to-[#B91C2B] text-white p-5 rounded-3xl shadow-md space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            <p className="text-xs font-bold uppercase tracking-wider text-rose-100">
              {order.orderStatus === 'DELIVERED' ? 'Delivered Status' : 'Estimated Delivery Time'}
            </p>
          </div>
          <span className="text-xs font-black bg-white/20 px-2.5 py-0.5 rounded-full">
            {order.paymentMethod === 'ONLINE_RAZORPAY' ? 'PAID ONLINE' : 'CASH ON DELIVERY'}
          </span>
        </div>
        <p className="text-2xl sm:text-3xl font-black tracking-tight">
          {order.orderStatus === 'DELIVERED'
            ? 'Delivered Successfully! 🎉'
            : isCancelled
            ? 'Order Cancelled'
            : `${order.estimatedDeliveryMinutes || 25}–35 minutes`}
        </p>
        <p className="text-xs text-rose-100">
          Placed at {orderTime.time} · {orderTime.date}
        </p>
      </div>

      {/* Live Timeline Lifecycle */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#E8E8E8] shadow-card space-y-5">
        <h2 className="text-sm font-black text-[#1C1C1C] border-b border-stone-100 pb-2 flex items-center justify-between">
          <span>Delivery Progress</span>
          <span className="text-xs font-bold text-[#2E9B5B] flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#2E9B5B] animate-pulse" />
            Live Sync
          </span>
        </h2>

        {isCancelled ? (
          <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200 text-rose-800 text-xs space-y-1">
            <p className="font-extrabold text-sm">This order was cancelled</p>
            <p className="text-rose-700">If you paid online, your refund will be processed back to your original source.</p>
          </div>
        ) : (
          <div className="space-y-4 relative pl-2">
            {STEPS.map((step, idx) => {
              const stepIndex = idx + 1;
              const isPast = stepIndex < currentStepIndex;
              const isCurrent = stepIndex === currentStepIndex;
              const isFuture = stepIndex > currentStepIndex;

              // Look up timestamp if recorded in order timeline
              const timelineEvent = order.timeline?.find((t) => t.status === step.status);
              const eventTime = timelineEvent
                ? formatDateTime(timelineEvent.timestamp).time
                : '';

              return (
                <div key={step.status} className="flex items-start gap-3.5 relative group">
                  {/* Vertical connecting line */}
                  {idx < STEPS.length - 1 && (
                    <div
                      className={`absolute left-4 top-8 bottom-[-16px] w-0.5 ${
                        isPast ? 'bg-[#2E9B5B]' : 'bg-stone-200'
                      }`}
                    />
                  )}

                  {/* Icon Indicator */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 transition ${
                      isPast
                        ? 'bg-[#2E9B5B] text-white shadow-xs'
                        : isCurrent
                        ? 'bg-[#E23744] text-white ring-4 ring-rose-100 animate-pulse'
                        : 'bg-stone-100 text-stone-400 border border-stone-200'
                    }`}
                  >
                    {isPast ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <step.icon className="w-4 h-4" />
                    )}
                  </div>

                  {/* Step Description */}
                  <div className="flex-1 text-xs">
                    <div className="flex items-center justify-between">
                      <p
                        className={`font-black ${
                          isCurrent
                            ? 'text-[#E23744] text-sm'
                            : isPast
                            ? 'text-[#1C1C1C]'
                            : 'text-stone-400'
                        }`}
                      >
                        {isPast ? `✓ ${step.label}` : isCurrent ? `● ${step.label} (In progress)` : `○ ${step.label}`}
                      </p>
                      {eventTime && (
                        <span className="text-[11px] font-bold text-stone-500">
                          {eventTime}
                        </span>
                      )}
                    </div>
                    <p className={`text-[11px] mt-0.5 ${isCurrent ? 'text-stone-600 font-medium' : 'text-stone-400'}`}>
                      {timelineEvent?.note || step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Delivery Address Snapshot */}
      <div className="bg-white p-5 rounded-3xl border border-[#E8E8E8] shadow-card space-y-3">
        <h2 className="text-sm font-black text-[#1C1C1C] flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[#E23744]" />
          Delivery Address
        </h2>

        <div className="p-3.5 rounded-2xl bg-[#F8F8F8] border border-[#E8E8E8] text-xs text-[#1C1C1C] space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-extrabold uppercase text-[11px] text-[#E23744]">
              {order.deliveryAddress?.label || 'Home'} Delivery
            </span>
            <span className="font-bold text-[#1C1C1C]">
              Recipient: {order.deliveryAddress?.recipientName}
            </span>
          </div>
          <p className="text-[#696969]">
            {order.deliveryAddress?.addressLine1}
            {order.deliveryAddress?.addressLine2 ? `, ${order.deliveryAddress.addressLine2}` : ''}
          </p>
          {order.deliveryAddress?.landmark && (
            <p className="text-[#696969]">
              Landmark: {order.deliveryAddress.landmark}
            </p>
          )}
          <p className="text-[#696969]">
            {order.deliveryAddress?.city}, {order.deliveryAddress?.state} - {order.deliveryAddress?.pincode}
          </p>
          <div className="flex items-center gap-2 pt-1 font-bold text-[#1C1C1C]">
            <Phone className="w-3.5 h-3.5 text-stone-500" />
            <span>{order.deliveryAddress?.phone}</span>
          </div>
        </div>

        {order.specialInstructions && (
          <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200/60 text-xs text-amber-900">
            <p className="font-extrabold">Special Instructions:</p>
            <p className="mt-0.5">{order.specialInstructions}</p>
          </div>
        )}
      </div>

      {/* Order Summary & Bill */}
      <div className="bg-white p-5 rounded-3xl border border-[#E8E8E8] shadow-card space-y-3">
        <h2 className="text-sm font-black text-[#1C1C1C] flex items-center gap-2">
          <ShoppingBag className="w-4 h-4 text-[#E23744]" />
          Order Items ({order.items.length})
        </h2>

        <div className="space-y-2 text-xs divide-y divide-stone-100">
          {order.items.map((it, idx) => (
            <div key={idx} className="pt-2 first:pt-0 flex justify-between">
              <div>
                <p className="font-extrabold text-[#1C1C1C]">{it.name}</p>
                <p className="text-stone-400">₹{it.price} × {it.quantity}</p>
              </div>
              <span className="font-black text-[#1C1C1C]">₹{it.price * it.quantity}</span>
            </div>
          ))}
        </div>

        <div className="pt-3 border-t border-stone-100 space-y-1.5 text-xs text-[#696969]">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="font-bold text-[#1C1C1C]">₹{order.subtotal}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery Fee</span>
            <span className="font-bold text-[#1C1C1C]">
              {order.deliveryFee === 0 ? 'FREE' : `₹${order.deliveryFee}`}
            </span>
          </div>
          <div className="flex justify-between pt-1 border-t border-stone-100 text-sm font-black text-[#1C1C1C]">
            <span>Total Paid</span>
            <span className="text-[#E23744]">₹{order.total}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
