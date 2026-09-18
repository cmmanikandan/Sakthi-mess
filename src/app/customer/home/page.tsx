'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCanteen } from '@/context/CanteenContext';
import { MealCategory } from '@/types';
import { getGreeting } from '@/lib/utils';
import { ActiveMealBanner } from '@/components/customer/ActiveMealBanner';
import { MealCategoryPills } from '@/components/customer/MealCategoryPills';
import { FoodCard } from '@/components/customer/FoodCard';
import { Search, Flame, Sparkles, Clock, ArrowRight } from 'lucide-react';

export default function CustomerHomePage() {
  const router = useRouter();
  const { user, isLoaded } = useAuth();
  const { foods, activeMealInfo, effectiveTime, orders } = useCanteen();

  const [selectedCategory, setSelectedCategory] = useState<MealCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const greeting = useMemo(() => {
    return getGreeting(effectiveTime.getHours());
  }, [effectiveTime]);

  const firstName = user?.name ? user.name.split(' ')[0] : 'Customer';

  // Visible foods only
  const visibleFoods = useMemo(() => {
    return foods.filter((f) => f.isVisible);
  }, [foods]);

  // Filtered by selected category
  const filteredFoods = useMemo(() => {
    if (selectedCategory === 'all') return visibleFoods;
    return visibleFoods.filter((f) => {
      const meals = Array.isArray(f.availableMeals) && f.availableMeals.length > 0
        ? f.availableMeals
        : [f.category];
      return f.category === selectedCategory || meals.includes(selectedCategory);
    });
  }, [visibleFoods, selectedCategory]);

  // Popular items
  const popularFoods = useMemo(() => {
    return visibleFoods.filter((f) => f.isPopular);
  }, [visibleFoods]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/customer/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 space-y-6 sm:space-y-8">
      {/* 1. Greeting & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#E23744] uppercase tracking-wider">
            {greeting} 👋
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1C1C1C] tracking-tight">
            Hungry, {firstName}?
          </h1>
          <p className="text-xs sm:text-sm text-[#696969] mt-0.5">
            Order fresh meals from SAKTHI MESS delivered to your doorstep
          </p>
        </div>

        {/* Search bar */}
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#696969] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search dishes or meals..."
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-[#F8F8F8] border border-[#E8E8E8] rounded-2xl focus:bg-white focus:border-[#E23744] focus:outline-none transition shadow-2xs"
          />
        </form>
      </div>

      {/* 2. Active Meal Banner */}
      <ActiveMealBanner />

      {/* 3. Category Pills */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xs font-black uppercase tracking-wider text-[#696969]">
            Categories
          </h2>
          <Link
            href="/customer/menu"
            className="text-xs font-bold text-[#E23744] hover:underline"
          >
            See all
          </Link>
        </div>
        <MealCategoryPills
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </div>

      {/* 4. Filtered Dishes Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-black text-[#1C1C1C] tracking-tight flex items-center gap-2">
            <Flame className="w-5 h-5 text-[#E23744]" />
            {selectedCategory === 'all' ? 'Popular Dishes' : `${selectedCategory.toUpperCase()} Menu`}
          </h2>
          <span className="text-xs font-semibold text-[#696969]">
            {filteredFoods.length} items
          </span>
        </div>

        {filteredFoods.length === 0 ? (
          <div className="text-center py-16 bg-[#F8F8F8] rounded-3xl border border-[#E8E8E8] p-8 space-y-2">
            <p className="text-base font-bold text-[#1C1C1C]">No items found</p>
            <p className="text-xs text-[#696969]">Try selecting another category or clear search</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {filteredFoods.map((food) => (
              <FoodCard key={food.id} food={food} />
            ))}
          </div>
        )}
      </div>

      {/* 5. Most Ordered / Recommended */}
      {popularFoods.length > 0 && selectedCategory !== 'all' && (
        <div className="pt-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-black text-[#1C1C1C] tracking-tight flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              Most Ordered at SAKTHI MESS
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {popularFoods.slice(0, 4).map((food) => (
              <FoodCard key={food.id} food={food} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
