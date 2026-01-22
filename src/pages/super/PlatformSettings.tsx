import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
  DollarSign,
  Mail,
  Shield,
  Zap,
  Database,
  Save,
  Plus,
  Trash2,
  Edit,
  CheckCircle,
  AlertTriangle,
  Clock,
  RefreshCw,
  Cloud,
  Lock,
} from "lucide-react";

const superAdminSidebarItems = [
  { label: "Dashboard", href: "/super", icon: LayoutDashboard },
  { label: "Pending Approvals", href: "/super/approvals", icon: ClipboardCheck, badge: "3" },
  { label: "Subscriptions", href: "/super/subscriptions", icon: CreditCard },
  { label: "Store Oversight", href: "/super/stores", icon: Store },
  { label: "Platform Settings", href: "/super/settings", icon: Settings },
];

const featureFlags = [
  { id: "new_checkout", name: "New Checkout Flow", description: "Enable redesigned checkout experience", enabled: true, rollout: 100 },
  { id: "ai_recommendations", name: "AI Product Recommendations", description: "ML-powered product suggestions", enabled: true, rollout: 75 },
  { id: "multi_currency", name: "Multi-Currency Support", description: "Allow transactions in multiple currencies", enabled: false, rollout: 0 },
  { id: "advanced_analytics", name: "Advanced Analytics", description: "Enhanced reporting dashboard", enabled: true, rollout: 50 },
  { id: "dark_mode_v2", name: "Dark Mode V2", description: "Improved dark theme with OLED support", enabled: false, rollout: 0 },
];

const backupSchedules = [
  { id: 1, type: "Full Backup", frequency: "Daily", time: "02:00 UTC", lastRun: "Jan 22, 2026 02:00", status: "success" },
  { id: 2, type: "Incremental", frequency: "Hourly", time: "Every hour", lastRun: "Jan 22, 2026 14:00", status: "success" },
  { id: 3, type: "Database Export", frequency: "Weekly", time: "Sundays 03:00", lastRun: "Jan 19, 2026 03:00", status: "success" },
];

export default function PlatformSettings() {
  const [features, setFeatures] = useState(featureFlags);

  const toggleFeature = (id: string) => {
    setFeatures((prev) =>
      prev.map((f) => (f.id === id ? { ...f, enabled: !f.enabled } : f))
    );
  };

  return (
    <DashboardLayout
      sidebarItems={superAdminSidebarItems}
      title="Platform Settings"
      subtitle="Configure global platform settings"
      userRole="super_admin"
      userName="Admin User"
      storeName="POS Pro Platform"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Tabs defaultValue="pricing" className="space-y-6">
          <TabsList className="bg-muted/50 p-1 flex-wrap h-auto gap-1">
            <TabsTrigger value="pricing" className="gap-2 data-[state=active]:bg-background">
              <DollarSign className="h-4 w-4" />
              Pricing Plans
            </TabsTrigger>
            <TabsTrigger value="email" className="gap-2 data-[state=active]:bg-background">
              <Mail className="h-4 w-4" />
              Email Templates
            </TabsTrigger>
            <TabsTrigger value="api" className="gap-2 data-[state=active]:bg-background">
              <Shield className="h-4 w-4" />
              API Limits
            </TabsTrigger>
            <TabsTrigger value="features" className="gap-2 data-[state=active]:bg-background">
              <Zap className="h-4 w-4" />
              Feature Flags
            </TabsTrigger>
            <TabsTrigger value="backups" className="gap-2 data-[state=active]:bg-background">
              <Database className="h-4 w-4" />
              Backups
            </TabsTrigger>
          </TabsList>

          {/* Pricing Plans Tab */}
          <TabsContent value="pricing" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  name: "Basic",
                  price: "$1,299",
                  features: ["10 Branches", "500 Users", "3,000 Products", "Email Support"],
                  color: "muted-foreground",
                },
                {
                  name: "Pro",
                  price: "$2,999",
                  features: ["100 Branches", "2,000 Users", "9,000 Products", "Priority Support", "API Access"],
                  color: "primary",
                  popular: true,
                },
                {
                  name: "Enterprise",
                  price: "$4,999",
                  features: ["400 Branches", "10,000 Users", "Unlimited Products", "24/7 Support", "Custom Integrations"],
                  color: "accent",
                },
              ].map((plan) => (
                <Card
                  key={plan.name}
                  className={`relative ${
                    plan.popular ? "border-2 border-primary shadow-lg" : ""
                  }`}
                >
                  {plan.popular && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">
                      Most Popular
                    </Badge>
                  )}
                  <CardHeader>
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold">{plan.price}</span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-2">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-success" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button variant="outline" className="w-full gap-2">
                      <Edit className="h-4 w-4" />
                      Edit Plan
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <Card className="border-dashed">
              <CardContent className="p-6 text-center">
                <Button variant="outline" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add New Plan
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Email Templates Tab */}
          <TabsContent value="email" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Email Templates</CardTitle>
                <CardDescription>Customize automated email communications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: "Welcome Email", trigger: "On registration", lastEdited: "Jan 15, 2026" },
                  { name: "Subscription Confirmation", trigger: "After payment", lastEdited: "Jan 10, 2026" },
                  { name: "Password Reset", trigger: "On request", lastEdited: "Dec 28, 2025" },
                  { name: "Invoice", trigger: "Monthly billing", lastEdited: "Jan 5, 2026" },
                  { name: "Trial Expiring", trigger: "3 days before", lastEdited: "Jan 8, 2026" },
                ].map((template) => (
                  <div
                    key={template.name}
                    className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Mail className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{template.name}</p>
                        <p className="text-sm text-muted-foreground">{template.trigger}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">Edited {template.lastEdited}</span>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Edit className="h-4 w-4" />
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* API Limits Tab */}
          <TabsContent value="api" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>API Rate Limits</CardTitle>
                <CardDescription>Configure API request limits per plan</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  { plan: "Basic", requests: "1,000", window: "per hour" },
                  { plan: "Pro", requests: "10,000", window: "per hour" },
                  { plan: "Enterprise", requests: "100,000", window: "per hour" },
                ].map((limit) => (
                  <div key={limit.plan} className="grid grid-cols-3 gap-4 items-center">
                    <div>
                      <Label>{limit.plan}</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        type="text"
                        defaultValue={limit.requests}
                        className="w-32"
                      />
                      <span className="text-sm text-muted-foreground">{limit.window}</span>
                    </div>
                    <div>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                <Separator />
                
                <div className="space-y-4">
                  <h4 className="font-medium">Global Settings</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Rate Limit Window</Label>
                      <Select defaultValue="hour">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="minute">Per Minute</SelectItem>
                          <SelectItem value="hour">Per Hour</SelectItem>
                          <SelectItem value="day">Per Day</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Throttle Response Code</Label>
                      <Select defaultValue="429">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="429">429 Too Many Requests</SelectItem>
                          <SelectItem value="503">503 Service Unavailable</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button className="gap-2">
                    <Save className="h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Feature Flags Tab */}
          <TabsContent value="features" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Feature Flags</CardTitle>
                    <CardDescription>Control feature rollouts across the platform</CardDescription>
                  </div>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Flag
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {features.map((feature) => (
                  <div
                    key={feature.id}
                    className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
                      feature.enabled ? "bg-success/5 border-success/20" : "bg-muted/50"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <Switch
                        checked={feature.enabled}
                        onCheckedChange={() => toggleFeature(feature.id)}
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{feature.name}</p>
                          {feature.enabled && feature.rollout < 100 && (
                            <Badge variant="secondary">{feature.rollout}% rollout</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Backups Tab */}
          <TabsContent value="backups" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
                      <Cloud className="h-6 w-6 text-success" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Last Backup</p>
                      <p className="font-semibold">2 hours ago</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Database className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Backups</p>
                      <p className="font-semibold">127</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-info/10 flex items-center justify-center">
                      <Lock className="h-6 w-6 text-info" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Storage Used</p>
                      <p className="font-semibold">245 GB</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Backup Schedules</CardTitle>
                    <CardDescription>Automated backup configurations</CardDescription>
                  </div>
                  <Button className="gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Run Backup Now
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {backupSchedules.map((backup) => (
                    <div
                      key={backup.id}
                      className="flex items-center justify-between p-4 rounded-lg border bg-card"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                          <Database className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium">{backup.type}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{backup.frequency} at {backup.time}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm">Last run: {backup.lastRun}</p>
                          <Badge className="bg-success/10 text-success border-success/20">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Success
                          </Badge>
                        </div>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </DashboardLayout>
  );
}
