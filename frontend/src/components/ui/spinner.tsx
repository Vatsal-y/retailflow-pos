import { cn } from '@/lib/utils';

interface SpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ size = 'md', className }) => {
    const sizes = {
        sm: 'h-4 w-4',
        md: 'h-8 w-8',
        lg: 'h-12 w-12',
    };

    return (
        <div className={cn('flex items-center justify-center', className)}>
            <div
                className={cn(
                    'animate-spin rounded-full border-2 border-[hsl(var(--muted))] border-t-[hsl(var(--primary))]',
                    sizes[size]
                )}
            />
        </div>
    );
};

interface LoadingOverlayProps {
    message?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ message = 'Loading...' }) => (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[hsl(var(--background)/0.8)] backdrop-blur-sm">
        <Spinner size="lg" />
        <p className="mt-4 text-lg text-[hsl(var(--muted-foreground))]">{message}</p>
    </div>
);

interface SkeletonProps {
    className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className }) => (
    <div
        className={cn(
            'animate-pulse rounded-lg bg-[hsl(var(--muted))]',
            className
        )}
    />
);
