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
  Building2,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ArrowUpRight,
  Crown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Store,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

const mrrData = [
  { month: "Aug", mrr: 32000 },
  { month: "Sep", mrr: 35000 },
  { month: "Oct", mrr: 38000 },
  { month: "Nov", mrr: 41000 },
  { month: "Dec", mrr: 43000 },
  { month: "Jan", mrr: 45000 },
];

const planDistribution = [
  { name: "Basic", value: 89, color: "hsl(var(--muted-foreground))" },
  { name: "Pro", value: 124, color: "hsl(var(--primary))" },
  { name: "Enterprise", value: 32, color: "hsl(var(--accent))" },
];

const storeGrowthData = [
  { month: "Aug", stores: 180 },
  { month: "Sep", stores: 195 },
  { month: "Oct", stores: 208 },
  { month: "Nov", stores: 220 },
  { month: "Dec", stores: 232 },
  { month: "Jan", stores: 245 },
];

const recentActivity = [
  { id: 1, message: "Store 'TechMart' upgraded to Pro plan", time: "2 min ago", type: "upgrade" },
  { id: 2, message: "New store 'FreshMart' registration approved", time: "15 min ago", type: "approved" },
  { id: 3, message: "Store 'BookNest' subscription renewed", time: "1 hour ago", type: "renewed" },
  { id: 4, message: "New store request from 'GroceryKing'", time: "2 hours ago", type: "pending" },
  { id: 5, message: "Store 'ElectroWorld' added 3 new branches", time: "3 hours ago", type: "expansion" },
];

const topStores = [
  { rank: 1, name: "TechMart Enterprise", owner: "Rahul S.", plan: "Enterprise", revenue: "$45,200", growth: "+18%" },
  { rank: 2, name: "FashionHub Pro", owner: "Priya P.", plan: "Pro", revenue: "$38,900", growth: "+12%" },
  { rank: 3, name: "GroceryKing", owner: "Amit K.", plan: "Enterprise", revenue: "$35,100", growth: "+15%" },
  { rank: 4, name: "ElectroWorld", owner: "Sarah M.", plan: "Pro", revenue: "$28,400", growth: "+8%" },
  { rank: 5, name: "BookNest", owner: "John D.", plan: "Pro", revenue: "$24,800", growth: "+22%" },
];

export default function SuperAdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Hero KPI Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4"
      >
        <KPICard
          title="Active Stores"
          value="245"
          change={5.2}
          changeLabel="from last month"
          icon={Building2}
          iconColor="primary"
        />
        <KPICard
          title="Monthly Revenue"
          value="$45K"
          change={12.3}
          changeLabel="MRR growth"
          icon={DollarSign}
          iconColor="success"
        />
        <KPICard
          title="Churn Rate"
          value="3%"
          change={-15.2}
          changeLabel="improving"
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
        <KPICard
          title="Revenue YTD"
          value="$520K"
          change={28.5}
          changeLabel="vs last year"
          icon={Crown}
          iconColor="success"
        />
      </motion.div>

      {/* Pending Approvals Alert */}
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
                Review Now
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <AreaChartComponent
            title="MRR Growth Trend"
            data={mrrData}
            dataKey="mrr"
            xAxisKey="month"
            color="hsl(var(--primary))"
            height={300}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.25 }}
        >
          <PieChartComponent
            title="Plan Distribution"
            data={planDistribution}
            height={300}
            innerRadius={50}
          />
        </motion.div>
      </div>

      {/* Store Growth + Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <BarChartComponent
            title="Store Growth"
            data={storeGrowthData}
            dataKey="stores"
            xAxisKey="month"
            height={300}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.35 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
              <CardDescription>Platform events and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      activity.type === "upgrade" ? "bg-primary" :
                      activity.type === "approved" ? "bg-success" :
                      activity.type === "pending" ? "bg-warning" :
                      "bg-muted-foreground"
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">{activity.message}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <Clock className="h-3 w-3" />
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
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
                    <p className="text-sm text-success flex items-center justify-end gap-1">
                      <ArrowUp className="h-3 w-3" />
                      {store.growth}
                    </p>
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
  );
}