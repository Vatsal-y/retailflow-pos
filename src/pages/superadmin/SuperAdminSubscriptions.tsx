import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { BarChartComponent } from "@/components/charts/BarChartComponent";
import { motion } from "framer-motion";
import {
  CreditCard,
  Building2,
  Users,
  Package,
  DollarSign,
  Pencil,
  Check,
  Crown,
  Zap,
  Star,
} from "lucide-react";

interface Plan {
  id: string;
  name: string;
  price: number;
  branchLimit: number;
  userLimit: number;
  productLimit: number;
  activeStores: number;
  features: string[];
  icon: typeof Crown;
  color: string;
}

const plansData: Plan[] = [
  {
    id: "basic",
    name: "Basic",
    price: 1299,
    branchLimit: 10,
    userLimit: 50,
    productLimit: 500,
    activeStores: 89,
    features: ["Basic analytics", "Email support", "Standard reports"],
    icon: Star,
    color: "bg-muted text-muted-foreground",
  },
  {
    id: "pro",
    name: "Pro",
    price: 2999,
    branchLimit: 50,
    userLimit: 200,
    productLimit: 5000,
    activeStores: 124,
    features: ["Advanced analytics", "Priority support", "Custom reports", "API access"],
    icon: Zap,
    color: "bg-primary/10 text-primary",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 4999,
    branchLimit: 100,
    userLimit: 500,
    productLimit: 9000,
    activeStores: 32,
    features: ["Full analytics", "24/7 support", "White-label", "Dedicated manager", "Custom integrations"],
    icon: Crown,
    color: "bg-accent/10 text-accent",
  },
];

const conversionData = [
  { stage: "Visitors", count: 10000 },
  { stage: "Signups", count: 2500 },
  { stage: "Trials", count: 1200 },
  { stage: "Paid", count: 245 },
];

export default function SuperAdminSubscriptions() {
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [editPrice, setEditPrice] = useState("");
  const [editBranches, setEditBranches] = useState("");
  const [editUsers, setEditUsers] = useState("");
  const [editProducts, setEditProducts] = useState("");

  const handleEditPlan = (plan: Plan) => {
    setEditingPlan(plan);
    setEditPrice(plan.price.toString());
    setEditBranches(plan.branchLimit.toString());
    setEditUsers(plan.userLimit.toString());
    setEditProducts(plan.productLimit.toString());
  };

  const handleSavePlan = () => {
    console.log("Saving plan:", {
      ...editingPlan,
      price: parseInt(editPrice),
      branchLimit: parseInt(editBranches),
      userLimit: parseInt(editUsers),
      productLimit: parseInt(editProducts),
    });
    setEditingPlan(null);
  };

  const totalMRR = plansData.reduce((sum, p) => sum + (p.price * p.activeStores), 0);

  return (
    <div className="space-y-6">
      {/* Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total MRR</p>
                <p className="text-3xl font-bold text-primary">${totalMRR.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-primary/50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Plans</p>
                <p className="text-3xl font-bold">{plansData.length}</p>
              </div>
              <CreditCard className="h-8 w-8 text-muted-foreground/50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Subscribers</p>
                <p className="text-3xl font-bold">{plansData.reduce((sum, p) => sum + p.activeStores, 0)}</p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground/50" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Plan Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="grid md:grid-cols-3 gap-6"
      >
        {plansData.map((plan) => {
          const Icon = plan.icon;
          return (
            <Card key={plan.id} className="relative overflow-hidden hover:shadow-lg transition-shadow">
              <div className={`absolute top-0 left-0 right-0 h-1 ${
                plan.id === "enterprise" ? "bg-accent" :
                plan.id === "pro" ? "bg-primary" :
                "bg-muted-foreground"
              }`} />
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${plan.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <CardTitle>{plan.name}</CardTitle>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => handleEditPlan(plan)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
                <div className="mt-4">
                  <span className="text-3xl font-bold">${plan.price}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Building2 className="h-4 w-4" /> Branches
                    </span>
                    <span className="font-medium">{plan.branchLimit}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Users className="h-4 w-4" /> Users
                    </span>
                    <span className="font-medium">{plan.userLimit}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Package className="h-4 w-4" /> Products
                    </span>
                    <span className="font-medium">{plan.productLimit.toLocaleString()}</span>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <p className="text-sm font-medium mb-2">Features:</p>
                  <ul className="space-y-1">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check className="h-3 w-3 text-success" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="pt-4 border-t">
                  <Badge variant="outline" className="w-full justify-center py-2">
                    {plan.activeStores} Active Stores
                  </Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </motion.div>

      {/* Conversion Funnel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <BarChartComponent
          title="Conversion Funnel"
          data={conversionData}
          dataKey="count"
          xAxisKey="stage"
          height={300}
        />
      </motion.div>

      {/* Edit Plan Dialog */}
      <Dialog open={!!editingPlan} onOpenChange={() => setEditingPlan(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit {editingPlan?.name} Plan</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="price">Monthly Price ($)</Label>
              <Input
                id="price"
                type="number"
                value={editPrice}
                onChange={(e) => setEditPrice(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="branches">Branch Limit</Label>
              <Input
                id="branches"
                type="number"
                value={editBranches}
                onChange={(e) => setEditBranches(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="users">User Limit</Label>
              <Input
                id="users"
                type="number"
                value={editUsers}
                onChange={(e) => setEditUsers(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="products">Product Limit</Label>
              <Input
                id="products"
                type="number"
                value={editProducts}
                onChange={(e) => setEditProducts(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingPlan(null)}>
              Cancel
            </Button>
            <Button onClick={handleSavePlan}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}