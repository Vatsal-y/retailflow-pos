import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuthStore } from '@/store';
import { storesApi } from '@/api';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    Badge,
    Button,
    Input,
    Skeleton,
    Dialog,
    DialogHeader,
    DialogTitle,
    DialogClose,
    DialogContent,
    DialogFooter,
} from '@/components/ui';
import { formatDateTime } from '@/lib/utils';
import type { Store, Branch, SubscriptionPlan } from '@/types';
import {
    Search,
    Plus,
    Store as StoreIcon,
    Building2,
    Edit,
    Trash2,
    MapPin,
    Phone,
    Mail,
    Crown,
    CheckCircle,
    XCircle,
    Clock,
} from 'lucide-react';

const STORE_STATUS_COLORS = {
    ACTIVE: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    INACTIVE: 'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400',
    SUSPENDED: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

export const StoresPage: React.FC = () => {
    const { user } = useAuthStore();
    const [stores, setStores] = useState<Store[]>([]);
    const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [editingStore, setEditingStore] = useState<Store | null>(null);
    const [selectedStore, setSelectedStore] = useState<Store | null>(null);
    const [storeBranches, setStoreBranches] = useState<Branch[]>([]);
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        phone: '',
        email: '',
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [storesData, plansData] = await Promise.all([
                    storesApi.getStores(),
                    storesApi.getSubscriptionPlans(),
                ]);
                setStores(storesData);
                setSubscriptionPlans(plansData);
            } catch (error) {
                console.error('Failed to fetch stores:', error);
                toast.error('Failed to load stores');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredStores = stores.filter((store) =>
        store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleOpenAddDialog = () => {
        setFormData({
            name: '',
            address: '',
            phone: '',
            email: '',
        });
        setEditingStore(null);
        setShowAddDialog(true);
    };

    const handleOpenEditDialog = (store: Store) => {
        setFormData({
            name: store.name,
            address: store.address || '',
            phone: store.phone || '',
            email: store.email || '',
        });
        setEditingStore(store);
        setShowAddDialog(true);
    };

    const handleViewStore = async (store: Store) => {
        setSelectedStore(store);
        try {
            const branches = await storesApi.getBranches(store.id);
            setStoreBranches(branches);
        } catch {
            setStoreBranches([]);
        }
    };

    const handleSaveStore = async () => {
        try {
            if (editingStore) {
                const updated = await storesApi.updateStore(editingStore.id, formData);
                setStores(stores.map((s) => (s.id === updated.id ? updated : s)));
                toast.success('Store updated successfully');
            } else {
                const created = await storesApi.createStore(formData);
                setStores([...stores, created]);
                toast.success('Store created successfully');
            }
            setShowAddDialog(false);
        } catch (error) {
            console.error('Failed to save store:', error);
            toast.error('Failed to save store');
        }
    };

    if (loading) {
        return (
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-40" />
                    ))}
                </div>
            </div>
        );
    }

    // Only Super Admin should see this page
    if (user?.role !== 'SUPER_ADMIN') {
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-8rem)] text-center">
                <div className="h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
                    <XCircle size={32} className="text-red-500" />
                </div>
                <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
                <p className="text-[hsl(var(--muted-foreground))]">Only Super Admins can access this page.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Stores Management</h1>
                    <p className="text-[hsl(var(--muted-foreground))]">Manage all stores on the platform</p>
                </div>
                <Button onClick={handleOpenAddDialog}>
                    <Plus size={18} />
                    Add Store
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                                <StoreIcon size={20} className="text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <p className="text-sm text-[hsl(var(--muted-foreground))]">Total Stores</p>
                                <p className="text-2xl font-bold">{stores.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                                <CheckCircle size={20} className="text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div>
                                <p className="text-sm text-[hsl(var(--muted-foreground))]">Active</p>
                                <p className="text-2xl font-bold">{stores.filter((s) => s.status === 'ACTIVE').length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                                <Clock size={20} className="text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                                <p className="text-sm text-[hsl(var(--muted-foreground))]">Pending</p>
                                <p className="text-2xl font-bold">{stores.filter((s) => s.status === 'INACTIVE').length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                                <Crown size={20} className="text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                                <p className="text-sm text-[hsl(var(--muted-foreground))]">Plans</p>
                                <p className="text-2xl font-bold">{subscriptionPlans.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Search */}
            <div className="flex-1 max-w-md">
                <Input
                    placeholder="Search stores..."
                    icon={<Search size={18} />}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Stores Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStores.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-[hsl(var(--muted-foreground))]">
                        <StoreIcon size={48} className="mx-auto mb-2 opacity-50" />
                        No stores found
                    </div>
                ) : (
                    filteredStores.map((store) => (
                        <Card key={store.id} hover className="cursor-pointer" onClick={() => handleViewStore(store)}>
                            <CardHeader className="pb-2">
                                <div className="flex items-start justify-between">
                                    <CardTitle className="text-lg">{store.name}</CardTitle>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${STORE_STATUS_COLORS[store.status]}`}>
                                        {store.status}
                                    </span>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {store.address && (
                                    <div className="flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))]">
                                        <MapPin size={14} />
                                        <span className="truncate">{store.address}</span>
                                    </div>
                                )}
                                {store.email && (
                                    <div className="flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))]">
                                        <Mail size={14} />
                                        <span>{store.email}</span>
                                    </div>
                                )}
                                {store.phone && (
                                    <div className="flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))]">
                                        <Phone size={14} />
                                        <span>{store.phone}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2 pt-2 border-t border-[hsl(var(--border))]">
                                    <p className="text-xs text-[hsl(var(--muted-foreground))]">
                                        Created: {formatDateTime(store.createdAt).split(',')[0]}
                                    </p>
                                </div>
                                <div className="flex gap-2 pt-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleOpenEditDialog(store);
                                        }}
                                    >
                                        <Edit size={14} />
                                        Edit
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-red-500"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toast.info('Delete functionality coming soon');
                                        }}
                                    >
                                        <Trash2 size={14} />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {/* Store Detail Dialog */}
            <Dialog open={!!selectedStore} onClose={() => setSelectedStore(null)}>
                <DialogHeader>
                    <DialogTitle>{selectedStore?.name}</DialogTitle>
                    <DialogClose onClose={() => setSelectedStore(null)} />
                </DialogHeader>
                <DialogContent>
                    {selectedStore && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-[hsl(var(--muted-foreground))]">Status</p>
                                    <Badge variant={selectedStore.status === 'ACTIVE' ? 'success' : 'secondary'}>
                                        {selectedStore.status}
                                    </Badge>
                                </div>
                                <div>
                                    <p className="text-[hsl(var(--muted-foreground))]">Created</p>
                                    <p className="font-medium">{formatDateTime(selectedStore.createdAt)}</p>
                                </div>
                            </div>

                            <div className="border-t border-[hsl(var(--border))] pt-4">
                                <p className="font-medium mb-3 flex items-center gap-2">
                                    <Building2 size={18} />
                                    Branches ({storeBranches.length})
                                </p>
                                {storeBranches.length === 0 ? (
                                    <p className="text-sm text-[hsl(var(--muted-foreground))]">No branches yet</p>
                                ) : (
                                    <div className="space-y-2">
                                        {storeBranches.map((branch) => (
                                            <div key={branch.id} className="flex items-center justify-between p-3 rounded-lg bg-[hsl(var(--accent))]">
                                                <div>
                                                    <p className="font-medium">{branch.name}</p>
                                                    <p className="text-sm text-[hsl(var(--muted-foreground))]">{branch.city || branch.address}</p>
                                                </div>
                                                <Badge variant={branch.active ? 'success' : 'secondary'}>
                                                    {branch.active ? 'Active' : 'Inactive'}
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Add/Edit Store Dialog */}
            <Dialog open={showAddDialog} onClose={() => setShowAddDialog(false)}>
                <DialogHeader>
                    <DialogTitle>{editingStore ? 'Edit Store' : 'Add Store'}</DialogTitle>
                    <DialogClose onClose={() => setShowAddDialog(false)} />
                </DialogHeader>
                <DialogContent>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Store Name</label>
                            <Input
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="My Retail Store"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Address</label>
                            <Input
                                icon={<MapPin size={18} />}
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                placeholder="123 Main Street, City"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Email</label>
                                <Input
                                    icon={<Mail size={18} />}
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="store@example.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Phone</label>
                                <Input
                                    icon={<Phone size={18} />}
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="+91 XXXXX XXXXX"
                                />
                            </div>
                        </div>
                    </div>
                </DialogContent>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleSaveStore}>
                        {editingStore ? 'Update' : 'Create'} Store
                    </Button>
                </DialogFooter>
            </Dialog>
        </div>
    );
};
