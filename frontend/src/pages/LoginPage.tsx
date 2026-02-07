import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useAuthStore } from '@/store';
import { Button, Input, Card, CardContent } from '@/components/ui';
import { Mail, Lock, ShoppingCart, Eye, EyeOff } from 'lucide-react';

const loginSchema = z.object({
    email: z.string().email('Please enter a valid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { login, isAuthenticated, isLoading, error, clearError } = useAuthStore();
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    // Redirect if already authenticated
    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    const onSubmit = async (data: LoginFormData) => {
        try {
            clearError();
            await login(data);
            toast.success('Welcome back!');
            navigate('/dashboard');
        } catch {
            toast.error(error || 'Login failed. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-4">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-indigo-500/20 to-transparent rounded-full blur-3xl" />
                <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-purple-500/20 to-transparent rounded-full blur-3xl" />
            </div>

            <Card className="w-full max-w-md relative z-10 bg-slate-900/50 border-slate-700/50 backdrop-blur-xl">
                <CardContent className="p-8">
                    {/* Logo */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="h-16 w-16 rounded-2xl gradient-primary flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/30">
                            <ShoppingCart size={32} className="text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-white">RetailFlow POS</h1>
                        <p className="text-slate-400 mt-1">Sign in to your account</p>
                    </div>

                    {/* Error Display */}
                    {error && (
                        <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Login Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Email Address
                            </label>
                            <Input
                                type="email"
                                placeholder="you@example.com"
                                icon={<Mail size={18} />}
                                error={errors.email?.message}
                                className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
                                {...register('email')}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    icon={<Lock size={18} />}
                                    error={errors.password?.message}
                                    className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 pr-12"
                                    {...register('password')}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    className="rounded border-slate-600 bg-slate-800 text-indigo-500 focus:ring-indigo-500"
                                />
                                <span className="text-sm text-slate-400">Remember me</span>
                            </label>
                            <button type="button" className="text-sm text-indigo-400 hover:text-indigo-300">
                                Forgot password?
                            </button>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-12 text-base"
                            isLoading={isLoading}
                        >
                            Sign In
                        </Button>
                    </form>

                    {/* Demo Credentials */}
                    <div className="mt-8 p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
                        <p className="text-xs text-slate-400 mb-2">Demo Credentials:</p>
                        <div className="text-xs space-y-1 text-slate-500">
                            <p><span className="text-slate-400">Admin:</span> admin@store.com / password123</p>
                            <p><span className="text-slate-400">Cashier:</span> cashier@store.com / password123</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
