'use client';

import React, { useState } from 'react';
import { Save, CheckCircle2, Truck, Store } from 'lucide-react';
import { useCanteen } from '@/context/CanteenContext';

export default function AdminSettingsPage() {
  const { restaurantConfig, updateRestaurantConfig } = useCanteen();

  const [restaurantName, setRestaurantName] = useState(restaurantConfig.name || 'SAKTHI MESS');
  const [tagline, setTagline] = useState(restaurantConfig.tagline || 'Online Food Ordering & Home Delivery');
  const [adminPhone, setAdminPhone] = useState(restaurantConfig.phone || '+91 98765 43210');
  const [operatingHours, setOperatingHours] = useState('7:00 AM – 10:30 PM');
  const [deliveryFee, setDeliveryFee] = useState(restaurantConfig.deliveryFee || 30);
  const [freeDeliveryThreshold, setFreeDeliveryThreshold] = useState(
    restaurantConfig.freeDeliveryThreshold || 300
  );
  const [address, setAddress] = useState(
    restaurantConfig.address || '12, Gandhi Road, Anna Nagar, Chennai - 600040'
  );
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateRestaurantConfig({
      name: restaurantName,
      tagline,
      phone: adminPhone,
      address,
      deliveryFee: Number(deliveryFee),
      freeDeliveryThreshold: Number(freeDeliveryThreshold),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
          System & Delivery Settings
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
          Configure SAKTHI MESS brand identity, delivery fee thresholds, and store contact
        </p>
      </div>

      {saved && (
        <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 p-3 rounded-2xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Settings saved and updated across all active sessions!</span>
        </div>
      )}

      <form
        onSubmit={handleSave}
        className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-xs space-y-6 text-xs"
      >
        {/* Brand Section */}
        <div className="space-y-4">
          <h2 className="font-black text-sm text-neutral-900 border-b border-neutral-100 pb-3 flex items-center gap-2">
            <Store className="w-4 h-4 text-[#E23744]" />
            <span>Brand Identity</span>
          </h2>

          <div>
            <label className="font-bold text-neutral-700 block mb-1">
              Restaurant Brand Name
            </label>
            <input
              type="text"
              value={restaurantName}
              onChange={(e) => setRestaurantName(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-xl bg-neutral-50 text-neutral-900 font-bold focus:bg-white focus:ring-2 focus:ring-[#E23744]/25"
            />
          </div>

          <div>
            <label className="font-bold text-neutral-700 block mb-1">Brand Tagline</label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-xl bg-neutral-50 text-neutral-900 focus:bg-white focus:ring-2 focus:ring-[#E23744]/25"
            />
          </div>

          <div>
            <label className="font-bold text-neutral-700 block mb-1">Store Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-xl bg-neutral-50 text-neutral-900 focus:bg-white focus:ring-2 focus:ring-[#E23744]/25"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-neutral-700 block mb-1">
                Customer Support Phone
              </label>
              <input
                type="text"
                value={adminPhone}
                onChange={(e) => setAdminPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-xl bg-neutral-50 text-neutral-900 focus:bg-white focus:ring-2 focus:ring-[#E23744]/25"
              />
            </div>

            <div>
              <label className="font-bold text-neutral-700 block mb-1">Operating Hours</label>
              <input
                type="text"
                value={operatingHours}
                onChange={(e) => setOperatingHours(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-xl bg-neutral-50 text-neutral-900 focus:bg-white focus:ring-2 focus:ring-[#E23744]/25"
              />
            </div>
          </div>
        </div>

        {/* Delivery Configuration Section */}
        <div className="space-y-4 pt-4 border-t border-neutral-100">
          <h2 className="font-black text-sm text-neutral-900 border-b border-neutral-100 pb-3 flex items-center gap-2">
            <Truck className="w-4 h-4 text-[#E23744]" />
            <span>Delivery Fee Configuration</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-neutral-700 block mb-1">
                Standard Delivery Fee (₹)
              </label>
              <input
                type="number"
                value={deliveryFee}
                onChange={(e) => setDeliveryFee(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-xl bg-neutral-50 text-neutral-900 font-bold focus:bg-white focus:ring-2 focus:ring-[#E23744]/25"
              />
              <p className="text-[10px] text-neutral-400 mt-1">
                Flat fee applied to delivery orders
              </p>
            </div>

            <div>
              <label className="font-bold text-neutral-700 block mb-1">
                Free Delivery Above (₹)
              </label>
              <input
                type="number"
                value={freeDeliveryThreshold}
                onChange={(e) => setFreeDeliveryThreshold(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-xl bg-neutral-50 text-neutral-900 font-bold focus:bg-white focus:ring-2 focus:ring-[#E23744]/25"
              />
              <p className="text-[10px] text-neutral-400 mt-1">
                Orders equal or exceeding this value get free delivery (₹0)
              </p>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-neutral-100 flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-[#E23744] hover:bg-[#B91C2B] text-white font-bold rounded-xl flex items-center gap-2 shadow-sm transition active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}
