'use client';

import React, { useState, useMemo } from 'react';
import { useCanteen } from '@/context/CanteenContext';
import {
  Users,
  ShieldOff,
  ShieldCheck,
  Mail,
  ShoppingBag,
  DollarSign,
  Search,
  Phone,
  Calendar,
  Eye,
  Edit2,
  X,
  Check,
  MapPin,
  Utensils,
} from 'lucide-react';

interface CustomerRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  status: 'Active' | 'Inactive';
}

const DEFAULT_CUSTOMERS: CustomerRecord[] = [
  {
    id: 'cust-1',
    name: 'Hari Prassath',
    email: 'customer@sakthimess.com',
    phone: '+91 98765 43210',
    address: '12, Gandhi Road, Anna Nagar, Chennai - 600040',
    status: 'Active',
  },
  {
    id: 'cust-2',
    name: 'Priya Sundaram',
    email: 'priya.s@example.com',
    phone: '+91 98401 23456',
    address: '45, Second Main Road, T. Nagar, Chennai - 600017',
    status: 'Active',
  },
  {
    id: 'cust-3',
    name: 'Rajesh Kumar',
    email: 'rajesh.k@example.com',
    phone: '+91 97890 54321',
    address: '8, North Usman Road, T. Nagar, Chennai - 600017',
    status: 'Active',
  },
  {
    id: 'cust-4',
    name: 'Ananya Krishnan',
    email: 'ananya.k@example.com',
    phone: '+91 94440 98765',
    address: '22, Velachery Main Road, Chennai - 600042',
    status: 'Active',
  },
];

export default function AdminCustomersPage() {
  const { orders } = useCanteen();
  const [customers, setCustomers] = useState<CustomerRecord[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('sakthi_admin_customers');
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return DEFAULT_CUSTOMERS;
  });

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'Active' | 'Inactive'>('ALL');
  const [viewingCustomer, setViewingCustomer] = useState<CustomerRecord | null>(null);
  const [editingCustomer, setEditingCustomer] = useState<CustomerRecord | null>(null);

  // Edit fields
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');

  // Persist customer state changes
  const persistCustomers = (updated: CustomerRecord[]) => {
    setCustomers(updated);
    try {
      localStorage.setItem('sakthi_admin_customers', JSON.stringify(updated));
    } catch {}
  };

  // Compute metrics per customer
  const enrichedCustomers = useMemo(() => {
    return customers.map((c) => {
      const userOrders = orders.filter(
        (o) =>
          o.userName?.toLowerCase() === c.name.toLowerCase() ||
          o.userPhone === c.phone ||
          (o.userId && o.userId === c.id)
      );

      const totalSpent = userOrders.reduce((s, o) => s + o.total, 0);
      const lastOrder = userOrders.length > 0 ? userOrders[0].createdAt : null;

      return {
        ...c,
        ordersCount: userOrders.length,
        totalSpent,
        lastOrder,
        userOrders,
      };
    });
  }, [customers, orders]);

  // Filtered List
  const filteredList = useMemo(() => {
    return enrichedCustomers.filter((c) => {
      if (statusFilter !== 'ALL' && c.status !== statusFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.phone.includes(q)
        );
      }
      return true;
    });
  }, [enrichedCustomers, statusFilter, search]);

  const toggleStatus = (id: string) => {
    const updated = customers.map((c) =>
      c.id === id ? { ...c, status: (c.status === 'Active' ? 'Inactive' : 'Active') as 'Active' | 'Inactive' } : c
    );
    persistCustomers(updated);
  };

  const openEdit = (c: CustomerRecord) => {
    setEditingCustomer(c);
    setEditName(c.name);
    setEditEmail(c.email);
    setEditPhone(c.phone);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCustomer) return;
    const updated = customers.map((c) =>
      c.id === editingCustomer.id
        ? {
            ...c,
            name: editName.trim() || c.name,
            email: editEmail.trim() || c.email,
            phone: editPhone.trim() || c.phone,
          }
        : c
    );
    persistCustomers(updated);
    setEditingCustomer(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
              Customer Management
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-[#E23744] text-[11px] font-bold">
              {customers.length} Registered
            </span>
          </div>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
            View customer ordering history, delivery addresses, and account status
          </p>
        </div>

        {/* Search & Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email or phone..."
              className="pl-9 pr-3 py-2 text-xs bg-white border border-neutral-200 rounded-xl w-60 focus:outline-none focus:ring-2 focus:ring-[#E23744]/25"
            />
          </div>

          <div className="flex bg-neutral-100 p-0.5 rounded-xl text-xs font-bold">
            {(['ALL', 'Active', 'Inactive'] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg transition ${
                  statusFilter === st
                    ? 'bg-white text-neutral-900 shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                {st === 'ALL' ? 'All' : st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Customer Table */}
      <div className="bg-white rounded-3xl border border-neutral-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-400 uppercase tracking-wider font-bold">
              <tr>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4">Orders</th>
                <th className="py-3.5 px-4">Total Spent</th>
                <th className="py-3.5 px-4">Last Order</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredList.map((c) => (
                <tr key={c.id} className="hover:bg-neutral-50/60 transition">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-red-50 text-[#E23744] font-black flex items-center justify-center text-xs shrink-0">
                        {c.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-neutral-900 text-sm">{c.name}</p>
                        <p className="text-[11px] text-neutral-400 truncate max-w-[180px]">
                          {c.address || 'Chennai, Tamil Nadu'}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <p className="font-medium text-neutral-800">{c.email}</p>
                    <p className="text-[11px] text-neutral-500">{c.phone}</p>
                  </td>

                  <td className="py-3.5 px-4 font-bold text-neutral-900">
                    {c.ordersCount} orders
                  </td>

                  <td className="py-3.5 px-4 font-black text-neutral-900">
                    ₹{c.totalSpent}
                  </td>

                  <td className="py-3.5 px-4 text-neutral-500">
                    {c.lastOrder
                      ? new Date(c.lastOrder).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                        })
                      : 'None yet'}
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        c.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-neutral-100 text-neutral-600 border border-neutral-200'
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => setViewingCustomer(c)}
                        className="p-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition"
                        title="View Orders"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => openEdit(c)}
                        className="p-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition"
                        title="Edit Customer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleStatus(c.id)}
                        className={`p-1.5 rounded-lg text-xs font-bold transition ${
                          c.status === 'Active'
                            ? 'bg-red-50 text-[#E23744] hover:bg-red-100'
                            : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        }`}
                        title={c.status === 'Active' ? 'Deactivate' : 'Activate'}
                      >
                        {c.status === 'Active' ? (
                          <ShieldOff className="w-3.5 h-3.5" />
                        ) : (
                          <ShieldCheck className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* VIEW CUSTOMER MODAL */}
      {viewingCustomer && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-neutral-200">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div>
                <h3 className="text-base font-black text-neutral-900">{viewingCustomer.name}</h3>
                <p className="text-xs text-neutral-500">{viewingCustomer.email} · {viewingCustomer.phone}</p>
              </div>
              <button
                type="button"
                onClick={() => setViewingCustomer(null)}
                className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
                Saved Delivery Location
              </h4>
              <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-200 text-xs flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#E23744] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-neutral-800">
                    {viewingCustomer.address || '12, Gandhi Road, Chennai - 600001'}
                  </p>
                  <p className="text-[11px] text-neutral-400">Doorstep delivery available</p>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setViewingCustomer(null)}
                className="px-4 py-2 bg-neutral-900 text-white text-xs font-bold rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT CUSTOMER MODAL */}
      {editingCustomer && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveEdit}
            className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4 border border-neutral-200"
          >
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
              <h3 className="text-base font-black text-neutral-900">Edit Customer</h3>
              <button
                type="button"
                onClick={() => setEditingCustomer(null)}
                className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-neutral-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  required
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-xl"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-neutral-100">
              <button
                type="button"
                onClick={() => setEditingCustomer(null)}
                className="px-4 py-2 border border-neutral-200 rounded-xl font-bold text-neutral-600 text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#E23744] hover:bg-[#B91C2B] text-white font-bold rounded-xl text-xs flex items-center gap-1"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
