'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Search,
  Plus,
  Minus,
  Trash2,
  Printer,
  CheckCircle2,
  Receipt,
  ShoppingCart,
  RefreshCw,
  X,
  ArrowRight,
  User,
  Phone,
  Sparkles,
  Check,
  Package,
  Clock,
  DollarSign,
  Ban,
  AlertTriangle,
  Utensils,
} from 'lucide-react';
import { useCanteen } from '@/context/CanteenContext';
import { FoodItem, Order, MealCategory } from '@/types';
import { BrandLogo } from '@/components/common/BrandLogo';

interface PosItem {
  food: FoodItem;
  quantity: number;
  isParcel: boolean;
}

export default function AdminPosPage() {
  const { foods, createCashPosOrder, activeMealInfo, toggleFoodAvailability } = useCanteen();

  // Filters & Search
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [dietFilter, setDietFilter] = useState<'ALL' | 'VEG' | 'NON_VEG'>('ALL');
  const [availabilityFilter, setAvailabilityFilter] = useState<'ALL' | 'AVAILABLE' | 'UNAVAILABLE'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // POS Cart State
  const [cart, setCart] = useState<PosItem[]>([]);
  const [customerName, setCustomerName] = useState('Counter Customer');
  const [customerPhone, setCustomerPhone] = useState('');
  const [cashTendered, setCashTendered] = useState<string>('');

  // Completed Order for Slip Modal
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [showSlipModal, setShowSlipModal] = useState(false);
  const [cashGivenAtPayment, setCashGivenAtPayment] = useState<number>(0);

  // Available Categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    foods.forEach((f) => {
      if (f.category) set.add(f.category);
    });
    return ['ALL', ...Array.from(set)];
  }, [foods]);

  // Filtered Food List
  const filteredFoods = useMemo(() => {
    return foods.filter((f) => {
      if (selectedCategory !== 'ALL') {
        const meals = Array.isArray(f.availableMeals) && f.availableMeals.length > 0
          ? f.availableMeals
          : [f.category];
        if (f.category !== selectedCategory && !meals.includes(selectedCategory as MealCategory)) {
          return false;
        }
      }
      if (dietFilter === 'VEG' && !f.isVeg) return false;
      if (dietFilter === 'NON_VEG' && f.isVeg) return false;
      if (availabilityFilter === 'AVAILABLE' && !f.isAvailable) return false;
      if (availabilityFilter === 'UNAVAILABLE' && f.isAvailable) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = f.name.toLowerCase().includes(q);
        const matchesDesc = f.description.toLowerCase().includes(q);
        const matchesCat = f.category.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesCat) return false;
      }
      return true;
    });
  }, [foods, selectedCategory, dietFilter, availabilityFilter, searchQuery]);

  // Cart Operations
  const addToCart = (food: FoodItem) => {
    if (!food.isAvailable) return;
    setCart((prev) => {
      const existing = prev.find((item) => item.food.id === food.id);
      if (existing) {
        return prev.map((item) =>
          item.food.id === food.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { food, quantity: 1, isParcel: false }];
    });
  };

  const updateQuantity = (foodId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.food.id === foodId) {
            const currentFood = foods.find((f) => f.id === foodId);
            if (delta > 0 && currentFood && !currentFood.isAvailable) {
              return item;
            }
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as PosItem[];
    });
  };

  const removeItem = (foodId: string) => {
    setCart((prev) => prev.filter((item) => item.food.id !== foodId));
  };

  const clearCart = () => {
    setCart([]);
    setCashTendered('');
  };

  // Totals
  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.food.price * item.quantity, 0);
  }, [cart]);

  const total = subtotal;

  const cashTenderedNum = parseFloat(cashTendered) || total;
  const changeDue = Math.max(0, cashTenderedNum - total);

  // Generate Cash Order & Open Print Slip
  const handleGenerateAndPrintSlip = () => {
    if (cart.length === 0) return;

    // Check if any cart item is currently unavailable
    const unavailableItems = cart.filter((item) => {
      const liveFood = foods.find((f) => f.id === item.food.id);
      return liveFood ? !liveFood.isAvailable : false;
    });

    if (unavailableItems.length > 0) {
      alert(`Cannot create order: "${unavailableItems.map(i => i.food.name).join(', ')}" is out of stock!`);
      return;
    }

    const orderItems = cart.map((item) => ({
      foodId: item.food.id,
      name: item.food.name,
      price: item.food.price,
      quantity: item.quantity,
      imageUrl: item.food.imageUrl || '',
      isParcel: item.isParcel,
    }));

    const finalName = customerName.trim() || 'Counter Customer';
    const finalPhone = customerPhone.trim() || undefined;

    const newOrder = createCashPosOrder(orderItems, {
      name: finalName,
      phone: finalPhone,
      notes: `Cash Tendered: ₹${cashTenderedNum}`,
    });

    setCashGivenAtPayment(cashTenderedNum);
    setCompletedOrder(newOrder);
    setShowSlipModal(true);
  };

  // Next Customer / Reset
  const handleNextCustomer = () => {
    setShowSlipModal(false);
    setCompletedOrder(null);
    clearCart();
    setCustomerName('Counter Customer');
    setCustomerPhone('');
  };

  // Print Slip
  const handlePrintSlip = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
              POS & Counter Billing
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-red-100 text-[#E23744]">
              KITCHEN LINKED
            </span>
          </div>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
            Instant billing, counter ticketing & thermal receipt generation
          </p>
        </div>

        {activeMealInfo && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold">
            <span>{activeMealInfo.icon}</span>
            <span>Active Service: {activeMealInfo.name}</span>
          </div>
        )}
      </div>

      {/* Main 2-Column POS Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Food Catalog (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Search & Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-xs space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search dishes (Biryani, Parotta, Meals...)"
                className="w-full pl-10 pr-4 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E23744]/30 focus:border-[#E23744] transition"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-neutral-100">
              {/* Veg / Non-Veg filters */}
              <div className="flex bg-neutral-100 p-0.5 rounded-lg text-[11px] font-bold">
                <button
                  type="button"
                  onClick={() => setDietFilter('ALL')}
                  className={`px-2.5 py-1 rounded-md transition ${
                    dietFilter === 'ALL' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-500'
                  }`}
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => setDietFilter('VEG')}
                  className={`px-2.5 py-1 rounded-md transition ${
                    dietFilter === 'VEG' ? 'bg-white text-emerald-700 shadow-xs' : 'text-neutral-500'
                  }`}
                >
                  🌱 Veg
                </button>
                <button
                  type="button"
                  onClick={() => setDietFilter('NON_VEG')}
                  className={`px-2.5 py-1 rounded-md transition ${
                    dietFilter === 'NON_VEG' ? 'bg-white text-red-700 shadow-xs' : 'text-neutral-500'
                  }`}
                >
                  🍗 Non-Veg
                </button>
              </div>

              {/* Categories */}
              <div className="flex items-center gap-1 overflow-x-auto max-w-full pb-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition ${
                      selectedCategory === cat
                        ? 'bg-[#E23744] text-white'
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Dish Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {filteredFoods.map((food) => {
              const inCart = cart.find((i) => i.food.id === food.id);
              return (
                <div
                  key={food.id}
                  onClick={() => food.isAvailable && addToCart(food)}
                  className={`bg-white rounded-2xl border p-3 flex flex-col justify-between transition cursor-pointer relative overflow-hidden select-none ${
                    !food.isAvailable
                      ? 'opacity-60 bg-neutral-50 border-neutral-200 cursor-not-allowed'
                      : inCart
                      ? 'border-[#E23744] shadow-sm bg-red-50/20'
                      : 'border-neutral-200 hover:border-neutral-300 hover:shadow-sm'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-[10px] font-bold uppercase text-neutral-400">
                        {food.category}
                      </span>
                      <span
                        className={`w-3 h-3 rounded-full flex items-center justify-center border text-[8px] ${
                          food.isVeg
                            ? 'border-emerald-600 text-emerald-600'
                            : 'border-red-600 text-red-600'
                        }`}
                      >
                        ●
                      </span>
                    </div>

                    <h4 className="font-bold text-xs text-neutral-900 line-clamp-2 leading-tight">
                      {food.name}
                    </h4>
                  </div>

                  <div className="mt-3 pt-2 border-t border-neutral-100 flex items-center justify-between">
                    <span className="font-extrabold text-sm text-neutral-900">
                      ₹{food.price}
                    </span>

                    {!food.isAvailable ? (
                      <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
                        SOLD OUT
                      </span>
                    ) : inCart ? (
                      <span className="text-xs font-black bg-[#E23744] text-white px-2 py-0.5 rounded-lg shadow-xs">
                        {inCart.quantity} in cart
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-neutral-600 bg-neutral-100 hover:bg-[#E23744] hover:text-white px-2 py-0.5 rounded-lg transition">
                        + Add
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: POS Cart & Billing (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-neutral-200 shadow-sm p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-[#E23744]" />
              <h2 className="font-black text-base text-neutral-900">Current Bill</h2>
            </div>
            {cart.length > 0 && (
              <button
                type="button"
                onClick={clearCart}
                className="text-xs text-red-600 hover:underline font-bold"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Customer Meta */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-neutral-600 mb-1">
                Customer Name
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Name"
                className="w-full px-2.5 py-1.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-medium"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-neutral-600 mb-1">
                Mobile (Optional)
              </label>
              <input
                type="text"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="+91..."
                className="w-full px-2.5 py-1.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-medium"
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
            {cart.length === 0 ? (
              <div className="text-center py-10 text-neutral-400">
                <Utensils className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-xs font-semibold">Bill is empty</p>
                <p className="text-[11px]">Select items from the menu to add to bill</p>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.food.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-50 border border-neutral-100 text-xs"
                >
                  <div className="flex-1 pr-2 truncate">
                    <p className="font-bold text-neutral-900 truncate">{item.food.name}</p>
                    <p className="text-[10px] text-neutral-500 font-semibold">
                      ₹{item.food.price} each
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="flex items-center bg-white border border-neutral-200 rounded-lg">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.food.id, -1)}
                        className="px-1.5 py-1 text-neutral-600 hover:text-neutral-900"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 font-bold text-neutral-900">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.food.id, 1)}
                        className="px-1.5 py-1 text-neutral-600 hover:text-neutral-900"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="font-black text-neutral-900 w-12 text-right">
                      ₹{item.food.price * item.quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() => removeItem(item.food.id)}
                      className="p-1 text-neutral-400 hover:text-red-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Financial Summary & Cash Given */}
          {cart.length > 0 && (
            <div className="pt-3 border-t border-neutral-200 space-y-3">
              <div className="space-y-1 text-xs">
                <div className="flex justify-between font-bold text-neutral-600">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between font-black text-base text-neutral-900 pt-1 border-t border-neutral-200">
                  <span>Total Due</span>
                  <span className="text-[#E23744]">₹{total}</span>
                </div>
              </div>

              {/* Cash tendered quick buttons */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-neutral-600">
                  Cash Received
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[total, 100, 200, 500].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setCashTendered(amt.toString())}
                      className="py-1 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-[11px] font-bold transition"
                    >
                      ₹{amt}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  value={cashTendered}
                  onChange={(e) => setCashTendered(e.target.value)}
                  placeholder={`Cash received (₹${total})`}
                  className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-xl font-bold"
                />

                {changeDue > 0 && (
                  <div className="flex justify-between items-center px-3 py-2 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 text-xs font-bold">
                    <span>Change to Return:</span>
                    <span className="text-sm font-black">₹{changeDue}</span>
                  </div>
                )}
              </div>

              {/* Action: Generate Order & Print Thermal Bill */}
              <button
                type="button"
                onClick={handleGenerateAndPrintSlip}
                className="w-full py-3.5 bg-[#E23744] hover:bg-[#B91C2B] text-white font-black text-sm rounded-2xl shadow-lg shadow-red-500/20 transition flex items-center justify-center gap-2 active:scale-98"
              >
                <Printer className="w-4 h-4" />
                <span>Print Bill & Send to Kitchen (₹{total})</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* THERMAL BILL RECEIPT MODAL (NO QR CODE, PURE SAKTHI MESS RECEIPT) */}
      {showSlipModal && completedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-sm w-full shadow-2xl overflow-hidden border border-neutral-200 animate-in fade-in zoom-in-95">
            {/* Modal Top Bar */}
            <div className="print:hidden px-4 py-3 bg-neutral-50 border-b border-neutral-200 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-black text-neutral-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Order #{completedOrder.orderNumber || completedOrder.id} Created</span>
              </div>
              <button
                type="button"
                onClick={handleNextCustomer}
                className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* RECEIPT SLIP BODY */}
            <div id="thermal-receipt" className="p-6 bg-white text-neutral-900 text-center space-y-4">
              {/* Brand Header */}
              <div className="flex flex-col items-center border-b border-dashed border-neutral-300 pb-3">
                <BrandLogo size="md" />
                <p className="text-[10px] text-neutral-500 font-semibold mt-1">
                  Authentic South Indian Food Ordering
                </p>
                <p className="text-[10px] text-neutral-400">
                  GSTIN: 33AAAAA0000A1Z5 · Ph: +91 98765 43210
                </p>
              </div>

              {/* Order Number Box */}
              <div className="bg-red-50/60 p-3 rounded-2xl border border-red-100">
                <p className="text-[10px] font-extrabold text-[#E23744] uppercase tracking-wider">
                  COUNTER ORDER
                </p>
                <h2 className="text-2xl font-black text-neutral-900 tracking-tight mt-0.5">
                  {completedOrder.orderNumber || `SM-${completedOrder.id}`}
                </h2>
                <p className="text-[10px] text-neutral-500 font-medium mt-0.5">
                  {new Date(completedOrder.createdAt).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}{' '}
                  ·{' '}
                  {new Date(completedOrder.createdAt).toLocaleTimeString('en-IN', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>

              {/* Customer Info */}
              <div className="text-left text-xs text-neutral-600 px-1 flex justify-between">
                <div>
                  <span className="font-bold text-neutral-800">Customer: </span>
                  <span>{completedOrder.userName || customerName}</span>
                </div>
                <div className="font-bold text-emerald-700 uppercase text-[11px]">
                  CASH PAID
                </div>
              </div>

              {/* Items Summary Table */}
              <div className="bg-neutral-50 rounded-xl p-3 border border-neutral-200 text-left text-xs space-y-1.5">
                <div className="flex justify-between items-center text-[10px] font-bold text-neutral-400 uppercase tracking-wider pb-1 border-b border-neutral-200">
                  <span>Item</span>
                  <span>Qty × Price</span>
                  <span>Amount</span>
                </div>
                <div className="divide-y divide-neutral-200/50">
                  {completedOrder.items.map((item, idx) => (
                    <div key={idx} className="py-1.5 flex justify-between items-center text-neutral-900">
                      <span className="font-semibold truncate max-w-[130px]">
                        {item.name}
                      </span>
                      <span className="text-neutral-500 text-[11px]">
                        {item.quantity} × ₹{item.price}
                      </span>
                      <span className="font-bold">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-neutral-200 space-y-1 text-xs">
                  <div className="flex justify-between font-black text-sm text-neutral-900">
                    <span>Total Amount</span>
                    <span className="text-[#E23744]">₹{completedOrder.total}</span>
                  </div>
                  {cashGivenAtPayment > completedOrder.total && (
                    <div className="flex justify-between text-[11px] text-neutral-500 pt-0.5">
                      <span>Cash Received: ₹{cashGivenAtPayment}</span>
                      <span>Change: ₹{cashGivenAtPayment - completedOrder.total}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer Notice */}
              <div className="border-t border-dashed border-neutral-300 pt-3 text-[10px] text-neutral-400 space-y-0.5">
                <p className="font-semibold text-neutral-600">
                  Thank you for ordering at SAKTHI MESS!
                </p>
                <p>Order sent to kitchen for hot preparation.</p>
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="print:hidden p-4 bg-neutral-50 border-t border-neutral-200 flex gap-2.5">
              <button
                type="button"
                onClick={handlePrintSlip}
                className="flex-1 py-3 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-sm active:scale-95"
              >
                <Printer className="w-4 h-4" />
                <span>Print Bill</span>
              </button>
              <button
                type="button"
                onClick={handleNextCustomer}
                className="flex-1 py-3 bg-[#E23744] hover:bg-[#B91C2B] text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-sm active:scale-95"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Next Order</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
