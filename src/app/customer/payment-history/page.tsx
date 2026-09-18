'use client';

import React from 'react';
import Link from 'next/link';
import { useCanteen } from '@/context/CanteenContext';
import { ArrowLeft, CheckCircle2, CreditCard, Receipt, ExternalLink } from 'lucide-react';

export default function PaymentHistoryPage() {
  const { orders } = useCanteen();

  const paidOrders = orders.filter(
    (o) => o.paymentStatus === 'PAID' || o.paymentStatus === 'VERIFIED'
  );

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
            Payment History
          </h1>
          <p className="text-xs text-neutral-500">
            Secure digital payments and transaction receipts
          </p>
        </div>
      </div>

      {paidOrders.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 border border-neutral-200 text-center space-y-2">
          <Receipt className="w-8 h-8 text-neutral-400 mx-auto" />
          <p className="font-bold text-sm text-neutral-800">No payment history yet</p>
          <p className="text-xs text-neutral-500">
            Completed online orders will show transaction records here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {paidOrders.map((ord) => (
            <div
              key={ord.id}
              className="bg-white rounded-3xl p-5 border border-neutral-200 shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-neutral-900">
                      Order #{ord.orderNumber || ord.id}
                    </h3>
                    <p className="text-xs text-neutral-400">
                      {new Date(ord.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-base font-extrabold text-neutral-900">
                    ₹{ord.total}
                  </p>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Paid
                  </span>
                </div>
              </div>

              <div className="bg-neutral-50 p-3 rounded-2xl border border-neutral-200 flex items-center justify-between text-xs">
                <div>
                  <p className="text-neutral-400 text-[11px]">Transaction Reference</p>
                  <p className="font-mono text-neutral-800 text-[11px]">
                    {ord.paymentId || `pay_${ord.id.slice(0, 8)}`}
                  </p>
                </div>
                <Link
                  href={`/customer/orders/${ord.id}`}
                  className="text-[#E23744] font-semibold hover:underline flex items-center gap-1"
                >
                  <span>View Details</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
