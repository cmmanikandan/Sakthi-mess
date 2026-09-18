-- ==============================================================================
-- SAKTHI MESS — PostgreSQL Database Schema
-- Production Schema for Online Food Ordering & Doorstep Delivery Platform
-- ==============================================================================

-- 1. Users & Roles
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    password_hash TEXT,
    role TEXT NOT NULL CHECK (role IN ('customer', 'kitchen_staff', 'delivery_staff', 'admin')),
    avatar_url TEXT,
    status TEXT DEFAULT 'Active',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 2. Customer Saved Delivery Addresses
CREATE TABLE IF NOT EXISTS customer_addresses (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    label TEXT NOT NULL CHECK (label IN ('Home', 'Work', 'Other')),
    recipient_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    address_line1 TEXT NOT NULL,
    address_line2 TEXT,
    landmark TEXT,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    pincode TEXT NOT NULL,
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 3. Categories
CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    label TEXT NOT NULL,
    icon TEXT,
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true
);

-- 4. Foods Menu
CREATE TABLE IF NOT EXISTS foods (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    tamil_name TEXT,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    original_price NUMERIC(10, 2),
    rating NUMERIC(3, 2) DEFAULT 4.8,
    rating_count INT DEFAULT 120,
    category_id TEXT NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    available_meals TEXT[] DEFAULT '{}',
    image_url TEXT NOT NULL,
    is_available BOOLEAN DEFAULT true,
    is_visible BOOLEAN DEFAULT true,
    is_veg BOOLEAN DEFAULT true,
    is_popular BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    preparation_time TEXT DEFAULT '15 min',
    ingredients TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 5. Orders (with complete delivery address snapshot and lifecycle)
CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,                       -- e.g. "SM-1001"
    order_number TEXT UNIQUE NOT NULL,         -- e.g. "SM-1001"
    user_id TEXT NOT NULL REFERENCES users(id),
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT,

    -- Immutable delivery address snapshot
    delivery_label TEXT NOT NULL,
    delivery_recipient_name TEXT NOT NULL,
    delivery_phone TEXT NOT NULL,
    delivery_address_line1 TEXT NOT NULL,
    delivery_address_line2 TEXT,
    delivery_landmark TEXT,
    delivery_city TEXT NOT NULL,
    delivery_state TEXT NOT NULL,
    delivery_pincode TEXT NOT NULL,
    delivery_latitude NUMERIC(10, 7),
    delivery_longitude NUMERIC(10, 7),

    subtotal NUMERIC(10, 2) NOT NULL,
    delivery_fee NUMERIC(10, 2) DEFAULT 0.00 NOT NULL,
    discount NUMERIC(10, 2) DEFAULT 0.00 NOT NULL,
    tax NUMERIC(10, 2) DEFAULT 0.00 NOT NULL,
    total NUMERIC(10, 2) NOT NULL,

    order_status TEXT NOT NULL DEFAULT 'PLACED' CHECK (
        order_status IN ('PLACED', 'ACCEPTED', 'PREPARING', 'PACKING', 'READY', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED', 'REJECTED')
    ),
    payment_status TEXT NOT NULL DEFAULT 'PENDING' CHECK (
        payment_status IN ('PENDING', 'PAID', 'FAILED')
    ),
    payment_method TEXT NOT NULL DEFAULT 'ONLINE_RAZORPAY' CHECK (
        payment_method IN ('ONLINE_RAZORPAY', 'CASH_ON_DELIVERY')
    ),
    payment_id TEXT,
    razorpay_order_id TEXT,

    special_instructions TEXT,
    assigned_kitchen_staff_id TEXT REFERENCES users(id),
    assigned_delivery_staff_id TEXT REFERENCES users(id),
    estimated_delivery_minutes INT DEFAULT 30,

    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    delivered_at TIMESTAMPTZ
);

-- 6. Order Items (Preserving historical price)
CREATE TABLE IF NOT EXISTS order_items (
    id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    food_id TEXT NOT NULL REFERENCES foods(id),
    food_name TEXT NOT NULL,
    food_image_url TEXT,
    unit_price NUMERIC(10, 2) NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    subtotal NUMERIC(10, 2) NOT NULL,
    notes TEXT
);

-- 7. Staff Registry
CREATE TABLE IF NOT EXISTS staff (
    id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    staff_type TEXT NOT NULL CHECK (staff_type IN ('kitchen_staff', 'delivery_staff')),
    shift_status TEXT DEFAULT 'Online' CHECK (shift_status IN ('Online', 'Offline', 'Busy')),
    vehicle_info TEXT,
    active_deliveries_count INT DEFAULT 0
);

-- 8. Coupons
CREATE TABLE IF NOT EXISTS coupons (
    id TEXT PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'flat')),
    discount_value NUMERIC(10, 2) NOT NULL,
    min_order NUMERIC(10, 2) DEFAULT 0,
    max_discount NUMERIC(10, 2),
    is_active BOOLEAN DEFAULT true,
    expires_at TIMESTAMPTZ
);

-- 9. Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'order',
    is_read BOOLEAN DEFAULT false,
    order_id TEXT REFERENCES orders(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);
