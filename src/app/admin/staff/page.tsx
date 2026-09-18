'use client';

import React, { useState, useEffect } from 'react';
import { ChefHat, Bike, Shield, Plus, Edit2, Trash2, Mail, Phone, CheckCircle2 } from 'lucide-react';
import {
  DEMO_KITCHEN_STAFF,
  DEMO_DELIVERY_STAFF,
  DEMO_ADMIN,
} from '@/data/initialData';

export interface StaffAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'kitchen_staff' | 'delivery_staff' | 'admin';
  status: 'Online' | 'Offline' | 'Busy';
  vehicleType?: string;
  createdAt: string;
}

const INITIAL_STAFF: StaffAccount[] = [
  {
    id: DEMO_KITCHEN_STAFF.id,
    name: DEMO_KITCHEN_STAFF.name,
    email: DEMO_KITCHEN_STAFF.email || 'kitchen@sakthimess.com',
    phone: DEMO_KITCHEN_STAFF.phone || '+91 98765 11223',
    role: 'kitchen_staff',
    status: 'Online',
    createdAt: new Date().toISOString(),
  },
  {
    id: DEMO_DELIVERY_STAFF.id,
    name: DEMO_DELIVERY_STAFF.name,
    email: DEMO_DELIVERY_STAFF.email || 'delivery@sakthimess.com',
    phone: DEMO_DELIVERY_STAFF.phone || '+91 98765 99887',
    role: 'delivery_staff',
    status: 'Online',
    vehicleType: 'Bike (TN 38 CB 1234)',
    createdAt: new Date().toISOString(),
  },
  {
    id: DEMO_ADMIN.id,
    name: DEMO_ADMIN.name,
    email: DEMO_ADMIN.email,
    phone: DEMO_ADMIN.phone || '+91 98401 23456',
    role: 'admin',
    status: 'Online',
    createdAt: new Date().toISOString(),
  },
];

export default function AdminStaffPage() {
  const [staff, setStaff] = useState<StaffAccount[]>(INITIAL_STAFF);
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'kitchen_staff' | 'delivery_staff' | 'admin'>('ALL');
  const [showModal, setShowModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffAccount | null>(null);

  // Form
  const [fName, setFName] = useState('');
  const [fEmail, setFEmail] = useState('');
  const [fPhone, setFPhone] = useState('');
  const [fRole, setFRole] = useState<'kitchen_staff' | 'delivery_staff' | 'admin'>('kitchen_staff');
  const [fVehicle, setFVehicle] = useState('');
  const [fStatus, setFStatus] = useState<'Online' | 'Offline' | 'Busy'>('Online');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('sakthi_staff');
      if (saved) {
        setStaff(JSON.parse(saved));
      }
    } catch {}
  }, []);

  const saveStaffList = (list: StaffAccount[]) => {
    setStaff(list);
    localStorage.setItem('sakthi_staff', JSON.stringify(list));
  };

  const handleOpenAdd = () => {
    setEditingStaff(null);
    setFName('');
    setFEmail('');
    setFPhone('');
    setFRole('kitchen_staff');
    setFVehicle('');
    setFStatus('Online');
    setShowModal(true);
  };

  const handleOpenEdit = (s: StaffAccount) => {
    setEditingStaff(s);
    setFName(s.name);
    setFEmail(s.email);
    setFPhone(s.phone);
    setFRole(s.role);
    setFVehicle(s.vehicleType || '');
    setFStatus(s.status);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to remove this staff member?')) {
      const updated = staff.filter((s) => s.id !== id);
      saveStaffList(updated);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fName.trim() || !fEmail.trim()) return;

    if (editingStaff) {
      const updated = staff.map((s) =>
        s.id === editingStaff.id
          ? {
              ...s,
              name: fName,
              email: fEmail,
              phone: fPhone,
              role: fRole,
              status: fStatus,
              vehicleType: fVehicle,
            }
          : s
      );
      saveStaffList(updated);
    } else {
      const newStaff: StaffAccount = {
        id: `staff-${Date.now()}`,
        name: fName,
        email: fEmail,
        phone: fPhone,
        role: fRole,
        status: fStatus,
        vehicleType: fVehicle,
        createdAt: new Date().toISOString(),
      };
      saveStaffList([newStaff, ...staff]);
    }
    setShowModal(false);
  };

  const filtered = staff.filter((s) => {
    if (roleFilter !== 'ALL' && s.role !== roleFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1C1C1C] tracking-tight">
            Staff Management
          </h1>
          <p className="text-xs sm:text-sm text-[#696969] mt-0.5">
            Manage Kitchen Staff, Delivery Partners, and Restaurant Administrators
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="self-start sm:self-auto px-4 py-2 bg-[#E23744] hover:bg-[#B91C2B] text-white font-black text-xs rounded-2xl flex items-center gap-1.5 shadow-xs transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Staff</span>
        </button>
      </div>

      {/* Role Filters */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'ALL', label: `All Staff (${staff.length})` },
          { id: 'kitchen_staff', label: 'Kitchen Staff' },
          { id: 'delivery_staff', label: 'Delivery Staff' },
          { id: 'admin', label: 'Admin' },
        ].map((rf) => (
          <button
            key={rf.id}
            onClick={() => setRoleFilter(rf.id as any)}
            className={`px-4 py-2 rounded-2xl text-xs font-black whitespace-nowrap transition ${
              roleFilter === rf.id
                ? 'bg-[#E23744] text-white shadow-xs'
                : 'bg-white text-[#696969] border border-[#E8E8E8] hover:bg-stone-50'
            }`}
          >
            {rf.label}
          </button>
        ))}
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((s) => (
          <div
            key={s.id}
            className="bg-white rounded-3xl p-5 border border-[#E8E8E8] shadow-card space-y-3.5 flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center text-lg ${
                      s.role === 'kitchen_staff'
                        ? 'bg-rose-100 text-[#E23744]'
                        : s.role === 'delivery_staff'
                        ? 'bg-emerald-100 text-[#2E9B5B]'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {s.role === 'kitchen_staff' ? (
                      <ChefHat className="w-5 h-5" />
                    ) : s.role === 'delivery_staff' ? (
                      <Bike className="w-5 h-5" />
                    ) : (
                      <Shield className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-black text-sm text-[#1C1C1C]">{s.name}</h3>
                    <span className="text-[10px] uppercase font-black px-2 py-0.2 rounded-md bg-stone-100 text-[#696969]">
                      {s.role.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                    s.status === 'Online'
                      ? 'bg-emerald-100 text-emerald-800'
                      : s.status === 'Busy'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-stone-100 text-stone-600'
                  }`}
                >
                  {s.status}
                </span>
              </div>

              <div className="space-y-1 text-xs text-[#696969]">
                <p className="flex items-center gap-1.5 truncate">
                  <Mail className="w-3.5 h-3.5 text-stone-400" />
                  <span>{s.email}</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-stone-400" />
                  <span>{s.phone}</span>
                </p>
                {s.vehicleType && (
                  <p className="flex items-center gap-1.5 font-bold text-[#1C1C1C]">
                    <Bike className="w-3.5 h-3.5 text-[#2E9B5B]" />
                    <span>{s.vehicleType}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
              <button
                onClick={() => handleOpenEdit(s)}
                className="p-2 text-stone-500 hover:text-[#1C1C1C] rounded-xl hover:bg-stone-100 transition"
                title="Edit staff"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              {s.id !== DEMO_ADMIN.id && (
                <button
                  onClick={() => handleDelete(s.id)}
                  className="p-2 text-stone-400 hover:text-rose-600 rounded-xl hover:bg-stone-100 transition"
                  title="Remove staff"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-base font-black text-[#1C1C1C]">
                {editingStaff ? 'Edit Staff Member' : 'Add New Staff Member'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-[#1C1C1C] block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={fName}
                  onChange={(e) => setFName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl bg-stone-50"
                  placeholder="e.g. Murugan Chef"
                />
              </div>

              <div>
                <label className="font-bold text-[#1C1C1C] block mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={fEmail}
                  onChange={(e) => setFEmail(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl bg-stone-50"
                  placeholder="staff@sakthimess.com"
                />
              </div>

              <div>
                <label className="font-bold text-[#1C1C1C] block mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={fPhone}
                  onChange={(e) => setFPhone(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl bg-stone-50"
                  placeholder="+91 98765 00000"
                />
              </div>

              <div>
                <label className="font-bold text-[#1C1C1C] block mb-1">Staff Role *</label>
                <select
                  value={fRole}
                  onChange={(e) => setFRole(e.target.value as any)}
                  className="w-full px-3 py-2 border rounded-xl bg-stone-50 font-bold"
                >
                  <option value="kitchen_staff">Kitchen Staff (Prepare & Pack)</option>
                  <option value="delivery_staff">Delivery Staff (Doorstep Deliveries)</option>
                  <option value="admin">Administrator (Full Control)</option>
                </select>
              </div>

              {fRole === 'delivery_staff' && (
                <div>
                  <label className="font-bold text-[#1C1C1C] block mb-1">Vehicle Details</label>
                  <input
                    type="text"
                    value={fVehicle}
                    onChange={(e) => setFVehicle(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl bg-stone-50"
                    placeholder="e.g. Bike (TN 38 CB 1234)"
                  />
                </div>
              )}

              <div>
                <label className="font-bold text-[#1C1C1C] block mb-1">Current Status</label>
                <select
                  value={fStatus}
                  onChange={(e) => setFStatus(e.target.value as any)}
                  className="w-full px-3 py-2 border rounded-xl bg-stone-50 font-bold"
                >
                  <option value="Online">Online</option>
                  <option value="Busy">Busy</option>
                  <option value="Offline">Offline</option>
                </select>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#E23744] hover:bg-[#B91C2B] text-white font-black rounded-xl text-xs"
                >
                  {editingStaff ? 'Update Staff' : 'Add Staff'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
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
