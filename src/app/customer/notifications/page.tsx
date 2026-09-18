'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCanteen } from '@/context/CanteenContext';
import { Bell, ArrowLeft, X, ChevronRight } from 'lucide-react';

export default function CustomerNotificationsPage() {
  const router = useRouter();
  const {
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
  } = useCanteen();

  const unreadCount = notifications.filter((n) => !n.read).length;

  React.useEffect(() => {
    const timer = setTimeout(() => {
      markAllNotificationsAsRead();
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const handleOpenDetail = (n: any) => {
    markNotificationAsRead(n.id);
    if (n.orderId) {
      router.push(`/customer/orders/${n.orderId}`);
    } else {
      router.push('/customer/menu');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-4 pb-20 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/customer/home"
            className="p-2 -ml-2 rounded-full text-[#696969] hover:text-[#1C1C1C] transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-[#1C1C1C] tracking-tight">
              Notifications
            </h1>
            <p className="text-xs text-[#696969]">
              Real-time updates on your SAKTHI MESS food orders
            </p>
          </div>
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={markAllNotificationsAsRead}
            className="text-xs font-bold text-[#E23744] hover:text-[#B91C2B] bg-rose-50 px-3 py-1.5 rounded-xl transition active:scale-95 shrink-0"
          >
            Mark all read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-[#E8E8E8] p-8 space-y-3">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-[#E23744] flex items-center justify-center mx-auto text-2xl">
            <Bell className="w-8 h-8" />
          </div>
          <h3 className="font-black text-base text-[#1C1C1C]">No notifications</h3>
          <p className="text-xs text-[#696969]">You are all caught up with your order updates.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => {
            return (
              <div
                key={n.id}
                onClick={() => handleOpenDetail(n)}
                className={`p-4 rounded-3xl border transition-all flex items-start justify-between gap-3 cursor-pointer ${
                  !n.read
                    ? 'bg-white border-rose-200 shadow-xs hover:border-[#E23744]'
                    : 'bg-[#F8F8F8] border-[#E8E8E8] opacity-90 hover:bg-white'
                }`}
              >
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <div
                    className={`w-9 h-9 rounded-2xl flex items-center justify-center text-base shrink-0 mt-0.5 ${
                      n.type === 'order' || n.type === 'delivery'
                        ? 'bg-emerald-100 text-[#2E9B5B]'
                        : n.type === 'payment'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-rose-100 text-[#E23744]'
                    }`}
                  >
                    {n.type === 'order' ? '🍲' : n.type === 'delivery' ? '🛵' : '🔔'}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs sm:text-sm font-black text-[#1C1C1C] truncate">
                        {n.title}
                      </h3>
                      {!n.read && (
                        <span className="w-2 h-2 rounded-full bg-[#E23744] shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-[#696969] mt-0.5 leading-relaxed">
                      {n.message}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 self-center">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(n.id);
                    }}
                    className="p-1.5 text-stone-400 hover:text-rose-600 rounded-xl transition"
                    title="Dismiss"
                  >
                    <X className="w-4 h-4" />
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
