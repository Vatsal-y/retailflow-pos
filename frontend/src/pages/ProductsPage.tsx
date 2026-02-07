import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuthStore } from '@/store';
import { productsApi } from '@/api';
import { Card, CardContent, Button, Input, Badge, Skeleton, Dialog, DialogHeader, DialogTitle, DialogClose, DialogContent, DialogFooter } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';
import type { Product, Category, ProductRequest, Inventory } from '@/types';
import { Search, Plus, Package, Edit, Trash2, AlertTriangle, XCircle, Warehouse } from 'lucide-react';

interface ProductFormData {
    name: string;
    sku: string;
    price: string;
    costPrice: string;
    barcode: string;
    categoryId: string;
    description: string;
}

export const ProductsPage: React.FC = () => {
    const { user } = useAuthStore();
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [inventory, setInventory] = useState<Inventory[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<number | null>(null);
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [formData, setFormData] = useState<ProductFormData>({
        name: '',
        sku: '',
        price: '',
        costPrice: '',
        barcode: '',
        categoryId: '',
        description: '',
    });
    const [saving, setSaving] = useState(false);
    const [stockProduct, setStockProduct] = useState<Product | null>(null);
    const [branchStock, setBranchStock] = useState<{ inventoryId: number; branchId: number; branchName: string; quantity: number; reorderLevel: number }[]>([]);
    const [loadingStock, setLoadingStock] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!user?.storeId) return;
            try {
                const [productsData, categoriesData] = await Promise.all([
                    productsApi.getProducts(user.storeId),
                    productsApi.getCategories(user.storeId),
                ]);
                setProducts(productsData);
                setCategories(categoriesData);

                // Fetch inventory if user has branchId
                if (user?.branchId) {
                    try {
                        const inventoryData = await productsApi.getInventory(user.branchId);
                        setInventory(inventoryData);
                    } catch {
                        console.warn('Could not fetch inventory');
                    }
                }
            } catch (error) {
                console.error('Failed to fetch products:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user?.storeId, user?.branchId]);

    const getProductStock = (productId: number): number | undefined => {
        const inv = inventory.find(i => i.productId === productId);
        return inv?.quantity;
    };

    const isLowStock = (productId: number): boolean => {
        const inv = inventory.find(i => i.productId === productId);
        return inv ? inv.quantity <= (inv.reorderLevel || 10) && inv.quantity > 0 : false;
    };

    const isOutOfStock = (productId: number): boolean => {
        const inv = inventory.find(i => i.productId === productId);
        return inv ? inv.quantity === 0 : false;
    };

    const viewProductStock = async (product: Product) => {
        setStockProduct(product);
        setLoadingStock(true);
        try {
            const data = await productsApi.getProductInventory(product.id);
            setBranchStock(data);
        } catch {
            toast.error('Failed to load stock data');
            setBranchStock([]);
        } finally {
            setLoadingStock(false);
        }
    };

    const filteredProducts = products.filter((product) => {
        const matchesSearch =
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.sku?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = !categoryFilter || product.categoryId === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this product?')) return;
        try {
            await productsApi.deleteProduct(id);
            setProducts(products.filter((p) => p.id !== id));
            toast.success('Product deleted');
        } catch {
            toast.error('Failed to delete product');
        }
    };

    const openAddDialog = () => {
        setEditingProduct(null);
        setFormData({
            name: '',
            sku: '',
            price: '',
            costPrice: '',
            barcode: '',
            categoryId: categories.length > 0 ? categories[0].id.toString() : '',
            description: '',
        });
        setShowAddDialog(true);
    };

    const openEditDialog = (product: Product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            sku: product.sku || '',
            price: product.price?.toString() || '',
            costPrice: product.costPrice?.toString() || '',
            barcode: product.barcode || '',
            categoryId: product.categoryId?.toString() || '',
            description: product.description || '',
        });
        setShowAddDialog(true);
    };

    const closeDialog = () => {
        setShowAddDialog(false);
        setEditingProduct(null);
    };

    const handleSave = async () => {
        if (!user?.storeId || !formData.name || !formData.price) {
            toast.error('Please fill in all required fields');
            return;
        }
        setSaving(true);
        try {
            const productData: ProductRequest = {
                storeId: user.storeId,
                categoryId: formData.categoryId ? parseInt(formData.categoryId) : undefined,
                name: formData.name,
                sku: formData.sku || undefined,
                barcode: formData.barcode || undefined,
                description: formData.description || undefined,
                price: parseFloat(formData.price),
                costPrice: formData.costPrice ? parseFloat(formData.costPrice) : undefined,
                unit: 'PIECE',
                active: true,
            };

            if (editingProduct) {
                const updated = await productsApi.updateProduct(editingProduct.id, productData);
                setProducts(products.map((p) => (p.id === updated.id ? updated : p)));
                toast.success('Product updated');
            } else {
                const created = await productsApi.createProduct(productData);
                setProducts([...products, created]);
                toast.success('Product created');
            }
            closeDialog();
        } catch (error) {
            console.error('Failed to save product:', error);
            toast.error('Failed to save product');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <Skeleton key={i} className="h-64" />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Products</h1>
                    <p className="text-[hsl(var(--muted-foreground))]">Manage your product catalog</p>
                </div>
                <Button onClick={openAddDialog}>
                    <Plus size={18} />
                    Add Product
                </Button>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                    <Input
                        placeholder="Search products..."
                        icon={<Search size={18} />}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2">
                    <Button
                        variant={!categoryFilter ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setCategoryFilter(null)}
                    >
                        All
                    </Button>
                    {categories.map((cat) => (
                        <Button
                            key={cat.id}
                            variant={categoryFilter === cat.id ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setCategoryFilter(cat.id)}
                        >
                            {cat.name}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-[hsl(var(--muted-foreground))]">
                        <Package size={48} className="mx-auto mb-2 opacity-50" />
                        No products found
                    </div>
                ) : (
                    filteredProducts.map((product) => (
                        <Card
                            key={product.id}
                            hover
                            className={`transition-all ${isOutOfStock(product.id)
                                    ? 'ring-2 ring-red-500 ring-offset-2 ring-offset-[hsl(var(--background))]'
                                    : isLowStock(product.id)
                                        ? 'ring-2 ring-amber-500 ring-offset-2 ring-offset-[hsl(var(--background))]'
                                        : ''
                                }`}
                        >
                            <CardContent className="p-0">
                                <div className="aspect-video bg-[hsl(var(--muted))] rounded-t-xl flex items-center justify-center">
                                    {product.image ? (
                                        <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-t-xl" />
                                    ) : (
                                        <Package size={48} className="text-[hsl(var(--muted-foreground))] opacity-50" />
                                    )}
                                </div>
                                <div className="p-4">
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <h3 className="font-semibold">{product.name}</h3>
                                            <p className="text-sm text-[hsl(var(--muted-foreground))]">{product.sku || 'No SKU'}</p>
                                        </div>
                                        {!product.active && <Badge variant="destructive">Inactive</Badge>}
                                    </div>
                                    <p className="text-2xl font-bold text-[hsl(var(--primary))] mb-2">
                                        {formatCurrency(product.price)}
                                    </p>

                                    {/* Stock Display */}
                                    {inventory.length > 0 && (
                                        <div className="mb-3">
                                            {isOutOfStock(product.id) ? (
                                                <Badge variant="destructive" className="flex items-center gap-1 w-fit">
                                                    <XCircle size={12} />
                                                    Out of Stock
                                                </Badge>
                                            ) : isLowStock(product.id) ? (
                                                <Badge variant="warning" className="flex items-center gap-1 w-fit">
                                                    <AlertTriangle size={12} />
                                                    Low Stock: {getProductStock(product.id)}
                                                </Badge>
                                            ) : getProductStock(product.id) !== undefined ? (
                                                <Badge variant="secondary">
                                                    Stock: {getProductStock(product.id)}
                                                </Badge>
                                            ) : null}
                                        </div>
                                    )}

                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" className="flex-1" onClick={() => viewProductStock(product)}>
                                            <Warehouse size={14} />
                                            Stock
                                        </Button>
                                        <Button variant="ghost" size="sm" onClick={() => openEditDialog(product)}>
                                            <Edit size={14} />
                                        </Button>
                                        <Button variant="ghost" size="sm" className="text-red-500" onClick={() => handleDelete(product.id)}>
                                            <Trash2 size={14} />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {/* Product Form Dialog */}
            <Dialog open={showAddDialog} onClose={closeDialog}>
                <DialogHeader>
                    <DialogTitle>{editingProduct ? 'Edit Product' : 'Add Product'}</DialogTitle>
                    <DialogClose onClose={closeDialog} />
                </DialogHeader>
                <DialogContent>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Product Name *</label>
                            <Input
                                placeholder="Product Name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">SKU</label>
                                <Input
                                    placeholder="SKU"
                                    value={formData.sku}
                                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Barcode</label>
                                <Input
                                    placeholder="Barcode"
                                    value={formData.barcode}
                                    onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Price (₹) *</label>
                                <Input
                                    placeholder="0.00"
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Cost Price (₹)</label>
                                <Input
                                    placeholder="0.00"
                                    type="number"
                                    value={formData.costPrice}
                                    onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Category</label>
                            <select
                                value={formData.categoryId}
                                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))/0.3]"
                            >
                                <option value="">Select Category</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Description</label>
                            <Input
                                placeholder="Product description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                    </div>
                </DialogContent>
                <DialogFooter>
                    <Button variant="outline" onClick={closeDialog}>Cancel</Button>
                    <Button onClick={handleSave} isLoading={saving} disabled={!formData.name || !formData.price}>
                        {editingProduct ? 'Update' : 'Create'} Product
                    </Button>
                </DialogFooter>
            </Dialog>

            {/* Stock View Dialog */}
            <Dialog open={!!stockProduct} onClose={() => setStockProduct(null)}>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Warehouse size={20} />
                        Stock Levels - {stockProduct?.name}
                    </DialogTitle>
                    <DialogClose onClose={() => setStockProduct(null)} />
                </DialogHeader>
                <DialogContent>
                    {loadingStock ? (
                        <div className="space-y-3">
                            {[1, 2, 3].map(i => <Skeleton key={i} className="h-14" />)}
                        </div>
                    ) : branchStock.length === 0 ? (
                        <div className="text-center py-8 text-[hsl(var(--muted-foreground))]">
                            <Package size={48} className="mx-auto mb-2 opacity-50" />
                            No inventory records found
                        </div>
                    ) : (
                        <div className="space-y-3 max-h-[400px] overflow-y-auto">
                            {branchStock.map(item => (
                                <div key={item.inventoryId} className="flex items-center justify-between p-3 rounded-lg bg-[hsl(var(--accent))]">
                                    <div>
                                        <p className="font-medium">{item.branchName}</p>
                                        <p className="text-sm text-[hsl(var(--muted-foreground))]">
                                            Reorder at: {item.reorderLevel}
                                        </p>
                                    </div>
                                    <Badge variant={item.quantity === 0 ? 'destructive' : item.quantity <= item.reorderLevel ? 'warning' : 'success'}>
                                        {item.quantity} units
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    )}
                </DialogContent>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setStockProduct(null)}>Close</Button>
                </DialogFooter>
            </Dialog>
        </div >
    );
};
