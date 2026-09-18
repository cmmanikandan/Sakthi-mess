'use client';

import React, { useState, useMemo } from 'react';
import { useCanteen } from '@/context/CanteenContext';
import { MealCategory } from '@/types';
import { FoodCard } from '@/components/customer/FoodCard';
import { MealCategoryPills } from '@/components/customer/MealCategoryPills';
import { Search } from 'lucide-react';

export default function CustomerMenuPage() {
  const { foods, activeMealInfo } = useCanteen();

  const [selectedCategory, setSelectedCategory] = useState<MealCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [vegOnly, setVegOnly] = useState(false);
  const [availableOnly, setAvailableOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'rating'>('default');

  const filteredFoods = useMemo(() => {
    return foods
      .filter((food) => {
        if (!food.isVisible) return false;
        const meals = Array.isArray(food.availableMeals) && food.availableMeals.length > 0
          ? food.availableMeals
          : [food.category];
        const matchCat =
          selectedCategory === 'all' ||
          food.category === selectedCategory ||
          meals.includes(selectedCategory);
        if (!matchCat) return false;
        if (vegOnly && !food.isVeg) return false;
        if (availableOnly && !food.isAvailable) return false;
        if (
          searchQuery &&
          !food.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !food.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !(food.tamilName || '').toLowerCase().includes(searchQuery.toLowerCase())
        ) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return 0;
      });
  }, [foods, selectedCategory, vegOnly, availableOnly, searchQuery, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 space-y-6">
      {/* Header & Now Serving Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1C1C1C] tracking-tight">
            SAKTHI MESS Menu
          </h1>
          <p className="text-xs sm:text-sm text-[#696969] mt-0.5">
            Fresh traditional mess dishes prepared hot and delivered to your doorstep
          </p>
        </div>

        {/* Current serving indicator */}
        <button
          onClick={() => setSelectedCategory(activeMealInfo.category)}
          className="self-start sm:self-auto bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3.5 py-1.5 rounded-2xl flex items-center gap-2 text-xs font-bold text-[#E23744] transition active:scale-95"
          title={`Show ${activeMealInfo.name} menu`}
        >
          <span>{activeMealInfo.icon}</span>
          <span>Now Serving: <strong>{activeMealInfo.name}</strong></span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#696969] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by dish name (e.g. Biryani, Dosa, Parotta)..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E8E8E8] rounded-2xl text-xs sm:text-sm text-[#1C1C1C] placeholder:text-[#696969] focus:outline-none focus:border-[#E23744] shadow-2xs"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {/* Veg Only Toggle */}
            <button
              onClick={() => setVegOnly(!vegOnly)}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition border shrink-0 ${
                vegOnly
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-white text-[#1C1C1C] border-[#E8E8E8] hover:bg-stone-50'
              }`}
            >
              <div className="w-2.5 h-2.5 rounded-xs border border-current flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-current" />
              </div>
              <span>Pure Veg</span>
            </button>

            {/* Available Only */}
            <button
              onClick={() => setAvailableOnly(!availableOnly)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition border shrink-0 ${
                availableOnly
                  ? 'bg-[#E23744] text-white border-[#E23744]'
                  : 'bg-white text-[#1C1C1C] border-[#E8E8E8] hover:bg-stone-50'
              }`}
            >
              Available Only
            </button>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 bg-white border border-[#E8E8E8] rounded-xl text-xs font-bold text-[#1C1C1C] focus:outline-none focus:border-[#E23744] shrink-0"
            >
              <option value="default">Default Sorting</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        {/* Meal Category Horizontal Pills */}
        <MealCategoryPills
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </div>

      {/* Food Items Grid */}
      <div>
        <div className="mb-3 flex items-center justify-between text-xs text-[#696969]">
          <span>
            Showing <strong className="text-[#1C1C1C]">{filteredFoods.length}</strong> delicious dishes
          </span>
        </div>

        {filteredFoods.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-[#E8E8E8] p-8 space-y-3">
            <p className="text-4xl">🍽️</p>
            <h3 className="font-bold text-base text-[#1C1C1C]">No dishes found</h3>
            <p className="text-xs text-[#696969] max-w-sm mx-auto">
              Try adjusting your search query, clearing filters, or checking another category.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setVegOnly(false);
                setAvailableOnly(false);
                setSelectedCategory('all');
              }}
              className="px-4 py-2 bg-[#E23744] text-white text-xs font-bold rounded-xl"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {filteredFoods.map((food) => (
              <FoodCard key={food.id} food={food} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
