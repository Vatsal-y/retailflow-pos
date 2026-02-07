import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistanceToNow } from 'date-fns';

// Combine class names with Tailwind merge
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Format currency (INR)
export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2,
    }).format(amount);
}

// Format date
export function formatDate(date: string | Date, formatStr: string = 'dd MMM yyyy'): string {
    return format(new Date(date), formatStr);
}

// Format date time
export function formatDateTime(date: string | Date): string {
    return format(new Date(date), 'dd MMM yyyy, HH:mm');
}

// Format relative time
export function formatRelativeTime(date: string | Date): string {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
}

// Generate order number
export function generateOrderNumber(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `ORD-${timestamp}-${random}`;
}

// Calculate cart totals
export function calculateCartTotals(
    items: { price: number; quantity: number }[],
    discountPercent: number = 0,
    taxPercent: number = 18
) {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discountAmount = (subtotal * discountPercent) / 100;
    const taxableAmount = subtotal - discountAmount;
    const taxAmount = (taxableAmount * taxPercent) / 100;
    const total = taxableAmount + taxAmount;

    return {
        subtotal,
        discountAmount,
        taxAmount,
        total,
        itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    };
}

// Debounce function
export function debounce<T extends (...args: unknown[]) => unknown>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    return (...args: Parameters<T>) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => func(...args), wait);
    };
}

// Get initials from name
export function getInitials(name: string): string {
    return name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

// Payment method display names
export const PAYMENT_METHODS = {
    CASH: { label: 'Cash', icon: 'Banknote' },
    CARD: { label: 'Card', icon: 'CreditCard' },
    UPI: { label: 'UPI', icon: 'Smartphone' },
    WALLET: { label: 'Wallet', icon: 'Wallet' },
} as const;

// Order status colors
export const ORDER_STATUS_COLORS = {
    PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    COMPLETED: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    CANCELLED: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    REFUNDED: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
} as const;

// Role display names
export const ROLE_DISPLAY_NAMES = {
    SUPER_ADMIN: 'Super Admin',
    STORE_ADMIN: 'Store Admin',
    BRANCH_MANAGER: 'Branch Manager',
    CASHIER: 'Cashier',
} as const;

// Local storage keys
export const STORAGE_KEYS = {
    TOKEN: 'retailflow_token',
    REFRESH_TOKEN: 'retailflow_refresh_token',
    USER: 'retailflow_user',
    THEME: 'retailflow_theme',
} as const;
