'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FoodItem } from '@/types';
import { useCart } from '@/context/CartContext';
import { useCanteen } from '@/context/CanteenContext';
import { useAuth } from '@/context/AuthContext';
import { Star, Plus, Minus, Heart, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface FoodCardProps {
  food: FoodItem;
}

export function FoodCard({ food }: FoodCardProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { addToCart, updateQuantity, getItemQuantity } = useCart();
  const { favorites, toggleFavorite } = useCanteen();

  const quantity = getItemQuantity(food.id);
  const isFav = favorites.includes(food.id);
  const isSoldOut = !food.isAvailable;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isSoldOut) return;
    addToCart(food, 1);
  };

  const handleMinus = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    updateQuantity(food.id, quantity - 1);
  };

  const handlePlus = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isSoldOut) return;
    updateQuantity(food.id, quantity + 1);
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(food.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.25 }}
      className={`group relative rounded-3xl p-3 sm:p-3.5 border transition-all flex flex-col justify-between ${
        isSoldOut
          ? 'bg-stone-50 border-stone-200 opacity-80'
          : 'bg-white border-[#E8E8E8] shadow-xs hover:shadow-card-hover hover:border-stone-300'
      }`}
    >
      <Link href={`/customer/food/${food.id}`} className="block">
        {/* Food Image Container */}
        <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-stone-100 mb-3">
          <Image
            src={food.imageUrl || '/logo.png'}
            alt={food.name}
            fill
            unoptimized
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={`object-cover transition-transform duration-300 ${
              isSoldOut ? 'grayscale contrast-75' : 'group-hover:scale-105'
            }`}
          />

          {/* Sold Out Overlay */}
          {isSoldOut && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center text-center p-2">
              <span className="text-white text-xs font-black tracking-wider uppercase bg-stone-900/90 px-3 py-1 rounded-full border border-white/20">
                SOLD OUT
              </span>
            </div>
          )}

          {/* Veg / Non-Veg Indicator */}
          <div className="absolute top-2.5 left-2.5 z-10 bg-white/95 backdrop-blur-xs p-1 rounded-lg shadow-sm border border-stone-200/60">
            <div
              className={`w-3.5 h-3.5 border-2 flex items-center justify-center ${
                food.isVeg ? 'border-emerald-600' : 'border-rose-600'
              }`}
            >
              <div
                className={`w-1.5 h-1.5 rounded-full ${
                  food.isVeg ? 'bg-emerald-600' : 'bg-rose-600'
                }`}
              />
            </div>
          </div>

          {/* Favorite button */}
          <button
            onClick={handleFavorite}
            aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
            className="absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-white/95 backdrop-blur-xs flex items-center justify-center text-stone-600 hover:text-[#E23744] shadow-sm border border-stone-200/60 transition active:scale-90"
          >
            <Heart
              className={`w-4 h-4 transition ${
                isFav ? 'fill-[#E23744] text-[#E23744]' : 'text-stone-600'
              }`}
            />
          </button>

          {/* Preparation time badge */}
          {food.preparationTime && (
            <div className="absolute bottom-2 left-2 z-10 inline-flex items-center gap-1 bg-black/75 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              <Clock className="w-3 h-3 text-amber-400" />
              <span>{food.preparationTime}</span>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-1">
          <div className="flex items-start justify-between gap-1.5">
            <h3 className="text-sm font-black text-[#1C1C1C] leading-snug line-clamp-1 group-hover:text-[#E23744] transition">
              {food.name}
            </h3>
          </div>

          {food.tamilName && (
            <p className="text-[11px] font-semibold text-[#696969] leading-tight">
              {food.tamilName}
            </p>
          )}

          <p className="text-xs text-[#696969] line-clamp-2 leading-relaxed">
            {food.description}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-1 pt-0.5">
            <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-extrabold border border-emerald-200/60">
              <Star className="w-2.5 h-2.5 fill-emerald-600 text-emerald-600" />
              <span>{food.rating || 4.8}</span>
            </div>
            <span className="text-[10px] text-stone-400 font-medium">
              ({food.ratingCount || 100}+)
            </span>
          </div>
        </div>
      </Link>

      {/* Price & Add Action Button */}
      <div className="flex items-center justify-between pt-3 mt-2 border-t border-stone-100">
        <div>
          <span className="text-base font-black text-[#1C1C1C]">₹{food.price}</span>
          {food.originalPrice && food.originalPrice > food.price && (
            <span className="text-xs text-[#696969] line-through ml-1.5">
              ₹{food.originalPrice}
            </span>
          )}
        </div>

        <div>
          {isSoldOut ? (
            <span className="text-[11px] font-extrabold text-stone-400 uppercase bg-stone-100 px-3 py-1.5 rounded-xl border border-stone-200">
              Unavailable
            </span>
          ) : quantity > 0 ? (
            <div className="flex items-center bg-[#FFF1F2] border border-rose-200 text-[#E23744] rounded-xl overflow-hidden shadow-xs">
              <button
                onClick={handleMinus}
                className="w-7 h-7 flex items-center justify-center hover:bg-[#E23744] hover:text-white transition active:scale-95"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-6 text-center text-xs font-black select-none">
                {quantity}
              </span>
              <button
                onClick={handlePlus}
                className="w-7 h-7 flex items-center justify-center hover:bg-[#E23744] hover:text-white transition active:scale-95"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleAdd}
              className="inline-flex items-center gap-1 px-3.5 py-1.5 bg-[#FFF1F2] hover:bg-[#E23744] text-[#E23744] hover:text-white border border-rose-200 hover:border-[#E23744] text-xs font-black rounded-xl transition shadow-xs active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
