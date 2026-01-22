import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  ClipboardCheck,
  CreditCard,
  Store,
  Settings,
  TrendingUp,
  DollarSign,
  Users,
  Calendar,
  ChevronUp,
  ChevronDown,
  Edit,
  Pause,
  Play,
  RefreshCw,
  Download,
  ArrowUpCircle,
} from "lucide-react";

const superAdminSidebarItems = [
  { label: "Dashboard", href: "/super", icon: LayoutDashboard },
  { label: "Pending Approvals", href: "/super/approvals", icon: ClipboardCheck, badge: "3" },
  { label: "Subscriptions", href: "/super/subscriptions", icon: CreditCard },
  { label: "Store Oversight", href: "/super/stores", icon: Store },
  { label: "Platform Settings", href: "/super/settings", icon: Settings },
];

interface Subscription {
  id: string;
  storeName: string;
  owner: string;
  plan: "Basic" | "Pro" | "Enterprise";
  status: "active" | "paused" | "cancelled" | "trial";
  usage: number;
  nextBilling: string;
  amount: string;
  startDate: string;
}

const subscriptionColumns: ColumnDef<Subscription>[] = [
  {
    accessorKey: "storeName",
    header: "Store",
    cell: ({ row }) => (
      <div>
        <p className="font-medium">{row.getValue("storeName")}</p>
        <p className="text-sm text-muted-foreground">{row.original.owner}</p>
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
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge
          className={
            status === "active"
              ? "bg-success/10 text-success border-success/20"
              : status === "paused"
              ? "bg-warning/10 text-warning border-warning/20"
              : status === "trial"
              ? "bg-info/10 text-info border-info/20"
              : "bg-destructive/10 text-destructive border-destructive/20"
          }
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      );
    },
  },
  {
    accessorKey: "usage",
    header: "Usage",
    cell: ({ row }) => {
      const usage = row.getValue("usage") as number;
      return (
        <div className="w-24">
          <div className="flex items-center justify-between text-xs mb-1">
            <span>{usage}%</span>
          </div>
          <Progress value={usage} className="h-1.5" />
        </div>
      );
    },
  },
  {
    accessorKey: "nextBilling",
    header: "Next Billing",
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => <span className="font-semibold">{row.getValue("amount")}</span>,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex gap-1">
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Edit className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          {row.original.status === "paused" ? (
            <Play className="h-4 w-4" />
          ) : (
            <Pause className="h-4 w-4" />
          )}
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <ArrowUpCircle className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];

const subscriptions: Subscription[] = [
  { id: "SUB001", storeName: "TechMart Enterprise", owner: "Rahul S.", plan: "Enterprise", status: "active", usage: 85, nextBilling: "Jan 25, 2026", amount: "$4,999", startDate: "Jan 2024" },
  { id: "SUB002", storeName: "FashionHub Pro", owner: "Priya P.", plan: "Pro", status: "active", usage: 62, nextBilling: "Jan 28, 2026", amount: "$2,999", startDate: "Mar 2024" },
  { id: "SUB003", storeName: "GroceryKing", owner: "Amit K.", plan: "Enterprise", status: "active", usage: 91, nextBilling: "Feb 1, 2026", amount: "$4,999", startDate: "Jun 2024" },
  { id: "SUB004", storeName: "BookNest", owner: "John D.", plan: "Pro", status: "paused", usage: 45, nextBilling: "-", amount: "$2,999", startDate: "Aug 2024" },
  { id: "SUB005", storeName: "CafeDelights", owner: "Sarah M.", plan: "Basic", status: "trial", usage: 23, nextBilling: "Jan 30, 2026", amount: "$1,299", startDate: "Jan 2026" },
  { id: "SUB006", storeName: "PharmaCare", owner: "Dr. Khan", plan: "Pro", status: "active", usage: 78, nextBilling: "Feb 5, 2026", amount: "$2,999", startDate: "Oct 2024" },
  { id: "SUB007", storeName: "AutoParts Plus", owner: "Mike R.", plan: "Enterprise", status: "active", usage: 56, nextBilling: "Feb 10, 2026", amount: "$4,999", startDate: "Nov 2024" },
  { id: "SUB008", storeName: "PetWorld", owner: "Lisa T.", plan: "Basic", status: "cancelled", usage: 0, nextBilling: "-", amount: "$1,299", startDate: "Sep 2024" },
];

export default function SubscriptionManagement() {
  const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false);

  return (
    <DashboardLayout
      sidebarItems={superAdminSidebarItems}
      title="Subscription Management"
      subtitle="Manage customer subscriptions and billing"
      userRole="super_admin"
      userName="Admin User"
      storeName="POS Pro Platform"
    >
      <div className="space-y-6">
        {/* Revenue Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Monthly Revenue</p>
                  <p className="text-2xl font-bold">$245,000</p>
                  <div className="flex items-center gap-1 text-success text-sm">
                    <ChevronUp className="h-4 w-4" />
                    <span>12.3% from last month</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Subscriptions</p>
                  <p className="text-2xl font-bold">189</p>
                  <div className="flex items-center gap-1 text-success text-sm">
                    <ChevronUp className="h-4 w-4" />
                    <span>+8 this month</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-lg bg-success/20 flex items-center justify-center">
                  <Users className="h-6 w-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg. Revenue/User</p>
                  <p className="text-2xl font-bold">$1,296</p>
                  <div className="flex items-center gap-1 text-success text-sm">
                    <ChevronUp className="h-4 w-4" />
                    <span>4.2% increase</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-lg bg-info/20 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-info" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Renewals Due</p>
                  <p className="text-2xl font-bold">23</p>
                  <p className="text-sm text-muted-foreground">Next 30 days</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-warning/20 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Plan Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Plan Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { plan: "Basic", count: 89, revenue: "$115,611", color: "muted-foreground", percentage: 36 },
                  { plan: "Pro", count: 68, revenue: "$203,932", color: "primary", percentage: 28 },
                  { plan: "Enterprise", count: 32, revenue: "$159,968", color: "accent", percentage: 13 },
                ].map((item) => (
                  <Card key={item.plan} className="border-2">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <Badge variant="outline" className={`bg-${item.color}/10 text-${item.color} border-${item.color}/20`}>
                          {item.plan}
                        </Badge>
                        <span className="text-2xl font-bold">{item.count}</span>
                      </div>
                      <Progress value={item.percentage} className="h-2 mb-2" />
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Revenue</span>
                        <span className="font-semibold">{item.revenue}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Subscriptions Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>All Subscriptions</CardTitle>
                  <CardDescription>Manage and monitor customer subscriptions</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download className="h-4 w-4" />
                    Export
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Sync Billing
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={subscriptionColumns}
                data={subscriptions}
                searchPlaceholder="Search subscriptions..."
                filterComponent={
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="paused">Paused</SelectItem>
                      <SelectItem value="trial">Trial</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                }
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Upgrade Calculator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-1">Upgrade Calculator</h3>
                  <p className="text-sm text-muted-foreground">
                    Calculate potential revenue from plan upgrades
                  </p>
                </div>
                <Button className="gap-2" onClick={() => setUpgradeDialogOpen(true)}>
                  <ArrowUpCircle className="h-4 w-4" />
                  Open Calculator
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Upgrade Calculator Dialog */}
        <Dialog open={upgradeDialogOpen} onOpenChange={setUpgradeDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Plan Upgrade Calculator</DialogTitle>
              <DialogDescription>
                Calculate revenue impact from plan upgrades
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">From Plan</label>
                  <Select defaultValue="basic">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Basic ($1,299)</SelectItem>
                      <SelectItem value="pro">Pro ($2,999)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">To Plan</label>
                  <Select defaultValue="pro">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pro">Pro ($2,999)</SelectItem>
                      <SelectItem value="enterprise">Enterprise ($4,999)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Number of Conversions</label>
                <Input type="number" defaultValue={10} />
              </div>
              
              <div className="p-4 rounded-lg bg-success/10 border border-success/20">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Potential Monthly Revenue Increase</p>
                  <p className="text-3xl font-bold text-success">+$17,000</p>
                  <p className="text-sm text-muted-foreground mt-1">Based on 10 upgrades from Basic to Pro</p>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setUpgradeDialogOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
