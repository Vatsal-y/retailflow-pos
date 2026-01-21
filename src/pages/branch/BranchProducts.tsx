import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockProducts } from "@/data/mockData";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  Tags,
  BarChart3,
  Settings,
  Plus,
  Edit,
  Trash2,
  ImageIcon,
} from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const sidebarItems = [
  { label: "Dashboard", href: "/branch", icon: LayoutDashboard },
  { label: "Orders", href: "/branch/orders", icon: ShoppingCart },
  { label: "Inventory", href: "/branch/inventory", icon: Package },
  { label: "Employees", href: "/branch/employees", icon: Users },
  { label: "Products", href: "/branch/products", icon: Tags },
  { label: "Reports", href: "/branch/reports", icon: BarChart3 },
  { label: "Settings", href: "/branch/settings", icon: Settings },
];

export default function BranchProducts() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const categories = [...new Set(mockProducts.map((p) => p.categoryName))];

  const filteredProducts = mockProducts.filter((product) => {
    if (categoryFilter !== "all" && product.categoryName !== categoryFilter) return false;
    return true;
  });

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "image",
      header: "",
      cell: ({ row }) => (
        <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
          {row.original.image ? (
            <img
              src={row.original.image}
              alt={row.original.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <ImageIcon className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
      ),
    },
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
      accessorKey: "categoryName",
      header: "Category",
      cell: ({ row }) => <Badge variant="outline">{row.getValue("categoryName")}</Badge>,
    },
    {
      accessorKey: "stock",
      header: "Stock",
      cell: ({ row }) => {
        const stock = row.getValue("stock") as number;
        const threshold = row.original.lowStockThreshold;
        return (
          <span className={stock <= threshold ? "text-destructive font-medium" : ""}>
            {stock} {row.original.unit}
          </span>
        );
      },
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => (
        <span className="font-semibold">₹{(row.getValue("price") as number).toFixed(2)}</span>
      ),
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => (
        <StatusBadge status={row.getValue("isActive") ? "active" : "inactive"} />
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              Actions
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <DashboardLayout
      title="Products"
      subtitle="Manage product catalog"
      sidebarItems={sidebarItems}
      userRole="branch_manager"
      userName="Rahul Kumar"
      storeName="Downtown Mall"
    >
      <div className="space-y-4">
        <div className="flex justify-end">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Product Name</Label>
                    <Input placeholder="Product name" />
                  </div>
                  <div className="space-y-2">
                    <Label>SKU</Label>
                    <Input placeholder="SKU001" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat || ""}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Price (₹)</Label>
                    <Input type="number" placeholder="0.00" />
                  </div>
                  <div className="space-y-2">
                    <Label>Stock</Label>
                    <Input type="number" placeholder="0" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Low Stock Threshold</Label>
                  <Input type="number" placeholder="10" />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button variant="outline" className="flex-1" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button className="flex-1" onClick={() => setIsAddDialogOpen(false)}>
                    Add Product
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <DataTable
          columns={columns}
          data={filteredProducts}
          searchPlaceholder="Search products..."
          filterComponent={
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat || ""}>
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
