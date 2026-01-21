import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockProducts } from "@/data/mockData";
import {
  LayoutDashboard,
  Package,
  Users,
  Tags,
  BarChart3,
  Settings,
  CreditCard,
  Building2,
  Plus,
  Upload,
  Download,
  Edit,
  Trash2,
  ImageIcon,
  MoreHorizontal,
} from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

export default function StoreProducts() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const categories = [...new Set(mockProducts.map((p) => p.categoryName))];

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "image",
      header: "",
      cell: ({ row }) => (
        <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
          {row.original.image ? (
            <img src={row.original.image} alt={row.original.name} className="w-full h-full object-cover" />
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
        <span className="font-mono text-xs bg-muted px-2 py-1 rounded">{row.getValue("sku")}</span>
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
        return (
          <span className={stock < 20 ? "text-destructive font-medium" : ""}>
            {stock}
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
      id: "margin",
      header: "Margin",
      cell: ({ row }) => {
        const margin = Math.round(Math.random() * 20 + 15);
        return <Badge variant="secondary">{margin}%</Badge>;
      },
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.getValue("isActive") ? "active" : "inactive"} />,
    },
    {
      id: "actions",
      cell: () => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem>Duplicate</DropdownMenuItem>
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
      title="Product Catalog"
      subtitle="Manage products across all branches"
      sidebarItems={sidebarItems}
      userRole="store_admin"
      userName="Priya Sharma"
      storeName="Galaxy Retail"
    >
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2 justify-end">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Import CSV
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
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
              <div className="space-y-4 pt-4 max-h-[70vh] overflow-y-auto">
                <div className="space-y-2">
                  <Label>Product Image</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                  </div>
                </div>
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
                  <Label>Description</Label>
                  <Textarea placeholder="Product description..." rows={3} />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat || ""}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Cost Price</Label>
                    <Input type="number" placeholder="0.00" />
                  </div>
                  <div className="space-y-2">
                    <Label>Selling Price</Label>
                    <Input type="number" placeholder="0.00" />
                  </div>
                  <div className="space-y-2">
                    <Label>Stock</Label>
                    <Input type="number" placeholder="0" />
                  </div>
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

        <DataTable columns={columns} data={mockProducts} searchPlaceholder="Search products..." />
      </div>
    </DashboardLayout>
  );
}
