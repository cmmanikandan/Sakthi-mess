# SAKTHI MESS
## Online Food Ordering & Home Delivery Platform

A modern, full-stack digital food ordering and doorstep delivery platform built for **SAKTHI MESS**. Customers can discover authentic South Indian dishes, place orders, make secure digital payments, and receive their food directly at their home or business delivery address with real-time order lifecycle tracking.

---

## 🌟 Key Features

### 1. Customer Experience
- **Doorstep Delivery Address System**: Save multiple addresses (Home, Work, Other) with recipient details, street address, landmark, city, and pincode.
- **Rich Digital Menu**: Authentic South Indian meals, Chettinad Biryani, Bun Parotta, Dosas, Gravies, and Starters with veg/non-veg badges, preparation times, and real-time availability.
- **Dynamic Search & Filtering**: Instant search by dish name, meal category, or dietary preferences.
- **Smooth Cart & Checkout**: Real-time subtotal, configurable delivery fee calculation (free delivery above ₹300), and special cooking instructions.
- **Secure Payment Gateway**: Multi-payment support including UPI, Credit/Debit Cards, Net Banking, and Cash on Delivery.
- **Live Order Tracking**: Real-time order progress timeline:
  `PLACED` → `ACCEPTED` → `PREPARING` → `PACKING` → `READY` → `OUT_FOR_DELIVERY` → `DELIVERED`
- **Order History & 1-Tap Reorder**: Access active and past orders, detailed item receipts, and instant reordering.
- **Favorites & Profiles**: Save favorite dishes, manage personal info, and access delivery history.

### 2. Kitchen Staff Portal (`/kitchen`)
- **Live Kitchen Order Board**: Real-time Kanban columns for New Orders, Accepted, Preparing, Packing, and Ready.
- **Kitchen Display System (KDS)**: High-contrast, large-screen display optimized for kitchen TV monitors and tablets.
- **One-Click Order Workflow**: Accept orders, begin preparation, start packing, and mark ready for delivery pickup.

### 3. Delivery Staff Portal (`/delivery`)
- **Delivery Dispatch Board**: View assigned orders ready for pickup.
- **Customer Navigation & Contact**: 1-tap direct phone call and Google Maps navigation to customer addresses.
- **Live Status Progression**: Transition orders from `READY` → `OUT_FOR_DELIVERY` → `DELIVERED`.

### 4. Admin Management Portal (`/admin`)
- **Executive Dashboard**: Real-time metrics for today's sales, active orders, fulfillment rate, and category revenue share.
- **POS & Counter Billing**: Instant counter ticketing, bill generation, and printable thermal receipts.
- **Menu Catalog Management**: Add, edit, remove dishes, update pricing, and toggle instant availability (In Stock / Sold Out).
- **Staff Management**: Add and manage Kitchen and Delivery personnel.
- **Sales Reports & CSV Export**: 7-day revenue trends, peak rush hours analysis, top-selling dishes, and CSV export.
- **System & Delivery Settings**: Configure brand details, operating hours, delivery fees, and free delivery thresholds.

---

## 🛠️ Technology Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, Vanilla CSS design tokens
- **Animations**: Framer Motion, Canvas Confetti
- **Icons**: Lucide React
- **Payments**: Razorpay Payment Gateway integration
- **Database Schema**: PostgreSQL clean relational architecture (`database/schema.sql`)
- **PWA**: Progressive Web App with standalone installation & offline caching

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or 20.x
- npm or pnpm

### Installation
```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

Visit `http://localhost:3000` to view the application.

### Demo Roles (1-Tap Quick Login)
On `/login`, you can switch between all 4 system roles with 1 click:
- **Customer**: `customer@sakthimess.com` / `customer123`
- **Kitchen Staff**: `kitchen@sakthimess.com` / `kitchen123`
- **Delivery Staff**: `delivery@sakthimess.com` / `delivery123`
- **Admin**: `admin@sakthimess.com` / `admin123`

---

## 📁 Project Structure
```
├── database/
│   └── schema.sql             # PostgreSQL production schema
├── public/                    # SAKTHI MESS brand assets, PWA icons, manifest
├── src/
│   ├── app/
│   │   ├── admin/             # Admin management & POS pages
│   │   ├── api/               # API endpoints (Razorpay, health check)
│   │   ├── customer/          # Customer portal (menu, cart, checkout, orders, profile)
│   │   ├── delivery/          # Delivery staff portal
│   │   ├── kitchen/           # Kitchen staff dashboard & KDS
│   │   ├── login/             # Authentication & role sign-in
│   │   ├── globals.css        # Core design tokens (#E23744 theme)
│   │   ├── layout.tsx         # Root layout with SEO metadata
│   │   └── page.tsx           # Premium landing page
│   ├── components/
│   │   ├── common/            # BrandLogo, PwaPrompt, Simulator
│   │   ├── customer/          # FoodCard, Navigations, CartBar, Banners
│   │   └── splash/            # Splash screen loaders
│   ├── context/
│   │   ├── AuthContext.tsx    # Customer & Staff auth, addresses CRUD
│   │   ├── CanteenContext.tsx # Order lifecycle dispatcher, real-time cross-tab sync
│   │   └── CartContext.tsx    # Cart state & delivery fee computation
│   ├── data/
│   │   └── initialData.ts     # Authentic South Indian menu & presets
│   ├── middleware.ts          # Role-based route guard & legacy redirects
│   └── types/
│       └── index.ts           # Type definitions (Order, DeliveryAddress, FoodItem, Roles)
└── tailwind.config.ts         # Theme configuration
```

---

## 📄 License
Private & Confidential — SAKTHI MESS. All rights reserved.
