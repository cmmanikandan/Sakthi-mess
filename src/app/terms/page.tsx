'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, FileCheck, CheckCircle2, AlertTriangle, Truck, Clock } from 'lucide-react';
import { BrandLogo } from '@/components/common/BrandLogo';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-neutral-900">
      {/* Top Header */}
      <header className="border-b border-neutral-200 bg-white/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition">
            <BrandLogo size="sm" />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-neutral-200 text-xs font-bold text-neutral-700 hover:bg-neutral-50 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#E23744]" />
            <span>Back to Home</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-8">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 text-[#E23744] rounded-full text-xs font-bold">
            <FileCheck className="w-3.5 h-3.5" />
            <span>User Agreement</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-neutral-900">
            Terms of Service
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500">
            Effective Date: September 18, 2026 · SAKTHI MESS
          </p>
        </div>

        <div className="prose prose-stone max-w-none space-y-6 text-sm leading-relaxed text-neutral-600">
          <section className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-xs space-y-3">
            <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#E23744]" />
              <span>1. Online Ordering & Preparation</span>
            </h2>
            <p>
              By placing an order on SAKTHI MESS, you agree that your order is confirmed once payment is successfully processed or Cash on Delivery is selected. Our kitchen team immediately begins fresh preparation of your South Indian meals.
            </p>
          </section>

          <section className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-xs space-y-3">
            <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
              <Truck className="w-5 h-5 text-[#E23744]" />
              <span>2. Home & Business Delivery</span>
            </h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Delivery Address:</strong> Customers are responsible for providing an accurate and complete delivery address including house/building number, street, landmark, and pincode.</li>
              <li><strong>Estimated Time:</strong> Delivery timelines (typically 25–35 minutes) are estimates based on traffic, weather, and kitchen order volume.</li>
              <li><strong>Contactability:</strong> Customers must ensure their contact phone number is reachable when the delivery partner arrives at the location.</li>
            </ul>
          </section>

          <section className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-xs space-y-3">
            <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-[#E23744]" />
              <span>3. Order Cancellation & Refunds</span>
            </h2>
            <p>
              Orders can only be cancelled while in the <strong>PLACED</strong> status before kitchen acceptance. Once the kitchen starts cooking (PREPARING), cancellation is no longer possible. In the rare event of item unavailability, a full refund will be initiated to your original payment method.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
