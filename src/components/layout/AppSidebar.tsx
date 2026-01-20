import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  ClipboardList, 
  Users, 
  BarChart3,
  Settings,
  Moon,
  Sun,
  Menu,
  X,
  Store,
  Building2,
  Shield
} from "lucide-react";
import { useState, useEffect } from "react";

interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
}

const cashierNav: NavItem[] = [
  { label: "POS", path: "/cashier", icon: ShoppingCart },
  { label: "Orders", path: "/cashier/orders", icon: ClipboardList },
  { label: "Customers", path: "/cashier/customers", icon: Users },
  { label: "Shifts", path: "/cashier/shifts", icon: BarChart3 },
];

const branchNav: NavItem[] = [
  { label: "Dashboard", path: "/branch", icon: LayoutDashboard },
  { label: "Orders", path: "/branch/orders", icon: ClipboardList },
  { label: "Inventory", path: "/branch/inventory", icon: Package },
  { label: "Employees", path: "/branch/employees", icon: Users },
  { label: "Reports", path: "/branch/reports", icon: BarChart3 },
  { label: "Settings", path: "/branch/settings", icon: Settings },
];

const storeNav: NavItem[] = [
  { label: "Dashboard", path: "/store", icon: LayoutDashboard },
  { label: "Branches", path: "/store/branches", icon: Building2 },
  { label: "Products", path: "/store/products", icon: Package },
  { label: "Employees", path: "/store/employees", icon: Users },
  { label: "Analytics", path: "/store/analytics", icon: BarChart3 },
  { label: "Settings", path: "/store/settings", icon: Settings },
];

const superAdminNav: NavItem[] = [
  { label: "Dashboard", path: "/admin", icon: LayoutDashboard },
  { label: "Stores", path: "/admin/stores", icon: Store },
  { label: "Subscriptions", path: "/admin/subscriptions", icon: Shield },
  { label: "Analytics", path: "/admin/analytics", icon: BarChart3 },
];

interface AppSidebarProps {
  role: "cashier" | "branch" | "store" | "admin";
}

export function AppSidebar({ role }: AppSidebarProps) {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const navItems = {
    cashier: cashierNav,
    branch: branchNav,
    store: storeNav,
    admin: superAdminNav,
  }[role];

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300",
          collapsed ? "w-16" : "w-60",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className={cn(
            "flex h-16 items-center border-b border-sidebar-border px-4",
            collapsed && "justify-center"
          )}>
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
                P
              </div>
              {!collapsed && (
                <span className="text-lg font-bold text-sidebar-foreground">POS Pro</span>
              )}
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-3 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    collapsed && "justify-center px-2"
                  )}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="border-t border-sidebar-border p-3 space-y-2">
            <Button
              variant="ghost"
              size={collapsed ? "icon" : "default"}
              className={cn("w-full justify-start", collapsed && "justify-center")}
              onClick={() => setIsDark(!isDark)}
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              {!collapsed && <span className="ml-2">{isDark ? "Light" : "Dark"}</span>}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex w-full justify-center"
              onClick={() => setCollapsed(!collapsed)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
