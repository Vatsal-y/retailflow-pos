import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { KPICard } from "@/components/ui/kpi-card";
import { AreaChartComponent } from "@/components/charts/AreaChartComponent";
import { BarChartComponent } from "@/components/charts/BarChartComponent";
import { PieChartComponent } from "@/components/charts/PieChartComponent";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockStoreAnalytics } from "@/data/dashboardMockData";
import {
  LayoutDashboard,
  Package,
  Users,
  Tags,
  BarChart3,
  Settings,
  CreditCard,
  Building2,
  Download,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Percent,
  Calendar,
} from "lucide-react";
import { useState } from "react";

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

export default function StoreAnalytics() {
  const [dateRange, setDateRange] = useState("30days");

  const conversionData = [
    { day: "Mon", visitors: 1200, conversions: 180 },
    { day: "Tue", visitors: 1350, conversions: 215 },
    { day: "Wed", visitors: 1100, conversions: 165 },
    { day: "Thu", visitors: 1450, conversions: 245 },
    { day: "Fri", visitors: 1600, conversions: 280 },
    { day: "Sat", visitors: 1850, conversions: 350 },
    { day: "Sun", visitors: 1400, conversions: 240 },
  ];

  const cohortData = [
    { cohort: "Week 1", retention: 100 },
    { cohort: "Week 2", retention: 75 },
    { cohort: "Week 3", retention: 62 },
    { cohort: "Week 4", retention: 55 },
    { cohort: "Week 5", retention: 48 },
    { cohort: "Week 6", retention: 42 },
  ];

  return (
    <DashboardLayout
      title="Analytics"
      subtitle="Deep insights into store performance"
      sidebarItems={sidebarItems}
      userRole="store_admin"
      userName="Priya Sharma"
      storeName="Galaxy Retail"
    >
      <div className="space-y-6">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="90days">Last 90 Days</SelectItem>
              <SelectItem value="12months">Last 12 Months</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>

        {/* KPIs */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KPICard
            title="Total Revenue"
            value={`₹${mockStoreAnalytics.totalRevenue.toLocaleString()}`}
            change={12.5}
            icon={DollarSign}
            iconColor="primary"
          />
          <KPICard
            title="Avg Order Value"
            value={`₹${mockStoreAnalytics.avgOrderValue.toFixed(0)}`}
            change={5.3}
            icon={ShoppingCart}
            iconColor="success"
          />
          <KPICard
            title="Conversion Rate"
            value="18.5%"
            change={2.1}
            icon={Percent}
            iconColor="info"
          />
          <KPICard
            title="MRR Growth"
            value={`${mockStoreAnalytics.mrrGrowth}%`}
            change={mockStoreAnalytics.mrrGrowth}
            icon={TrendingUp}
            iconColor="warning"
          />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="revenue" className="space-y-6">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
          </TabsList>

          <TabsContent value="revenue" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <AreaChartComponent
                title="Revenue Trend"
                data={mockStoreAnalytics.monthlyRevenue}
                dataKey="revenue"
                xAxisKey="month"
              />
              <BarChartComponent
                title="Branch Performance"
                data={mockStoreAnalytics.branchComparison}
                dataKey="revenue"
                xAxisKey="branch"
                horizontal
              />
            </div>
            <PieChartComponent
              title="Revenue by Category"
              data={mockStoreAnalytics.categoryPerformance.map((c) => ({
                name: c.name,
                value: c.value * 1000,
              }))}
              height={350}
            />
          </TabsContent>

          <TabsContent value="customers" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <AreaChartComponent
                title="Customer Visits vs Conversions"
                data={conversionData}
                dataKey="conversions"
                xAxisKey="day"
                color="hsl(var(--accent))"
              />
              <BarChartComponent
                title="Customer Retention (Cohort)"
                data={cohortData}
                dataKey="retention"
                xAxisKey="cohort"
              />
            </div>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Customer Lifetime Value</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <p className="text-3xl font-bold text-primary">₹2,450</p>
                    <p className="text-sm text-muted-foreground">Average CLV</p>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <p className="text-3xl font-bold">4.2</p>
                    <p className="text-sm text-muted-foreground">Avg Orders/Customer</p>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <p className="text-3xl font-bold text-success">68%</p>
                    <p className="text-sm text-muted-foreground">Repeat Rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <PieChartComponent
                title="Sales by Category"
                data={mockStoreAnalytics.categoryPerformance.map((c) => ({
                  name: c.name,
                  value: c.value,
                }))}
                innerRadius={60}
              />
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Top Performing Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: "Coca Cola 500ml", units: 2450, revenue: 6125 },
                      { name: "Lays Classic", units: 1890, revenue: 7560 },
                      { name: "Whole Milk 1L", units: 1560, revenue: 5460 },
                      { name: "Bread Loaf", units: 1420, revenue: 4260 },
                      { name: "Orange Juice 1L", units: 1280, revenue: 6400 },
                    ].map((product, i) => (
                      <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-xs text-muted-foreground">{product.units} units sold</p>
                        </div>
                        <p className="font-semibold">₹{product.revenue.toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
