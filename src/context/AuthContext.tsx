'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  CustomerUser,
  KitchenStaffUser,
  DeliveryStaffUser,
  AdminUser,
  DeliveryAddress,
} from '@/types';
import {
  DEMO_CUSTOMER,
  DEMO_KITCHEN_STAFF,
  DEMO_DELIVERY_STAFF,
  DEMO_ADMIN,
  DEMO_ADDRESS,
} from '@/data/initialData';

export type AnyUser = CustomerUser | KitchenStaffUser | DeliveryStaffUser | AdminUser;

// Default demo credentials
const CREDENTIALS: Record<string, { email: string; pass: string; user: AnyUser }> = {
  customer: {
    email: 'customer@sakthimess.com',
    pass: 'customer123',
    user: DEMO_CUSTOMER,
  },
  kitchen_staff: {
    email: 'kitchen@sakthimess.com',
    pass: 'kitchen123',
    user: DEMO_KITCHEN_STAFF,
  },
  delivery_staff: {
    email: 'delivery@sakthimess.com',
    pass: 'delivery123',
    user: DEMO_DELIVERY_STAFF,
  },
  admin: {
    email: 'admin@sakthimess.com',
    pass: 'admin123',
    user: DEMO_ADMIN,
  },
};

interface AuthContextType {
  user: AnyUser | null;
  role: UserRole;
  isAuthenticated: boolean;
  isLoaded: boolean;
  loginAs: (role: UserRole, customUser?: AnyUser) => void;
  updateCustomerProfile: (profile: Partial<CustomerUser>) => void;
  addDeliveryAddress: (address: Omit<DeliveryAddress, 'id'>) => DeliveryAddress;
  updateDeliveryAddress: (id: string, address: Partial<DeliveryAddress>) => void;
  deleteDeliveryAddress: (id: string) => void;
  setDefaultDeliveryAddress: (id: string) => void;
  login: (
    role: UserRole,
    identifier: string,
    pass: string
  ) => Promise<{ success: boolean; user?: AnyUser; error?: string }>;
  loginWithGoogle: (requestedRole?: UserRole) => Promise<{ success: boolean; user?: AnyUser; error?: string }>;
  loginWithGoogleProfile: (googleEmail: string, googleName: string, avatarUrl?: string) => void;
  signup: (
    requestedRole: UserRole,
    email: string,
    pass: string,
    name: string,
    phone?: string,
    initialAddress?: Partial<DeliveryAddress>
  ) => Promise<{ success: boolean; error?: string; user?: AnyUser }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function setCookie(name: string, value: string) {
  if (typeof document === 'undefined') return;
  try {
    document.cookie = `${name}=${value}; path=/; max-age=31536000; SameSite=Lax`;
  } catch {}
}

function removeCookie(name: string) {
  if (typeof document === 'undefined') return;
  try {
    document.cookie = `${name}=; path=/; max-age=0`;
  } catch {}
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<UserRole>('customer');
  const [user, setUser] = useState<AnyUser | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // 1. Initial State from localStorage
  useEffect(() => {
    try {
      const savedRole = (localStorage.getItem('sakthi_user_role') || localStorage.getItem('bc_user_role')) as UserRole;
      const savedUserStr = localStorage.getItem('sakthi_custom_user') || localStorage.getItem('bc_custom_user');

      if (savedRole && savedUserStr) {
        const parsed = JSON.parse(savedUserStr);
        // Normalize role name
        let normalizedRole: UserRole = savedRole;
        if ((savedRole as string) === 'server') {
          normalizedRole = 'kitchen_staff';
        }
        setRole(normalizedRole);
        setUser(parsed);
        setCookie('sakthi_user_role', normalizedRole);
      } else {
        // Default to demo customer for immediate pleasant preview experience
        setRole('customer');
        setUser(DEMO_CUSTOMER);
        setCookie('sakthi_user_role', 'customer');
        localStorage.setItem('sakthi_user_role', 'customer');
        localStorage.setItem('sakthi_custom_user', JSON.stringify(DEMO_CUSTOMER));
      }
    } catch {
      setRole('customer');
      setUser(DEMO_CUSTOMER);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const loginAs = (newRole: UserRole, customUser?: AnyUser) => {
    let targetUser = customUser;
    let normRole = newRole;
    if ((newRole as string) === 'server') {
      normRole = 'kitchen_staff';
    }

    if (!targetUser) {
      if (normRole === 'admin') targetUser = DEMO_ADMIN;
      else if (normRole === 'kitchen_staff') targetUser = DEMO_KITCHEN_STAFF;
      else if (normRole === 'delivery_staff') targetUser = DEMO_DELIVERY_STAFF;
      else targetUser = DEMO_CUSTOMER;
    }

    setRole(normRole);
    setUser(targetUser);
    setCookie('sakthi_user_role', normRole);
    localStorage.setItem('sakthi_user_role', normRole);
    localStorage.setItem('sakthi_custom_user', JSON.stringify(targetUser));
  };

  const updateCustomerProfile = (profile: Partial<CustomerUser>) => {
    if (!user || user.role !== 'customer') return;
    const updated = { ...user, ...profile };
    setUser(updated);
    localStorage.setItem('sakthi_custom_user', JSON.stringify(updated));
  };

  const addDeliveryAddress = (address: Omit<DeliveryAddress, 'id'>): DeliveryAddress => {
    const newId = `addr-${Date.now()}`;
    const newAddress: DeliveryAddress = {
      ...address,
      id: newId,
    };

    if (user && user.role === 'customer') {
      const addresses = user.addresses || [];
      const isFirst = addresses.length === 0;
      const updatedList = [
        ...addresses.map((a) => (newAddress.isDefault ? { ...a, isDefault: false } : a)),
        { ...newAddress, isDefault: newAddress.isDefault || isFirst },
      ];
      const defaultId = newAddress.isDefault || isFirst ? newId : user.defaultAddressId || newId;

      const updatedUser: CustomerUser = {
        ...user,
        addresses: updatedList,
        defaultAddressId: defaultId,
      };
      setUser(updatedUser);
      localStorage.setItem('sakthi_custom_user', JSON.stringify(updatedUser));
    }

    return newAddress;
  };

  const updateDeliveryAddress = (id: string, updates: Partial<DeliveryAddress>) => {
    if (!user || user.role !== 'customer') return;
    const addresses = (user.addresses || []).map((a) => {
      if (a.id === id) {
        return { ...a, ...updates };
      }
      if (updates.isDefault) {
        return { ...a, isDefault: false };
      }
      return a;
    });

    const updatedUser: CustomerUser = {
      ...user,
      addresses,
      defaultAddressId: updates.isDefault ? id : user.defaultAddressId,
    };
    setUser(updatedUser);
    localStorage.setItem('sakthi_custom_user', JSON.stringify(updatedUser));
  };

  const deleteDeliveryAddress = (id: string) => {
    if (!user || user.role !== 'customer') return;
    const filtered = (user.addresses || []).filter((a) => a.id !== id);
    const newDefaultId =
      user.defaultAddressId === id
        ? filtered[0]?.id || undefined
        : user.defaultAddressId;

    const updatedUser: CustomerUser = {
      ...user,
      addresses: filtered,
      defaultAddressId: newDefaultId,
    };
    setUser(updatedUser);
    localStorage.setItem('sakthi_custom_user', JSON.stringify(updatedUser));
  };

  const setDefaultDeliveryAddress = (id: string) => {
    if (!user || user.role !== 'customer') return;
    const updatedAddresses = (user.addresses || []).map((a) => ({
      ...a,
      isDefault: a.id === id,
    }));
    const updatedUser: CustomerUser = {
      ...user,
      addresses: updatedAddresses,
      defaultAddressId: id,
    };
    setUser(updatedUser);
    localStorage.setItem('sakthi_custom_user', JSON.stringify(updatedUser));
  };

  const login = async (
    targetRole: UserRole,
    identifier: string,
    pass: string
  ): Promise<{ success: boolean; user?: AnyUser; error?: string }> => {
    let normRole = targetRole;
    if ((targetRole as string) === 'server') normRole = 'kitchen_staff';

    const cleanIdent = identifier.trim().toLowerCase();

    // 1. Check known presets
    if (
      cleanIdent.includes('admin') ||
      cleanIdent === 'admin@sakthimess.com' ||
      cleanIdent === 'manikandanprabhu37@gmail.com'
    ) {
      loginAs('admin', DEMO_ADMIN);
      return { success: true, user: DEMO_ADMIN };
    }

    if (
      cleanIdent.includes('kitchen') ||
      cleanIdent === 'kitchen@sakthimess.com' ||
      normRole === 'kitchen_staff'
    ) {
      loginAs('kitchen_staff', DEMO_KITCHEN_STAFF);
      return { success: true, user: DEMO_KITCHEN_STAFF };
    }

    if (
      cleanIdent.includes('delivery') ||
      cleanIdent === 'delivery@sakthimess.com' ||
      normRole === 'delivery_staff'
    ) {
      loginAs('delivery_staff', DEMO_DELIVERY_STAFF);
      return { success: true, user: DEMO_DELIVERY_STAFF };
    }

    // 2. Customer login
    const customerUser: CustomerUser = {
      ...DEMO_CUSTOMER,
      email: cleanIdent.includes('@') ? cleanIdent : `${cleanIdent}@sakthimess.com`,
      phone: !cleanIdent.includes('@') ? cleanIdent : DEMO_CUSTOMER.phone,
    };
    loginAs('customer', customerUser);
    return { success: true, user: customerUser };
  };

  const loginWithGoogle = async (requestedRole: UserRole = 'customer') => {
    // Fast mock Google sign-in
    const googleUser: CustomerUser = {
      id: `google-${Date.now()}`,
      name: 'Google Customer',
      email: 'customer.google@sakthimess.com',
      phone: '+91 98400 55667',
      role: 'customer',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      addresses: [DEMO_ADDRESS],
      defaultAddressId: DEMO_ADDRESS.id,
    };
    loginAs('customer', googleUser);
    return { success: true, user: googleUser };
  };

  const loginWithGoogleProfile = (googleEmail: string, googleName: string, avatarUrl?: string) => {
    const cust: CustomerUser = {
      id: `google-${Date.now()}`,
      name: googleName || 'Google User',
      email: googleEmail,
      role: 'customer',
      avatarUrl,
      addresses: [DEMO_ADDRESS],
      defaultAddressId: DEMO_ADDRESS.id,
    };
    loginAs('customer', cust);
  };

  const signup = async (
    requestedRole: UserRole,
    email: string,
    pass: string,
    name: string,
    phone?: string,
    initialAddress?: Partial<DeliveryAddress>
  ): Promise<{ success: boolean; error?: string; user?: AnyUser }> => {
    const addresses: DeliveryAddress[] = [];
    if (initialAddress && initialAddress.addressLine1) {
      addresses.push({
        id: `addr-${Date.now()}`,
        label: initialAddress.label || 'Home',
        recipientName: name,
        phone: phone || '',
        addressLine1: initialAddress.addressLine1,
        addressLine2: initialAddress.addressLine2 || '',
        landmark: initialAddress.landmark || '',
        city: initialAddress.city || 'Coimbatore',
        state: initialAddress.state || 'Tamil Nadu',
        pincode: initialAddress.pincode || '641012',
        isDefault: true,
      });
    } else {
      addresses.push(DEMO_ADDRESS);
    }

    const newUser: CustomerUser = {
      id: `cust-${Date.now()}`,
      name,
      email: email.toLowerCase(),
      phone,
      role: 'customer',
      addresses,
      defaultAddressId: addresses[0]?.id,
    };

    loginAs('customer', newUser);
    return { success: true, user: newUser };
  };

  const logout = async () => {
    removeCookie('sakthi_user_role');
    removeCookie('bc_user_role');
    localStorage.removeItem('sakthi_user_role');
    localStorage.removeItem('sakthi_custom_user');
    setUser(null);
    setRole('customer');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated: !!user,
        isLoaded,
        loginAs,
        updateCustomerProfile,
        addDeliveryAddress,
        updateDeliveryAddress,
        deleteDeliveryAddress,
        setDefaultDeliveryAddress,
        login,
        loginWithGoogle,
        loginWithGoogleProfile,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
