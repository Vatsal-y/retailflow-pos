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
import StoreReports from "./pages/store/StoreReports";
import StoreCategories from "./pages/store/StoreCategories";
import SuperAdminLayout from "./pages/superadmin/SuperAdminLayout";
import SuperAdminDashboard from "./pages/superadmin/SuperAdminDashboard";
import SuperAdminStores from "./pages/superadmin/SuperAdminStores";
import SuperAdminSubscriptions from "./pages/superadmin/SuperAdminSubscriptions";
import SuperAdminRequests from "./pages/superadmin/SuperAdminRequests";
import SuperAdminSettings from "./pages/superadmin/SuperAdminSettings";
import NotFound from "./pages/NotFound";

import RequireAuth from "@/components/auth/RequireAuth";
import LoginPage from "@/pages/auth/LoginPage";

const queryClient = new QueryClient();

const App = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />

            {/* Protected Routes */}
            <Route path="/" element={<Index />} />

            {/* Cashier Routes */}
            <Route path="/cashier" element={
              <RequireAuth allowedRoles={['CASHIER', 'BRANCH_MANAGER', 'STORE_ADMIN', 'SUPER_ADMIN']}>
                <CashierTerminal />
              </RequireAuth>
            } />
            <Route path="/cashier/orders" element={
              <RequireAuth allowedRoles={['CASHIER', 'BRANCH_MANAGER', 'STORE_ADMIN', 'SUPER_ADMIN']}>
                <OrdersPage />
              </RequireAuth>
            } />
            <Route path="/cashier/customers" element={
              <RequireAuth allowedRoles={['CASHIER', 'BRANCH_MANAGER', 'STORE_ADMIN', 'SUPER_ADMIN']}>
                <CustomersPage />
              </RequireAuth>
            } />
            <Route path="/cashier/shifts" element={
              <RequireAuth allowedRoles={['CASHIER', 'BRANCH_MANAGER', 'STORE_ADMIN', 'SUPER_ADMIN']}>
                <ShiftsPage />
              </RequireAuth>
            } />

            {/* Branch Manager Routes */}
            <Route path="/branch" element={
              <RequireAuth allowedRoles={['BRANCH_MANAGER', 'STORE_ADMIN', 'SUPER_ADMIN']}>
                <BranchDashboard />
              </RequireAuth>
            } />
            <Route path="/branch/orders" element={
              <RequireAuth allowedRoles={['BRANCH_MANAGER', 'STORE_ADMIN', 'SUPER_ADMIN']}>
                <BranchOrders />
              </RequireAuth>
            } />
            <Route path="/branch/inventory" element={
              <RequireAuth allowedRoles={['BRANCH_MANAGER', 'STORE_ADMIN', 'SUPER_ADMIN']}>
                <BranchInventory />
              </RequireAuth>
            } />
            <Route path="/branch/employees" element={
              <RequireAuth allowedRoles={['BRANCH_MANAGER', 'STORE_ADMIN', 'SUPER_ADMIN']}>
                <BranchEmployees />
              </RequireAuth>
            } />
            <Route path="/branch/products" element={
              <RequireAuth allowedRoles={['BRANCH_MANAGER', 'STORE_ADMIN', 'SUPER_ADMIN']}>
                <BranchProducts />
              </RequireAuth>
            } />
            <Route path="/branch/reports" element={
              <RequireAuth allowedRoles={['BRANCH_MANAGER', 'STORE_ADMIN', 'SUPER_ADMIN']}>
                <BranchReports />
              </RequireAuth>
            } />
            <Route path="/branch/settings" element={
              <RequireAuth allowedRoles={['BRANCH_MANAGER', 'STORE_ADMIN', 'SUPER_ADMIN']}>
                <BranchSettings />
              </RequireAuth>
            } />

            {/* Store Admin Routes */}
            <Route path="/store" element={
              <RequireAuth allowedRoles={['STORE_ADMIN', 'SUPER_ADMIN']}>
                <StoreDashboard />
              </RequireAuth>
            } />
            <Route path="/store/branches" element={
              <RequireAuth allowedRoles={['STORE_ADMIN', 'SUPER_ADMIN']}>
                <StoreBranches />
              </RequireAuth>
            } />
            <Route path="/store/products" element={
              <RequireAuth allowedRoles={['STORE_ADMIN', 'SUPER_ADMIN']}>
                <StoreProducts />
              </RequireAuth>
            } />
            <Route path="/store/categories" element={
              <RequireAuth allowedRoles={['STORE_ADMIN', 'SUPER_ADMIN']}>
                <StoreCategories />
              </RequireAuth>
            } />
            <Route path="/store/employees" element={
              <RequireAuth allowedRoles={['STORE_ADMIN', 'SUPER_ADMIN']}>
                <StoreEmployees />
              </RequireAuth>
            } />
            <Route path="/store/analytics" element={
              <RequireAuth allowedRoles={['STORE_ADMIN', 'SUPER_ADMIN']}>
                <StoreAnalytics />
              </RequireAuth>
            } />
            <Route path="/store/reports" element={
              <RequireAuth allowedRoles={['STORE_ADMIN', 'SUPER_ADMIN']}>
                <StoreReports />
              </RequireAuth>
            } />
            <Route path="/store/subscription" element={
              <RequireAuth allowedRoles={['STORE_ADMIN', 'SUPER_ADMIN']}>
                <StoreSubscription />
              </RequireAuth>
            } />
            <Route path="/store/settings" element={
              <RequireAuth allowedRoles={['STORE_ADMIN', 'SUPER_ADMIN']}>
                <StoreSettings />
              </RequireAuth>
            } />

            {/* Super Admin Routes */}
            <Route path="/superadmin" element={
              <RequireAuth allowedRoles={['SUPER_ADMIN']}>
                <SuperAdminLayout />
              </RequireAuth>
            }>
              <Route path="dashboard" element={<SuperAdminDashboard />} />
              <Route path="stores" element={<SuperAdminStores />} />
              <Route path="subscriptions" element={<SuperAdminSubscriptions />} />
              <Route path="requests" element={<SuperAdminRequests />} />
              <Route path="settings" element={<SuperAdminSettings />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </Provider>
);

export default App;
