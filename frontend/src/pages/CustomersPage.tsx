import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuthStore } from '@/store';
import { customersApi, ordersApi } from '@/api';
import { Card, CardContent, Button, Input, Badge, Skeleton, Dialog, DialogHeader, DialogTitle, DialogClose, DialogContent, DialogFooter } from '@/components/ui';
import { formatDateTime, formatCurrency } from '@/lib/utils';
import type { Customer, Order } from '@/types';
import { Search, Plus, Users, Edit, Mail, Phone, MapPin, Star, ShoppingBag, FileText } from 'lucide-react';

export const CustomersPage: React.FC = () => {
    const { user } = useAuthStore();
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
    const [formData, setFormData] = useState({ name: '', phone: '', email: '', address: '' });
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [customerOrders, setCustomerOrders] = useState<Order[]>([]);
    const [loadingOrders, setLoadingOrders] = useState(false);

    useEffect(() => {
        const fetchCustomers = async () => {
            if (!user?.storeId) return;
            try {
                const data = await customersApi.getCustomers(user.storeId);
                setCustomers(data);
            } catch (error) {
                console.error('Failed to fetch customers:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCustomers();
    }, [user?.storeId]);

    const filteredCustomers = customers.filter((customer) =>
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.phone?.includes(searchQuery) ||
        customer.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSave = async () => {
        if (!user?.storeId) return;
        try {
            if (editingCustomer) {
                const updated = await customersApi.updateCustomer(editingCustomer.id, formData);
                setCustomers(customers.map((c) => (c.id === updated.id ? updated : c)));
                toast.success('Customer updated');
            } else {
                const created = await customersApi.createCustomer({ storeId: user.storeId, ...formData });
                setCustomers([...customers, created]);
                toast.success('Customer created');
            }
            setShowAddDialog(false);
            setEditingCustomer(null);
            setFormData({ name: '', phone: '', email: '', address: '' });
        } catch {
            toast.error('Failed to save customer');
        }
    };

    const openEditDialog = (customer: Customer) => {
        setEditingCustomer(customer);
        setFormData({
            name: customer.name,
            phone: customer.phone || '',
            email: customer.email || '',
            address: customer.address || '',
        });
    };

    const viewOrderHistory = async (customer: Customer) => {
        setSelectedCustomer(customer);
        setLoadingOrders(true);
        try {
            const orders = await ordersApi.getCustomerOrders(customer.id);
            setCustomerOrders(orders);
        } catch {
            toast.error('Failed to load order history');
            setCustomerOrders([]);
        } finally {
            setLoadingOrders(false);
        }
    };

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Skeleton key={i} className="h-40" />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Customers</h1>
                    <p className="text-[hsl(var(--muted-foreground))]">Manage your customer database</p>
                </div>
                <Button onClick={() => setShowAddDialog(true)}>
                    <Plus size={18} />
                    Add Customer
                </Button>
            </div>

            {/* Search */}
            <Input
                placeholder="Search by name, phone, or email..."
                icon={<Search size={18} />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />

            {/* Customers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCustomers.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-[hsl(var(--muted-foreground))]">
                        <Users size={48} className="mx-auto mb-2 opacity-50" />
                        No customers found
                    </div>
                ) : (
                    filteredCustomers.map((customer) => (
                        <Card key={customer.id} hover>
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                                            {customer.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold">{customer.name}</h3>
                                            <p className="text-sm text-[hsl(var(--muted-foreground))]">
                                                Since {formatDateTime(customer.createdAt).split(',')[0]}
                                            </p>
                                        </div>
                                    </div>
                                    {customer.loyaltyPoints > 0 && (
                                        <Badge variant="success" className="flex items-center gap-1">
                                            <Star size={12} />
                                            {customer.loyaltyPoints}
                                        </Badge>
                                    )}
                                </div>

                                <div className="space-y-2 text-sm mb-4">
                                    {customer.phone && (
                                        <div className="flex items-center gap-2 text-[hsl(var(--muted-foreground))]">
                                            <Phone size={14} />
                                            {customer.phone}
                                        </div>
                                    )}
                                    {customer.email && (
                                        <div className="flex items-center gap-2 text-[hsl(var(--muted-foreground))]">
                                            <Mail size={14} />
                                            {customer.email}
                                        </div>
                                    )}
                                    {customer.address && (
                                        <div className="flex items-center gap-2 text-[hsl(var(--muted-foreground))]">
                                            <MapPin size={14} />
                                            {customer.address}
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" className="flex-1" onClick={() => viewOrderHistory(customer)}>
                                        <ShoppingBag size={14} />
                                        Orders
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={() => openEditDialog(customer)}>
                                        <Edit size={14} />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {/* Customer Form Dialog */}
            <Dialog open={showAddDialog || !!editingCustomer} onClose={() => { setShowAddDialog(false); setEditingCustomer(null); }}>
                <DialogHeader>
                    <DialogTitle>{editingCustomer ? 'Edit Customer' : 'Add Customer'}</DialogTitle>
                    <DialogClose onClose={() => { setShowAddDialog(false); setEditingCustomer(null); }} />
                </DialogHeader>
                <DialogContent>
                    <div className="space-y-4">
                        <Input
                            placeholder="Full Name *"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                        <Input
                            placeholder="Phone Number"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                        <Input
                            placeholder="Email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                        <Input
                            placeholder="Address"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        />
                    </div>
                </DialogContent>
                <DialogFooter>
                    <Button variant="outline" onClick={() => { setShowAddDialog(false); setEditingCustomer(null); }}>Cancel</Button>
                    <Button onClick={handleSave} disabled={!formData.name}>Save</Button>
                </DialogFooter>
            </Dialog>

            {/* Order History Dialog */}
            <Dialog open={!!selectedCustomer} onClose={() => setSelectedCustomer(null)}>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <ShoppingBag size={20} />
                        Order History - {selectedCustomer?.name}
                    </DialogTitle>
                    <DialogClose onClose={() => setSelectedCustomer(null)} />
                </DialogHeader>
                <DialogContent>
                    {loadingOrders ? (
                        <div className="space-y-3">
                            {[1, 2, 3].map(i => <Skeleton key={i} className="h-16" />)}
                        </div>
                    ) : customerOrders.length === 0 ? (
                        <div className="text-center py-8 text-[hsl(var(--muted-foreground))]">
                            <FileText size={48} className="mx-auto mb-2 opacity-50" />
                            No orders found
                        </div>
                    ) : (
                        <div className="space-y-3 max-h-[400px] overflow-y-auto">
                            {customerOrders.map(order => (
                                <div key={order.id} className="flex items-center justify-between p-3 rounded-lg bg-[hsl(var(--accent))]">
                                    <div>
                                        <p className="font-medium">{order.orderNumber}</p>
                                        <p className="text-sm text-[hsl(var(--muted-foreground))]">
                                            {formatDateTime(order.createdAt)}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-[hsl(var(--primary))]">
                                            {formatCurrency(order.totalAmount)}
                                        </p>
                                        <Badge variant={order.status === 'COMPLETED' ? 'success' : 'secondary'}>
                                            {order.status}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </DialogContent>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setSelectedCustomer(null)}>Close</Button>
                </DialogFooter>
            </Dialog>
        </div>
    );
};
