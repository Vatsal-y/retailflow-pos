import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import Index from "./pages/Index";
import CashierTerminal from "./pages/cashier/CashierTerminal";
import OrdersPage from "./pages/cashier/OrdersPage";
import CustomersPage from "./pages/cashier/CustomersPage";
import ShiftsPage from "./pages/cashier/ShiftsPage";
import BranchDashboard from "./pages/branch/BranchDashboard";
import BranchOrders from "./pages/branch/BranchOrders";
import BranchInventory from "./pages/branch/BranchInventory";
import BranchEmployees from "./pages/branch/BranchEmployees";
import BranchProducts from "./pages/branch/BranchProducts";
import BranchReports from "./pages/branch/BranchReports";
import BranchSettings from "./pages/branch/BranchSettings";
import StoreDashboard from "./pages/store/StoreDashboard";
import StoreBranches from "./pages/store/StoreBranches";
import StoreProducts from "./pages/store/StoreProducts";
import StoreEmployees from "./pages/store/StoreEmployees";
import StoreAnalytics from "./pages/store/StoreAnalytics";
import StoreSubscription from "./pages/store/StoreSubscription";
import StoreSettings from "./pages/store/StoreSettings";
import SuperDashboard from "./pages/super/SuperDashboard";
import PendingApprovals from "./pages/super/PendingApprovals";
import SubscriptionManagement from "./pages/super/SubscriptionManagement";
import StoreOversight from "./pages/super/StoreOversight";
import PlatformSettings from "./pages/super/PlatformSettings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            {/* Cashier Routes */}
            <Route path="/cashier" element={<CashierTerminal />} />
            <Route path="/cashier/orders" element={<OrdersPage />} />
            <Route path="/cashier/customers" element={<CustomersPage />} />
            <Route path="/cashier/shifts" element={<ShiftsPage />} />
            {/* Branch Manager Routes */}
            <Route path="/branch" element={<BranchDashboard />} />
            <Route path="/branch/orders" element={<BranchOrders />} />
            <Route path="/branch/inventory" element={<BranchInventory />} />
            <Route path="/branch/employees" element={<BranchEmployees />} />
            <Route path="/branch/products" element={<BranchProducts />} />
            <Route path="/branch/reports" element={<BranchReports />} />
            <Route path="/branch/settings" element={<BranchSettings />} />
            {/* Store Admin Routes */}
            <Route path="/store" element={<StoreDashboard />} />
            <Route path="/store/branches" element={<StoreBranches />} />
            <Route path="/store/products" element={<StoreProducts />} />
            <Route path="/store/employees" element={<StoreEmployees />} />
            <Route path="/store/analytics" element={<StoreAnalytics />} />
            <Route path="/store/subscription" element={<StoreSubscription />} />
            <Route path="/store/settings" element={<StoreSettings />} />
            {/* Super Admin Routes */}
            <Route path="/super" element={<SuperDashboard />} />
            <Route path="/super/approvals" element={<PendingApprovals />} />
            <Route path="/super/subscriptions" element={<SubscriptionManagement />} />
            <Route path="/super/stores" element={<StoreOversight />} />
            <Route path="/super/settings" element={<PlatformSettings />} />
            {/* Fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </Provider>
);

export default App;
