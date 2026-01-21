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
            {/* Fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </Provider>
);

export default App;
