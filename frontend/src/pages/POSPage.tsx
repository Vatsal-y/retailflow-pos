import { useState, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { useAuthStore, useCartStore, useShiftStore } from '@/store';
import { productsApi, ordersApi, customersApi } from '@/api';
import { Button, Card, CardContent, Input, Badge, Dialog, DialogHeader, DialogTitle, DialogClose, DialogContent, DialogFooter, Spinner } from '@/components/ui';
import { formatCurrency, PAYMENT_METHODS } from '@/lib/utils';
import type { Product, Customer, PaymentMethod } from '@/types';
import {
    Search,
    Plus,
    Minus,
    Trash2,
    User,
    CreditCard,
    Banknote,
    Smartphone,
    Wallet,
    Receipt,
    Clock,
    AlertCircle,
    X,
    Check,
    Star,
    Gift,
} from 'lucide-react';

export const POSPage: React.FC = () => {
    const { user } = useAuthStore();
    const {
        items,
        customer,
        paymentMethod,
        subtotal,
        discountAmount,
        taxAmount,
        total,
        discountPercent,
        addItem,
        removeItem,
        updateQuantity,
        setCustomer,
        setPaymentMethod,
        clearCart,
    } = useCartStore();
    const { activeShift, startShift, checkActiveShift } = useShiftStore();

    const [products, setProducts] = useState<Product[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [processingOrder, setProcessingOrder] = useState(false);
    const [showPaymentDialog, setShowPaymentDialog] = useState(false);
    const [showCustomerDialog, setShowCustomerDialog] = useState(false);
    const [showShiftDialog, setShowShiftDialog] = useState(false);
    const [customerSearch, setCustomerSearch] = useState('');
    const [pointsToRedeem, setPointsToRedeem] = useState(0);
    const [pointsDiscount, setPointsDiscount] = useState(0);

    // Load products and check shift status
    useEffect(() => {
        const loadData = async () => {
            if (!user?.storeId) return;

            try {
                const [productsData, customersData] = await Promise.all([
                    productsApi.getProducts(user.storeId),
                    customersApi.getCustomers(user.storeId),
                ]);
                setProducts(productsData);
                setCustomers(customersData);

                if (user.id) {
                    await checkActiveShift(user.id);
                }
            } catch (error) {
                console.error('Failed to load data:', error);
                toast.error('Failed to load products');
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [user?.storeId, user?.id, checkActiveShift]);

    // Filter products based on search
    const filteredProducts = useMemo(() => {
        if (!searchQuery.trim()) return products.filter(p => p.active);
        const query = searchQuery.toLowerCase();
        return products.filter(
            (p) =>
                p.active &&
                (p.name.toLowerCase().includes(query) ||
                    p.sku?.toLowerCase().includes(query) ||
                    p.barcode?.includes(query))
        );
    }, [products, searchQuery]);

    // Filter customers based on search
    const filteredCustomers = useMemo(() => {
        if (!customerSearch.trim()) return customers;
        const query = customerSearch.toLowerCase();
        return customers.filter(
            (c) =>
                c.name.toLowerCase().includes(query) ||
                c.phone?.includes(query)
        );
    }, [customers, customerSearch]);

    // Handle adding product to cart
    const handleAddToCart = (product: Product) => {
        addItem({
            productId: product.id,
            productName: product.name,
            price: product.price,
            image: product.image,
        });
        toast.success(`${product.name} added to cart`);
    };

    // Handle checkout
    const handleCheckout = async () => {
        if (!user?.branchId || !user?.id) {
            toast.error('User session invalid');
            return;
        }

        if (!activeShift) {
            setShowShiftDialog(true);
            return;
        }

        if (items.length === 0) {
            toast.error('Cart is empty');
            return;
        }

        setProcessingOrder(true);
        try {
            const orderData = {
                branchId: user.branchId,
                cashierId: user.id,
                customerId: customer?.id || null,
                items: items.map((item) => ({
                    productId: item.productId,
                    productName: item.productName,
                    quantity: item.quantity,
                    unitPrice: item.price,
                    totalPrice: item.price * item.quantity,
                })),
                subtotal,
                discountAmount: discountAmount + pointsDiscount,
                discountPercentage: discountPercent,
                totalAmount: total - pointsDiscount,
                paymentMethod,
                pointsRedeemed: pointsToRedeem,
            };

            const order = await ordersApi.createOrder(orderData);
            toast.success(`Order ${order.orderNumber} completed!`);
            clearCart();
            setPointsToRedeem(0);
            setPointsDiscount(0);
            setShowPaymentDialog(false);
        } catch (error) {
            console.error('Order failed:', error);
            toast.error('Failed to process order');
        } finally {
            setProcessingOrder(false);
        }
    };

    // Start shift
    const handleStartShift = async () => {
        if (!user?.branchId || !user?.id) return;
        try {
            await startShift(user.branchId, user.id);
            toast.success('Shift started!');
            setShowShiftDialog(false);
        } catch {
            toast.error('Failed to start shift');
        }
    };

    const PaymentIcon = ({ method }: { method: PaymentMethod }) => {
        const icons = {
            CASH: Banknote,
            CARD: CreditCard,
            UPI: Smartphone,
            WALLET: Wallet,
        };
        const Icon = icons[method];
        return <Icon size={20} />;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <div className="flex gap-6 h-[calc(100vh-8rem)] animate-fadeIn">
            {/* Left Panel - Products */}
            <div className="flex-1 flex flex-col">
                {/* Search */}
                <div className="mb-4">
                    <Input
                        placeholder="Search products by name, SKU, or barcode..."
                        icon={<Search size={18} />}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="text-base"
                    />
                </div>

                {/* Products Grid */}
                <div className="flex-1 overflow-y-auto">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {filteredProducts.map((product) => (
                            <Card
                                key={product.id}
                                hover
                                className="cursor-pointer"
                                onClick={() => handleAddToCart(product)}
                            >
                                <CardContent className="p-4">
                                    <div className="aspect-square rounded-lg bg-[hsl(var(--muted))] mb-3 flex items-center justify-center overflow-hidden">
                                        {product.image ? (
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-3xl">📦</span>
                                        )}
                                    </div>
                                    <h3 className="font-medium text-sm truncate">{product.name}</h3>
                                    <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
                                        {product.sku || 'No SKU'}
                                    </p>
                                    <p className="font-bold text-lg mt-2 text-[hsl(var(--primary))]">
                                        {formatCurrency(product.price)}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Panel - Cart */}
            <Card className="w-96 flex flex-col">
                <div className="p-4 border-b border-[hsl(var(--border))]">
                    <div className="flex items-center justify-between">
                        <h2 className="font-bold text-lg">Shopping Cart</h2>
                        {activeShift ? (
                            <Badge variant="success" className="flex items-center gap-1">
                                <Clock size={12} />
                                Shift Active
                            </Badge>
                        ) : (
                            <Badge variant="warning" className="flex items-center gap-1">
                                <AlertCircle size={12} />
                                No Shift
                            </Badge>
                        )}
                    </div>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-[hsl(var(--muted-foreground))]">
                            <Receipt size={48} className="mb-2 opacity-50" />
                            <p>Cart is empty</p>
                            <p className="text-sm">Click products to add them</p>
                        </div>
                    ) : (
                        items.map((item) => (
                            <div
                                key={item.productId}
                                className="flex items-center gap-3 p-3 rounded-lg bg-[hsl(var(--accent))]"
                            >
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-sm truncate">{item.productName}</p>
                                    <p className="text-xs text-[hsl(var(--muted-foreground))]">
                                        {formatCurrency(item.price)} × {item.quantity}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                        className="p-1 rounded hover:bg-[hsl(var(--background))] transition-colors"
                                    >
                                        <Minus size={16} />
                                    </button>
                                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                        className="p-1 rounded hover:bg-[hsl(var(--background))] transition-colors"
                                    >
                                        <Plus size={16} />
                                    </button>
                                    <button
                                        onClick={() => removeItem(item.productId)}
                                        className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 transition-colors ml-2"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Customer Selection */}
                <div className="px-4 py-3 border-t border-[hsl(var(--border))]">
                    <button
                        onClick={() => setShowCustomerDialog(true)}
                        className="w-full flex items-center gap-3 p-3 rounded-lg border border-dashed border-[hsl(var(--border))] hover:bg-[hsl(var(--accent))] transition-colors"
                    >
                        <User size={18} className="text-[hsl(var(--muted-foreground))]" />
                        {customer ? (
                            <div className="flex-1 text-left">
                                <div className="flex items-center justify-between">
                                    <p className="font-medium text-sm">{customer.name}</p>
                                    {customer.loyaltyPoints > 0 && (
                                        <Badge variant="success" className="flex items-center gap-1">
                                            <Star size={10} />
                                            {customer.loyaltyPoints} pts
                                        </Badge>
                                    )}
                                </div>
                                <p className="text-xs text-[hsl(var(--muted-foreground))]">{customer.phone}</p>
                            </div>
                        ) : (
                            <span className="text-[hsl(var(--muted-foreground))]">Select Customer (Optional)</span>
                        )}
                    </button>

                    {/* Points Redemption */}
                    {customer && customer.loyaltyPoints > 0 && items.length > 0 && (
                        <div className="mt-3 p-3 rounded-lg bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
                            <div className="flex items-center gap-2 mb-2">
                                <Gift size={16} className="text-amber-500" />
                                <span className="text-sm font-medium">Redeem Loyalty Points</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="range"
                                    min="0"
                                    max={Math.min(customer.loyaltyPoints, Math.floor(subtotal))}
                                    value={pointsToRedeem}
                                    onChange={(e) => {
                                        const pts = parseInt(e.target.value);
                                        setPointsToRedeem(pts);
                                        setPointsDiscount(pts); // 1 point = ₹1
                                    }}
                                    className="flex-1 h-2 rounded-lg appearance-none cursor-pointer bg-amber-200 dark:bg-amber-800"
                                />
                                <span className="text-sm font-bold text-amber-600 w-16 text-right">{pointsToRedeem} pts</span>
                            </div>
                            {pointsToRedeem > 0 && (
                                <p className="text-xs text-amber-600 mt-1">Discount: {formatCurrency(pointsDiscount)}</p>
                            )}
                        </div>
                    )}
                </div>

                {/* Totals */}
                <div className="p-4 border-t border-[hsl(var(--border))] space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-[hsl(var(--muted-foreground))]">Subtotal</span>
                        <span>{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-[hsl(var(--muted-foreground))]">Discount</span>
                        <span className="text-red-500">-{formatCurrency(discountAmount + pointsDiscount)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-[hsl(var(--muted-foreground))]">Tax (18%)</span>
                        <span>{formatCurrency(taxAmount)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold pt-2 border-t border-[hsl(var(--border))]">
                        <span>Total</span>
                        <span className="text-[hsl(var(--primary))]">{formatCurrency(total - pointsDiscount)}</span>
                    </div>
                </div>

                {/* Actions */}
                <div className="p-4 pt-0 flex gap-2">
                    <Button
                        variant="outline"
                        className="flex-1"
                        onClick={clearCart}
                        disabled={items.length === 0}
                    >
                        <Trash2 size={18} />
                        Clear
                    </Button>
                    <Button
                        className="flex-1"
                        onClick={() => setShowPaymentDialog(true)}
                        disabled={items.length === 0}
                    >
                        <CreditCard size={18} />
                        Pay {formatCurrency(total - pointsDiscount)}
                    </Button>
                </div>
            </Card>

            {/* Payment Dialog */}
            <Dialog open={showPaymentDialog} onClose={() => setShowPaymentDialog(false)}>
                <DialogHeader>
                    <DialogTitle>Complete Payment</DialogTitle>
                    <DialogClose onClose={() => setShowPaymentDialog(false)} />
                </DialogHeader>
                <DialogContent>
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm text-[hsl(var(--muted-foreground))] mb-3">
                                Select Payment Method
                            </p>
                            <div className="grid grid-cols-2 gap-3">
                                {(Object.keys(PAYMENT_METHODS) as PaymentMethod[]).map((method) => (
                                    <button
                                        key={method}
                                        onClick={() => setPaymentMethod(method)}
                                        className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${paymentMethod === method
                                            ? 'border-[hsl(var(--primary))] bg-[hsl(var(--primary)/0.1)]'
                                            : 'border-[hsl(var(--border))] hover:border-[hsl(var(--primary)/0.5)]'
                                            }`}
                                    >
                                        <PaymentIcon method={method} />
                                        <span className="font-medium">{PAYMENT_METHODS[method].label}</span>
                                        {paymentMethod === method && (
                                            <Check size={18} className="ml-auto text-[hsl(var(--primary))]" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="p-4 rounded-lg bg-[hsl(var(--accent))]">
                            <div className="flex justify-between text-lg font-bold">
                                <span>Amount Due</span>
                                <span className="text-[hsl(var(--primary))]">{formatCurrency(total - pointsDiscount)}</span>
                            </div>
                        </div>
                    </div>
                </DialogContent>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleCheckout} isLoading={processingOrder}>
                        <Check size={18} />
                        Complete Order
                    </Button>
                </DialogFooter>
            </Dialog>

            {/* Customer Selection Dialog */}
            <Dialog open={showCustomerDialog} onClose={() => setShowCustomerDialog(false)}>
                <DialogHeader>
                    <DialogTitle>Select Customer</DialogTitle>
                    <DialogClose onClose={() => setShowCustomerDialog(false)} />
                </DialogHeader>
                <DialogContent>
                    <Input
                        placeholder="Search by name or phone..."
                        icon={<Search size={18} />}
                        value={customerSearch}
                        onChange={(e) => setCustomerSearch(e.target.value)}
                        className="mb-4"
                    />
                    <div className="max-h-64 overflow-y-auto space-y-2">
                        {customer && (
                            <button
                                onClick={() => {
                                    setCustomer(null);
                                    setShowCustomerDialog(false);
                                }}
                                className="w-full flex items-center gap-3 p-3 rounded-lg bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/40 transition-colors"
                            >
                                <X size={18} />
                                Remove Selected Customer
                            </button>
                        )}
                        {filteredCustomers.map((c) => (
                            <button
                                key={c.id}
                                onClick={() => {
                                    setCustomer(c);
                                    setShowCustomerDialog(false);
                                    setCustomerSearch('');
                                }}
                                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left ${customer?.id === c.id
                                    ? 'bg-[hsl(var(--primary)/0.1)] border border-[hsl(var(--primary))]'
                                    : 'hover:bg-[hsl(var(--accent))]'
                                    }`}
                            >
                                <div className="h-10 w-10 rounded-full bg-[hsl(var(--muted))] flex items-center justify-center">
                                    <User size={18} />
                                </div>
                                <div>
                                    <p className="font-medium">{c.name}</p>
                                    <p className="text-sm text-[hsl(var(--muted-foreground))]">{c.phone || 'No phone'}</p>
                                </div>
                                {c.loyaltyPoints > 0 && (
                                    <Badge variant="success" className="ml-auto">
                                        {c.loyaltyPoints} pts
                                    </Badge>
                                )}
                            </button>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Start Shift Dialog */}
            <Dialog open={showShiftDialog} onClose={() => setShowShiftDialog(false)}>
                <DialogHeader>
                    <DialogTitle>Start Your Shift</DialogTitle>
                    <DialogClose onClose={() => setShowShiftDialog(false)} />
                </DialogHeader>
                <DialogContent>
                    <div className="text-center py-4">
                        <Clock size={48} className="mx-auto mb-4 text-[hsl(var(--primary))]" />
                        <p className="text-[hsl(var(--muted-foreground))]">
                            You need to start a shift before processing orders. This helps track your sales and cash.
                        </p>
                    </div>
                </DialogContent>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setShowShiftDialog(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleStartShift}>
                        <Clock size={18} />
                        Start Shift
                    </Button>
                </DialogFooter>
            </Dialog>
        </div>
    );
};
