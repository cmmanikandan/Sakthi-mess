'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCanteen } from '@/context/CanteenContext';
import { FoodCard } from '@/components/customer/FoodCard';
import { Search, X, TrendingUp } from 'lucide-react';

function CustomerSearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams?.get('q') || '';

  const { foods } = useCanteen();
  const [query, setQuery] = useState(initialQuery);

  const trendingTags = [
    'Biryani',
    'Bun Parotta',
    'Chicken Chukka',
    'Meals',
    'Ghee Roast',
    'Filter Coffee',
    'Rose Milk',
  ];

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return foods.filter(
      (f) =>
        f.isVisible &&
        (f.name.toLowerCase().includes(q) ||
          f.description.toLowerCase().includes(q) ||
          (f.tamilName && f.tamilName.includes(q)) ||
          f.ingredients?.some((ing) => ing.toLowerCase().includes(q)))
    );
  }, [foods, query]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[#1C1C1C] tracking-tight">
          Search Dishes
        </h1>
        <p className="text-xs sm:text-sm text-[#696969] mt-0.5">
          Find delicious meals, biryanis, and traditional snacks at SAKTHI MESS
        </p>
      </div>

      {/* Input */}
      <div className="relative">
        <Search className="w-5 h-5 text-[#696969] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type dish name, e.g. Biryani, Parotta, Dosa, Chicken..."
          className="w-full pl-12 pr-10 py-3.5 bg-white border border-[#E8E8E8] rounded-2xl text-sm sm:text-base text-[#1C1C1C] placeholder:text-[#696969] focus:outline-none focus:border-[#E23744] shadow-xs"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Trending Searches */}
      {!query && (
        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#696969] uppercase tracking-wider">
            <TrendingUp className="w-4 h-4 text-[#E23744]" />
            <span>Popular SAKTHI MESS Searches</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {trendingTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setQuery(tag)}
                className="px-3.5 py-2 bg-white border border-[#E8E8E8] hover:border-[#E23744] hover:text-[#E23744] rounded-xl text-xs font-bold text-[#1C1C1C] shadow-2xs transition active:scale-95"
              >
                {tag}
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-stone-100">
            <h3 className="text-sm font-black text-[#1C1C1C] mb-3">All Popular Dishes</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
              {foods
                .filter((f) => f.isVisible && f.isPopular)
                .slice(0, 4)
                .map((food) => (
                  <FoodCard key={food.id} food={food} />
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {query && (
        <div className="space-y-4">
          <p className="text-xs text-[#696969]">
            Found <strong className="text-[#1C1C1C]">{results.length}</strong> results for &ldquo;{query}&rdquo;
          </p>

          {results.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-[#E8E8E8] p-8 space-y-3">
              <p className="text-3xl">🔍</p>
              <h3 className="font-black text-base text-[#1C1C1C]">No dishes matched</h3>
              <p className="text-xs text-[#696969]">Try searching for &lsquo;Biryani&rsquo;, &lsquo;Parotta&rsquo;, or &lsquo;Meals&rsquo;</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
              {results.map((food) => (
                <FoodCard key={food.id} food={food} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function CustomerSearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[50vh] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-[#E23744] border-t-transparent animate-spin" />
        </div>
      }
    >
      <CustomerSearchContent />
    </Suspense>
  );
}
