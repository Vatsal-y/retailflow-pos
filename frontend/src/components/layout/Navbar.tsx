import { useAuthStore, useShiftStore } from '@/store';
import { Button } from '@/components/ui';
import { getInitials, ROLE_DISPLAY_NAMES, formatCurrency } from '@/lib/utils';
import {
    Moon,
    Sun,
    LogOut,
    User,
    Clock,
    ChevronDown,
    Sparkles,
} from 'lucide-react';
import { useState, useEffect } from 'react';

export const Navbar: React.FC = () => {
    const { user, logout } = useAuthStore();
    const { activeShift } = useShiftStore();
    const [isDark, setIsDark] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            setIsDark(true);
            document.documentElement.classList.add('dark');
        }
    }, []);

    const toggleTheme = () => {
        setIsDark(!isDark);
        if (isDark) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        }
    };

    return (
        <header className="fixed top-0 right-0 z-30 h-16 glass left-64">
            <div className="flex h-full items-center justify-between px-6">
                {/* Left - Breadcrumb / Title */}
                <div className="flex items-center gap-4">
                    <div>
                        <h1 className="text-lg font-display font-semibold flex items-center gap-2">
                            Welcome back, {user?.fullName?.split(' ')[0] || 'User'}
                            <Sparkles size={16} className="text-[hsl(var(--primary))] animate-pulse" />
                        </h1>
                        <p className="text-xs text-[hsl(var(--muted-foreground))]">
                            Let's make today productive
                        </p>
                    </div>
                </div>

                {/* Right - Actions */}
                <div className="flex items-center gap-3">
                    {/* Active Shift Indicator */}
                    {activeShift && (
                        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                            <div className="relative">
                                <Clock size={16} />
                                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                            </div>
                            <span className="text-sm font-medium">
                                Shift Active • {formatCurrency(activeShift.totalSales || 0)}
                            </span>
                        </div>
                    )}

                    {/* Theme Toggle */}
                    <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-xl">
                        {isDark ? <Sun size={20} /> : <Moon size={20} />}
                    </Button>

                    {/* User Menu */}
                    <div className="relative">
                        <button
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            className="flex items-center gap-3 pl-3 pr-2 py-1.5 rounded-xl hover:bg-[hsl(var(--accent))] transition-all duration-200 group"
                        >
                            <div className="relative">
                                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(180_50%_35%)] flex items-center justify-center text-white text-sm font-medium transition-transform duration-200 group-hover:scale-105">
                                    {user?.fullName ? getInitials(user.fullName) : <User size={16} />}
                                </div>
                                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-[hsl(var(--card))] rounded-full" />
                            </div>
                            <div className="text-left hidden md:block">
                                <p className="text-sm font-medium">{user?.fullName}</p>
                                <p className="text-xs text-[hsl(var(--muted-foreground))]">
                                    {user?.role ? ROLE_DISPLAY_NAMES[user.role] : 'User'}
                                </p>
                            </div>
                            <ChevronDown size={16} className="text-[hsl(var(--muted-foreground))] transition-transform duration-200 group-hover:rotate-180" />
                        </button>

                        {/* Dropdown */}
                        {showUserMenu && (
                            <>
                                <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setShowUserMenu(false)}
                                />
                                <div className="absolute right-0 top-full mt-2 w-56 rounded-xl glass shadow-xl z-20 animate-scaleIn origin-top-right overflow-hidden">
                                    <div className="p-4 border-b border-[hsl(var(--border)/0.5)]">
                                        <p className="font-medium">{user?.fullName}</p>
                                        <p className="text-sm text-[hsl(var(--muted-foreground))]">{user?.email}</p>
                                    </div>
                                    <div className="p-2">
                                        <button
                                            onClick={() => {
                                                logout();
                                                setShowUserMenu(false);
                                            }}
                                            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-red-500/10 text-red-600 dark:text-red-400 transition-colors text-left"
                                        >
                                            <LogOut size={16} />
                                            <span>Logout</span>
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};
