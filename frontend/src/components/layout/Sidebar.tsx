import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store';
import {
    LayoutDashboard,
    ShoppingCart,
    Package,
    Users,
    FileText,
    Clock,
    Settings,
    Store,
    Building2,
    UserCog,
    BarChart3,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import { useState } from 'react';

interface NavItem {
    label: string;
    path: string;
    icon: React.ReactNode;
    roles?: string[];
}

const navItems: NavItem[] = [
    { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} />, roles: ['BRANCH_MANAGER', 'STORE_ADMIN', 'SUPER_ADMIN'] },
    { label: 'POS Terminal', path: '/pos', icon: <ShoppingCart size={20} /> },
    { label: 'Orders', path: '/orders', icon: <FileText size={20} /> },
    { label: 'Products', path: '/products', icon: <Package size={20} />, roles: ['BRANCH_MANAGER', 'STORE_ADMIN', 'SUPER_ADMIN'] },
    { label: 'Customers', path: '/customers', icon: <Users size={20} /> },
    { label: 'Shifts', path: '/shifts', icon: <Clock size={20} /> },
    { label: 'Employees', path: '/employees', icon: <UserCog size={20} />, roles: ['BRANCH_MANAGER', 'STORE_ADMIN', 'SUPER_ADMIN'] },
    { label: 'Reports', path: '/reports', icon: <BarChart3 size={20} />, roles: ['BRANCH_MANAGER', 'STORE_ADMIN', 'SUPER_ADMIN'] },
    { label: 'Branches', path: '/branches', icon: <Building2 size={20} />, roles: ['STORE_ADMIN', 'SUPER_ADMIN'] },
    { label: 'Stores', path: '/stores', icon: <Store size={20} />, roles: ['SUPER_ADMIN'] },
    { label: 'Settings', path: '/settings', icon: <Settings size={20} />, roles: ['STORE_ADMIN', 'SUPER_ADMIN'] },
];

export const Sidebar: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);
    const { user } = useAuthStore();
    const location = useLocation();

    const filteredNavItems = navItems.filter((item) => {
        if (!item.roles) return true;
        return user?.role && item.roles.includes(user.role);
    });

    return (
        <aside
            className={cn(
                'fixed left-0 top-0 z-40 h-screen bg-[hsl(var(--card))] border-r border-[hsl(var(--border))] transition-all duration-300',
                collapsed ? 'w-16' : 'w-64'
            )}
        >
            {/* Logo */}
            <div className="flex h-16 items-center justify-between px-4 border-b border-[hsl(var(--border))]">
                {!collapsed && (
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
                            <ShoppingCart size={18} className="text-white" />
                        </div>
                        <span className="font-bold text-lg">RetailFlow</span>
                    </div>
                )}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="p-2 rounded-lg hover:bg-[hsl(var(--accent))] transition-colors"
                >
                    {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                </button>
            </div>

            {/* Navigation */}
            <nav className="p-3 space-y-1 overflow-y-auto h-[calc(100vh-4rem)]">
                {filteredNavItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            cn(
                                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                                isActive || location.pathname === item.path
                                    ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] shadow-lg shadow-[hsl(var(--primary)/0.25)]'
                                    : 'text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--foreground))]',
                                collapsed && 'justify-center'
                            )
                        }
                        title={collapsed ? item.label : undefined}
                    >
                        {item.icon}
                        {!collapsed && <span className="font-medium">{item.label}</span>}
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
};
