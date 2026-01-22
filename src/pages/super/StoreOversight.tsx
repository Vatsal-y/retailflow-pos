import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  ClipboardCheck,
  CreditCard,
  Store,
  Settings,
  MoreHorizontal,
  Eye,
  Pause,
  Play,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  Users,
  Package,
  ShoppingCart,
  Building2,
  MapPin,
  Calendar,
  Mail,
  Phone,
  ExternalLink,
  AlertTriangle,
} from "lucide-react";

const superAdminSidebarItems = [
  { label: "Dashboard", href: "/super", icon: LayoutDashboard },
  { label: "Pending Approvals", href: "/super/approvals", icon: ClipboardCheck, badge: "3" },
  { label: "Subscriptions", href: "/super/subscriptions", icon: CreditCard },
  { label: "Store Oversight", href: "/super/stores", icon: Store },
  { label: "Platform Settings", href: "/super/settings", icon: Settings },
];

interface StoreData {
  id: string;
  name: string;
  owner: string;
  email: string;
  plan: "Basic" | "Pro" | "Enterprise";
  revenue: string;
  revenueChange: number;
  branches: string;
  orders: number;
  status: "active" | "suspended" | "warning";
  joinDate: string;
  location: string;
}

const stores: StoreData[] = [
  { id: "S001", name: "TechMart Enterprise", owner: "Rahul Sharma", email: "rahul@techmart.in", plan: "Enterprise", revenue: "$45,200", revenueChange: 18, branches: "12/100", orders: 1245, status: "active", joinDate: "Jan 2024", location: "Mumbai" },
  { id: "S002", name: "FashionHub Pro", owner: "Priya Patel", email: "priya@fashionhub.in", plan: "Pro", revenue: "$38,900", revenueChange: 12, branches: "8/100", orders: 892, status: "active", joinDate: "Mar 2024", location: "Delhi" },
  { id: "S003", name: "GroceryKing", owner: "Amit Kumar", email: "amit@groceryking.in", plan: "Enterprise", revenue: "$35,100", revenueChange: 15, branches: "25/100", orders: 2134, status: "active", joinDate: "Jun 2024", location: "Bangalore" },
  { id: "S004", name: "ElectroWorld", owner: "Sarah Mehta", email: "sarah@electroworld.in", plan: "Pro", revenue: "$28,400", revenueChange: 8, branches: "5/100", orders: 567, status: "warning", joinDate: "Aug 2024", location: "Pune" },
  { id: "S005", name: "BookNest", owner: "John Doe", email: "john@booknest.in", plan: "Pro", revenue: "$24,800", revenueChange: 22, branches: "3/100", orders: 345, status: "active", joinDate: "Sep 2024", location: "Chennai" },
  { id: "S006", name: "PharmaCare", owner: "Dr. Khan", email: "khan@pharmacare.in", plan: "Pro", revenue: "$19,500", revenueChange: -5, branches: "6/100", orders: 789, status: "active", joinDate: "Oct 2024", location: "Hyderabad" },
  { id: "S007", name: "AutoParts Plus", owner: "Mike Rajan", email: "mike@autoparts.in", plan: "Enterprise", revenue: "$32,100", revenueChange: 11, branches: "15/100", orders: 456, status: "suspended", joinDate: "Nov 2024", location: "Ahmedabad" },
  { id: "S008", name: "PetWorld", owner: "Lisa Thomas", email: "lisa@petworld.in", plan: "Basic", revenue: "$8,900", revenueChange: -12, branches: "2/10", orders: 234, status: "warning", joinDate: "Dec 2024", location: "Kolkata" },
];

const storeColumns: ColumnDef<StoreData>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <span className="font-mono text-xs text-muted-foreground">{row.getValue("id")}</span>,
  },
  {
    accessorKey: "name",
    header: "Store",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Store className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="font-medium">{row.getValue("name")}</p>
          <p className="text-sm text-muted-foreground">{row.original.owner}</p>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "plan",
    header: "Plan",
    cell: ({ row }) => {
      const plan = row.getValue("plan") as string;
      return (
        <Badge
          variant="outline"
          className={
            plan === "Enterprise"
              ? "bg-accent/10 text-accent border-accent/20"
              : plan === "Pro"
              ? "bg-primary/10 text-primary border-primary/20"
              : ""
          }
        >
          {plan}
        </Badge>
      );
    },
  },
  {
    accessorKey: "revenue",
    header: "Revenue",
    cell: ({ row }) => (
      <div>
        <p className="font-semibold">{row.getValue("revenue")}</p>
        <div className={`flex items-center gap-1 text-xs ${row.original.revenueChange >= 0 ? "text-success" : "text-destructive"}`}>
          {row.original.revenueChange >= 0 ? (
            <TrendingUp className="h-3 w-3" />
          ) : (
            <TrendingDown className="h-3 w-3" />
          )}
          <span>{row.original.revenueChange >= 0 ? "+" : ""}{row.original.revenueChange}%</span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "branches",
    header: "Branches",
  },
  {
    accessorKey: "orders",
    header: "Orders",
    cell: ({ row }) => <span className="font-medium">{row.getValue("orders").toLocaleString()}</span>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge
          className={
            status === "active"
              ? "bg-success/10 text-success border-success/20"
              : status === "warning"
              ? "bg-warning/10 text-warning border-warning/20"
              : "bg-destructive/10 text-destructive border-destructive/20"
          }
        >
          {status === "warning" && <AlertTriangle className="h-3 w-3 mr-1" />}
          {status.charAt(0).toUpperCase() + status.slice(1)}
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
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="gap-2">
            <Eye className="h-4 w-4" />
            View Details
          </DropdownMenuItem>
          <DropdownMenuItem className="gap-2">
            <ExternalLink className="h-4 w-4" />
            Open Store
          </DropdownMenuItem>
          <DropdownMenuItem className="gap-2">
            <MessageSquare className="h-4 w-4" />
            Contact Owner
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {row.original.status === "suspended" ? (
            <DropdownMenuItem className="gap-2 text-success">
              <Play className="h-4 w-4" />
              Reactivate
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem className="gap-2 text-destructive">
              <Pause className="h-4 w-4" />
              Suspend
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

export default function StoreOversight() {
  const [selectedStore, setSelectedStore] = useState<StoreData | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const handleViewDetails = (store: StoreData) => {
    setSelectedStore(store);
    setDetailsOpen(true);
  };

  return (
    <DashboardLayout
      sidebarItems={superAdminSidebarItems}
      title="Store Oversight"
      subtitle="Monitor and manage all platform stores"
      userRole="super_admin"
      userName="Admin User"
      storeName="POS Pro Platform"
    >
      <div className="space-y-6">
        {/* Overview Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Stores</p>
                  <p className="text-2xl font-bold">245</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
                  <Store className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active</p>
                  <p className="text-2xl font-bold">231</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-warning" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Warnings</p>
                  <p className="text-2xl font-bold">8</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-destructive/10 flex items-center justify-center">
                  <Pause className="h-6 w-6 text-destructive" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Suspended</p>
                  <p className="text-2xl font-bold">6</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stores Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>All Stores</CardTitle>
                  <CardDescription>Complete list of platform stores</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={storeColumns}
                data={stores}
                searchPlaceholder="Search stores..."
                onExport={() => console.log("Exporting...")}
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Store Details Dialog */}
        <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Store Details</DialogTitle>
              <DialogDescription>
                Complete information about the selected store
              </DialogDescription>
            </DialogHeader>
            
            {selectedStore && (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Store className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{selectedStore.name}</h3>
                    <p className="text-muted-foreground">{selectedStore.owner}</p>
                  </div>
                  <Badge
                    className={`ml-auto ${
                      selectedStore.status === "active"
                        ? "bg-success/10 text-success border-success/20"
                        : selectedStore.status === "warning"
                        ? "bg-warning/10 text-warning border-warning/20"
                        : "bg-destructive/10 text-destructive border-destructive/20"
                    }`}
                  >
                    {selectedStore.status.charAt(0).toUpperCase() + selectedStore.status.slice(1)}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Users className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-2xl font-bold">{selectedStore.branches}</p>
                      <p className="text-sm text-muted-foreground">Branches</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <ShoppingCart className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-2xl font-bold">{selectedStore.orders.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">Total Orders</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Package className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-2xl font-bold">1,245</p>
                      <p className="text-sm text-muted-foreground">Products</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-success/5 border-success/20">
                    <CardContent className="p-4 text-center">
                      <TrendingUp className="h-6 w-6 mx-auto mb-2 text-success" />
                      <p className="text-2xl font-bold text-success">{selectedStore.revenue}</p>
                      <p className="text-sm text-muted-foreground">Revenue</p>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span>{selectedStore.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>+91 98765 43210</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{selectedStore.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Joined {selectedStore.joinDate}</span>
                  </div>
                </div>
              </div>
            )}
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setDetailsOpen(false)}>
                Close
              </Button>
              <Button variant="outline" className="gap-2">
                <MessageSquare className="h-4 w-4" />
                Contact Owner
              </Button>
              <Button className="gap-2">
                <ExternalLink className="h-4 w-4" />
                Open Store Dashboard
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
