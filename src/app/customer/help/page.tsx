'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ChevronDown, ChevronUp, Phone, Mail, Clock, ShieldCheck, Truck, Utensils } from 'lucide-react';

export default function CustomerHelpPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does doorstep food delivery work at SAKTHI MESS?',
      a: 'Browse our menu, add authentic South Indian dishes to your cart, and enter your delivery address at checkout. Once confirmed, our kitchen prepares your food fresh, packs it safely, and our delivery partner delivers it directly to your home or office.',
    },
    {
      q: 'How can I track my food order?',
      a: 'After placing your order, you can track live updates in real time on the Order Tracking page: Order Placed → Accepted → Preparing in Kitchen → Packing → Out for Delivery → Delivered.',
    },
    {
      q: 'What are the delivery charges?',
      a: 'We offer free delivery for orders of ₹300 and above! For orders below ₹300, a nominal flat delivery charge of ₹30 applies.',
    },
    {
      q: 'How long does delivery usually take?',
      a: 'Average preparation and delivery time is 25 to 35 minutes depending on your distance from our restaurant. High-demand items like Biryani and fresh hot Parottas are prepared fresh on order.',
    },
    {
      q: 'What payment methods do you accept?',
      a: 'We accept secure online payments via UPI (Google Pay, PhonePe, Paytm), Credit & Debit cards, Net Banking via Razorpay, as well as Cash on Delivery.',
    },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-4 pb-20 space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/customer/profile"
          className="p-2 -ml-2 rounded-full text-neutral-600 hover:text-neutral-900 transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-900 tracking-tight">
            Help & Customer Support
          </h1>
          <p className="text-xs text-neutral-500">
            Assistance with orders, delivery tracking, and payments
          </p>
        </div>
      </div>

      {/* Support Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-white p-4 rounded-3xl border border-neutral-200 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-red-50 text-[#E23744] flex items-center justify-center">
            <Phone className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-neutral-400 font-medium">Customer Hotline</p>
            <p className="text-sm font-bold text-neutral-900">+91 98765 43210</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-neutral-200 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <p className="text-neutral-400 text-xs font-medium">Support Email</p>
            <p className="text-sm font-bold text-neutral-900">support@sakthimess.com</p>
          </div>
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-xs space-y-3">
        <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
          Frequently Asked Questions
        </h2>

        <div className="divide-y divide-neutral-100">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div key={index} className="py-3.5 first:pt-0 last:pb-0">
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full flex items-center justify-between text-left text-xs sm:text-sm font-bold text-neutral-900 hover:text-[#E23744] transition"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-neutral-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-neutral-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <p className="text-xs text-neutral-600 mt-2 leading-relaxed animate-fadeIn">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
