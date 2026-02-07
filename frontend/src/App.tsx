import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Toaster } from 'sonner';
import { useAuthStore } from '@/store';
import { DashboardLayout } from '@/components/layout';
import { ProtectedRoute } from '@/components/auth';
import {
  LandingPage,
  LoginPage,
  DashboardPage,
  POSPage,
  OrdersPage,
  ProductsPage,
  CustomersPage,
  ShiftsPage,
  SettingsPage,
  EmployeesPage,
  StoresPage,
  BranchesPage,
  ReportsPage,
} from '@/pages';

function App() {
  const { checkAuth, isAuthenticated } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Routes */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/pos" element={<POSPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route
            path="/products"
            element={
              <ProtectedRoute allowedRoles={['BRANCH_MANAGER', 'STORE_ADMIN', 'SUPER_ADMIN']}>
                <ProductsPage />
              </ProtectedRoute>
            }
          />
          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/shifts" element={<ShiftsPage />} />
          <Route
            path="/employees"
            element={
              <ProtectedRoute allowedRoles={['BRANCH_MANAGER', 'STORE_ADMIN', 'SUPER_ADMIN']}>
                <EmployeesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/branches"
            element={
              <ProtectedRoute allowedRoles={['STORE_ADMIN', 'SUPER_ADMIN']}>
                <BranchesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/stores"
            element={
              <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
                <StoresPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute allowedRoles={['STORE_ADMIN', 'SUPER_ADMIN']}>
                <SettingsPage />
              </ProtectedRoute>
            }
          />
          {/* Reports page for store admins */}
          <Route
            path="/reports"
            element={
              <ProtectedRoute allowedRoles={['STORE_ADMIN', 'SUPER_ADMIN']}>
                <ReportsPage />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster
        position="top-right"
        richColors
        toastOptions={{
          duration: 4000,
        }}
      />
    </Router>
  );
}

export default App;

