// Store entity
export interface Store {
    id: number;
    name: string;
    address?: string;
    phone?: string;
    email?: string;
    status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
    createdAt: string;
    updatedAt: string;
}

// Branch entity
export interface Branch {
    id: number;
    storeId: number;
    name: string;
    address?: string;
    city?: string;
    phone?: string;
    active: boolean;
    createdAt: string;
    updatedAt: string;
}

// Employee entity
export interface Employee {
    id: number;
    branchId: number;
    userId: number;
    position: string;
    salary?: number;
    hireDate: string;
    status: 'ACTIVE' | 'ON_LEAVE' | 'TERMINATED';
    user?: {
        id: number;
        fullName: string;
        email: string;
        role: string;
    };
    createdAt: string;
    updatedAt: string;
}

// Shift report entity
export interface ShiftReport {
    id: number;
    branchId: number;
    cashierId: number;
    startTime: string;
    endTime?: string | null;
    openingBalance: number;
    closingBalance?: number;
    totalSales: number;
    totalTransactions: number;
    expectedCash: number;
    actualCash?: number;
    discrepancy?: number;
    status: 'ACTIVE' | 'CLOSED';
    createdAt: string;
    updatedAt: string;
}

// Subscription plan
export interface SubscriptionPlan {
    id: number;
    name: string;
    price: number;
    maxBranches: number;
    maxUsers: number;
    maxProducts: number;
    features?: string;
    active: boolean;
}

// Dashboard analytics
export interface BranchDashboard {
    todaySales: number;
    weekSales: number;
    todayOrders: number;
    lowStockCount: number;
}

export interface StoreDashboard extends BranchDashboard {
    totalBranches: number;
    activeEmployees: number;
}

// Sales trend data point
export interface SalesTrendData {
    date: string;
    sales: number;
    orders: number;
}

// Payment breakdown
export interface PaymentBreakdown {
    method: string;
    amount: number;
    count: number;
}

// Low stock item
export interface LowStockItem {
    productId: number;
    productName: string;
    currentStock: number;
    reorderLevel: number;
    branchId?: number;
    branchName?: string;
}
