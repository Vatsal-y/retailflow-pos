import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store';
import { ordersApi, storesApi } from '@/api';
import { Card, CardContent, Badge, Button, Input, Skeleton, Dialog, DialogHeader, DialogTitle, DialogClose, DialogContent } from '@/components/ui';
import { formatCurrency, formatDateTime, ORDER_STATUS_COLORS, PAYMENT_METHODS } from '@/lib/utils';
import type { OrderStatus } from '@/types';
import { Search, FileText, Eye, Download, User, Building2 } from 'lucide-react';

interface OrderWithDetails {
    id: number;
    orderNumber: string;
    branchId: number;
    branchName?: string;
    customerId?: number;
    customerName?: string;
    cashierId: number;
    cashierName?: string;
    subtotal: number;
    discountAmount: number;
    taxAmount: number;
    totalAmount: number;
    paymentMethod: 'CASH' | 'CARD' | 'UPI' | 'WALLET';
    status: OrderStatus;
    createdAt: string;
    items?: { productName: string; quantity: number; unitPrice: number; totalPrice: number }[];
}

export const OrdersPage: React.FC = () => {
    const { user } = useAuthStore();
    const [orders, setOrders] = useState<OrderWithDetails[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<OrderStatus | 'ALL'>('ALL');
    const [selectedOrder, setSelectedOrder] = useState<OrderWithDetails | null>(null);

    useEffect(() => {
        const fetchOrders = async () => {
            // For users with branchId, fetch orders for that branch
            if (user?.branchId) {
                try {
                    const data = await ordersApi.getOrders(user.branchId);
                    setOrders(data as unknown as OrderWithDetails[]);
                } catch (error) {
                    console.error('Failed to fetch orders:', error);
                } finally {
                    setLoading(false);
                }
                return;
            }

            // For Store Admin (has storeId but no branchId), fetch orders from all branches
            if (user?.storeId) {
                try {
                    const branches = await storesApi.getBranches(user.storeId);
                    const allOrders: OrderWithDetails[] = [];
                    for (const branch of branches) {
                        try {
                            const branchOrders = await ordersApi.getOrders(branch.id);
                            allOrders.push(...(branchOrders as OrderWithDetails[]));
                        } catch {
                            console.warn(`Could not fetch orders for branch ${branch.id}`);
                        }
                    }
                    // Sort by date, newest first
                    allOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                    setOrders(allOrders);
                } catch (error) {
                    console.error('Failed to fetch orders:', error);
                } finally {
                    setLoading(false);
                }
                return;
            }

            setLoading(false);
        };
        fetchOrders();
    }, [user?.branchId, user?.storeId]);

    const filteredOrders = orders.filter((order) => {
        const matchesSearch = order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    if (loading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className="h-20" />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Orders</h1>
                    <p className="text-[hsl(var(--muted-foreground))]">Manage and track all orders</p>
                </div>
                <Button variant="outline">
                    <Download size={18} />
                    Export
                </Button>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                    <Input
                        placeholder="Search by order number..."
                        icon={<Search size={18} />}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    {(['ALL', 'COMPLETED', 'PENDING', 'CANCELLED', 'REFUNDED'] as const).map((status) => (
                        <Button
                            key={status}
                            variant={statusFilter === status ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setStatusFilter(status)}
                        >
                            {status === 'ALL' ? 'All' : status.charAt(0) + status.slice(1).toLowerCase()}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Orders List */}
            <Card>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-[hsl(var(--border))]">
                                    <th className="text-left p-4 font-medium text-[hsl(var(--muted-foreground))]">Order #</th>
                                    <th className="text-left p-4 font-medium text-[hsl(var(--muted-foreground))]">Date</th>
                                    <th className="text-left p-4 font-medium text-[hsl(var(--muted-foreground))]">Customer</th>
                                    <th className="text-left p-4 font-medium text-[hsl(var(--muted-foreground))]">Branch</th>
                                    <th className="text-left p-4 font-medium text-[hsl(var(--muted-foreground))]">Cashier</th>
                                    <th className="text-left p-4 font-medium text-[hsl(var(--muted-foreground))]">Payment</th>
                                    <th className="text-left p-4 font-medium text-[hsl(var(--muted-foreground))]">Status</th>
                                    <th className="text-right p-4 font-medium text-[hsl(var(--muted-foreground))]">Total</th>
                                    <th className="text-right p-4 font-medium text-[hsl(var(--muted-foreground))]">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan={9} className="text-center py-12 text-[hsl(var(--muted-foreground))]">
                                            <FileText size={48} className="mx-auto mb-2 opacity-50" />
                                            No orders found
                                        </td>
                                    </tr>
                                ) : (
                                    filteredOrders.map((order) => (
                                        <tr key={order.id} className="border-b border-[hsl(var(--border))] hover:bg-[hsl(var(--accent)/0.5)] transition-colors">
                                            <td className="p-4 font-medium">{order.orderNumber}</td>
                                            <td className="p-4 text-sm">{formatDateTime(order.createdAt)}</td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    <User size={14} className="text-[hsl(var(--muted-foreground))]" />
                                                    <span>{order.customerName || 'Walk-in'}</span>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    <Building2 size={14} className="text-[hsl(var(--muted-foreground))]" />
                                                    <span className="text-sm">{order.branchName || '-'}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-sm">{order.cashierName || '-'}</td>
                                            <td className="p-4">
                                                <Badge variant="secondary">{PAYMENT_METHODS[order.paymentMethod].label}</Badge>
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${ORDER_STATUS_COLORS[order.status]}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right font-bold">{formatCurrency(order.totalAmount)}</td>
                                            <td className="p-4 text-right">
                                                <Button variant="ghost" size="sm" onClick={() => setSelectedOrder(order)}>
                                                    <Eye size={16} />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Order Detail Dialog */}
            <Dialog open={!!selectedOrder} onClose={() => setSelectedOrder(null)}>
                <DialogHeader>
                    <DialogTitle>Order {selectedOrder?.orderNumber}</DialogTitle>
                    <DialogClose onClose={() => setSelectedOrder(null)} />
                </DialogHeader>
                <DialogContent>
                    {selectedOrder && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-[hsl(var(--muted-foreground))]">Date</p>
                                    <p className="font-medium">{formatDateTime(selectedOrder.createdAt)}</p>
                                </div>
                                <div>
                                    <p className="text-[hsl(var(--muted-foreground))]">Payment</p>
                                    <p className="font-medium">{PAYMENT_METHODS[selectedOrder.paymentMethod].label}</p>
                                </div>
                            </div>

                            <div className="border-t border-[hsl(var(--border))] pt-4">
                                <p className="font-medium mb-2">Items</p>
                                {selectedOrder.items?.map((item, i) => (
                                    <div key={i} className="flex justify-between py-2 text-sm">
                                        <span>{item.productName} × {item.quantity}</span>
                                        <span>{formatCurrency(item.totalPrice)}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-[hsl(var(--border))] pt-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>Subtotal</span>
                                    <span>{formatCurrency(selectedOrder.subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Discount</span>
                                    <span className="text-red-500">-{formatCurrency(selectedOrder.discountAmount)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Tax</span>
                                    <span>{formatCurrency(selectedOrder.taxAmount)}</span>
                                </div>
                                <div className="flex justify-between font-bold text-lg pt-2 border-t border-[hsl(var(--border))]">
                                    <span>Total</span>
                                    <span className="text-[hsl(var(--primary))]">{formatCurrency(selectedOrder.totalAmount)}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};
