import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { CanteenProvider } from '@/context/CanteenContext';
import { CartProvider } from '@/context/CartContext';
import { PwaInstallPrompt } from '@/components/common/PwaInstallPrompt';
import { AppInitializer } from '@/components/splash/AppInitializer';

export const metadata: Metadata = {
  title: 'SAKTHI MESS — Online Food Ordering',
  description: 'Order delicious food from SAKTHI MESS and get it delivered to your doorstep.',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.png',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'SAKTHI MESS — Online Food Ordering',
    description: 'Order delicious food from SAKTHI MESS and get it delivered to your doorstep.',
    type: 'website',
    images: ['/logo.png'],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#E23744',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#FFFFFF] text-[#1C1C1C] antialiased selection:bg-rose-100 selection:text-rose-900">
        <AuthProvider>
          <CanteenProvider>
            <CartProvider>
              <AppInitializer />
              <PwaInstallPrompt />
              <main className="min-h-screen flex flex-col">
                {children}
              </main>
            </CartProvider>
          </CanteenProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
