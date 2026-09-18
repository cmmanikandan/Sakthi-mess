'use client';

import React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ShieldX, Home, LogIn } from 'lucide-react';

function AccessDeniedContent() {
  const params = useSearchParams();
  const from = params?.get('from') || '';

  const isAdmin = from.startsWith('/admin');
  const isKitchen = from.startsWith('/kitchen');
  const isDelivery = from.startsWith('/delivery');

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-6">
      <div className="max-w-sm w-full bg-white rounded-3xl p-8 shadow-xl border border-neutral-200 text-center space-y-5">
        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto">
          <ShieldX className="w-8 h-8 text-[#E23744]" />
        </div>

        <div>
          <h1 className="text-xl font-black text-neutral-900">Access Restricted</h1>
          <p className="text-xs text-neutral-500 mt-2">
            {isAdmin
              ? 'This section requires SAKTHI MESS Administrator privileges.'
              : isKitchen
              ? 'This section is restricted to Kitchen Staff accounts.'
              : isDelivery
              ? 'This section is restricted to Delivery Staff accounts.'
              : 'You do not have authorization to access this page.'}
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-xs text-amber-800 font-semibold">
          Please sign in with the authorized account credentials to continue.
        </div>

        <div className="flex flex-col gap-2">
          <Link
            href={`/login?redirect=${encodeURIComponent(from || '/')}`}
            className="flex items-center justify-center gap-2 py-2.5 bg-[#E23744] hover:bg-[#B91C2B] text-white font-bold text-xs rounded-xl transition"
          >
            <LogIn className="w-4 h-4" />
            <span>Go to Login</span>
          </Link>
          <Link
            href="/"
            className="flex items-center justify-center gap-2 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold text-xs rounded-xl transition"
          >
            <Home className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AccessDeniedPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-[#FAF8F5]" />}>
      <AccessDeniedContent />
    </React.Suspense>
  );
}
