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
        <header className="fixed top-0 right-0 z-30 h-16 bg-[hsl(var(--card))] border-b border-[hsl(var(--border))] left-64">
            <div className="flex h-full items-center justify-between px-6">
                {/* Left - Breadcrumb / Title */}
                <div className="flex items-center gap-4">
                    <h1 className="text-lg font-semibold">
                        Welcome back, {user?.fullName?.split(' ')[0] || 'User'}
                    </h1>
                </div>

                {/* Right - Actions */}
                <div className="flex items-center gap-3">
                    {/* Active Shift Indicator */}
                    {activeShift && (
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
                            <Clock size={16} className="animate-pulse" />
                            <span className="text-sm font-medium">
                                Shift Active • {formatCurrency(activeShift.totalSales || 0)}
                            </span>
                        </div>
                    )}

                    {/* Theme Toggle */}
                    <Button variant="ghost" size="icon" onClick={toggleTheme}>
                        {isDark ? <Sun size={20} /> : <Moon size={20} />}
                    </Button>

                    {/* User Menu */}
                    <div className="relative">
                        <button
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            className="flex items-center gap-3 pl-3 pr-2 py-1.5 rounded-lg hover:bg-[hsl(var(--accent))] transition-colors"
                        >
                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
                                {user?.fullName ? getInitials(user.fullName) : <User size={16} />}
                            </div>
                            <div className="text-left hidden md:block">
                                <p className="text-sm font-medium">{user?.fullName}</p>
                                <p className="text-xs text-[hsl(var(--muted-foreground))]">
                                    {user?.role ? ROLE_DISPLAY_NAMES[user.role] : 'User'}
                                </p>
                            </div>
                            <ChevronDown size={16} className="text-[hsl(var(--muted-foreground))]" />
                        </button>

                        {/* Dropdown */}
                        {showUserMenu && (
                            <>
                                <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setShowUserMenu(false)}
                                />
                                <div className="absolute right-0 top-full mt-2 w-56 rounded-xl bg-[hsl(var(--card))] border border-[hsl(var(--border))] shadow-xl z-20 animate-fadeIn">
                                    <div className="p-3 border-b border-[hsl(var(--border))]">
                                        <p className="font-medium">{user?.fullName}</p>
                                        <p className="text-sm text-[hsl(var(--muted-foreground))]">{user?.email}</p>
                                    </div>
                                    <div className="p-2">
                                        <button
                                            onClick={() => {
                                                logout();
                                                setShowUserMenu(false);
                                            }}
                                            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition-colors text-left"
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
