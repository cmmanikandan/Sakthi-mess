'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  FoodItem,
  MealSchedule,
  Order,
  OrderItem,
  NotificationItem,
  MealCategory,
  OrderStatus,
  DeliveryAddress,
  FoodCategoryItem,
  RestaurantConfig,
} from '@/types';
import {
  INITIAL_FOOD_ITEMS,
  INITIAL_MEAL_SCHEDULES,
  INITIAL_ORDERS,
  FOOD_CATEGORIES,
  RESTAURANT_CONFIG,
  DEMO_ADDRESS,
} from '@/data/initialData';
import { generateOrderNumber, parseMinutes, formatTime12h } from '@/lib/utils';

interface ActiveMealInfo {
  category: MealCategory;
  name: string;
  label: string;
  icon: string;
  statusText: string;
  isServing: boolean;
  schedule?: MealSchedule;
}

interface SakthiMessContextType {
  mealSchedules: MealSchedule[];
  foods: FoodItem[];
  orders: Order[];
  favorites: string[];
  notifications: NotificationItem[];
  categories: FoodCategoryItem[];
  restaurantConfig: RestaurantConfig;
  updateRestaurantConfig: (updates: Partial<RestaurantConfig>) => void;
  simulatedTime: string | null;
  activeMealInfo: ActiveMealInfo;
  effectiveTime: Date;
  currentTimeStr: string;
  isSupabaseConnected: boolean; // Kept for backward-compatible indicator
  setSimulatedTime: (timeStr: string | null) => void;
  updateMealSchedule: (id: string, updates: Partial<MealSchedule>) => void;
  toggleFoodAvailability: (id: string) => void;
  toggleFoodVisibility: (id: string) => void;
  addFoodItem: (food: Omit<FoodItem, 'id'>) => void;
  updateFoodItem: (id: string, updates: Partial<FoodItem>) => void;
  deleteFoodItem: (id: string) => void;
  toggleFavorite: (foodId: string) => void;
  createOrder: (
    items: OrderItem[],
    notes?: string,
    customerDetails?: {
      id?: string;
      name?: string;
      phone?: string;
      email?: string;
      avatarUrl?: string;
      deliveryAddress?: DeliveryAddress;
    },
    paymentInfo?: {
      paymentId?: string;
      razorpayOrderId?: string;
      paymentMethod?: 'ONLINE_RAZORPAY' | 'CASH_ON_DELIVERY';
    }
  ) => Order;
  createCashPosOrder: (
    items: OrderItem[],
    customerDetails?: { name?: string; phone?: string; notes?: string; deliveryAddress?: DeliveryAddress }
  ) => Order;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus, note?: string) => Order | null;
  acceptOrder: (orderId: string) => Order | null;
  startPreparingOrder: (orderId: string) => Order | null;
  startPackingOrder: (orderId: string) => Order | null;
  markOrderReady: (orderId: string) => Order | null;
  assignDeliveryStaff: (orderId: string, staffId: string, staffName: string, staffPhone?: string) => Order | null;
  startDelivery: (orderId: string) => Order | null;
  markOrderDelivered: (orderId: string) => Order | null;
  cancelOrder: (orderId: string, reason?: string) => Order | null;
  rejectOrder: (orderId: string, reason?: string) => Order | null;
  verifyPayment: (orderId: string, paymentId: string) => Order | null;
  serveOrder: (orderId: string, staffName?: string) => {
    success: boolean;
    order?: Order;
    error?: string;
    servedAt?: string;
  };
  addNotification: (
    title: string,
    message: string,
    type: 'order' | 'payment' | 'menu' | 'alert' | 'delivery',
    orderId?: string
  ) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  deleteNotification: (id: string) => void;
  requestDeviceNotificationPermission: () => Promise<boolean>;
}

const SakthiMessContext = createContext<SakthiMessContextType | undefined>(undefined);

export function CanteenProvider({ children }: { children: React.ReactNode }) {
  const [mealSchedules, setMealSchedules] = useState<MealSchedule[]>(INITIAL_MEAL_SCHEDULES);
  const [foods, setFoods] = useState<FoodItem[]>(INITIAL_FOOD_ITEMS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [simulatedTime, setSimulatedTimeState] = useState<string | null>(null);
  const [systemClock, setSystemClock] = useState<Date>(new Date());
  const [restaurantConfig, setRestaurantConfig] = useState<RestaurantConfig>(RESTAURANT_CONFIG);

  // Keep system clock ticking
  useEffect(() => {
    const timer = setInterval(() => {
      setSystemClock(new Date());
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  // 1. Initial Hydration from localStorage
  useEffect(() => {
    try {
      const savedFoods = localStorage.getItem('sakthi_foods') || localStorage.getItem('bc_foods');
      if (savedFoods) {
        const parsed = JSON.parse(savedFoods);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setFoods(parsed);
        } else {
          setFoods(INITIAL_FOOD_ITEMS);
          localStorage.setItem('sakthi_foods', JSON.stringify(INITIAL_FOOD_ITEMS));
        }
      } else {
        setFoods(INITIAL_FOOD_ITEMS);
        localStorage.setItem('sakthi_foods', JSON.stringify(INITIAL_FOOD_ITEMS));
      }

      const savedOrders = localStorage.getItem('sakthi_orders');
      if (savedOrders) {
        const parsedOrders: Order[] = JSON.parse(savedOrders);
        setOrders(parsedOrders);
      } else {
        setOrders(INITIAL_ORDERS);
        localStorage.setItem('sakthi_orders', JSON.stringify(INITIAL_ORDERS));
      }

      const savedFavs = localStorage.getItem('sakthi_favorites') || localStorage.getItem('bc_favorites');
      if (savedFavs) {
        setFavorites(JSON.parse(savedFavs));
      }

      const savedNotifs = localStorage.getItem('sakthi_notifications');
      if (savedNotifs) {
        setNotifications(JSON.parse(savedNotifs));
      } else {
        const initialNotif: NotificationItem = {
          id: 'notif-welcome',
          title: 'Welcome to SAKTHI MESS! 🍛',
          message: 'Order your favourite South Indian meals and get them delivered to your doorstep.',
          type: 'order',
          timestamp: new Date().toISOString(),
          read: false,
        };
        setNotifications([initialNotif]);
      }
    } catch (e) {
      console.error('Error hydrating Sakthi Mess context:', e);
    }
  }, []);

  // 2. Real-time Cross-Tab Synchronization via Window Storage Event
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'sakthi_orders' && e.newValue) {
        try {
          setOrders(JSON.parse(e.newValue));
        } catch {}
      }
      if (e.key === 'sakthi_foods' && e.newValue) {
        try {
          setFoods(JSON.parse(e.newValue));
        } catch {}
      }
      if (e.key === 'sakthi_favorites' && e.newValue) {
        try {
          setFavorites(JSON.parse(e.newValue));
        } catch {}
      }
      if (e.key === 'sakthi_notifications' && e.newValue) {
        try {
          setNotifications(JSON.parse(e.newValue));
        } catch {}
      }
      if (e.key === 'sakthi_restaurant_config' && e.newValue) {
        try {
          setRestaurantConfig(JSON.parse(e.newValue));
        } catch {}
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const updateRestaurantConfig = useCallback((updates: Partial<RestaurantConfig>) => {
    setRestaurantConfig((prev) => {
      const updated = { ...prev, ...updates };
      try {
        localStorage.setItem('sakthi_restaurant_config', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, []);

  // Effective time computation
  const effectiveTime = useMemo(() => {
    if (!simulatedTime) return systemClock;
    const [h, m] = simulatedTime.split(':').map(Number);
    const d = new Date(systemClock);
    d.setHours(h || 0, m || 0, 0, 0);
    return d;
  }, [simulatedTime, systemClock]);

  const currentTimeStr = useMemo(() => {
    const h = String(effectiveTime.getHours()).padStart(2, '0');
    const m = String(effectiveTime.getMinutes()).padStart(2, '0');
    return `${h}:${m}`;
  }, [effectiveTime]);

  const setSimulatedTime = (timeStr: string | null) => {
    setSimulatedTimeState(timeStr);
  };

  // Active meal determination
  const activeMealInfo = useMemo<ActiveMealInfo>(() => {
    const currentMins = parseMinutes(currentTimeStr);

    for (const schedule of mealSchedules) {
      if (!schedule.isActive) continue;
      const startMins = parseMinutes(schedule.startTime);
      const endMins = parseMinutes(schedule.endTime);

      let isServing = false;
      if (startMins <= endMins) {
        isServing = currentMins >= startMins && currentMins < endMins;
      } else {
        isServing = currentMins >= startMins || currentMins < endMins;
      }

      if (isServing) {
        return {
          category: schedule.id as MealCategory,
          name: schedule.name,
          label: schedule.label,
          icon: schedule.icon,
          statusText: `Serving until ${formatTime12h(schedule.endTime)}`,
          isServing: true,
          schedule,
        };
      }
    }

    return {
      category: 'lunch',
      name: 'All Day Specials',
      label: '🍛 Meals & Snacks',
      icon: '🍛',
      statusText: 'Kitchen is open for online ordering',
      isServing: true,
    };
  }, [mealSchedules, currentTimeStr]);

  const updateMealSchedule = (id: string, updates: Partial<MealSchedule>) => {
    setMealSchedules((prev) => {
      const updated = prev.map((s) => (s.id === id ? { ...s, ...updates } : s));
      localStorage.setItem('sakthi_meal_schedules', JSON.stringify(updated));
      return updated;
    });
  };

  // Food items management
  const toggleFoodAvailability = (id: string) => {
    setFoods((prev) => {
      const updated = prev.map((f) => (f.id === id ? { ...f, isAvailable: !f.isAvailable } : f));
      localStorage.setItem('sakthi_foods', JSON.stringify(updated));
      return updated;
    });
  };

  const toggleFoodVisibility = (id: string) => {
    setFoods((prev) => {
      const updated = prev.map((f) => (f.id === id ? { ...f, isVisible: !f.isVisible } : f));
      localStorage.setItem('sakthi_foods', JSON.stringify(updated));
      return updated;
    });
  };

  const addFoodItem = (food: Omit<FoodItem, 'id'>) => {
    const newFood: FoodItem = {
      ...food,
      id: `food-${Date.now()}`,
    };
    setFoods((prev) => {
      const updated = [newFood, ...prev];
      localStorage.setItem('sakthi_foods', JSON.stringify(updated));
      return updated;
    });
    addNotification(
      'New Dish Added!',
      `${newFood.name} (₹${newFood.price}) is now available on SAKTHI MESS menu.`,
      'menu'
    );
  };

  const updateFoodItem = (id: string, updates: Partial<FoodItem>) => {
    setFoods((prev) => {
      const updated = prev.map((f) => (f.id === id ? { ...f, ...updates } : f));
      localStorage.setItem('sakthi_foods', JSON.stringify(updated));
      return updated;
    });
  };

  const deleteFoodItem = (id: string) => {
    setFoods((prev) => {
      const updated = prev.filter((f) => f.id !== id);
      localStorage.setItem('sakthi_foods', JSON.stringify(updated));
      return updated;
    });
  };

  const toggleFavorite = (foodId: string) => {
    setFavorites((prev) => {
      const isFav = prev.includes(foodId);
      const updated = isFav ? prev.filter((id) => id !== foodId) : [...prev, foodId];
      localStorage.setItem('sakthi_favorites', JSON.stringify(updated));
      return updated;
    });
  };

  // Notification helper
  const addNotification = useCallback((
    title: string,
    message: string,
    type: 'order' | 'payment' | 'menu' | 'alert' | 'delivery' = 'order',
    orderId?: string
  ) => {
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title,
      message,
      type,
      timestamp: new Date().toISOString(),
      read: false,
      orderId,
    };
    setNotifications((prev) => {
      const updated = [newNotif, ...prev.slice(0, 49)];
      localStorage.setItem('sakthi_notifications', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => {
      const updated = prev.map((n) => (n.id === id ? { ...n, read: true } : n));
      localStorage.setItem('sakthi_notifications', JSON.stringify(updated));
      return updated;
    });
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => {
      const updated = prev.map((n) => ({ ...n, read: true }));
      localStorage.setItem('sakthi_notifications', JSON.stringify(updated));
      return updated;
    });
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => {
      const updated = prev.filter((n) => n.id !== id);
      localStorage.setItem('sakthi_notifications', JSON.stringify(updated));
      return updated;
    });
  };

  const requestDeviceNotificationPermission = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) return false;
    try {
      const perm = await Notification.requestPermission();
      return perm === 'granted';
    } catch {
      return false;
    }
  };

  // Orders Management & Lifecycle
  const saveOrders = (updatedOrders: Order[]) => {
    setOrders(updatedOrders);
    try {
      localStorage.setItem('sakthi_orders', JSON.stringify(updatedOrders));
    } catch (e) {
      console.error('Failed saving orders to localStorage', e);
    }
  };

  const createOrder = (
    items: OrderItem[],
    notes?: string,
    customerDetails?: {
      id?: string;
      name?: string;
      phone?: string;
      email?: string;
      avatarUrl?: string;
      deliveryAddress?: DeliveryAddress;
    },
    paymentInfo?: {
      paymentId?: string;
      razorpayOrderId?: string;
      paymentMethod?: 'ONLINE_RAZORPAY' | 'CASH_ON_DELIVERY';
    }
  ): Order => {
    const subtotal = items.reduce((s, it) => s + it.price * it.quantity, 0);
    const deliveryFee =
      subtotal >= restaurantConfig.freeDeliveryThreshold ? 0 : restaurantConfig.deliveryFee;
    const discount = 0;
    const tax = 0;
    const total = subtotal + deliveryFee - discount;

    const orderNum = generateOrderNumber(orders.length);
    const nowIso = new Date().toISOString();

    const deliveryAddress: DeliveryAddress =
      customerDetails?.deliveryAddress || DEMO_ADDRESS;

    const newOrder: Order = {
      id: orderNum,
      orderNumber: orderNum,
      userId: customerDetails?.id || 'cust-online',
      customerName: customerDetails?.name || 'Valued Customer',
      customerPhone: customerDetails?.phone || deliveryAddress.phone,
      customerEmail: customerDetails?.email || 'customer@sakthimess.com',
      customerAvatar: customerDetails?.avatarUrl,
      items,
      deliveryAddress,
      subtotal,
      deliveryFee,
      discount,
      tax,
      total,
      orderStatus: 'PLACED',
      paymentStatus: paymentInfo?.paymentId ? 'PAID' : 'PENDING',
      paymentMethod: paymentInfo?.paymentMethod || (paymentInfo?.paymentId ? 'ONLINE_RAZORPAY' : 'CASH_ON_DELIVERY'),
      paymentId: paymentInfo?.paymentId,
      razorpayOrderId: paymentInfo?.razorpayOrderId,
      specialInstructions: notes,
      estimatedDeliveryMinutes: 30,
      createdAt: nowIso,
      updatedAt: nowIso,
      timeline: [
        {
          status: 'PLACED',
          timestamp: nowIso,
          label: 'Order Placed',
          note: `Order #${orderNum} placed successfully`,
        },
      ],
      // Compatibility
      userName: customerDetails?.name || 'Valued Customer',
      userPhone: customerDetails?.phone || deliveryAddress.phone,
      userEmail: customerDetails?.email || 'customer@sakthimess.com',
    };

    saveOrders([newOrder, ...orders]);

    addNotification(
      'Order Placed! 🎉',
      `Your order #${orderNum} has been placed. SAKTHI MESS kitchen will accept it shortly.`,
      'order',
      orderNum
    );

    return newOrder;
  };

  const createCashPosOrder = (
    items: OrderItem[],
    customerDetails?: { name?: string; phone?: string; notes?: string; deliveryAddress?: DeliveryAddress }
  ): Order => {
    return createOrder(
      items,
      customerDetails?.notes,
      {
        id: 'pos-customer',
        name: customerDetails?.name || 'Counter Customer',
        phone: customerDetails?.phone || '+91 98765 00000',
        deliveryAddress: customerDetails?.deliveryAddress || DEMO_ADDRESS,
      },
      {
        paymentMethod: 'CASH_ON_DELIVERY',
        paymentId: `pos_cash_${Date.now()}`,
      }
    );
  };

  const updateOrderStatus = (
    orderId: string,
    newStatus: OrderStatus,
    note?: string
  ): Order | null => {
    const nowIso = new Date().toISOString();
    let targetOrder: Order | null = null;

    const updated = orders.map((ord) => {
      if (ord.id === orderId || ord.orderNumber === orderId) {
        const timeline = ord.timeline || [];
        const labelMap: Record<OrderStatus, string> = {
          PLACED: 'Order Placed',
          ACCEPTED: 'Order Accepted',
          PREPARING: 'Preparing in Kitchen',
          PACKING: 'Packing Meal',
          READY: 'Food Ready for Pickup',
          OUT_FOR_DELIVERY: 'Out for Delivery',
          DELIVERED: 'Delivered to Doorstep',
          CANCELLED: 'Order Cancelled',
          REJECTED: 'Order Rejected',
          CREATED: 'Order Created',
          PAYMENT_PENDING: 'Payment Pending',
          PAID: 'Payment Verified',
          SERVED: 'Delivered',
        };

        const updatedOrder: Order = {
          ...ord,
          orderStatus: newStatus,
          updatedAt: nowIso,
          deliveredAt: newStatus === 'DELIVERED' ? nowIso : ord.deliveredAt,
          timeline: [
            ...timeline,
            {
              status: newStatus,
              timestamp: nowIso,
              label: labelMap[newStatus] || newStatus,
              note: note || `Order transitioned to ${newStatus}`,
            },
          ],
        };
        targetOrder = updatedOrder;
        return updatedOrder;
      }
      return ord;
    });

    if (targetOrder) {
      saveOrders(updated);

      // Trigger user-friendly notification based on new status
      const messageMap: Partial<Record<OrderStatus, string>> = {
        ACCEPTED: `Your order #${orderId} has been accepted by SAKTHI MESS kitchen.`,
        PREPARING: `Chef is now preparing your delicious meal for order #${orderId}.`,
        PACKING: `Your food for order #${orderId} is being packed hot & fresh.`,
        READY: `Order #${orderId} is ready and waiting for delivery pickup.`,
        OUT_FOR_DELIVERY: `Your order #${orderId} is out for delivery with our rider!`,
        DELIVERED: `Your order #${orderId} has been delivered. Enjoy your meal!`,
        CANCELLED: `Your order #${orderId} was cancelled.`,
        REJECTED: `Your order #${orderId} could not be accepted.`,
      };

      if (messageMap[newStatus]) {
        addNotification(`Order #${orderId} Update`, messageMap[newStatus]!, 'delivery', orderId);
      }
    }

    return targetOrder;
  };

  const acceptOrder = (orderId: string) => updateOrderStatus(orderId, 'ACCEPTED', 'Kitchen accepted order');
  const startPreparingOrder = (orderId: string) => updateOrderStatus(orderId, 'PREPARING', 'Cooking in progress');
  const startPackingOrder = (orderId: string) => updateOrderStatus(orderId, 'PACKING', 'Packing order items');
  const markOrderReady = (orderId: string) => updateOrderStatus(orderId, 'READY', 'Order is packed and ready');
  const startDelivery = (orderId: string) => updateOrderStatus(orderId, 'OUT_FOR_DELIVERY', 'Rider is on the way');
  const markOrderDelivered = (orderId: string) => updateOrderStatus(orderId, 'DELIVERED', 'Delivered to customer address');
  const cancelOrder = (orderId: string, reason?: string) => updateOrderStatus(orderId, 'CANCELLED', reason || 'Cancelled');
  const rejectOrder = (orderId: string, reason?: string) => updateOrderStatus(orderId, 'REJECTED', reason || 'Rejected by kitchen');

  const assignDeliveryStaff = (
    orderId: string,
    staffId: string,
    staffName: string,
    staffPhone?: string
  ): Order | null => {
    let targetOrder: Order | null = null;
    const updated = orders.map((ord) => {
      if (ord.id === orderId || ord.orderNumber === orderId) {
        const updatedOrd: Order = {
          ...ord,
          assignedStaffId: staffId,
          assignedStaffName: staffName,
          assignedStaffPhone: staffPhone,
        };
        targetOrder = updatedOrd;
        return updatedOrd;
      }
      return ord;
    });
    if (targetOrder) saveOrders(updated);
    return targetOrder;
  };

  const verifyPayment = (orderId: string, paymentId: string): Order | null => {
    let verifiedOrder: Order | null = null;
    const updated = orders.map((ord) => {
      if (ord.id === orderId || ord.orderNumber === orderId) {
        const updatedOrd: Order = {
          ...ord,
          paymentStatus: 'PAID',
          paymentId,
        };
        verifiedOrder = updatedOrd;
        return updatedOrd;
      }
      return ord;
    });
    if (verifiedOrder) saveOrders(updated);
    return verifiedOrder;
  };

  const serveOrder = (orderId: string, staffName = 'Sakthi Mess Staff') => {
    const ord = markOrderDelivered(orderId);
    if (!ord) {
      return { success: false, error: 'Order not found' };
    }
    return { success: true, order: ord, servedAt: new Date().toISOString() };
  };

  return (
    <SakthiMessContext.Provider
      value={{
        mealSchedules,
        foods,
        orders,
        favorites,
        notifications,
        categories: FOOD_CATEGORIES,
        restaurantConfig,
        updateRestaurantConfig,
        simulatedTime,
        activeMealInfo,
        effectiveTime,
        currentTimeStr,
        isSupabaseConnected: true,
        setSimulatedTime,
        updateMealSchedule,
        toggleFoodAvailability,
        toggleFoodVisibility,
        addFoodItem,
        updateFoodItem,
        deleteFoodItem,
        toggleFavorite,
        createOrder,
        createCashPosOrder,
        updateOrderStatus,
        acceptOrder,
        startPreparingOrder,
        startPackingOrder,
        markOrderReady,
        assignDeliveryStaff,
        startDelivery,
        markOrderDelivered,
        cancelOrder,
        rejectOrder,
        verifyPayment,
        serveOrder,
        addNotification,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        deleteNotification,
        requestDeviceNotificationPermission,
      }}
    >
      {children}
    </SakthiMessContext.Provider>
  );
}

export function useCanteen() {
  const context = useContext(SakthiMessContext);
  if (!context) throw new Error('useCanteen must be used within a CanteenProvider');
  return context;
}

export const useSakthiMess = useCanteen;
export const SakthiMessProvider = CanteenProvider;
