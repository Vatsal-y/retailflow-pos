import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Download,
  Eye,
  X,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Skeleton } from "@/components/ui/skeleton";
import { AppSidebar } from "@/components/layout/AppSidebar";

import { Order, OrderStatus, PaymentMethod } from "@/store/slices/orderSlice";
import { format, subDays, isAfter, parseISO } from "date-fns";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchOrders } from "@/store/slices/orderSlice";

import toast from "react-hot-toast";

const ITEMS_PER_PAGE = 25;

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("7");
  const [paymentFilter, setPaymentFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { orders, isLoading, error } = useSelector(
    (state: RootState) => state.order
  );

  /* ✅ Fetch Orders */
  useEffect(() => {
    if (user?.branchId) {
      dispatch(fetchOrders(user.branchId));
    }
  }, [dispatch, user]);

  /* ✅ Show Error Toast */
  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  /* ✅ Filtering */
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Search filter
      const matchesSearch =
        order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (order.customerId &&
          `Customer #${order.customerId}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase()));

      // Status filter
      const matchesStatus =
        statusFilter === "all" || order.status === statusFilter;

      // Payment filter
      const matchesPayment =
        paymentFilter === "all" || order.paymentMethod === paymentFilter;

      // Date filter
      let matchesDate = true;
      if (dateFilter !== "all") {
        const orderDate = parseISO(order.createdAt);
        const daysAgo = parseInt(dateFilter);
        const startDate = subDays(new Date(), daysAgo);
        matchesDate = isAfter(orderDate, startDate);
      }

      return matchesSearch && matchesStatus && matchesPayment && matchesDate;
    });
  }, [orders, searchQuery, statusFilter, dateFilter, paymentFilter]);

  /* Pagination */
  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  /* Export CSV */
  const exportToCSV = () => {
    const headers = [
      "Order#",
      "Date",
      "Customer",
      "Items",
      "Total",
      "Payment",
      "Status",
    ];

    const rows = filteredOrders.map((order) => [
      order.orderNumber,
      format(parseISO(order.createdAt), "yyyy-MM-dd HH:mm"),
      order.customerId ? `Customer #${order.customerId}` : "Walk-in",
      order.items.length,
      order.totalAmount.toFixed(2),
      order.paymentMethod,
      order.status,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `orders-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();

    window.URL.revokeObjectURL(url);
  };

  /* Status Badge Variant */
  const getStatusVariant = (status: OrderStatus) => {
    switch (status) {
      case "COMPLETED":
        return "success";
      case "PENDING":
        return "warning";
      case "REFUNDED":
        return "destructive";
      case "CANCELLED":
        return "secondary";
      default:
        return "default";
    }
  };

  /* Payment Icons */
  const getPaymentIcon = (method: PaymentMethod) => {
    switch (method) {
      case "CASH":
        return "💵";
      case "CARD":
        return "💳";
      case "UPI":
        return "📱";
      case "WALLET":
        return "👛";
      default:
        return "💰";
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar role="cashier" />

      <main className="flex-1 md:ml-60 transition-all duration-300">
        <div className="p-4 lg:p-6 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">Orders History</h1>
              <p className="text-muted-foreground">
                {filteredOrders.length} orders found
              </p>
            </div>
            <Button onClick={exportToCSV} className="gap-2">
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </div>

          {/* Filters */}
          <Card className="p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by Order#..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              <div className="flex flex-wrap gap-3">
                {/* Date Filter */}
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className="w-[140px]">
                    <Calendar className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Date Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">Last 7 days</SelectItem>
                    <SelectItem value="30">Last 30 days</SelectItem>
                    <SelectItem value="90">Last 90 days</SelectItem>
                    <SelectItem value="all">All time</SelectItem>
                  </SelectContent>
                </Select>

                {/* Status Filter */}
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="REFUNDED">Refunded</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  </SelectContent>
                </Select>

                {/* Payment Filter */}
                <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Payment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Payments</SelectItem>
                    <SelectItem value="CASH">Cash</SelectItem>
                    <SelectItem value="CARD">Card</SelectItem>
                    <SelectItem value="UPI">UPI</SelectItem>
                    <SelectItem value="WALLET">Wallet</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* Orders Table */}
          <Card>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order #</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead className="text-center">Items</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {isLoading ? (
                    Array.from({ length: 10 }).map((_, i) => (
                      <TableRow key={i}>
                        {Array.from({ length: 8 }).map((_, j) => (
                          <TableCell key={j}>
                            <Skeleton className="h-5 w-full" />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : paginatedOrders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-12">
                        <p className="text-muted-foreground">No orders found</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedOrders.map((order) => (
                      <TableRow
                        key={order.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <TableCell className="font-medium">
                          {order.orderNumber}
                        </TableCell>
                        <TableCell>
                          {format(parseISO(order.createdAt), "dd MMM, HH:mm")}
                        </TableCell>
                        <TableCell>
                          {order.customerId
                            ? `Customer #${order.customerId}`
                            : "Walk-in"}
                        </TableCell>
                        <TableCell className="text-center">
                          {order.items.length}
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          ₹{order.totalAmount.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <span className="flex items-center gap-1">
                            {getPaymentIcon(order.paymentMethod)}
                            {order.paymentMethod}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(order.status)}>
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between p-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </p>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((p) => Math.max(1, p - 1))
                    }
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </main>

      {/* Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between mb-6">
                <h3 className="text-xl font-bold">
                  {selectedOrder.orderNumber}
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedOrder(null)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Items */}
              <h4 className="font-semibold mb-3">Items</h4>
              <div className="space-y-2">
                {selectedOrder.items.map((item) => (
                  <div
                    key={item.productId}
                    className="flex justify-between text-sm"
                  >
                    <span>
                      {item.productName} × {item.quantity}
                    </span>
                    <span>₹{item.totalPrice.toLocaleString()}</span>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="border-t mt-4 pt-4 flex justify-between font-bold">
                <span>Total</span>
                <span>₹{selectedOrder.totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
