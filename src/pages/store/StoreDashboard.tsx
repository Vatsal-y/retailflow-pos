import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { KPICard } from "@/components/ui/kpi-card";
import { AreaChartComponent } from "@/components/charts/AreaChartComponent";
import { BarChartComponent } from "@/components/charts/BarChartComponent";
import { PieChartComponent } from "@/components/charts/PieChartComponent";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { mockStoreAnalytics, mockBranches } from "@/data/dashboardMockData";
import {
  LayoutDashboard,
  Store,
  Package,
  Users,
  Tags,
  BarChart3,
  Settings,
  CreditCard,
  DollarSign,
  TrendingUp,
  Building2,
  UserCheck,
  MapPin,
} from "lucide-react";
import { motion } from "framer-motion";

const sidebarItems = [
  { label: "Dashboard", href: "/store", icon: LayoutDashboard },
  { label: "Branches", href: "/store/branches", icon: Building2 },
  { label: "Products", href: "/store/products", icon: Package },
  { label: "Employees", href: "/store/employees", icon: Users },
  { label: "Categories", href: "/store/categories", icon: Tags },
  { label: "Analytics", href: "/store/analytics", icon: BarChart3 },
  { label: "Subscription", href: "/store/subscription", icon: CreditCard },
  { label: "Reports", href: "/store/reports", icon: BarChart3 },
  { label: "Settings", href: "/store/settings", icon: Settings },
];

export default function StoreDashboard() {
  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <DashboardLayout
      title="Store Dashboard"
      subtitle="Multi-branch overview and analytics"
      sidebarItems={sidebarItems}
      userRole="store_admin"
      userName="Priya Sharma"
      storeName="Galaxy Retail"
    >
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
        {/* KPI Cards */}
        <motion.div variants={item} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KPICard
            title="Total Revenue (MTD)"
            value={`₹${mockStoreAnalytics.totalRevenue.toLocaleString()}`}
            change={12.5}
            icon={DollarSign}
            iconColor="primary"
          />
          <KPICard
            title="Total Orders"
            value={mockStoreAnalytics.totalOrders}
            change={8.2}
            icon={TrendingUp}
            iconColor="success"
          />
          <KPICard
            title="Active Branches"
            value={`${mockStoreAnalytics.activeBranches}/${mockStoreAnalytics.totalBranches}`}
            icon={Building2}
            iconColor="info"
          />
          <KPICard
            title="Total Employees"
            value={mockStoreAnalytics.totalEmployees}
            change={4.5}
            icon={UserCheck}
            iconColor="warning"
          />
        </motion.div>

        {/* Charts Row */}
        <motion.div variants={item} className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <AreaChartComponent
              title="Monthly Revenue Trend"
              data={mockStoreAnalytics.monthlyRevenue}
              dataKey="revenue"
              xAxisKey="month"
            />
          </div>
          <PieChartComponent
            title="Category Performance"
            data={mockStoreAnalytics.categoryPerformance.map((c) => ({
              name: c.name,
              value: c.value,
            }))}
            innerRadius={60}
          />
        </motion.div>

        {/* Branch Comparison & Recent Activity */}
        <motion.div variants={item} className="grid gap-6 lg:grid-cols-2">
          <BarChartComponent
            title="Branch Revenue Comparison"
            data={mockStoreAnalytics.branchComparison}
            dataKey="revenue"
            xAxisKey="branch"
            horizontal
          />

          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">Branch Overview</CardTitle>
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockBranches.slice(0, 4).map((branch) => (
                  <div
                    key={branch.id}
                    className="flex items-center justify-between py-2 border-b border-border last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <MapPin className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{branch.name}</p>
                        <p className="text-xs text-muted-foreground">{branch.city}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm">
                        ₹{branch.revenue.toLocaleString()}
                      </p>
                      <StatusBadge status={branch.status} />
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
