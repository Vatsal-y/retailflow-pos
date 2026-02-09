import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Skeleton } from '@/components/ui';
import { useAuthStore } from '@/store';
import { analyticsApi } from '@/api';
import { formatCurrency } from '@/lib/utils';
import type { BranchDashboard, SalesTrendData, LowStockItem } from '@/types';
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
} from 'recharts';
import {
    TrendingUp,
    ShoppingCart,
    Package,
    AlertTriangle,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
    const { user } = useAuthStore();
    const [dashboard, setDashboard] = useState<BranchDashboard | null>(null);
    const [salesTrend, setSalesTrend] = useState<SalesTrendData[]>([]);
    const [lowStock, setLowStock] = useState<LowStockItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            // For users with branchId (cashiers, branch managers), use branch-level analytics
            if (user?.branchId) {
                try {
                    const [dashboardData, trendData, lowStockData] = await Promise.all([
                        analyticsApi.getBranchDashboard(user.branchId),
                        analyticsApi.getSalesTrend(user.branchId, 7),
                        analyticsApi.getLowStockItems(user.branchId),
                    ]);
                    setDashboard(dashboardData);
                    setSalesTrend(trendData);
                    setLowStock(lowStockData);
                } catch (error) {
                    console.error('Failed to fetch branch dashboard data:', error);
                } finally {
                    setLoading(false);
                }
                return;
            }

            // For Store Admin (has storeId but no branchId), use store-level analytics
            if (user?.storeId) {
                try {
                    const [dashboardData, trendData, lowStockData] = await Promise.all([
                        analyticsApi.getStoreDashboard(user.storeId),
                        analyticsApi.getStoreSalesTrend(user.storeId, 7),
                        analyticsApi.getStoreLowStockItems(user.storeId),
                    ]);
                    setDashboard(dashboardData);
                    setSalesTrend(trendData);
                    setLowStock(lowStockData);
                } catch (error) {
                    console.error('Failed to fetch store dashboard data:', error);
                } finally {
                    setLoading(false);
                }
                return;
            }

            // No branch or store - show empty dashboard
            setLoading(false);
        };

        fetchData();
    }, [user?.branchId, user?.storeId]);

    const kpiCards = [
        {
            title: "Today's Sales",
            value: dashboard?.todaySales ?? 0,
            format: 'currency',
            icon: TrendingUp,
            color: 'from-emerald-500 to-teal-600',
        },
        {
            title: "Week's Sales",
            value: dashboard?.weekSales ?? 0,
            format: 'currency',
            icon: ShoppingCart,
            color: 'from-blue-500 to-indigo-600',
        },
        {
            title: "Today's Orders",
            value: dashboard?.todayOrders ?? 0,
            format: 'number',
            icon: Package,
            color: 'from-purple-500 to-pink-600',
        },
        {
            title: 'Low Stock Items',
            value: dashboard?.lowStockCount ?? 0,
            format: 'number',
            icon: AlertTriangle,
            color: 'from-amber-500 to-orange-600',
        },
    ];

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="h-32" />
                    ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Skeleton className="h-80 lg:col-span-2" />
                    <Skeleton className="h-80" />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fadeIn">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpiCards.map((kpi, index) => (
                    <Card key={index} hover className="overflow-hidden">
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm text-[hsl(var(--muted-foreground))] mb-1">
                                        {kpi.title}
                                    </p>
                                    <p className="text-2xl font-bold">
                                        {kpi.format === 'currency'
                                            ? formatCurrency(kpi.value)
                                            : kpi.value}
                                    </p>
                                </div>
                                <div className={`p-3 rounded-xl bg-gradient-to-br ${kpi.color} shadow-lg`}>
                                    <kpi.icon size={24} className="text-white" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Sales Trend Chart */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Sales Trend (Last 7 Days)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={salesTrend}>
                                    <defs>
                                        <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" className="stroke-[hsl(var(--border))]" />
                                    <XAxis
                                        dataKey="date"
                                        className="text-xs fill-[hsl(var(--muted-foreground))]"
                                        tick={{ fill: 'hsl(var(--muted-foreground))' }}
                                    />
                                    <YAxis
                                        className="text-xs fill-[hsl(var(--muted-foreground))]"
                                        tick={{ fill: 'hsl(var(--muted-foreground))' }}
                                        tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'hsl(var(--card))',
                                            border: '1px solid hsl(var(--border))',
                                            borderRadius: '8px',
                                        }}
                                        formatter={(value) => [formatCurrency(value as number), 'Sales']}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="sales"
                                        stroke="hsl(var(--primary))"
                                        strokeWidth={2}
                                        fillOpacity={1}
                                        fill="url(#colorSales)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Low Stock Alert */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <AlertTriangle size={18} className="text-amber-500" />
                            Low Stock Alert
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3 max-h-64 overflow-y-auto">
                            {lowStock.length === 0 ? (
                                <p className="text-center text-[hsl(var(--muted-foreground))] py-8">
                                    All items are well stocked! 🎉
                                </p>
                            ) : (
                                lowStock.slice(0, 5).map((item, index) => (
                                    <div key={index}
                                        className="flex items-center justify-between p-3 rounded-lg bg-[hsl(var(--accent))]"
                                    >
                                        <div>
                                            <p className="font-medium text-sm">{item.productName}</p>
                                            <p className="text-xs text-[hsl(var(--muted-foreground))]">
                                                {item.branchName && <span>{item.branchName} • </span>}
                                                Reorder at: {item.reorderLevel}
                                            </p>
                                        </div>
                                        <div className={`px-2 py-1 rounded text-xs font-medium ${item.currentStock === 0
                                            ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                            : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                            }`}>
                                            {item.currentStock} left
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
