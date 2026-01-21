// Branch-related mock data for dashboards

export interface Branch {
  id: string;
  name: string;
  code: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  manager: string;
  status: 'active' | 'inactive';
  revenue: number;
  orders: number;
  employees: number;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'cashier' | 'branch_manager' | 'store_admin';
  branchId: string;
  branchName: string;
  status: 'active' | 'inactive';
  hireDate: string;
  salary: number;
  performance: number;
  avatar?: string;
}

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  stock: number;
  reorderLevel: number;
  costPrice: number;
  sellingPrice: number;
  lastRestocked: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
}

export interface StoreRequest {
  id: string;
  storeName: string;
  ownerName: string;
  email: string;
  phone: string;
  location: string;
  businessType: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  plan: string;
}

export interface Subscription {
  id: string;
  storeName: string;
  plan: 'starter' | 'professional' | 'enterprise';
  status: 'active' | 'trial' | 'expired' | 'cancelled';
  startDate: string;
  endDate: string;
  mrr: number;
  users: number;
  branches: number;
}

export const mockBranches: Branch[] = [
  { id: 'B001', name: 'Downtown Mall', code: 'DTM', address: '123 Main St', city: 'Mumbai', state: 'Maharashtra', phone: '9876543210', manager: 'Rahul Kumar', status: 'active', revenue: 125000, orders: 428, employees: 12 },
  { id: 'B002', name: 'City Center', code: 'CTC', address: '456 Park Ave', city: 'Mumbai', state: 'Maharashtra', phone: '9876543211', manager: 'Priya Sharma', status: 'active', revenue: 98000, orders: 356, employees: 8 },
  { id: 'B003', name: 'Airport Store', code: 'ARP', address: '789 Airport Rd', city: 'Mumbai', state: 'Maharashtra', phone: '9876543212', manager: 'Amit Patel', status: 'active', revenue: 75000, orders: 245, employees: 6 },
  { id: 'B004', name: 'Tech Park', code: 'TKP', address: '321 Tech Blvd', city: 'Pune', state: 'Maharashtra', phone: '9876543213', manager: 'Sneha Reddy', status: 'active', revenue: 89000, orders: 312, employees: 10 },
  { id: 'B005', name: 'Suburban Outlet', code: 'SUB', address: '654 Suburb Lane', city: 'Thane', state: 'Maharashtra', phone: '9876543214', manager: 'Vikram Singh', status: 'inactive', revenue: 45000, orders: 156, employees: 4 },
];

export const mockEmployees: Employee[] = [
  { id: 'E001', name: 'John Doe', email: 'john@pospro.com', phone: '9876543210', role: 'cashier', branchId: 'B001', branchName: 'Downtown Mall', status: 'active', hireDate: '2024-03-15', salary: 25000, performance: 92 },
  { id: 'E002', name: 'Jane Smith', email: 'jane@pospro.com', phone: '9876543211', role: 'cashier', branchId: 'B001', branchName: 'Downtown Mall', status: 'active', hireDate: '2024-05-20', salary: 24000, performance: 88 },
  { id: 'E003', name: 'Mike Johnson', email: 'mike@pospro.com', phone: '9876543212', role: 'branch_manager', branchId: 'B002', branchName: 'City Center', status: 'active', hireDate: '2023-08-10', salary: 45000, performance: 95 },
  { id: 'E004', name: 'Sarah Wilson', email: 'sarah@pospro.com', phone: '9876543213', role: 'cashier', branchId: 'B002', branchName: 'City Center', status: 'active', hireDate: '2024-01-05', salary: 23000, performance: 85 },
  { id: 'E005', name: 'David Brown', email: 'david@pospro.com', phone: '9876543214', role: 'cashier', branchId: 'B003', branchName: 'Airport Store', status: 'inactive', hireDate: '2024-02-18', salary: 26000, performance: 78 },
  { id: 'E006', name: 'Emily Davis', email: 'emily@pospro.com', phone: '9876543215', role: 'store_admin', branchId: 'B001', branchName: 'Downtown Mall', status: 'active', hireDate: '2022-11-01', salary: 65000, performance: 97 },
  { id: 'E007', name: 'Robert Taylor', email: 'robert@pospro.com', phone: '9876543216', role: 'cashier', branchId: 'B004', branchName: 'Tech Park', status: 'active', hireDate: '2024-06-12', salary: 24500, performance: 90 },
  { id: 'E008', name: 'Lisa Anderson', email: 'lisa@pospro.com', phone: '9876543217', role: 'branch_manager', branchId: 'B004', branchName: 'Tech Park', status: 'active', hireDate: '2023-04-22', salary: 48000, performance: 93 },
];

export const mockInventory: InventoryItem[] = [
  { id: 'INV001', sku: 'BEV001', name: 'Coca Cola 500ml', category: 'Beverages', stock: 150, reorderLevel: 50, costPrice: 35, sellingPrice: 50, lastRestocked: '2026-01-18', status: 'in_stock' },
  { id: 'INV002', sku: 'BEV002', name: 'Pepsi 500ml', category: 'Beverages', stock: 45, reorderLevel: 50, costPrice: 34, sellingPrice: 50, lastRestocked: '2026-01-15', status: 'low_stock' },
  { id: 'INV003', sku: 'SNK001', name: 'Lays Classic 150g', category: 'Snacks', stock: 75, reorderLevel: 30, costPrice: 45, sellingPrice: 60, lastRestocked: '2026-01-20', status: 'in_stock' },
  { id: 'INV004', sku: 'DAI001', name: 'Whole Milk 1L', category: 'Dairy', stock: 12, reorderLevel: 25, costPrice: 48, sellingPrice: 65, lastRestocked: '2026-01-19', status: 'low_stock' },
  { id: 'INV005', sku: 'BAK001', name: 'Croissant', category: 'Bakery', stock: 0, reorderLevel: 15, costPrice: 35, sellingPrice: 55, lastRestocked: '2026-01-10', status: 'out_of_stock' },
  { id: 'INV006', sku: 'FRZ001', name: 'Frozen Pizza', category: 'Frozen', stock: 28, reorderLevel: 20, costPrice: 180, sellingPrice: 250, lastRestocked: '2026-01-17', status: 'in_stock' },
  { id: 'INV007', sku: 'PRD001', name: 'Fresh Apples 1kg', category: 'Produce', stock: 8, reorderLevel: 25, costPrice: 120, sellingPrice: 180, lastRestocked: '2026-01-21', status: 'low_stock' },
  { id: 'INV008', sku: 'BEV004', name: 'Mineral Water 1L', category: 'Beverages', stock: 200, reorderLevel: 80, costPrice: 18, sellingPrice: 25, lastRestocked: '2026-01-20', status: 'in_stock' },
];

export const mockStoreRequests: StoreRequest[] = [
  { id: 'REQ001', storeName: 'Fresh Mart', ownerName: 'Rajan Mehta', email: 'rajan@freshmart.com', phone: '9876543220', location: 'Bangalore', businessType: 'Supermarket', status: 'pending', submittedAt: '2026-01-20', plan: 'Professional' },
  { id: 'REQ002', storeName: 'Quick Stop', ownerName: 'Ananya Rao', email: 'ananya@quickstop.com', phone: '9876543221', location: 'Chennai', businessType: 'Convenience', status: 'pending', submittedAt: '2026-01-19', plan: 'Starter' },
  { id: 'REQ003', storeName: 'Mega Bazaar', ownerName: 'Suresh Kumar', email: 'suresh@megabazaar.com', phone: '9876543222', location: 'Hyderabad', businessType: 'Hypermarket', status: 'approved', submittedAt: '2026-01-15', plan: 'Enterprise' },
  { id: 'REQ004', storeName: 'Corner Shop', ownerName: 'Priya Menon', email: 'priya@cornershop.com', phone: '9876543223', location: 'Kochi', businessType: 'Retail', status: 'rejected', submittedAt: '2026-01-10', plan: 'Starter' },
];

export const mockSubscriptions: Subscription[] = [
  { id: 'SUB001', storeName: 'Galaxy Retail', plan: 'enterprise', status: 'active', startDate: '2025-01-01', endDate: '2026-01-01', mrr: 15000, users: 45, branches: 5 },
  { id: 'SUB002', storeName: 'City Stores', plan: 'professional', status: 'active', startDate: '2025-03-15', endDate: '2026-03-15', mrr: 8000, users: 18, branches: 2 },
  { id: 'SUB003', storeName: 'Fresh Mart', plan: 'starter', status: 'trial', startDate: '2026-01-10', endDate: '2026-01-24', mrr: 2500, users: 5, branches: 1 },
  { id: 'SUB004', storeName: 'Quick Mart', plan: 'professional', status: 'expired', startDate: '2024-12-01', endDate: '2025-12-01', mrr: 8000, users: 12, branches: 2 },
  { id: 'SUB005', storeName: 'Super Store', plan: 'enterprise', status: 'active', startDate: '2024-06-01', endDate: '2025-06-01', mrr: 18000, users: 60, branches: 8 },
];

export const mockBranchAnalytics = {
  todaySales: 24500,
  todayOrders: 72,
  todayRevenue: 28900,
  avgOrderValue: 340.28,
  weeklyTrend: [
    { day: 'Mon', revenue: 21500 },
    { day: 'Tue', revenue: 24800 },
    { day: 'Wed', revenue: 28900 },
    { day: 'Thu', revenue: 32100 },
    { day: 'Fri', revenue: 38500 },
    { day: 'Sat', revenue: 42000 },
    { day: 'Sun', revenue: 35600 },
  ],
  paymentMethods: [
    { name: 'Cash', value: 8500 },
    { name: 'Card', value: 9200 },
    { name: 'UPI', value: 5100 },
    { name: 'Wallet', value: 1700 },
  ],
  topProducts: [
    { name: 'Coca Cola', sales: 245 },
    { name: 'Lays Chips', sales: 180 },
    { name: 'Milk 1L', sales: 156 },
    { name: 'Bread', sales: 142 },
    { name: 'Orange Juice', sales: 128 },
  ],
};

export const mockStoreAnalytics = {
  totalRevenue: 432000,
  totalOrders: 1456,
  totalBranches: 5,
  activeBranches: 4,
  totalEmployees: 48,
  avgOrderValue: 296.70,
  mrrGrowth: 12.5,
  branchComparison: [
    { branch: 'Downtown Mall', revenue: 125000 },
    { branch: 'City Center', revenue: 98000 },
    { branch: 'Airport Store', revenue: 75000 },
    { branch: 'Tech Park', revenue: 89000 },
    { branch: 'Suburban', revenue: 45000 },
  ],
  monthlyRevenue: [
    { month: 'Jul', revenue: 285000 },
    { month: 'Aug', revenue: 312000 },
    { month: 'Sep', revenue: 298000 },
    { month: 'Oct', revenue: 345000 },
    { month: 'Nov', revenue: 389000 },
    { month: 'Dec', revenue: 412000 },
    { month: 'Jan', revenue: 432000 },
  ],
  categoryPerformance: [
    { name: 'Beverages', value: 35 },
    { name: 'Snacks', value: 25 },
    { name: 'Dairy', value: 18 },
    { name: 'Bakery', value: 12 },
    { name: 'Others', value: 10 },
  ],
};

export const mockSuperAdminAnalytics = {
  totalMRR: 142500,
  activeStores: 28,
  totalUsers: 485,
  churnRate: 2.4,
  pendingRequests: 2,
  mrrTrend: [
    { month: 'Aug 25', mrr: 98000 },
    { month: 'Sep 25', mrr: 105000 },
    { month: 'Oct 25', mrr: 112000 },
    { month: 'Nov 25', mrr: 125000 },
    { month: 'Dec 25', mrr: 135000 },
    { month: 'Jan 26', mrr: 142500 },
  ],
  planDistribution: [
    { name: 'Enterprise', value: 8, color: 'hsl(var(--primary))' },
    { name: 'Professional', value: 12, color: 'hsl(var(--accent))' },
    { name: 'Starter', value: 8, color: 'hsl(199, 89%, 48%)' },
  ],
  recentActivity: [
    { action: 'New store signup', store: 'Fresh Mart', time: '2 hours ago' },
    { action: 'Subscription upgraded', store: 'City Stores', time: '5 hours ago' },
    { action: 'Payment received', store: 'Galaxy Retail', time: '1 day ago' },
    { action: 'Store approved', store: 'Mega Bazaar', time: '2 days ago' },
  ],
};
