import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { Toaster } from 'sonner';

export const DashboardLayout: React.FC = () => {
    return (
        <div className="min-h-screen bg-[hsl(var(--background))]">
            <Sidebar />
            <Navbar />
            <main className="pl-64 pt-16">
                <div className="p-6">
                    <Outlet />
                </div>
            </main>
            <Toaster
                position="top-right"
                toastOptions={{
                    className: 'bg-[hsl(var(--card))] border border-[hsl(var(--border))] text-[hsl(var(--foreground))]',
                    duration: 4000,
                }}
            />
        </div>
    );
};
