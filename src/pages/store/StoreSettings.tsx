import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Store,
  Package,
  Users,
  BarChart3,
  CreditCard,
  Settings,
  Building2,
  CreditCard as PaymentIcon,
  Bell,
  FileText,
  Key,
  Upload,
  Download,
  Eye,
  EyeOff,
  Copy,
  RefreshCw,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const storeAdminSidebarItems = [
  { label: "Dashboard", href: "/store", icon: LayoutDashboard },
  { label: "Branches", href: "/store/branches", icon: Store },
  { label: "Products", href: "/store/products", icon: Package },
  { label: "Employees", href: "/store/employees", icon: Users },
  { label: "Analytics", href: "/store/analytics", icon: BarChart3 },
  { label: "Subscription", href: "/store/subscription", icon: CreditCard },
  { label: "Settings", href: "/store/settings", icon: Settings },
];

interface Invoice {
  id: string;
  date: string;
  amount: string;
  status: "paid" | "pending" | "failed";
  plan: string;
}

const invoiceColumns: ColumnDef<Invoice>[] = [
  { accessorKey: "id", header: "Invoice #" },
  { accessorKey: "date", header: "Date" },
  { accessorKey: "plan", header: "Plan" },
  { accessorKey: "amount", header: "Amount" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge
          variant={status === "paid" ? "default" : status === "pending" ? "secondary" : "destructive"}
          className={
            status === "paid"
              ? "bg-success/10 text-success border-success/20"
              : status === "pending"
              ? "bg-warning/10 text-warning border-warning/20"
              : ""
          }
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <Button variant="ghost" size="sm" className="gap-2">
        <Download className="h-4 w-4" />
        Download
      </Button>
    ),
  },
];

const mockInvoices: Invoice[] = [
  { id: "INV-2026-001", date: "Jan 15, 2026", amount: "₹2,999", status: "paid", plan: "Pro" },
  { id: "INV-2025-012", date: "Dec 15, 2025", amount: "₹2,999", status: "paid", plan: "Pro" },
  { id: "INV-2025-011", date: "Nov 15, 2025", amount: "₹2,999", status: "paid", plan: "Pro" },
  { id: "INV-2025-010", date: "Oct 15, 2025", amount: "₹1,299", status: "paid", plan: "Basic" },
  { id: "INV-2025-009", date: "Sep 15, 2025", amount: "₹1,299", status: "paid", plan: "Basic" },
];

export default function StoreSettings() {
  const [showApiKey, setShowApiKey] = useState(false);
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    lowStock: true,
    newOrders: true,
    reports: false,
  });

  const apiKey = "pk_live_51NxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxYz";
  const secretKey = "sk_live_51NxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxAb";

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <DashboardLayout
      sidebarItems={storeAdminSidebarItems}
      title="Settings"
      subtitle="Manage your store configuration"
      userRole="store_admin"
      userName="Sarah Admin"
      storeName="TechMart Enterprise"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Tabs defaultValue="company" className="space-y-6">
          <TabsList className="bg-muted/50 p-1">
            <TabsTrigger value="company" className="gap-2 data-[state=active]:bg-background">
              <Building2 className="h-4 w-4" />
              Company
            </TabsTrigger>
            <TabsTrigger value="payments" className="gap-2 data-[state=active]:bg-background">
              <PaymentIcon className="h-4 w-4" />
              Payments
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2 data-[state=active]:bg-background">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="billing" className="gap-2 data-[state=active]:bg-background">
              <FileText className="h-4 w-4" />
              Billing
            </TabsTrigger>
            <TabsTrigger value="api" className="gap-2 data-[state=active]:bg-background">
              <Key className="h-4 w-4" />
              API Keys
            </TabsTrigger>
          </TabsList>

          {/* Company Info Tab */}
          <TabsContent value="company" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
                <CardDescription>Update your company details and branding</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start gap-6">
                  <div className="w-32 h-32 rounded-xl bg-muted flex items-center justify-center border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 transition-colors cursor-pointer">
                    <div className="text-center">
                      <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <span className="text-xs text-muted-foreground">Upload Logo</span>
                    </div>
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Company Name</Label>
                        <Input defaultValue="TechMart Enterprise" />
                      </div>
                      <div className="space-y-2">
                        <Label>Legal Name</Label>
                        <Input defaultValue="TechMart Private Limited" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Tax ID (GST)</Label>
                        <Input defaultValue="27AABCT1234F1ZH" />
                      </div>
                      <div className="space-y-2">
                        <Label>PAN</Label>
                        <Input defaultValue="AABCT1234F" />
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Business Address</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2 col-span-2">
                      <Label>Street Address</Label>
                      <Input defaultValue="123 Tech Park, Electronic City" />
                    </div>
                    <div className="space-y-2">
                      <Label>City</Label>
                      <Input defaultValue="Bangalore" />
                    </div>
                    <div className="space-y-2">
                      <Label>State</Label>
                      <Input defaultValue="Karnataka" />
                    </div>
                    <div className="space-y-2">
                      <Label>PIN Code</Label>
                      <Input defaultValue="560100" />
                    </div>
                    <div className="space-y-2">
                      <Label>Country</Label>
                      <Input defaultValue="India" />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button className="gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payment Gateways Tab */}
          <TabsContent value="payments" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-2 border-primary/20 bg-primary/5">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <span className="font-bold text-primary">R</span>
                      </div>
                      <div>
                        <CardTitle className="text-lg">Razorpay</CardTitle>
                        <CardDescription>Primary gateway</CardDescription>
                      </div>
                    </div>
                    <Badge className="bg-success/10 text-success border-success/20">Connected</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Key ID</Label>
                    <Input defaultValue="rzp_live_xxxxxxxxxx" readOnly className="bg-muted/50" />
                  </div>
                  <div className="space-y-2">
                    <Label>Key Secret</Label>
                    <div className="relative">
                      <Input
                        type={showApiKey ? "text" : "password"}
                        defaultValue="xxxxxxxxxxxxxxxxxxxxxx"
                        readOnly
                        className="bg-muted/50 pr-10"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0"
                        onClick={() => setShowApiKey(!showApiKey)}
                      >
                        {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    Update Credentials
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-dashed">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                        <span className="font-bold text-muted-foreground">S</span>
                      </div>
                      <div>
                        <CardTitle className="text-lg">Stripe</CardTitle>
                        <CardDescription>International payments</CardDescription>
                      </div>
                    </div>
                    <Badge variant="secondary">Not Connected</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button className="w-full gap-2">
                    <Key className="h-4 w-4" />
                    Connect Stripe
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Choose how you want to receive updates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                    Channels
                  </h4>
                  <div className="space-y-4">
                    {[
                      { key: "email", label: "Email Notifications", desc: "Receive updates via email" },
                      { key: "push", label: "Push Notifications", desc: "Browser push notifications" },
                      { key: "sms", label: "SMS Notifications", desc: "Text message alerts (additional charges may apply)" },
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                        <div>
                          <p className="font-medium">{item.label}</p>
                          <p className="text-sm text-muted-foreground">{item.desc}</p>
                        </div>
                        <Switch
                          checked={notifications[item.key as keyof typeof notifications]}
                          onCheckedChange={(checked) =>
                            setNotifications({ ...notifications, [item.key]: checked })
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                    Alerts
                  </h4>
                  <div className="space-y-4">
                    {[
                      { key: "lowStock", label: "Low Stock Alerts", desc: "When inventory drops below threshold" },
                      { key: "newOrders", label: "New Order Notifications", desc: "Real-time order alerts" },
                      { key: "reports", label: "Daily Reports", desc: "End of day summary emails" },
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                        <div>
                          <p className="font-medium">{item.label}</p>
                          <p className="text-sm text-muted-foreground">{item.desc}</p>
                        </div>
                        <Switch
                          checked={notifications[item.key as keyof typeof notifications]}
                          onCheckedChange={(checked) =>
                            setNotifications({ ...notifications, [item.key]: checked })
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Billing History Tab */}
          <TabsContent value="billing" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Billing History</CardTitle>
                    <CardDescription>View and download past invoices</CardDescription>
                  </div>
                  <Button variant="outline" className="gap-2">
                    <Download className="h-4 w-4" />
                    Export All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <DataTable columns={invoiceColumns} data={mockInvoices} searchPlaceholder="Search invoices..." />
              </CardContent>
            </Card>
          </TabsContent>

          {/* API Keys Tab */}
          <TabsContent value="api" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>API Keys</CardTitle>
                <CardDescription>
                  Use these keys to integrate with external systems. Keep them secure!
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 rounded-lg bg-warning/10 border border-warning/20 flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-warning">Security Warning</p>
                    <p className="text-sm text-muted-foreground">
                      Never share your secret key. It provides full access to your account.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Publishable Key</Label>
                    <div className="flex gap-2">
                      <Input value={apiKey} readOnly className="font-mono text-sm bg-muted/50" />
                      <Button variant="outline" size="icon" onClick={() => copyToClipboard(apiKey)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Secret Key</Label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Input
                          type={showSecretKey ? "text" : "password"}
                          value={secretKey}
                          readOnly
                          className="font-mono text-sm bg-muted/50 pr-10"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0"
                          onClick={() => setShowSecretKey(!showSecretKey)}
                        >
                          {showSecretKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                      <Button variant="outline" size="icon" onClick={() => copyToClipboard(secretKey)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Regenerate API Keys</p>
                    <p className="text-sm text-muted-foreground">
                      This will invalidate your current keys
                    </p>
                  </div>
                  <Button variant="destructive" className="gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Regenerate Keys
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </DashboardLayout>
  );
}
