import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  Tags,
  BarChart3,
  Settings,
  Store,
  Clock,
  Printer,
  Bell,
  Shield,
} from "lucide-react";
import { useState } from "react";

const sidebarItems = [
  { label: "Dashboard", href: "/branch", icon: LayoutDashboard },
  { label: "Orders", href: "/branch/orders", icon: ShoppingCart },
  { label: "Inventory", href: "/branch/inventory", icon: Package },
  { label: "Employees", href: "/branch/employees", icon: Users },
  { label: "Products", href: "/branch/products", icon: Tags },
  { label: "Reports", href: "/branch/reports", icon: BarChart3 },
  { label: "Settings", href: "/branch/settings", icon: Settings },
];

export default function BranchSettings() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [lowStockAlerts, setLowStockAlerts] = useState(true);
  const [autoPrint, setAutoPrint] = useState(false);

  return (
    <DashboardLayout
      title="Settings"
      subtitle="Configure branch preferences"
      sidebarItems={sidebarItems}
      userRole="branch_manager"
      userName="Rahul Kumar"
      storeName="Downtown Mall"
    >
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="general" className="gap-2">
            <Store className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="operations" className="gap-2">
            <Clock className="h-4 w-4" />
            Operations
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="receipts" className="gap-2">
            <Printer className="h-4 w-4" />
            Receipts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Store className="h-5 w-5" />
                Branch Information
              </CardTitle>
              <CardDescription>
                Basic details about your branch location
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Branch Name</Label>
                  <Input defaultValue="Downtown Mall" />
                </div>
                <div className="space-y-2">
                  <Label>Branch Code</Label>
                  <Input defaultValue="DTM001" disabled />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Address</Label>
                <Input defaultValue="123 Main Street, Galaxy Mall" />
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label>City</Label>
                  <Input defaultValue="Mumbai" />
                </div>
                <div className="space-y-2">
                  <Label>State</Label>
                  <Input defaultValue="Maharashtra" />
                </div>
                <div className="space-y-2">
                  <Label>PIN Code</Label>
                  <Input defaultValue="400001" />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input defaultValue="+91 9876543210" />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" defaultValue="downtown@pospro.com" />
                </div>
              </div>
              <div className="pt-4">
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="operations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Operating Hours
              </CardTitle>
              <CardDescription>
                Set your branch opening and closing times
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Opening Time</Label>
                  <Input type="time" defaultValue="09:00" />
                </div>
                <div className="space-y-2">
                  <Label>Closing Time</Label>
                  <Input type="time" defaultValue="21:00" />
                </div>
              </div>
              <Separator />
              <div className="space-y-4">
                <h4 className="font-medium">Tax Configuration</h4>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>GST Rate (%)</Label>
                    <Input type="number" defaultValue="18" />
                  </div>
                  <div className="space-y-2">
                    <Label>GSTIN</Label>
                    <Input defaultValue="27XXXXX1234X1Z5" />
                  </div>
                </div>
              </div>
              <Separator />
              <div className="space-y-4">
                <h4 className="font-medium">Shift Settings</h4>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Default Opening Cash</Label>
                    <Input type="number" defaultValue="5000" />
                  </div>
                  <div className="space-y-2">
                    <Label>Cash Discrepancy Threshold</Label>
                    <Input type="number" defaultValue="100" />
                  </div>
                </div>
              </div>
              <div className="pt-4">
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Configure how you receive alerts and updates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Receive daily sales summary via email
                  </p>
                </div>
                <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Low Stock Alerts</p>
                  <p className="text-sm text-muted-foreground">
                    Get notified when products reach reorder level
                  </p>
                </div>
                <Switch checked={lowStockAlerts} onCheckedChange={setLowStockAlerts} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Shift End Reminders</p>
                  <p className="text-sm text-muted-foreground">
                    Remind cashiers to close their shifts
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">High-Value Order Alerts</p>
                  <p className="text-sm text-muted-foreground">
                    Alert for orders above ₹10,000
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="receipts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Printer className="h-5 w-5" />
                Receipt Settings
              </CardTitle>
              <CardDescription>
                Customize your receipt layout and printing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Auto-Print Receipts</p>
                  <p className="text-sm text-muted-foreground">
                    Automatically print after each sale
                  </p>
                </div>
                <Switch checked={autoPrint} onCheckedChange={setAutoPrint} />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>Receipt Header Text</Label>
                <Input defaultValue="Thank you for shopping with us!" />
              </div>
              <div className="space-y-2">
                <Label>Receipt Footer Text</Label>
                <Input defaultValue="Visit again! Returns within 7 days." />
              </div>
              <div className="space-y-2">
                <Label>Paper Size</Label>
                <Select defaultValue="80mm">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="58mm">58mm (2.25")</SelectItem>
                    <SelectItem value="80mm">80mm (3.15")</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="pt-4">
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
