import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  sku: string;
}

interface CartState {
  items: CartItem[];
  customerId: string | null;
  customerName: string | null;
  discount: number;
  discountType: 'fixed' | 'percentage';
  taxRate: number;
  
  // Actions
  addItem: (product: Omit<CartItem, 'id' | 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  incrementQuantity: (id: string) => void;
  decrementQuantity: (id: string) => void;
  clearCart: () => void;
  setCustomer: (id: string | null, name: string | null) => void;
  setDiscount: (amount: number, type: 'fixed' | 'percentage') => void;
  clearDiscount: () => void;
  
  // Computed
  getSubtotal: () => number;
  getDiscountAmount: () => number;
  getTax: () => number;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      customerId: null,
      customerName: null,
      discount: 0,
      discountType: 'fixed',
      taxRate: 0.08, // 8% default tax
      
      addItem: (product) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.productId === product.productId
          );
          
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.productId === product.productId
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          }
          
          return {
            items: [
              ...state.items,
              {
                ...product,
                id: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                quantity: 1,
              },
            ],
          };
        });
      },
      
      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },
      
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        }));
      },
      
      incrementQuantity: (id) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity: item.quantity + 1 } : item
          ),
        }));
      },
      
      decrementQuantity: (id) => {
        const item = get().items.find((i) => i.id === id);
        if (item && item.quantity <= 1) {
          get().removeItem(id);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity: item.quantity - 1 } : item
          ),
        }));
      },
      
      clearCart: () => {
        set({
          items: [],
          customerId: null,
          customerName: null,
          discount: 0,
          discountType: 'fixed',
        });
      },
      
      setCustomer: (id, name) => {
        set({ customerId: id, customerName: name });
      },
      
      setDiscount: (amount, type) => {
        set({ discount: amount, discountType: type });
      },
      
      clearDiscount: () => {
        set({ discount: 0, discountType: 'fixed' });
      },
      
      getSubtotal: () => {
        return get().items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
      },
      
      getDiscountAmount: () => {
        const { discount, discountType } = get();
        const subtotal = get().getSubtotal();
        
        if (discountType === 'percentage') {
          return subtotal * (discount / 100);
        }
        return discount;
      },
      
      getTax: () => {
        const subtotal = get().getSubtotal();
        const discountAmount = get().getDiscountAmount();
        return (subtotal - discountAmount) * get().taxRate;
      },
      
      getTotal: () => {
        const subtotal = get().getSubtotal();
        const discountAmount = get().getDiscountAmount();
        const tax = get().getTax();
        return subtotal - discountAmount + tax;
      },
      
      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: 'pos-cart',
    }
  )
);
