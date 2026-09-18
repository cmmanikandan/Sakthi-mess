'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { BrandLogo } from '@/components/common/BrandLogo';

export default function SplashScreen() {
  const router = useRouter();
  const { user, isLoaded } = useAuth();

  useEffect(() => {
    if (!isLoaded) return;

    const timer = setTimeout(() => {
      if (user) {
        if (user.role === 'admin') router.replace('/admin/dashboard');
        else if (user.role === 'kitchen_staff') router.replace('/kitchen/dashboard');
        else if (user.role === 'delivery_staff') router.replace('/delivery/dashboard');
        else router.replace('/customer/home');
      } else {
        router.replace('/');
      }
    }, 900);

    return () => clearTimeout(timer);
  }, [router, user, isLoaded]);

  return (
    <div className="fixed inset-0 min-h-screen w-full flex flex-col items-center justify-center bg-[#FAF8F5]">
      <div className="flex flex-col items-center space-y-4 text-center px-4 animate-fadeIn">
        <BrandLogo size="xl" layout="vertical" />
        <div className="pt-2 flex items-center justify-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#E23744] animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-2 h-2 rounded-full bg-[#E23744] animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-2 h-2 rounded-full bg-[#E23744] animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}
