import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { mockEmployees } from "@/data/dashboardMockData";
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
  MoreHorizontal,
} from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

export default function StoreEmployees() {
  const [branchFilter, setBranchFilter] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  const branches = [...new Set(mockEmployees.map((e) => e.branchName))];

  const filteredEmployees = mockEmployees.filter((emp) => {
    if (branchFilter !== "all" && emp.branchName !== branchFilter) return false;
    if (roleFilter !== "all" && emp.role !== roleFilter) return false;
    return true;
  });

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "name",
      header: "Employee",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={row.original.avatar} />
            <AvatarFallback className="bg-primary/10 text-primary text-xs">
              {row.original.name.split(" ").map((n: string) => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{row.getValue("name")}</p>
            <p className="text-xs text-muted-foreground">{row.original.email}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => (
        <Badge variant="outline" className="capitalize">
          {(row.getValue("role") as string).replace("_", " ")}
        </Badge>
      ),
    },
    {
      accessorKey: "branchName",
      header: "Branch",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-muted-foreground" />
          <span>{row.getValue("branchName")}</span>
        </div>
      ),
    },
    {
      accessorKey: "performance",
      header: "Performance",
      cell: ({ row }) => {
        const perf = row.getValue("performance") as number;
        return (
          <div className="w-24">
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium">{perf}%</span>
            </div>
            <Progress
              value={perf}
              className={`h-2 ${
                perf >= 90 ? "[&>div]:bg-success" : perf >= 75 ? "[&>div]:bg-primary" : "[&>div]:bg-warning"
              }`}
            />
          </div>
        );
      },
    },
    {
      accessorKey: "salary",
      header: "Salary",
      cell: ({ row }) => (
        <span className="font-medium">₹{(row.getValue("salary") as number).toLocaleString()}</span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
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
            <DropdownMenuItem>View Profile</DropdownMenuItem>
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>Transfer Branch</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">Deactivate</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <DashboardLayout
      title="Employees"
      subtitle="Manage staff across all branches"
      sidebarItems={sidebarItems}
      userRole="store_admin"
      userName="Priya Sharma"
      storeName="Galaxy Retail"
    >
      <div className="space-y-4">
        <div className="flex justify-end">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Employee
          </Button>
        </div>

        <DataTable
          columns={columns}
          data={filteredEmployees}
          searchPlaceholder="Search employees..."
          filterComponent={
            <div className="flex gap-2">
              <Select value={branchFilter} onValueChange={setBranchFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Branch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Branches</SelectItem>
                  {branches.map((b) => (
                    <SelectItem key={b} value={b}>{b}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="cashier">Cashier</SelectItem>
                  <SelectItem value="branch_manager">Branch Manager</SelectItem>
                  <SelectItem value="store_admin">Store Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          }
        />
      </div>
    </DashboardLayout>
  );
}
