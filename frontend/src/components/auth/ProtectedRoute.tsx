import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store';
import { LoadingOverlay } from '@/components/ui';
import type { UserRole } from '@/types';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
    const { isAuthenticated, isLoading, user } = useAuthStore();
    const location = useLocation();

    if (isLoading) {
        return <LoadingOverlay message="Authenticating..." />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Check role-based access
    if (allowedRoles && user?.role && !allowedRoles.includes(user.role)) {
        // Redirect to appropriate page based on role
        return <Navigate to="/pos" replace />;
    }

    return <>{children}</>;
};
