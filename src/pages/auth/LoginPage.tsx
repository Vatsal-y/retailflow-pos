import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { AppDispatch, RootState } from "@/store";
import { login, clearError } from "@/store/slices/authSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, isLoading, error, user } = useSelector((state: RootState) => state.auth);

    // Get the redirect path from location state or default to /
    const from = location.state?.from?.pathname || "/";

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(clearError());
        }
    }, [error, dispatch]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            toast.error("Please enter both email and password");
            return;
        }

        try {
            const resultAction = await dispatch(login({ email, password })).unwrap();
            console.log("Login successful, result:", resultAction);

            const user = resultAction.user;
            let targetPath = from;

            if (targetPath === "/" || targetPath === "/login") {
                const role = user.role?.toUpperCase();
                switch (role) {
                    case "CASHIER": targetPath = "/cashier"; break;
                    case "BRANCH_MANAGER": targetPath = "/branch"; break;
                    case "STORE_ADMIN": targetPath = "/store"; break;
                    case "SUPER_ADMIN": targetPath = "/superadmin"; break;
                    default:
                        console.warn("Unknown role:", user.role);
                        targetPath = "/";
                }
            }

            console.log("Navigating to:", targetPath);
            navigate(targetPath, { replace: true });
        } catch (err) {
            console.error("Login failed:", err);
            // Error toast is handled by the useEffect watching 'error' state
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">POS Pro</CardTitle>
                    <CardDescription className="text-center">
                        Enter your credentials to access the system
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isLoading}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isLoading}
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                "Sign In"
                            )}
                        </Button>
                    </form>

                    <div className="mt-4 text-center text-sm text-muted-foreground">
                        <p>Demo Credentials:</p>
                        <p>testuser9@example.com / password123</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
