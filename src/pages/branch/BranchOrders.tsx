import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockOrders } from "@/data/mockData";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  Tags,
  BarChart3,
  Settings,
  Eye,
  MoreHorizontal,
  Calendar,
} from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const sidebarItems = [
  { label: "Dashboard", href: "/branch", icon: LayoutDashboard },
  { label: "Orders", href: "/branch/orders", icon: ShoppingCart, badge: 12 },
  { label: "Inventory", href: "/branch/inventory", icon: Package, badge: 3 },
  { label: "Employees", href: "/branch/employees", icon: Users },
  { label: "Products", href: "/branch/products", icon: Tags },
  { label: "Reports", href: "/branch/reports", icon: BarChart3 },
  { label: "Settings", href: "/branch/settings", icon: Settings },
];

export default function BranchOrders() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [paymentFilter, setPaymentFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const filteredOrders = mockOrders.filter((order) => {
    if (statusFilter !== "all" && order.status !== statusFilter) return false;
    if (paymentFilter !== "all" && order.paymentMethod !== paymentFilter) return false;
    return true;
  });

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "orderNumber",
      header: "Order ID",
      cell: ({ row }) => (
        <span className="font-medium text-primary">{row.getValue("orderNumber")}</span>
      ),
    },
    {
      accessorKey: "customerName",
      header: "Customer",
    },
    {
      accessorKey: "items",
      header: "Items",
      cell: ({ row }) => {
        const items = row.getValue("items") as any[];
        return <Badge variant="secondary">{items.length} items</Badge>;
      },
    },
    {
      accessorKey: "total",
      header: "Amount",
      cell: ({ row }) => (
        <span className="font-semibold">₹{(row.getValue("total") as number).toLocaleString()}</span>
      ),
    },
    {
      accessorKey: "paymentMethod",
      header: "Payment",
      cell: ({ row }) => {
        const method = row.getValue("paymentMethod") as string;
        return <Badge variant="outline" className="capitalize">{method}</Badge>;
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
    },
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm">
          {format(new Date(row.getValue("createdAt")), "MMM dd, HH:mm")}
        </span>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setSelectedOrder(row.original)}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem>Print Receipt</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">Refund Order</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const exportToCSV = () => {
    const headers = ["Order ID", "Customer", "Items", "Amount", "Payment", "Status", "Date"];
    const csvContent = [
      headers.join(","),
      ...filteredOrders.map((order) =>
        [
          order.orderNumber,
          order.customerName,
          order.items.length,
          order.total,
          order.paymentMethod,
          order.status,
          order.createdAt,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
  };

  return (
    <DashboardLayout
      title="Orders"
      subtitle="Manage and track all branch orders"
      sidebarItems={sidebarItems}
      userRole="branch_manager"
      userName="Rahul Kumar"
      storeName="Downtown Mall"
    >
      <DataTable
        columns={columns}
        data={filteredOrders}
        searchPlaceholder="Search orders..."
        onExport={exportToCSV}
        filterComponent={
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
            <Select value={paymentFilter} onValueChange={setPaymentFilter}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Payment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="card">Card</SelectItem>
                <SelectItem value="upi">UPI</SelectItem>
                <SelectItem value="wallet">Wallet</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
      />

      {/* Order Details Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Order Details - {selectedOrder?.orderNumber}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Customer</p>
                  <p className="font-medium">{selectedOrder.customerName}</p>
                </div>
                <StatusBadge status={selectedOrder.status} />
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground mb-2">Items</p>
                <div className="space-y-2">
                  {selectedOrder.items.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span>{item.name} × {item.quantity}</span>
                      <span className="font-medium">₹{item.total.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
              <Separator />
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹{selectedOrder.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span>₹{selectedOrder.tax.toLocaleString()}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-sm text-success">
                    <span>Discount</span>
                    <span>-₹{selectedOrder.discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between font-semibold pt-2 border-t">
                  <span>Total</span>
                  <span>₹{selectedOrder.total.toLocaleString()}</span>
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <Button variant="outline" className="flex-1">Print Receipt</Button>
                <Button variant="destructive" className="flex-1">Refund</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
