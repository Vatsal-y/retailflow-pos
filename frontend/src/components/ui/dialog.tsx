import * as React from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

interface DialogProps {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
    className?: string;
}

const Dialog: React.FC<DialogProps> = ({ open, onClose, children, className }) => {
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
            document.body.style.overflow = 'unset';
        };
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-fadeIn"
                onClick={onClose}
            />
            {/* Content */}
            <div
                className={cn(
                    'relative z-50 w-full max-w-lg rounded-xl bg-[hsl(var(--card))] border border-[hsl(var(--border))] shadow-2xl animate-fadeIn',
                    className
                )}
            >
                {children}
            </div>
        </div>
    );
};

const DialogHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
    <div className={cn('flex items-center justify-between p-6 pb-4', className)} {...props} />
);

const DialogTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ className, ...props }) => (
    <h2 className={cn('text-xl font-semibold', className)} {...props} />
);

const DialogClose: React.FC<{ onClose: () => void }> = ({ onClose }) => (
    <button
        onClick={onClose}
        className="rounded-lg p-2 hover:bg-[hsl(var(--accent))] transition-colors"
    >
        <X className="h-5 w-5" />
    </button>
);

const DialogContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
    <div className={cn('px-6 pb-6', className)} {...props} />
);

const DialogFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
    <div className={cn('flex items-center justify-end gap-3 px-6 pb-6', className)} {...props} />
);

export { Dialog, DialogHeader, DialogTitle, DialogClose, DialogContent, DialogFooter };
