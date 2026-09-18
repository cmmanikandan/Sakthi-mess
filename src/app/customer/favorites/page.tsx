'use client';

import React from 'react';
import Link from 'next/link';
import { useCanteen } from '@/context/CanteenContext';
import { FoodCard } from '@/components/customer/FoodCard';
import { Heart, ArrowRight } from 'lucide-react';

export default function CustomerFavoritesPage() {
  const { foods, favorites } = useCanteen();

  const favoriteFoods = foods.filter((f) => favorites.includes(f.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#1C1C1C] tracking-tight flex items-center gap-2">
          <span>Favorites</span>
          <Heart className="w-6 h-6 fill-[#E23744] text-[#E23744]" />
        </h1>
        <p className="text-xs sm:text-sm text-[#696969] mt-0.5">
          Your saved dishes for rapid one-tap ordering
        </p>
      </div>

      {favoriteFoods.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-[#E8E8E8] p-8 space-y-3">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-[#E23744] flex items-center justify-center mx-auto text-2xl">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="font-black text-base text-[#1C1C1C]">No favourites yet</h3>
          <p className="text-xs text-[#696969] max-w-xs mx-auto">
            Save dishes you love by tapping the heart icon on any dish card.
          </p>
          <div className="pt-1">
            <Link
              href="/customer/menu"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#E23744] hover:bg-[#B91C2B] text-white text-xs font-black rounded-xl shadow-xs transition"
            >
              <span>Explore Menu</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {favoriteFoods.map((food) => (
            <FoodCard key={food.id} food={food} />
          ))}
        </div>
      )}
    </div>
  );
}
