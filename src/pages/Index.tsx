import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, LayoutDashboard, Building2, Shield, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const roles = [
  {
    title: "Cashier Terminal",
    description: "Fast checkout, barcode scanning, and payment processing",
    icon: ShoppingCart,
    path: "/cashier",
    color: "bg-primary/10 text-primary",
  },
  {
    title: "Branch Manager",
    description: "Manage orders, inventory, and employees at your location",
    icon: LayoutDashboard,
    path: "/branch",
    color: "bg-success/10 text-success",
  },
  {
    title: "Store Admin",
    description: "Multi-branch management, products, and analytics",
    icon: Building2,
    path: "/store",
    color: "bg-warning/10 text-warning",
  },
  {
    title: "Super Admin",
    description: "Platform oversight, subscriptions, and global analytics",
    icon: Shield,
    path: "/admin",
    color: "bg-info/10 text-info",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-primary text-primary-foreground text-3xl font-bold mb-6">
            P
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">POS Pro</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Enterprise-grade Point of Sale system for modern retail chains
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {roles.map((role, index) => (
            <motion.div
              key={role.path}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={role.path}>
                <Card variant="interactive" className="h-full">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg ${role.color} flex items-center justify-center mb-4`}>
                      <role.icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl">{role.title}</CardTitle>
                    <CardDescription>{role.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="ghost" className="gap-2 p-0 h-auto text-primary">
                      Enter <ArrowRight className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
