import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { mockBranches } from "@/data/dashboardMockData";
import {
  LayoutDashboard,
  Store,
  Package,
  Users,
  Tags,
  BarChart3,
  Settings,
  CreditCard,
  Building2,
  Plus,
  MapPin,
  Phone,
  Mail,
  TrendingUp,
  ShoppingCart,
  Search,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { motion } from "framer-motion";

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

export default function StoreBranches() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredBranches = mockBranches.filter((branch) =>
    branch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    branch.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout
      title="Branch Management"
      subtitle="Manage all your retail locations"
      sidebarItems={sidebarItems}
      userRole="store_admin"
      userName="Priya Sharma"
      storeName="Galaxy Retail"
    >
      <div className="space-y-6">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search branches..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Branch
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Add New Branch</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Branch Name</Label>
                    <Input placeholder="Downtown Store" />
                  </div>
                  <div className="space-y-2">
                    <Label>Branch Code</Label>
                    <Input placeholder="DTS001" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Address</Label>
                  <Input placeholder="123 Main Street" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>City</Label>
                    <Input placeholder="Mumbai" />
                  </div>
                  <div className="space-y-2">
                    <Label>State</Label>
                    <Input placeholder="Maharashtra" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input placeholder="+91 9876543210" />
                  </div>
                  <div className="space-y-2">
                    <Label>Manager</Label>
                    <Input placeholder="Manager name" />
                  </div>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button variant="outline" className="flex-1" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button className="flex-1" onClick={() => setIsAddDialogOpen(false)}>
                    Create Branch
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Branch Cards Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredBranches.map((branch, index) => (
            <motion.div
              key={branch.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
                <div className="h-2 bg-gradient-to-r from-primary to-primary/60" />
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <Store className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{branch.name}</h3>
                        <p className="text-sm text-muted-foreground">{branch.code}</p>
                      </div>
                    </div>
                    <StatusBadge status={branch.status} />
                  </div>

                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{branch.city}, {branch.state}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span>{branch.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{branch.manager}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 py-3 border-t border-border">
                    <div className="text-center">
                      <p className="text-lg font-bold text-primary">
                        ₹{(branch.revenue / 1000).toFixed(0)}k
                      </p>
                      <p className="text-xs text-muted-foreground">Revenue</p>
                    </div>
                    <div className="text-center border-x border-border">
                      <p className="text-lg font-bold">{branch.orders}</p>
                      <p className="text-xs text-muted-foreground">Orders</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold">{branch.employees}</p>
                      <p className="text-xs text-muted-foreground">Staff</p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-3">
                    <Button variant="outline" size="sm" className="flex-1">
                      View Details
                    </Button>
                    <Button size="sm" className="flex-1">
                      Manage
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
