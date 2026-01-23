import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import { AreaChartComponent } from "@/components/charts/AreaChartComponent";
import { PieChartComponent } from "@/components/charts/PieChartComponent";
import { BarChartComponent } from "@/components/charts/BarChartComponent";
import { KPICard } from "@/components/ui/kpi-card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ColumnDef } from "@tanstack/react-table";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Building2,
  Package,
  Users,
  BarChart3,
  CreditCard,
  Settings,
  FileText,
  FolderTree,
  DollarSign,
  TrendingUp,
  ShoppingCart,
  Store,
  Calendar,
  Download,
} from "lucide-react";

const storeAdminSidebarItems = [
  { label: "Dashboard", href: "/store", icon: LayoutDashboard },
  { label: "Branches", href: "/store/branches", icon: Building2 },
  { label: "Products", href: "/store/products", icon: Package },
  { label: "Categories", href: "/store/categories", icon: FolderTree },
  { label: "Employees", href: "/store/employees", icon: Users },
  { label: "Analytics", href: "/store/analytics", icon: BarChart3 },
  { label: "Reports", href: "/store/reports", icon: FileText },
  { label: "Subscription", href: "/store/subscription", icon: CreditCard },
  { label: "Settings", href: "/store/settings", icon: Settings },
];

const salesData = [
  { date: "Jan 1", sales: 45000 },
  { date: "Jan 2", sales: 52000 },
  { date: "Jan 3", sales: 48000 },
  { date: "Jan 4", sales: 61000 },
  { date: "Jan 5", sales: 55000 },
  { date: "Jan 6", sales: 67000 },
  { date: "Jan 7", sales: 72000 },
];

const paymentData = [
  { name: "Cash", value: 35, color: "hsl(var(--primary))" },
  { name: "UPI", value: 42, color: "hsl(var(--accent))" },
  { name: "Card", value: 18, color: "hsl(199, 89%, 48%)" },
  { name: "Wallet", value: 5, color: "hsl(38, 92%, 50%)" },
];

const categoryData = [
  { category: "Electronics", sales: 125000 },
  { category: "Fashion", sales: 98000 },
  { category: "Grocery", sales: 85000 },
  { category: "Home", sales: 62000 },
  { category: "Beauty", sales: 45000 },
];

interface SalesReport {
  id: string;
  date: string;
  branch: string;
  product: string;
  quantity: number;
  amount: number;
  payment: string;
}

const salesReports: SalesReport[] = [
  { id: "RPT001", date: "2024-01-15", branch: "Downtown Mall", product: "iPhone 15", quantity: 3, amount: 239700, payment: "Card" },
  { id: "RPT002", date: "2024-01-15", branch: "City Center", product: "Samsung TV", quantity: 2, amount: 89800, payment: "UPI" },
  { id: "RPT003", date: "2024-01-14", branch: "Airport Store", product: "MacBook Pro", quantity: 1, amount: 199900, payment: "Card" },
  { id: "RPT004", date: "2024-01-14", branch: "Downtown Mall", product: "Nike Shoes", quantity: 5, amount: 24500, payment: "Cash" },
  { id: "RPT005", date: "2024-01-13", branch: "City Center", product: "Sony Headphones", quantity: 8, amount: 47920, payment: "UPI" },
  { id: "RPT006", date: "2024-01-13", branch: "Downtown Mall", product: "iPad Air", quantity: 4, amount: 239600, payment: "Card" },
  { id: "RPT007", date: "2024-01-12", branch: "Airport Store", product: "Apple Watch", quantity: 6, amount: 179400, payment: "UPI" },
  { id: "RPT008", date: "2024-01-12", branch: "City Center", product: "Samsung Buds", quantity: 10, amount: 89900, payment: "Cash" },
];

const columns: ColumnDef<SalesReport>[] = [
  {
    accessorKey: "id",
    header: "Report ID",
    cell: ({ row }) => <span className="font-mono text-sm">{row.getValue("id")}</span>,
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-muted-foreground" />
        {row.getValue("date")}
      </div>
    ),
  },
  {
    accessorKey: "branch",
    header: "Branch",
    cell: ({ row }) => (
      <Badge variant="outline" className="font-normal">
        <Store className="h-3 w-3 mr-1" />
        {row.getValue("branch")}
      </Badge>
    ),
  },
  {
    accessorKey: "product",
    header: "Product",
  },
  {
    accessorKey: "quantity",
    header: "Qty",
    cell: ({ row }) => <span className="font-medium">{row.getValue("quantity")}</span>,
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => (
      <span className="font-semibold text-primary">
        ₹{(row.getValue("amount") as number).toLocaleString()}
      </span>
    ),
  },
  {
    accessorKey: "payment",
    header: "Payment",
    cell: ({ row }) => {
      const payment = row.getValue("payment") as string;
      return (
        <Badge className={
          payment === "Card" ? "bg-primary/10 text-primary border-primary/20" :
          payment === "UPI" ? "bg-accent/10 text-accent border-accent/20" :
          "bg-muted text-muted-foreground"
        }>
          {payment}
        </Badge>
      );
    },
  },
];

export default function StoreReports() {
  const [dateRange, setDateRange] = useState("7days");
  const [branchFilter, setBranchFilter] = useState("all");

  const handleExport = () => {
    console.log("Exporting report...");
  };

  return (
    <DashboardLayout
      sidebarItems={storeAdminSidebarItems}
      title="Sales Reports"
      subtitle="Detailed analytics and insights"
      userRole="store_admin"
      userName="Store Admin"
      storeName="TechMart Enterprise"
    >
      <div className="space-y-6">
        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-wrap gap-4"
        >
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="90days">Last 90 Days</SelectItem>
            </SelectContent>
          </Select>
          <Select value={branchFilter} onValueChange={setBranchFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select branch" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Branches</SelectItem>
              <SelectItem value="downtown">Downtown Mall</SelectItem>
              <SelectItem value="city">City Center</SelectItem>
              <SelectItem value="airport">Airport Store</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2" onClick={handleExport}>
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </motion.div>

        {/* KPI Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <KPICard
            title="Daily Sales"
            value="₹72,450"
            change={12.5}
            changeLabel="vs yesterday"
            icon={DollarSign}
            iconColor="primary"
          />
          <KPICard
            title="Weekly Sales"
            value="₹4,00,000"
            change={8.3}
            changeLabel="vs last week"
            icon={TrendingUp}
            iconColor="success"
          />
          <KPICard
            title="Top Branch"
            value="Downtown"
            change={15.2}
            changeLabel="revenue growth"
            icon={Building2}
            iconColor="info"
          />
          <KPICard
            title="Avg Order Value"
            value="₹2,450"
            change={5.8}
            changeLabel="vs last month"
            icon={ShoppingCart}
            iconColor="warning"
          />
        </motion.div>

        {/* Charts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="grid lg:grid-cols-3 gap-6"
        >
          <div className="lg:col-span-2">
            <AreaChartComponent
              title="Sales Trend"
              data={salesData}
              dataKey="sales"
              xAxisKey="date"
              color="hsl(var(--primary))"
              height={300}
            />
          </div>
          <PieChartComponent
            title="Payment Breakdown"
            data={paymentData}
            height={300}
            innerRadius={50}
          />
        </motion.div>

        {/* Category Sales */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.25 }}
        >
          <BarChartComponent
            title="Sales by Category"
            data={categoryData}
            dataKey="sales"
            xAxisKey="category"
            height={300}
          />
        </motion.div>

        {/* Detailed Sales Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Detailed Sales Report</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={columns}
                data={salesReports}
                searchPlaceholder="Search by product, branch..."
                onExport={handleExport}
              />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}