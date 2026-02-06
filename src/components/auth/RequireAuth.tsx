import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

interface RequireAuthProps {
    children: JSX.Element;
    allowedRoles?: string[];
}

export default function RequireAuth({ children, allowedRoles }: RequireAuthProps) {
    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
    const location = useLocation();

    if (!isAuthenticated) {
        // Redirect them to the /login page, but save the current location they were
        // trying to go to when they were redirected. This allows us to send them
        // along to that page after they login, which is a nicer user experience.
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Optional: Check connection to roles if needed
    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        // Role not authorized, redirect to home or unauthorized page
        return <Navigate to="/" replace />;
    }

    return children;
}
