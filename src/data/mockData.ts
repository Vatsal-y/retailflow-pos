import { Product } from '@/store/slices/productSlice';
import { Category } from '@/store/slices/categorySlice';
import { Customer } from '@/store/slices/customerSlice';
import { Order } from '@/store/slices/orderSlice';

export const mockCategories: Category[] = [
  { id: '1', name: 'Beverages', slug: 'beverages', productCount: 24, isActive: true, sortOrder: 1, createdAt: '2024-01-01' },
  { id: '2', name: 'Snacks', slug: 'snacks', productCount: 18, isActive: true, sortOrder: 2, createdAt: '2024-01-01' },
  { id: '3', name: 'Dairy', slug: 'dairy', productCount: 12, isActive: true, sortOrder: 3, createdAt: '2024-01-01' },
  { id: '4', name: 'Bakery', slug: 'bakery', productCount: 15, isActive: true, sortOrder: 4, createdAt: '2024-01-01' },
  { id: '5', name: 'Fresh Produce', slug: 'fresh-produce', productCount: 30, isActive: true, sortOrder: 5, createdAt: '2024-01-01' },
  { id: '6', name: 'Frozen', slug: 'frozen', productCount: 20, isActive: true, sortOrder: 6, createdAt: '2024-01-01' },
];

export const mockProducts: Product[] = [
  { id: '1', name: 'Coca Cola 500ml', sku: 'BEV001', barcode: '123456789', categoryId: '1', categoryName: 'Beverages', price: 2.50, stock: 150, lowStockThreshold: 20, unit: 'pcs', isActive: true, createdAt: '2024-01-01', image: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=200&h=200&fit=crop' },
  { id: '2', name: 'Pepsi 500ml', sku: 'BEV002', barcode: '123456790', categoryId: '1', categoryName: 'Beverages', price: 2.50, stock: 120, lowStockThreshold: 20, unit: 'pcs', isActive: true, createdAt: '2024-01-01', image: 'https://images.unsplash.com/photo-1553456558-aff63285bdd1?w=200&h=200&fit=crop' },
  { id: '3', name: 'Orange Juice 1L', sku: 'BEV003', categoryId: '1', categoryName: 'Beverages', price: 4.99, stock: 80, lowStockThreshold: 15, unit: 'pcs', isActive: true, createdAt: '2024-01-01', image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=200&h=200&fit=crop' },
  { id: '4', name: 'Mineral Water 1L', sku: 'BEV004', categoryId: '1', categoryName: 'Beverages', price: 1.50, stock: 200, lowStockThreshold: 30, unit: 'pcs', isActive: true, createdAt: '2024-01-01', image: 'https://images.unsplash.com/photo-1560023907-5f339617ea30?w=200&h=200&fit=crop' },
  { id: '5', name: 'Lays Classic 150g', sku: 'SNK001', categoryId: '2', categoryName: 'Snacks', price: 3.99, stock: 75, lowStockThreshold: 15, unit: 'pcs', isActive: true, createdAt: '2024-01-01', image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=200&h=200&fit=crop' },
  { id: '6', name: 'Pringles Original', sku: 'SNK002', categoryId: '2', categoryName: 'Snacks', price: 4.50, stock: 60, lowStockThreshold: 10, unit: 'pcs', isActive: true, createdAt: '2024-01-01', image: 'https://images.unsplash.com/photo-1621447504864-d8686e12698c?w=200&h=200&fit=crop' },
  { id: '7', name: 'Chocolate Cookies', sku: 'SNK003', categoryId: '2', categoryName: 'Snacks', price: 2.99, stock: 90, lowStockThreshold: 20, unit: 'pcs', isActive: true, createdAt: '2024-01-01', image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=200&h=200&fit=crop' },
  { id: '8', name: 'Whole Milk 1L', sku: 'DAI001', categoryId: '3', categoryName: 'Dairy', price: 3.49, stock: 50, lowStockThreshold: 10, unit: 'pcs', isActive: true, createdAt: '2024-01-01', image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=200&h=200&fit=crop' },
  { id: '9', name: 'Cheddar Cheese 200g', sku: 'DAI002', categoryId: '3', categoryName: 'Dairy', price: 5.99, stock: 35, lowStockThreshold: 8, unit: 'pcs', isActive: true, createdAt: '2024-01-01', image: 'https://images.unsplash.com/photo-1618164436241-4473940d1f5c?w=200&h=200&fit=crop' },
  { id: '10', name: 'Greek Yogurt 500g', sku: 'DAI003', categoryId: '3', categoryName: 'Dairy', price: 4.49, stock: 40, lowStockThreshold: 10, unit: 'pcs', isActive: true, createdAt: '2024-01-01', image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=200&h=200&fit=crop' },
  { id: '11', name: 'Croissant', sku: 'BAK001', categoryId: '4', categoryName: 'Bakery', price: 2.50, stock: 25, lowStockThreshold: 5, unit: 'pcs', isActive: true, createdAt: '2024-01-01', image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=200&h=200&fit=crop' },
  { id: '12', name: 'Sourdough Bread', sku: 'BAK002', categoryId: '4', categoryName: 'Bakery', price: 4.99, stock: 15, lowStockThreshold: 5, unit: 'pcs', isActive: true, createdAt: '2024-01-01', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&h=200&fit=crop' },
  { id: '13', name: 'Fresh Apples 1kg', sku: 'PRD001', categoryId: '5', categoryName: 'Fresh Produce', price: 3.99, stock: 100, lowStockThreshold: 20, unit: 'kg', isActive: true, createdAt: '2024-01-01', image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=200&h=200&fit=crop' },
  { id: '14', name: 'Bananas 1kg', sku: 'PRD002', categoryId: '5', categoryName: 'Fresh Produce', price: 2.49, stock: 80, lowStockThreshold: 15, unit: 'kg', isActive: true, createdAt: '2024-01-01', image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=200&h=200&fit=crop' },
  { id: '15', name: 'Frozen Pizza', sku: 'FRZ001', categoryId: '6', categoryName: 'Frozen', price: 7.99, stock: 30, lowStockThreshold: 8, unit: 'pcs', isActive: true, createdAt: '2024-01-01', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&h=200&fit=crop' },
  { id: '16', name: 'Ice Cream 500ml', sku: 'FRZ002', categoryId: '6', categoryName: 'Frozen', price: 5.49, stock: 45, lowStockThreshold: 10, unit: 'pcs', isActive: true, createdAt: '2024-01-01', image: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=200&h=200&fit=crop' },
];

export const mockCustomers: Customer[] = [
  { id: '1', name: 'John Smith', phone: '+1 555-0101', email: 'john@example.com', loyaltyPoints: 1250, totalOrders: 45, totalSpent: 1850.00, createdAt: '2023-06-15', lastOrderAt: '2024-01-15' },
  { id: '2', name: 'Sarah Johnson', phone: '+1 555-0102', email: 'sarah@example.com', loyaltyPoints: 890, totalOrders: 32, totalSpent: 1420.50, createdAt: '2023-08-20', lastOrderAt: '2024-01-14' },
  { id: '3', name: 'Michael Brown', phone: '+1 555-0103', email: 'michael@example.com', loyaltyPoints: 2100, totalOrders: 78, totalSpent: 3200.00, createdAt: '2023-03-10', lastOrderAt: '2024-01-16' },
  { id: '4', name: 'Emily Davis', phone: '+1 555-0104', loyaltyPoints: 450, totalOrders: 15, totalSpent: 580.25, createdAt: '2023-11-05', lastOrderAt: '2024-01-10' },
  { id: '5', name: 'David Wilson', phone: '+1 555-0105', email: 'david@example.com', loyaltyPoints: 1780, totalOrders: 62, totalSpent: 2650.75, createdAt: '2023-04-22', lastOrderAt: '2024-01-15' },
];

export const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-2024-001',
    customerId: '1',
    customerName: 'John Smith',
    items: [
      { id: '1', productId: '1', name: 'Coca Cola 500ml', quantity: 2, price: 2.50, total: 5.00 },
      { id: '2', productId: '5', name: 'Lays Classic 150g', quantity: 1, price: 3.99, total: 3.99 },
    ],
    subtotal: 8.99,
    tax: 0.72,
    discount: 0,
    total: 9.71,
    paymentMethod: 'card',
    status: 'paid',
    cashierId: 'cashier-1',
    branchId: 'branch-1',
    createdAt: '2024-01-16T10:30:00Z',
    paidAt: '2024-01-16T10:30:15Z',
  },
  {
    id: '2',
    orderNumber: 'ORD-2024-002',
    customerName: 'Walk-in Customer',
    items: [
      { id: '1', productId: '8', name: 'Whole Milk 1L', quantity: 2, price: 3.49, total: 6.98 },
      { id: '2', productId: '11', name: 'Croissant', quantity: 3, price: 2.50, total: 7.50 },
    ],
    subtotal: 14.48,
    tax: 1.16,
    discount: 0,
    total: 15.64,
    paymentMethod: 'cash',
    status: 'paid',
    cashierId: 'cashier-1',
    branchId: 'branch-1',
    createdAt: '2024-01-16T11:15:00Z',
    paidAt: '2024-01-16T11:15:30Z',
  },
  {
    id: '3',
    orderNumber: 'ORD-2024-003',
    customerId: '3',
    customerName: 'Michael Brown',
    items: [
      { id: '1', productId: '15', name: 'Frozen Pizza', quantity: 2, price: 7.99, total: 15.98 },
      { id: '2', productId: '16', name: 'Ice Cream 500ml', quantity: 1, price: 5.49, total: 5.49 },
      { id: '3', productId: '3', name: 'Orange Juice 1L', quantity: 2, price: 4.99, total: 9.98 },
    ],
    subtotal: 31.45,
    tax: 2.52,
    discount: 0,
    total: 33.97,
    paymentMethod: 'upi',
    status: 'paid',
    cashierId: 'cashier-1',
    branchId: 'branch-1',
    createdAt: '2024-01-16T12:00:00Z',
    paidAt: '2024-01-16T12:00:45Z',
  },
];

export const mockDailySales = [
  { date: '2024-01-10', revenue: 2450, orders: 85, avgOrderValue: 28.82 },
  { date: '2024-01-11', revenue: 2780, orders: 92, avgOrderValue: 30.22 },
  { date: '2024-01-12', revenue: 3120, orders: 105, avgOrderValue: 29.71 },
  { date: '2024-01-13', revenue: 3850, orders: 125, avgOrderValue: 30.80 },
  { date: '2024-01-14', revenue: 3650, orders: 118, avgOrderValue: 30.93 },
  { date: '2024-01-15', revenue: 2890, orders: 95, avgOrderValue: 30.42 },
  { date: '2024-01-16', revenue: 2150, orders: 72, avgOrderValue: 29.86 },
];

export const mockTopProducts = [
  { productId: '1', productName: 'Coca Cola 500ml', quantity: 245, revenue: 612.50 },
  { productId: '5', productName: 'Lays Classic 150g', quantity: 180, revenue: 718.20 },
  { productId: '8', productName: 'Whole Milk 1L', quantity: 156, revenue: 544.44 },
  { productId: '11', productName: 'Croissant', quantity: 142, revenue: 355.00 },
  { productId: '3', productName: 'Orange Juice 1L', quantity: 128, revenue: 638.72 },
];

export const mockPaymentBreakdown = [
  { method: 'Cash', amount: 8500, percentage: 35 },
  { method: 'Card', amount: 9200, percentage: 38 },
  { method: 'UPI', amount: 5100, percentage: 21 },
  { method: 'Wallet', amount: 1450, percentage: 6 },
];
