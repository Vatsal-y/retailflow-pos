import { DashboardLayout } from "@/components/layout/DashboardLayout";
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
import { mockBranchAnalytics } from "@/data/dashboardMockData";
import { mockDailySales, mockTopProducts, mockPaymentBreakdown } from "@/data/mockData";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  Tags,
  BarChart3,
  Settings,
  Download,
  Calendar,
} from "lucide-react";
import { useState } from "react";

const sidebarItems = [
  { label: "Dashboard", href: "/branch", icon: LayoutDashboard },
  { label: "Orders", href: "/branch/orders", icon: ShoppingCart },
  { label: "Inventory", href: "/branch/inventory", icon: Package },
  { label: "Employees", href: "/branch/employees", icon: Users },
  { label: "Products", href: "/branch/products", icon: Tags },
  { label: "Reports", href: "/branch/reports", icon: BarChart3 },
  { label: "Settings", href: "/branch/settings", icon: Settings },
];

export default function BranchReports() {
  const [dateRange, setDateRange] = useState("7days");

  const hourlyData = [
    { hour: "9AM", sales: 2400 },
    { hour: "10AM", sales: 3200 },
    { hour: "11AM", sales: 4100 },
    { hour: "12PM", sales: 5800 },
    { hour: "1PM", sales: 6200 },
    { hour: "2PM", sales: 4800 },
    { hour: "3PM", sales: 3900 },
    { hour: "4PM", sales: 4500 },
    { hour: "5PM", sales: 5200 },
    { hour: "6PM", sales: 4100 },
  ];

  return (
    <DashboardLayout
      title="Reports"
      subtitle="Analytics and performance insights"
      sidebarItems={sidebarItems}
      userRole="branch_manager"
      userName="Rahul Kumar"
      storeName="Downtown Mall"
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
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="sales" className="space-y-6">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="sales">Sales</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="employees">Employees</TabsTrigger>
          </TabsList>

          <TabsContent value="sales" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <AreaChartComponent
                title="Daily Revenue"
                data={mockDailySales}
                dataKey="revenue"
                xAxisKey="date"
              />
              <BarChartComponent
                title="Hourly Sales Distribution"
                data={hourlyData}
                dataKey="sales"
                xAxisKey="hour"
              />
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              <PieChartComponent
                title="Payment Method Distribution"
                data={mockPaymentBreakdown.map((p) => ({
                  name: p.method,
                  value: p.amount,
                }))}
                innerRadius={60}
              />
              <BarChartComponent
                title="Top Selling Products"
                data={mockTopProducts.map((p) => ({
                  name: p.productName.substring(0, 10),
                  quantity: p.quantity,
                }))}
                dataKey="quantity"
                xAxisKey="name"
                horizontal
              />
            </div>
          </TabsContent>

          <TabsContent value="inventory" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Stock Movement</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { category: "Beverages", in: 450, out: 380 },
                      { category: "Snacks", in: 320, out: 290 },
                      { category: "Dairy", in: 180, out: 165 },
                      { category: "Bakery", in: 120, out: 115 },
                    ].map((item) => (
                      <div key={item.category} className="flex items-center justify-between py-2 border-b last:border-0">
                        <span className="font-medium">{item.category}</span>
                        <div className="flex gap-4 text-sm">
                          <span className="text-success">+{item.in} in</span>
                          <span className="text-destructive">-{item.out} out</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <PieChartComponent
                title="Category Distribution"
                data={[
                  { name: "Beverages", value: 35 },
                  { name: "Snacks", value: 25 },
                  { name: "Dairy", value: 20 },
                  { name: "Bakery", value: 12 },
                  { name: "Others", value: 8 },
                ]}
              />
            </div>
          </TabsContent>

          <TabsContent value="employees" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Employee Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: "John Doe", sales: 24500, orders: 85, rating: 92 },
                      { name: "Jane Smith", sales: 21800, orders: 78, rating: 88 },
                      { name: "Mike Johnson", sales: 19200, orders: 65, rating: 85 },
                    ].map((emp) => (
                      <div key={emp.name} className="flex items-center justify-between py-2 border-b last:border-0">
                        <div>
                          <p className="font-medium">{emp.name}</p>
                          <p className="text-xs text-muted-foreground">{emp.orders} orders</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">₹{emp.sales.toLocaleString()}</p>
                          <p className="text-xs text-success">{emp.rating}% rating</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <BarChartComponent
                title="Shift Performance"
                data={[
                  { shift: "Morning", orders: 120 },
                  { shift: "Afternoon", orders: 180 },
                  { shift: "Evening", orders: 150 },
                ]}
                dataKey="orders"
                xAxisKey="shift"
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
