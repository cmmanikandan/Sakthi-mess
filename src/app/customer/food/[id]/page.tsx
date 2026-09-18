'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useCanteen } from '@/context/CanteenContext';
import { useCart } from '@/context/CartContext';
import {
  ArrowLeft,
  Star,
  Plus,
  Minus,
  Heart,
  Clock,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FoodDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { foods, favorites, toggleFavorite } = useCanteen();
  const { addToCart } = useCart();

  const food = foods.find((f) => f.id === id);
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [addedToast, setAddedToast] = useState(false);

  if (!food) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-[#1C1C1C]">Dish not found</h2>
        <p className="text-sm text-[#696969]">The dish you are looking for might have been removed.</p>
        <Link
          href="/customer/menu"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#E23744] text-white text-xs font-bold rounded-xl"
        >
          Return to Menu
        </Link>
      </div>
    );
  }

  const isFav = favorites.includes(food.id);
  const isAvailable = food.isAvailable;

  const handleAddToCart = () => {
    if (!isAvailable) return;
    addToCart(food, quantity, specialInstructions.trim());
    setAddedToast(true);
    setTimeout(() => {
      setAddedToast(false);
    }, 2000);
  };

  const handleSafeBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push('/customer/menu');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-28 md:pb-12 space-y-6">
      {/* Top back bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={handleSafeBack}
          className="p-2 -ml-2 rounded-full text-[#696969] hover:text-[#1C1C1C] hover:bg-stone-100 flex items-center gap-1.5 transition text-xs font-bold"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Menu</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleFavorite(food.id)}
            className="p-2.5 rounded-full bg-white border border-[#E8E8E8] text-stone-600 hover:text-[#E23744] shadow-xs transition active:scale-95"
            aria-label="Favorite"
          >
            <Heart
              className={`w-5 h-5 transition ${
                isFav ? 'fill-[#E23744] text-[#E23744]' : 'text-stone-600'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Main Food Card */}
      <div className="bg-white rounded-3xl border border-[#E8E8E8] shadow-card overflow-hidden grid grid-cols-1 md:grid-cols-12">
        {/* Left: Large Food Image */}
        <div className="md:col-span-6 relative aspect-square sm:aspect-[4/3] md:aspect-auto min-h-[300px] md:min-h-[420px] bg-stone-100">
          <Image
            src={food.imageUrl || '/logo.png'}
            alt={food.name}
            fill
            unoptimized
            priority
            className="object-cover"
          />

          {/* Veg / Non-Veg Indicator */}
          <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-xs p-1.5 rounded-xl shadow-sm border border-stone-200/60">
            <div
              className={`w-4 h-4 border-2 flex items-center justify-center ${
                food.isVeg ? 'border-emerald-600' : 'border-rose-600'
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  food.isVeg ? 'bg-emerald-600' : 'bg-rose-600'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Right: Food Details & Customization */}
        <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                    food.isVeg
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}
                >
                  {food.isVeg ? 'Pure Veg' : 'Non-Veg'}
                </span>

                <span
                  className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 ${
                    isAvailable
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-stone-100 text-stone-500'
                  }`}
                >
                  {isAvailable ? (
                    <>
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Available
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3 h-3 text-stone-400" />
                      Sold Out
                    </>
                  )}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-[#1C1C1C] tracking-tight mt-2">
                {food.name}
              </h1>

              {food.tamilName && (
                <p className="text-sm font-semibold text-[#696969] mt-0.5">
                  {food.tamilName}
                </p>
              )}
            </div>

            <p className="text-sm text-[#696969] leading-relaxed">
              {food.description}
            </p>

            {/* Preparation time & rating */}
            <div className="flex items-center gap-4 py-2 border-y border-stone-100 text-xs">
              <div className="flex items-center gap-1.5 text-[#1C1C1C] font-bold">
                <Clock className="w-4 h-4 text-[#E23744]" />
                <span>Preparation: {food.preparationTime || '15 min'}</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                <Star className="w-4 h-4 fill-emerald-600 text-emerald-600" />
                <span>{food.rating || 4.8} rating ({food.ratingCount || 100}+ reviews)</span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-[#1C1C1C]">₹{food.price}</span>
              {food.originalPrice && food.originalPrice > food.price && (
                <span className="text-base text-[#696969] line-through">
                  ₹{food.originalPrice}
                </span>
              )}
            </div>

            {/* Special Instructions Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1C1C1C] flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-[#E23744]" />
                Special Instructions (Optional)
              </label>
              <input
                type="text"
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder='e.g. "Less spicy", "Extra gravy", "No onion"'
                className="w-full px-3.5 py-2 text-xs bg-[#F8F8F8] border border-[#E8E8E8] rounded-xl focus:bg-white focus:border-[#E23744] focus:outline-none transition"
                maxLength={100}
              />
            </div>
          </div>

          {/* Action Row: Quantity & Add to Cart */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              {/* Quantity selector */}
              <div className="flex items-center bg-[#F8F8F8] border border-[#E8E8E8] rounded-2xl p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1 || !isAvailable}
                  className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-white text-stone-700 disabled:opacity-30 transition"
                  aria-label="Decrease"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-black text-sm text-[#1C1C1C]">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={!isAvailable}
                  className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-white text-stone-700 disabled:opacity-30 transition"
                  aria-label="Increase"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add to Cart button */}
              <button
                onClick={handleAddToCart}
                disabled={!isAvailable}
                className="flex-1 py-3 px-6 rounded-2xl bg-[#E23744] hover:bg-[#B91C2B] disabled:bg-stone-300 text-white font-extrabold text-sm shadow-xs transition active:scale-95 flex items-center justify-center gap-2"
              >
                <span>Add to Cart · ₹{food.price * quantity}</span>
              </button>
            </div>

            {/* Added Toast */}
            <AnimatePresence>
              {addedToast && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold text-center flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Added to your cart!</span>
                  <Link href="/customer/cart" className="underline ml-1">
                    View Cart →
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
