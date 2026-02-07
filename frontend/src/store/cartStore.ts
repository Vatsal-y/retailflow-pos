import { create } from 'zustand';
import type { CartItem, Customer, PaymentMethod } from '@/types';
import { calculateCartTotals } from '@/lib/utils';

interface CartState {
    items: CartItem[];
    customer: Customer | null;
    paymentMethod: PaymentMethod;
    discountPercent: number;
    notes: string;

    // Computed values
    subtotal: number;
    discountAmount: number;
    taxAmount: number;
    total: number;
    itemCount: number;

    // Actions
    addItem: (item: Omit<CartItem, 'quantity'>) => void;
    removeItem: (productId: number) => void;
    updateQuantity: (productId: number, quantity: number) => void;
    setCustomer: (customer: Customer | null) => void;
    setPaymentMethod: (method: PaymentMethod) => void;
    setDiscountPercent: (percent: number) => void;
    setNotes: (notes: string) => void;
    clearCart: () => void;
    recalculate: () => void;
}

const TAX_RATE = Number(import.meta.env.VITE_DEFAULT_TAX_RATE) || 18;

export const useCartStore = create<CartState>((set, get) => ({
    items: [],
    customer: null,
    paymentMethod: 'CASH',
    discountPercent: 0,
    notes: '',
    subtotal: 0,
    discountAmount: 0,
    taxAmount: 0,
    total: 0,
    itemCount: 0,

    addItem: (item) => {
        const { items } = get();
        const existingIndex = items.findIndex((i) => i.productId === item.productId);

        if (existingIndex >= 0) {
            // Increase quantity
            const newItems = [...items];
            newItems[existingIndex].quantity += 1;
            set({ items: newItems });
        } else {
            // Add new item
            set({ items: [...items, { ...item, quantity: 1 }] });
        }
        get().recalculate();
    },

    removeItem: (productId) => {
        const { items } = get();
        set({ items: items.filter((i) => i.productId !== productId) });
        get().recalculate();
    },

    updateQuantity: (productId, quantity) => {
        const { items } = get();
        if (quantity <= 0) {
            get().removeItem(productId);
            return;
        }
        const newItems = items.map((i) =>
            i.productId === productId ? { ...i, quantity } : i
        );
        set({ items: newItems });
        get().recalculate();
    },

    setCustomer: (customer) => set({ customer }),
    setPaymentMethod: (method) => set({ paymentMethod: method }),
    setDiscountPercent: (percent) => {
        set({ discountPercent: percent });
        get().recalculate();
    },
    setNotes: (notes) => set({ notes }),

    clearCart: () => {
        set({
            items: [],
            customer: null,
            paymentMethod: 'CASH',
            discountPercent: 0,
            notes: '',
            subtotal: 0,
            discountAmount: 0,
            taxAmount: 0,
            total: 0,
            itemCount: 0,
        });
    },

    recalculate: () => {
        const { items, discountPercent } = get();
        const totals = calculateCartTotals(
            items.map((i) => ({ price: i.price, quantity: i.quantity })),
            discountPercent,
            TAX_RATE
        );
        set({
            subtotal: totals.subtotal,
            discountAmount: totals.discountAmount,
            taxAmount: totals.taxAmount,
            total: totals.total,
            itemCount: totals.itemCount,
        });
    },
}));
