'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCanteen } from '@/context/CanteenContext';
import { useCart } from '@/context/CartContext';
import {
  Bell,
  Heart,
  ShoppingBag,
  Search,
  Home,
  UtensilsCrossed,
  ShoppingCart,
  ShieldCheck,
  ChefHat,
  Bike,
} from 'lucide-react';
import { BrandLogo } from '@/components/common/BrandLogo';

export function TopNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, role, loginAs } = useAuth();
  const { notifications, favorites, restaurantConfig } = useCanteen();
  const { totalItems, subtotal } = useCart();

  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const unreadNotifs = notifications.filter((n) => !n.read).length;

  const navLinks = [
    { href: '/customer/home', label: 'Home', icon: Home },
    { href: '/customer/menu', label: 'Menu', icon: UtensilsCrossed },
    { href: '/customer/search', label: 'Search', icon: Search },
    { href: '/customer/orders', label: 'Orders', icon: ShoppingBag },
    { href: '/customer/favorites', label: 'Favorites', icon: Heart },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E8E8E8] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[72px] md:h-[78px] flex items-center justify-between gap-3">
        {/* Logo & Brand Name & Store Status Badge */}
        <div className="flex items-center gap-2">
          <Link
            href="/customer/home"
            className="flex items-center py-1 group focus:outline-none rounded-xl transition-transform hover:scale-[1.01]"
            aria-label="SAKTHI MESS Customer Home"
          >
            <BrandLogo size="md" />
          </Link>
          {restaurantConfig?.isOpen ? (
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Open</span>
            </span>
          ) : (
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              <span>Closed</span>
            </span>
          )}
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1.5">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                  isActive
                    ? 'bg-[#E23744] text-white shadow-xs'
                    : 'text-[#696969] hover:text-[#1C1C1C] hover:bg-stone-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
                {link.href === '/customer/favorites' && favorites.length > 0 && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      isActive ? 'bg-white text-[#E23744]' : 'bg-rose-100 text-[#E23744]'
                    }`}
                  >
                    {favorites.length}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions: Quick Portals, Cart, Notifications & Profile */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Quick Staff Portals for Pair Testing */}
          <div className="hidden lg:flex items-center gap-1 border-r border-stone-200 pr-2 mr-1">
            <button
              onClick={() => {
                loginAs('kitchen_staff');
                router.push('/kitchen/dashboard');
              }}
              className="px-2.5 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-[#1C1C1C] text-[11px] font-bold inline-flex items-center gap-1 transition"
              title="Switch to Kitchen Staff Console"
            >
              <ChefHat className="w-3.5 h-3.5 text-[#E23744]" />
              <span>Kitchen</span>
            </button>
            <button
              onClick={() => {
                loginAs('delivery_staff');
                router.push('/delivery/dashboard');
              }}
              className="px-2.5 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-[#1C1C1C] text-[11px] font-bold inline-flex items-center gap-1 transition"
              title="Switch to Delivery Staff Console"
            >
              <Bike className="w-3.5 h-3.5 text-[#2E9B5B]" />
              <span>Delivery</span>
            </button>
            <button
              onClick={() => {
                loginAs('admin');
                router.push('/admin/dashboard');
              }}
              className="px-2.5 py-1.5 rounded-lg bg-stone-900 hover:bg-black text-white text-[11px] font-bold inline-flex items-center gap-1 transition"
              title="Open SAKTHI MESS Admin Panel"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Admin</span>
            </button>
          </div>

          {/* Cart CTA Button */}
          <Link
            href="/customer/cart"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#FFF1F2] hover:bg-rose-100 border border-rose-200 text-[#E23744] font-bold text-xs transition shadow-2xs active:scale-95"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="hidden sm:inline">Cart</span>
            {totalItems > 0 && (
              <span className="bg-[#E23744] text-white text-[11px] font-black px-1.5 py-0.2 rounded-full min-w-[20px] text-center">
                {totalItems}
              </span>
            )}
          </Link>

          {/* Notifications */}
          <Link
            href="/customer/notifications"
            className="relative p-2 rounded-xl text-[#696969] hover:text-[#1C1C1C] hover:bg-stone-100 transition"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
            {unreadNotifs > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#E23744] rounded-full ring-2 ring-white" />
            )}
          </Link>

          {/* Profile link */}
          <Link
            href="/customer/profile"
            className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-[#E23744]/30 transition"
          >
            <div className="w-8 h-8 rounded-full bg-rose-100 text-[#E23744] font-black text-xs flex items-center justify-center border border-rose-200">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
