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
import type { Branch } from '@/types';
import {
    Search,
    Plus,
    Building2,
    Edit,
    Trash2,
    MapPin,
    Phone,
    CheckCircle,
    XCircle,
} from 'lucide-react';

export const BranchesPage: React.FC = () => {
    const { user } = useAuthStore();
    const [branches, setBranches] = useState<Branch[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        city: '',
        phone: '',
    });

    useEffect(() => {
        const fetchData = async () => {
            if (!user?.storeId) return;
            try {
                const branchesData = await storesApi.getBranches(user.storeId);
                setBranches(branchesData);
            } catch (error) {
                console.error('Failed to fetch branches:', error);
                toast.error('Failed to load branches');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user?.storeId]);

    const filteredBranches = branches.filter((branch) =>
        branch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        branch.city?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleOpenAddDialog = () => {
        setFormData({
            name: '',
            address: '',
            city: '',
            phone: '',
        });
        setEditingBranch(null);
        setShowAddDialog(true);
    };

    const handleOpenEditDialog = (branch: Branch) => {
        setFormData({
            name: branch.name,
            address: branch.address || '',
            city: branch.city || '',
            phone: branch.phone || '',
        });
        setEditingBranch(branch);
        setShowAddDialog(true);
    };

    const handleSaveBranch = async () => {
        if (!user?.storeId) return;
        try {
            if (editingBranch) {
                const updated = await storesApi.updateBranch(editingBranch.id, formData);
                setBranches(branches.map((b) => (b.id === updated.id ? updated : b)));
                toast.success('Branch updated successfully');
            } else {
                const created = await storesApi.createBranch({
                    ...formData,
                    storeId: user.storeId,
                    active: true,
                });
                setBranches([...branches, created]);
                toast.success('Branch created successfully');
            }
            setShowAddDialog(false);
        } catch (error) {
            console.error('Failed to save branch:', error);
            toast.error('Failed to save branch');
        }
    };

    const handleDeleteBranch = async (branch: Branch) => {
        if (!confirm(`Are you sure you want to delete "${branch.name}"? This action cannot be undone.`)) {
            return;
        }
        try {
            await storesApi.deleteBranch(branch.id);
            setBranches(branches.filter((b) => b.id !== branch.id));
            toast.success('Branch deleted successfully');
        } catch (error) {
            console.error('Failed to delete branch:', error);
            toast.error('Failed to delete branch');
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

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Branches</h1>
                    <p className="text-[hsl(var(--muted-foreground))]">Manage your store branches</p>
                </div>
                <Button onClick={handleOpenAddDialog}>
                    <Plus size={18} />
                    Add Branch
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                                <Building2 size={20} className="text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <p className="text-sm text-[hsl(var(--muted-foreground))]">Total Branches</p>
                                <p className="text-2xl font-bold">{branches.length}</p>
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
                                <p className="text-2xl font-bold">{branches.filter((b) => b.active).length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
                                <XCircle size={20} className="text-red-600 dark:text-red-400" />
                            </div>
                            <div>
                                <p className="text-sm text-[hsl(var(--muted-foreground))]">Inactive</p>
                                <p className="text-2xl font-bold">{branches.filter((b) => !b.active).length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Search */}
            <div className="flex-1 max-w-md">
                <Input
                    placeholder="Search branches..."
                    icon={<Search size={18} />}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Branches Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBranches.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-[hsl(var(--muted-foreground))]">
                        <Building2 size={48} className="mx-auto mb-2 opacity-50" />
                        No branches found
                    </div>
                ) : (
                    filteredBranches.map((branch) => (
                        <Card key={branch.id} hover>
                            <CardHeader className="pb-2">
                                <div className="flex items-start justify-between">
                                    <CardTitle className="text-lg">{branch.name}</CardTitle>
                                    <Badge variant={branch.active ? 'success' : 'secondary'}>
                                        {branch.active ? 'Active' : 'Inactive'}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {branch.city && (
                                    <div className="flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))]">
                                        <MapPin size={14} />
                                        <span>{branch.city}</span>
                                    </div>
                                )}
                                {branch.address && (
                                    <div className="flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))]">
                                        <Building2 size={14} />
                                        <span className="truncate">{branch.address}</span>
                                    </div>
                                )}
                                {branch.phone && (
                                    <div className="flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))]">
                                        <Phone size={14} />
                                        <span>{branch.phone}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2 pt-2 border-t border-[hsl(var(--border))]">
                                    <p className="text-xs text-[hsl(var(--muted-foreground))]">
                                        Created: {formatDateTime(branch.createdAt).split(',')[0]}
                                    </p>
                                </div>
                                <div className="flex gap-2 pt-2">
                                    <Button variant="outline" size="sm" className="flex-1" onClick={() => handleOpenEditDialog(branch)}>
                                        <Edit size={14} />
                                        Edit
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-red-500"
                                        onClick={() => handleDeleteBranch(branch)}
                                    >
                                        <Trash2 size={14} />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {/* Add/Edit Branch Dialog */}
            <Dialog open={showAddDialog} onClose={() => setShowAddDialog(false)}>
                <DialogHeader>
                    <DialogTitle>{editingBranch ? 'Edit Branch' : 'Add Branch'}</DialogTitle>
                    <DialogClose onClose={() => setShowAddDialog(false)} />
                </DialogHeader>
                <DialogContent>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Branch Name</label>
                            <Input
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Main Branch"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">City</label>
                                <Input
                                    icon={<MapPin size={18} />}
                                    value={formData.city}
                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                    placeholder="Mumbai"
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
                        <div>
                            <label className="block text-sm font-medium mb-2">Address</label>
                            <Input
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                placeholder="123 Main Street"
                            />
                        </div>
                    </div>
                </DialogContent>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleSaveBranch}>
                        {editingBranch ? 'Update' : 'Create'} Branch
                    </Button>
                </DialogFooter>
            </Dialog>
        </div>
    );
};
