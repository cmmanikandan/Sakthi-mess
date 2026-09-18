export type MealCategory =
  | 'breakfast'
  | 'lunch'
  | 'dinner'
  | 'snacks'
  | 'biryani'
  | 'rice'
  | 'parotta'
  | 'dosa'
  | 'veg'
  | 'non-veg'
  | 'drinks'
  | 'desserts'
  | 'all';

export interface FoodCategoryItem {
  id: string;
  name: string;
  label: string;
  icon: string;
  isPopular?: boolean;
}

export interface MealSchedule {
  id: string;
  name: string;
  label: string;
  icon: string;
  startTime: string; // "07:00"
  endTime: string;   // "11:30"
  isAllDay?: boolean;
  isActive: boolean;
}

export interface FoodItem {
  id: string;
  name: string;
  tamilName?: string;
  description: string;
  price: number;
  originalPrice?: number;
  rating: number;
  ratingCount: number;
  category: MealCategory;
  availableMeals: MealCategory[];
  imageUrl: string;
  isAvailable: boolean;
  isVisible: boolean;
  isVeg: boolean;
  isPopular?: boolean;
  isFeatured?: boolean;
  calories?: string;
  preparationTime?: string;
  ingredients?: string[];
}

export type OrderStatus =
  | 'PLACED'
  | 'ACCEPTED'
  | 'PREPARING'
  | 'PACKING'
  | 'READY'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REJECTED'
  // Legacy aliases for backward compatibility during migration
  | 'CREATED'
  | 'PAYMENT_PENDING'
  | 'PAID'
  | 'SERVED';

export type PaymentStatus = 'PENDING' | 'VERIFIED' | 'PAID' | 'FAILED';

export interface DeliveryAddress {
  id: string;
  label: 'Home' | 'Work' | 'Other';
  recipientName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  latitude?: number;
  longitude?: number;
  isDefault?: boolean;
}

export interface OrderItem {
  foodId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  isParcel?: boolean;
  notes?: string;
}

export interface OrderTimelineEvent {
  status: OrderStatus;
  timestamp: string;
  label: string;
  note?: string;
}

export interface Order {
  id: string; // e.g. "SM-1001"
  orderNumber: string; // e.g. "SM-1001"
  userId: string;
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  customerAvatar?: string;
  items: OrderItem[];
  deliveryAddress: DeliveryAddress;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  tax: number;
  total: number;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: 'ONLINE_RAZORPAY' | 'CASH_ON_DELIVERY';
  paymentId?: string;
  razorpayOrderId?: string;
  specialInstructions?: string;
  assignedStaffId?: string;
  assignedStaffName?: string;
  assignedStaffPhone?: string;
  estimatedDeliveryMinutes: number;
  createdAt: string;
  updatedAt?: string;
  deliveredAt?: string;
  timeline?: OrderTimelineEvent[];

  // Deprecated fields kept optional for transitional safety
  userName?: string;
  userPhone?: string;
  userEmail?: string;
  userAvatar?: string;
  qrToken?: string;
  notes?: string;
  servedAt?: string;
  servedBy?: string;
}

export interface CustomerUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'customer';
  avatarUrl?: string;
  addresses: DeliveryAddress[];
  defaultAddressId?: string;
}

export interface KitchenStaffUser {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role: 'kitchen_staff';
  status: 'Online' | 'Offline' | 'Busy';
}

export interface DeliveryStaffUser {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role: 'delivery_staff';
  status: 'Online' | 'Offline' | 'Busy';
  vehicleType?: string;
  currentOrdersCount?: number;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'admin';
  avatarUrl?: string;
}

// ServerUser type alias for transitional compatibility
export type ServerUser = KitchenStaffUser | DeliveryStaffUser | {
  id: string;
  name: string;
  email?: string;
  counterNumber?: string;
  role: 'server';
};

export type UserRole = 'customer' | 'kitchen_staff' | 'delivery_staff' | 'admin' | 'server';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'payment' | 'menu' | 'alert' | 'delivery';
  timestamp: string;
  read: boolean;
  orderId?: string;
}

export interface RestaurantConfig {
  name: string;
  tagline: string;
  phone: string;
  address: string;
  deliveryFee: number;
  freeDeliveryThreshold: number;
  estimatedDeliveryTimeRange: string;
  isOpen: boolean;
}
