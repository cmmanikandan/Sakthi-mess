'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { FoodItem, OrderItem } from '@/types';
import { RESTAURANT_CONFIG } from '@/data/initialData';

export interface CartItem {
  food: FoodItem;
  quantity: number;
  specialInstructions?: string;
  isParcel?: boolean;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (food: FoodItem, quantity?: number, specialInstructions?: string) => void;
  removeFromCart: (foodId: string) => void;
  updateQuantity: (foodId: string, quantity: number) => void;
  updateItemInstructions: (foodId: string, instructions: string) => void;
  toggleParcel: (foodId: string) => void;
  getItemQuantity: (foodId: string) => number;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  deliveryFee: number;
  freeDeliveryThreshold: number;
  amountNeededForFreeDelivery: number;
  discount: number;
  parcelTotal: number;
  tax: number;
  total: number;
  orderSpecialInstructions: string;
  setOrderSpecialInstructions: (instructions: string) => void;
  toOrderItems: () => OrderItem[];
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [orderSpecialInstructions, setOrderSpecialInstructions] = useState<string>('');

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('sakthi_cart') || localStorage.getItem('bc_cart');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setItems(parsed.filter((item) => item && item.food && typeof item.food.price === 'number'));
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('sakthi_cart', JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items]);

  const addToCart = (food: FoodItem, quantity = 1, specialInstructions?: string) => {
    if (!food || !food.id || food.isAvailable === false) return;
    setItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.food && i.food.id === food.id);
      if (existingIndex >= 0) {
        return prev.map((i, idx) =>
          idx === existingIndex
            ? {
                ...i,
                quantity: (i.quantity || 0) + quantity,
                specialInstructions: specialInstructions || i.specialInstructions,
              }
            : i
        );
      }
      return [...prev, { food, quantity, specialInstructions, isParcel: false }];
    });
  };

  const removeFromCart = (foodId: string) => {
    setItems((prev) => prev.filter((i) => i.food && i.food.id !== foodId));
  };

  const updateQuantity = (foodId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(foodId);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.food && i.food.id === foodId ? { ...i, quantity } : i))
    );
  };

  const updateItemInstructions = (foodId: string, instructions: string) => {
    setItems((prev) =>
      prev.map((i) =>
        i.food && i.food.id === foodId ? { ...i, specialInstructions: instructions } : i
      )
    );
  };

  const toggleParcel = (foodId: string) => {
    setItems((prev) =>
      prev.map((i) => (i.food && i.food.id === foodId ? { ...i, isParcel: !i.isParcel } : i))
    );
  };

  const getItemQuantity = (foodId: string): number => {
    const item = items.find((i) => i.food && i.food.id === foodId);
    return item ? item.quantity || 0 : 0;
  };

  const clearCart = () => {
    setItems([]);
    setOrderSpecialInstructions('');
    localStorage.removeItem('sakthi_cart');
  };

  const totalItems = useMemo(() => {
    return (items || []).reduce((acc, curr) => acc + (curr?.quantity || 0), 0);
  }, [items]);

  const subtotal = useMemo(() => {
    return (items || []).reduce(
      (acc, curr) => acc + (curr?.food?.price || 0) * (curr?.quantity || 0),
      0
    );
  }, [items]);

  const freeDeliveryThreshold = RESTAURANT_CONFIG.freeDeliveryThreshold; // ₹300
  const deliveryFee = useMemo(() => {
    if (subtotal === 0) return 0;
    return subtotal >= freeDeliveryThreshold ? 0 : RESTAURANT_CONFIG.deliveryFee; // ₹30
  }, [subtotal, freeDeliveryThreshold]);

  const amountNeededForFreeDelivery = useMemo(() => {
    if (subtotal >= freeDeliveryThreshold) return 0;
    return freeDeliveryThreshold - subtotal;
  }, [subtotal, freeDeliveryThreshold]);

  const discount = 0;
  const parcelTotal = 0;
  const tax = 0;
  const total = subtotal + deliveryFee - discount;

  const toOrderItems = (): OrderItem[] => {
    return (items || [])
      .filter((i) => i && i.food && i.food.id)
      .map((i) => ({
        foodId: i.food.id,
        name: i.food.name,
        price: i.food.price || 0,
        quantity: i.quantity || 1,
        imageUrl: i.food.imageUrl || '',
        notes: i.specialInstructions,
      }));
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        updateItemInstructions,
        toggleParcel,
        getItemQuantity,
        clearCart,
        totalItems,
        subtotal,
        deliveryFee,
        freeDeliveryThreshold,
        amountNeededForFreeDelivery,
        discount,
        parcelTotal,
        tax,
        total,
        orderSpecialInstructions,
        setOrderSpecialInstructions,
        toOrderItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}
