import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DataTable } from "@/components/ui/data-table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
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
  Plus,
  Pencil,
  Trash2,
  GripVertical,
  ChevronRight,
  Image,
  Archive,
  MoreHorizontal,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

interface Category {
  id: string;
  name: string;
  description: string;
  productsCount: number;
  salesPercent: number;
  parent: string | null;
  status: "active" | "archived";
  icon: string;
}

const categoriesData: Category[] = [
  { id: "CAT001", name: "Electronics", description: "Electronic devices and gadgets", productsCount: 245, salesPercent: 35.2, parent: null, status: "active", icon: "📱" },
  { id: "CAT002", name: "Smartphones", description: "Mobile phones and accessories", productsCount: 89, salesPercent: 18.5, parent: "Electronics", status: "active", icon: "📲" },
  { id: "CAT003", name: "Fashion", description: "Clothing and apparel", productsCount: 312, salesPercent: 28.4, parent: null, status: "active", icon: "👕" },
  { id: "CAT004", name: "Men's Wear", description: "Men's clothing collection", productsCount: 156, salesPercent: 14.2, parent: "Fashion", status: "active", icon: "👔" },
  { id: "CAT005", name: "Home & Living", description: "Home decor and furniture", productsCount: 178, salesPercent: 15.8, parent: null, status: "active", icon: "🏠" },
  { id: "CAT006", name: "Beauty & Care", description: "Cosmetics and personal care", productsCount: 134, salesPercent: 12.1, parent: null, status: "active", icon: "💄" },
  { id: "CAT007", name: "Sports", description: "Sports equipment and gear", productsCount: 98, salesPercent: 8.5, parent: null, status: "active", icon: "⚽" },
  { id: "CAT008", name: "Books", description: "Books and stationery", productsCount: 67, salesPercent: 4.2, parent: null, status: "archived", icon: "📚" },
];

const columns: ColumnDef<Category>[] = [
  {
    id: "drag",
    header: "",
    cell: () => (
      <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
    ),
    size: 40,
  },
  {
    accessorKey: "name",
    header: "Category",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <span className="text-2xl">{row.original.icon}</span>
        <div>
          <p className="font-medium">{row.original.name}</p>
          {row.original.parent && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <ChevronRight className="h-3 w-3" />
              {row.original.parent}
            </div>
          )}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground line-clamp-1">
        {row.getValue("description")}
      </span>
    ),
  },
  {
    accessorKey: "productsCount",
    header: "Products",
    cell: ({ row }) => (
      <Badge variant="outline" className="font-medium">
        {row.getValue("productsCount")} items
      </Badge>
    ),
  },
  {
    accessorKey: "salesPercent",
    header: "Sales %",
    cell: ({ row }) => {
      const percent = row.getValue("salesPercent") as number;
      return (
        <div className="flex items-center gap-2">
          <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full" 
              style={{ width: `${percent}%` }}
            />
          </div>
          <span className="text-sm font-medium">{percent}%</span>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge className={
          status === "active" 
            ? "bg-success/10 text-success border-success/20" 
            : "bg-muted text-muted-foreground"
        }>
          {status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem className="gap-2">
            <Pencil className="h-4 w-4" />
            Edit Category
          </DropdownMenuItem>
          <DropdownMenuItem className="gap-2">
            <Archive className="h-4 w-4" />
            Archive
          </DropdownMenuItem>
          <DropdownMenuItem className="gap-2 text-destructive">
            <Trash2 className="h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

export default function StoreCategories() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    parent: "",
    icon: "📦",
  });

  const handleAddCategory = () => {
    console.log("Adding category:", newCategory);
    setIsAddOpen(false);
    setNewCategory({ name: "", description: "", parent: "", icon: "📦" });
  };

  const activeCategories = categoriesData.filter(c => c.status === "active").length;
  const totalProducts = categoriesData.reduce((sum, c) => sum + c.productsCount, 0);

  return (
    <DashboardLayout
      sidebarItems={storeAdminSidebarItems}
      title="Categories"
      subtitle="Organize your product catalog"
      userRole="store_admin"
      userName="Store Admin"
      storeName="TechMart Enterprise"
    >
      <div className="space-y-6">
        {/* Stats & Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{activeCategories}</p>
              <p className="text-sm text-muted-foreground">Active Categories</p>
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="text-center">
              <p className="text-2xl font-bold">{totalProducts}</p>
              <p className="text-sm text-muted-foreground">Total Products</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2">
              <Archive className="h-4 w-4" />
              View Archived
            </Button>
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Category
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Category</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Category Name *</Label>
                    <Input
                      id="name"
                      value={newCategory.name}
                      onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                      placeholder="e.g., Electronics"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newCategory.description}
                      onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                      placeholder="Brief description of the category"
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="parent">Parent Category (Optional)</Label>
                    <Input
                      id="parent"
                      value={newCategory.parent}
                      onChange={(e) => setNewCategory({ ...newCategory, parent: e.target.value })}
                      placeholder="Leave empty for top-level"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Category Icon</Label>
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-12 rounded-lg border-2 border-dashed border-border flex items-center justify-center text-2xl">
                        {newCategory.icon}
                      </div>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Image className="h-4 w-4" />
                        Upload Image
                      </Button>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddCategory}>
                    Create Category
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </motion.div>

        {/* Info Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <GripVertical className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Drag & Drop Reordering</p>
                  <p className="text-sm text-muted-foreground">
                    Drag categories to reorder them. Changes are saved automatically.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Categories Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">All Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={columns}
                data={categoriesData}
                searchPlaceholder="Search categories..."
              />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}