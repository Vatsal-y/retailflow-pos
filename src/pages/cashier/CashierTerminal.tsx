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
      toast.error("User or branch information missing");
      return;
    }

    const orderData = {
      branchId: user.branchId,
      cashierId: Number(user.userId || user.id),

      items: items.map((item) => ({
        productId: Number(item.productId),
        productName: item.name,
        quantity: item.quantity,
        unitPrice: item.price,
        totalPrice: item.price * item.quantity,
      })),

      subtotal: getSubtotal(),
      discountAmount: 0,
      totalAmount: getTotal(),

      paymentMethod: method.toUpperCase(),
      notes: "",
    };

    try {
      // ✅ Step 1: Create order in backend
      await dispatch(createOrder(orderData)).unwrap();

      toast.success(`Payment Successful via ${method}`);

      // ✅ Step 2: Refresh Orders tab instantly
      dispatch(fetchOrders(user.branchId));

      // ✅ Step 3: Clear cart + close modal
      clearCart();
      setShowPayment(false);

    } catch (error: any) {
      toast.error(error || "Checkout failed");
    }
  };
