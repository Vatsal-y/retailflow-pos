import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store';
import { reportsApi } from '@/api';
import type { TopProduct, BranchPerformance, EmployeePerformance, CategorySales, PaymentMethodStats, RevenueTrend } from '@/api/reports.api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';
import {
    BarChart as BarChartIcon,
    TrendingUp,
    Users,
    Package,
    CreditCard,
    PieChartIcon,
    Building2,
    Sparkles,
    Trophy,
    Target,
    Zap,
    Store,
    Calendar,
    ArrowRight,
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Area,
    AreaChart,
} from 'recharts';

// Emerald/Teal color palette matching the new theme
const COLORS = ['#10b981', '#14b8a6', '#06b6d4', '#0ea5e9', '#6366f1', '#8b5cf6', '#a855f7', '#ec4899'];

export const ReportsPage: React.FC = () => {
    const { user } = useAuthStore();
    const [loading, setLoading] = useState(true);
    const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
    const [branchPerformance, setBranchPerformance] = useState<BranchPerformance[]>([]);
    const [employeePerformance, setEmployeePerformance] = useState<EmployeePerformance[]>([]);
    const [categorySales, setCategorySales] = useState<CategorySales[]>([]);
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethodStats[]>([]);
    const [revenueTrend, setRevenueTrend] = useState<RevenueTrend[]>([]);
    const [selectedBranch, setSelectedBranch] = useState<number | null>(null);
    const [trendPeriod, setTrendPeriod] = useState<1 | 7 | 30>(30);

    useEffect(() => {
        const fetchData = async () => {
            if (!user?.storeId) return;

            setLoading(true);
            try {
                const branchId = selectedBranch || undefined;
                const [products, branches, employees, categories, payments, trend] = await Promise.all([
                    reportsApi.getTopProducts(user.storeId, 10, branchId),
                    reportsApi.getBranchPerformance(user.storeId),
                    reportsApi.getEmployeePerformance(user.storeId, branchId),
                    reportsApi.getSalesByCategory(user.storeId, branchId),
                    reportsApi.getPaymentMethods(user.storeId, branchId),
                    reportsApi.getRevenueTrend(user.storeId, trendPeriod, branchId),
                ]);
                setTopProducts(products);
                setBranchPerformance(branches);
                setEmployeePerformance(employees);
                setCategorySales(categories);
                setPaymentMethods(payments);
                setRevenueTrend(trend);
            } catch (error) {
                console.error('Failed to fetch reports:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user?.storeId, selectedBranch, trendPeriod]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
                <div className="text-center">
                    <div className="relative">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 animate-spin" style={{ animationDuration: '2s' }} />
                        <div className="absolute inset-2 rounded-full bg-[hsl(var(--background))]" />
                    </div>
                    <p className="mt-4 text-[hsl(var(--muted-foreground))]">Loading analytics...</p>
                </div>
            </div>
        );
    }

    const totalRevenue = revenueTrend.reduce((sum, day) => sum + day.revenue, 0);
    const totalOrders = revenueTrend.reduce((sum, day) => sum + day.orders, 0);
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Header with Gradient - Updated to emerald/teal */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 p-8 text-white">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnY0em0wLTZ2LTRoLTJ2NGgyem0tNiA2aC00djJoNHYtMnptLTYgMGgtNHYyaDR2LTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20" />
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-xl bg-white/20 backdrop-blur-sm">
                            <Sparkles size={24} />
                        </div>
                        <h1 className="font-display text-3xl font-bold">Analytics & Reports</h1>
                    </div>
                    <p className="text-white/80 max-w-xl mb-6">
                        Comprehensive insights into your store performance. Track revenue, analyze trends, and make data-driven decisions.
                    </p>

                    {/* Branch Selector - Added cursor-pointer and focus states */}
                    <div className="flex flex-wrap gap-2" role="tablist" aria-label="Branch filter">
                        <button
                            onClick={() => setSelectedBranch(null)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/50 ${selectedBranch === null
                                ? 'bg-white text-emerald-600 shadow-lg shadow-white/25'
                                : 'bg-white/20 hover:bg-white/30 text-white'
                                }`}
                            role="tab"
                            aria-selected={selectedBranch === null}
                        >
                            <Store size={16} />
                            All Branches
                        </button>
                        {branchPerformance.map((branch) => (
                            <button
                                key={branch.branchId}
                                onClick={() => setSelectedBranch(branch.branchId)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/50 ${selectedBranch === branch.branchId
                                    ? 'bg-white text-teal-600 shadow-lg shadow-white/25'
                                    : 'bg-white/20 hover:bg-white/30 text-white'
                                    }`}
                                role="tab"
                                aria-selected={selectedBranch === branch.branchId}
                            >
                                <Building2 size={16} />
                                {branch.branchName}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="absolute -right-8 -bottom-8 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
                <div className="absolute right-20 -top-8 w-32 h-32 rounded-full bg-cyan-500/30 blur-3xl" />
            </div>

            {/* Summary Cards with Gradient Borders - Updated to emerald/teal theme */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Revenue */}
                <div className="group relative cursor-pointer" tabIndex={0}>
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl opacity-75 blur group-hover:opacity-100 group-focus:opacity-100 transition duration-300" />
                    <Card className="relative rounded-xl overflow-hidden">
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm text-[hsl(var(--muted-foreground))] mb-1">Total Revenue</p>
                                    <p className="font-display text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                                        {formatCurrency(totalRevenue)}
                                    </p>
                                    <p className="text-xs text-[hsl(var(--muted-foreground))] mt-2 flex items-center gap-1">
                                        <ArrowRight size={12} />
                                        Last {trendPeriod} days
                                    </p>
                                </div>
                                <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25">
                                    <TrendingUp size={24} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Total Orders */}
                <div className="group relative cursor-pointer" tabIndex={0}>
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-2xl opacity-75 blur group-hover:opacity-100 group-focus:opacity-100 transition duration-300" />
                    <Card className="relative rounded-xl overflow-hidden">
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm text-[hsl(var(--muted-foreground))] mb-1">Total Orders</p>
                                    <p className="font-display text-3xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                                        {totalOrders.toLocaleString()}
                                    </p>
                                    <p className="text-xs text-[hsl(var(--muted-foreground))] mt-2 flex items-center gap-1">
                                        <ArrowRight size={12} />
                                        Completed orders
                                    </p>
                                </div>
                                <div className="p-3 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 text-white shadow-lg shadow-teal-500/25">
                                    <Package size={24} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Average Order */}
                <div className="group relative cursor-pointer" tabIndex={0}>
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl opacity-75 blur group-hover:opacity-100 group-focus:opacity-100 transition duration-300" />
                    <Card className="relative rounded-xl overflow-hidden">
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm text-[hsl(var(--muted-foreground))] mb-1">Avg Order Value</p>
                                    <p className="font-display text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                                        {formatCurrency(avgOrderValue)}
                                    </p>
                                    <p className="text-xs text-[hsl(var(--muted-foreground))] mt-2 flex items-center gap-1">
                                        <ArrowRight size={12} />
                                        Per transaction
                                    </p>
                                </div>
                                <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25">
                                    <Target size={24} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Active Branches */}
                <div className="group relative cursor-pointer" tabIndex={0}>
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl opacity-75 blur group-hover:opacity-100 group-focus:opacity-100 transition duration-300" />
                    <Card className="relative rounded-xl overflow-hidden">
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm text-[hsl(var(--muted-foreground))] mb-1">Active Branches</p>
                                    <p className="font-display text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                                        {branchPerformance.length}
                                    </p>
                                    <p className="text-xs text-[hsl(var(--muted-foreground))] mt-2 flex items-center gap-1">
                                        <ArrowRight size={12} />
                                        {employeePerformance.length} employees
                                    </p>
                                </div>
                                <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/25">
                                    <Building2 size={24} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Revenue Trend - Enhanced with emerald theme */}
            <Card className="overflow-hidden border-0 shadow-xl glass">
                <CardHeader className="border-b border-[hsl(var(--border)/0.5)]">
                    <CardTitle className="flex items-center gap-3 flex-wrap font-display">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
                            <TrendingUp size={20} />
                        </div>
                        <span>Revenue Trend</span>

                        {/* Time Period Selector - Added accessibility */}
                        <div className="ml-auto flex items-center gap-2" role="tablist" aria-label="Time period">
                            <Calendar size={16} className="text-[hsl(var(--muted-foreground))]" />
                            {([1, 7, 30] as const).map((period) => (
                                <button
                                    key={period}
                                    onClick={() => setTrendPeriod(period)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] ${trendPeriod === period
                                        ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md'
                                        : 'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))]'
                                        }`}
                                    role="tab"
                                    aria-selected={trendPeriod === period}
                                >
                                    {period === 1 ? '24h' : period === 7 ? '7d' : '30d'}
                                </button>
                            ))}
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueTrend}>
                                <defs>
                                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" className="stroke-[hsl(var(--border))]" vertical={false} />
                                <XAxis
                                    dataKey="date"
                                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                                    className="text-xs"
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`} className="text-xs" axisLine={false} tickLine={false} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'hsl(var(--card))',
                                        border: '1px solid hsl(var(--border))',
                                        borderRadius: '12px',
                                        boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                                    }}
                                    formatter={(value) => [formatCurrency(value as number || 0), 'Revenue']}
                                    labelFormatter={(label) => new Date(label).toLocaleDateString()}
                                />
                                <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#10b981" strokeWidth={3} fill="url(#revenueGradient)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Products */}
                <Card className="overflow-hidden glass">
                    <CardHeader className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10">
                        <CardTitle className="flex items-center gap-3 font-display">
                            <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
                                <BarChartIcon size={18} />
                            </div>
                            Top Selling Products
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={topProducts} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" className="stroke-[hsl(var(--border))]" horizontal={false} />
                                    <XAxis type="number" tickFormatter={(value) => value.toLocaleString()} axisLine={false} tickLine={false} />
                                    <YAxis
                                        type="category"
                                        dataKey="productName"
                                        width={120}
                                        tick={{ fontSize: 12 }}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'hsl(var(--card))',
                                            border: '1px solid hsl(var(--border))',
                                            borderRadius: '12px',
                                        }}
                                        formatter={(value, name) => [
                                            name === 'quantitySold' ? (value as number || 0).toLocaleString() : formatCurrency(value as number || 0),
                                            name === 'quantitySold' ? 'Quantity Sold' : 'Revenue',
                                        ]}
                                    />
                                    <Bar dataKey="quantitySold" name="quantitySold" radius={[0, 8, 8, 0]}>
                                        {topProducts.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Branch Performance */}
                <Card className="overflow-hidden glass">
                    <CardHeader className="bg-gradient-to-r from-teal-500/10 to-cyan-500/10">
                        <CardTitle className="flex items-center gap-3 font-display">
                            <div className="p-2 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-600 text-white">
                                <Building2 size={18} />
                            </div>
                            Branch Performance
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={branchPerformance}>
                                    <CartesianGrid strokeDasharray="3 3" className="stroke-[hsl(var(--border))]" vertical={false} />
                                    <XAxis dataKey="branchName" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                                    <YAxis tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`} axisLine={false} tickLine={false} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'hsl(var(--card))',
                                            border: '1px solid hsl(var(--border))',
                                            borderRadius: '12px',
                                        }}
                                        formatter={(value) => [formatCurrency(value as number || 0), 'Revenue']}
                                    />
                                    <Bar dataKey="totalRevenue" radius={[8, 8, 0, 0]}>
                                        {branchPerformance.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Sales by Category - Donut Chart */}
                <Card className="overflow-hidden glass">
                    <CardHeader className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10">
                        <CardTitle className="flex items-center gap-3 font-display">
                            <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 text-white">
                                <PieChartIcon size={18} />
                            </div>
                            Sales by Category
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={categorySales}
                                        dataKey="revenue"
                                        nameKey="categoryName"
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={4}
                                        label={({ name, percent }) => `${name || ''} (${((percent || 0) * 100).toFixed(0)}%)`}
                                    >
                                        {categorySales.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'hsl(var(--card))',
                                            border: '1px solid hsl(var(--border))',
                                            borderRadius: '12px',
                                        }}
                                        formatter={(value) => formatCurrency(value as number || 0)}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Payment Methods */}
                <Card className="overflow-hidden glass">
                    <CardHeader className="bg-gradient-to-r from-amber-500/10 to-orange-500/10">
                        <CardTitle className="flex items-center gap-3 font-display">
                            <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 text-white">
                                <CreditCard size={18} />
                            </div>
                            Payment Methods
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={paymentMethods}
                                        dataKey="revenue"
                                        nameKey="method"
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={4}
                                        label={({ name, percent }) => `${name || ''} (${((percent || 0) * 100).toFixed(0)}%)`}
                                    >
                                        {paymentMethods.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[(index + 3) % COLORS.length]} stroke="none" />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'hsl(var(--card))',
                                            border: '1px solid hsl(var(--border))',
                                            borderRadius: '12px',
                                        }}
                                        formatter={(value) => formatCurrency(value as number || 0)}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Employee Performance - Enhanced Table with glass effect */}
            <Card className="overflow-hidden glass">
                <CardHeader className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-b border-[hsl(var(--border)/0.5)]">
                    <CardTitle className="flex items-center gap-3 font-display">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
                            <Trophy size={18} />
                        </div>
                        Employee Leaderboard
                        <span className="ml-auto flex items-center gap-2 text-sm font-normal text-[hsl(var(--muted-foreground))]">
                            <Zap size={14} className="text-amber-500" />
                            Top performers
                        </span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-[hsl(var(--muted)/0.3)]">
                                    <th className="text-left p-4 font-semibold text-[hsl(var(--muted-foreground))]">Rank</th>
                                    <th className="text-left p-4 font-semibold text-[hsl(var(--muted-foreground))]">Employee</th>
                                    <th className="text-right p-4 font-semibold text-[hsl(var(--muted-foreground))]">Revenue</th>
                                    <th className="text-right p-4 font-semibold text-[hsl(var(--muted-foreground))]">Orders</th>
                                    <th className="text-right p-4 font-semibold text-[hsl(var(--muted-foreground))]">Shifts</th>
                                    <th className="text-right p-4 font-semibold text-[hsl(var(--muted-foreground))]">Avg/Shift</th>
                                </tr>
                            </thead>
                            <tbody>
                                {employeePerformance.map((emp, index) => (
                                    <tr key={emp.employeeId} className="border-b border-[hsl(var(--border)/0.5)] hover:bg-[hsl(var(--accent)/0.5)] transition-colors cursor-pointer">
                                        <td className="p-4">
                                            {index === 0 ? (
                                                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 text-white font-bold shadow-lg shadow-amber-500/25">
                                                    🥇
                                                </span>
                                            ) : index === 1 ? (
                                                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 text-white font-bold shadow-lg">
                                                    🥈
                                                </span>
                                            ) : index === 2 ? (
                                                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-amber-600 text-white font-bold shadow-lg">
                                                    🥉
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] font-bold">
                                                    {index + 1}
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold">
                                                    {emp.employeeName.charAt(0)}
                                                </div>
                                                <span className="font-medium">{emp.employeeName}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-right">
                                            <span className="font-display font-bold text-lg bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                                                {formatCurrency(emp.totalRevenue)}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right font-medium">{emp.totalOrders.toLocaleString()}</td>
                                        <td className="p-4 text-right font-medium">{emp.totalShifts}</td>
                                        <td className="p-4 text-right">
                                            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-sm font-medium">
                                                {formatCurrency(emp.totalShifts > 0 ? emp.totalRevenue / emp.totalShifts : 0)}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {employeePerformance.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="text-center py-12 text-[hsl(var(--muted-foreground))]">
                                            <Users size={48} className="mx-auto mb-4 opacity-30" />
                                            No employee data available
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
