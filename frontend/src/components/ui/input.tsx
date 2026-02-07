import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: string;
    icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, error, icon, ...props }, ref) => {
        return (
            <div className="relative w-full">
                {icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))]">
                        {icon}
                    </div>
                )}
                <input
                    type={type}
                    className={cn(
                        'flex h-11 w-full rounded-lg border border-[hsl(var(--input))] bg-transparent px-4 py-2 text-base transition-all duration-200',
                        'placeholder:text-[hsl(var(--muted-foreground))]',
                        'focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] focus:ring-offset-2',
                        'disabled:cursor-not-allowed disabled:opacity-50',
                        icon && 'pl-10',
                        error && 'border-[hsl(var(--destructive))] focus:ring-[hsl(var(--destructive))]',
                        className
                    )}
                    ref={ref}
                    {...props}
                />
                {error && (
                    <p className="mt-1.5 text-sm text-[hsl(var(--destructive))]">{error}</p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

export { Input };
