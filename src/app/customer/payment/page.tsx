'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCanteen } from '@/context/CanteenContext';
import { useAuth } from '@/context/AuthContext';
import { ShieldCheck, CheckCircle2, XCircle, CreditCard, ArrowLeft, Check, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';

function CustomerPaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams?.get('orderId') || '';
  const amount = searchParams?.get('amount') || '0';

  const { user, isLoaded } = useAuth();
  const { orders, verifyPayment } = useCanteen();

  React.useEffect(() => {
    if (isLoaded && !user) {
      router.push(`/login?redirect=/customer/payment?orderId=${orderId}&amount=${amount}`);
    }
  }, [isLoaded, user, router, orderId, amount]);

  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'cod'>('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'IDLE' | 'SUCCESS' | 'FAILED'>('IDLE');

  if (!isLoaded) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#E23744] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const order = orders.find((o) => o.id === orderId);

  const handleCompletePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const mockPaymentId = `pay_${Date.now()}`;
      verifyPayment(orderId, mockPaymentId);
      setIsProcessing(false);
      setPaymentStatus('SUCCESS');

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {}

      setTimeout(() => {
        router.push(`/customer/orders/${orderId}`);
      }, 1500);
    }, 1000);
  };

  return (
    <div className="max-w-lg mx-auto py-6 px-4 space-y-5">
      <div className="flex items-center gap-3">
        <Link
          href="/customer/orders"
          className="p-2 rounded-xl bg-white border border-neutral-200 text-neutral-600 hover:text-neutral-900"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl font-black text-neutral-900">Complete Payment</h1>
          <p className="text-xs text-neutral-500">Order #{order?.orderNumber || orderId}</p>
        </div>
      </div>

      {paymentStatus === 'SUCCESS' ? (
        <div className="bg-white rounded-3xl p-8 border border-neutral-200 shadow-sm text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-black text-neutral-900">Payment Successful!</h2>
            <p className="text-xs text-neutral-500">
              Your order has been received and sent to the kitchen.
            </p>
          </div>
          <p className="text-xs text-neutral-400">Redirecting to order tracking...</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-sm space-y-5">
          {/* Order Info */}
          <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
            <div>
              <p className="text-xs text-neutral-500 font-semibold">Total Payable</p>
              <p className="text-2xl font-black text-[#E23744]">
                ₹{order?.total || amount}
              </p>
            </div>
            <div className="text-right">
              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                Payment Pending
              </span>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-700 block">
              Select Payment Method
            </label>
            <div className="space-y-2">
              <label
                onClick={() => setPaymentMethod('upi')}
                className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition ${
                  paymentMethod === 'upi'
                    ? 'border-[#E23744] bg-red-50/20'
                    : 'border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
                    UPI
                  </div>
                  <div>
                    <p className="text-xs font-bold text-neutral-900">Instant UPI Payment</p>
                    <p className="text-[11px] text-neutral-500">Google Pay, PhonePe, Paytm</p>
                  </div>
                </div>
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    paymentMethod === 'upi'
                      ? 'border-[#E23744] bg-[#E23744] text-white'
                      : 'border-neutral-300'
                  }`}
                >
                  {paymentMethod === 'upi' && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                </div>
              </label>

              <label
                onClick={() => setPaymentMethod('card')}
                className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition ${
                  paymentMethod === 'card'
                    ? 'border-[#E23744] bg-red-50/20'
                    : 'border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-neutral-900">Credit / Debit Card</p>
                    <p className="text-[11px] text-neutral-500">Visa, Mastercard, RuPay</p>
                  </div>
                </div>
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    paymentMethod === 'card'
                      ? 'border-[#E23744] bg-[#E23744] text-white'
                      : 'border-neutral-300'
                  }`}
                >
                  {paymentMethod === 'card' && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                </div>
              </label>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCompletePayment}
            disabled={isProcessing}
            className="w-full py-3.5 bg-[#E23744] hover:bg-[#B91C2B] active:scale-[0.99] text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-red-500/25 transition disabled:opacity-75"
          >
            {isProcessing ? (
              <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Pay ₹{order?.total || amount} Securely</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

export default function CustomerPaymentPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center text-neutral-400 font-semibold text-sm">
          Loading payment gateway...
        </div>
      }
    >
      <CustomerPaymentContent />
    </React.Suspense>
  );
}
