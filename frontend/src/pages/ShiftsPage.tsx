import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuthStore, useShiftStore } from '@/store';
import { shiftsApi, storesApi } from '@/api';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge, Skeleton } from '@/components/ui';
import { formatCurrency, formatDateTime, formatRelativeTime } from '@/lib/utils';
import type { ShiftReport } from '@/types';
import { Clock, Play, Square, DollarSign, Receipt, AlertTriangle, CheckCircle, User, Building2 } from 'lucide-react';

// Extended type to include enriched fields from backend
interface ShiftReportEnriched extends ShiftReport {
    cashierName?: string;
    branchName?: string;
    orders?: { id: number; orderNumber: string; totalAmount: number; paymentMethod: string; customerName?: string; createdAt: string }[];
}

export const ShiftsPage: React.FC = () => {
    const { user } = useAuthStore();
    const { activeShift, startShift, endShift, checkActiveShift } = useShiftStore();
    const [shiftHistory, setShiftHistory] = useState<ShiftReportEnriched[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const isStoreAdmin = user?.storeId && !user?.branchId;

    useEffect(() => {
        const fetchData = async () => {
            // For users with branchId (cashiers), fetch their own shifts
            if (user?.id && user?.branchId) {
                try {
                    await checkActiveShift(user.id);
                    const history = await shiftsApi.getShiftReportsByCashier(user.id);
                    setShiftHistory(history.filter((s) => s.status === 'CLOSED'));
                } catch (error) {
                    console.error('Failed to fetch shifts:', error);
                } finally {
                    setLoading(false);
                }
                return;
            }

            // For Store Admin, fetch shifts from all branches
            if (user?.storeId && !user?.branchId) {
                try {
                    const branches = await storesApi.getBranches(user.storeId);
                    const allShifts: ShiftReportEnriched[] = [];
                    for (const branch of branches) {
                        try {
                            const branchShifts = await shiftsApi.getShiftReports(branch.id);
                            allShifts.push(...branchShifts);
                        } catch {
                            console.warn(`Could not fetch shifts for branch ${branch.id}`);
                        }
                    }
                    // Sort by date, newest first
                    allShifts.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
                    setShiftHistory(allShifts);
                } catch (error) {
                    console.error('Failed to fetch shifts:', error);
                } finally {
                    setLoading(false);
                }
                return;
            }

            setLoading(false);
        };
        fetchData();
    }, [user?.id, user?.branchId, user?.storeId, checkActiveShift]);

    const handleStartShift = async () => {
        if (!user?.branchId || !user?.id) return;
        setActionLoading(true);
        try {
            await startShift(user.branchId, user.id);
            toast.success('Shift started successfully!');
        } catch {
            toast.error('Failed to start shift');
        } finally {
            setActionLoading(false);
        }
    };

    const handleEndShift = async () => {
        if (!user?.id) return;
        if (!confirm('Are you sure you want to end your shift?')) return;
        setActionLoading(true);
        try {
            const completedShift = await endShift(user.id);
            setShiftHistory([completedShift, ...shiftHistory]);
            toast.success('Shift ended successfully!');
        } catch {
            toast.error('Failed to end shift');
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-48" />
                <Skeleton className="h-64" />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fadeIn">
            <div>
                <h1 className="text-2xl font-bold">Shift Management</h1>
                <p className="text-[hsl(var(--muted-foreground))]">Track your shifts and sales</p>
            </div>

            {/* Active Shift Card - Only for users with branchId */}
            {!isStoreAdmin && (
                <Card className={activeShift ? 'border-emerald-500 dark:border-emerald-400' : ''}>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock size={20} />
                            Current Shift
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {activeShift ? (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                                            <Play size={24} className="text-emerald-600 dark:text-emerald-400" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-lg">Shift Active</p>
                                            <p className="text-sm text-[hsl(var(--muted-foreground))]">
                                                Started {formatRelativeTime(activeShift.startTime)}
                                            </p>
                                        </div>
                                    </div>
                                    <Button variant="destructive" onClick={handleEndShift} isLoading={actionLoading}>
                                        <Square size={18} />
                                        End Shift
                                    </Button>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="p-4 rounded-lg bg-[hsl(var(--accent))]">
                                        <DollarSign size={20} className="text-emerald-500 mb-2" />
                                        <p className="text-sm text-[hsl(var(--muted-foreground))]">Total Sales</p>
                                        <p className="text-xl font-bold">{formatCurrency(activeShift.totalSales || 0)}</p>
                                    </div>
                                    <div className="p-4 rounded-lg bg-[hsl(var(--accent))]">
                                        <Receipt size={20} className="text-blue-500 mb-2" />
                                        <p className="text-sm text-[hsl(var(--muted-foreground))]">Transactions</p>
                                        <p className="text-xl font-bold">{activeShift.totalTransactions || 0}</p>
                                    </div>
                                    <div className="p-4 rounded-lg bg-[hsl(var(--accent))]">
                                        <Clock size={20} className="text-purple-500 mb-2" />
                                        <p className="text-sm text-[hsl(var(--muted-foreground))]">Started At</p>
                                        <p className="text-xl font-bold">{formatDateTime(activeShift.startTime).split(', ')[1]}</p>
                                    </div>
                                    <div className="p-4 rounded-lg bg-[hsl(var(--accent))]">
                                        <DollarSign size={20} className="text-amber-500 mb-2" />
                                        <p className="text-sm text-[hsl(var(--muted-foreground))]">Opening</p>
                                        <p className="text-xl font-bold">{formatCurrency(activeShift.openingBalance || 0)}</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <div className="h-16 w-16 rounded-full bg-[hsl(var(--muted))] flex items-center justify-center mx-auto mb-4">
                                    <Clock size={32} className="text-[hsl(var(--muted-foreground))]" />
                                </div>
                                <p className="text-lg font-medium mb-2">No Active Shift</p>
                                <p className="text-[hsl(var(--muted-foreground))] mb-4">Start a shift to begin processing orders</p>
                                <Button onClick={handleStartShift} isLoading={actionLoading}>
                                    <Play size={18} />
                                    Start Shift
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Store Admin Notice */}
            {isStoreAdmin && (
                <Card>
                    <CardContent className="py-6">
                        <p className="text-center text-[hsl(var(--muted-foreground))]">
                            Viewing all shift history from all branches
                        </p>
                    </CardContent>
                </Card>
            )}

            {/* Shift History */}
            <Card>
                <CardHeader>
                    <CardTitle>Shift History</CardTitle>
                </CardHeader>
                <CardContent>
                    {shiftHistory.length === 0 ? (
                        <div className="text-center py-8 text-[hsl(var(--muted-foreground))]">
                            <Clock size={48} className="mx-auto mb-2 opacity-50" />
                            No completed shifts yet
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {shiftHistory.map((shift) => (
                                <div
                                    key={shift.id}
                                    className="flex items-center justify-between p-4 rounded-lg bg-[hsl(var(--accent))]"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-full bg-[hsl(var(--background))] flex items-center justify-center">
                                            <CheckCircle size={20} className="text-emerald-500" />
                                        </div>
                                        <div>
                                            <p className="font-medium">{formatDateTime(shift.startTime)}</p>
                                            {(shift as ShiftReportEnriched).cashierName && (
                                                <p className="text-sm text-[hsl(var(--muted-foreground))] flex items-center gap-1">
                                                    <User size={12} />
                                                    {(shift as ShiftReportEnriched).cashierName}
                                                    {(shift as ShiftReportEnriched).branchName && (
                                                        <>
                                                            <span className="mx-1">•</span>
                                                            <Building2 size={12} />
                                                            {(shift as ShiftReportEnriched).branchName}
                                                        </>
                                                    )}
                                                </p>
                                            )}
                                            <p className="text-sm text-[hsl(var(--muted-foreground))]">
                                                {shift.totalTransactions} transactions
                                                {(shift as ShiftReportEnriched).orders && (shift as ShiftReportEnriched).orders!.length > 0 && (
                                                    <span> • {(shift as ShiftReportEnriched).orders!.length} orders</span>
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-lg">{formatCurrency(shift.totalSales)}</p>
                                        {shift.discrepancy && shift.discrepancy !== 0 && (
                                            <Badge variant={shift.discrepancy < 0 ? 'destructive' : 'warning'} className="mt-1">
                                                <AlertTriangle size={12} className="mr-1" />
                                                {formatCurrency(Math.abs(shift.discrepancy))} discrepancy
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};
