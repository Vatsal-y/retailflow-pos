import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Search, User, Trash2, Plus, Minus, CreditCard, Banknote, Smartphone, Wallet, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { useCartStore } from "@/store/cartStore";
import { mockCategories } from "@/data/mockData";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchProducts } from "@/store/slices/productSlice";
import { createOrder } from "@/store/slices/orderSlice";

export default function CashierTerminal() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  const dispatch = useDispatch<AppDispatch>();
  const { products, isLoading, error } = useSelector((state: RootState) => state.product);
  const { user } = useSelector((state: RootState) => state.auth);
  const { isLoading: orderLoading } = useSelector((state: RootState) => state.order);

  const { items, addItem, removeItem, incrementQuantity, decrementQuantity, clearCart, getSubtotal, getTax, getTotal, getItemCount } = useCartStore();

  useEffect(() => {
    if (user?.storeId) {
      dispatch(fetchProducts(user.storeId));
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.barcode && product.barcode.includes(searchQuery));
    const matchesCategory = !selectedCategory || product.categoryId === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "F1") {
        e.preventDefault();
        searchRef.current?.focus();
      } else if (e.key === "F3" && items.length > 0) {
        e.preventDefault();
        setShowPayment(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [items.length]);

  const handleAddToCart = (product: any) => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      sku: product.sku,
    });
    toast.success(`Added ${product.name}`);
  };

  const handleCheckout = async (method: string) => {
    if (!user || !user.branchId) {
      toast.error('User or branch information missing');
      return;
    }

    const orderData = {
      branchId: user.branchId,
      cashierId: parseInt(user.id),
      items: items.map(item => ({
        productId: parseInt(item.productId),
        productName: item.name,
        quantity: item.quantity,
        unitPrice: item.price,
        totalPrice: item.price * item.quantity,
      })),
      subtotal: getSubtotal(),
      discountAmount: 0,
      discountPercentage: 0,
      totalAmount: getTotal(),
      paymentMethod: method.toUpperCase(),
      notes: '',
    };

    try {
      await dispatch(createOrder(orderData)).unwrap();
      toast.success(`Payment of ₹${getTotal().toFixed(2)} via ${method} successful!`);
      clearCart();
      setShowPayment(false);
    } catch (error: any) {
      toast.error(error || 'Failed to create order');
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar role="cashier" />

      <main className="flex-1 md:ml-60 transition-all duration-300">
        <div className="flex flex-col lg:flex-row h-screen">
          {/* Products Section */}
          <div className="flex-1 flex flex-col p-4 lg:p-6 overflow-hidden">
            {/* Search & Categories */}
            <div className="space-y-4 mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  ref={searchRef}
                  placeholder="Search products or scan barcode (F1)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 text-base"
                />
              </div>

              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                <Button
                  variant={selectedCategory === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(null)}
                >
                  All
                </Button>
                {mockCategories.map((cat) => (
                  <Button
                    key={cat.id}
                    variant={selectedCategory === cat.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(cat.id)}
                    className="whitespace-nowrap"
                  >
                    {cat.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Products Grid */}
            <div className="flex-1 overflow-y-auto scrollbar-thin">
              {isLoading ? (
                <div className="h-full flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredProducts.map((product) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card
                        variant="pos"
                        className="p-3"
                        onClick={() => handleAddToCart(product)}
                      >
                        <div className="aspect-square rounded-lg overflow-hidden bg-muted mb-3">
                          {product.image ? (
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                              No Image
                            </div>
                          )}
                        </div>
                        <h3 className="font-medium text-sm line-clamp-2 mb-1">{product.name}</h3>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-primary">${product.price.toFixed(2)}</span>
                          {product.stock <= product.lowStockThreshold && (
                            <Badge variant="lowStock">Low</Badge>
                          )}
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                  {filteredProducts.length === 0 && !isLoading && (
                    <div className="col-span-full h-40 flex items-center justify-center text-muted-foreground">
                      No products found.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Cart Section */}
          <div className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l bg-card flex flex-col">
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold">Cart</h2>
                <Badge variant="secondary">{getItemCount()}</Badge>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-1">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Customer</span>
                </Button>
                <Button variant="ghost" size="sm" onClick={clearCart} disabled={items.length === 0}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
              {items.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p>Cart is empty</p>
                  <p className="text-sm">Add products to get started</p>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex items-center gap-3 p-3 rounded-lg border bg-background"
                  >
                    {item.image && (
                      <img src={item.image} alt={item.name} className="w-12 h-12 rounded object-cover" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{item.name}</p>
                      <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="outline" size="iconSm" onClick={() => decrementQuantity(item.id)}>
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <Button variant="outline" size="iconSm" onClick={() => incrementQuantity(item.id)}>
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <p className="font-semibold w-16 text-right">${(item.price * item.quantity).toFixed(2)}</p>
                    <Button variant="ghost" size="iconSm" onClick={() => removeItem(item.id)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </motion.div>
                ))
              )}
            </div>

            <div className="p-4 border-t space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${getSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax (8%)</span>
                  <span>${getTax().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Total</span>
                  <span className="text-primary">${getTotal().toFixed(2)}</span>
                </div>
              </div>
              <Button
                variant="posSuccess"
                size="xl"
                className="w-full"
                disabled={items.length === 0}
                onClick={() => setShowPayment(true)}
              >
                Checkout (F3)
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Payment Modal */}
      {showPayment && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-xl shadow-xl max-w-md w-full p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Payment</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowPayment(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="text-center mb-6">
              <p className="text-muted-foreground">Total Amount</p>
              <p className="text-4xl font-bold text-primary">${getTotal().toFixed(2)}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="pos" size="lg" className="gap-2" onClick={() => handleCheckout("Cash")}>
                <Banknote className="h-5 w-5" /> Cash
              </Button>
              <Button variant="pos" size="lg" className="gap-2" onClick={() => handleCheckout("Card")}>
                <CreditCard className="h-5 w-5" /> Card
              </Button>
              <Button variant="pos" size="lg" className="gap-2" onClick={() => handleCheckout("UPI")}>
                <Smartphone className="h-5 w-5" /> UPI
              </Button>
              <Button variant="pos" size="lg" className="gap-2" onClick={() => handleCheckout("Wallet")}>
                <Wallet className="h-5 w-5" /> Wallet
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
