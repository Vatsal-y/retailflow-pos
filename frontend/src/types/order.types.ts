// Payment method enum
export type PaymentMethod = 'CASH' | 'CARD' | 'UPI' | 'WALLET';

// Order status enum
export type OrderStatus = 'PENDING' | 'COMPLETED' | 'CANCELLED' | 'REFUNDED';

// Order item
export interface OrderItem {
    id?: number;
    productId: number;
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
}

// Order entity
export interface Order {
    id: number;
    orderNumber: string;
    branchId: number;
    customerId?: number | null;
    cashierId: number;
    items: OrderItem[];
    subtotal: number;
    discountAmount: number;
    discountPercentage: number;
    taxAmount: number;
    totalAmount: number;
    paymentMethod: PaymentMethod;
    status: OrderStatus;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

// Order create request
export interface OrderRequest {
    branchId: number;
    customerId?: number | null;
    cashierId: number;
    items: OrderItem[];
    subtotal: number;
    discountAmount?: number;
    discountPercentage?: number;
    totalAmount: number;
    paymentMethod: PaymentMethod;
    notes?: string;
}

// Cart item (for POS)
export interface CartItem {
    productId: number;
    productName: string;
    price: number;
    quantity: number;
    image?: string;
}

// Customer entity
export interface Customer {
    id: number;
    storeId: number;
    name: string;
    phone?: string;
    email?: string;
    address?: string;
    loyaltyPoints: number;
    createdAt: string;
    updatedAt: string;
}

// Customer create/update request
export interface CustomerRequest {
    storeId: number;
    name: string;
    phone?: string;
    email?: string;
    address?: string;
}

// Refund entity
export interface Refund {
    id: number;
    orderId: number;
    amount: number;
    reason: string;
    processedBy: number;
    approvedBy?: number;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    createdAt: string;
    updatedAt: string;
}
