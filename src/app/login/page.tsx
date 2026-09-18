'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types';
import { Mail, Lock, ArrowRight, ArrowLeft, Phone, User, MapPin, ChefHat, Bike, Shield, Utensils, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrandLogo } from '@/components/common/BrandLogo';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams?.get('redirect') || null;

  const { user, isLoaded, login, signup, loginAs } = useAuth();

  React.useEffect(() => {
    if (isLoaded && user) {
      if (redirectUrl) {
        router.replace(redirectUrl);
      }
    }
  }, [isLoaded, user, redirectUrl, router]);

  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Login form state
  const [selectedRole, setSelectedRole] = useState<UserRole>('customer');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  // Registration state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [signupAddress, setSignupAddress] = useState('');
  const [signupCity, setSignupCity] = useState('Chennai');
  const [signupPincode, setSignupPincode] = useState('600001');

  // Splash / Redirect notification state
  const [showSplash, setShowSplash] = useState(false);
  const [splashText, setSplashText] = useState('Verifying credentials...');
  const [userNameForSplash, setUserNameForSplash] = useState('');

  const getRoleDestination = (role: UserRole): string => {
    switch (role) {
      case 'admin':
        return '/admin/dashboard';
      case 'kitchen_staff':
        return '/kitchen/dashboard';
      case 'delivery_staff':
        return '/delivery/dashboard';
      case 'customer':
      default:
        return '/customer/home';
    }
  };

  const triggerRedirect = (dest: string, displayName: string) => {
    const finalDest = redirectUrl || dest;
    setUserNameForSplash(displayName);
    setShowSplash(true);

    setTimeout(() => {
      setSplashText('Preparing your dashboard...');
    }, 400);

    setTimeout(() => {
      router.push(finalDest);
    }, 850);
  };

  // Handle standard login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password.trim()) {
      setLoginError('Please enter both email/phone and password.');
      return;
    }

    setLoading(true);
    setLoginError(null);

    const result = await login(selectedRole, identifier, password);
    setLoading(false);

    if (!result.success) {
      setLoginError(result.error || 'Invalid credentials. Please check and try again.');
      return;
    }

    const dest = getRoleDestination(result.user?.role || selectedRole);
    triggerRedirect(dest, result.user?.name || 'Customer');
  };

  // Handle registration
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupName.trim() || !signupEmail.trim() || !signupPassword.trim()) {
      setLoginError('Please fill in your name, email, and password.');
      return;
    }

    if (signupPassword.length < 6) {
      setLoginError('Password must be at least 6 characters long.');
      return;
    }

    if (signupPassword !== signupConfirmPassword) {
      setLoginError('Passwords do not match. Please verify.');
      return;
    }

    setLoading(true);
    setLoginError(null);

    const initialAddress = signupAddress.trim()
      ? {
          label: 'Home' as const,
          recipientName: signupName,
          phone: signupPhone || '+91 98765 43210',
          addressLine1: signupAddress,
          city: signupCity || 'Chennai',
          state: 'Tamil Nadu',
          pincode: signupPincode || '600001',
          isDefault: true,
        }
      : undefined;

    const result = await signup(
      'customer',
      signupEmail,
      signupPassword,
      signupName,
      signupPhone || '+91 98765 43210',
      initialAddress
    );
    setLoading(false);

    if (!result.success) {
      setLoginError(result.error || 'Registration failed. Please try again.');
      return;
    }

    triggerRedirect('/customer/home', signupName);
  };

  // Quick 1-tap demo logins
  const handleQuickLogin = (role: UserRole) => {
    setLoading(true);
    loginAs(role);
    setLoading(false);
    const dest = getRoleDestination(role);
    const names: Partial<Record<UserRole, string>> = {
      customer: 'Hari Prassath',
      kitchen_staff: 'Chef Murugan',
      delivery_staff: 'Karthik Raja',
      admin: 'Sakthi Administrator',
    };
    triggerRedirect(dest, names[role] || 'User');
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 bg-[#FAF8F5]">
      {/* Background Subtle Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-red-100/50 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-amber-100/50 blur-3xl" />
      </div>

      <main className="relative z-10 w-full max-w-[460px] my-auto flex flex-col items-center">
        {/* Back Link */}
        <div className="w-full mb-3 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-neutral-50 text-xs font-bold text-neutral-600 hover:text-neutral-900 shadow-xs border border-neutral-200/80 transition-all active:scale-95"
            aria-label="Back to Home"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#E23744]" />
            <span>Back to Home</span>
          </Link>
          {redirectUrl && (
            <span className="text-[11px] font-semibold text-[#E23744] bg-red-50 px-2.5 py-1 rounded-lg border border-red-200">
              Login required to continue
            </span>
          )}
        </div>

        {/* Card Container */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="w-full bg-white rounded-3xl p-6 sm:p-8 shadow-[0_12px_40px_-5px_rgba(28,28,28,0.08)] border border-neutral-200/80"
        >
          {/* Logo & Header */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="flex justify-center items-center mb-3">
              <BrandLogo size="lg" />
            </div>
            <h1 className="text-2xl font-black text-neutral-900 tracking-tight">
              {authMode === 'login' ? 'Welcome Back' : 'Create your account'}
            </h1>
            <p className="text-xs text-neutral-500 mt-1 max-w-xs">
              {authMode === 'login'
                ? 'Login to continue ordering from SAKTHI MESS.'
                : 'Order hot, authentic South Indian meals delivered to your doorstep.'}
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex bg-neutral-100 p-1 rounded-2xl mb-5 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setAuthMode('login');
                setLoginError(null);
              }}
              className={`flex-1 py-2 text-center rounded-xl transition ${
                authMode === 'login'
                  ? 'bg-white text-neutral-900 shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-800'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('signup');
                setLoginError(null);
              }}
              className={`flex-1 py-2 text-center rounded-xl transition ${
                authMode === 'signup'
                  ? 'bg-white text-neutral-900 shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-800'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Error Alert */}
          {loginError && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold px-3.5 py-2.5 rounded-xl flex items-start gap-2">
              <span className="text-red-500 text-sm leading-none mt-0.5">⚠</span>
              <span>{loginError}</span>
            </div>
          )}

          {/* Login Form */}
          {authMode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Role Indicator Select */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  Sign in as
                </label>
                <div className="grid grid-cols-4 gap-1.5 p-1 bg-neutral-50 border border-neutral-200 rounded-xl">
                  {(
                    [
                      { id: 'customer', label: 'Customer', icon: Utensils },
                      { id: 'kitchen_staff', label: 'Kitchen', icon: ChefHat },
                      { id: 'delivery_staff', label: 'Delivery', icon: Bike },
                      { id: 'admin', label: 'Admin', icon: Shield },
                    ] as const
                  ).map((r) => {
                    const Icon = r.icon;
                    const isActive = selectedRole === r.id;
                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setSelectedRole(r.id)}
                        className={`py-1.5 px-1 flex flex-col items-center gap-1 rounded-lg text-[10px] font-bold transition ${
                          isActive
                            ? 'bg-[#E23744] text-white shadow-xs'
                            : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{r.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Email / Phone
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={
                      selectedRole === 'customer'
                        ? 'customer@sakthimess.com'
                        : `${selectedRole.replace('_staff', '')}@sakthimess.com`
                    }
                    className="w-full pl-10 pr-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#E23744]/25 focus:border-[#E23744] focus:bg-white transition"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-neutral-700">
                    Password
                  </label>
                  <span className="text-[11px] text-[#E23744] font-medium hover:underline cursor-pointer">
                    Forgot password?
                  </span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#E23744]/25 focus:border-[#E23744] focus:bg-white transition"
                  />
                </div>
              </div>

              <div className="flex items-center text-xs pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer text-neutral-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-neutral-300 text-[#E23744] focus:ring-[#E23744]"
                  />
                  <span>Remember me</span>
                </label>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-[#E23744] hover:bg-[#B91C2B] active:scale-[0.99] text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-[0_4px_15px_rgba(226,55,68,0.3)] transition duration-150 disabled:opacity-75"
              >
                {loading ? (
                  <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                ) : (
                  <>
                    <span>LOGIN</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Registration Form */
            <form onSubmit={handleSignup} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    placeholder="Hari Prassath"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#E23744]/25 focus:border-[#E23744] focus:bg-white transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Email *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      required
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      placeholder="hari@example.com"
                      className="w-full pl-10 pr-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#E23744]/25 focus:border-[#E23744] focus:bg-white transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Phone *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input
                      type="tel"
                      required
                      value={signupPhone}
                      onChange={(e) => setSignupPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full pl-10 pr-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#E23744]/25 focus:border-[#E23744] focus:bg-white transition"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Password *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type="password"
                      required
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      placeholder="Min. 6 chars"
                      className="w-full pl-10 pr-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#E23744]/25 focus:border-[#E23744] focus:bg-white transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type="password"
                      required
                      value={signupConfirmPassword}
                      onChange={(e) => setSignupConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      className="w-full pl-10 pr-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#E23744]/25 focus:border-[#E23744] focus:bg-white transition"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Address Section */}
              <div className="pt-2 border-t border-neutral-100">
                <label className="block text-xs font-bold text-neutral-800 mb-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#E23744]" />
                  <span>Default Delivery Address (Optional)</span>
                </label>
                <input
                  type="text"
                  value={signupAddress}
                  onChange={(e) => setSignupAddress(e.target.value)}
                  placeholder="12, Gandhi Road, Near ABC School"
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#E23744]/25 focus:border-[#E23744] focus:bg-white transition mb-2"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={signupCity}
                    onChange={(e) => setSignupCity(e.target.value)}
                    placeholder="City (e.g. Chennai)"
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#E23744]/25 focus:border-[#E23744] focus:bg-white transition"
                  />
                  <input
                    type="text"
                    value={signupPincode}
                    onChange={(e) => setSignupPincode(e.target.value)}
                    placeholder="Pincode (e.g. 600001)"
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#E23744]/25 focus:border-[#E23744] focus:bg-white transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-[#E23744] hover:bg-[#B91C2B] active:scale-[0.99] text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-[0_4px_15px_rgba(226,55,68,0.3)] transition duration-150 disabled:opacity-75 mt-2"
              >
                {loading ? (
                  <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                ) : (
                  <>
                    <span>CREATE ACCOUNT</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Quick Demo Switcher */}
          <div className="mt-6 pt-5 border-t border-neutral-100">
            <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider text-center mb-2.5">
              1-Click Demo Login (Test Roles)
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('customer')}
                className="p-2.5 rounded-xl border border-neutral-200 hover:border-[#E23744] hover:bg-red-50/40 text-left transition flex items-center gap-2 text-xs font-semibold text-neutral-800"
              >
                <div className="w-7 h-7 rounded-lg bg-red-100 text-[#E23744] flex items-center justify-center shrink-0">
                  <Utensils className="w-3.5 h-3.5" />
                </div>
                <div className="truncate">
                  <p className="leading-tight">Customer</p>
                  <p className="text-[10px] text-neutral-400 font-normal truncate">Hari Prassath</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('kitchen_staff')}
                className="p-2.5 rounded-xl border border-neutral-200 hover:border-[#E23744] hover:bg-red-50/40 text-left transition flex items-center gap-2 text-xs font-semibold text-neutral-800"
              >
                <div className="w-7 h-7 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                  <ChefHat className="w-3.5 h-3.5" />
                </div>
                <div className="truncate">
                  <p className="leading-tight">Kitchen Staff</p>
                  <p className="text-[10px] text-neutral-400 font-normal truncate">Chef Murugan</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('delivery_staff')}
                className="p-2.5 rounded-xl border border-neutral-200 hover:border-[#E23744] hover:bg-red-50/40 text-left transition flex items-center gap-2 text-xs font-semibold text-neutral-800"
              >
                <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <Bike className="w-3.5 h-3.5" />
                </div>
                <div className="truncate">
                  <p className="leading-tight">Delivery Staff</p>
                  <p className="text-[10px] text-neutral-400 font-normal truncate">Karthik Raja</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('admin')}
                className="p-2.5 rounded-xl border border-neutral-200 hover:border-[#E23744] hover:bg-red-50/40 text-left transition flex items-center gap-2 text-xs font-semibold text-neutral-800"
              >
                <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                  <Shield className="w-3.5 h-3.5" />
                </div>
                <div className="truncate">
                  <p className="leading-tight">Admin</p>
                  <p className="text-[10px] text-neutral-400 font-normal truncate">Full Management</p>
                </div>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Brand Footer */}
        <div className="mt-5 text-center">
          <p className="text-xs font-medium text-neutral-500">
            SAKTHI MESS · Authentic South Indian Food Delivery
          </p>
        </div>
      </main>

      {/* Splash Transition Modal */}
      <AnimatePresence>
        {showSplash && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-7 max-w-sm w-full text-center space-y-4 shadow-2xl border border-neutral-100"
            >
              <div className="w-16 h-16 rounded-full bg-red-50 text-[#E23744] flex items-center justify-center mx-auto text-2xl font-bold animate-pulse">
                <CheckCircle className="w-8 h-8 text-[#E23744]" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-black text-neutral-900">
                  Welcome, {userNameForSplash || 'User'}!
                </h3>
                <p className="text-xs text-neutral-500">{splashText}</p>
              </div>
              <div className="w-full bg-neutral-100 rounded-full h-1.5 overflow-hidden">
                <div className="bg-[#E23744] h-full w-2/3 animate-pulse" />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function LoginPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center text-neutral-400 font-semibold text-sm">
          Loading...
        </div>
      }
    >
      <LoginContent />
    </React.Suspense>
  );
}
