import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return `₹${price.toLocaleString('en-IN')}`;
}

export function generateOrderNumber(existingCount = 0): string {
  // Human-readable sequential order number starting at SM-1001
  const num = 1001 + existingCount;
  return `SM-${num}`;
}

export function generateOrderId(): string {
  // Fast random human-readable order number if count unknown
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `SM-${randomSuffix}`;
}

export function formatTime12h(time24: string): string {
  if (!time24) return '';
  const [hourStr, minStr] = time24.split(':');
  let hour = parseInt(hourStr, 10);
  const min = minStr || '00';
  const period = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12 || 12;
  return `${hour}:${min} ${period}`;
}

export function formatDateTime(iso: string): { date: string; time: string } {
  if (!iso) return { date: '', time: '' };
  try {
    const d = new Date(iso);
    return {
      date: d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      time: d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
    };
  } catch {
    return { date: '', time: '' };
  }
}

export function parseMinutes(time24: string): number {
  if (!time24) return 0;
  const [h, m] = time24.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
}

export function getGreeting(hours: number): string {
  if (hours < 12) return 'Good Morning';
  if (hours < 17) return 'Good Afternoon';
  return 'Good Evening';
}
