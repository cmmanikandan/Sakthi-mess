'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Receipt,
  Utensils,
  ShoppingBag,
  BarChart3,
  Users,
  UserCheck,
  FolderTree,
  Settings,
  LogOut,
  ChevronRight,
  Menu,
  X,
  ChefHat,
  Bike,
} from 'lucide-react';
import { BrandLogo } from '@/components/common/BrandLogo';
import { useAuth } from '@/context/AuthContext';

const NAV_LINKS = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/orders', label: 'Orders Feed', icon: ShoppingBag },
  { href: '/admin/menu', label: 'Food Menu', icon: Utensils },
  { href: '/admin/categories', label: 'Categories', icon: FolderTree },
  { href: '/admin/customers', label: 'Customers', icon: Users },
  { href: '/admin/staff', label: 'Staff Management', icon: UserCheck },
  { href: '/admin/pos', label: 'Quick Counter POS', icon: Receipt },
  { href: '/admin/reports', label: 'Reports & Analytics', icon: BarChart3 },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loginAs, logout } = useAuth();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const SidebarInner = ({ mobile = false }: { mobile?: boolean }) => {
    const isExpanded = !collapsed || mobile;
    return (
      <div className="flex flex-col h-full bg-[#1C1C1C] text-white">
        {/* Brand row */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-stone-800 shrink-0">
          {isExpanded ? (
            <Link href="/admin/dashboard" className="flex items-center gap-2">
              <BrandLogo size="sm" variant="white" />
              <span className="bg-[#E23744] text-white text-[10px] font-black uppercase px-2 py-0.5 rounded">
                Admin
              </span>
            </Link>
          ) : (
            <Link
              href="/admin/dashboard"
              className="mx-auto block relative w-8 h-8 rounded-full overflow-hidden hover:opacity-90 transition"
              title="SAKTHI MESS Admin"
            >
              <Image
                src="/logo-icon.png"
                alt="SAKTHI MESS"
                fill
                className="object-contain"
                priority
              />
            </Link>
          )}
          {mobile && (
            <button
              onClick={() => setMobileOpen(false)}
              className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition"
              title="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Nav Links */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {NAV_LINKS.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || pathname.startsWith(href + '/');
            return (
              <Link
                key={href}
                href={href}
                onClick={() => mobile && setMobileOpen(false)}
                title={!isExpanded ? label : undefined}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs font-black transition ${
                  isActive
                    ? 'bg-[#E23744] text-white shadow-xs'
                    : 'text-stone-300 hover:bg-stone-800 hover:text-white'
                } ${!isExpanded ? 'justify-center !px-2' : ''}`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {isExpanded && <span className="flex-1 truncate">{label}</span>}
                {isExpanded && isActive && <ChevronRight className="w-3.5 h-3.5 opacity-80" />}
              </Link>
            );
          })}
        </nav>

        {/* Console Switchers for Pairing */}
        {isExpanded && (
          <div className="p-3 border-t border-stone-800 space-y-1.5 text-[11px]">
            <p className="text-[10px] uppercase font-bold text-stone-400 px-2">Role Switch</p>
            <button
              onClick={() => {
                loginAs('kitchen_staff');
                router.push('/kitchen/dashboard');
              }}
              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 transition font-bold"
            >
              <ChefHat className="w-3.5 h-3.5 text-[#E23744]" />
              <span>Kitchen Console</span>
            </button>
            <button
              onClick={() => {
                loginAs('delivery_staff');
                router.push('/delivery/dashboard');
              }}
              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 transition font-bold"
            >
              <Bike className="w-3.5 h-3.5 text-[#2E9B5B]" />
              <span>Delivery Console</span>
            </button>
          </div>
        )}

        {/* Bottom User & Logout */}
        <div className="p-3 border-t border-stone-800 shrink-0">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-400 hover:bg-rose-950/40 text-xs font-bold transition ${
              !isExpanded ? 'justify-center !px-2' : ''
            }`}
          >
            <LogOut className="w-4 h-4" />
            {isExpanded && <span>Sign Out</span>}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8] flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <header className="md:hidden bg-[#1C1C1C] text-white px-4 py-3 flex items-center justify-between border-b border-stone-800 sticky top-0 z-40">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-xl bg-stone-800 text-white"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        <BrandLogo size="sm" variant="white" />
        <span className="bg-[#E23744] text-white text-[10px] font-black uppercase px-2 py-0.5 rounded">
          Admin
        </span>
      </header>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-black/70 backdrop-blur-xs flex">
          <div className="w-72 h-full">
            <SidebarInner mobile />
          </div>
          <div className="flex-1" onClick={() => setMobileOpen(false)} />
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 border-r border-stone-800 sticky top-0 h-screen">
        <SidebarInner />
      </aside>

      {/* Main Admin Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
