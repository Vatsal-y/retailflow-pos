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
  ShoppingCart,
  Package,
  Users,
  Tags,
  BarChart3,
  Settings,
  Plus,
  Mail,
  Phone,
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

const sidebarItems = [
  { label: "Dashboard", href: "/branch", icon: LayoutDashboard },
  { label: "Orders", href: "/branch/orders", icon: ShoppingCart, badge: 12 },
  { label: "Inventory", href: "/branch/inventory", icon: Package, badge: 3 },
  { label: "Employees", href: "/branch/employees", icon: Users },
  { label: "Products", href: "/branch/products", icon: Tags },
  { label: "Reports", href: "/branch/reports", icon: BarChart3 },
  { label: "Settings", href: "/branch/settings", icon: Settings },
];

export default function BranchEmployees() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "name",
      header: "Employee",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={row.original.avatar} />
            <AvatarFallback className="bg-primary/10 text-primary text-xs">
              {row.original.name
                .split(" ")
                .map((n: string) => n[0])
                .join("")}
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
      accessorKey: "phone",
      header: "Contact",
      cell: ({ row }) => (
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Phone className="h-3 w-3" />
          {row.getValue("phone")}
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
                perf >= 90
                  ? "[&>div]:bg-success"
                  : perf >= 75
                  ? "[&>div]:bg-primary"
                  : "[&>div]:bg-warning"
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
        <span className="font-medium">
          ₹{(row.getValue("salary") as number).toLocaleString()}
        </span>
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
        <div className="flex gap-1">
          <Button variant="ghost" size="icon">
            <Mail className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            Edit
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout
      title="Employees"
      subtitle="Manage branch staff and performance"
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
                Add Employee
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Employee</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>First Name</Label>
                    <Input placeholder="John" />
                  </div>
                  <div className="space-y-2">
                    <Label>Last Name</Label>
                    <Input placeholder="Doe" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" placeholder="john@example.com" />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input placeholder="9876543210" />
                </div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cashier">Cashier</SelectItem>
                      <SelectItem value="branch_manager">Branch Manager</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Monthly Salary</Label>
                  <Input type="number" placeholder="25000" />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button variant="outline" className="flex-1" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button className="flex-1" onClick={() => setIsAddDialogOpen(false)}>
                    Add Employee
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <DataTable
          columns={columns}
          data={mockEmployees}
          searchPlaceholder="Search employees..."
        />
      </div>
    </DashboardLayout>
  );
}
