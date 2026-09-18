'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCanteen } from '@/context/CanteenContext';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import {
  ArrowRight,
  Search,
  Bike,
  Clock,
  Sparkles,
  Flame,
  ShieldCheck,
  Utensils,
  ShoppingBag,
  Star,
  CheckCircle2,
  ChefHat,
  Heart,
  ShoppingCart,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { BrandLogo } from '@/components/common/BrandLogo';
import { FoodCard } from '@/components/customer/FoodCard';

export default function LandingPage() {
  const router = useRouter();
  const { user, role, loginAs } = useAuth();
  const { foods, categories, activeMealInfo, restaurantConfig } = useCanteen();
  const { totalItems } = useCart();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/customer/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/customer/menu');
    }
  };

  // Popular items
  const popularFoods = useMemo(() => {
    return foods.filter((f) => f.isVisible && f.isPopular);
  }, [foods]);

  // Today's Specials
  const specials = useMemo(() => {
    return foods.filter((f) => f.isVisible && (f.isFeatured || f.rating >= 4.8));
  }, [foods]);

  // Filtered by selected category chip
  const filteredFoods = useMemo(() => {
    if (selectedCategory === 'all') return foods.filter((f) => f.isVisible);
    return foods.filter((f) => {
      if (!f.isVisible) return false;
      return f.category === selectedCategory || f.availableMeals.includes(selectedCategory as any);
    });
  }, [foods, selectedCategory]);

  return (
    <div className="min-h-screen bg-white text-[#1C1C1C]">
      {/* 1. Header Navigation */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E8E8E8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[74px] flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center group">
            <BrandLogo size="md" />
          </Link>

          {/* Quick Search on Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <Search className="w-4 h-4 text-[#696969] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search 'Biryani', 'Dosa', 'Parotta'..."
                className="w-full pl-10 pr-4 py-2 text-xs bg-[#F8F8F8] border border-[#E8E8E8] rounded-2xl focus:bg-white focus:border-[#E23744] focus:outline-none transition"
              />
            </form>
          </div>

          {/* Nav Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/customer/menu"
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-[#696969] hover:text-[#1C1C1C] hover:bg-stone-50 transition"
            >
              Menu
            </Link>

            <Link
              href="/customer/orders"
              className="hidden sm:inline-flex px-3.5 py-2 rounded-xl text-xs font-bold text-[#696969] hover:text-[#1C1C1C] hover:bg-stone-50 transition"
            >
              Orders
            </Link>

            <Link
              href="/customer/cart"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#FFF1F2] hover:bg-rose-100 text-[#E23744] font-bold text-xs transition active:scale-95"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              {totalItems > 0 && (
                <span className="bg-[#E23744] text-white text-[10px] font-black px-1.5 py-0.2 rounded-full">
                  {totalItems}
                </span>
              )}
            </Link>

            <Link
              href="/customer/menu"
              className="px-4 py-2 rounded-2xl bg-[#E23744] hover:bg-[#B91C2B] text-white font-extrabold text-xs shadow-xs transition active:scale-95"
            >
              Order Now
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Main Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FFF1F2]/50 via-white to-white pt-8 pb-12 sm:pt-14 sm:pb-16 border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-rose-200 text-[#E23744] shadow-xs text-xs font-extrabold">
                <Bike className="w-3.5 h-3.5 text-[#2E9B5B]" />
                <span>Doorstep Delivery in {restaurantConfig.estimatedDeliveryTimeRange} · Hot & Fresh</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#1C1C1C] tracking-tight leading-[1.1]">
                GOOD FOOD. <br />
                <span className="text-[#E23744]">DELIVERED TO YOU.</span>
              </h1>

              <p className="text-sm sm:text-base text-[#696969] max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed">
                Order your favourite traditional meals, biryanis, and tiffin specials from{' '}
                <strong className="text-[#1C1C1C]">SAKTHI MESS</strong> and receive them hot at your
                doorstep.
              </p>

              {/* Search Bar in Hero */}
              <form
                onSubmit={handleSearchSubmit}
                className="max-w-xl mx-auto lg:mx-0 flex items-center bg-white p-2 rounded-3xl border border-[#E8E8E8] shadow-card focus-within:border-[#E23744] focus-within:ring-2 focus-within:ring-rose-100 transition"
              >
                <div className="pl-3 pr-2 text-[#696969]">
                  <Search className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for dishes, meals or categories (e.g. 'Biryani', 'Dosa')"
                  className="flex-1 py-2 text-xs sm:text-sm text-[#1C1C1C] bg-transparent focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-2xl bg-[#E23744] hover:bg-[#B91C2B] text-white font-extrabold text-xs sm:text-sm shadow-xs transition shrink-0"
                >
                  Search
                </button>
              </form>

              {/* Suggested Quick Tags */}
              <div className="flex items-center justify-center lg:justify-start gap-2 flex-wrap text-xs text-[#696969] pt-1">
                <span className="font-bold">Popular:</span>
                {['Biryani', 'Bun Parotta', 'Chicken Chukka', 'Meals', 'Ghee Roast'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => router.push(`/customer/search?q=${encodeURIComponent(tag)}`)}
                    className="px-2.5 py-1 rounded-xl bg-stone-100 hover:bg-stone-200 text-[#1C1C1C] font-semibold text-xs transition"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Right Hero Visual */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-72 h-72 sm:w-96 sm:h-96 rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-neutral-900 group">
                <Image
                  src="/land-image-1.png"
                  alt="SAKTHI MESS Signature Dish"
                  fill
                  priority
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-5 text-white">
                  <p className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    Mess Signature Feast
                  </p>
                  <p className="text-lg font-black mt-0.5">Authentic South Indian Taste</p>
                  <p className="text-xs text-neutral-300">Prepared hot & fresh with authentic village spices</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Popular Categories Section */}
      <section className="py-10 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#1C1C1C] tracking-tight">
              Popular Categories
            </h2>
            <p className="text-xs text-[#696969] mt-0.5">Explore our wide variety of mess dishes</p>
          </div>
          <Link
            href="/customer/menu"
            className="text-xs font-bold text-[#E23744] hover:underline inline-flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Categories Grid / Horizontal Scroll */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-11 gap-3">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center gap-1.5 ${
              selectedCategory === 'all'
                ? 'bg-[#E23744] text-white border-[#E23744] shadow-xs'
                : 'bg-[#F8F8F8] border-[#E8E8E8] text-[#1C1C1C] hover:bg-stone-100'
            }`}
          >
            <span className="text-2xl">🍽️</span>
            <span className="text-[11px] font-black">All</span>
          </button>

          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#E23744] text-white border-[#E23744] shadow-xs'
                    : 'bg-[#F8F8F8] border-[#E8E8E8] text-[#1C1C1C] hover:bg-stone-100'
                }`}
              >
                <span className="text-2xl">{cat.icon}</span>
                <span className="text-[11px] font-black truncate max-w-[70px]">{cat.name}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 4. Popular Near You / Filtered Menu */}
      <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#1C1C1C] tracking-tight flex items-center gap-2">
              <Flame className="w-5 h-5 text-[#E23744]" />
              Popular Near You
            </h2>
            <p className="text-xs text-[#696969] mt-0.5">Most loved dishes ordered for doorstep delivery</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {filteredFoods.slice(0, 8).map((food) => (
            <FoodCard key={food.id} food={food} />
          ))}
        </div>
      </section>

      {/* 5. Today's Specials */}
      {specials.length > 0 && (
        <section className="py-10 bg-[#F8F8F8] border-y border-[#E8E8E8]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-[#1C1C1C] tracking-tight flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  Today's Specials
                </h2>
                <p className="text-xs text-[#696969] mt-0.5">Chef recommended signature dishes</p>
              </div>
              <Link
                href="/customer/menu"
                className="text-xs font-bold text-[#E23744] hover:underline inline-flex items-center gap-1"
              >
                <span>Full Menu</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {specials.slice(0, 3).map((food) => (
                <FoodCard key={food.id} food={food} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. Why SAKTHI MESS? */}
      <section className="py-14 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-black text-[#1C1C1C] tracking-tight">
            Why SAKTHI MESS?
          </h2>
          <p className="text-xs sm:text-sm text-[#696969] mt-1">
            Experience authentic South Indian flavours with modern online convenience
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              icon: Clock,
              title: 'Fast Preparation',
              desc: 'Hot meals cooked fresh to order in 15–20 minutes without delays.',
              color: 'text-amber-600 bg-amber-50',
            },
            {
              icon: Sparkles,
              title: 'Fresh Food',
              desc: 'Traditional home-ground masalas and authentic recipes served hot.',
              color: 'text-emerald-600 bg-emerald-50',
            },
            {
              icon: Utensils,
              title: 'Easy Ordering',
              desc: 'Browse, customize instructions, pay securely, and track live.',
              color: 'text-blue-600 bg-blue-50',
            },
            {
              icon: Bike,
              title: 'Doorstep Delivery',
              desc: 'Dedicated delivery staff bringing warm food directly to your address.',
              color: 'text-[#E23744] bg-[#FFF1F2]',
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white p-6 rounded-3xl border border-[#E8E8E8] shadow-xs hover:shadow-card-hover transition space-y-3"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${item.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-black text-[#1C1C1C]">{item.title}</h3>
                <p className="text-xs text-[#696969] leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. Footer */}
      <footer className="bg-[#1C1C1C] text-white py-12 border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-stone-800">
            <BrandLogo size="lg" variant="white" />
            <div className="flex items-center gap-4 text-xs text-stone-400 flex-wrap justify-center">
              <Link href="/customer/menu" className="hover:text-white transition">
                Menu
              </Link>
              <Link href="/customer/orders" className="hover:text-white transition">
                Order Tracking
              </Link>
              <Link href="/privacy" className="hover:text-white transition">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-white transition">
                Terms of Service
              </Link>
            </div>
          </div>
          <div className="pt-6 text-center text-xs text-stone-500">
            © {new Date().getFullYear()} SAKTHI MESS. Online Food Ordering & Doorstep Delivery. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
