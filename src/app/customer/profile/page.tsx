'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCanteen } from '@/context/CanteenContext';
import {
  ShoppingBag,
  Heart,
  CreditCard,
  Bell,
  HelpCircle,
  LogOut,
  MapPin,
  Plus,
  Trash2,
  CheckCircle2,
  Phone,
  Mail,
  User,
  ShieldCheck,
  ChefHat,
  Bike,
} from 'lucide-react';
import { DeliveryAddress } from '@/types';
import { DEMO_ADDRESS } from '@/data/initialData';

export default function CustomerProfilePage() {
  const router = useRouter();
  const {
    user,
    role,
    loginAs,
    logout,
    addDeliveryAddress,
    deleteDeliveryAddress,
    setDefaultDeliveryAddress,
  } = useAuth();
  const { orders, favorites } = useCanteen();

  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newLabel, setNewLabel] = useState<'Home' | 'Work' | 'Other'>('Home');
  const [newName, setNewName] = useState(user?.name || '');
  const [newPhone, setNewPhone] = useState(user?.phone || '+91 98765 43210');
  const [newLine1, setNewLine1] = useState('');
  const [newLine2, setNewLine2] = useState('');
  const [newLandmark, setNewLandmark] = useState('');
  const [newCity, setNewCity] = useState('Coimbatore');
  const [newState, setNewState] = useState('Tamil Nadu');
  const [newPincode, setNewPincode] = useState('641012');

  const addresses: DeliveryAddress[] =
    user && user.role === 'customer' && user.addresses?.length > 0
      ? user.addresses
      : [DEMO_ADDRESS];

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLine1.trim() || !newPhone.trim() || !newName.trim()) return;

    addDeliveryAddress({
      label: newLabel,
      recipientName: newName,
      phone: newPhone,
      addressLine1: newLine1,
      addressLine2: newLine2,
      landmark: newLandmark,
      city: newCity,
      state: newState,
      pincode: newPincode,
      isDefault: addresses.length === 0,
    });

    setShowAddressModal(false);
    setNewLine1('');
    setNewLine2('');
    setNewLandmark('');
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-20 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#1C1C1C] tracking-tight">
          My Profile
        </h1>
        <p className="text-xs sm:text-sm text-[#696969] mt-0.5">
          Manage your personal details and doorstep delivery addresses
        </p>
      </div>

      {/* User Info Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E8E8E8] shadow-card flex flex-col sm:flex-row items-center sm:items-start gap-4">
        <div className="w-16 h-16 rounded-full bg-rose-100 text-[#E23744] flex items-center justify-center font-black text-2xl shrink-0 border-2 border-rose-200">
          {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
        </div>

        <div className="flex-1 text-center sm:text-left space-y-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <h2 className="text-xl font-black text-[#1C1C1C]">{user?.name || 'Customer'}</h2>
            <span className="self-center sm:self-auto text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full bg-rose-50 text-[#E23744] border border-rose-200">
              Customer
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-[#696969] pt-1">
            <span className="flex items-center justify-center sm:justify-start gap-1">
              <Mail className="w-3.5 h-3.5" />
              <span>{user?.email || 'customer@sakthimess.com'}</span>
            </span>
            <span className="flex items-center justify-center sm:justify-start gap-1">
              <Phone className="w-3.5 h-3.5" />
              <span>{user?.phone || '+91 98765 43210'}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Role Switcher for Pairing / Evaluation */}
      <div className="bg-[#F8F8F8] p-4 rounded-3xl border border-[#E8E8E8] space-y-2">
        <p className="text-[11px] font-black uppercase text-[#696969] tracking-wider">
          Quick Console Switch (Pairing Mode)
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <button
            onClick={() => {
              loginAs('customer');
              router.push('/customer/home');
            }}
            className="p-2.5 rounded-xl bg-white border border-[#E8E8E8] font-bold text-[#1C1C1C] hover:border-[#E23744] transition flex items-center justify-center gap-1.5"
          >
            <User className="w-3.5 h-3.5 text-[#E23744]" />
            <span>Customer</span>
          </button>
          <button
            onClick={() => {
              loginAs('kitchen_staff');
              router.push('/kitchen/dashboard');
            }}
            className="p-2.5 rounded-xl bg-white border border-[#E8E8E8] font-bold text-[#1C1C1C] hover:border-[#E23744] transition flex items-center justify-center gap-1.5"
          >
            <ChefHat className="w-3.5 h-3.5 text-[#E23744]" />
            <span>Kitchen Staff</span>
          </button>
          <button
            onClick={() => {
              loginAs('delivery_staff');
              router.push('/delivery/dashboard');
            }}
            className="p-2.5 rounded-xl bg-white border border-[#E8E8E8] font-bold text-[#1C1C1C] hover:border-[#2E9B5B] transition flex items-center justify-center gap-1.5"
          >
            <Bike className="w-3.5 h-3.5 text-[#2E9B5B]" />
            <span>Delivery Staff</span>
          </button>
          <button
            onClick={() => {
              loginAs('admin');
              router.push('/admin/dashboard');
            }}
            className="p-2.5 rounded-xl bg-stone-900 text-white font-bold transition flex items-center justify-center gap-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Admin</span>
          </button>
        </div>
      </div>

      {/* Saved Delivery Addresses */}
      <div className="bg-white rounded-3xl p-5 border border-[#E8E8E8] shadow-card space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-[#1C1C1C] flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#E23744]" />
              Saved Delivery Addresses
            </h3>
            <p className="text-xs text-[#696969]">Deliver food to home, office, or other locations</p>
          </div>
          <button
            onClick={() => setShowAddressModal(true)}
            className="px-3 py-1.5 bg-[#FFF1F2] hover:bg-rose-100 text-[#E23744] border border-rose-200 rounded-xl text-xs font-black flex items-center gap-1 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New</span>
          </button>
        </div>

        <div className="space-y-3">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className="p-4 rounded-2xl bg-[#F8F8F8] border border-[#E8E8E8] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-black text-[#1C1C1C] uppercase text-xs">
                    {addr.label}
                  </span>
                  {addr.isDefault && (
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.2 rounded-full font-black">
                      DEFAULT
                    </span>
                  )}
                </div>
                <p className="font-bold text-[#1C1C1C]">
                  {addr.recipientName} · {addr.phone}
                </p>
                <p className="text-[#696969]">
                  {addr.addressLine1}
                  {addr.addressLine2 ? `, ${addr.addressLine2}` : ''}
                </p>
                {addr.landmark && (
                  <p className="text-[#696969]">Landmark: {addr.landmark}</p>
                )}
                <p className="text-[#696969]">
                  {addr.city}, {addr.state} - {addr.pincode}
                </p>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                {!addr.isDefault && (
                  <button
                    onClick={() => setDefaultDeliveryAddress(addr.id)}
                    className="px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-stone-700 hover:text-[#1C1C1C] font-bold text-xs shadow-2xs transition"
                  >
                    Set Default
                  </button>
                )}
                {addresses.length > 1 && (
                  <button
                    onClick={() => deleteDeliveryAddress(addr.id)}
                    className="p-2 text-stone-400 hover:text-rose-600 transition"
                    title="Delete address"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Profile Navigation Links */}
      <div className="bg-white rounded-3xl p-3 border border-[#E8E8E8] shadow-card divide-y divide-stone-100 text-xs font-bold">
        <Link
          href="/customer/orders"
          className="p-3.5 flex items-center justify-between hover:bg-stone-50 rounded-2xl transition"
        >
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-4 h-4 text-[#E23744]" />
            <span className="text-[#1C1C1C]">My Orders</span>
          </div>
          <span className="text-[#696969]">{orders.length} orders →</span>
        </Link>

        <Link
          href="/customer/favorites"
          className="p-3.5 flex items-center justify-between hover:bg-stone-50 rounded-2xl transition"
        >
          <div className="flex items-center gap-3">
            <Heart className="w-4 h-4 text-[#E23744]" />
            <span className="text-[#1C1C1C]">Favorites</span>
          </div>
          <span className="text-[#696969]">{favorites.length} saved →</span>
        </Link>

        <Link
          href="/customer/notifications"
          className="p-3.5 flex items-center justify-between hover:bg-stone-50 rounded-2xl transition"
        >
          <div className="flex items-center gap-3">
            <Bell className="w-4 h-4 text-[#E23744]" />
            <span className="text-[#1C1C1C]">Notifications</span>
          </div>
          <span className="text-[#696969]">Updates →</span>
        </Link>
      </div>

      {/* Logout CTA */}
      <div className="pt-2">
        <button
          onClick={handleLogout}
          className="w-full py-3.5 rounded-2xl bg-[#FFF1F2] hover:bg-rose-100 text-[#E23744] font-black text-xs transition flex items-center justify-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout from SAKTHI MESS</span>
        </button>
      </div>

      {/* Add Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-base font-black text-[#1C1C1C] flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#E23744]" />
                Add Delivery Address
              </h3>
              <button
                onClick={() => setShowAddressModal(false)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddAddress} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-[#1C1C1C] block mb-1">Address Label</label>
                <div className="flex gap-2">
                  {(['Home', 'Work', 'Other'] as const).map((lbl) => (
                    <button
                      key={lbl}
                      type="button"
                      onClick={() => setNewLabel(lbl)}
                      className={`flex-1 py-2 rounded-xl font-bold border transition ${
                        newLabel === lbl
                          ? 'bg-[#E23744] text-white border-[#E23744]'
                          : 'bg-stone-50 border-stone-200 text-stone-700'
                      }`}
                    >
                      {lbl}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="font-bold text-[#1C1C1C] block mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl bg-stone-50"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#1C1C1C] block mb-1">Phone *</label>
                  <input
                    type="tel"
                    required
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl bg-stone-50"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[#1C1C1C] block mb-1">Address Line 1 *</label>
                <input
                  type="text"
                  required
                  value={newLine1}
                  onChange={(e) => setNewLine1(e.target.value)}
                  placeholder="e.g. 14, Cross Cut Road"
                  className="w-full px-3 py-2 border rounded-xl bg-stone-50"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="font-bold text-[#1C1C1C] block mb-1">Address Line 2</label>
                  <input
                    type="text"
                    value={newLine2}
                    onChange={(e) => setNewLine2(e.target.value)}
                    placeholder="Floor, building"
                    className="w-full px-3 py-2 border rounded-xl bg-stone-50"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#1C1C1C] block mb-1">Landmark</label>
                  <input
                    type="text"
                    value={newLandmark}
                    onChange={(e) => setNewLandmark(e.target.value)}
                    placeholder="Near temple, school"
                    className="w-full px-3 py-2 border rounded-xl bg-stone-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-bold text-[#1C1C1C] block mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl bg-stone-50"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#1C1C1C] block mb-1">State *</label>
                  <input
                    type="text"
                    required
                    value={newState}
                    onChange={(e) => setNewState(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl bg-stone-50"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#1C1C1C] block mb-1">Pincode *</label>
                  <input
                    type="text"
                    required
                    value={newPincode}
                    onChange={(e) => setNewPincode(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl bg-stone-50"
                  />
                </div>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#E23744] hover:bg-[#B91C2B] text-white font-black rounded-xl text-xs"
                >
                  Save Address
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddressModal(false)}
                  className="px-4 py-3 bg-stone-100 text-stone-700 font-bold rounded-xl text-xs"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
