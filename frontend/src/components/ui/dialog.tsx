import * as React from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

interface DialogProps {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
    className?: string;
    size?: 'sm' | 'default' | 'lg' | 'xl' | 'full';
}

const Dialog: React.FC<DialogProps> = ({ open, onClose, children, className, size = 'default' }) => {
    const [mounted, setMounted] = React.useState(false);

    // Ensure client-side rendering for portal
    React.useEffect(() => {
        setMounted(true);
    }, []);

    React.useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (open) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = '';
        };
    }, [open, onClose]);

    if (!open || !mounted) return null;

    const sizeClasses = {
        sm: 'max-w-sm',
        default: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
        full: 'max-w-[90vw]',
    };

    const dialogContent = (
        <div
            className="dialog-overlay"
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1rem',
            }}
            role="dialog"
            aria-modal="true"
        >
            {/* Backdrop */}
            <div
                onClick={onClose}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    backdropFilter: 'blur(4px)',
                    WebkitBackdropFilter: 'blur(4px)',
                    zIndex: 9999,
                }}
                aria-hidden="true"
            />

            {/* Dialog Content */}
            <div
                className={cn(
                    'relative w-full rounded-2xl shadow-2xl',
                    sizeClasses[size],
                    className
                )}
                style={{
                    zIndex: 10000,
                    maxHeight: '90vh',
                    overflow: 'auto',
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border) / 0.5)',
                    animation: 'dialogEnter 0.2s ease-out',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>

            {/* Animation keyframes injected via style tag */}
            <style>{`
                @keyframes dialogEnter {
                    from {
                        opacity: 0;
                        transform: scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
            `}</style>
        </div>
    );

    // Use portal to render at document body level, escaping any parent positioning
    return createPortal(dialogContent, document.body);
};

const DialogHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
    <div className={cn('flex items-center justify-between p-6 pb-4 border-b border-[hsl(var(--border)/0.5)]', className)} {...props} />
);

const DialogTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ className, ...props }) => (
    <h2 className={cn('font-display text-xl font-semibold', className)} {...props} />
);

const DialogClose: React.FC<{ onClose: () => void }> = ({ onClose }) => (
    <button
        onClick={onClose}
        className="rounded-xl p-2 hover:bg-[hsl(var(--accent))] transition-all duration-200 hover:scale-105 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]"
        aria-label="Close dialog"
    >
        <X className="h-5 w-5" />
    </button>
);

const DialogContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
    <div className={cn('px-6 py-4', className)} {...props} />
);

const DialogFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
    <div className={cn('flex items-center justify-end gap-3 px-6 py-4 border-t border-[hsl(var(--border)/0.5)]', className)} {...props} />
);

export { Dialog, DialogHeader, DialogTitle, DialogClose, DialogContent, DialogFooter };
