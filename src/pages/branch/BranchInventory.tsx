import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockInventory } from "@/data/dashboardMockData";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  Tags,
  BarChart3,
  Settings,
  AlertTriangle,
  TrendingDown,
  RefreshCw,
} from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
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

export default function BranchInventory() {
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const filteredInventory = mockInventory.filter((item) => {
    if (categoryFilter !== "all" && item.category !== categoryFilter) return false;
    return true;
  });

  const lowStockCount = mockInventory.filter((i) => i.status === "low_stock").length;
  const outOfStockCount = mockInventory.filter((i) => i.status === "out_of_stock").length;
  const categories = [...new Set(mockInventory.map((i) => i.category))];

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "sku",
      header: "SKU",
      cell: ({ row }) => (
        <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
          {row.getValue("sku")}
        </span>
      ),
    },
    {
      accessorKey: "name",
      header: "Product Name",
      cell: ({ row }) => <span className="font-medium">{row.getValue("name")}</span>,
    },
    {
      accessorKey: "category",
      header: "Category",
    },
    {
      accessorKey: "stock",
      header: "Stock",
      cell: ({ row }) => {
        const stock = row.getValue("stock") as number;
        const reorderLevel = row.original.reorderLevel;
        const percentage = Math.min((stock / (reorderLevel * 3)) * 100, 100);
        return (
          <div className="w-32">
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium">{stock}</span>
              <span className="text-muted-foreground text-xs">/ {reorderLevel * 3}</span>
            </div>
            <Progress
              value={percentage}
              className={`h-2 ${
                percentage < 33
                  ? "[&>div]:bg-destructive"
                  : percentage < 66
                  ? "[&>div]:bg-warning"
                  : "[&>div]:bg-success"
              }`}
            />
          </div>
        );
      },
    },
    {
      accessorKey: "costPrice",
      header: "Cost",
      cell: ({ row }) => <span>₹{row.getValue("costPrice")}</span>,
    },
    {
      accessorKey: "sellingPrice",
      header: "Price",
      cell: ({ row }) => <span className="font-medium">₹{row.getValue("sellingPrice")}</span>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <Button variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-1" />
          Restock
        </Button>
      ),
    },
  ];

  return (
    <DashboardLayout
      title="Inventory"
      subtitle="Manage stock levels and reorder products"
      sidebarItems={sidebarItems}
      userRole="branch_manager"
      userName="Rahul Kumar"
      storeName="Downtown Mall"
    >
      <div className="space-y-6">
        {/* Alert Cards */}
        <div className="grid gap-4 sm:grid-cols-2">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="border-orange-200 bg-orange-50/50 dark:border-orange-800 dark:bg-orange-950/20">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/50">
                  <TrendingDown className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-orange-700 dark:text-orange-400">
                    {lowStockCount}
                  </p>
                  <p className="text-sm text-orange-600 dark:text-orange-500">
                    Low stock items
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/20">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/50">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-red-700 dark:text-red-400">
                    {outOfStockCount}
                  </p>
                  <p className="text-sm text-red-600 dark:text-red-500">Out of stock</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Inventory Table */}
        <DataTable
          columns={columns}
          data={filteredInventory}
          searchPlaceholder="Search products..."
          filterComponent={
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          }
        />
      </div>
    </DashboardLayout>
  );
}
