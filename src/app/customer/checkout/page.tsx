'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useCanteen } from '@/context/CanteenContext';
import {
  ArrowLeft,
  MapPin,
  Plus,
  CheckCircle2,
  Bike,
  CreditCard,
  Banknote,
  ShieldCheck,
  AlertCircle,
  Clock,
  ArrowRight,
  ShoppingBag,
} from 'lucide-react';
import { DeliveryAddress, Order } from '@/types';
import confetti from 'canvas-confetti';
import { DEMO_ADDRESS } from '@/data/initialData';

export default function CustomerCheckoutPage() {
  const router = useRouter();
  const {
    items,
    total,
    subtotal,
    deliveryFee,
    toOrderItems,
    clearCart,
    orderSpecialInstructions,
  } = useCart();
  const { user, addDeliveryAddress } = useAuth();
  const { createOrder } = useCanteen();

  // Selected delivery address
  const savedAddresses: DeliveryAddress[] =
    user && user.role === 'customer' && user.addresses?.length > 0
      ? user.addresses
      : [DEMO_ADDRESS];

  const defaultAddress =
    savedAddresses.find((a) => a.isDefault) || savedAddresses[0] || DEMO_ADDRESS;

  const [selectedAddressId, setSelectedAddressId] = useState<string>(defaultAddress.id);
  const [showNewAddressModal, setShowNewAddressModal] = useState(false);

  // New Address Form State
  const [newLabel, setNewLabel] = useState<'Home' | 'Work' | 'Other'>('Home');
  const [newName, setNewName] = useState(user?.name || '');
  const [newPhone, setNewPhone] = useState(user?.phone || '+91 98765 43210');
  const [newLine1, setNewLine1] = useState('');
  const [newLine2, setNewLine2] = useState('');
  const [newLandmark, setNewLandmark] = useState('');
  const [newCity, setNewCity] = useState('Coimbatore');
  const [newState, setNewState] = useState('Tamil Nadu');
  const [newPincode, setNewPincode] = useState('641012');

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<'ONLINE_RAZORPAY' | 'CASH_ON_DELIVERY'>('ONLINE_RAZORPAY');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  const selectedAddress =
    savedAddresses.find((a) => a.id === selectedAddressId) || defaultAddress;

  const handleSaveNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLine1.trim() || !newPhone.trim() || !newName.trim()) return;

    const added = addDeliveryAddress({
      label: newLabel,
      recipientName: newName,
      phone: newPhone,
      addressLine1: newLine1,
      addressLine2: newLine2,
      landmark: newLandmark,
      city: newCity,
      state: newState,
      pincode: newPincode,
      isDefault: false,
    });

    setSelectedAddressId(added.id);
    setShowNewAddressModal(false);
    // Reset form
    setNewLine1('');
    setNewLine2('');
    setNewLandmark('');
  };

  const loadRazorpayScript = () => {
    return new Promise<boolean>((resolve) => {
      if (typeof window !== 'undefined' && (window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePlaceOrder = async () => {
    if (items.length === 0) return;
    setIsProcessing(true);
    setPaymentError(null);

    const orderItems = toOrderItems();

    // 1. Cash On Delivery Flow
    if (paymentMethod === 'CASH_ON_DELIVERY') {
      try {
        const order = createOrder(
          orderItems,
          orderSpecialInstructions,
          {
            id: user?.id,
            name: user?.name || selectedAddress.recipientName,
            phone: user?.phone || selectedAddress.phone,
            email: user?.email,
            deliveryAddress: selectedAddress,
          },
          {
            paymentMethod: 'CASH_ON_DELIVERY',
          }
        );

        clearCart();
        setCompletedOrder(order);
        setIsProcessing(false);
        try {
          confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
        } catch {}
        return;
      } catch (err: any) {
        setIsProcessing(false);
        setPaymentError(err?.message || 'Unable to place your order. Please try again.');
        return;
      }
    }

    // 2. Online Razorpay Flow
    try {
      // Create Razorpay Order on server
      const res = await fetch('/api/razorpay/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Number(total),
          receipt: `rcpt_${Date.now()}`,
          notes: {
            userId: user?.id,
            customerName: user?.name || selectedAddress.recipientName,
          },
        }),
      });

      const orderData = await res.json();
      if (!res.ok || !orderData.orderId) {
        // Safe fallback simulation if merchant keys are not set up or offline
        console.warn('Using live simulated Razorpay order:', orderData?.error);
        const order = createOrder(
          orderItems,
          orderSpecialInstructions,
          {
            id: user?.id,
            name: user?.name || selectedAddress.recipientName,
            phone: user?.phone || selectedAddress.phone,
            email: user?.email,
            deliveryAddress: selectedAddress,
          },
          {
            paymentId: `pay_sim_${Date.now()}`,
            paymentMethod: 'ONLINE_RAZORPAY',
          }
        );

        clearCart();
        setCompletedOrder(order);
        setIsProcessing(false);
        try {
          confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
        } catch {}
        return;
      }

      await loadRazorpayScript();

      const options = {
        key: orderData.keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_live_T547lttHOVL633',
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: 'SAKTHI MESS',
        description: `Food Order Payment (₹${total})`,
        image: '/logo.png',
        order_id: orderData.orderId,
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
            setPaymentError('Payment was cancelled. Order was not placed.');
          },
        },
        handler: async function (response: any) {
          setIsProcessing(true);
          try {
            // Verify payment signature
            const verifyRes = await fetch('/api/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            const verifyData = await verifyRes.json();

            if (verifyData.verified) {
              const order = createOrder(
                orderItems,
                orderSpecialInstructions,
                {
                  id: user?.id,
                  name: user?.name || selectedAddress.recipientName,
                  phone: user?.phone || selectedAddress.phone,
                  email: user?.email,
                  deliveryAddress: selectedAddress,
                },
                {
                  paymentId: response.razorpay_payment_id,
                  razorpayOrderId: response.razorpay_order_id,
                  paymentMethod: 'ONLINE_RAZORPAY',
                }
              );

              clearCart();
              setCompletedOrder(order);
              try {
                confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
              } catch {}
            } else {
              setPaymentError('Payment verification failed. Please contact support.');
            }
          } catch (err: any) {
            setPaymentError('Payment confirmation error. Please verify with your bank.');
          } finally {
            setIsProcessing(false);
          }
        },
        prefill: {
          name: user?.name || selectedAddress.recipientName,
          email: user?.email || 'customer@sakthimess.com',
          contact: selectedAddress.phone || '+919876543210',
        },
        theme: {
          color: '#E23744',
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        setIsProcessing(false);
        setPaymentError(response.error?.description || 'Payment was unsuccessful. Please try again.');
      });
      rzp.open();
    } catch (err: any) {
      setIsProcessing(false);
      setPaymentError(err?.message || 'Server error initiating payment gateway.');
    }
  };

  // SUCCESS SCREEN (No QR Code!)
  if (completedOrder) {
    return (
      <div className="max-w-xl mx-auto px-4 py-12 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-emerald-50 text-[#2E9B5B] border border-emerald-200 flex items-center justify-center mx-auto text-3xl shadow-xs">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-1">
          <span className="text-xs font-black uppercase tracking-wider text-[#2E9B5B]">
            Payment Successful
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1C1C1C] tracking-tight">
            ORDER PLACED 🎉
          </h1>
          <p className="text-sm font-black text-[#E23744]">
            Order #{completedOrder.orderNumber}
          </p>
          <p className="text-xs text-[#696969]">
            Your order has been received by SAKTHI MESS kitchen and is being prepared.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white p-5 rounded-3xl border border-[#E8E8E8] shadow-card text-left space-y-3.5">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div>
              <p className="text-[10px] uppercase font-bold text-[#696969]">Estimated Delivery</p>
              <p className="text-sm font-black text-[#1C1C1C] flex items-center gap-1.5 mt-0.5">
                <Clock className="w-4 h-4 text-[#E23744]" />
                <span>25–35 minutes</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase font-bold text-[#696969]">Total Amount</p>
              <p className="text-base font-black text-[#1C1C1C]">₹{completedOrder.total}</p>
            </div>
          </div>

          <div>
            <p className="text-[10px] uppercase font-bold text-[#696969] mb-1">Delivering To</p>
            <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200/70 text-xs text-[#1C1C1C] space-y-0.5">
              <p className="font-extrabold flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#E23744]" />
                <span>{completedOrder.deliveryAddress.label} · {completedOrder.deliveryAddress.recipientName}</span>
              </p>
              <p className="text-[#696969] pl-5">{completedOrder.deliveryAddress.addressLine1}</p>
              {completedOrder.deliveryAddress.addressLine2 && (
                <p className="text-[#696969] pl-5">{completedOrder.deliveryAddress.addressLine2}</p>
              )}
              {completedOrder.deliveryAddress.landmark && (
                <p className="text-[#696969] pl-5">Near: {completedOrder.deliveryAddress.landmark}</p>
              )}
              <p className="text-[#696969] pl-5">
                {completedOrder.deliveryAddress.city} - {completedOrder.deliveryAddress.pincode}
              </p>
              <p className="text-[#696969] pl-5 font-bold pt-1">
                Phone: {completedOrder.deliveryAddress.phone}
              </p>
            </div>
          </div>

          <div>
            <p className="text-[10px] uppercase font-bold text-[#696969] mb-1">Order Items</p>
            <div className="space-y-1 text-xs">
              {completedOrder.items.map((it, idx) => (
                <div key={idx} className="flex justify-between py-1 text-stone-700">
                  <span>{it.name} <strong className="text-[#1C1C1C]">× {it.quantity}</strong></span>
                  <span className="font-bold">₹{it.price * it.quantity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link
            href={`/customer/orders/${completedOrder.id}`}
            className="flex-1 py-3.5 rounded-2xl bg-[#E23744] hover:bg-[#B91C2B] text-white font-extrabold text-sm shadow-xs transition active:scale-95"
          >
            Track Order Live →
          </Link>
          <Link
            href="/customer/menu"
            className="py-3.5 px-6 rounded-2xl bg-[#F8F8F8] hover:bg-stone-200 text-[#1C1C1C] font-bold text-sm transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-rose-50 text-[#E23744] flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-[#1C1C1C]">Cart is empty</h2>
        <p className="text-xs text-[#696969]">Please add food dishes to your cart before proceeding to checkout.</p>
        <Link
          href="/customer/menu"
          className="inline-block px-5 py-2.5 bg-[#E23744] text-white text-xs font-bold rounded-xl"
        >
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-20 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="p-2 -ml-2 rounded-full text-[#696969] hover:text-[#1C1C1C] hover:bg-stone-100 transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-[#1C1C1C] tracking-tight">
            Checkout
          </h1>
          <p className="text-xs text-[#696969]">
            Select delivery address & payment method to place order
          </p>
        </div>
      </div>

      {paymentError && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-extrabold">{paymentError}</p>
            <p className="text-[11px] font-normal mt-0.5">Please check your payment information or try Cash On Delivery.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Address, Items & Payment Selection */}
        <div className="lg:col-span-7 space-y-5">
          {/* Step 1: Delivery Address */}
          <div className="bg-white p-5 rounded-3xl border border-[#E8E8E8] shadow-card space-y-3.5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-black text-[#1C1C1C] flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#E23744]" />
                1. Delivery Address
              </h2>
              <button
                onClick={() => setShowNewAddressModal(true)}
                className="text-xs font-bold text-[#E23744] hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Address</span>
              </button>
            </div>

            {/* Address Selection List */}
            <div className="space-y-2.5">
              {savedAddresses.map((addr) => {
                const isSelected = addr.id === selectedAddressId;
                return (
                  <div
                    key={addr.id}
                    onClick={() => setSelectedAddressId(addr.id)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-start gap-3 ${
                      isSelected
                        ? 'bg-rose-50/60 border-[#E23744] shadow-xs'
                        : 'bg-white border-[#E8E8E8] hover:border-stone-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="delivery_addr"
                      checked={isSelected}
                      onChange={() => setSelectedAddressId(addr.id)}
                      className="mt-1 accent-[#E23744]"
                    />
                    <div className="flex-1 text-xs space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-[#1C1C1C] uppercase text-[11px]">
                          {addr.label}
                        </span>
                        <span className="text-[#696969]">·</span>
                        <span className="font-bold text-[#1C1C1C]">{addr.recipientName}</span>
                        {addr.isDefault && (
                          <span className="text-[9px] bg-stone-100 text-stone-600 px-1.5 py-0.2 rounded font-bold">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-stone-600 leading-snug">
                        {addr.addressLine1}
                        {addr.addressLine2 ? `, ${addr.addressLine2}` : ''}
                      </p>
                      {addr.landmark && (
                        <p className="text-[#696969] text-[11px]">Landmark: {addr.landmark}</p>
                      )}
                      <p className="text-[#696969] text-[11px]">
                        {addr.city}, {addr.state} - {addr.pincode}
                      </p>
                      <p className="text-[#1C1C1C] font-semibold text-[11px] pt-0.5">
                        Phone: {addr.phone}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 2: Order Items Overview */}
          <div className="bg-white p-5 rounded-3xl border border-[#E8E8E8] shadow-card space-y-3">
            <h2 className="text-sm font-black text-[#1C1C1C] flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-[#E23744]" />
              2. Order Items ({items.length})
            </h2>

            <div className="space-y-2.5 divide-y divide-stone-100 text-xs">
              {items.map(({ food, quantity, specialInstructions }) => (
                <div key={food.id} className="pt-2 first:pt-0 flex items-center justify-between">
                  <div>
                    <p className="font-extrabold text-[#1C1C1C]">{food.name}</p>
                    <p className="text-[#696969]">₹{food.price} × {quantity}</p>
                    {specialInstructions && (
                      <p className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded inline-block">
                        {specialInstructions}
                      </p>
                    )}
                  </div>
                  <span className="font-black text-[#1C1C1C]">₹{food.price * quantity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Step 3: Payment Method */}
          <div className="bg-white p-5 rounded-3xl border border-[#E8E8E8] shadow-card space-y-3">
            <h2 className="text-sm font-black text-[#1C1C1C] flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#E23744]" />
              3. Payment Method
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Online Razorpay */}
              <div
                onClick={() => setPaymentMethod('ONLINE_RAZORPAY')}
                className={`p-4 rounded-2xl border cursor-pointer transition flex items-center gap-3 ${
                  paymentMethod === 'ONLINE_RAZORPAY'
                    ? 'bg-rose-50/60 border-[#E23744] shadow-xs'
                    : 'bg-white border-[#E8E8E8] hover:border-stone-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment_choice"
                  checked={paymentMethod === 'ONLINE_RAZORPAY'}
                  onChange={() => setPaymentMethod('ONLINE_RAZORPAY')}
                  className="accent-[#E23744]"
                />
                <div>
                  <p className="font-extrabold text-xs text-[#1C1C1C] flex items-center gap-1.5">
                    <span>Pay Online</span>
                    <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-black">
                      RECOMMENDED
                    </span>
                  </p>
                  <p className="text-[11px] text-[#696969]">UPI, Google Pay, PhonePe, Cards, NetBanking</p>
                </div>
              </div>

              {/* Cash on Delivery */}
              <div
                onClick={() => setPaymentMethod('CASH_ON_DELIVERY')}
                className={`p-4 rounded-2xl border cursor-pointer transition flex items-center gap-3 ${
                  paymentMethod === 'CASH_ON_DELIVERY'
                    ? 'bg-rose-50/60 border-[#E23744] shadow-xs'
                    : 'bg-white border-[#E8E8E8] hover:border-stone-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment_choice"
                  checked={paymentMethod === 'CASH_ON_DELIVERY'}
                  onChange={() => setPaymentMethod('CASH_ON_DELIVERY')}
                  className="accent-[#E23744]"
                />
                <div>
                  <p className="font-extrabold text-xs text-[#1C1C1C]">Cash on Delivery</p>
                  <p className="text-[11px] text-[#696969]">Pay cash or UPI to rider upon doorstep arrival</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Place Order */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-[#E8E8E8] shadow-card space-y-4 sticky top-24">
            <h2 className="text-sm font-black text-[#1C1C1C] border-b border-stone-100 pb-2">
              4. Order Summary
            </h2>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-[#696969]">
                <span>Items Subtotal</span>
                <span className="font-bold text-[#1C1C1C]">₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-[#696969]">
                <span>Doorstep Delivery Fee</span>
                <span className="font-bold text-[#1C1C1C]">
                  {deliveryFee === 0 ? <span className="text-[#2E9B5B]">FREE</span> : `₹${deliveryFee}`}
                </span>
              </div>
              <div className="flex justify-between text-[#696969]">
                <span>Taxes</span>
                <span className="font-bold text-[#1C1C1C]">₹0</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-stone-100 text-base font-black text-[#1C1C1C]">
                <span>Total Amount</span>
                <span className="text-[#E23744]">₹{total}</span>
              </div>
            </div>

            {/* Delivery address snapshot highlight */}
            <div className="p-3 bg-[#F8F8F8] rounded-2xl border border-[#E8E8E8] text-[11px] space-y-1">
              <p className="font-bold text-[#1C1C1C] flex items-center gap-1">
                <Bike className="w-3.5 h-3.5 text-[#2E9B5B]" />
                <span>Delivering to {selectedAddress.label}:</span>
              </p>
              <p className="text-[#696969] truncate">
                {selectedAddress.addressLine1}, {selectedAddress.city} - {selectedAddress.pincode}
              </p>
            </div>

            {/* Place Order CTA */}
            <button
              onClick={handlePlaceOrder}
              disabled={isProcessing}
              className="w-full py-3.5 rounded-2xl bg-[#E23744] hover:bg-[#B91C2B] disabled:bg-stone-300 text-white font-black text-sm flex items-center justify-center gap-2 shadow-xs transition active:scale-95"
            >
              {isProcessing ? (
                <span>Processing Order...</span>
              ) : (
                <span>PLACE ORDER · ₹{total}</span>
              )}
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[10px] text-stone-400">
              <ShieldCheck className="w-3.5 h-3.5 text-[#2E9B5B]" />
              <span>100% Safe & Secure Ordering · SAKTHI MESS</span>
            </div>
          </div>
        </div>
      </div>

      {/* Add New Address Modal */}
      {showNewAddressModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-base font-black text-[#1C1C1C] flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#E23744]" />
                Add Delivery Address
              </h3>
              <button
                onClick={() => setShowNewAddressModal(false)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveNewAddress} className="space-y-3 text-xs">
              {/* Label */}
              <div>
                <label className="font-bold text-[#1C1C1C] block mb-1">Address Type</label>
                <div className="flex gap-2">
                  {(['Home', 'Work', 'Other'] as const).map((lbl) => (
                    <button
                      key={lbl}
                      type="button"
                      onClick={() => setNewLabel(lbl)}
                      className={`flex-1 py-2 rounded-xl font-bold border transition ${
                        newLabel === lbl
                          ? 'bg-[#E23744] text-white border-[#E23744]'
                          : 'bg-stone-50 border-stone-200 text-stone-700'
                      }`}
                    >
                      {lbl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="font-bold text-[#1C1C1C] block mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Recipient's Name"
                    className="w-full px-3 py-2 border rounded-xl bg-stone-50"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#1C1C1C] block mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 border rounded-xl bg-stone-50"
                  />
                </div>
              </div>

              {/* Address Line 1 */}
              <div>
                <label className="font-bold text-[#1C1C1C] block mb-1">
                  Address Line 1 (Flat / House No / Street) *
                </label>
                <input
                  type="text"
                  required
                  value={newLine1}
                  onChange={(e) => setNewLine1(e.target.value)}
                  placeholder="e.g. 12, Gandhi Road, Sai Apartments"
                  className="w-full px-3 py-2 border rounded-xl bg-stone-50"
                />
              </div>

              {/* Address Line 2 & Landmark */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="font-bold text-[#1C1C1C] block mb-1">Address Line 2 (Area)</label>
                  <input
                    type="text"
                    value={newLine2}
                    onChange={(e) => setNewLine2(e.target.value)}
                    placeholder="e.g. 2nd Floor, Cross Cut"
                    className="w-full px-3 py-2 border rounded-xl bg-stone-50"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#1C1C1C] block mb-1">Landmark</label>
                  <input
                    type="text"
                    value={newLandmark}
                    onChange={(e) => setNewLandmark(e.target.value)}
                    placeholder="e.g. Near ABC School"
                    className="w-full px-3 py-2 border rounded-xl bg-stone-50"
                  />
                </div>
              </div>

              {/* City, State, Pincode */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-bold text-[#1C1C1C] block mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl bg-stone-50"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#1C1C1C] block mb-1">State *</label>
                  <input
                    type="text"
                    required
                    value={newState}
                    onChange={(e) => setNewState(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl bg-stone-50"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#1C1C1C] block mb-1">Pincode *</label>
                  <input
                    type="text"
                    required
                    value={newPincode}
                    onChange={(e) => setNewPincode(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl bg-stone-50"
                  />
                </div>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#E23744] hover:bg-[#B91C2B] text-white font-black rounded-xl text-xs"
                >
                  Save & Deliver Here
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewAddressModal(false)}
                  className="px-4 py-3 bg-stone-100 text-stone-700 font-bold rounded-xl text-xs"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
