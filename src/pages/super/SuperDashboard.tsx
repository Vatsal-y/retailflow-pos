import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AreaChartComponent } from "@/components/charts/AreaChartComponent";
import { PieChartComponent } from "@/components/charts/PieChartComponent";
import { BarChartComponent } from "@/components/charts/BarChartComponent";
import { KPICard } from "@/components/ui/kpi-card";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  ClipboardCheck,
  CreditCard,
  Store,
  Settings,
  Building2,
  Users,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ArrowUpRight,
  Crown,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react";

const superAdminSidebarItems = [
  { label: "Dashboard", href: "/super", icon: LayoutDashboard },
  { label: "Pending Approvals", href: "/super/approvals", icon: ClipboardCheck, badge: "3" },
  { label: "Subscriptions", href: "/super/subscriptions", icon: CreditCard },
  { label: "Store Oversight", href: "/super/stores", icon: Store },
  { label: "Platform Settings", href: "/super/settings", icon: Settings },
];

const mrrData = [
  { month: "Aug", mrr: 185000 },
  { month: "Sep", mrr: 198000 },
  { month: "Oct", mrr: 215000 },
  { month: "Nov", mrr: 228000 },
  { month: "Dec", mrr: 235000 },
  { month: "Jan", mrr: 245000 },
];

const planDistribution = [
  { name: "Basic", value: 89, color: "hsl(var(--muted-foreground))" },
  { name: "Pro", value: 124, color: "hsl(var(--primary))" },
  { name: "Enterprise", value: 32, color: "hsl(var(--accent))" },
];

const churnData = [
  { month: "Aug", churn: 4.2 },
  { month: "Sep", churn: 3.8 },
  { month: "Oct", churn: 3.5 },
  { month: "Nov", churn: 3.9 },
  { month: "Dec", churn: 3.2 },
  { month: "Jan", churn: 2.8 },
];

const topStores = [
  { rank: 1, name: "TechMart Enterprise", owner: "Rahul S.", plan: "Enterprise", revenue: "$45,200", growth: "+18%" },
  { rank: 2, name: "FashionHub Pro", owner: "Priya P.", plan: "Pro", revenue: "$38,900", growth: "+12%" },
  { rank: 3, name: "GroceryKing", owner: "Amit K.", plan: "Enterprise", revenue: "$35,100", growth: "+15%" },
  { rank: 4, name: "ElectroWorld", owner: "Sarah M.", plan: "Pro", revenue: "$28,400", growth: "+8%" },
  { rank: 5, name: "BookNest", owner: "John D.", plan: "Pro", revenue: "$24,800", growth: "+22%" },
];

export default function SuperDashboard() {
  return (
    <DashboardLayout
      sidebarItems={superAdminSidebarItems}
      title="Platform Dashboard"
      subtitle="Super Admin Control Center"
      userRole="super_admin"
      userName="Admin User"
      storeName="POS Pro Platform"
    >
      <div className="space-y-6">
        {/* Hero KPI Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4"
        >
          <KPICard
            title="Total Stores"
            value="245"
            change={5.2}
            changeLabel="from last month"
            icon={Building2}
            iconColor="primary"
          />
          <KPICard
            title="Active Subscriptions"
            value="189"
            change={8.1}
            changeLabel="from last month"
            icon={CheckCircle}
            iconColor="success"
          />
          <KPICard
            title="Monthly Revenue"
            value="$245K"
            change={12.3}
            changeLabel="from last month"
            icon={DollarSign}
            iconColor="success"
          />
          <KPICard
            title="Churn Rate"
            value="2.8%"
            change={-15.2}
            changeLabel="from last month"
            icon={TrendingDown}
            iconColor="warning"
          />
          <KPICard
            title="New Stores"
            value="+12"
            change={33.3}
            changeLabel="this month"
            icon={TrendingUp}
            iconColor="info"
          />
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="border-2 border-warning/30 bg-warning/5">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-warning/20 flex items-center justify-center">
                    <AlertTriangle className="h-6 w-6 text-warning" />
                  </div>
                  <div>
                    <h3 className="font-semibold">3 Pending Store Approvals</h3>
                    <p className="text-sm text-muted-foreground">
                      New store registrations waiting for your review
                    </p>
                  </div>
                </div>
                <Button className="gap-2">
                  <ClipboardCheck className="h-4 w-4" />
                  Review Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* MRR Growth Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <AreaChartComponent
              title="MRR Growth"
              data={mrrData}
              dataKey="mrr"
              xAxisKey="month"
              color="hsl(var(--primary))"
              height={250}
            />
          </motion.div>

          {/* Plan Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.25 }}
          >
            <PieChartComponent
              title="Plan Distribution"
              data={planDistribution}
              height={250}
              innerRadius={50}
            />
          </motion.div>

          {/* Churn Analysis */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <BarChartComponent
              title="Churn Analysis"
              data={churnData}
              dataKey="churn"
              xAxisKey="month"
              colors={["hsl(var(--destructive))"]}
              height={250}
            />
          </motion.div>

          {/* Platform Health */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.35 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Platform Health</CardTitle>
                <CardDescription>System status and metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">API Uptime</span>
                    <Badge className="bg-success/10 text-success border-success/20">99.9%</Badge>
                  </div>
                  <Progress value={99.9} className="h-2" />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Database Load</span>
                    <span className="text-sm text-muted-foreground">42%</span>
                  </div>
                  <Progress value={42} className="h-2" />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Storage Used</span>
                    <span className="text-sm text-muted-foreground">68%</span>
                  </div>
                  <Progress value={68} className="h-2" />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Active Sessions</span>
                    <span className="text-sm text-muted-foreground">1,247</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Top Stores Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Crown className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Top Performing Stores</CardTitle>
                    <CardDescription>Ranked by monthly revenue</CardDescription>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  View All Stores
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topStores.map((store, index) => (
                  <div
                    key={store.rank}
                    className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-muted/50 transition-all duration-200 hover:shadow-md"
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      index === 0 ? "bg-yellow-100 text-yellow-700" :
                      index === 1 ? "bg-gray-100 text-gray-700" :
                      index === 2 ? "bg-orange-100 text-orange-700" :
                      "bg-muted text-muted-foreground"
                    }`}>
                      {store.rank}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{store.name}</p>
                      <p className="text-sm text-muted-foreground">{store.owner}</p>
                    </div>
                    <Badge variant="outline" className="shrink-0">
                      {store.plan}
                    </Badge>
                    <div className="text-right shrink-0">
                      <p className="font-semibold">{store.revenue}</p>
                      <p className="text-sm text-success">{store.growth}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="shrink-0">
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
