import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  LayoutDashboard,
  Package,
  Users,
  Tags,
  BarChart3,
  Settings,
  CreditCard,
  Building2,
  Check,
  Crown,
  Zap,
  Star,
} from "lucide-react";
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

const plans = [
  {
    name: "Starter",
    price: 2500,
    period: "/month",
    description: "Perfect for small stores",
    icon: Zap,
    features: [
      "1 Branch",
      "5 Users",
      "Basic Analytics",
      "Email Support",
      "1,000 Products",
    ],
    current: false,
  },
  {
    name: "Professional",
    price: 8000,
    period: "/month",
    description: "For growing businesses",
    icon: Star,
    features: [
      "Up to 5 Branches",
      "25 Users",
      "Advanced Analytics",
      "Priority Support",
      "10,000 Products",
      "API Access",
      "Custom Reports",
    ],
    current: true,
    popular: true,
  },
  {
    name: "Enterprise",
    price: 15000,
    period: "/month",
    description: "For large retail chains",
    icon: Crown,
    features: [
      "Unlimited Branches",
      "Unlimited Users",
      "Real-time Analytics",
      "24/7 Dedicated Support",
      "Unlimited Products",
      "Full API Access",
      "Custom Integrations",
      "White-label Option",
    ],
    current: false,
  },
];

export default function StoreSubscription() {
  const currentPlan = plans.find((p) => p.current);
  const usageData = {
    branches: { used: 4, limit: 5 },
    users: { used: 18, limit: 25 },
    products: { used: 2450, limit: 10000 },
  };

  return (
    <DashboardLayout
      title="Subscription"
      subtitle="Manage your plan and billing"
      sidebarItems={sidebarItems}
      userRole="store_admin"
      userName="Priya Sharma"
      storeName="Galaxy Retail"
    >
      <div className="space-y-8">
        {/* Current Plan */}
        <Card className="border-primary/50 bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-primary" />
                  Current Plan: Professional
                </CardTitle>
                <CardDescription>Your subscription renews on Feb 1, 2026</CardDescription>
              </div>
              <Badge className="bg-primary">Active</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 sm:grid-cols-3">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Branches</span>
                  <span className="font-medium">{usageData.branches.used}/{usageData.branches.limit}</span>
                </div>
                <Progress value={(usageData.branches.used / usageData.branches.limit) * 100} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Users</span>
                  <span className="font-medium">{usageData.users.used}/{usageData.users.limit}</span>
                </div>
                <Progress value={(usageData.users.used / usageData.users.limit) * 100} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Products</span>
                  <span className="font-medium">{usageData.products.used.toLocaleString()}/{usageData.products.limit.toLocaleString()}</span>
                </div>
                <Progress value={(usageData.products.used / usageData.products.limit) * 100} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Plan Cards */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Available Plans</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {plans.map((plan, index) => {
              const Icon = plan.icon;
              return (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    className={`relative overflow-hidden h-full ${
                      plan.popular ? "border-primary shadow-lg" : ""
                    } ${plan.current ? "bg-primary/5" : ""}`}
                  >
                    {plan.popular && (
                      <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-medium rounded-bl-lg">
                        Most Popular
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`p-2 rounded-lg ${plan.current ? "bg-primary/20" : "bg-muted"}`}>
                          <Icon className={`h-5 w-5 ${plan.current ? "text-primary" : "text-muted-foreground"}`} />
                        </div>
                        <CardTitle className="text-lg">{plan.name}</CardTitle>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold">₹{plan.price.toLocaleString()}</span>
                        <span className="text-muted-foreground">{plan.period}</span>
                      </div>
                      <CardDescription>{plan.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <ul className="space-y-2">
                        {plan.features.map((feature) => (
                          <li key={feature} className="flex items-center gap-2 text-sm">
                            <Check className="h-4 w-4 text-success" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Button
                        className="w-full"
                        variant={plan.current ? "outline" : plan.popular ? "default" : "outline"}
                        disabled={plan.current}
                      >
                        {plan.current ? "Current Plan" : "Upgrade"}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Billing History */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Billing History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { date: "Jan 1, 2026", amount: 8000, status: "paid" },
                { date: "Dec 1, 2025", amount: 8000, status: "paid" },
                { date: "Nov 1, 2025", amount: 8000, status: "paid" },
              ].map((invoice, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <p className="font-medium">{invoice.date}</p>
                    <p className="text-sm text-muted-foreground">Professional Plan</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-medium">₹{invoice.amount.toLocaleString()}</span>
                    <Badge variant="outline" className="text-success border-success">
                      {invoice.status}
                    </Badge>
                    <Button variant="ghost" size="sm">Download</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
