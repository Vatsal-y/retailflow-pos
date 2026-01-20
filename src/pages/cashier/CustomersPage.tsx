import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Plus, User, Phone, Mail, MapPin, Gift, ShoppingBag, Edit2, X, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { mockCustomers, mockOrders } from "@/data/mockData";
import { Customer } from "@/store/slices/customerSlice";
import { format, parseISO } from "date-fns";
import toast from "react-hot-toast";

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  const filteredCustomers = useMemo(() => {
    return mockCustomers.filter((customer) => {
      const matchesSearch = 
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.phone.includes(searchQuery) ||
        customer.email?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [searchQuery]);

  const customerOrders = useMemo(() => {
    if (!selectedCustomer) return [];
    return mockOrders
      .filter(order => order.customerId === selectedCustomer.id)
      .slice(0, 10);
  }, [selectedCustomer]);

  const getNextReward = (points: number) => {
    const rewards = [
      { points: 100, reward: "5% Off Coupon" },
      { points: 250, reward: "10% Off Coupon" },
      { points: 500, reward: "Free Item" },
      { points: 1000, reward: "₹500 Gift Card" },
    ];
    const nextReward = rewards.find(r => r.points > points);
    return nextReward || { points: points + 500, reward: "Premium Reward" };
  };

  const handleAddCustomer = () => {
    if (!newCustomer.name || !newCustomer.phone) {
      toast.error("Name and phone are required");
      return;
    }
    toast.success(`Customer "${newCustomer.name}" added successfully!`);
    setIsAddingNew(false);
    setNewCustomer({ name: "", phone: "", email: "", address: "" });
  };

  const handleSelectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    toast.success(`Selected ${customer.name} for current order`);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar role="cashier" />
      
      <main className="flex-1 md:ml-60 transition-all duration-300">
        <div className="flex flex-col lg:flex-row h-screen overflow-hidden">
          {/* Left: Customer List */}
          <div className="flex-1 p-4 lg:p-6 overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-bold">Customers</h1>
                <p className="text-muted-foreground">
                  {filteredCustomers.length} customers
                </p>
              </div>
              <Button onClick={() => setIsAddingNew(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Customer
              </Button>
            </div>

            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, phone, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Customer Table */}
            <Card className="flex-1 overflow-hidden">
              <div className="overflow-auto h-full">
                <Table>
                  <TableHeader className="sticky top-0 bg-card z-10">
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead className="text-center">Orders</TableHead>
                      <TableHead className="text-center">Points</TableHead>
                      <TableHead>Last Order</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      Array.from({ length: 8 }).map((_, i) => (
                        <TableRow key={i}>
                          {Array.from({ length: 6 }).map((_, j) => (
                            <TableCell key={j}>
                              <Skeleton className="h-5 w-full" />
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : filteredCustomers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-12">
                          <p className="text-muted-foreground">No customers found</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredCustomers.map((customer) => (
                        <TableRow
                          key={customer.id}
                          className={`cursor-pointer hover:bg-muted/50 ${
                            selectedCustomer?.id === customer.id ? "bg-primary/5" : ""
                          }`}
                          onClick={() => setSelectedCustomer(customer)}
                        >
                          <TableCell className="font-medium">{customer.name}</TableCell>
                          <TableCell>{customer.phone}</TableCell>
                          <TableCell className="text-center">{customer.totalOrders}</TableCell>
                          <TableCell className="text-center">
                            <Badge variant="secondary" className="gap-1">
                              <Gift className="h-3 w-3" />
                              {customer.loyaltyPoints}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {customer.lastOrderAt 
                              ? format(parseISO(customer.lastOrderAt), "dd MMM")
                              : "-"}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSelectCustomer(customer);
                              }}
                            >
                              Select
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </div>

          {/* Right: Customer Details */}
          <div className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l bg-card overflow-y-auto">
            {selectedCustomer ? (
              <div className="p-6 space-y-6">
                {/* Customer Info */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold">{selectedCustomer.name}</h2>
                      <p className="text-sm text-muted-foreground">ID: {selectedCustomer.id}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </div>

                {/* Contact Info */}
                <Card className="p-4 space-y-3">
                  <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                    Contact Info
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedCustomer.phone}</span>
                    </div>
                    {selectedCustomer.email && (
                      <div className="flex items-center gap-3 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedCustomer.email}</span>
                      </div>
                    )}
                    {selectedCustomer.address && (
                      <div className="flex items-center gap-3 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedCustomer.address}</span>
                      </div>
                    )}
                  </div>
                </Card>

                {/* Loyalty Points */}
                <Card className="p-4 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">Loyalty Points</h3>
                    <Gift className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-3xl font-bold text-primary mb-2">
                    {selectedCustomer.loyaltyPoints}
                  </p>
                  <div className="text-sm text-muted-foreground">
                    {(() => {
                      const next = getNextReward(selectedCustomer.loyaltyPoints);
                      const pointsNeeded = next.points - selectedCustomer.loyaltyPoints;
                      return (
                        <>
                          <p>Next reward: <span className="text-foreground font-medium">{next.reward}</span></p>
                          <p>{pointsNeeded} points to go</p>
                          <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary transition-all"
                              style={{ width: `${Math.min(100, (selectedCustomer.loyaltyPoints / next.points) * 100)}%` }}
                            />
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </Card>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <Card className="p-4 text-center">
                    <p className="text-2xl font-bold">{selectedCustomer.totalOrders}</p>
                    <p className="text-sm text-muted-foreground">Total Orders</p>
                  </Card>
                  <Card className="p-4 text-center">
                    <p className="text-2xl font-bold">₹{selectedCustomer.totalSpent.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Total Spent</p>
                  </Card>
                </div>

                {/* Recent Orders */}
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <ShoppingBag className="h-4 w-4" />
                    Recent Orders
                  </h3>
                  <div className="space-y-2">
                    {customerOrders.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No orders yet
                      </p>
                    ) : (
                      customerOrders.map((order) => (
                        <Card key={order.id} className="p-3 flex items-center justify-between">
                          <div>
                            <p className="font-medium text-sm">{order.orderNumber}</p>
                            <p className="text-xs text-muted-foreground">
                              {format(parseISO(order.createdAt), "dd MMM yyyy")}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">₹{order.total.toLocaleString()}</p>
                            <Badge variant={order.status === "paid" ? "success" : "secondary"} className="text-xs">
                              {order.status}
                            </Badge>
                          </div>
                        </Card>
                      ))
                    )}
                  </div>
                </div>

                {/* Action Button */}
                <Button 
                  className="w-full gap-2" 
                  variant="posSuccess"
                  onClick={() => handleSelectCustomer(selectedCustomer)}
                >
                  <User className="h-4 w-4" />
                  Select for Order
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                <User className="h-16 w-16 text-muted-foreground/30 mb-4" />
                <h3 className="font-semibold text-lg mb-2">Select a Customer</h3>
                <p className="text-sm text-muted-foreground">
                  Click on a customer from the list to view their details
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Add Customer Modal */}
      {isAddingNew && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-xl shadow-xl max-w-md w-full p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Add New Customer</h3>
              <Button variant="ghost" size="icon" onClick={() => setIsAddingNew(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  placeholder="Customer name"
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  placeholder="Phone number"
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Email address (optional)"
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  placeholder="Address (optional)"
                  value={newCustomer.address}
                  onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button variant="outline" className="flex-1" onClick={() => setIsAddingNew(false)}>
                Cancel
              </Button>
              <Button className="flex-1 gap-2" onClick={handleAddCustomer}>
                <Save className="h-4 w-4" />
                Add Customer
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
