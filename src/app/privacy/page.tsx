'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Lock, Eye, Truck } from 'lucide-react';
import { BrandLogo } from '@/components/common/BrandLogo';

export default function PrivacyPolicyPage() {
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
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Data Protection & Privacy</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-neutral-900">
            Privacy Policy
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500">
            Last updated: September 18, 2026 · SAKTHI MESS Online Food Ordering & Home Delivery
          </p>
        </div>

        <div className="prose prose-stone max-w-none space-y-6 text-sm leading-relaxed text-neutral-600">
          <section className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-xs space-y-3">
            <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
              <Eye className="w-5 h-5 text-[#E23744]" />
              <span>1. Information We Collect</span>
            </h2>
            <p>
              When you order food through SAKTHI MESS, we collect the necessary information required to prepare your meals and deliver them accurately to your doorstep:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Customer Profile:</strong> Full name, email address, and contact phone number.</li>
              <li><strong>Delivery Addresses:</strong> Street address, landmark, city, state, pincode, and optional GPS coordinates to ensure accurate doorstep delivery.</li>
              <li><strong>Order Details:</strong> Dishes ordered, quantities, special cooking instructions, order numbers, and delivery statuses.</li>
              <li><strong>Payment Records:</strong> Secure transaction references from authorized gateways (e.g., Razorpay). We never store full card numbers, CVVs, or UPI PINs.</li>
            </ul>
          </section>

          <section className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-xs space-y-3">
            <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
              <Truck className="w-5 h-5 text-[#E23744]" />
              <span>2. Delivery Partner Information Sharing</span>
            </h2>
            <p>
              To fulfill your food deliveries, assigned delivery partners receive only your recipient name, phone number, and delivery address. They do not have access to your account passwords or payment details.
            </p>
          </section>

          <section className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-xs space-y-3">
            <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
              <Lock className="w-5 h-5 text-[#E23744]" />
              <span>3. Data Security & Storage</span>
            </h2>
            <p>
              We implement industry-standard encryption and security protocols to safeguard your personal data. We do not sell or rent customer data to third-party advertisers.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
