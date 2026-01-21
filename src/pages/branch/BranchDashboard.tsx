import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { KPICard } from "@/components/ui/kpi-card";
import { AreaChartComponent } from "@/components/charts/AreaChartComponent";
import { BarChartComponent } from "@/components/charts/BarChartComponent";
import { PieChartComponent } from "@/components/charts/PieChartComponent";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockBranchAnalytics, mockInventory } from "@/data/dashboardMockData";
import { mockOrders } from "@/data/mockData";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  Tags,
  BarChart3,
  Settings,
  DollarSign,
  TrendingUp,
  ShoppingBag,
  AlertTriangle,
  Eye,
} from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { motion } from "framer-motion";

const sidebarItems = [
  { label: "Dashboard", href: "/branch", icon: LayoutDashboard },
  { label: "Orders", href: "/branch/orders", icon: ShoppingCart, badge: 12 },
  { label: "Inventory", href: "/branch/inventory", icon: Package, badge: 3 },
  { label: "Employees", href: "/branch/employees", icon: Users },
  { label: "Products", href: "/branch/products", icon: Tags },
  { label: "Reports", href: "/branch/reports", icon: BarChart3 },
  { label: "Settings", href: "/branch/settings", icon: Settings },
];

const recentOrderColumns: ColumnDef<any>[] = [
  {
    accessorKey: "orderNumber",
    header: "Order #",
    cell: ({ row }) => (
      <span className="font-medium text-primary">{row.getValue("orderNumber")}</span>
    ),
  },
  {
    accessorKey: "customerName",
    header: "Customer",
  },
  {
    accessorKey: "total",
    header: "Amount",
    cell: ({ row }) => (
      <span className="font-medium">₹{(row.getValue("total") as number).toLocaleString()}</span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
  },
  {
    id: "actions",
    cell: () => (
      <Button variant="ghost" size="sm">
        <Eye className="h-4 w-4" />
      </Button>
    ),
  },
];

export default function BranchDashboard() {
  const lowStockItems = mockInventory.filter((item) => item.status !== "in_stock");

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <DashboardLayout
      title="Branch Dashboard"
      subtitle="Downtown Mall - Today's Overview"
      sidebarItems={sidebarItems}
      userRole="branch_manager"
      userName="Rahul Kumar"
      storeName="Downtown Mall"
    >
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
        {/* KPI Cards */}
        <motion.div variants={item} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KPICard
            title="Today's Sales"
            value={`₹${mockBranchAnalytics.todaySales.toLocaleString()}`}
            change={12.5}
            icon={DollarSign}
            iconColor="primary"
          />
          <KPICard
            title="Orders"
            value={mockBranchAnalytics.todayOrders}
            change={8.2}
            icon={ShoppingBag}
            iconColor="success"
          />
          <KPICard
            title="Revenue"
            value={`₹${mockBranchAnalytics.todayRevenue.toLocaleString()}`}
            change={15.3}
            icon={TrendingUp}
            iconColor="info"
          />
          <KPICard
            title="Avg Order Value"
            value={`₹${mockBranchAnalytics.avgOrderValue.toFixed(0)}`}
            change={-2.1}
            icon={BarChart3}
            iconColor="warning"
          />
        </motion.div>

        {/* Low Stock Alert */}
        {lowStockItems.length > 0 && (
          <motion.div variants={item}>
            <Card className="border-orange-200 bg-orange-50/50 dark:border-orange-800 dark:bg-orange-950/20">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/50">
                  <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-orange-800 dark:text-orange-200">
                    {lowStockItems.length} products below reorder level
                  </p>
                  <p className="text-sm text-orange-600 dark:text-orange-400">
                    Review and restock immediately
                  </p>
                </div>
                <Button variant="outline" size="sm" className="border-orange-300 text-orange-700 hover:bg-orange-100">
                  Review Stock
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Charts Row */}
        <motion.div variants={item} className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <AreaChartComponent
              title="Weekly Sales Trend"
              data={mockBranchAnalytics.weeklyTrend}
              dataKey="revenue"
              xAxisKey="day"
            />
          </div>
          <PieChartComponent
            title="Payment Methods"
            data={mockBranchAnalytics.paymentMethods}
            innerRadius={60}
          />
        </motion.div>

        {/* Bottom Row */}
        <motion.div variants={item} className="grid gap-6 lg:grid-cols-2">
          <BarChartComponent
            title="Top 5 Products"
            data={mockBranchAnalytics.topProducts}
            dataKey="sales"
            xAxisKey="name"
            horizontal
          />

          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">Recent Orders</CardTitle>
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockOrders.slice(0, 5).map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between py-2 border-b border-border last:border-0"
                  >
                    <div>
                      <p className="font-medium text-sm">{order.orderNumber}</p>
                      <p className="text-xs text-muted-foreground">{order.customerName}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-sm">₹{order.total.toLocaleString()}</p>
                      <StatusBadge status={order.status} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
}
