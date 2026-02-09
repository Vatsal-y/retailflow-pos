import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuthStore } from '@/store';
import { storesApi } from '@/api';
import {
    Card,
    CardContent,
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
import { formatDateTime, ROLE_DISPLAY_NAMES } from '@/lib/utils';
import type { Employee, Branch } from '@/types';
import { Search, Plus, Users, Edit, Trash2, UserCheck, UserX, Mail, Phone } from 'lucide-react';

const EMPLOYEE_STATUS_COLORS = {
    ACTIVE: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    ON_LEAVE: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    TERMINATED: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

export const EmployeesPage: React.FC = () => {
    const { user } = useAuthStore();
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'ON_LEAVE' | 'TERMINATED'>('ALL');
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        position: '',
        salary: '',
        branchId: '',
    });

    useEffect(() => {
        const fetchData = async () => {
            if (!user?.storeId) return;
            try {
                // Fetch all branches for the store
                const branchesData = await storesApi.getBranches(user.storeId);
                setBranches(branchesData);

                // Fetch employees for all branches (or just user's branch if branch manager)
                if (user.branchId) {
                    const employeesData = await storesApi.getEmployees(user.branchId);
                    setEmployees(employeesData);
                } else {
                    // Store admin - fetch from all branches
                    const allEmployees: Employee[] = [];
                    for (const branch of branchesData) {
                        try {
                            const branchEmployees = await storesApi.getEmployees(branch.id);
                            allEmployees.push(...branchEmployees);
                        } catch {
                            console.warn(`Could not fetch employees for branch ${branch.id}`);
                        }
                    }
                    setEmployees(allEmployees);
                }
            } catch (error) {
                console.error('Failed to fetch employees:', error);
                toast.error('Failed to load employees');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user?.storeId, user?.branchId]);

    const filteredEmployees = employees.filter((emp) => {
        const matchesSearch =
            emp.user?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            emp.user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            emp.position.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'ALL' || emp.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleOpenAddDialog = () => {
        setFormData({
            fullName: '',
            email: '',
            phone: '',
            position: '',
            salary: '',
            branchId: user?.branchId?.toString() || '',
        });
        setEditingEmployee(null);
        setShowAddDialog(true);
    };

    const handleOpenEditDialog = (emp: Employee) => {
        setFormData({
            fullName: emp.user?.fullName || '',
            email: emp.user?.email || '',
            phone: '',
            position: emp.position,
            salary: emp.salary?.toString() || '',
            branchId: emp.branchId.toString(),
        });
        setEditingEmployee(emp);
        setShowAddDialog(true);
    };

    const handleSaveEmployee = async () => {
        try {
            if (editingEmployee) {
                await storesApi.updateEmployee(editingEmployee.id, {
                    position: formData.position,
                    salary: formData.salary ? parseFloat(formData.salary) : undefined,
                    branchId: parseInt(formData.branchId),
                });
                toast.success('Employee updated successfully');
            } else {
                // Validate required fields for new employee
                if (!formData.email || !formData.fullName || !formData.branchId) {
                    toast.error('Please fill in all required fields (Name, Email, Branch)');
                    return;
                }

                // First, register the user account
                const registerData = {
                    email: formData.email,
                    password: 'TempPass123!', // Default password - user should change it
                    fullName: formData.fullName,
                    phone: formData.phone || undefined,
                    role: 'CASHIER' as const, // Default role for new employees
                    storeId: user?.storeId || undefined,
                    branchId: parseInt(formData.branchId),
                };

                const authResponse = await import('@/api').then(m => m.authApi.register(registerData));

                // Then create the employee record
                await storesApi.createEmployee({
                    branchId: parseInt(formData.branchId),
                    userId: authResponse.userId,
                    position: formData.position || 'Cashier',
                    salary: formData.salary ? parseFloat(formData.salary) : undefined,
                    hireDate: new Date().toISOString().split('T')[0],
                    status: 'ACTIVE',
                });

                toast.success('Employee created successfully! Default password is TempPass123!');
            }
            setShowAddDialog(false);

            // Refresh data - handle both branch manager and store admin
            if (user?.branchId) {
                const employeesData = await storesApi.getEmployees(user.branchId);
                setEmployees(employeesData);
            } else if (user?.storeId && branches.length > 0) {
                // Store Admin - refresh from all branches
                const allEmployees: Employee[] = [];
                for (const branch of branches) {
                    try {
                        const branchEmployees = await storesApi.getEmployees(branch.id);
                        allEmployees.push(...branchEmployees);
                    } catch {
                        console.warn(`Could not fetch employees for branch ${branch.id}`);
                    }
                }
                setEmployees(allEmployees);
            }
        } catch (error) {
            console.error('Failed to save employee:', error);
            toast.error('Failed to save employee');
        }
    };

    const getBranchName = (branchId: number) => {
        const branch = branches.find((b) => b.id === branchId);
        return branch?.name || 'Unknown Branch';
    };

    const handleDeleteEmployee = async (emp: Employee) => {
        if (!confirm(`Are you sure you want to delete ${emp.user?.fullName || 'this employee'}?`)) {
            return;
        }
        try {
            await storesApi.deleteEmployee(emp.id);
            setEmployees(employees.filter((e) => e.id !== emp.id));
            toast.success('Employee deleted successfully');
        } catch (error) {
            console.error('Failed to delete employee:', error);
            toast.error('Failed to delete employee');
        }
    };

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
                    <h1 className="text-2xl font-bold">Employees</h1>
                    <p className="text-[hsl(var(--muted-foreground))]">Manage your team members</p>
                </div>
                <Button onClick={handleOpenAddDialog}>
                    <Plus size={18} />
                    Add Employee
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                                <Users size={20} className="text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <p className="text-sm text-[hsl(var(--muted-foreground))]">Total</p>
                                <p className="text-2xl font-bold">{employees.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                                <UserCheck size={20} className="text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div>
                                <p className="text-sm text-[hsl(var(--muted-foreground))]">Active</p>
                                <p className="text-2xl font-bold">{employees.filter((e) => e.status === 'ACTIVE').length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                                <UserX size={20} className="text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                                <p className="text-sm text-[hsl(var(--muted-foreground))]">On Leave</p>
                                <p className="text-2xl font-bold">{employees.filter((e) => e.status === 'ON_LEAVE').length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                                <Users size={20} className="text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                                <p className="text-sm text-[hsl(var(--muted-foreground))]">Branches</p>
                                <p className="text-2xl font-bold">{branches.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                    <Input
                        placeholder="Search by name, email, or position..."
                        icon={<Search size={18} />}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    {(['ALL', 'ACTIVE', 'ON_LEAVE', 'TERMINATED'] as const).map((status) => (
                        <Button
                            key={status}
                            variant={statusFilter === status ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setStatusFilter(status)}
                        >
                            {status === 'ALL' ? 'All' : status === 'ON_LEAVE' ? 'On Leave' : status.charAt(0) + status.slice(1).toLowerCase()}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Employees Table */}
            <Card>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-[hsl(var(--border))]">
                                    <th className="text-left p-4 font-medium text-[hsl(var(--muted-foreground))]">Employee</th>
                                    <th className="text-left p-4 font-medium text-[hsl(var(--muted-foreground))]">Position</th>
                                    <th className="text-left p-4 font-medium text-[hsl(var(--muted-foreground))]">Branch</th>
                                    <th className="text-left p-4 font-medium text-[hsl(var(--muted-foreground))]">Hire Date</th>
                                    <th className="text-left p-4 font-medium text-[hsl(var(--muted-foreground))]">Status</th>
                                    <th className="text-right p-4 font-medium text-[hsl(var(--muted-foreground))]">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredEmployees.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="text-center py-12 text-[hsl(var(--muted-foreground))]">
                                            <Users size={48} className="mx-auto mb-2 opacity-50" />
                                            No employees found
                                        </td>
                                    </tr>
                                ) : (
                                    filteredEmployees.map((emp) => (
                                        <tr key={emp.id} className="border-b border-[hsl(var(--border))] hover:bg-[hsl(var(--accent)/0.5)] transition-colors">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-medium">
                                                        {emp.user?.fullName?.charAt(0) || 'E'}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">{emp.user?.fullName || 'Unknown'}</p>
                                                        <p className="text-sm text-[hsl(var(--muted-foreground))]">{emp.user?.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <p className="font-medium">{emp.position}</p>
                                                <p className="text-sm text-[hsl(var(--muted-foreground))]">
                                                    {emp.user?.role ? ROLE_DISPLAY_NAMES[emp.user.role as keyof typeof ROLE_DISPLAY_NAMES] || emp.user.role : ''}
                                                </p>
                                            </td>
                                            <td className="p-4">
                                                <Badge variant="secondary">{getBranchName(emp.branchId)}</Badge>
                                            </td>
                                            <td className="p-4 text-sm">{formatDateTime(emp.hireDate).split(',')[0]}</td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${EMPLOYEE_STATUS_COLORS[emp.status]}`}>
                                                    {emp.status === 'ON_LEAVE' ? 'On Leave' : emp.status.charAt(0) + emp.status.slice(1).toLowerCase()}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button variant="ghost" size="sm" onClick={() => handleOpenEditDialog(emp)}>
                                                        <Edit size={16} />
                                                    </Button>
                                                    <Button variant="ghost" size="sm" className="text-red-500" onClick={() => handleDeleteEmployee(emp)}>
                                                        <Trash2 size={16} />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Add/Edit Employee Dialog */}
            <Dialog open={showAddDialog} onClose={() => setShowAddDialog(false)}>
                <DialogHeader>
                    <DialogTitle>{editingEmployee ? 'Edit Employee' : 'Add Employee'}</DialogTitle>
                    <DialogClose onClose={() => setShowAddDialog(false)} />
                </DialogHeader>
                <DialogContent>
                    <div className="space-y-4">
                        {!editingEmployee && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Full Name</label>
                                    <Input
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Email</label>
                                        <Input
                                            icon={<Mail size={18} />}
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            placeholder="john@example.com"
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
                            </>
                        )}

                        {/* Login Credentials - Show when editing */}
                        {editingEmployee && editingEmployee.user && (
                            <div className="p-4 rounded-lg bg-[hsl(var(--accent))] border border-[hsl(var(--border))]">
                                <h4 className="font-medium mb-3 flex items-center gap-2">
                                    <Mail size={16} />
                                    Login Credentials
                                </h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-[hsl(var(--muted-foreground))]">Name:</span>
                                        <span className="font-medium">{editingEmployee.user.fullName}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[hsl(var(--muted-foreground))]">Email:</span>
                                        <span className="font-medium">{editingEmployee.user.email}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[hsl(var(--muted-foreground))]">Role:</span>
                                        <span className="font-medium">{editingEmployee.user.role}</span>
                                    </div>
                                    <div className="mt-3 pt-3 border-t border-[hsl(var(--border))]">
                                        <p className="text-xs text-[hsl(var(--muted-foreground))]">
                                            Default password: <span className="font-mono bg-[hsl(var(--background))] px-1 py-0.5 rounded">TempPass123!</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Position</label>
                                <Input
                                    value={formData.position}
                                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                                    placeholder="Cashier, Manager, etc."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Salary (₹)</label>
                                <Input
                                    type="number"
                                    value={formData.salary}
                                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                                    placeholder="25000"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Branch</label>
                            <select
                                value={formData.branchId}
                                onChange={(e) => setFormData({ ...formData, branchId: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))/0.3]"
                            >
                                <option value="">Select Branch</option>
                                {branches.map((branch) => (
                                    <option key={branch.id} value={branch.id}>
                                        {branch.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </DialogContent>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleSaveEmployee}>
                        {editingEmployee ? 'Update' : 'Add'} Employee
                    </Button>
                </DialogFooter>
            </Dialog>
        </div>
    );
};
