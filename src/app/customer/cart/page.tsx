'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useCanteen } from '@/context/CanteenContext';
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  ShoppingBag,
  Bike,
  Sparkles,
  MessageSquare,
} from 'lucide-react';

export default function CustomerCartPage() {
  const router = useRouter();
  const { restaurantConfig } = useCanteen();
  const {
    items,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    deliveryFee,
    freeDeliveryThreshold,
    amountNeededForFreeDelivery,
    discount,
    total,
    orderSpecialInstructions,
    setOrderSpecialInstructions,
  } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-20 h-20 mx-auto rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-3xl text-[#E23744]">
          <ShoppingBag className="w-9 h-9" />
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-[#1C1C1C]">
          Your cart is empty
        </h1>
        <p className="text-xs sm:text-sm text-[#696969] max-w-sm mx-auto">
          Add something delicious from SAKTHI MESS to get started.
        </p>
        <div className="pt-2">
          <Link
            href="/customer/menu"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#E23744] hover:bg-[#B91C2B] text-white text-xs sm:text-sm font-extrabold rounded-2xl shadow-xs transition active:scale-95"
          >
            <span>Browse Menu</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  const handleSafeBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push('/customer/menu');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-28 md:pb-12 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={handleSafeBack}
            className="p-2 -ml-2 rounded-full text-[#696969] hover:text-[#1C1C1C] hover:bg-stone-100 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-black text-[#1C1C1C] tracking-tight">
              My Cart
            </h1>
            <p className="text-xs text-[#696969]">
              {items.length} {items.length === 1 ? 'dish' : 'dishes'} selected
            </p>
          </div>
        </div>

        <button
          onClick={clearCart}
          className="text-xs text-rose-600 hover:text-rose-800 font-bold flex items-center gap-1 p-1 transition"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear All</span>
        </button>
      </div>

      {/* Free Delivery Banner */}
      <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200/80 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-[#2E9B5B] shrink-0 shadow-2xs">
            <Bike className="w-4 h-4" />
          </div>
          <div>
            {amountNeededForFreeDelivery > 0 ? (
              <p className="text-xs font-bold text-[#1C1C1C]">
                Add <strong className="text-[#E23744]">₹{amountNeededForFreeDelivery}</strong> more for{' '}
                <span className="text-[#2E9B5B]">FREE Doorstep Delivery</span>!
              </p>
            ) : (
              <p className="text-xs font-bold text-[#2E9B5B] flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Congratulations! You qualify for FREE Delivery!</span>
              </p>
            )}
          </div>
        </div>
        <Link href="/customer/menu" className="text-xs font-black text-[#E23744] shrink-0 hover:underline">
          + Add Food
        </Link>
      </div>

      {/* Cart Items List */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#E8E8E8] shadow-card divide-y divide-stone-100">
        {items.map(({ food, quantity, specialInstructions }) => (
          <div
            key={food.id}
            className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div className="flex items-start gap-3.5">
              <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200 mt-0.5">
                <Image
                  src={food.imageUrl || '/logo.png'}
                  alt={food.name}
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>

              <div>
                <h3 className="font-black text-sm sm:text-base text-[#1C1C1C] line-clamp-1">
                  {food.name}
                </h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-extrabold text-sm text-[#1C1C1C]">₹{food.price}</span>
                  <span className="text-xs text-stone-400">× {quantity}</span>
                </div>

                {specialInstructions && (
                  <p className="text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md mt-1 inline-block border border-amber-200/60">
                    Note: {specialInstructions}
                  </p>
                )}
              </div>
            </div>

            {/* Quantity Modifier & Subtotal */}
            <div className="flex items-center justify-between sm:justify-end gap-4">
              <div className="flex items-center bg-[#F8F8F8] border border-[#E8E8E8] rounded-xl overflow-hidden">
                <button
                  onClick={() => updateQuantity(food.id, quantity - 1)}
                  className="w-7 h-7 flex items-center justify-center hover:bg-stone-200 text-stone-700 transition"
                  aria-label="Decrease"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-7 text-center text-xs font-black text-[#1C1C1C]">
                  {quantity}
                </span>
                <button
                  onClick={() => updateQuantity(food.id, quantity + 1)}
                  className="w-7 h-7 flex items-center justify-center hover:bg-stone-200 text-stone-700 transition"
                  aria-label="Increase"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="text-right min-w-[70px]">
                <span className="font-black text-sm text-[#1C1C1C]">
                  ₹{food.price * quantity}
                </span>
              </div>

              <button
                onClick={() => removeFromCart(food.id)}
                className="p-1.5 text-stone-400 hover:text-rose-600 transition"
                aria-label="Remove item"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Special Delivery Instructions Input */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#E8E8E8] shadow-card space-y-2">
        <label className="text-xs font-black text-[#1C1C1C] flex items-center gap-1.5">
          <MessageSquare className="w-4 h-4 text-[#E23744]" />
          Order & Delivery Instructions
        </label>
        <input
          type="text"
          value={orderSpecialInstructions}
          onChange={(e) => setOrderSpecialInstructions(e.target.value)}
          placeholder="e.g. Ring bell twice, deliver at 2nd floor, extra spicy salna please"
          className="w-full px-3.5 py-2.5 text-xs bg-[#F8F8F8] border border-[#E8E8E8] rounded-2xl focus:bg-white focus:border-[#E23744] focus:outline-none transition"
          maxLength={150}
        />
      </div>

      {/* Order Bill Summary */}
      <div className="bg-white rounded-3xl p-5 border border-[#E8E8E8] shadow-card space-y-3">
        <h2 className="text-sm font-black text-[#1C1C1C] border-b border-stone-100 pb-2">
          Bill Details
        </h2>

        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between text-[#696969]">
            <span>Item Subtotal</span>
            <span className="font-extrabold text-[#1C1C1C]">₹{subtotal}</span>
          </div>

          <div className="flex items-center justify-between text-[#696969]">
            <div className="flex items-center gap-1">
              <span>Delivery Fee</span>
              {deliveryFee === 0 && (
                <span className="text-[10px] text-[#2E9B5B] font-bold">(Free Delivery)</span>
              )}
            </div>
            <span className="font-extrabold text-[#1C1C1C]">
              {deliveryFee === 0 ? <span className="text-[#2E9B5B]">FREE</span> : `₹${deliveryFee}`}
            </span>
          </div>

          {discount > 0 && (
            <div className="flex items-center justify-between text-[#2E9B5B]">
              <span>Discount</span>
              <span className="font-bold">-₹{discount}</span>
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-sm sm:text-base font-black text-[#1C1C1C]">
            <span>To Pay</span>
            <span className="text-[#E23744]">₹{total}</span>
          </div>
        </div>

        {/* Store Closed Warning */}
        {restaurantConfig?.isOpen === false && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-700 space-y-0.5">
            <p className="font-extrabold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-600 inline-block" />
              <span>SAKTHI MESS is currently closed</span>
            </p>
            <p className="text-[11px] text-red-600">
              Opening again at 7:00 AM. You can keep items in your cart and order once open.
            </p>
          </div>
        )}

        {/* Proceed to Checkout Button */}
        <div className="pt-2">
          <button
            onClick={() => router.push('/customer/checkout')}
            disabled={restaurantConfig?.isOpen === false}
            className="w-full py-3.5 rounded-2xl bg-[#E23744] hover:bg-[#B91C2B] disabled:bg-stone-300 text-white font-black text-sm flex items-center justify-center gap-2 shadow-xs transition active:scale-95"
          >
            {restaurantConfig?.isOpen === false ? (
              <span>STORE CLOSED · REOPENS 7:00 AM</span>
            ) : (
              <>
                <span>Proceed to Checkout · ₹{total}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
