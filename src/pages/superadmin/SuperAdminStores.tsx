import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ColumnDef } from "@tanstack/react-table";
import { motion } from "framer-motion";
import {
  Store,
  Building2,
  DollarSign,
  Calendar,
  MoreHorizontal,
  Eye,
  Ban,
  Mail,
  Star,
  AlertTriangle,
  Users,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { KPICard } from "@/components/ui/kpi-card";

interface StoreData {
  id: string;
  name: string;
  owner: string;
  email: string;
  plan: "Basic" | "Pro" | "Enterprise";
  branches: number;
  branchLimit: number;
  revenue: number;
  expiryDate: string;
  status: "active" | "suspended" | "expiring";
  users: number;
}

const storesData: StoreData[] = [
  { id: "STR001", name: "TechMart Enterprise", owner: "Rahul Sharma", email: "rahul@techmart.com", plan: "Enterprise", branches: 12, branchLimit: 100, revenue: 45200, expiryDate: "2024-12-15", status: "active", users: 48 },
  { id: "STR002", name: "FashionHub Pro", owner: "Priya Patel", email: "priya@fashionhub.com", plan: "Pro", branches: 8, branchLimit: 50, revenue: 38900, expiryDate: "2024-11-20", status: "active", users: 32 },
  { id: "STR003", name: "GroceryKing", owner: "Amit Kumar", email: "amit@groceryking.com", plan: "Enterprise", branches: 15, branchLimit: 100, revenue: 35100, expiryDate: "2024-10-05", status: "expiring", users: 65 },
  { id: "STR004", name: "ElectroWorld", owner: "Sarah Mehta", email: "sarah@electroworld.com", plan: "Pro", branches: 6, branchLimit: 50, revenue: 28400, expiryDate: "2024-12-01", status: "active", users: 24 },
  { id: "STR005", name: "BookNest", owner: "John Davis", email: "john@booknest.com", plan: "Pro", branches: 4, branchLimit: 50, revenue: 24800, expiryDate: "2024-09-15", status: "expiring", users: 18 },
  { id: "STR006", name: "HomePlus", owner: "Lisa Wong", email: "lisa@homeplus.com", plan: "Basic", branches: 2, branchLimit: 10, revenue: 12500, expiryDate: "2024-11-30", status: "active", users: 8 },
  { id: "STR007", name: "SportZone", owner: "Mike Brown", email: "mike@sportzone.com", plan: "Basic", branches: 1, branchLimit: 10, revenue: 8900, expiryDate: "2024-08-20", status: "suspended", users: 5 },
  { id: "STR008", name: "BeautyBay", owner: "Emma Wilson", email: "emma@beautybay.com", plan: "Pro", branches: 5, branchLimit: 50, revenue: 21300, expiryDate: "2024-12-10", status: "active", users: 22 },
];

const columns: ColumnDef<StoreData>[] = [
  {
    accessorKey: "name",
    header: "Store",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Store className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="font-medium">{row.original.name}</p>
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
        <Badge className={
          plan === "Enterprise" ? "bg-accent/10 text-accent border-accent/20" :
          plan === "Pro" ? "bg-primary/10 text-primary border-primary/20" :
          "bg-muted text-muted-foreground"
        }>
          {plan}
        </Badge>
      );
    },
  },
  {
    accessorKey: "branches",
    header: "Branches",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Building2 className="h-4 w-4 text-muted-foreground" />
        <span>{row.original.branches}/{row.original.branchLimit}</span>
      </div>
    ),
  },
  {
    accessorKey: "users",
    header: "Users",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Users className="h-4 w-4 text-muted-foreground" />
        <span>{row.original.users}</span>
      </div>
    ),
  },
  {
    accessorKey: "revenue",
    header: "Revenue",
    cell: ({ row }) => (
      <span className="font-semibold text-primary">
        ${(row.getValue("revenue") as number).toLocaleString()}
      </span>
    ),
  },
  {
    accessorKey: "expiryDate",
    header: "Expiry",
    cell: ({ row }) => {
      const expiry = row.getValue("expiryDate") as string;
      const isExpiring = new Date(expiry) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      return (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className={isExpiring ? "text-warning font-medium" : ""}>{expiry}</span>
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
          status === "active" ? "bg-success/10 text-success border-success/20" :
          status === "expiring" ? "bg-warning/10 text-warning border-warning/20" :
          "bg-destructive/10 text-destructive border-destructive/20"
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
            <Eye className="h-4 w-4" />
            View Details
          </DropdownMenuItem>
          <DropdownMenuItem className="gap-2">
            <Star className="h-4 w-4" />
            Priority Support
          </DropdownMenuItem>
          <DropdownMenuItem className="gap-2">
            <Mail className="h-4 w-4" />
            Send Renewal Notice
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="gap-2 text-destructive">
            <Ban className="h-4 w-4" />
            Suspend Store
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

export default function SuperAdminStores() {
  const [planFilter, setPlanFilter] = useState("all");

  const activeStores = storesData.filter(s => s.status === "active").length;
  const expiringStores = storesData.filter(s => s.status === "expiring").length;
  const totalRevenue = storesData.reduce((sum, s) => sum + s.revenue, 0);

  const filteredData = planFilter === "all" 
    ? storesData 
    : storesData.filter(s => s.plan.toLowerCase() === planFilter);

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <KPICard
          title="Total Stores"
          value={storesData.length.toString()}
          icon={Store}
          iconColor="primary"
        />
        <KPICard
          title="Active Stores"
          value={activeStores.toString()}
          icon={Building2}
          iconColor="success"
        />
        <KPICard
          title="Expiring Soon"
          value={expiringStores.toString()}
          icon={AlertTriangle}
          iconColor="warning"
        />
        <KPICard
          title="Total Revenue"
          value={`$${totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          iconColor="success"
        />
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="flex flex-wrap gap-4"
      >
        <Select value={planFilter} onValueChange={setPlanFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by plan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Plans</SelectItem>
            <SelectItem value="basic">Basic</SelectItem>
            <SelectItem value="pro">Pro</SelectItem>
            <SelectItem value="enterprise">Enterprise</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" className="gap-2">
          <Calendar className="h-4 w-4" />
          Expiring &lt; 30 days
        </Button>
        <Button variant="outline" className="gap-2">
          <DollarSign className="h-4 w-4" />
          High Revenue
        </Button>
      </motion.div>

      {/* Stores Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">All Stores</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={columns}
              data={filteredData}
              searchPlaceholder="Search stores..."
            />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}